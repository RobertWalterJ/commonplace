/* The second pass of painting notes.

   These are the cards for everything in tiers 1 and 2 that the first pass left
   silent — 77 works that were shipping with nothing to say beyond their label.
   Kept in their own file because the list is long and it will keep growing;
   build-art.mjs merges it over NOTES in paintings.mjs, and any key that matches
   no shipped work is reported by the build.

   These are editorial, and they are the one place in this app where I am
   writing rather than locating. So the bias throughout is towards what you can
   check by looking at the picture — a hare on the track, a mirror in the wrong
   place, a hand that does not match the other hand — and away from biography.
   Where scholarship is genuinely contested the note says so rather than
   picking a side.
*/
export const NOTES_MORE = {
  // ── tier 1 ────────────────────────────────────────────────────────────
  'The Death of Socrates': 'He is still lecturing, one hand reaching for the hemlock without looking at it. Plato sits at the foot of the bed as an old man, though he was young at the time and, by his own account, not there.',
  'Lady with an Ermine': 'Cecilia Gallerani, mistress of Leonardo’s employer Ludovico Sforza — whose emblem was an ermine, so the animal is a pun as well as a symbol. The flat black background was added centuries later by another hand.',
  'Bal du moulin de la Galette': 'Sunday afternoon dancing in Montmartre, painted at the scale of a history picture. Critics complained that the dappled light made the dancers look spotted with grease.',
  'Irises': 'Painted in his first week at the asylum in Saint-Rémy, where he called the work a lightning rod for his illness. One iris in the crowd is white.',
  'Primavera': 'Read it right to left: the wind god seizes a nymph who transforms, mid-picture, into the flower-strewn figure beside her. Five centuries on, nobody agrees what the whole thing means.',
  'Venus of Urbino': 'Mark Twain called it the foulest painting in the world. She meets your eye instead of averting it, which is most of the difference between this and a goddess.',
  'Café Terrace at Night': 'His first night sky full of stars — and there is no black anywhere in it. The dark is built entirely from deep blues and greens.',
  'View of Delft': 'Proust thought it the most beautiful painting in the world, and killed off a character in his novel standing in front of it, looking at a small patch of yellow wall.',
  'A Bar at the Folies-Bergère': 'The mirror is wrong, and deliberately. Her reflection is shunted far to the right, and the man she is serving ought to be standing where you are.',
  'The Hunters in the Snow': 'One of a series on the months of the year. The hunters are coming home with almost nothing — a single fox between them.',
  'The Coronation of Napoleon': 'He has already crowned himself and is in the act of crowning Joséphine. His mother sits prominently in the stands; she refused to attend, and David painted her in regardless.',
  'The Blue Boy': 'Partly an argument with Reynolds, who had lectured that cold colours should never dominate a picture. Gainsborough made blue the entire painting.',
  'Sistine Madonna': 'The two bored cherubs leaning on the frame at the bottom have been cropped out and reproduced more often than everything above them put together.',
  'Barge Haulers on the Volga': 'Eleven men dragging a barge upstream in harness. The young one in the middle, straightening against the strap, is the argument the picture is making.',
  'The Swing': 'The patron’s brief survives: he wanted himself placed where he could see up her skirts. Fragonard obliged, and added the flying shoe.',
  'Water Lilies': 'Around 250 canvases over the last thirty years of his life, many painted while cataracts took his sight. The late ones run red, which is roughly how the world looked through those lenses.',
  'Luncheon of the Boating Party': 'His actual friends, posed over several months at a riverside restaurant. The woman playing with the little dog married him.',
  'Rain, Steam and Speed – The Great Western Railway': 'A hare is running along the track ahead of the train. It is easy to miss, and it is the entire point of the picture.',

  // ── tier 2 ────────────────────────────────────────────────────────────
  'Salvator Mundi': 'Sold in 2017 for more than any painting in history, and argued over ever since — the crystal orb does not refract what is behind it, which is a strange thing for Leonardo to get wrong.',
  'The Last Judgment': 'Saint Bartholomew holds his own flayed skin, and the face on the skin is Michelangelo’s. The nudes were painted over with drapery after his death.',
  'Virgin of the Rocks': 'There are two, in Paris and in London. The likeliest account is that he painted one, fell out with the commissioners over money, and painted another.',
  'Reply of the Zaporozhian Cossacks': 'They are composing a gleefully obscene reply to the Ottoman Sultan. Repin spent twelve years on it, and the real subject is the laughter.',
  'Portrait paintings of Dr. Gachet': 'Painted in the last weeks of his life, of the doctor treating him. Van Gogh wrote that Gachet seemed sicker than he was.',
  'Bedroom in Arles': 'Three versions exist. He wanted flat colour to suggest rest and absolute calm, and skewed the perspective deliberately to get it.',
  'Ginevra de\' Benci': 'The only Leonardo in the Americas. The panel was cut down at some point, so her hands — which survive in a separate study — are gone.',
  'The Virgin and Child with Saint Anne': 'Three generations stacked into a single pyramid, the grown daughter sitting in her mother’s lap. Freud wrote an entire essay about the shape of it.',
  'Ghent Altarpiece': 'Probably the most stolen artwork in history. One panel taken in 1934 has never been recovered, and what hangs in its place is a copy.',
  'The Surrender of Brea': 'The victor reaches out to stop the defeated commander from kneeling. Spanish calls it Las Lanzas, after the forest of pikes behind.',
  'The Night Café': 'He wrote that he had tried to express “the terrible passions of humanity” in red and green, and to paint a place where a man could ruin himself.',
  'Starry Night Over the Rhone': 'A year before The Starry Night, painted on the riverbank after dark — by his own account with candles fixed to his hat brim for light.',
  'Benois Madonna': 'An early work that disappeared for centuries and resurfaced in Russia, reportedly in the keeping of a travelling musician.',
  'Sleeping Venus': 'Left unfinished when Giorgione died young; Titian is generally thought to have completed the landscape. Nearly every reclining nude since descends from this pose.',
  'The Yellow House': 'The house in Arles he rented for the artists’ colony he had been planning for years. The colony lasted nine weeks and ended with his ear.',
  'The Red Vineyard': 'Long described as the only painting he sold in his lifetime. That claim is probably too strong, but this one did sell, months before he died.',
  'The Church at Auvers': 'From his final weeks. The building is painted without a visible way in.',
  'The Tower of Babel': 'Built on the bones of the Roman Colosseum, and the lower storeys are already crumbling while the top is still going up.',
  'The Card Players': 'Five versions, and nothing happens in any of them — no stakes on the table, no drama, barely any eye contact. The stillness is the subject.',
  'The Tempest': 'Nobody has ever agreed what is happening in it. X-rays found a nude woman underneath the soldier, so Giorgione appears not to have been certain either.',
  'Portrait of Adele Bloch-Bauer I': 'Looted by the Nazis and recovered decades later by the sitter’s niece after a long legal fight — the case that became the film Woman in Gold.',
  'Saint John the Baptist': 'His last painting. The raised finger and that smile emerging from total darkness have unsettled viewers for five hundred years.',
  'La Belle Ferronnière': 'Nobody knows who she is. The title is an eighteenth-century filing error — it belongs to a different sitter altogether.',
  'Grande Odalisque': 'Critics said she had no bones. Her spine has since been measured as carrying roughly three vertebrae too many, which is exactly why the pose flows the way it does.',
  'Adoration of the Magi': 'Abandoned unfinished when he left Florence for Milan. Beneath the calm foreground the underdrawing holds a cavalry battle and a ruin.',
  'Madonna': 'Not a Madonna in any conventional sense. Some versions carry a foetus and sperm in the frame itself, which tells you plainly what he thought he was painting.',
  'The Calling of Saint Matthew': 'A shaft of light does the work a halo would have done. Which man at the table is actually Matthew is still argued over.',
  'A Burial at Ornans': 'A village funeral, painted at the scale reserved for kings and battles. The size was the scandal, not the subject.',
  'Where Do We Come From? What Are We? Where Are We Going?': 'Painted in Tahiti after a suicide attempt and intended as his testament. It reads right to left, from the infant to the old woman.',
  'Ivan the Terrible and his son Ivan on November 16, 1581': 'The instant after the blow, with the father’s face doing all the work. The Tsar banned it from display, and visitors have attacked it twice since.',
  'The Astronomer': 'The globe and the open book are real, identifiable objects, which is how the painting can be dated at all.',
  'Napoleon Crossing the Alps': 'He made the crossing on a mule, in fair weather, behind a guide. He instructed David to paint him “calm on a fiery horse”, and David did.',
  'The Yellow Christ': 'A Breton wayside crucifix set in a Breton field among Breton women, painted in flat blocks with the modelling stripped out of it.',
  'Lamentation of Christ': 'Foreshortened from the soles of the feet. The feet are painted smaller than true perspective demands, because true perspective would have made them monstrous.',
  'The Storm on the Sea of Galilee': 'His only seascape. Stolen from the Isabella Stewart Gardner Museum in 1990 and never recovered — the empty frame still hangs there.',
  'The Jewish Bride': 'Van Gogh said he would give ten years of his life to sit in front of it for a fortnight with nothing but a crust of bread.',
  'The Art of Painting': 'He never sold it, and his widow tried to keep it from the creditors when he died. It later passed through Hitler’s collection.',
  'Rokeby Venus': 'Slashed seven times with a meat cleaver in 1914 by the suffragette Mary Richardson, in protest at the arrest of Emmeline Pankhurst.',
  'The Sleepers': 'Two women asleep together, painted for a private collector and kept out of public view for decades.',
  'When Will You Marry?': 'Painted in Tahiti in his first year there. Reported in 2015 to have sold for the highest price ever paid for a painting, though the figure was later disputed.',
  'The Triumph of Death': 'An army of skeletons harvesting the living. In one corner a game of backgammon carries on regardless, which is both the joke and the horror.',
  'The Wedding at Cana': 'The largest painting in the Louvre. Napoleon’s troops cut it in half to carry it out of Venice.',
  'Sunset at Montmajour': 'Attributed to Van Gogh, then dismissed as a fake and left in an attic for most of a century, then re-authenticated in 2013.',
  'La fornarina': 'The armband carries Raphael’s own name, which is about as direct a claim on a sitter as painting allows. She is traditionally identified as a baker’s daughter he loved.',
  'Annunciation': 'An early work, and the Virgin’s right arm is far too long — it resolves correctly only if you stand below and to the right, which is where it originally hung.',
  'Doni Tondo': 'The only finished panel painting by Michelangelo that survives. He designed the frame too, and it counts as part of the work.',
  'The Little Street': 'One of only two Vermeer cityscapes. A 2015 study of Delft’s canal-tax records proposed an exact address for it.',
  'Las Hilanderas': 'Women spinning in the front room; behind them, lit differently, a tapestry of the Arachne myth. The everyday and the mythic sharing one space.',
  'Charles IV of Spain and His Family': 'The royal family rendered without a shred of flattery. Goya put himself at his easel in the shadows on the left, exactly as Velázquez had.',
  'L\'Absinthe': 'Denounced as ugly and degrading when it reached London. The two models were a friend and an actress, neither of them drinkers.',
  'The Beheading of Saint John the Baptist': 'The only painting Caravaggio ever signed — and he signed it in the blood running from the neck.',
  'Death of Sardanapalus': 'A king having everything he owns destroyed in front of him as he dies. The reception was hostile enough to set Delacroix back years.',
  'The Painter\'s Studio': 'Subtitled “a real allegory”, which is a contradiction on purpose. He paints a landscape in the centre while his supporters fill one half of the room and the world fills the other.',
  'The Blind Leading the Blind': 'Six blind men going into a ditch one after another. The eye conditions are painted precisely enough that ophthalmologists have diagnosed them individually.',
  'Morning in a Pine Forest': 'Shishkin painted the forest; another artist, Savitsky, painted the bears. The dealer wiped Savitsky’s signature off the canvas.',
  'The Baptism of Christ': 'The kneeling angel on the left is by Verrocchio’s teenage pupil Leonardo. Vasari claims his master never picked up a brush again.',
  'Madonna of the Carnation': 'Early Leonardo, and the Virgin’s face has a slumped, slightly melted quality — the result of him experimenting with the paint itself.',
  'Madonna Litta': 'The attribution is argued over. The design and the drapery look like Leonardo; the handling of the child, to many eyes, does not.',
  'Return of the Prodigal Son': 'A very late work. The father’s two hands are painted differently — one reads as a man’s, the other as a woman’s.',
};

/* Where you have already met these paintings — the derivative layer for the art
   half. Merged over REFS in paintings.mjs by build-art.mjs.

   Several of these are art quoting art rather than pop culture quoting art,
   which turns out to be the more interesting half: Manet's Olympia is a direct
   answer to Titian, and Picasso spent 1957 taking Las Meninas apart. Same rule
   as everywhere else in these files — only where I am confident. */
export const REFS_MORE = {
  'Girl with a Pearl Earring': [
    { what: 'Girl with a Pearl Earring', kind: 'novel', by: 'Tracy Chevalier', year: 1999 },
    { what: 'Girl with a Pearl Earring', kind: 'film', year: 2003 }],
  'Las Meninas': [
    { what: 'Las Meninas — 58 variations', kind: 'paintings', by: 'Pablo Picasso', year: 1957 }],
  'The Third of May 1808': [
    { what: 'The Execution of Emperor Maximilian', kind: 'painting', by: 'Édouard Manet', year: 1868 },
    { what: 'Massacre in Korea', kind: 'painting', by: 'Pablo Picasso', year: 1951 }],
  'The Raft of the Medusa': [
    { what: 'Rum Sodomy & the Lash', kind: 'album cover', by: 'The Pogues', year: 1985 }],
  'Ophelia': [
    { what: 'Melancholia', kind: 'film', by: 'Lars von Trier', year: 2011 }],
  'The Birth of Venus': [
    { what: 'The Adventures of Baron Munchausen', kind: 'film', year: 1988 },
    { what: "Italy's 10-cent euro coin", kind: 'coin', year: 2002, notATitle: true }],
  'Grande Odalisque': [
    { what: 'Do women have to be naked to get into the Met. Museum?', kind: 'poster', by: 'Guerrilla Girls', year: 1989 }],
  'The Swing': [
    { what: 'Frozen', kind: 'film', by: 'Disney', year: 2013 }],
  'Venus of Urbino': [
    { what: 'Olympia', kind: 'painting', by: 'Édouard Manet', year: 1863 }],
  'Luncheon on the Grass': [
    { what: "Le Déjeuner sur l'herbe, after Manet", kind: 'series', by: 'Pablo Picasso', year: 1961 }],
  'Napoleon Crossing the Alps': [
    { what: 'Napoleon Leading the Army over the Alps', kind: 'painting', by: 'Kehinde Wiley', year: 2005 }],
  'Mona Lisa': [
    { what: 'L.H.O.O.Q.', kind: 'readymade', by: 'Marcel Duchamp', year: 1919 },
    { what: 'Mona Lisa', kind: 'song', by: 'Nat King Cole', year: 1950 }],
};
