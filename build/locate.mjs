/* Finding a quotation inside a speech, and knowing where to stop.

   The first version of this returned the printed LINES spanning the match.
   That is faithful to the Folger page and wrong for a quiz, because a printed
   line is a typesetting unit, not a unit of sense. It produced quotations that
   began and ended mid-sentence:

     "Let me see. Alas, poor Yorick! I knew him, Horatio--a fellow of infinite"
     "indeed. The better part of valor is discretion, in the"

   The first of those is the worst kind of failure this app can have: the word
   "jest" fell off the end, so the item carrying the *Infinite Jest* reference
   did not visibly contain the phrase the novel is named after.

   So the unit here is the SENTENCE. The match is expanded outwards to sentence
   boundaries, and the result is then cut back into printed lines so that verse
   keeps its lineation — the line breaks in verse carry meaning, the ones in
   prose are just where the measure ran out.

   A very long sentence (Shylock's, Hamlet's on man) would swamp the screen, so
   past a limit the span falls back to clause boundaries — semicolon, colon, or
   Folger's double dash — which are still places a reader can stop.
*/

const TERMINATOR = /[.!?]/;
const CLOSER = /["'’”)\]]/;
export const MAX_SPAN = 260;

/* Where does the sentence containing [from, to] begin and end?

   A terminator only counts if whitespace follows it, which keeps "th'" and
   decimal-like constructions from splitting a sentence. Folger's "--" is a
   dash, never a full stop, so it is deliberately not a terminator here. */
export function sentenceSpan(flat, from, to) {
  let start = 0;
  for (let i = from - 1; i > 0; i--) {
    if (!TERMINATOR.test(flat[i])) continue;
    const after = flat.slice(i + 1);
    if (!/^["'’”)\]]*\s/.test(after)) continue;
    start = i + 1;
    break;
  }
  /* Order matters. Closing punctuation belonging to the previous sentence sits
     BEFORE the whitespace; an opening quote for this one sits after it. Skipping
     both indiscriminately ate the opening quote and left the closing one behind,
     giving: Better a witty Fool than a foolish wit." */
  while (start < flat.length && CLOSER.test(flat[start])) start++;
  while (start < flat.length && /\s/.test(flat[start])) start++;

  let end = flat.length - 1;
  for (let i = Math.max(to, from); i < flat.length; i++) {
    if (!TERMINATOR.test(flat[i])) continue;
    end = i;
    break;
  }
  while (end + 1 < flat.length && CLOSER.test(flat[end + 1])) end++;

  /* Too long to read on a phone. Pull both edges in to the nearest clause
     break that still contains the match. */
  if (end - start > MAX_SPAN) {
    const marks = [';', ':', '--'];
    let best = start;
    for (const m of marks) {
      const at = flat.lastIndexOf(m, from);
      if (at > best && at >= start) best = at + m.length;
    }
    if (best > start) {
      start = best;
      while (start < flat.length && /\s/.test(flat[start])) start++;
    }
    let stop = end;
    for (const m of marks) {
      const at = flat.indexOf(m, to);
      if (at >= 0 && at < stop) stop = at + (m === '--' ? -1 : 0);
    }
    if (stop < end && stop > to) end = stop;
  }
  return [start, end];
}

/* Find `fragment` (already normalised) inside a speech.

   Returns the quotation cut to sentence boundaries but still broken into the
   edition's own lines, plus a little of what follows for the answer card —
   a quotation that stops dead at the famous part reads like a fridge magnet. */
export function locate(speech, fragment, normalizeWithMap) {
  const lines = speech.lines;
  const flat = lines.join(' ');
  const starts = [];
  const ends = [];
  let acc = 0;
  for (const l of lines) { starts.push(acc); ends.push(acc + l.length); acc += l.length + 1; }

  const { norm, map } = normalizeWithMap(flat);
  let cursor = 0;
  for (;;) {
    const idx = norm.indexOf(fragment, cursor);
    if (idx < 0) return null;
    const stop = idx + fragment.length;
    const boundedLeft = idx === 0 || norm[idx - 1] === ' ';
    const boundedRight = stop === norm.length || norm[stop] === ' ';
    if (!boundedLeft || !boundedRight) { cursor = idx + 1; continue; }

    const flatStart = map[idx];
    const flatEnd = map[stop - 1];
    let [sStart, sEnd] = sentenceSpan(flat, flatStart, flatEnd);
    /* Some sentences resist every clause break — Gaunt's "sceptered isle" runs
       800 characters on commas alone, and a sonnet's octave is one sentence by
       design. Rather than serve a wall of text, fall back to the edition's own
       lines, which for verse is exactly the unit a reader expects. This is also
       the case that was producing a quotation opening on a lower-case word. */
    /* Also fall back when clause-trimming has left the quotation opening on a
       lower-case word: that is the visible signature of a fragment, and it is
       exactly what the printed lines avoid. */
    if (sEnd - sStart > MAX_SPAN || /[a-z]/.test(flat[sStart] || '')) {
      const lineOf = (off) => {
        let k = 0;
        while (k + 1 < starts.length && starts[k + 1] <= off) k++;
        return k;
      };
      sStart = starts[lineOf(flatStart)];
      let last = lineOf(flatEnd);
      /* A verse line that ends on a comma has not finished its thought, and
         stopping there gives "This royal throne of kings, this sceptered isle,".
         Run on until a line closes properly, within reason. */
      let guard = 2;
      while (guard-- > 0 && last + 1 < lines.length
             && !/[.!?;:]["'’”)\]]*$/.test(lines[last].trim())
             && ends[last + 1] - sStart <= MAX_SPAN) {
        last++;
      }
      sEnd = ends[last];
    }

    // Cut the sentence back into printed lines, trimming the first and last.
    const text = [];
    for (let i = 0; i < lines.length; i++) {
      const a = Math.max(starts[i], sStart);
      const b = Math.min(ends[i], sEnd + 1);
      if (b > a) {
        const piece = flat.slice(a, b).trim();
        if (piece) text.push(piece);
      }
    }
    if (!text.length) return null;

    // The continuation: the next sentence or two, as plain text.
    let afterStart = sEnd + 1;
    while (afterStart < flat.length && /[\s"'’”)\]]/.test(flat[afterStart])) afterStart++;
    const [, afterEnd] = afterStart < flat.length
      ? sentenceSpan(flat, afterStart, afterStart)
      : [0, -1];
    const after = afterEnd > afterStart
      ? [flat.slice(afterStart, afterEnd + 1).trim()]
      : [];

    return { text, after };
  }
}
