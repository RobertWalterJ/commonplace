/* Commonplace — build the Shakespeare half of the data set.

   Reads the cached Folger plain-text editions in sources/folger/, parses them
   into speeches, then locates every curated fragment inside the real text and
   emits the verbatim lines with their act, scene and speaker.

   The rule the whole app rests on: this script never writes a quotation. It
   only finds one. A fragment that cannot be located is reported and dropped,
   so a misremembered line fails the build instead of shipping as fact.

   Run:  node build/build-text.mjs
*/
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORKS } from './fetch-shakespeare.mjs';
import { LINES, SONNETS } from './curated/shakespeare-lines.mjs';
import { LINES_MORE, REF_PATCH } from './curated/shakespeare-lines-2.mjs';
import { locate as locateIn } from './locate.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'sources', 'folger');

/* Accepted approximate composition dates, for Chronology mode. Shakespeare
   dating is scholarly estimate, not record, so every one is flagged approx and
   the app prints "c." in front of it. */
const YEARS = {
  'the-comedy-of-errors': 1594, 'the-taming-of-the-shrew': 1592,
  'the-two-gentlemen-of-verona': 1591, 'loves-labors-lost': 1595,
  'richard-iii': 1592, 'richard-ii': 1595, 'king-john': 1596,
  'romeo-and-juliet': 1595, 'a-midsummer-nights-dream': 1595,
  'the-merchant-of-venice': 1596, 'henry-iv-part-1': 1596,
  'henry-iv-part-2': 1598, 'much-ado-about-nothing': 1598,
  'henry-v': 1599, 'julius-caesar': 1599, 'as-you-like-it': 1599,
  'twelfth-night': 1601, 'hamlet': 1600, 'the-merry-wives-of-windsor': 1597,
  'troilus-and-cressida': 1602, 'alls-well-that-ends-well': 1605,
  'measure-for-measure': 1604, 'othello': 1603, 'king-lear': 1605,
  'macbeth': 1606, 'antony-and-cleopatra': 1606, 'coriolanus': 1608,
  'timon-of-athens': 1606, 'titus-andronicus': 1592, 'pericles': 1608,
  'cymbeline': 1610, 'the-winters-tale': 1610, 'the-tempest': 1611,
  'henry-viii': 1613, 'henry-vi-part-1': 1591, 'henry-vi-part-2': 1591,
  'henry-vi-part-3': 1591, 'shakespeares-sonnets': 1609,
};

const META = new Map(WORKS.map(([slug, title, genre]) => [slug, { slug, title, genre }]));

// ── normalisation ─────────────────────────────────────────────────────────
/* Lower-cased, apostrophes closed up ("play's" -> "plays", "th'" -> "th"),
   every other run of non-alphanumerics collapsed to one space. The map lets a
   hit in the normalised string be traced back to a character offset in the
   original, which is how the verbatim lines get recovered. */
export function normalizeWithMap(s) {
  const out = [];
  const map = [];
  let atSpace = true;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "'" || ch === '’') continue;
    const low = ch.toLowerCase();
    if (low >= 'a' && low <= 'z') { out.push(low); map.push(i); atSpace = false; }
    else if (low >= '0' && low <= '9') { out.push(low); map.push(i); atSpace = false; }
    else if (!atSpace) { out.push(' '); map.push(i); atSpace = true; }
  }
  while (out.length && out[out.length - 1] === ' ') { out.pop(); map.pop(); }
  return { norm: out.join(''), map };
}
const normalize = (s) => normalizeWithMap(s).norm;

// ── parser ────────────────────────────────────────────────────────────────
/* Folger plain text is regular enough to parse without a library:

     ACT 1                     act heading, underlined with =====
     Scene 2                   scene heading, likewise
     [Enter Hamlet.]           stage direction, may wrap over several lines
     HAMLET                    speech prefix on its own line
     To be or not to be...     the speech
     BARNARDO  Who's there?    short speeches put the prefix inline, two spaces
     I am gone forever!\t[He exits, pursued by a bear.]   trailing direction

   A speech prefix is distinguishable because it carries no lower-case letters.
   Nothing else in the body of a Folger text is set that way. */
const SPEAKER_RE = /^([A-Z][A-Z0-9 .,'’-]*?)(?:\s{2,}(.+))?$/;
const hasLower = (s) => /[a-z]/.test(s);

export function parsePlay(slug, raw) {
  const lines = raw.split(/\r?\n/);
  const speeches = [];
  let act = 0, scene = 0;
  let cur = null;
  let pendingStage = null;

  const flush = () => { if (cur && cur.lines.length) speeches.push(cur); cur = null; };
  const pushStage = (text) => {
    speeches.push({ act, scene, speaker: null, stage: true, lines: [text] });
  };

  let started = false;
  for (let i = 0; i < lines.length; i++) {
    let ln = lines[i];

    /* Everything before the first act heading is front matter — except that
       Romeo and Juliet's Prologue, and the inductions and choruses elsewhere,
       sit ahead of Act 1 and contain some of the best-known lines in the play
       ("A pair of star-crossed lovers"). Those headings start the parse too,
       and are filed as act 0. */
    if (!started) {
      if (/^ACT \d+\s*$/.test(ln)) started = true;
      else if (/^(THE PROLOGUE|PROLOGUE|INDUCTION)\s*$/.test(ln)) { started = true; act = 0; scene = 0; continue; }
      else continue;
    }

    if (/^=+\s*$/.test(ln)) continue;                       // heading underline

    if (pendingStage !== null) {                            // wrapped direction
      const close = ln.indexOf(']');
      if (close < 0) { pendingStage += ' ' + ln.trim(); continue; }
      pushStage((pendingStage + ' ' + ln.slice(0, close + 1).trim()).trim());
      pendingStage = null;
      ln = ln.slice(close + 1);                             // dialogue may follow
      if (!ln.trim()) continue;
    }

    const m = /^ACT (\d+)\s*$/.exec(ln);
    if (m) { flush(); act = +m[1]; scene = 0; continue; }
    const s = /^Scene (\d+)\s*$/.exec(ln);
    if (s) { flush(); scene = +s[1]; continue; }

    if (!ln.trim()) { continue; }                           // blanks are layout

    // A trailing stage direction after a tab belongs to neither the line nor
    // the next speech; peel it off and keep both.
    let trailing = null;
    const tab = ln.indexOf('\t');
    if (tab >= 0) {
      const rest = ln.slice(tab + 1).trim();
      if (rest.startsWith('[')) { trailing = rest; ln = ln.slice(0, tab); }
      else ln = ln.replace(/\t/g, ' ');
    }

    let body = ln.trim();

    /* A direction that opens and never closes on this line is a wrapped one.
       Anything else bracketed is inline and gets lifted out wherever it sits —
       "[Sings.] O, a pit of clay" opens a speech, and "HAMLET, [taking the
       skull]  Let me see" hides a speech prefix behind one. Treating a leading
       "[" as a whole-line direction swallowed the rest of the scene, which is
       how "Alas, poor Yorick" went missing: the quotation ended up split
       across a stage direction and the speech after it. */
    if (body.startsWith('[') && !body.includes(']')) {
      flush();
      pendingStage = body;
      if (trailing) pushStage(trailing);
      continue;
    }

    const inline = body.match(/\[[^\]]*\]/g);
    if (inline) {
      const stripped = body.replace(/\[[^\]]*\]/g, ' ').replace(/\s{3,}/g, '  ').trim();
      if (!stripped) {                       // the line was only a direction
        flush();
        inline.forEach(pushStage);
        if (trailing) pushStage(trailing);
        continue;
      }
      // Inline within a speech: keep the direction, keep reading the dialogue.
      inline.forEach((d) => { if (cur) cur.stageInline = true; });
      body = stripped;
    }

    const sp = SPEAKER_RE.exec(body);
    if (sp && !hasLower(sp[1]) && sp[1].trim().length > 1) {
      flush();
      cur = { act, scene, speaker: sp[1].trim().replace(/[.,]$/, ''), stage: false, lines: [] };
      if (sp[2]) cur.lines.push(sp[2].trim());
      if (trailing) { flush(); pushStage(trailing); }
      continue;
    }

    if (!cur) cur = { act, scene, speaker: null, stage: false, lines: [] };
    cur.lines.push(body);
    if (trailing) { flush(); pushStage(trailing); }
  }
  flush();
  return speeches;
}

/* The sonnets file is a different shape: a bare number on its own line, then
   fourteen lines, the closing couplet indented. */
function parseSonnets(raw) {
  const lines = raw.split(/\r?\n/);
  const out = new Map();
  let n = null, buf = [];
  const close = () => { if (n !== null && buf.length) out.set(n, buf.slice()); n = null; buf = []; };
  let started = false;
  for (const ln of lines) {
    const m = /^\s*(\d{1,3})\s*$/.exec(ln);
    if (m) { close(); n = +m[1]; started = true; continue; }
    if (!started || n === null) continue;
    if (!ln.trim()) continue;
    buf.push(ln.trim());
  }
  close();
  return out;
}

// ── locating a fragment ───────────────────────────────────────────────────
// Lives in build/locate.mjs — see the note there on why the unit is the
// sentence and not the printed line.
const locate = (speech, fragment) => locateIn(speech, fragment, normalizeWithMap);

// ── build ─────────────────────────────────────────────────────────────────
const plays = new Map();
for (const [slug] of WORKS) {
  if (slug === 'shakespeares-sonnets') continue;
  let raw;
  try { raw = readFileSync(join(SRC, `${slug}.txt`), 'utf8'); } catch { continue; }
  if (slug === 'venus-and-adonis' || slug === 'the-rape-of-lucrece') continue;
  plays.set(slug, parsePlay(slug, raw));
}
const sonnetText = parseSonnets(readFileSync(join(SRC, 'shakespeares-sonnets.txt'), 'utf8'));

const items = [];
const missing = [];
let seq = 0;
const nextId = (p) => `${p}-${String(++seq).padStart(3, '0')}`;

/* The second pass appends new lines and attaches derivatives to lines the
   first pass already found, keyed by the same fragment. */
const ALL_LINES = [...LINES, ...LINES_MORE];
for (const entry of ALL_LINES) {
  if (entry.skipIfDuplicate) continue;
  const speeches = plays.get(entry.work);
  if (!speeches) { missing.push(`${entry.work}: text not parsed`); continue; }
  const frag = normalize(entry.f);
  let hit = null, host = null;
  for (const sp of speeches) {
    if (!!entry.stage !== !!sp.stage) continue;   // stage lines only match stage
    const found = locate(sp, frag);
    if (found) { hit = found; host = sp; break; }
  }
  if (!hit) { missing.push(`${entry.work}: "${entry.f}"`); continue; }

  /* Verse or prose, so the app knows whether the line breaks are meaningful.
     Folger sets verse one line per line, each starting with a capital; prose is
     run to a fixed measure and breaks wherever the measure runs out, so a
     lower-case line opening is the tell. Rendering prose as if it were verse
     puts breaks in places Shakespeare did not. */
  const opens = host.lines.filter((l) => /^[a-z]/.test(l)).length;
  const prose = host.lines.length > 2 && opens / host.lines.length > 0.2;

  const meta = META.get(entry.work);
  items.push({
    prose,
    id: nextId('sh'),
    kind: 'line',
    work: meta.title,
    workSlug: entry.work,
    genre: meta.genre,
    act: host.act, scene: host.scene,
    cite: host.act === 0 ? `${meta.title}, Prologue` : `${meta.title} ${host.act}.${host.scene}`,
    speaker: host.stage ? null : titleCase(host.speaker),
    stage: !!host.stage,
    text: hit.text,
    after: hit.after,
    year: YEARS[entry.work] || null,
    why: entry.why || '',
    ref: entry.ref || null,
    idioms: entry.idiom ? [entry.idiom] : [],
    source: 'Folger Shakespeare Library',
  });
}

for (const entry of SONNETS) {
  const poem = sonnetText.get(entry.n);
  if (!poem) { missing.push(`sonnet ${entry.n}: not found`); continue; }
  const frag = normalize(entry.f);
  const found = locate({ lines: poem }, frag);
  if (!found) { missing.push(`sonnet ${entry.n}: "${entry.f}"`); continue; }
  items.push({
    id: nextId('so'),
    kind: 'sonnet',
    work: `Sonnet ${entry.n}`,
    workSlug: 'shakespeares-sonnets',
    genre: 'sonnet',
    act: null, scene: null,
    cite: `Sonnet ${entry.n}`,
    speaker: null, stage: false, prose: false,
    text: found.text,
    after: [],
    poem,
    year: 1609,
    why: entry.why || '',
    ref: entry.ref || null,
    idioms: entry.idiom ? [entry.idiom] : [],
    source: 'Folger Shakespeare Library',
  });
}

function titleCase(s) {
  if (!s) return s;
  return s.split(' ').map((w) => w.length > 2 || /^(A|I)$/.test(w)
    ? w[0] + w.slice(1).toLowerCase() : w.toLowerCase()).join(' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

/* The play list the app offers as wrong answers. Only works that actually
   appear as an answer somewhere, plus enough near neighbours of the same genre
   that a four-way choice is never trivially solvable by elimination. */
/* Extracting by sentence means two curated fragments can land inside the same
   sentence and produce the same quotation twice — "there's the rub", "what
   dreams may come" and "shuffled off this mortal coil" are all one sentence of
   Hamlet. Ship it once, carrying everything that came out of it. The entry with
   a derivative wins as primary, because that is the most valuable thing on the
   card; refs and idioms from the others accumulate onto it. */
const byQuote = new Map();
const mergedAway = [];
for (const it of items) {
  const key = `${it.workSlug}|${normalize(it.text.join(' '))}`;
  const prev = byQuote.get(key);
  if (!prev) { byQuote.set(key, it); continue; }
  const [keep, drop] = (!prev.ref && it.ref) ? [it, prev] : [prev, it];
  if (drop.ref) {
    keep.ref = [...(keep.ref || []), ...drop.ref.filter((r) => !(keep.ref || []).some((k) => k.what === r.what))];
  }
  for (const id of drop.idioms) if (!keep.idioms.includes(id)) keep.idioms.push(id);
  byQuote.set(key, keep);
  mergedAway.push(`${keep.cite}: ${drop.idioms.join(', ') || drop.id} folded into ${keep.id}`);
}
const deduped = [...byQuote.values()];
items.length = 0;
items.push(...deduped);

const used = new Set(items.filter((i) => i.kind === 'line').map((i) => i.workSlug));
const works = WORKS
  .filter(([slug, , genre]) => genre !== 'poem')
  .map(([slug, title, genre]) => ({
    slug, title, genre,
    year: YEARS[slug] || null,
    used: used.has(slug),
    /* The speaking parts, biggest first. "Who says this?" is only a fair
       question if the wrong answers are people who are actually in the play,
       and the leads make better decoys than a messenger with two lines. */
    cast: castOf(slug),
  }));

function castOf(slug) {
  const speeches = plays.get(slug);
  if (!speeches) return [];
  const count = new Map();
  for (const sp of speeches) {
    if (!sp.speaker) continue;
    const name = titleCase(sp.speaker);
    count.set(name, (count.get(name) || 0) + sp.lines.length);
  }
  return [...count.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([name]) => name);
}

mkdirSync(join(ROOT, 'app', 'data'), { recursive: true });
const payload = {
  generated: new Date().toISOString(),
  source: {
    name: 'Folger Shakespeare Library — Folger Digital Texts',
    url: 'https://shakespeare.folger.edu/',
    terms: 'Free for all non-commercial use.',
  },
  works,
  items,
};
writeFileSync(join(ROOT, 'app', 'data', 'text.json'), JSON.stringify(payload), 'utf8');

const byWork = {};
items.forEach((i) => { byWork[i.work] = (byWork[i.work] || 0) + 1; });
console.log(`parsed  : ${plays.size} plays + ${sonnetText.size} sonnets`);
console.log(`located : ${items.length} of ${ALL_LINES.filter((l) => !l.skipIfDuplicate).length + SONNETS.length} curated fragments`);
console.log(`refs    : ${items.filter((i) => i.ref).length} with a derivative title, ${items.filter((i) => i.idioms.length).length} with an idiom`);
if (mergedAway.length) {
  console.log(`merged  : ${mergedAway.length} duplicate quotation(s) — same sentence located twice`);
  mergedAway.forEach((m) => console.log('   ·', m));
}
if (missing.length) {
  console.log(`\nNOT FOUND — these were dropped, fix the fragment:`);
  missing.forEach((m) => console.log('   !', m));
} else {
  console.log('\nevery curated fragment matched the corpus.');
}
