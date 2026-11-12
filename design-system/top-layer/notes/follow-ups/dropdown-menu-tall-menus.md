# Follow-up: DropdownMenu tall menus on top layer

**Status:** Held 2026-11-10 (user decision). The fix below was taken out of the content-sized flip
floor change ([../decisions/fit-available-space.md](../decisions/fit-available-space.md) → _Update
(2026-11-02)_). `DropdownMenu` keeps `blockSize: 'content'` on the top-layer path for now.

**2026-11-12:** step 1 of the recommendation (approach B) is done in the same change: in Chrome the
content-sized floor has no 150px term. See
[../decisions/fit-available-space.md](../decisions/fit-available-space.md) → _Update (2026-11-12)_.
Reason 1 under "Why it is held" no longer applies in Chrome. Reason 2 (Safari and Firefox pad short
menus) still does, so the DropdownMenu fix is still held.

## Problem

On the top-layer path, a `DropdownMenu` taller than the space below its trigger does not fit that
space. Its only cap is the `maxHeight` of `MenuGroup` (or of the menu wrapper, with
`platform-dst-new-menu`): `calc(100vh - 16px)`. The legacy menu was in the page flow when
`shouldRenderToParent` was set, so the page could scroll to its last items (adminhub remove-domain).
A top-layer menu is not in the page flow, so no page scroll reaches them.

Measured 2026-11-09 with `platform-dst-top-layer` on: a 1280x720 viewport, a 32px trigger at y=192,
a menu of 40 items (`shouldRenderToParent`):

| Engine                                                | Master                                                                                     | With the fix below                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Chromium 143                                          | Below the trigger at y=232, 704px tall, so it ends at y=936: the last items are off screen | Below the trigger, 483px tall, ends 5px above the viewport bottom, scrolls to all items |
| WebKit 26                                             | 704px tall from y=16: on screen, but it covers the trigger                                 | Below the trigger, 483px tall, scrolls                                                  |
| Firefox (Playwright build, no CSS anchor positioning) | 704px tall from y=16, covers the trigger (JavaScript fallback)                             | The same as master: the fallback has no cell cap                                        |

## The fix that is held

In `dropdown-menu-top-layer.tsx`:

```ts
useAnchoredPopover({
	// ...
	blockSize: topLayerPlacement.axis === 'inline' ? 'content' : 'max-available',
});
```

Only on `top-*` and `bottom-*` placements. On a `left-*` or `right-*` placement (for example a
nested menu) the placement axis is inline, and fitting would also fit it: a nested `right-start`
menu with 180px to its right stayed on the right at 167px with wrapped labels, where master flips it
left at its own 232px.

## Why it is held

1. **The 150px default floor makes a tall menu shrink rather than flip.** A fitting popover flips
   only when its floor does not fit: `min(menu, 150px) + gap + 5px`. A menu taller than 150px that
   fits on the other side now stays and scrolls. For example, a 300px menu with 250px below and
   518px above opens below at 237px. Master and legacy open it above at 300px.
2. **Safari and Firefox pad short menus to 150px.** They do not support `calc-size()`, so the floor
   is the plain 150px and the surface stretches to it. A 2-item menu went from 92px to a 150px
   surface in WebKit 26.

## Approaches measured

Probe pages, 2026-11-10, Playwright Chromium 143 and WebKit 26. An 800x800 viewport, a 32px trigger,
an 8px gap, 5px viewport padding, a 200px wide menu inside an `overflow: auto` surface, on a
`Popover` host as the recipe writes it. The base position is `block-end span-inline-end`, with
`position-try-fallbacks: block-end, block-end span-inline-start, flip-block, flip-block flip-inline, block-start`.
Firefox in Playwright has no anchor positioning, so it is not in the table.

`<half>` is `max(0px, calc((100dvh - anchor-size(self-block)) / 2 - 8px - 5px))`: half the space
beside the anchor, less the gap and the padding.

- **M (master):** `max-block-size: calc(100dvh - 2 * 5px)`. No cell cap and no floor.
- **A (today's recipe):** cell cap `max-block-size: calc(100% - 5px - 8px)`, plus
  `--ds-popover-flip-floor: min(150px, <half>)` and
  `min-block-size: var(--ds-popover-content-sized-flip-floor, var(--ds-popover-flip-floor))`.
  `Popover`'s stylesheet defines
  `--ds-popover-content-sized-flip-floor: calc-size(max-content, min(size, var(--ds-popover-flip-floor)))`
  inside `@supports (min-block-size: calc-size(max-content, size))`.
- **B (no 150px cap where `calc-size()` is supported):** as A, but the content-sized floor is
  `calc-size(max-content, min(size, <half>))`. Elsewhere it is A.
- **C (most height first):** A plus `position-try-order: most-height`.
- **D (full size first, then fit):** base `min-block-size: max-content` with the cell cap, so a
  position fails when the whole menu does not fit. The fallbacks list the five positions at full
  size, then the same positions fitted:
  `..., --ds-fit, --ds-fit flip-inline, --ds-fit-centre, --ds-fit flip-block, --ds-fit flip-block flip-inline, --ds-fit-start`,
  where
  `@position-try --ds-fit { min-block-size: var(--ds-popover-content-sized-flip-floor, var(--ds-popover-flip-floor)); }`,
  and `--ds-fit-centre` and `--ds-fit-start` also set `position-area: block-end` and
  `position-area: block-start`.

Results, as "side height". "Fit" means that no side holds the whole menu.

| Case (menu, space below / above) | Legacy    | Engine   | M                       | A         | B         | C         | D                      |
| -------------------------------- | --------- | -------- | ----------------------- | --------- | --------- | --------- | ---------------------- |
| 92px, 668 / 100                  | below 92  | Chromium | below 92                | below 92  | below 92  | below 92  | below 92               |
|                                  |           | WebKit   | below 92                | below 150 | below 150 | below 150 | below 92               |
| 92px, 60 / 708                   | above 92  | Chromium | above 92                | above 92  | above 92  | above 92  | above 92               |
|                                  |           | WebKit   | above 92                | above 150 | above 150 | above 150 | above 92               |
| 92px, 300 / 468                  | below 92  | Chromium | below 92                | below 92  | below 92  | above 92  | below 92               |
|                                  |           | WebKit   | below 92                | below 150 | below 150 | below 150 | below 92               |
| 200px, 180 / 588                 | above 200 | Chromium | above 200               | below 167 | above 200 | above 200 | above 200              |
|                                  |           | WebKit   | above 200               | below 167 | below 167 | below 167 | above 200              |
| 300px, 250 / 518                 | above 300 | Chromium | above 300               | below 237 | above 300 | above 300 | above 300              |
|                                  |           | WebKit   | above 300               | below 237 | below 237 | below 237 | above 300              |
| 300px, 400 / 368                 | below 300 | Both     | below 300               | below 300 | below 300 | below 300 | below 300              |
| 1000px, 300 / 468                | fit       | Chromium | below 790, off screen   | below 287 | above 455 | above 455 | below 1000, off screen |
|                                  |           | WebKit   | 790, covers the trigger | below 287 | below 287 | below 287 | below 287              |
| 1000px, 250 / 518                | fit       | Chromium | below 790, off screen   | below 237 | above 505 | above 505 | below 1000, off screen |
|                                  |           | WebKit   | 790, covers the trigger | below 237 | below 237 | below 237 | below 237              |
| 1000px, 518 / 250                | fit       | Chromium | below 790, off screen   | below 505 | below 505 | below 505 | below 1000, off screen |
|                                  |           | WebKit   | 790, covers the trigger | below 505 | below 505 | below 505 | below 505              |

Why each one falls short:

- **M** is the bug: a tall menu runs off screen in Chromium and covers its trigger in WebKit.
- **A** shrinks a menu taller than 150px instead of flipping it, and pads short menus to 150px in
  Safari and Firefox.
- **B** matches legacy in every Chromium case: it flips when the other side holds the whole menu,
  fits on the roomier side when no side does, and keeps short menus at their size. It works because
  the floor is never more than half the space beside the anchor: if the popover stays on a side and
  is capped, the other side is at most that half, so it could not hold the whole menu either. It
  falls short because it needs `calc-size()`, so Safari and Firefox stay at A. It also changes the
  `@atlaskit/top-layer` recipe, so every fitting popover in Chrome changes (Select menus,
  `<Popup shouldFitViewport>`): content between 150px and half the viewport flips instead of
  scrolling where it is. The fit browser tests and notes assume the 150px floor and need updates.
- **C** flips a short menu that fits below to the roomier side (the "92px, 300 / 468" row), which
  neither legacy nor master does. WebKit 26 reports support for `position-try-order` but it has no
  effect here.
- **D** matches legacy in every WebKit case, and keeps short menus at their size without
  `calc-size()`. Chromium 143 does not apply the sizing of a `@position-try` rule reliably: it
  applies it when the rule comes right after `flip-block`, but not when the rule is first in the
  list, or after `flip-inline`, `block-end` or the alignment fallbacks. Then it keeps the base
  position, so a menu taller than both sides runs off screen. D also needs named `@position-try`
  rules in a stylesheet, which an inline style cannot hold. Top layer would have to inject one (as
  in [viewport-edge-gap.md](./viewport-edge-gap.md)).
- **A menu-specific floor** does not work either. `min-block-size: max-content` with no clamp means
  that no side holds a tall menu, so it runs off screen. A `placement.minSize` that uses
  `calc-size()` is dropped in Safari, so the menu never flips there.

## Recommendation

1. **Done 2026-11-12.** Do B in Chromium as its own change to the recipe, with its tests and notes.
   It needs no new API: `useAnchoredPopover` writes `<half>` to a custom property, and the
   `@supports` rule in `Popover` uses it in place of the 150px floor.
2. Then land the DropdownMenu fix above, on `top-*` and `bottom-*` placements only. Safari and
   Firefox would still pad short menus to 150px, and still shrink tall menus rather than flip them.
3. Revisit D when Chromium applies sizing in `@position-try` rules reliably. D is the only approach
   measured that also fixes Safari and Firefox.
