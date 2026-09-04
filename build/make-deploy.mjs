/* Commonplace — assemble the deployable site from app/.

   Writes docs/, which is what GitHub Pages serves (Settings → Pages → branch,
   /docs). Everything in app/ goes, images included; there is nothing in there
   that is not needed at runtime.

   Two checks run before anything is written, because both of these failures are
   silent in production and miserable to diagnose from a phone:

   * Every path in the service worker's precache list must exist. One 404 in
     that list rejects the whole install event, and the app then quietly has no
     offline support at all — with no error anywhere the user can see.
   * app.js must still contain the build placeholder, or the deployed copy will
     report the wrong version in Settings.

   Run:  node build/make-deploy.mjs
*/
import {
  mkdirSync, rmSync, readdirSync, statSync, readFileSync, writeFileSync, copyFileSync,
} from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildStamp } from './stamp.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, 'app');
const OUT = join(ROOT, 'docs');

// ── verify the precache list ──────────────────────────────────────────────
const sw = readFileSync(join(APP, 'sw.js'), 'utf8');
const listed = [...sw.matchAll(/^\s*'([^']+)',\s*$/gm)]
  .map((m) => m[1])
  .filter((p) => p !== '.' && !p.startsWith('commonplace-'));
const missing = listed.filter((p) => {
  try { return !statSync(join(APP, p)).isFile(); } catch { return true; }
});
if (missing.length) {
  console.error('These files are precached by sw.js but do not exist:');
  missing.forEach((m) => console.error('   !', m));
  console.error('\nA single missing entry rejects the service worker install and');
  console.error('kills offline support silently. Fix sw.js or add the file.');
  process.exit(1);
}

// ── copy ──────────────────────────────────────────────────────────────────
function walk(dir, into) {
  mkdirSync(into, { recursive: true });
  let files = 0, bytes = 0;
  for (const name of readdirSync(dir)) {
    const from = join(dir, name);
    const to = join(into, name);
    const st = statSync(from);
    if (st.isDirectory()) {
      const r = walk(from, to);
      files += r.files; bytes += r.bytes;
    } else {
      copyFileSync(from, to);
      files++; bytes += st.size;
    }
  }
  return { files, bytes };
}

rmSync(OUT, { recursive: true, force: true });
const { files, bytes } = walk(APP, OUT);

// ── stamp ─────────────────────────────────────────────────────────────────
/* The copy is stamped, never the source in app/. Running locally should keep
   reporting "dev" rather than claiming to be whatever was last deployed. */
const STAMP = buildStamp();
const jsPath = join(OUT, 'app.js');
const js = readFileSync(jsPath, 'utf8');
if (!js.includes('__BUILD__')) {
  console.error('build placeholder missing from app.js');
  process.exit(1);
}
writeFileSync(jsPath, js.replace("'__BUILD__'", JSON.stringify(STAMP)));

/* GitHub Pages runs Jekyll unless told not to, and Jekyll ignores files and
   folders beginning with an underscore. Nothing here starts with one today,
   but the cost of being wrong later is a 404 on a file that is plainly there. */
writeFileSync(join(OUT, '.nojekyll'), '');

const imgs = readdirSync(join(OUT, 'img')).length;
console.log('build stamp :', STAMP);
console.log('precache    :', listed.length, 'files, all present');
console.log('written     :', relative(ROOT, OUT), `— ${files} files, ${imgs} paintings`);
console.log('size        :', (bytes / 1024 / 1024).toFixed(1) + 'MB');
