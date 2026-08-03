# Editing the Cola site

Copy lives in `content/`. Edit the markdown, then the page is rebuilt from it.
`index.html` is generated — anything typed into it is lost on the next build.

```
site/
  content/          ← edit these
    site.md           page title, meta description, currency, slider defaults
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
them exactly as the app does. Values are in the currency set in `site.md`.

Change any of it and the plan screen recalculates from the new numbers, since the
ranking and the split are computed in the page rather than written down.

## Publishing

`index.html` is self-contained — no build step on the host, no assets, no
requests. Drop it on any static host. In `6-get.md`, set `button_href` to the
Glaze URL; while it stays `#` the button renders as disabled.
