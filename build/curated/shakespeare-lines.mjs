/* The curated Shakespeare canon for Commonplace.

   IMPORTANT — read this before adding anything.

   Nothing here is the quote. Each entry is a *search key*: a normalised
   fragment that build-text.mjs locates inside the actual Folger text. The
   verbatim wording, lineation, speaker and act/scene all come out of the
   corpus, never out of this file and never out of memory. If a fragment does
   not match, the build drops the entry and prints it — so a half-remembered
   quotation can fail loudly, but it can never ship as if it were real.

   That matters more here than it looks. Folger prints

       To be or not to be--that is the question:

   where popular memory inserts a comma and drops the dash. The corpus wins.

   Fields
     f     fragment to find (lower case, apostrophes closed up: "whats done")
     work  Folger slug, so the search is not run across all 40 texts
     why   one line for the card shown after you answer. Editorial, mine.
     ref   things that took their name or title from the line — the
           "where you have already met this" layer. Curated, high confidence
           only; leave it off rather than guess.
     idiom an everyday English phrase this line put into the language.
*/

export const LINES = [
  // ── Hamlet ────────────────────────────────────────────────────────────
  { f: 'to be or not to be', work: 'hamlet',
    why: 'The most quoted line in English, and it is a question about suicide — the speech goes on to weigh dying against the fear of what dying might be like.' },
  { f: 'there is nothing either good or bad but thinking makes it so', work: 'hamlet',
    why: 'Hamlet talking his way out of a corner with Rosencrantz and Guildenstern; the line is far more sceptical than the self-help use it usually gets.' },
  { f: 'brevity is the soul of wit', work: 'hamlet',
    why: 'Spoken by Polonius, the windiest man in the play, in the middle of a very long speech. The joke is the point.' },
  { f: 'though this be madness yet there is method', work: 'hamlet',
    why: 'The origin of "method in his madness" — again Polonius, half-seeing something true.',
    idiom: 'method in his madness' },
  { f: 'to thine own self be true', work: 'hamlet',
    why: 'Read at graduations as pure sincerity; in the play it is the last item in a father’s stream of borrowed platitudes to a son he is about to have spied on.' },
  { f: 'neither a borrower nor a lender be', work: 'hamlet',
    why: 'From the same speech of Polonius’s advice — a stack of proverbs he did not write.' },
  { f: 'the lady doth protest too much', work: 'hamlet',
    why: 'Gertrude, watching a play about a widow swearing she will never remarry. "Protest" here means *vow*, not object — the modern usage has drifted.' },
  { f: 'alas poor yorick', work: 'hamlet',
    why: 'Almost always misquoted as "Alas, poor Yorick, I knew him well" — the actual line runs differently, and he is holding the skull, not a portrait.' },
  { f: 'a fellow of infinite jest', work: 'hamlet',
    why: 'Hamlet on the dead jester Yorick.',
    ref: [{ what: 'Infinite Jest', kind: 'novel', by: 'David Foster Wallace', year: 1996 }] },
  { f: 'what a piece of work is a man', work: 'hamlet',
    why: 'A soaring hymn to human capability that Hamlet ends by saying none of it delights him.' },
  { f: 'there are more things in heaven and earth', work: 'hamlet',
    why: 'To Horatio, after the ghost. The standing English rebuke to anyone too certain about what is possible.' },
  { f: 'something is rotten in the state of denmark', work: 'hamlet',
    why: 'Marcellus, not Hamlet — a guard on the battlements naming what the court cannot say.' },
  { f: 'the plays the thing', work: 'hamlet',
    why: 'Hamlet deciding to use a performance as a lie detector on his uncle.' },
  { f: 'frailty thy name is woman', work: 'hamlet',
    why: 'His first soliloquy, about his mother’s remarriage — the template for a whole genre of "thy name is" constructions.' },
  { f: 'the rest is silence', work: 'hamlet',
    why: 'Hamlet’s last words. Four syllables after four hours of talking.' },
  { f: 'get thee to a nunnery', work: 'hamlet',
    why: 'To Ophelia. "Nunnery" carried a second, brothel-slang sense in the period, which is why the line lands so cruelly.' },
  { f: 'the undiscovered country from whose bourn', work: 'hamlet',
    why: 'Death, in the "to be" speech — the thing no traveller returns from.',
    ref: [{ what: 'Star Trek VI: The Undiscovered Country', kind: 'film', year: 1991 }] },
  { f: 'shuffled off this mortal coil', work: 'hamlet',
    why: 'Also from the "to be" speech; "coil" means turmoil, so it is closer to "got out of this mess" than anything serpentine.',
    idiom: 'shuffle off this mortal coil' },
  { f: 'what dreams may come', work: 'hamlet',
    why: 'The reason Hamlet does not act: not death, but the dreaming that might follow it.',
    ref: [{ what: 'What Dreams May Come', kind: 'novel and film', by: 'Richard Matheson', year: 1978 }] },
  { f: 'rosencrantz and guildenstern are dead', work: 'hamlet',
    why: 'A throwaway announcement in the last scene, which Tom Stoppard turned into an entire play by asking what those two had been doing all along.',
    ref: [{ what: 'Rosencrantz and Guildenstern Are Dead', kind: 'play', by: 'Tom Stoppard', year: 1966 }] },
  { f: 'one may smile and smile and be a villain', work: 'hamlet',
    why: 'Hamlet writing down the discovery that pleasantness proves nothing.' },
  { f: 'more honored in the breach than the observance', work: 'hamlet',
    why: 'Now used to mean "a rule mostly ignored"; Hamlet means the custom is better broken than kept.' },

  // ── Macbeth ───────────────────────────────────────────────────────────
  { f: 'tomorrow and tomorrow and tomorrow', work: 'macbeth',
    why: 'Macbeth on being told his wife is dead — the bleakest speech in the canon, and its images are all of cheap theatre.' },
  { f: 'out damned spot', work: 'macbeth',
    why: 'Lady Macbeth sleepwalking, washing a hand that is already clean.' },
  { f: 'double double toil and trouble', work: 'macbeth',
    why: 'The witches’ chant — the metre changes to a shorter line whenever they speak, so they sound unlike everyone else in the play.' },
  { f: 'is this a dagger which i see before me', work: 'macbeth',
    why: 'A hallucination he interrogates like a scientist before going through with the murder anyway.' },
  { f: 'fair is foul and foul is fair', work: 'macbeth',
    why: 'The witches in scene one, stating the play’s whole moral inversion before any of it happens.' },
  { f: 'full of sound and fury signifying nothing', work: 'macbeth',
    why: 'The end of the "tomorrow" speech.',
    ref: [{ what: 'The Sound and the Fury', kind: 'novel', by: 'William Faulkner', year: 1929 }] },
  { f: 'lifes but a walking shadow', work: 'macbeth',
    why: 'From the same speech — life as a bad actor who gets one scene and is never heard from again.' },
  { f: 'milk of human kindness', work: 'macbeth',
    why: 'Lady Macbeth complaining her husband has too much of it. Shakespeare coined the phrase as an insult.',
    idiom: 'the milk of human kindness' },
  { f: 'screw your courage to the sticking place', work: 'macbeth',
    why: 'Her instruction to him; the image is a tuning peg or a crossbow winch cranked until it holds.' },
  { f: 'whats done is done', work: 'macbeth',
    why: 'Lady Macbeth being brisk about murder, long before she starts washing her hands.' },
  { f: 'something wicked this way comes', work: 'macbeth',
    why: 'The second witch, feeling Macbeth approach — she can tell what he is now by the way he registers.',
    ref: [{ what: 'Something Wicked This Way Comes', kind: 'novel', by: 'Ray Bradbury', year: 1962 }] },
  { f: 'at one fell swoop', work: 'macbeth',
    why: 'Macduff learning his family has been killed; "fell" means savage and the swoop is a hawk’s.',
    idiom: 'in one fell swoop' },
  { f: 'the be all and the end all', work: 'macbeth',
    why: 'Macbeth wishing one murder could be self-contained. The rest of the play is the answer.',
    idiom: 'the be-all and end-all' },
  { f: 'by the pricking of my thumbs', work: 'macbeth',
    why: 'A folk superstition about an itch that warns of danger — the line that sets up "something wicked".' },

  // ── Julius Caesar ─────────────────────────────────────────────────────
  { f: 'friends romans countrymen lend me your ears', work: 'julius-caesar',
    why: 'Antony opening the most effective piece of rhetoric in Shakespeare — he turns a hostile crowd without once openly contradicting anyone.' },
  { f: 'et tu brute', work: 'julius-caesar',
    why: 'Caesar’s three words on seeing his friend among the assassins. Latin, in an English play, which is why it stops the scene dead.' },
  { f: 'the fault dear brutus is not in our stars', work: 'julius-caesar',
    why: 'Cassius arguing that fate is an excuse — the line is a piece of manipulation, which is rarely how it gets quoted.',
    ref: [{ what: 'The Fault in Our Stars', kind: 'novel', by: 'John Green', year: 2012 }] },
  { f: 'beware the ides of march', work: 'julius-caesar',
    why: 'The soothsayer’s warning; the Ides is simply the 15th, an ordinary Roman date the play made ominous forever.' },
  { f: 'cowards die many times before their deaths', work: 'julius-caesar',
    why: 'Caesar to his wife, hours before being proved half right.' },
  { f: 'cry havoc and let slip the dogs of war', work: 'julius-caesar',
    why: '"Havoc" was a military order meaning no quarter and free plunder — a technical term, not a poetic one.',
    idiom: 'cry havoc' },
  { f: 'this was the noblest roman of them all', work: 'julius-caesar',
    why: 'Antony’s verdict on Brutus, over his body, and apparently sincere.' },

  // ── Romeo and Juliet ──────────────────────────────────────────────────
  { f: 'but soft what light through yonder window breaks', work: 'romeo-and-juliet',
    why: 'The balcony scene — though the word "balcony" appears nowhere in the play and had barely entered English.' },
  { f: 'by any other word would smell as sweet', work: 'romeo-and-juliet',
    why: 'Almost universally misquoted as "by any other name". Folger prints *word*, and the whole speech is about names, which makes the slip ironic.' },
  { f: 'wherefore art thou romeo', work: 'romeo-and-juliet',
    why: '"Wherefore" means *why*, not *where* — she is not looking for him, she is complaining about his surname.' },
  { f: 'a plague o both your houses', work: 'romeo-and-juliet',
    why: 'Mercutio dying, and refusing to take a side in the feud that killed him.' },
  { f: 'parting is such sweet sorrow', work: 'romeo-and-juliet',
    why: 'Juliet inventing the oxymoron that every leaving-party card has used since.' },
  { f: 'a pair of star crossed lovers', work: 'romeo-and-juliet',
    why: 'From the Prologue, which gives away the ending in the first fourteen lines — the play is a sonnet before it is a tragedy.',
    idiom: 'star-crossed' },
  { f: 'these violent delights have violent ends', work: 'romeo-and-juliet',
    why: 'Friar Laurence warning that intensity is not the same as durability.',
    ref: [{ what: 'Westworld', kind: 'television series', year: 2016 }] },
  { f: 'wild goose chase', work: 'romeo-and-juliet',
    why: 'Originally a horse race in which riders followed a leader in formation, like geese — not a pursuit of an actual goose.',
    idiom: 'a wild goose chase' },

  // ── King Lear ─────────────────────────────────────────────────────────
  { f: 'nothing will come of nothing', work: 'king-lear',
    why: 'Lear to Cordelia, demanding she perform her love. The whole tragedy turns on this exchange.' },
  { f: 'how sharper than a serpents tooth', work: 'king-lear',
    why: 'Lear on ingratitude — self-pitying, and not entirely wrong.' },
  { f: 'as flies to wanton boys are we to th gods', work: 'king-lear',
    why: 'Gloucester, blinded, on a universe that is not merely indifferent but amused.' },
  { f: 'more sinned against than sinning', work: 'king-lear',
    why: 'Lear in the storm, making the case for himself that the play will not quite grant.' },
  { f: 'the wheel is come full circle', work: 'king-lear',
    why: 'Edmund, dying, accepting the shape of his own story.',
    idiom: 'full circle' },

  // ── Othello ───────────────────────────────────────────────────────────
  { f: 'the green eyed monster', work: 'othello',
    why: 'Iago naming jealousy while deliberately causing it — he warns Othello against the very thing he is manufacturing.',
    idiom: 'the green-eyed monster' },
  { f: 'i am not what i am', work: 'othello',
    why: 'Iago’s self-definition in the first scene, and an exact inversion of God’s "I am that I am".' },
  { f: 'loved not wisely but too well', work: 'othello',
    why: 'Othello writing his own epitaph moments before his suicide — a flattering account of what he has just done.' },
  { f: 'put money in thy purse', work: 'othello',
    why: 'Iago to Roderigo, repeated like a drumbeat; the repetition is the manipulation.' },

  // ── The Tempest ───────────────────────────────────────────────────────
  { f: 'we are such stuff as dreams are made on', work: 'the-tempest',
    why: 'Prospero dissolving a masque and, most people think, Shakespeare closing down the theatre. Note "made on", not "made of".' },
  { f: 'o brave new world', work: 'the-tempest',
    why: 'Miranda, who has met almost no people, on seeing a handful of ordinary courtiers. Her father’s reply — "’Tis new to thee" — is the joke.',
    ref: [{ what: 'Brave New World', kind: 'novel', by: 'Aldous Huxley', year: 1932 }] },
  { f: 'hell is empty and all the devils are here', work: 'the-tempest',
    why: 'Ariel reporting on the shipwreck he caused.' },
  { f: 'full fathom five thy father lies', work: 'the-tempest',
    why: 'Ariel’s song about a drowning that never happened — the source of "sea-change" as an English phrase.',
    idiom: 'a sea change' },
  { f: 'the isle is full of noises', work: 'the-tempest',
    why: 'Caliban, the play’s supposed monster, given its most beautiful speech.' },

  // ── Henry V and the histories ─────────────────────────────────────────
  { f: 'once more unto the breach', work: 'henry-v',
    why: 'Henry at Harfleur, talking exhausted men back into a gap in a wall.' },
  { f: 'we few we happy few we band of brothers', work: 'henry-v',
    why: 'The Crispin’s Day speech before Agincourt — the founding text for every underdog speech since.',
    ref: [{ what: 'Band of Brothers', kind: 'book and series', by: 'Stephen E. Ambrose', year: 1992 }] },
  { f: 'cry god for harry england and saint george', work: 'henry-v',
    why: 'The end of the Harfleur speech, and the reason "God for Harry" turns up on so many pub signs.' },
  { f: 'the games afoot', work: 'henry-v',
    why: 'Henry again — and where Sherlock Holmes got the phrase he is far better known for.',
    ref: [{ what: 'Sherlock Holmes ("The Adventure of the Abbey Grange")', kind: 'story', by: 'Arthur Conan Doyle', year: 1904 }] },
  { f: 'now is the winter of our discontent', work: 'richard-iii',
    why: 'Richard opening the play by explaining, cheerfully, that he intends to be a villain because peace bores him.',
    ref: [{ what: 'The Winter of Our Discontent', kind: 'novel', by: 'John Steinbeck', year: 1961 }] },
  { f: 'a horse a horse my kingdom for a horse', work: 'richard-iii',
    why: 'His last line but one — the whole kingdom he schemed for, offered back for transport.' },
  { f: 'uneasy lies the head that wears a crown', work: 'henry-iv-part-2',
    why: 'The king awake at night, envying his poorest subject’s sleep.' },
  { f: 'the better part of valor is discretion', work: 'henry-iv-part-1',
    why: 'Falstaff explaining why he played dead. Usually quoted as sober wisdom; it is a fat knight justifying cowardice.',
    idiom: 'discretion is the better part of valour' },
  { f: 'this royal throne of kings this sceptered isle', work: 'richard-ii',
    why: 'John of Gaunt’s speech, endlessly quoted as patriotism — it is actually a deathbed complaint that England has been ruined.' },

  // ── Comedies ──────────────────────────────────────────────────────────
  { f: 'all the worlds a stage', work: 'as-you-like-it',
    why: 'Jaques’s seven ages of man — melancholy dressed up as observation.' },
  { f: 'too much of a good thing', work: 'as-you-like-it',
    why: 'Rosalind, in prose, coining a phrase that has outlived the play.',
    idiom: 'too much of a good thing' },
  { f: 'if music be the food of love play on', work: 'twelfth-night',
    why: 'Orsino wants to overeat on music until he is sick of being in love. The first line tells you he is in love with the feeling.' },
  { f: 'some are born great some achieve greatness', work: 'twelfth-night',
    why: 'From a forged letter designed to humiliate Malvolio — the most-quoted piece of career advice in English is a practical joke.' },
  { f: 'better a witty fool than a foolish wit', work: 'twelfth-night',
    why: 'Feste defending his profession, and the play’s thesis in eight words.' },
  { f: 'the course of true love never did run smooth', work: 'a-midsummer-nights-dream',
    why: 'Lysander, being consoling, immediately before the play proves him right at length.' },
  { f: 'lord what fools these mortals be', work: 'a-midsummer-nights-dream',
    why: 'Puck enjoying the mess he has made.' },
  { f: 'though she be but little she is fierce', work: 'a-midsummer-nights-dream',
    why: 'Helena about Hermia, mid-argument — an insult that ended up on a million nursery walls.' },
  { f: 'the quality of mercy is not strained', work: 'the-merchant-of-venice',
    why: 'Portia in court, in disguise. "Strained" means forced or constrained, not filtered.' },
  { f: 'if you prick us do we not bleed', work: 'the-merchant-of-venice',
    why: 'Shylock’s speech, which argues for common humanity and ends by using it to justify revenge.' },
  { f: 'all that glisters is not gold', work: 'the-merchant-of-venice',
    why: 'Found in the casket by the wrong suitor. Modern English has swapped *glisters* for *glitters*.',
    idiom: 'all that glitters is not gold' },
  { f: 'sigh no more ladies sigh no more', work: 'much-ado-about-nothing',
    why: 'Balthasar’s song advising women to stop grieving over faithless men and enjoy themselves instead.' },
  { f: 'some rise by sin and some by virtue fall', work: 'measure-for-measure',
    why: 'Escalus, on a court where the moral arithmetic has stopped working.' },

  // ── Antony and Cleopatra ──────────────────────────────────────────────
  { f: 'age cannot wither her nor custom stale', work: 'antony-and-cleopatra',
    why: 'Enobarbus on Cleopatra — the tribute is from a soldier who does not much like her.' },
  { f: 'my salad days when i was green in judgment', work: 'antony-and-cleopatra',
    why: 'Cleopatra dismissing her younger self; the phrase now means a golden youth, which is close to the opposite of her meaning.',
    idiom: 'salad days' },

  // ── Timon of Athens ───────────────────────────────────────────────────
  { f: 'the moons an arrant thief', work: 'timon-of-athens',
    why: 'Timon’s cosmology of universal theft — the moon steals its light from the sun, and the phrase that follows gave Nabokov a title.',
    ref: [{ what: 'Pale Fire', kind: 'novel', by: 'Vladimir Nabokov', year: 1962 }] },

  // ── The Winter's Tale ─────────────────────────────────────────────────
  { f: 'pursued by a bear', work: 'the-winters-tale', stage: true,
    why: 'The most famous stage direction ever written. The Folio reads “Exit, pursued by a beare”; Folger modernises it, and nobody knows whether the first production used a real bear from the baiting pit next door.' },
];

/* Sonnets are addressed by number, so they need no play slug. The build finds
   the fragment inside the numbered sonnet and returns the whole poem, which is
   what you want on the answer card — a sonnet does not survive being excerpted. */
export const SONNETS = [
  { n: 18, f: 'shall i compare thee to a summers day',
    why: 'The one everybody can start. Its real move is the turn at line 9, where the poem stops praising the beloved and starts boasting about itself.' },
  { n: 29, f: 'when in disgrace with fortune and mens eyes',
    why: 'Self-pity for eight lines, then one thought of the beloved reverses the whole poem mid-sentence.' },
  { n: 30, f: 'when to the sessions of sweet silent thought',
    why: 'Grief described in the language of a courtroom summons and an unpaid bill.' },
  { n: 55, f: 'not marble nor the gilded monuments',
    why: 'A poem whose subject is its own durability — and which has, so far, been right.' },
  { n: 60, f: 'like as the waves make towards the pebbled shore',
    why: 'Time as surf: each minute pushing the one in front of it forward to die.' },
  { n: 73, f: 'that time of year thou mayst in me behold',
    why: 'Three images of ending — autumn, dusk, a dying fire — each shorter than the last, so the poem itself runs out of time.' },
  { n: 94, f: 'they that have power to hurt and will do none',
    why: 'The coldest sonnet, and the hardest to pin down: it may be praising restraint or diagnosing it as a kind of frost.' },
  { n: 116, f: 'let me not to the marriage of true minds',
    why: 'Read at weddings everywhere. It is a definition by negation — it never says what love is, only what it will not do.' },
  { n: 129, f: 'th expense of spirit in a waste of shame',
    why: 'Lust, described with a violence of rhythm that most editions cannot punctuate calmly.' },
  { n: 130, f: 'my mistress eyes are nothing like the sun',
    why: 'A parody of the standard love poem, listing everything she is not, and it lands as more affectionate than the thing it mocks.' },
  { n: 138, f: 'when my love swears that she is made of truth',
    why: 'Two people lying to each other about age and fidelity, and agreeing to keep it up.' },
  { n: 146, f: 'poor soul the center of my sinful earth',
    why: 'The one properly religious sonnet, addressed by the poet to his own soul about the body it is renting.' },
];
