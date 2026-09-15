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

## The anchor

Two hooks, one per kind of anchor. Both take the same options — placement, sizing, `isOpen`,
`isEnabled` — and the point one is a thin wrapper that delegates all of them. See
[notes/decisions/anchored-popover-at-point.md](../decisions/anchored-popover-at-point.md) for why
they are separate rather than one hook with an anchor union.

- **`useAnchoredPopover({ anchorRef })`** — the ordinary case. The hook writes `anchor-name` to
  `anchorRef.current` and never removes it (see
  [notes/decisions/anchor-name-lifetime.md](../decisions/anchor-name-lifetime.md)).
- **`useAnchoredPopoverAtPoint({ getPoint })`** — a caret, a pointer position, a virtual reference.
  It maintains a zero-size proxy element at the returned coordinates, appended to `document.body`,
  and hands that to `useAnchoredPopover` as an ordinary element anchor.
- **`isEnabled: false`** — do not position, touch no DOM. (`Popover` itself never calls the hook; a
  trigger-less popover simply does not compose it.) A disabled hook writes nothing and holds no
  style snapshot, which is what lets a consumer that needs BOTH strategies over one mount call both
  hooks with complementary values. Nothing enforces the complement at runtime; both in-tree flippers
  (`tooltip.tsx`, `popper-top-layer.tsx`) derive the two flags from one boolean.

**`getPoint` is latched, deliberately.** The effect that creates the proxy depends only on
`isEnabled`, never on the identity of `getPoint`, so an inline `getPoint: () => …` arrow — a new
function every render — does not re-latch and thrash the proxy. `getPointRef.current` is reassigned
every render, so the latched closure still reads current state; `@atlaskit/popper` and
`@atlaskit/tooltip` both rely on exactly that, reading mutable refs from inside `getPoint`.

## Placement model

The `TPlacement` shape encodes positioning intent:

- **`axis: 'block' | 'inline'`** — which axis the popover sits on (block = vertical, inline =
  horizontal).
- **`edge: 'start' | 'end'`** — which side of the trigger (start = top/left in LTR, end =
  bottom/right in LTR).
- **`align: 'start' | 'center' | 'end'`** — cross-axis alignment of the popover with the trigger.
- **`offset: { gap, shift }`** — see Offset model below.
- **`minSize`** — the minimum size along the placement axis. Sizing, not positioning, but it lives
  here because it is only meaningful relative to a resolved axis, and because it is the knob that
  decides whether a capped popover flips or letterboxes. Deliberately left `undefined` when unset,
  so `minSize: 0` stays distinguishable from "not asked".

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
  by `resolvePlacement`, so internal code only ever sees strings.
- The CSS path passes the strings through verbatim to logical margins and CSS custom properties.
- The MARGIN SIDE for `shift` is chosen based on `align` because CSS Anchor Positioning anchors the
  popover at a specific edge of its `position-area`, and margin on the far side has no effect.
- **The JS fallback honours `gap` and `crossAxisShift`**: it resolves CSS length strings to pixels
  via a hidden DOM probe (see `resolveCssLengthToPixels`) so tokens, `calc()`, `var()`, viewport
  units, etc all work. The probe is mounted next to the popover so it inherits the same containing
  block and custom-property scope. This is safe (no flash) because the JS path keeps the popover
  hidden via `opacity: 0` until the first measurement completes — see JS fallback details below.

## Sizing, including fitting to the available space

`useAnchoredPopover` takes `inlineSize` and `blockSize`, each one of `'content'`, `'match-anchor'`,
`'min-anchor'` or `'max-available'` (both default `'content'`). `'max-available'` caps the popover
to the space between its anchor and the viewport edge so oversized content scrolls rather than
growing off screen.

The whole recipe is one pure function, `getAnchoredPopoverSizeDeclarations` in
`internal/anchored-popover-size.tsx`, which takes the resolved placement, both axis values and the
positioning path and returns every size declaration. `Popover` supplies the `:popover-open`-scoped
`display: flex` that lets the caps reach the content, unconditionally and with no prop. Each
property has exactly one writer.

Four defaults are worth knowing, and are documented on the hook. Asking one axis to fit spreads to
an axis still on `'content'` (never to an explicit one), and the cap is otherwise **per-axis** —
each axis has its own available space. Asking **either** axis to fit turns on `min-{axis}-size`
along the placement axis, valued at the two EXPLICIT minimums composed — `placement.minSize` and the
anchor's size when that axis is anchor-relative — as `max()`, whichever of them applies alone, or a
`150px` default when neither does (clamped against the viewport so the roomier cell beside the
anchor can always hold it); so `minSize: 0` zeroes the floor only where there is no anchor floor.
Unlike the cap that is not per-axis, because flipping is a whole-popover outcome. A viewport cap on
both axes is unconditional. And a non-anchor-relative inline axis is its natural width
(`inline-size: max-content`), so a popover too wide for the span beside its anchor overflows it and
slides to the roomier side rather than wrapping into it.

The two non-obvious parts: a cap alone **suppresses** `position-try-fallbacks`, because overflow
detection runs on the margin box after the clamp — hence the floor, which is left uncapped so it can
exceed the cap (a placement axis with no cell to overflow is the exception, on either count: nothing
fitting, or the JS fallback. An anchor floor there is clamped to the viewport backstop it would
otherwise defeat, and the `150px` default is not written at all); and `display` cannot be an inline
style, because an author `display: flex` outranks the user-agent
`[popover]:not(:popover-open) { display: none }` rule and leaves a ghost behind on close.

Full rationale, the measured cases, and the rejected alternatives:
[notes/decisions/fit-available-space.md](../decisions/fit-available-space.md).

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
string (tokens, `calc()`, `var()`, `rem`, viewport units, etc). `useAnchoredPopover` resolves
non-pixel strings to pixels per measurement using `resolveCssLengthToPixels`, which mounts a tiny
hidden `<div>` INSIDE the popover, sets `margin-left: <value>` on it (using `margin-left` rather
than `width` so signed values are preserved), reads back the resolved pixel value via
`getComputedStyle`, then removes the probe. It must be inside the popover and not its parent: the
popover lives in the top layer, not the anchor's DOM tree, so anywhere else resolves tokens against
a different scope than the consumer authored against.

**Avoiding the wrong-position flash**: when the popover transitions from hidden to open, the browser
would otherwise paint it once at the UA-default location (because layout has not run, so we cannot
measure it). To prevent that flash, the fallback sets `opacity: 0` inside the `toggle: open`
listener, then removes it once the ResizeObserver reports the first non-zero layout and `top` /
`left` are written. Two deliberate limits: the hide is SKIPPED when `ResizeObserver` is missing,
because then no measurement is coming and hiding would be permanent; and the reveal runs in a
`finally`, so a throw during measurement reveals an unpositioned popover rather than an invisible
one.

If the JS-fallback effect runs after the popover is already open (e.g. a popover mounted with
`isOpen={true}` — child effects run before parent effects in React, so the `Popover` component's
`showPopover()` call has already fired the `toggle` event before the parent `useAnchoredPopover`
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

- `src/internal/use-anchored-popover.tsx` — the one hook: resolves the positioning path once, then
  dispatches between CSS path and JS fallback and writes every inline style on the host.
- `src/internal/anchored-popover-size.tsx` — the pure size recipe (both caps, both floors, the
  anchor-relative sizes), plus `VIEWPORT_PADDING` and `FALLBACK_MINIMUM_MAIN_AXIS_SIZE`.
- `src/internal/anchor-positioning/` — everything the CSS Anchor Positioning path owns.
  `apply-anchor-positioning.tsx` is the entry point the hook calls; the `placement-to-*` files map
  `TPlacement` to `position-area` / `position-try-fallbacks`; `edge-margin.tsx` and
  `cross-axis-shift-margins.tsx` write the gap and the shift; `fit-margins.tsx` is the reserved
  viewport padding, composed onto the cross-axis shift.
- `src/internal/supports-anchor-positioning.tsx` / `supports-anchor-size.tsx` — the two probes. The
  hook requires BOTH for `anchor-size()`, because that function needs the `position-anchor` only the
  CSS path writes.
- `src/internal/javascript-fallback/` — everything the JS fallback path owns.
  `apply-javascript-fallback-positioning.tsx` is the entry point the hook calls;
  `anchor-positioning-fallback.tsx` is the pure math, taking pre-resolved pixel `gap` and
  `crossAxisShift`.
- `src/internal/resolve-placement.tsx` — type definitions and `resolvePlacement` defaults;
  normalizes number offsets to `${n}px` strings, and carries `minSize`, the placement-axis floor,
  which it deliberately leaves `undefined` when unset.
- `src/internal/resolve-css-length.tsx` — `toCssLengthString` helper for the API boundary.
- `src/internal/javascript-fallback/resolve-css-length-to-pixels.tsx` — DOM-probe resolver used by
  the JS fallback to convert any CSS length string (token / `calc` / `var` / etc) to pixels.
- `src/placement-map/index.tsx` — `fromLegacyPlacement` adapter for migrating from Popper-style
  placement strings.

## Related notes

- `notes/decisions/placement-offset.md` — the `offset` API decision, Known Limitations, and consumer
  adapter status.
- `notes/decisions/fit-available-space.md` — `'max-available'`: the caps, the floor that keeps
  flipping working, and why `display` lives in `Popover`'s stylesheet.
- `notes/decisions/width-from-anchor-floors.md` — the anchor-relative floors the caps compose with.
- `notes/decisions/anchor-name-lifetime.md` — why `anchor-name` is written once and never removed.
- `notes/plans/one-anchored-popover-hook.md` — why this is one hook and not three, and what the
  split cost while it lasted.
- `notes/architecture/overview.md` — broader package architecture.
