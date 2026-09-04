/* Commonplace — build the art half of the data set.

   Reads the cached Wikidata pull, cleans it, decides what ships, and works out
   which wrong answers are worth offering. Writes app/data/art.json.

   Three things here are doing real work:

   1. The public-domain filter. Only works whose creator died more than seventy
      years ago are shipped, which is why Guernica, Nighthawks and the Warhols
      are not in the app. Wikidata's own image is not proof of anything, so the
      creator's death date is the test.

   2. Tiering. All three tiers are curated by cultural canonicity in
      curated/tiers.mjs. Sitelink count — the first attempt — measures what
      Wikipedia editors write about, which put Caravaggio's Judith and Dürer's
      self-portrait in "obscure" while promoting three minor Leonardo Madonnas.
      It survives only as the ordering for the unlisted remainder.

   3. Distractors. A wrong answer is only useful if you could plausibly have
      given it. Every work gets a ranked list of near neighbours: another canvas
      by the same hand first, then the same movement, then the same period.

   Run:  node build/build-art.mjs
*/
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TIER1, NOTES, REFS, CONFUSABLE, EXCLUDE } from './curated/paintings.mjs';
import { NOTES_MORE, REFS_MORE } from './curated/painting-notes.mjs';
import { TIER_1, TIER_2 } from './curated/tiers.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'sources', 'wikidata-paintings.json');

// 70 years after the author's death is the common term; 2026 - 70 = 1956, so a
// creator who died in 1955 or earlier is safe everywhere that rule applies.
const PD_DEATH_BEFORE = 1956;
/* Raised from 170 once the tiers were curated. Tiers 1 and 2 together are about
   160 works, so the old cap left the specialist tier with a dozen entries — the
   obscure end of the game had nothing in it. */
const SHIP_TARGET = 240;

const raw = JSON.parse(readFileSync(SRC, 'utf8'));

const year = (iso) => {
  if (!iso) return null;
  const neg = String(iso).startsWith('-');
  const n = parseInt(String(iso).replace(/^[-+]/, '').slice(0, 4), 10);
  return Number.isFinite(n) ? (neg ? -n : n) : null;
};
const key = (t, a) => `${(t || '').toLowerCase().trim()}|${(a || '').toLowerCase().trim()}`;
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// ── clean and dedupe ──────────────────────────────────────────────────────
/* One row per QID. The query returns a row per creator-nationality, so an
   artist with two passports duplicates every one of their paintings. */
/* Wikidata's label service falls back to another language when there is no
   English label, so a handful of movement and genre tags arrive in Russian.
   They would render in a fallback font and mean nothing to an English reader. */
const latinOnly = (list) => (list || []).filter((s) => !/[Ͱ-᳿Ⰰ-￿]/.test(s));

const byQid = new Map();
for (const r of raw.rows) {
  r.movements = latinOnly(r.movements);
  r.genres = latinOnly(r.genres);
  const prev = byQid.get(r.qid);
  if (prev) {
    if (r.nationality && !prev.nationalities.includes(r.nationality)) prev.nationalities.push(r.nationality);
    continue;
  }
  byQid.set(r.qid, { ...r, nationalities: r.nationality ? [r.nationality] : [] });
}

const reject = { noLabel: 0, blankCreator: 0, inCopyright: 0, noImage: 0, excluded: 0 };
const excluded = new Set(EXCLUDE.map(norm));

const clean = [...byQid.values()].filter((r) => {
  // The label service falls back to the QID when a work has no English label.
  if (!r.title || /^Q\d+$/.test(r.title)) { reject.noLabel++; return false; }
  // Some creators are blank nodes ("unknown painter" constructs) — no use here.
  /* An unresolved creator is worse than a missing one: it ships as a
     plausible-looking option and you get asked to choose between
     Bouguereau and "Q155626". */
  if (!r.creator || /^https?:/.test(r.creator) || /^Q\d+$/.test(r.creator)) {
    reject.blankCreator++; return false;
  }
  if (!r.image) { reject.noImage++; return false; }
  if (excluded.has(norm(r.title))) { reject.excluded++; return false; }
  const d = year(r.died);
  if (!(d && d < PD_DEATH_BEFORE)) { reject.inCopyright++; return false; }
  return true;
});

// ── tiering and selection ─────────────────────────────────────────────────
/* All three tiers are assigned by hand now — see curated/tiers.mjs for why
   sitelink count was the wrong instrument. A key is either a bare title or
   "Title|Artist" where the title alone is ambiguous in the data. */
function tierIndex(list) {
  const byTitle = new Map();
  const byBoth = new Map();
  for (const entry of list) {
    const [t, a] = entry.split('|');
    if (a) byBoth.set(key(t, a), entry);
    else byTitle.set(norm(t), entry);
  }
  return { byTitle, byBoth };
}
const T1 = tierIndex(TIER_1);
const T2 = tierIndex(TIER_2);
const hitTier = (idx, r) =>
  idx.byBoth.get(key(r.title, r.creator)) || idx.byTitle.get(norm(r.title)) || null;

const usedTierKeys = new Set();
const tierOf = (r) => {
  const one = hitTier(T1, r);
  if (one) { usedTierKeys.add(one); return 1; }
  const two = hitTier(T2, r);
  if (two) { usedTierKeys.add(two); return 2; }
  return 3;
};

const scored = clean.map((r) => ({ ...r, tier: tierOf(r) }));

// A curated key matching nothing shipped is a typo, and must be loud.
const missingTier1 = [...TIER_1, ...TIER_2]
  .filter((k) => !usedTierKeys.has(k))
  .map((k) => k.split('|'));

/* Ship every curated tier 1, then fill up to the target with the best-linked of
   the rest. A hard cap matters: these are photographs of paintings and the
   whole app has to fit on a phone. */
const ship = [
  ...scored.filter((r) => r.tier === 1),
  ...scored.filter((r) => r.tier === 2),
  ...scored.filter((r) => r.tier === 3).sort((a, b) => b.sitelinks - a.sitelinks),
].slice(0, SHIP_TARGET);

// ── distractors ───────────────────────────────────────────────────────────
const confusePairs = new Map();
for (const [a, b] of CONFUSABLE) {
  (confusePairs.get(norm(a)) || confusePairs.set(norm(a), []).get(norm(a))).push(norm(b));
  (confusePairs.get(norm(b)) || confusePairs.set(norm(b), []).get(norm(b))).push(norm(a));
}

/* How mistakable one work is for another. The weights are ordered by how the
   mistake actually happens: you confuse two paintings by the same artist far
   more often than two paintings of the same date. */
function similarity(a, b) {
  if (a.qid === b.qid) return -1;
  let s = 0;
  if (norm(a.creator) === norm(b.creator)) s += 6;
  else if ((confusePairs.get(norm(a.creator)) || []).includes(norm(b.creator))) s += 5;
  const shared = (x, y) => x.filter((v) => y.includes(v)).length;
  s += Math.min(shared(a.movements, b.movements), 2) * 3;
  s += Math.min(shared(a.genres, b.genres), 2) * 2;
  const ya = year(a.inception), yb = year(b.inception);
  if (ya && yb) {
    const gap = Math.abs(ya - yb);
    if (gap <= 15) s += 3; else if (gap <= 40) s += 2; else if (gap <= 80) s += 1;
  }
  if (a.nationalities.some((n) => b.nationalities.includes(n))) s += 1;
  return s;
}

const NEAR = 6;
for (const w of ship) {
  w.near = ship
    .map((o) => ({ qid: o.qid, s: similarity(w, o) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, NEAR)
    .map((x) => x.qid);
}

// ── artists ───────────────────────────────────────────────────────────────
const artists = new Map();
for (const w of ship) {
  const k = norm(w.creator);
  if (!artists.has(k)) {
    artists.set(k, {
      key: k, name: w.creator, qid: w.creatorQid,
      born: year(w.born), died: year(w.died),
      nationalities: w.nationalities.slice(),
      movements: [], works: 0,
    });
  }
  const a = artists.get(k);
  a.works++;
  w.movements.forEach((m) => { if (!a.movements.includes(m)) a.movements.push(m); });
}
for (const a of artists.values()) {
  a.confuse = (confusePairs.get(a.key) || []).filter((k) => artists.has(k));
}

// ── emit ──────────────────────────────────────────────────────────────────
// The second-pass notes are merged over the first so a title present in both
// resolves to the later, longer note rather than silently keeping the old one.
const ALL_NOTES = Object.assign({}, NOTES, NOTES_MORE);
const noteFor = (w) => ALL_NOTES[w.title] || ALL_NOTES[`${w.title}|${w.creator}`] || '';
const ALL_REFS = Object.assign({}, REFS, REFS_MORE);
const refFor = (w) => ALL_REFS[w.title] || ALL_REFS[`${w.title}|${w.creator}`] || null;

const items = ship.map((w) => ({
  id: w.qid,
  kind: 'art',
  title: w.title,
  artist: w.creator,
  artistKey: norm(w.creator),
  year: year(w.inception),
  type: w.type,
  movements: w.movements,
  genres: w.genres,
  collection: w.collection,
  tier: w.tier,
  fame: w.sitelinks,
  near: w.near,
  img: `${w.qid}.webp`,
  file: w.image,                    // the Commons filename, for fetch-images
  why: noteFor(w),
  ref: refFor(w),
  source: 'Wikidata / Wikimedia Commons',
}));

mkdirSync(join(ROOT, 'app', 'data'), { recursive: true });
writeFileSync(join(ROOT, 'app', 'data', 'art.json'), JSON.stringify({
  generated: new Date().toISOString(),
  source: {
    name: 'Wikidata + Wikimedia Commons',
    url: 'https://www.wikidata.org/',
    terms: 'Metadata CC0. Images are faithful reproductions of public-domain works.',
  },
  publicDomainRule: `creator died before ${PD_DEATH_BEFORE}`,
  artists: [...artists.values()],
  items,
}), 'utf8');

console.log('raw rows        :', raw.rows.length, '→ unique', byQid.size);
console.log('rejected        :', JSON.stringify(reject));
console.log('public domain   :', clean.length);
console.log('shipping        :', items.length,
  `(tier1 ${items.filter((i) => i.tier === 1).length}, tier2 ${items.filter((i) => i.tier === 2).length}, tier3 ${items.filter((i) => i.tier === 3).length})`);
console.log('artists         :', artists.size);
console.log('with a note     :', items.filter((i) => i.why).length,
  '| with a reference:', items.filter((i) => i.ref).length);
console.log('with a year     :', items.filter((i) => i.year).length);
if (missingTier1.length) {
  console.log('\nCURATED TIER KEYS MATCHING NOTHING SHIPPED — fix the title or artist:');
  missingTier1.forEach(([t, a]) => console.log(`   ! ${t} — ${a}`));
}
const orphanNotes = Object.keys(ALL_NOTES).filter((k) => !items.some((i) => i.title === k || `${i.title}|${i.artist}` === k));
if (orphanNotes.length) {
  console.log('\nNOTES that match nothing shipped:');
  orphanNotes.forEach((k) => console.log('   !', k));
}
