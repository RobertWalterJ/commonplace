/* Second pass on the Shakespeare canon — the derivative layer.

   The point of this app is references, and the first pass shipped only nine
   items carrying one. This file does two things:

   LINES_MORE  adds lines that are famous *because* of what came out of them —
               mostly the ones that turned into ordinary English. "Hoist with
               his own petard" and "the world's mine oyster" are not here for
               their poetry; they are here because you have used them.

   REF_PATCH   attaches a derivative to a line the first pass already located,
               keyed by the same fragment. Nothing here re-states a quotation:
               build-text.mjs still finds every line in the Folger text, and a
               fragment that matches nothing is reported and dropped.

   Same rule as before on the references themselves: only where I am confident.
   A borrowing I half-remember is worse than no borrowing at all, because the
   whole proposition of the app is that what it tells you is true.
*/

export const LINES_MORE = [
  { f: 'hoist with his own petard', work: 'hamlet',
    why: 'A petard was a small bomb for blowing in a gate; the engineer who laid it went up with it. Nothing to do with hoisting a flag, and nothing to do with anyone’s trousers.',
    idiom: 'hoist with his own petard' },
  { f: 'the primrose path of dalliance', work: 'hamlet',
    why: 'Ophelia, warning her brother not to preach abstinence to her while taking the easy road himself.',
    idiom: 'the primrose path' },
  { f: 'in my minds eye', work: 'hamlet',
    why: 'Hamlet on seeing his dead father — the phrase for the picture you carry rather than the one in front of you.',
    idiom: 'in my mind’s eye' },
  { f: 'i must be cruel only to be kind', work: 'hamlet',
    why: 'Said by a man who has just killed the wrong person behind a curtain, which is worth remembering when the phrase is used to justify something.',
    idiom: 'cruel to be kind',
    ref: [{ what: 'Cruel to Be Kind', kind: 'song', by: 'Nick Lowe', year: 1979 }] },
  { f: 'ay theres the rub', work: 'hamlet',
    why: 'The obstacle in the middle of the "to be" speech. A "rub" was a flaw in a bowling green that threw the bowl off line.',
    idiom: 'there’s the rub' },
  { f: 'more in sorrow than in anger', work: 'hamlet',
    why: 'Horatio describing the ghost’s face. Now the standard formula for a rebuke that would like to be thought reluctant.',
    idiom: 'more in sorrow than in anger' },

  { f: 'the worlds mine oyster', work: 'the-merry-wives-of-windsor',
    why: 'Pistol, who follows it by saying he will open the oyster with his sword. The modern version drops the threat.',
    idiom: 'the world is your oyster' },
  { f: 'wear my heart upon my sleeve', work: 'othello',
    why: 'Iago saying precisely what he will never do. The most-quoted line about sincerity in English is spoken by its greatest liar.',
    idiom: 'wear your heart on your sleeve' },
  { f: 'a foregone conclusion', work: 'othello',
    why: 'Othello on what he now believes he has proof of. He has none.',
    idiom: 'a foregone conclusion' },

  { f: 'a pound of flesh', work: 'the-merchant-of-venice',
    why: 'The literal terms of the bond, which Portia later defeats by taking them even more literally.',
    idiom: 'a pound of flesh' },
  { f: 'love is blind', work: 'the-merchant-of-venice',
    why: 'Jessica, in disguise as a boy and hoping not to be recognised. The phrase is older than the play, but this is where English got it.',
    idiom: 'love is blind' },

  { f: 'whats past is prologue', work: 'the-tempest',
    why: 'Antonio arguing that history is merely the run-up to what he is about to do.',
    idiom: 'what’s past is prologue',
    ref: [{ what: 'carved on the National Archives building, Washington', kind: 'inscription', year: 1935, notATitle: true }] },
  { f: 'misery acquaints a man with strange bedfellows', work: 'the-tempest',
    why: 'Trinculo, deciding to shelter under a creature he has just described as a fish.',
    idiom: 'strange bedfellows' },

  { f: 'no more cakes and ale', work: 'twelfth-night',
    why: 'Sir Toby to Malvolio: does your being virtuous mean the rest of us have to stop enjoying ourselves?',
    ref: [{ what: 'Cakes and Ale', kind: 'novel', by: 'W. Somerset Maugham', year: 1930 }] },

  { f: 'break the ice', work: 'the-taming-of-the-shrew',
    why: 'Literally, at the time: ships broke ice to open a passage. Tranio means clearing the way to the elder sister.',
    idiom: 'break the ice' },

  { f: 'it was greek to me', work: 'julius-caesar',
    why: 'Casca, admitting he did not understand Cicero because Cicero was in fact speaking Greek.',
    idiom: 'it’s all Greek to me' },

  { f: 'eaten me out of house and home', work: 'henry-iv-part-2',
    why: 'Mistress Quickly on Falstaff, who owes her for everything he has consumed and is suing him for it.',
    idiom: 'eaten out of house and home' },

  { f: 'crack of doom', work: 'macbeth',
    why: 'The line of kings the witches show Macbeth stretches to the last trumpet. "Crack" is the sound, not a fissure.',
    idiom: 'the crack of doom' },

  { f: 'a tower of strength', work: 'richard-iii',
    why: 'Richard on the power of his own name, hours before losing at Bosworth.',
    idiom: 'a tower of strength' },
];

/* Derivatives attached to lines the first pass already located. Keyed by the
   same normalised fragment used there. */
export const REF_PATCH = {
  'cry havoc and let slip the dogs of war': {
    ref: [{ what: 'The Dogs of War', kind: 'novel', by: 'Frederick Forsyth', year: 1974 }],
  },
  'full fathom five thy father lies': {
    ref: [{ what: 'Full Fathom Five', kind: 'painting', by: 'Jackson Pollock', year: 1947 }],
  },
  'beware the ides of march': {
    ref: [{ what: 'The Ides of March', kind: 'film', year: 2011 }],
  },
  'we are such stuff as dreams are made on': {
    ref: [{ what: 'The Maltese Falcon — "the stuff that dreams are made of"', kind: 'film', year: 1941 }],
  },
  'all the worlds a stage': {
    ref: [{ what: 'All the World’s a Stage', kind: 'album', by: 'Rush', year: 1976 }],
  },
  'what a piece of work is a man': {
    ref: [{ what: 'What a Piece of Work Is Man', kind: 'song, from Hair', year: 1967 }],
  },
  'the isle is full of noises': {
    ref: [{ what: 'recited at the London 2012 Olympic opening ceremony', kind: 'by Kenneth Branagh', notATitle: true }],
  },
  'by any other word would smell as sweet': { idiom: 'a rose by any other name' },
  'something is rotten in the state of denmark': { idiom: 'something is rotten in the state of…' },
  'the lady doth protest too much': { idiom: 'the lady doth protest too much' },
  'brevity is the soul of wit': { idiom: 'brevity is the soul of wit' },
  'once more unto the breach': { idiom: 'once more unto the breach' },
  'et tu brute': { idiom: 'et tu, Brute?' },
  'to be or not to be': { idiom: 'to be or not to be' },
  'the rest is silence': { idiom: 'the rest is silence' },
  'a plague o both your houses': { idiom: 'a plague on both your houses' },
};
