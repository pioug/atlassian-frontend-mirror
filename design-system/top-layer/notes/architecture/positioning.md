# Positioning

How `@atlaskit/top-layer` positions popovers relative to triggers, using the modern CSS Anchor
Positioning API with a JavaScript fallback for older browsers.

## Two paths

The implementation has two paths chosen at runtime:

1. **CSS Anchor Positioning** (modern browsers) — uses `position-anchor`, `position-area`,
   `position-try-fallbacks`, and logical margins. The browser handles flipping. Set
   `forceFallbackPositioning` to test the fallback path on supporting browsers.

2. **JavaScript fallback** — measures the trigger via `getBoundingClientRect()`, computes `top` /
   `left` for the popover, and re-runs on scroll/resize events.

## Placement model

The `TPlacement` shape encodes positioning intent:

- **`axis: 'block' | 'inline'`** — which axis the popover sits on (block = vertical, inline =
  horizontal).
- **`edge: 'start' | 'end'`** — which side of the trigger (start = top/left in LTR, end =
  bottom/right in LTR).
- **`align: 'start' | 'center' | 'end'`** — cross-axis alignment of the popover with the trigger.
- **`offset: { gap, shift }`** — see Offset model below.

ASCII examples:

```
block-end center           inline-end start
  (below, centered)          (right, top-aligned)
       ▼                             ►
    trigger              trigger
    ------              ------
    popup               popup
```

## CSS positioning details

The placement maps to CSS via two functions:

- **`placementToPositionArea`** returns a `position-area` string. Note the inversion: visual
  `align: 'start'` requires `span-{cross}-end` because CSS `span-` keywords name the EXPANSION
  direction, not the alignment direction.

- **`placementToTryFallbacks`** returns the ordered list of fallback `position-area` values plus
  `flip-{axis}` keywords. The order matches Popper's classic fallback chain.

## Offset model

Cross-link to `notes/decisions/placement-offset.md` for the design decision. Summary:

- **`gap`** is the distance between trigger and popover (anchor-facing margin).
- **`shift`** is a cross-axis shift with `value` and `direction: 'forwards' | 'backwards'`.
- Both `gap` and `shift.value` accept a number (pixels) or a CSS length string (including design
  tokens like `token('space.100')`). Numbers are normalized to `${n}px` strings at the API boundary
  by `getPlacement`, so internal code only ever sees strings.
- The CSS path passes the strings through verbatim to logical margins and CSS custom properties.
- The MARGIN SIDE for `shift` is chosen based on `align` because CSS Anchor Positioning anchors the
  popover at a specific edge of its `position-area`, and margin on the far side has no effect.
- **The JS fallback honours `gap` and `crossAxisShift`**: it resolves CSS length strings to pixels
  via a hidden DOM probe (see `resolveCssLengthToPixels`) so tokens, `calc()`, `var()`, viewport
  units, etc all work. The probe is mounted next to the popover so it inherits the same containing
  block and custom-property scope. This is safe (no flash) because the JS path keeps the popover
  hidden via `opacity: 0` until the first measurement completes — see JS fallback details below.

## Arrow integration

Arrows replace the built-in `flip-block` / `flip-inline` keywords with 12 named `@position-try`
rules (one per `axis` × `edge` × `align`). Each rule re-applies both the anchor-facing `gap` margin
and the cross-axis `shift` margin via four custom properties:

- `--ds-cross-axis-shift-margin-start` / `--ds-cross-axis-shift-margin-end` (block-axis cross =
  inline)
- `--ds-cross-axis-shift-margin-block-start` / `--ds-cross-axis-shift-margin-block-end` (inline-axis
  cross = block)

Only one of the four is non-zero at any one time; `useAnchorPosition` picks based on the active
`(axis, align)` pair. Known limitation: arrow + `shift` + viewport-overflow flip can produce
ghost-arrow visual artifacts. See `placement-offset.md` Known Limitations section for details and
workarounds.

## JS fallback details

The fallback uses `position: fixed` semantics inside the top layer (the popover is already in the
top layer via `popover='auto'`, so it resets UA `inset:0; margin:auto` and sets `top` / `left`).
Coordinates come from `computeFallbackPosition`, which:

1. Picks the side with more viewport space if the requested side overflows.
2. Adds the consumer-supplied `gap` (default 8px) along the edge axis.
3. Snaps the cross-axis position to the trigger's start, center, or end edge per `align`.
4. Applies the consumer-supplied cross-axis `shift` with the same per-`align` and per-`direction`
   sign rules as the CSS path.
5. Clamps to the viewport so the popover is never offscreen.

`gap` and `shift.value` may be numbers, plain `${n}px` strings (fast path), or any other CSS length
string (tokens, `calc()`, `var()`, `rem`, viewport units, etc). `useAnchorPosition` resolves
non-pixel strings to pixels per measurement using `resolveCssLengthToPixels`, which mounts a tiny
hidden `<div>` next to the popover, sets `margin-left: <value>` on it (using `margin-left` rather
than `width` so signed values are preserved), reads back the resolved pixel value via
`getComputedStyle`, then removes the probe. The probe inherits the popover's containing block, font
size, and custom-property scope.

**Avoiding the wrong-position flash**: when the popover transitions from hidden to open, the browser
would otherwise paint it once at the UA-default location (because layout has not run, so we cannot
measure it). To prevent that flash, `useAnchorPosition` synchronously sets `opacity: 0` inside the
`toggle: open` listener, then removes it after the ResizeObserver delivers the first valid
measurement and `top` / `left` are written. Because measurement and offset resolution happen during
this hidden window, the popover is never visibly painted at the wrong position — which is what made
it safe to start honouring consumer offsets in the JS path.

If the JS-fallback effect runs after the popover is already open (e.g. a popover mounted with
`isOpen={true}` — child effects run before parent effects in React, so the `Popover` component's
`showPopover()` call has already fired the `toggle` event before the parent `useAnchorPosition`
effect attaches its listener), the hook detects this via `popover.matches(':popover-open')` and
starts the same hide-and-observe flow immediately, so the first measurement still happens.

`opacity: 0` is used in preference to `visibility: hidden` for one specific reason: Firefox skips
`visibility: hidden` elements during `<dialog>` initial-focus traversal. Because the ResizeObserver
fires in a later frame than the dialog's synchronous auto-focus runs, a `visibility: hidden` popover
would have its initial-focus target skipped — focus would land on the body instead of the first form
field. `opacity: 0` keeps the element in layout and in the focus traversal but skips painting, so
initial-focus, keyboard navigation, and assistive tech all work as though the popover were already
visible. The Playwright spec `__tests__/playwright/form-in-popup.spec.tsx` exercises this on
`desktop-firefox`.

## Files

- `src/internal/use-anchor-position.tsx` — main hook; dispatches between CSS path and JS fallback.
- `src/internal/anchor-positioning-fallback.tsx` — pure functions for JS fallback math; takes
  pre-resolved pixel `gap` and `crossAxisShift`.
- `src/internal/resolve-placement.tsx` — type definitions and `getPlacement` defaults; normalizes
  number offsets to `${n}px` strings.
- `src/internal/resolve-css-length.tsx` — `toCssLengthString` helper for the API boundary.
- `src/internal/resolve-css-length-to-pixels.tsx` — DOM-probe resolver used by the JS fallback to
  convert any CSS length string (token / `calc` / `var` / etc) to pixels.
- `src/arrow/index.tsx` — arrow CSS and 12 named `@position-try` rules.
- `src/placement-map/index.tsx` — `fromLegacyPlacement` adapter for migrating from Popper-style
  placement strings.

## Related notes

- `notes/decisions/placement-offset.md` — the `offset` API decision, Known Limitations, and consumer
  adapter status.
- `notes/architecture/overview.md` — broader package architecture.
