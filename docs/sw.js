/* Commonplace service worker.

   Two strategies, because two kinds of thing are being cached:

   * The shell and the data — network-first with a cache fallback, precached at
     install. Cache-first would pin whatever landed the first time and you would
     keep running old code until the cache name changed. Network-first means the
     app is current whenever the network is, and complete when it is not.

   * The paintings — cache-first, and NOT precached. There are 170 of them and
     they come to 27MB. Precaching that would make the first open feel broken,
     and a single 404 in a precache list rejects the whole install and kills
     offline silently. So images are cached as you meet them: play a round and
     those paintings are yours offline. A file named after a Wikidata QID never
     changes, so cache-first is safe for them in a way it is not for app.js.

   ── Two rules here that exist because of a real origin collision ──

   CacheStorage is per ORIGIN, not per app. On GitHub Pages every one of these
   little apps lives under the same robertwalterj.github.io, so Commonplace,
   Halyard and anything else share one cache store. That has two consequences,
   and getting either wrong breaks the other apps:

   1. Never call the global caches.match(). It searches EVERY cache on the
      origin, including other apps'. During development this served a stale
      index.html belonging to an unrelated app that had once used the same
      localhost port, and the symptom was data/art.json arriving as HTML.
      Every lookup below names the cache it means.

   2. Never delete a cache just because it is not ours. The obvious activate
      handler — drop everything except the current names — would have wiped
      Halyard's offline cache the first time Commonplace was opened. Only
      caches carrying this app's own prefix are cleaned up.
*/
const PREFIX = 'commonplace-';
const CACHE = `${PREFIX}shell-v1`;
const IMAGES = `${PREFIX}img-v1`;

const SHELL = [
  '.',
  'index.html',
  'styles.css',
  'app.js',
  'manifest.webmanifest',
  'data/art.json',
  'data/text.json',
  'data/lqip.json',
  'fonts/garamond-400-latin.woff2',
  'fonts/garamond-italic-400-latin.woff2',
  'fonts/instrument-latin.woff2',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => k.startsWith(PREFIX) && k !== CACHE && k !== IMAGES)
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Scoped lookup: this app's caches only, never the whole origin.
async function fromCache(name, req, opts) {
  const c = await caches.open(name);
  return c.match(req, opts);
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.includes('/img/')) {
    e.respondWith((async () => {
      const hit = await fromCache(IMAGES, req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(IMAGES).then((c) => c.put(req, copy));
      }
      return res;
    })());
    return;
  }

  e.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    } catch (err) {
      const hit = await fromCache(CACHE, req, { ignoreSearch: true });
      if (hit) return hit;
      /* Only a navigation may fall back to the shell. Handing index.html to a
         failed fetch for data/art.json turns a clear network error into a JSON
         parse error thirty lines away, which is exactly how the origin
         collision above stayed hidden for as long as it did. */
      if (req.mode === 'navigate') {
        const shell = await fromCache(CACHE, 'index.html');
        if (shell) return shell;
      }
      throw err;
    }
  })());
});
