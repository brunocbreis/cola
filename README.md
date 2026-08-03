# Editing the Cola site

Copy lives in `content/`. Edit the markdown, then the page is rebuilt from it.
`index.html` is generated — anything typed into it is lost on the next build.

```
site/
  content/          ← edit these
    site.md           page title, meta description, currency, locale, slider defaults
    1-title.md        opening screen
    2-tree.md         the tree screen
    3-plan.md         the plan screen
    4-order.md        rank / split / skip
    5-keys.md         app shortcuts
    6-get.md          download screen
    portfolio.md      the example holdings
  template/page.html  layout, styles, behavior
  build.mjs           the builder
  index.html          generated — do not edit
```

## Writing a screen

Everything above the second `---` is settings, everything below is copy.

```markdown
---
id: tree
eyebrow: Screen 2 · the tree
heading: Holdings sit in groups
hints: ↓ ↑ = screens | ← → = select
---
A normal paragraph.

Another paragraph, in the same lighter gray.

> A line starting with > becomes the small tertiary note.

| ⌘K | Rows of a table become the key-and-description grid |
| ⌘P | One row per pair |
```

`*single asterisks*` render as the gray de-emphasized text used in the h1.
`**double**` renders bold. `hints` fills the status bar: `KEY = label`,
separated by `|`.

## Screen order

The number in the filename sets the order and the `1`–`6` jump keys. Renaming
`4-order.md` to `5-order.md` and `5-keys.md` to `4-keys.md` swaps them, with no
other change. Adding `7-faq.md` adds a seventh screen.

## Dormant and awake

Screens 2 and 3 hold the arrow keys only after you press Return on them, and give them
back on Escape — the same pair the app uses to enter and leave a group. Until then they
sit dimmed, and the arrows move through the deck as they do everywhere else.

Four frontmatter keys drive it:

```markdown
hints: ↓ ↑ = screens | Return = use this screen
hints_active: ← → ↑ ↓ = move | Return = open group | Escape = done
prompt: a real grid — Return to move around it
prompt_active: arrows move · Return opens a group · Escape when done
```

`prompt` is the line printed above the widget while dormant, `prompt_active` replaces it
once the screen has the keys, and the `Return` chip beside it becomes `Escape`. The
status bar swaps `hints` for `hints_active` at the same moment.

## The two live screens

`2-tree.md` and `3-plan.md` carry `widget: tree` and `widget: plan`, which is
what mounts the interactive block grid and the calculator. Their frontmatter
holds the labels those widgets print:

- `{name}` in the `note_*` keys becomes the selected group's name.
- `{sum}`, `{pct}`, `{total}`, `{projected}` are filled with computed figures.

Removing a `widget:` line leaves the prose and drops the interactive part.

## Phones and tablets

A device with a coarse pointer and no hover takes a separate path. Both widgets are
awake from the start, since there is no Return to press: groups open on tap, a `‹`
button in the breadcrumb goes back up, the amount field opens the numeric keypad, and
the slider is dragged. The deck itself snaps one screen per swipe, however hard it is flicked.

A screen taller than the phone — which the two widget screens are, on most — aligns to its
top edge and scrolls within itself, then hands the next swipe on to the screen below.

Four frontmatter keys hold the wording for it, each falling back to its plain
counterpart when absent:

```markdown
hints_touch: tap a group = open it | ‹ = back
prompt_touch: tap a group to look inside it
prompt_kbd_touch: Tap
note_group_touch: Tap any group to look inside it.
```

Any `note_*` key takes a `_touch` twin the same way.

A block of copy can also belong to one kind of device, by opening with `[touch]` or
`[desktop]`:

```markdown
> [desktop] Six screens. Use the arrow keys to move through them.

> [touch] Six screens. Swipe up to move through them.
```

Both are written into the page and one is hidden by media query, so a phone that
reports a mouse still reads sentences that match its input.

## The example portfolio

`portfolio.md` is one table. Depth is the number of leading dashes:

```
| United States | 50 | | | | |
| - FTSE 100 | 50 | VUKE | 32.90 | 900 | |
| -- deeper still | | ABC | 10.00 | 100 | |
```

A row with children needs no ticker, price, or value — those sum from below.
`yes` in the Shared column marks a group whose holdings are interchangeable
alternatives sharing one target, which is what makes the plan offer them as
`12.4 × EIMI or 7.0 × VFEM`. Weights need not total 100; the page normalizes
them exactly as the app does. Values are plain numbers, read in the visitor's own
currency — see below.

Change any of it and the plan screen recalculates from the new numbers, since the
ranking and the split are computed in the page rather than written down.

## The reader's own currency

Cola takes its base currency from the system it runs on, and the page does the same. A
reader in Paris gets `10 000 €`, one in São Paulo `R$ 10.000`, one in New York
`$10,000` — along with that locale's grouping marks, decimal comma or point, and percent
spacing.

The locale comes from `navigator.languages`. The currency comes from the locale's region
through a table in the template; a language with no region is resolved by CLDR first, so
a bare `pt` lands on Brazil and `fr` on France. `Intl.NumberFormat` then decides
everything else, including which side of the digits the symbol belongs on and whether a
space goes between. The amount field follows: it hugs its digits so the symbol sits
beside them, shows grouped figures at rest, and switches to bare digits while typed into,
since separators fight the caret.

Three keys in `site.md` govern it:

```markdown
currency: $          symbol written into the page before scripts run
currency_code: USD   ISO code used when the visitor's region is unknown
locale: en-US        notation used in the same case
follow_visitor: yes  set to no to show that one currency to everyone
```

The figures are relabelled rather than converted — the same `505.10` reads as
`$505.10` or `R$ 505,10`. They are an example either way, and an example lands best in
the units the reader already thinks in. Pin `follow_visitor: no` for a single currency
everywhere.

## Publishing

`index.html` is self-contained — no build step on the host, no assets, no
requests. Drop it on any static host. In `6-get.md`, set `button_href` to the
Glaze URL; while it stays `#` the button renders as disabled.
