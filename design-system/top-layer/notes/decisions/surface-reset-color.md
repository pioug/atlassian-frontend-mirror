# The surface reset sets `color`

> Why the `Popover` and `Dialog` hosts reset `color` to `token('color.text')`, and why this reverses
> the earlier choice to leave `color` out.

## Status

**Decision recorded 2026-10-07.** This reverses the `color` row of
[`phase0b-rung1-surface-reset-gaps.md`](../plans/unsafe-selectors-prework/phase0b-rung1-surface-reset-gaps.md)
("leave-out: largest VR blast radius and ADS surfaces set their own text color") and the matching
claim in
[`surface-style-abstraction.md`](../plans/unsafe-selectors-prework/surface-style-abstraction.md).
Before this note, the surface reset had no decision note. Its only recorded justification was the
source comment "Excludes `color`/`font` (theming)".

## Decision

`surfaceResetStyles` sets `color: token('color.text')` on both hosts:

- `Popover`: `src/popover/popover.tsx`
- `Dialog`: `src/dialog/dialog-content.tsx`

The shared identity-checked type `TSurfaceReset` in `src/internal/surface-reset.tsx` carries the
same declaration, so the two copies cannot drift.

`font` stays excluded. `direction` and `unicode-bidi` stay excluded.

## Why

1. **The host never inherited a colour.** The HTML spec sets `color: CanvasText` and
   `background-color: Canvas` on `[popover]` and on `dialog`. The Chromium, WebKit and Firefox UA
   stylesheets all ship this rule. So "exclude `color` so that it inherits (theming)" was never
   possible: the host always got `CanvasText`. `font` is different. It really does inherit, so its
   exclusion stays.
2. **It is a reset, not an opinion.** `color.text` cancels the UA `CanvasText` in the same way that
   the existing `background: transparent` cancels the UA `Canvas`. It restores the colour that
   `<body>` gave the portal path (`css-reset/src/base.tsx:16-19`). The host root styles hold only
   resets, and this declaration is one.
3. **No tokenless value works.**

   | Value                              | Result on the host                                      |
   | ---------------------------------- | ------------------------------------------------------- |
   | `inherit`, `unset`, `currentcolor` | the trigger's colour: the leak the reset exists to stop |
   | `initial`, `revert`                | `CanvasText`                                            |
   | `token('color.text')`              | the `<body>` colour of the portal path                  |

4. **Descendants always win.** `color` inherits, so any colour set inside the surface beats the
   host. Surfaces may still set their own colour; it always wins. No ADS consumer sets `color` on
   the host.
5. **The earlier premise was false.** "ADS surfaces set their own text color" does not hold for
   Drawer: its top-layer surface (`drawer/src/drawer-panel/drawer-top-layer.tsx:65`) sets no colour.

## Visible effect

Text that sets no colour changes from the system colour to the ADS text colour:

| Theme | Before (`CanvasText`) | After (`color.text`) |
| ----- | --------------------- | -------------------- |
| Light | `#000`                | `#292A2E`            |
| Dark  | near-white            | `#CECFD2`            |

This fixes text that sets no colour of its own:

- Drawer's top-layer surface
- custom tooltip components
- Popper render-prop content
- raw Spotlight text

Visual regression snapshots of these surfaces change by this colour shift. That is the expected
change, not a regression.

## The imperative popper adapter is different

`popper/src/create-popper-top-layer.tsx:147` uses `color: inherit`, and that is deliberate. The
adapter promotes an element that the caller already styled and placed. Promotion must change only
paint order, so the element must keep the colour it had before promotion. The host reset above is
for surfaces that `@atlaskit/top-layer` renders itself.

## Rejected: keep `color` out

Leaving `color` out keeps the UA `CanvasText` on every surface that does not set its own colour.
That is a system colour, not an ADS colour, and it does not follow the ADS theme. The VR blast
radius that the earlier analysis cited is this colour shift, and the shift is the fix.
