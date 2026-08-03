# Changelog

Newest first. One entry per published change to the site.

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
