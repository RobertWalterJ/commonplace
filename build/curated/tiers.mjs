/* How far in: the difficulty tiers, curated by cultural canonicity.

   The first version derived tiers 2 and 3 from Wikipedia sitelink counts, with
   only tier 1 curated. That was Halyard's population mistake in another suit,
   and the audit was damning. Sitelinks put in "obscure":

     Caravaggio — Judith Beheading Holofernes, Medusa, David with the Head
                  of Goliath, Supper at Emmaus
     Dürer      — Self-Portrait with Fur-Trimmed Robe
     El Greco   — View of Toledo
     Rembrandt  — Belshazzar's Feast          (the writing on the wall)
     Wright     — An Experiment on a Bird in the Air Pump

   while promoting Leonardo's Madonna Litta, Benois Madonna and Madonna of the
   Carnation into the second tier — minor works that rank because Leonardo
   attracts an article in every language on earth. Sitelink count measures what
   Wikipedia editors write about, which is not what an education contains.

   So all three tiers are now assigned by hand, against a stated standard:

   TIER 1 — Foundational.  You are expected to recognise it on sight and name
            it. The test is whether a well-read generalist would be mildly
            embarrassed not to. This is the default the game opens on.

   TIER 2 — Well read.  You would meet it in a first-year survey or a good
            afternoon in a national gallery. Nameable after a moment.

   TIER 3 — Specialist.  Everything else that ships: strong regional canons,
            lesser works by major hands, the deep cuts. Anything not listed
            below lands here, so the fallback is honest rather than flattering.

   Keys are titles, or "Title|Artist" where a title is ambiguous in the data —
   there are two Birth of Venus, two Kiss, two Adoration of the Magi. The build
   reports any key that matches nothing shipped.
*/

export const TIER_1 = [
  // Italian Renaissance and Baroque — the spine of the thing
  'Mona Lisa',
  'Lady with an Ermine',
  'The Creation of Adam',
  'The Last Judgment',
  'The School of Athens',
  'Sistine Madonna',
  'The Birth of Venus|Sandro Botticelli',
  'Primavera',
  'The Calling of Saint Matthew',
  'Judith Beheading Holofernes',
  'David with the Head of Goliath',
  'Medusa',
  'Venus of Urbino',
  'Las Meninas',
  'Rokeby Venus',

  // Northern Renaissance
  'Arnolfini Portrait',
  'Ghent Altarpiece',
  'The Garden of Earthly Delights',
  'The Hunters in the Snow',
  'The Tower of Babel',
  'Netherlandish Proverbs',
  'Self-Portrait with Fur-Trimmed Robe',

  // Dutch Golden Age
  'The Night Watch',
  'The Anatomy Lesson of Dr. Nicolaes Tulp',
  'Girl with a Pearl Earring',
  'The Milkmaid',

  // Spain
  'View of Toledo',
  'The Third of May 1808',
  'Saturn Devouring His Son',

  // Neoclassical and Romantic
  'The Death of Socrates',
  'The Oath of the Horatii',
  'The Death of Marat',
  'Liberty Leading the People',
  'The Raft of the Medusa',
  'Wanderer above the Sea of Fog',
  'The Ambassadors',
  'The Swing',
  'An Experiment on a Bird in the Air Pump',

  // Britain
  'The Fighting Temeraire',
  'Rain, Steam and Speed – The Great Western Railway',
  'The Hay Wain',
  'The Blue Boy',
  'Ophelia',
  "Whistler's Mother",

  // France, nineteenth century
  'The Gleaners',
  'Luncheon on the Grass',
  'Olympia',
  'A Bar at the Folies-Bergère',
  'Impression, Sunrise',
  'Water Lilies',
  'Bal du moulin de la Galette',
  'A Sunday Afternoon on the Island of La Grande Jatte',
  'The Card Players',
  'Where Do We Come From? What Are We? Where Are We Going?',

  // Post-impressionism and the turn of the century
  'The Starry Night',
  'Sunflowers',
  'The Potato Eaters',
  'Café Terrace at Night',
  'The Scream',
  'The Kiss|Gustav Klimt',
  'The Great Wave off Kanagawa',
  'American Gothic',
];

export const TIER_2 = [
  // Leonardo's substantial works, as against his devotional minor ones
  'Virgin of the Rocks',
  'Salvator Mundi',
  'The Virgin and Child with Saint Anne',
  'Saint John the Baptist',
  "Ginevra de' Benci",
  'Annunciation',
  'Adoration of the Magi|Leonardo da Vinci',
  'Doni Tondo',

  'La fornarina',
  'Madonna of the Goldfinch',
  'The Marriage of the Virgin',

  'Supper at Emmaus',
  'The Beheading of Saint John the Baptist',
  'Bacchus',
  'Death of the Virgin',
  'The Fortune Teller',
  'Amor Vincit Omnia',
  'Self-Portrait as Bacchus',

  'Assumption of the Virgin',
  'Sacred and Profane Love',
  'Sleeping Venus',
  'The Tempest|Giorgione',
  'Lamentation of Christ',
  'The Baptism of Christ',
  'The Wedding at Cana',

  'The Surrender of Brea',
  'Las Hilanderas',
  'The Burial of the Count of Orgaz',

  'The Jewish Bride',
  'Return of the Prodigal Son',
  "Belshazzar's Feast",
  'Danaë',
  'The Storm on the Sea of Galilee',

  'View of Delft',
  'The Art of Painting',
  'The Astronomer',
  'Girl Reading a Letter at an Open Window',
  'Woman Holding a Balance',
  'The Little Street',

  'The Triumph of Death',
  'The Blind Leading the Blind',
  'The Peasant Wedding',
  'Madonna of Chancellor Rolin',
  'The Descent from the Cross',
  'Venus and Mars',
  'Adoration of the Magi|Sandro Botticelli',

  'The Clothed Maja',
  'The Second of May 1808',
  'Charles IV of Spain and His Family',
  'Black Paintings',

  'The Coronation of Napoleon',
  'Napoleon Crossing the Alps',
  'Grande Odalisque',
  'The Turkish Bath',
  'Death of Sardanapalus',
  'The Massacre at Chios',
  'A Burial at Ornans',
  "The Painter's Studio",
  'The Balcony',
  'Music in the Tuileries',
  "L'Absinthe",

  'Irises',
  'Wheatfield with Crows',
  'Bedroom in Arles',
  'The Night Café',
  'Starry Night Over the Rhone',
  'Portrait paintings of Dr. Gachet',
  'Luncheon of the Boating Party',
  'The Yellow Christ',
  'When Will You Marry?',

  'Portrait of Adele Bloch-Bauer I',
  'Madonna|Edvard Munch',
  'Black Square (1915)',
  'Isle of the Dead',
  'The Sleeping Gypsy',
  'The Sea of Ice',
  'Barge Haulers on the Volga',
  'The Ninth Wave',
];
