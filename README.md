# Commonplace

A quiz for literary and cultural references. Paintings, Shakespeare, and the
places they have already turned up — album covers, novel titles, films, emoji.

Personal project. Not GPA.

---

## The idea

A culture quiz goes bad in one predictable way: it becomes name-matching. "Who
painted *The Night Watch*?" is a fact, and knowing it does nothing for you.

So the unit of learning here is not a fact but a **reference**: a work, plus the
places it has already been used. That single choice drives everything else — the
modes, the scheduling, and the fact that the app spends most of its effort on the
card you get *after* answering rather than on the question.

## Accuracy by construction

Nothing in this app writes a quotation or a fact. It only locates one.

* **Shakespeare.** `build/curated/shakespeare-lines.mjs` holds *search keys*, not
  quotes. `build/build-text.mjs` finds each key inside the real Folger text and
  extracts the verbatim lines with their act, scene and speaker. A key that
  matches nothing is reported and dropped — so a half-remembered line fails the
  build instead of shipping as fact.

  This is not theoretical. Folger prints `To be or not to be--that is the
  question:`, where popular memory inserts a comma and drops the dash. It prints
  `By any other word would smell as sweet`, not *name*. The corpus wins, every
  time.

  **The unit is the sentence, not the printed line** (`build/locate.mjs`). A
  printed line is a typesetting decision, and extracting by line produced
  quotations cut at both ends: `Let me see. Alas, poor Yorick! I knew him,
  Horatio--a fellow of infinite`. That last one was the worst failure the app
  could have — the word *jest* fell off, so the item carrying the *Infinite
  Jest* reference did not visibly contain the phrase the novel is named after.
  Matches now expand to sentence boundaries and are then cut back into the
  edition's lines, so verse keeps its lineation and prose does not break where
  the measure ran out. Sentences too long to read on a phone fall back to clause
  breaks, then to printed lines.

* **Paintings.** Titles, artists, dates, movements and collections come from
  Wikidata; images from Wikimedia Commons. `build/curated/paintings.mjs` only
  decides which works matter most and what is worth saying about them, and every
  key in it is checked against the fetched data.

* **Copyright.** Only works whose creator died before 1956 ship, so everything is
  out of copyright. That filter is why Guernica, Nighthawks and the Warhols are
  not in the app despite being exactly the sort of thing it is about.

* **Pop culture** is deliberately not modelled as content — there is no free
  corpus of it and it is copyright-locked. It appears instead as the *derivative
  layer*: a stored relation between a canonical work and what borrowed it.
  *Band of Brothers* ← Henry V. *Infinite Jest* ← Hamlet. Coldplay's *Viva la
  Vida* ← Delacroix. Pure text, reproduces nothing.

## Visual language

Deliberately the same family as Halyard and Reckoner, because these are a set of
tools rather than one-offs: Bricolage Grotesque for display, Instrument Sans for
UI, an 18px radius, a 56px tap target, one hue doing all the signalling, and few
things on any screen — a hero, one stat block, one promoted action, then
everything else folded under "More ways to play".

What changes per app is the hue. Halyard is orange, Reckoner green; Commonplace
is ink blue with gilt, for a commonplace book and a gilded frame. The home hero
is a picture rail — real paintings from the set, hung and reshuffled each visit
— which is Halyard's bunting idea pointed at this subject.

The one departure: EB Garamond, used *only* for the quotations and painting
titles. Shakespeare set in a UI sans reads like a push notification. The chrome
stays in the family; the content gets the face it deserves.

## The modes

Each drills a different move; that is why there are several rather than one with
a filter.

| Mode | What it asks |
|---|---|
| **Eye** | A painting, starting tight on one detail and pulling back as the clock runs. Answer early for more. |
| **Cadence** | A line arrives a word at a time — name the play before it finishes. |
| **Voices** | Whose mouth it comes out of, which is usually the part that changes what it means. |
| **Blanks** | One word removed. The mode that puts a line in your mouth rather than just your eye. |
| **Provenance** | Titles and what they quote, in both directions. |
| **Sequence** | Four works, oldest first. Not lookup — the map that makes a reference land. |
| **Training** | Untimed and adaptive: what is due for review, and what you keep getting wrong. |

## How it decides you know something

* Progress is per **(item, facet)**, not per item. A painting can be asked five
  ways and knowing the artist is not knowing the title. Scheduling knows the
  facets are siblings so it will not ask you all five in a row, but mastery is
  counted separately.
* Leitner boxes with the usual widening intervals. Training serves the most
  overdue first.
* Every wrong answer is recorded as a **confusion pair** — which wrong answer,
  not merely that you were wrong. Make the same mistake twice and the home screen
  offers a head-to-head drill that puts those two on the board every question.
  Clear the drill and the confusion clears with it.

## Running it

Double-click **Launch Commonplace.bat**. That is all — it starts a dependency-free
static server on <http://localhost:8794> and opens it.

## Rebuilding the data

Sources are cached under `sources/`, so every step after the first works offline.

```
node build/fetch-shakespeare.mjs    # 38 Folger texts  -> sources/folger/
node build/build-text.mjs           # locate the lines -> app/data/text.json
node build/fetch-art.mjs            # Wikidata query   -> sources/wikidata-paintings.json
node build/build-art.mjs            # select + rank    -> app/data/art.json
node build/fetch-images.mjs         # Commons originals-> sources/img-cache/
python build/encode_images.py       # WebP + blur LQIP -> app/img/, app/data/lqip.json
python build/make_icons.py          # app icons
node build/make-deploy.mjs          # docs/ for GitHub Pages
```

`encode_images.py` needs Pillow. Behind the GPA proxy that means:

```
python -m pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org Pillow
```

## Deploying

`node build/make-deploy.mjs` writes `docs/`. Point GitHub Pages at `main` `/docs`.
It refuses to build if any file in the service worker's precache list is missing,
because a single 404 there rejects the install and kills offline support with no
visible error.

## Traps found the hard way

Worth knowing before changing anything.

* **Folger's download URLs resolve by prefix.** Ask for `richard-iii` and you are
  quietly served *Richard II*; ask for `henry-viii` and you get *Henry V*. Status
  200, genuine Folger text, wrong play. The fetcher goes straight to the S3
  objects and verifies the play's title on every file, on fetch and on reuse.
* **CacheStorage is per origin, not per app.** All of these little apps share
  `robertwalterj.github.io`. So the service worker never calls the global
  `caches.match()` (it searches every app's cache) and never deletes a cache
  merely because it is not its own (that would have wiped Halyard's).
* **`[hidden]` loses to an explicit `display`.** The boot screen is
  `display: grid`, so it needed its own `.boot[hidden]` rule or it never went
  away.
* **`requestIdleCallback` pulled off `window` throws.** It did so synchronously
  inside a view switch, so the library rendered and then never appeared.
* **Sentence-level extraction can collide.** Once matches expand to sentences,
  two curated fragments in the same sentence produce the same quotation twice —
  "there's the rub", "what dreams may come" and "shuffled off this mortal coil"
  are one sentence of Hamlet. The build merges them into a single item that
  carries every derivative and idiom the sentence produced, and reports each
  merge rather than doing it silently.

## Sources and terms

* Quotations: **Folger Shakespeare Library**, Folger Digital Texts —
  <https://www.folger.edu/explore/shakespeares-works/download/> — free for all
  non-commercial use. This app is personal and non-commercial, and cites the
  Folger edition on every quotation.
* Paintings and metadata: **Wikidata** (CC0) and **Wikimedia Commons**. Each item
  records the exact Commons filename it came from.
* Type: EB Garamond and Instrument Sans, both OFL, both self-hosted so the app
  works offline.
