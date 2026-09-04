/* Download the Folger Shakespeare plain-text editions into sources/folger/.

   Cached: an existing, verified file is never re-fetched, so every later build
   works offline and parses the exact same bytes.

   Folger Digital Texts are free for all non-commercial use
   (https://www.folger.edu/explore/shakespeares-works/download/). Commonplace is
   personal and non-commercial, and cites the Folger edition on every quotation.

   Two traps this file exists to avoid, both found the hard way:

   1. shakespeare.folger.edu/downloads/txt/<slug>.txt resolves by PREFIX. Ask
      for richard-iii and you are quietly redirected to Richard II; ask for
      henry-viii and you get Henry V. Status 200, real Folger text, wrong play.
      So we skip the resolver and fetch the S3 objects it redirects to.
   2. A miss can still return an HTML error page that happens to contain the
      words "Folger Shakespeare Library". Checking for those words is therefore
      no check at all.

   The only reliable test is: does the first line of the file name the play we
   asked for? Everything is verified that way, on fetch and on reuse.
*/
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'sources', 'folger');
const BASE = 'https://folger-main-site-assets.s3.amazonaws.com/uploads/2022/11';
const UA = 'Commonplace/1.0 (personal non-commercial study app)';

// slug, display title, genre. The title is also the verification key.
export const WORKS = [
  ['hamlet', 'Hamlet', 'tragedy'],
  ['macbeth', 'Macbeth', 'tragedy'],
  ['king-lear', 'King Lear', 'tragedy'],
  ['othello', 'Othello', 'tragedy'],
  ['romeo-and-juliet', 'Romeo and Juliet', 'tragedy'],
  ['julius-caesar', 'Julius Caesar', 'tragedy'],
  ['antony-and-cleopatra', 'Antony and Cleopatra', 'tragedy'],
  ['coriolanus', 'Coriolanus', 'tragedy'],
  ['titus-andronicus', 'Titus Andronicus', 'tragedy'],
  ['timon-of-athens', 'Timon of Athens', 'tragedy'],
  ['troilus-and-cressida', 'Troilus and Cressida', 'tragedy'],

  ['a-midsummer-nights-dream', "A Midsummer Night's Dream", 'comedy'],
  ['twelfth-night', 'Twelfth Night', 'comedy'],
  ['as-you-like-it', 'As You Like It', 'comedy'],
  ['much-ado-about-nothing', 'Much Ado About Nothing', 'comedy'],
  ['the-merchant-of-venice', 'The Merchant of Venice', 'comedy'],
  ['the-taming-of-the-shrew', 'The Taming of the Shrew', 'comedy'],
  ['the-comedy-of-errors', 'The Comedy of Errors', 'comedy'],
  ['loves-labors-lost', "Love's Labor's Lost", 'comedy'],
  ['measure-for-measure', 'Measure for Measure', 'comedy'],
  ['alls-well-that-ends-well', "All's Well That Ends Well", 'comedy'],
  ['the-two-gentlemen-of-verona', 'The Two Gentlemen of Verona', 'comedy'],
  ['the-merry-wives-of-windsor', 'The Merry Wives of Windsor', 'comedy'],

  ['the-tempest', 'The Tempest', 'romance'],
  ['the-winters-tale', "The Winter's Tale", 'romance'],
  ['cymbeline', 'Cymbeline', 'romance'],
  ['pericles', 'Pericles', 'romance'],

  ['henry-v', 'Henry V', 'history'],
  ['henry-iv-part-1', 'Henry IV, Part 1', 'history'],
  ['henry-iv-part-2', 'Henry IV, Part 2', 'history'],
  ['richard-ii', 'Richard II', 'history'],
  ['richard-iii', 'Richard III', 'history'],
  ['king-john', 'King John', 'history'],
  ['henry-vi-part-1', 'Henry VI, Part 1', 'history'],
  ['henry-vi-part-2', 'Henry VI, Part 2', 'history'],
  ['henry-vi-part-3', 'Henry VI, Part 3', 'history'],
  ['henry-viii', 'Henry VIII', 'history'],

  ['shakespeares-sonnets', 'Sonnets', 'poem'],
];

/* Compare titles by meaning, not spelling. Folger is inconsistent about
   "Part I" vs "Part 2" and prints "Pericles, Prince of Tyre" for the play it
   files under "pericles", so the check maps roman numerals to digits and
   accepts a fetched title that merely begins with the expected one. */
const ROMAN = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10 };
function titleKey(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').trim().split(/\s+/)
    .map((w) => (ROMAN[w] ? String(ROMAN[w]) : w)).join(' ');
}
function titleMatches(expected, firstLine) {
  const a = titleKey(expected), b = titleKey(firstLine || '');
  return b === a || b.startsWith(a + ' ');
}

async function grab(slug, title) {
  const file = join(OUT, `${slug}.txt`);
  if (existsSync(file)) {
    const head = readFileSync(file, 'utf8').split(/\r?\n/, 1)[0];
    if (titleMatches(title, head)) return { slug, cached: true };
  }
  const res = await fetch(`${BASE}/${slug}_TXT_FolgerShakespeare.txt`, {
    headers: { 'user-agent': UA },
  });
  if (!res.ok) return { slug, error: `HTTP ${res.status}` };
  const txt = await res.text();
  const head = txt.split(/\r?\n/, 1)[0];
  if (!titleMatches(title, head)) return { slug, error: `served "${head.slice(0, 60)}"` };
  if (txt.length < 5000) return { slug, error: `only ${txt.length} bytes` };
  writeFileSync(file, txt, 'utf8');
  return { slug, bytes: txt.length };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  mkdirSync(OUT, { recursive: true });
  let got = 0, cached = 0;
  const bad = [];
  for (const [slug, title] of WORKS) {
    const r = await grab(slug, title);
    if (r.error) { bad.push(`${slug}  ${r.error}`); process.stdout.write('x'); }
    else if (r.cached) { cached++; process.stdout.write('.'); }
    else { got++; process.stdout.write('+'); }
  }
  console.log(`\nfetched ${got}, already verified ${cached}, failed ${bad.length}`);
  bad.forEach((b) => console.log('   !', b));
  if (bad.length) process.exitCode = 1;
}
