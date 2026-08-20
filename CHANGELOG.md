# Changelog

Newest first. One entry per published change to the site.

## A block is one size — 7 August 2026

Going into a group made the blocks taller, and coming back out made them shorter. The app
has no such behaviour: a block is one size, and a level with two holdings shows two of them
and ends sooner. The site now agrees.

- The cause was where the room was kept. The widget holds height for the deepest level
  anyone can open, so that opening a shallow one does not pull the screen upward, and that
  reservation sat on the grid — where CSS grid's default hands spare room to the rows. Four
  holdings drew four short blocks, two drew two tall ones.
- The reservation moved to the widget, and the grid keeps its rows at their own height. A
  block is 90px at every level of every portfolio now, at every window width.
- The foot line follows the last block again instead of being pushed to the bottom of the
  reserved space, which is where the app puts it. The slack a shallow level leaves sits
  under all of it, out of the way.
- Nothing above or below moved: the widget measures the same at every depth, as before.
- A shared group's children stay shorter than other blocks by the height of the target bar,
  since they have no target and so no bar. That is the app's own arrangement, not a
  leftover from this.

## An equal-weight group in the examples — 7 August 2026

The app grew a third kind of group, where the children split the target evenly and Cola
redoes the split whenever one is added or removed. The tree screen can show one now, and
one of the example portfolios does.

- "Individual stocks", in the By asset class portfolio, is that group. It held Berkshire
  and Costco at a hand-typed 50/50 — the exact arrangement the feature removes — and now
  holds three names, LVMH among them, at 33,3% each. Nobody types 33,3.
- The card carries an `EQUAL` tag where a shared group carries `SHARED`, so it reads from
  the top level of that tab without drilling in. Selecting it says what the kind means, the
  way selecting a shared group already did.
- Inside it, the targets readout is left out. It would answer a question the level cannot
  be in, since Cola owns those numbers and they always sum to 100. The app omits it there
  for the same reason.
- A target now prints its decimal when it has one: 50 still reads 50%, and a third of an
  equal group reads 33,3% rather than a rounded 33% that no one chose. The rule is the
  app's, and it changes nothing for the other two portfolios, whose weights are whole.
- The plan reads the group as ordinary — it descends into it and ranks the children by how
  far behind they are, so LVMH at 20% of a 33,3% target leads the orders while Berkshire,
  past its share, is skipped and never sold.
- In `portfolio.md` the Shared column is now Kind, taking `shared`, `equal`, or nothing at
  all for separate targets — the same three answers the app asks for. `yes` still means
  shared, so nothing already written has to change.

## A run log on screen 4 — 4 August 2026

Screen 4 argued that every line is a buy, in prose only. It now shows one, as a picture of
the app rather than something to read.

- The app's run-log dialog at the width it really is, 390px, above the eyebrow. Built from
  the same ledger row: ticker, quantity × price, total.
- Its top edge is solid and it dissolves down its height, over pixel stops rather than
  percentages, so the first rows stay legible whether the run has one order or six.
- The eyebrow starts 11px under the last row. By that point the panel is down to a tenth of
  its strength, so the nearness is what makes the fade read as deliberate rather than
  leaving a band of empty space between the picture and the words.
- Dimmed, cropped by a gradient, and receding row by row, so it reads as one object rather
  than a table asking to be totalled. No Committed line — a sum invites arithmetic.
  `aria-hidden`, because the prose beside it says the same thing.
- Screens 4, 5 and 6 name themselves in the eyebrow, as 2 and 3 already did: the run, the
  keys, the app. Screen 5 held "the app" while showing shortcuts, so it takes "the keys"
  and screen 6, which is where the app is downloaded, takes "the app".
- The rows are the plan from screen 3, so changing the amount, the order limit or the
  portfolio changes them. Quantities round down to a tenth of a share and totals to the
  cent, as the app records them, so nothing in the picture contradicts the app.
- Only bought lines appear. An asset past its target is absent rather than struck through,
  which is the screen's claim.
- `[widget]` on its own line in a screen's markdown says where its widget sits among the
  paragraphs. Without one the widget goes after all of them, as before.

## Snappier screen changes — 4 August 2026

- Screen changes are animated by the page rather than by `scroll-behavior:smooth`, over
  330ms on an ease-out curve. The native keyword is ease-in-out and lasts roughly half
  again as long, spending its first third accelerating, which read as slow next to the app.
- `scroll_ms` in `site.md` sets the duration; `?ms=` overrides it for one visit.
- The key hints no longer light up when a key is pressed. Two of those highlights never
  worked: `↓`, `↑` and `1`–`6` re-rendered the hint bar in the same tick, discarding the
  element that had just been marked, and a plain `→` lit both the plain and the Option row
  because the match was a substring test.
- An awake grid keeps the vertical arrows and stops at its edges. Pressing `↓` on the
  bottom row used to change screen, so overshooting a selection left the widget entirely.
- The screen counter no longer steps through the screens passed on the way to a distant
  one. The active screen is read from the scroll position, which was still running while
  the page scrolled itself.
- `motion: off` in `site.md`, or `?motion=off`, removes every desktop transition. Touch
  keeps the platform's momentum and snap in all cases.

## Copy pass — 4 August 2026

Tightened the wording on the tree and plan screens.

- Screen 2 leads with what groups are for rather than the fact that they are optional.
- Screen 3 has separate desktop and touch instructions, naming the arrow keys or the
  slider instead of describing both to everyone.
- The tab strip is called the portfolio in both hint bars. It was the strategy under
  plain arrows and the portfolio under Option, which read as two different actions.
- One name for the order-limit control: the slider, in prose and in the hint bar.
- Screen 6 describes the download instead of telling visitors to click a button that is
  disabled until Cola is published.

## Option-arrows switch portfolios — 3 August 2026

- `⌥← ⌥→` pick a portfolio while the grid is awake, where the plain arrows are busy
  moving the selection. All three can now be compared without leaving the grid.
- Command and Control combinations are returned to the browser untouched. The arrow
  handlers had been reading them as plain arrows and calling `preventDefault`, so `⌘←`
  was blocked as Back whether or not the page wanted it.
- Listed in the status bar as `⌥← ⌥→ = portfolio`, last of the four, since a narrow
  window drops hints past the third and `Escape` earns its place first.

## Nothing moves, and a wide window gets used — 3 August 2026

Two faults, both visible while browsing rather than on arrival.

- The note under the grid and the caption under the tabs change length as the reader
  moves around, and a centred screen turned every extra line into a shift of everything
  above it. Each now keeps the height of its own longest wording, measured at the width
  it occupies and re-measured when the window changes.
- Drilling into a group with fewer holdings shortened the grid, which moved the screen
  the same way. The grid keeps the height of the deepest level anyone can open.
- Above 1000px the page widens to 820px and the type grows; above 1400px, 960px. Holding
  a phone-width column on a large display left the grid clipping names it had room to
  print, and the headings smaller than the screen could carry. Running prose keeps its
  measure, which is a reading limit rather than a spare-room one.

## Copy pass, and the plan screen loses its prompt — 3 August 2026

- The plan screen no longer prints a line telling the reader it is live. The amount field,
  the slider and the orders under them say it by working.
- A widget prints a prompt row only when its screen writes one, rather than an empty chip
  standing in for the absent text.
- Reworded the tree screen's opening, the region caption, and the touch note on the
  shortcuts screen.

## Three ways to group — 3 August 2026

The tree screen argued that groups are useful with a single example, which only made the
case for that one reader. It now carries three.

- `portfolio.md` holds one strategy per `##` heading: by region, by industry, by asset
  class. Each is a tab on the tree screen, with a caption making the case for it.
- Both widgets read the selected strategy, so the plan on screen 3 is computed from the
  grouping showing on screen 2.
- `← →` pick a strategy while the tree screen is dormant, where the grid has no selection
  for them to move. Tabs are buttons, so they stay clickable and tappable in any state.
- The dormant note counts the groups and holdings of the strategy showing, rather than
  naming one portfolio's figures.

## One screen per swipe — 3 August 2026

Touch scrolling had gone continuous, losing the sense of one screen at a time.

- Restored `mandatory` snapping on touch, which an earlier `proximity` setting had
  loosened to make room for content that has since been tightened to fit.
- `scroll-snap-stop: always` holds each screen for a swipe, however hard it is flicked.
- Screens taller than the phone align to their top edge instead of their centre, so both
  ends stay reachable.
- The touch rules moved to the end of the stylesheet, where the width breakpoints above
  can no longer undo them — which is why the earlier tightening had no effect.
- Row heights, type sizes and paddings tighten again below 760px of viewport height.
- The active screen is read from the scroll position rather than an intersection
  threshold, which a screen taller than the viewport could never meet.

## The reader's own currency — 3 August 2026

Every figure on the page is now read in the visitor's own money and notation, the way
the app takes its base currency from the system it runs on.

- Locale from `navigator.languages`; currency from that locale's region, with CLDR
  resolving a language that carries no region.
- `Intl.NumberFormat` handles symbol placement, grouping marks, decimal separator and
  percent spacing, so Paris sees `10 000 €`, São Paulo `R$ 10.000`, New York `$10,000`.
- The amount field measures its own text and hugs it, keeping the symbol beside the
  number; grouped at rest, bare digits while typed into.
- `follow_visitor: no` in `site.md` pins one currency for everyone.
- Percent signs moved out of the copy and into the formatters, which place them per
  locale — `100%` against `100 %`.

## Touch support — 3 August 2026

The deck now reads the device and offers the matching gesture for every keyboard
interaction it had.

- Detects a coarse pointer without hover, and takes a separate interaction path.
- Both widgets are awake from the start on touch, dropping the Return-to-engage step
  that has no equivalent on a phone.
- Groups open on tap; a `‹` button in the breadcrumb goes back up.
- The amount field opens a numeric keypad; the slider is dragged.
- Vertical swipe scrolls and snaps between screens.
- Copy blocks can be marked `[touch]` or `[desktop]`, and `hints`, `prompt` and every
  `note_*` key take a `_touch` variant, so the instructions name the gesture at hand.
- Row heights and paddings tighten on small screens, keeping all six screens within one
  390 × 844 view.

## Publishing notes — 2 August 2026

Set up GitHub Pages and wrote down how to release.

## Cola landing page — 2 August 2026

First version: six screens generated from markdown into a single self-contained
`index.html`, with an interactive tree explorer and a live purchase-plan calculator.
