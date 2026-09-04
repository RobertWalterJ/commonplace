/* Commonplace — assemble the single-file build for publishing as an Artifact.

   Output: dist/commonplace-artifact.html

   An Artifact is one HTML file, capped at 16MB rendered, served under a policy
   that blocks every external request. So everything has to be inside the file:
   the data, the fonts, and the paintings as data URIs. There is no server and
   no service worker.

   The file is deliberately NOT a complete document. The publisher wraps it in
   its own doctype/head/body, so what is written here is a <title>, a <style>,
   the markup and the script — nothing else. Emitting <html> or <body> here
   produces a page nested inside a page.

   Run:  python build/make_artifact_images.py     (first, to build the images)
         node build/bundle-artifact.mjs
*/
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildStamp } from './stamp.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, 'app');
const IMAGES = join(ROOT, 'build', '.cache', 'artifact-images.json');
const OUT = join(ROOT, 'dist', 'commonplace-artifact.html');

const LIMIT = 16 * 1024 * 1024;

if (!existsSync(IMAGES)) {
  console.error('Missing build/.cache/artifact-images.json');
  console.error('Run:  python build/make_artifact_images.py');
  process.exit(1);
}

// ── data ──────────────────────────────────────────────────────────────────
const art = JSON.parse(readFileSync(join(APP, 'data', 'art.json'), 'utf8'));
const text = JSON.parse(readFileSync(join(APP, 'data', 'text.json'), 'utf8'));
const lqip = JSON.parse(readFileSync(join(APP, 'data', 'lqip.json'), 'utf8'));
const img = JSON.parse(readFileSync(IMAGES, 'utf8'));

/* Only ship the works whose pictures made it in. A painting with no image would
   render as an empty plate and be unanswerable, so the item list, the artist
   list and every precomputed near-neighbour are filtered to match. */
const keep = new Set(Object.keys(img));
art.items = art.items.filter((i) => keep.has(i.id));
art.items.forEach((i) => { i.near = i.near.filter((q) => keep.has(q)); });
const artistsUsed = new Set(art.items.map((i) => i.artistKey));
art.artists = art.artists.filter((a) => artistsUsed.has(a.key));
art.artists.forEach((a) => { a.confuse = a.confuse.filter((k) => artistsUsed.has(k)); });
const lqipKept = {};
for (const i of [...art.items]) if (lqip[i.id]) lqipKept[i.id] = lqip[i.id];

const payload = JSON.stringify({ art, text, lqip: lqipKept, img });

// ── styles, with the fonts inlined ────────────────────────────────────────
let css = readFileSync(join(APP, 'styles.css'), 'utf8');
/* Inline whatever the stylesheet actually references, rather than a list kept
   in step by hand — and accept url(x), url('x') and url("x"), since which one
   the CSS uses is not something this script should care about. */
const referenced = [...css.matchAll(/url\(\s*['"]?fonts\/([^'")]+)['"]?\s*\)/g)]
  .map((m) => m[1]);
for (const f of [...new Set(referenced)]) {
  const b64 = readFileSync(join(APP, 'fonts', f)).toString('base64');
  const inlined = `url(data:font/woff2;base64,${b64})`;
  // Plain string swaps rather than a built regex: the filename would otherwise
  // have to be escaped into a pattern, and there are only three forms to cover.
  for (const form of [`url(fonts/${f})`, `url('fonts/${f}')`, `url("fonts/${f}")`]) {
    css = css.split(form).join(inlined);
  }
}
if (css.includes('fonts/')) {
  console.error('A font reference was left un-inlined — it would silently fail to load.');
  process.exit(1);
}

// ── markup ────────────────────────────────────────────────────────────────
/* Take the body of index.html: everything between <body> and </body>, minus the
   script tag, which is replaced by the inlined payload plus the app itself. */
const html = readFileSync(join(APP, 'index.html'), 'utf8');
const body = html
  .slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>'))
  .replace(/<script src="app\.js"><\/script>/, '')
  .trim();

let js = readFileSync(join(APP, 'app.js'), 'utf8');
if (!js.includes('__BUILD__')) {
  console.error('build placeholder missing from app.js');
  process.exit(1);
}
js = js.replace("'__BUILD__'", JSON.stringify(buildStamp()));

/* The payload goes in a script of a type the browser will not execute, so the
   JSON is never parsed as JavaScript. "</script>" inside a string would still
   close the tag early, so the sequence is escaped. */
const safePayload = payload.replace(/<\/script/gi, '<\\/script');

const doc = `<title>Commonplace</title>
<style>
${css}
</style>

${body}

<script id="cp-payload" type="application/json">${safePayload}</script>
<script>
${js}
</script>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, doc, 'utf8');

const size = statSync(OUT).size;
console.log('paintings   :', art.items.length, `(tiers ${[...new Set(art.items.map((i) => i.tier))].sort().join(', ')})`);
console.log('artists     :', art.artists.length);
console.log('lines       :', text.items.length);
console.log('written     :', OUT.replace(ROOT + '\\', ''));
console.log('size        :', (size / 1048576).toFixed(1) + 'MB of the 16MB limit');
if (size > LIMIT) {
  console.error('\nOVER THE LIMIT — re-run make_artifact_images.py with tier 1 only.');
  process.exit(1);
}
console.log('headroom    :', ((LIMIT - size) / 1048576).toFixed(1) + 'MB');
