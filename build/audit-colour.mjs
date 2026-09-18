// Commonplace — does the palette still carry its information without colour?
//
//   node build/audit-colour.mjs            report, and fail on any loss
//   node build/audit-colour.mjs --full     every check, including the passes
//
// The rule, the three channels and the engine all live in
// build/lib/audit-template.mjs, shared with the sibling apps. This file is only
// the part that is specific to Commonplace: which tokens mean what, and where.

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runAudit } from './lib/audit-template.mjs';

const SPEC = {
  files: ['app/styles.css'],
  // BOTH themes. The dark block is written with single quotes, which is how it
  // escaped the first pass of this audit entirely — half the app was unchecked
  // and I only noticed because the browser disagreed with the numbers.
  surfaces: [['light', ':root'], ['dark', "[data-theme='dark']"]],
  pairs: [
    { a: '--good', b: '--bad', channel: 'shape',
      where: 'a graded option: right against wrong' },
    { a: '--good-bg', b: '--bad-bg', channel: 'tint',
      where: 'the wash behind a graded option' },
    { a: '--good-line', b: '--bad-line', channel: 'tint',
      where: 'the border of a graded option' },
    // --indigo and --violet are NOT a pair you have to tell apart: every use is
    // a gradient from one to the other. Auditing them as a distinction was my
    // error. A gradient has to look right, not be legible.
  ],
  text: [
    { fg: '--bad', bg: '--bad-bg', where: 'the cross and its text on the wrong-answer wash' },
    { fg: '--good', bg: '--good-bg', where: 'the tick and its text on the right-answer wash' },
    { fg: '--ink', bg: '--paper', where: 'the quotation, the question' },
    { fg: '--ink-2', bg: '--paper', where: 'supporting lines' },
    { fg: '--ink-3', bg: '--paper', where: 'the quietest labels' },
    { fg: '--ink', bg: '--paper-2', where: 'raised cards' },
    { fg: '--indigo', bg: '--paper', where: 'the accent, used as text' },
    { fg: '--gold-ink', bg: '--gold-soft', where: 'the gold chip' },
    { fg: '--gold-ink', bg: '--paper', where: 'gold used as a word' },
  ],
};

runAudit(SPEC, join(dirname(fileURLToPath(import.meta.url)), '..'));
