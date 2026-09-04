/* Pull the painting metadata for Commonplace from Wikidata, once, into
   sources/wikidata-paintings.json.

   Why Wikidata rather than a museum API: the Met and the Art Institute have
   excellent open data but only for what they own, and the canon is scattered
   across a hundred collections. Wikidata has all of it, and — the part that
   actually matters here — it has the *structured attributes* museums record
   inconsistently: movement, genre, creator nationality, creator dates. Those
   are what make a plausible wrong answer possible. A quiz whose distractors are
   random is not a quiz.

   Scope is set by sitelink count: an item linked from more than a dozen
   Wikipedias is a painting the world has actually heard of. That is a far
   better fame proxy for paintings than anything derivable from the museums, and
   it leaves a pool of roughly a thousand.

   Images come from Wikimedia Commons. Every work is additionally filtered on
   the creator's date of death, so nothing still in copyright is shipped —
   see build-art.mjs.

   Run:  node build/fetch-art.mjs          (add --force to re-query)
*/
import { mkdirSync, existsSync, writeFileSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'sources', 'wikidata-paintings.json');
const UA = 'Commonplace/1.0 (personal non-commercial study app; wjster@gmail.com)';

const MIN_SITELINKS = 12;

/* Restricting this to "painting" quietly loses a chunk of the actual canon:
   The Creation of Adam is a fresco, The Great Wave is a woodblock print, and
   The Scream, Sunflowers and the Water Lilies are filed as series rather than
   as any single canvas. All five belong in a game about visual references.

   Asking for all five types in one query is a 504 — the public endpoint has a
   sixty-second budget and the union blows it. One query per type stays well
   inside it, and the results merge on QID. */
const TYPES = [
  ['Q3305213', 'painting'],
  ['Q22669139', 'fresco'],
  ['Q18573970', 'group of paintings'],
  ['Q15727816', 'painting series'],
  ['Q28913685', 'woodblock print'],
];

const queryFor = (type) => `
SELECT ?item ?itemLabel ?sitelinks ?inception ?image
       ?creator ?creatorLabel ?born ?died ?nationalityLabel
       (GROUP_CONCAT(DISTINCT ?movementLabel; separator="|") AS ?movements)
       (GROUP_CONCAT(DISTINCT ?genreLabel;    separator="|") AS ?genres)
       (SAMPLE(?collectionLabel) AS ?collection)
WHERE {
  ?item wdt:P31 wd:${type} ;
        wdt:P170 ?creator ;
        wdt:P18 ?image ;
        wikibase:sitelinks ?sitelinks .
  FILTER(?sitelinks > ${MIN_SITELINKS})
  OPTIONAL { ?item wdt:P571 ?inception }
  OPTIONAL { ?item wdt:P135 ?movement .
             ?movement rdfs:label ?movementLabel . FILTER(LANG(?movementLabel)="en") }
  OPTIONAL { ?item wdt:P136 ?genre .
             ?genre rdfs:label ?genreLabel . FILTER(LANG(?genreLabel)="en") }
  OPTIONAL { ?item wdt:P195 ?collection .
             ?collection rdfs:label ?collectionLabel . FILTER(LANG(?collectionLabel)="en") }
  OPTIONAL { ?creator wdt:P569 ?born }
  OPTIONAL { ?creator wdt:P570 ?died }
  OPTIONAL { ?creator wdt:P27 ?nationality .
             ?nationality rdfs:label ?nationalityLabel . FILTER(LANG(?nationalityLabel)="en") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
}
GROUP BY ?item ?itemLabel ?sitelinks ?inception ?image
         ?creator ?creatorLabel ?born ?died ?nationalityLabel
`;

async function runQuery(sparql, attempt = 1) {
  const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql);
  const res = await fetch(url, {
    headers: { accept: 'application/sparql-results+json', 'user-agent': UA },
    signal: AbortSignal.timeout(180000),
  });
  // 429 and 504 are both "come back later" from this endpoint, not failures.
  if ((res.status === 429 || res.status === 504) && attempt < 3) {
    await new Promise((r) => setTimeout(r, attempt * 15000));
    return runQuery(sparql, attempt + 1);
  }
  if (!res.ok) throw new Error(`Wikidata returned HTTP ${res.status}`);
  return (await res.json()).results.bindings;
}

export async function fetchPaintings({ force = false } = {}) {
  if (!force && existsSync(OUT) && statSync(OUT).size > 10000) {
    return JSON.parse(readFileSync(OUT, 'utf8'));
  }
  const t0 = Date.now();
  const bindings = [];
  for (const [type, label] of TYPES) {
    const b = await runQuery(queryFor(type));
    b.forEach((x) => { x.__type = label; });
    bindings.push(...b);
    console.log(`   ${label.padEnd(20)} ${String(b.length).padStart(5)} rows`);
  }

  const rows = bindings.map((b) => ({
    type: b.__type,
    qid: b.item.value.replace(/.*\//, ''),
    title: b.itemLabel?.value || null,
    sitelinks: +(b.sitelinks?.value || 0),
    inception: b.inception?.value || null,
    image: decodeURIComponent((b.image?.value || '').replace(/.*Special:FilePath\//, '')),
    creatorQid: b.creator.value.replace(/.*\//, ''),
    creator: b.creatorLabel?.value || null,
    born: b.born?.value || null,
    died: b.died?.value || null,
    nationality: b.nationalityLabel?.value || null,
    movements: (b.movements?.value || '').split('|').filter(Boolean),
    genres: (b.genres?.value || '').split('|').filter(Boolean),
    collection: b.collection?.value || null,
  }));

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify({
    generated: new Date().toISOString(),
    source: 'Wikidata Query Service',
    minSitelinks: MIN_SITELINKS,
    rows,
  }, null, 0), 'utf8');
  console.log(`fetched ${rows.length} paintings in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  return { rows };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { rows } = await fetchPaintings({ force: process.argv.includes('--force') });
  const withMovement = rows.filter((r) => r.movements.length).length;
  const withDeath = rows.filter((r) => r.died).length;
  const byBand = { '100+': 0, '40-99': 0, '20-39': 0, '13-19': 0 };
  rows.forEach((r) => {
    if (r.sitelinks >= 100) byBand['100+']++;
    else if (r.sitelinks >= 40) byBand['40-99']++;
    else if (r.sitelinks >= 20) byBand['20-39']++;
    else byBand['13-19']++;
  });
  console.log('rows            :', rows.length);
  console.log('with a movement :', withMovement);
  console.log('creator died    :', withDeath, '(the public-domain test)');
  console.log('by fame band    :', JSON.stringify(byBand));
  console.log('\nmost linked:');
  rows.slice().sort((a, b) => b.sitelinks - a.sitelinks).slice(0, 12)
    .forEach((r) => console.log(`   ${String(r.sitelinks).padStart(3)}  ${r.title} — ${r.creator}`));
}
