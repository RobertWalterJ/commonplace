/* The curated art layer for Commonplace.

   Same discipline as the Shakespeare list: nothing factual is written here.
   Titles, artists, dates, movements, collections and images all come from
   Wikidata; this file only says which works matter most, what is worth saying
   about them, and where you have already met them. Every key below is matched
   against the fetched data and a key that matches nothing is reported by the
   build, so a misremembered title cannot silently drop a painting.

   TIER1 — the curated core, in the spirit of Halyard's lesson that a derived
   difficulty ranking is not good enough. Sitelink count is a decent fame proxy
   for paintings (much better than population was for flags), but it over-rates
   works that are famous to Wikipedia editors and under-rates a few that
   everybody has actually seen. This list is the override.

   NOTES — the card you get after answering. One or two sentences, and the aim
   is the thing you would not get from the label on the wall.

   REFS — the derivative layer: the album cover, the film, the emoji. This is
   the whole point of the app, so it is also the place to be most careful.
   Nothing goes in unless I am confident.
*/

export const TIER1 = [
  ['Mona Lisa', 'Leonardo da Vinci'],
  ['The Starry Night', 'Vincent van Gogh'],
  ['The Scream', 'Edvard Munch'],
  ['Girl with a Pearl Earring', 'Johannes Vermeer'],
  ['The Great Wave off Kanagawa', 'Katsushika Hokusai'],
  ['The Creation of Adam', 'Michelangelo'],
  ['The School of Athens', 'Raphael'],
  ['The Birth of Venus', 'Sandro Botticelli'],
  ['Liberty Leading the People', 'Eugène Delacroix'],
  ['The Night Watch', 'Rembrandt'],
  ['Las Meninas', 'Diego Velázquez'],
  ['American Gothic', 'Grant Wood'],
  ['The Kiss', 'Gustav Klimt'],
  ['The Garden of Earthly Delights', 'Hieronymus Bosch'],
  ['Wanderer above the Sea of Fog', 'Caspar David Friedrich'],
  ['The Third of May 1808', 'Francisco Goya'],
  ['Saturn Devouring His Son', 'Francisco Goya'],
  ['The Raft of the Medusa', 'Théodore Géricault'],
  ['Impression, Sunrise', 'Claude Monet'],
  ['Water Lilies', 'Claude Monet'],
  ['Sunflowers', 'Vincent van Gogh'],
  ['The Potato Eaters', 'Vincent van Gogh'],
  ['Café Terrace at Night', 'Vincent van Gogh'],
  ['Luncheon on the Grass', 'Édouard Manet'],
  ['Olympia', 'Édouard Manet'],
  ['A Bar at the Folies-Bergère', 'Édouard Manet'],
  ['A Sunday Afternoon on the Island of La Grande Jatte', 'Georges Seurat'],
  ['Arnolfini Portrait', 'Jan van Eyck'],
  ['The Ambassadors', 'Hans Holbein the Younger'],
  ['Primavera', 'Sandro Botticelli'],
  ['The Anatomy Lesson of Dr. Nicolaes Tulp', 'Rembrandt'],
  ['The Milkmaid', 'Johannes Vermeer'],
  ['View of Delft', 'Johannes Vermeer'],
  ['Lady with an Ermine', 'Leonardo da Vinci'],
  ['The Oath of the Horatii', 'Jacques-Louis David'],
  ['The Death of Marat', 'Jacques-Louis David'],
  ['The Death of Socrates', 'Jacques-Louis David'],
  ['The Hay Wain', 'John Constable'],
  ['The Fighting Temeraire', 'J. M. W. Turner'],
  ['Rain, Steam and Speed – The Great Western Railway', 'J. M. W. Turner'],
  ['Ophelia', 'John Everett Millais'],
  ['Whistler\'s Mother', 'James McNeill Whistler'],
  ['The Gleaners', 'Jean-François Millet'],
  ['The Swing', 'Jean-Honoré Fragonard'],
  ['Bal du moulin de la Galette', 'Pierre-Auguste Renoir'],
  ['Luncheon of the Boating Party', 'Pierre-Auguste Renoir'],
  ['The Hunters in the Snow', 'Pieter Brueghel the Elder'],
  ['Netherlandish Proverbs', 'Pieter Brueghel the Elder'],
  ['Venus of Urbino', 'Titian'],
  ['The Blue Boy', 'Thomas Gainsborough'],
  ['Black Square (1915)', 'Kazimir Malevich'],
  ['Wheatfield with Crows', 'Vincent van Gogh'],
  ['Irises', 'Vincent van Gogh'],
  ['The Ninth Wave', 'Ivan Aivazovsky'],
  ['Barge Haulers on the Volga', 'Ilya Repin'],
  ['Sistine Madonna', 'Raphael'],
  ['The Coronation of Napoleon', 'Jacques-Louis David'],
];

/* Keyed by title only where the title is unambiguous in the data set, or
   "Title|Artist" where it is not. */
export const NOTES = {
  'Mona Lisa': 'Unremarkable for centuries — it became the most famous painting on earth after it was stolen from the Louvre in 1911 and the empty wall drew bigger crowds than the picture had.',
  'The Starry Night': 'Painted from the window of the asylum at Saint-Rémy, from memory and in daylight. The village below is not the one outside; he added it.',
  'The Scream': 'Munch said the sky turned "blood red" over Oslo and he felt an infinite scream passing through nature. The figure is not screaming — it is holding its ears against one.',
  'Girl with a Pearl Earring': 'Not a portrait but a *tronie* — a study of a type rather than a person. Nobody knows who she was, and the pearl may be too large to be a pearl.',
  'The Great Wave off Kanagawa': 'One impression of thousands from the same woodblocks, made to sell cheaply. Hokusai was around seventy, and the mountain in the trough is Fuji.',
  'The Creation of Adam': 'On a ceiling, sixty feet up, painted standing. The shape enclosing God has been read since the 1990s as an anatomical cross-section of the human brain.',
  'The School of Athens': 'Plato points up to the ideal, Aristotle levels his hand at the world in front of him — the entire argument of Western philosophy staged as two hand gestures.',
  'The Birth of Venus': 'She is not being born but arriving, blown ashore on a shell. Painted on canvas when Florence still expected panel, which is part of why it survived.',
  'Liberty Leading the People': 'The bare-breasted figure is not a person but an allegory, and the man in the top hat beside her is often taken for the painter himself.',
  'The Night Watch': 'Not a night scene — the darkness is varnish. It was also cut down in 1715 to fit a wall, so the composition you see is off-centre by force.',
  'Las Meninas': 'The painter is in his own picture, looking out at what he is painting, which is where you are standing. The king and queen appear only in a mirror.',
  'American Gothic': 'The pair are a farmer and his daughter, not his wife, and the models were the artist\'s dentist and his own sister. Iowa hated it.',
  'The Kiss': 'Gold leaf, laid on like a Byzantine icon. Look at the fabric: his rectangles, her circles — the pattern does the work the faces do not.',
  'The Garden of Earthly Delights': 'A triptych that gets stranger as it goes right: Eden, then a vast garden of naked delight, then hell — where a man has sheet music tattooed on his backside.',
  'Wanderer above the Sea of Fog': 'The founding image of Romantic solitude, and it works by showing you a back. You cannot see his face, so you occupy him.',
  'The Third of May 1808': 'The man in white throws his arms out in a crucifixion pose; the firing squad has no faces. Goya invented the modern image of atrocity here.',
  'Saturn Devouring His Son': 'One of the Black Paintings — Goya put these straight onto the plaster walls of his own house, for nobody, in his seventies and deaf.',
  'The Raft of the Medusa': 'A current scandal painted at the scale of history painting. Géricault interviewed survivors and had the actual carpenter build him a model of the raft.',
  'Impression, Sunrise': 'A critic used its title to mock the whole group as mere "Impressionists". They took the insult and kept it.',
  'Sunflowers': 'Painted to decorate the room he was preparing for Gauguin in Arles — hospitality, before it all went wrong.',
  'The Potato Eaters': 'Van Gogh thought this his best work. He wanted the colour of "a really dusty potato, unpeeled", and he got it.',
  'Luncheon on the Grass': 'The nude was not the scandal — nude goddesses were fine. The scandal was that she is an ordinary woman at a picnic, looking straight at you.',
  'Olympia': 'Same offence, worse: a courtesan, not a Venus, and she is not remotely ashamed. It had to be hung high to keep it from being attacked.',
  'A Sunday Afternoon on the Island of La Grande Jatte': 'Two years of work in dots of unmixed colour, on the theory that the eye would blend them. Note that almost nobody in the crowd is looking at anybody else.',
  'Arnolfini Portrait': 'The convex mirror at the back shows two more figures in the doorway, and above it van Eyck wrote "Jan van Eyck was here" — a signature as witness statement.',
  'The Ambassadors': 'The smear across the floor resolves into a skull if you stand at the right-hand edge and look along the surface. Everything else in the picture is worldly success.',
  'The Anatomy Lesson of Dr. Nicolaes Tulp': 'A group portrait where everyone paid to be included, arranged around a corpse. The dissected arm is anatomically wrong.',
  'The Milkmaid': 'A kitchen maid pouring milk, given the gravity of an altarpiece. Vermeer painted perhaps thirty-five pictures in his life.',
  'The Oath of the Horatii': 'Three brothers swear to die for Rome while the women collapse at the right — the composition splits the canvas into duty and grief.',
  'The Death of Marat': 'Painted by a friend and political ally within months of the murder. It is propaganda, and it is one of the great paintings.',
  'The Hay Wain': 'Ignored in England, it won a gold medal in Paris in 1824 and changed French landscape painting.',
  'The Fighting Temeraire': 'A veteran of Trafalgar towed by a squat steam tug to be broken up. Turner made the sun set behind it in the wrong direction for the geography.',
  'Ophelia': 'Millais painted the river first and the figure after; his model lay in a bath of water kept warm by lamps until the lamps went out and she caught a serious chill.',
  'The Gleaners': 'Three women taking the leavings after harvest — a legal right of the poorest. Painting them at this scale was read at the time as dangerous.',
  'Netherlandish Proverbs': 'More than a hundred proverbs staged literally in one village, including armed men banging their heads against a brick wall.',
  'Black Square (1915)': 'Hung across the corner of the room in 1915 — the position a Russian household reserved for its icon. That placement is the argument.',
  'Wheatfield with Crows': 'Often called his last painting; it was not, though it was one of the last. The path in the middle goes nowhere.',
  'The Ninth Wave': 'Aivazovsky painted around six thousand seascapes and rarely worked from life — this is all memory and studio.',
  'Whistler\'s Mother': 'Its actual title is *Arrangement in Grey and Black No. 1*. Whistler insisted the subject was the arrangement, not his mother.',
};

export const REFS = {
  'The Starry Night': [{ what: 'Vincent (Starry, Starry Night)', kind: 'song', by: 'Don McLean', year: 1971 }],
  'Liberty Leading the People': [{ what: 'Viva la Vida', kind: 'album cover', by: 'Coldplay', year: 2008 }],
  'A Sunday Afternoon on the Island of La Grande Jatte': [
    { what: 'Sunday in the Park with George', kind: 'musical', by: 'Stephen Sondheim', year: 1984 },
    { what: "Ferris Bueller's Day Off", kind: 'film', year: 1986 }],
  'Whistler\'s Mother': [{ what: 'Bean', kind: 'film', year: 1997 }],
  'The Creation of Adam': [{ what: 'E.T. the Extra-Terrestrial', kind: 'film poster', year: 1982 }],
  'Mona Lisa': [{ what: 'L.H.O.O.Q.', kind: 'readymade', by: 'Marcel Duchamp', year: 1919 }],
  'The Scream': [{ what: '😱 face screaming in fear', kind: 'emoji' }],
  'The Great Wave off Kanagawa': [{ what: '🌊 water wave', kind: 'emoji' }],
  'The Garden of Earthly Delights': [{ what: 'Deep Purple', kind: 'album cover', year: 1969 }],
};

/* Pairs people genuinely mix up. The build uses these to push the right wrong
   answer in front of you, and the app uses them to build a head-to-head drill
   once it notices you confusing two artists. Everything else is derived from
   shared movement, period and nationality. */
export const CONFUSABLE = [
  ['Claude Monet', 'Édouard Manet'],
  ['Vincent van Gogh', 'Paul Gauguin'],
  ['Pieter Brueghel the Elder', 'Hieronymus Bosch'],
  ['Jan van Eyck', 'Rogier van der Weyden'],
  ['Diego Velázquez', 'Francisco Goya'],
  ['Titian', 'Giorgione'],
  ['Raphael', 'Michelangelo'],
  ['Leonardo da Vinci', 'Raphael'],
  ['Pierre-Auguste Renoir', 'Claude Monet'],
  ['Edgar Degas', 'Pierre-Auguste Renoir'],
  ['Caspar David Friedrich', 'J. M. W. Turner'],
  ['John Constable', 'J. M. W. Turner'],
  ['Gustav Klimt', 'Egon Schiele'],
  ['Paul Cézanne', 'Paul Gauguin'],
  ['Rembrandt', 'Frans Hals'],
  ['Johannes Vermeer', 'Pieter de Hooch'],
  ['Sandro Botticelli', 'Filippo Lippi'],
  ['Jacques-Louis David', 'Jean-Auguste-Dominique Ingres'],
];

/* Left out on purpose. Courbet's L'Origine du monde is canonical art history
   and also a close-up of genitals; it is not what you want appearing on a
   phone on the subway. */
export const EXCLUDE = [
  "L'Origine du monde",
];
