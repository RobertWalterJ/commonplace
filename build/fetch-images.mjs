/* Download one image per shipped work from Wikimedia Commons into
   sources/img-cache/, then hand the folder to encode_images.py to be turned
   into the WebP files the app actually serves.

   Cached by QID: re-running costs nothing and works offline. Commons resizes
   server-side, so we ask for 1400px and do no scaling here — but note that it
   rounds to standard thumbnail buckets, so 700 and 900 come back as the same
   bytes. 1400 is asked for because the zoom mode crops into these.

   Be polite: Commons wants a real user agent and does not want a flood.

   Run:  node build/fetch-images.mjs
*/
import { mkdirSync, existsSync, writeFileSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, 'sources', 'img-cache');
const UA = 'Commonplace/1.0 (personal non-commercial study app; wjster@gmail.com)';
const WIDTH = 1400;
const GAP_MS = 120;

const art = JSON.parse(readFileSync(join(ROOT, 'app', 'data', 'art.json'), 'utf8'));
mkdirSync(CACHE, { recursive: true });

const extOf = (f) => {
  const m = /\.([a-z0-9]+)$/i.exec(f || '');
  return m ? m[1].toLowerCase() : 'jpg';
};

let got = 0, cached = 0, bytes = 0;
const failed = [];

for (const item of art.items) {
  const ext = extOf(item.file);
  const dest = join(CACHE, `${item.id}.${ext}`);
  if (existsSync(dest) && statSync(dest).size > 8000) {
    cached++; bytes += statSync(dest).size; process.stdout.write('.');
    continue;
  }
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(item.file)}?width=${WIDTH}`;
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(90000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    // A Commons miss returns an HTML page, which would then fail to decode in
    // a way that is much harder to read than failing here.
    if (buf.length < 8000 || buf.slice(0, 14).toString('latin1').includes('<!DOCTYPE')) {
      throw new Error(`not an image (${buf.length} bytes)`);
    }
    writeFileSync(dest, buf);
    got++; bytes += buf.length; process.stdout.write('+');
  } catch (e) {
    failed.push(`${item.title} — ${item.file}: ${e.message}`);
    process.stdout.write('x');
  }
  await new Promise((r) => setTimeout(r, GAP_MS));
}

console.log(`\ndownloaded ${got}, cached ${cached}, failed ${failed.length}`);
console.log(`source images: ${(bytes / 1024 / 1024).toFixed(1)}MB in sources/img-cache`);
failed.forEach((f) => console.log('   !', f));
if (failed.length) process.exitCode = 1;
