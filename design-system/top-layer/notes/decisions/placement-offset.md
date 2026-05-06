# Placement Offset: `gap` and `crossAxisShift`

## Status

**Implemented 2026-04-21**

Top-layer now supports both edge-adjacent (`gap`) and cross-axis (`shift`) offset, restoring full
parity with popper-era APIs and reversing the 2026-03-17 decision to drop along-axis offset.

> Naming note (2026-04-22): the fields were originally introduced as `away` and `along`. They were
> renamed to `gap` and `shift` (with `shift.value` and `shift.direction`) the same day, and then
> renamed again to `gap` and `crossAxisShift` on 2026-04-23 (see the later update note below) before
> any consumer adoption. The CSS custom properties (`--ds-cross-axis-shift-margin-*`) follow the
> final naming.

> Update (2026-04-23): the JS fallback path now also honours consumer-supplied `gap` and
> `crossAxisShift`, including CSS length strings (tokens, `calc()`, `var()`, etc), via a hidden DOM
> probe. See JS Fallback Path section.

> Update (2026-04-23, later): the offset fields were renamed from `gap` and `shift` to `gap` and
> `crossAxisShift` (with `crossAxisShift.value` and `crossAxisShift.direction`). The axis-prefixed
> names disambiguate which axis each offset operates on at the call site, removing a class of "is
> gap the main axis or the cross axis?" confusion. The CSS custom properties were renamed in
> lockstep (`--ds-shift-margin-*` → `--ds-cross-axis-shift-margin-*`). The `fromLegacyPlacement`
> adapter still accepts the popper-era `[along, away]` tuple unchanged.

---

## Context

The legacy popper-based `@atlaskit/popup` accepted a `[shift, gap]` offset tuple (popper's
`[skidding, distance]`), where the first value shifted the popup perpendicular to the edge
(cross-axis) and the second value shifted it parallel to the edge (away from the trigger).

When top-layer adopted CSS Anchor Positioning, the initial audit (2026-03-17, decision #1 in
`audit-decisions.md`) decided to drop cross-axis shift support because CSS Anchor Positioning has no
native cross-axis offset mechanism. This was pragmatic but incomplete: it removed a feature that
consumers actually used.

However, the constraint reversed once we settled on a string-first internal representation. By
normalizing all offset values to CSS length strings at the API boundary, the CSS path can apply both
`gap` and `crossAxisShift` natively via logical margins (using a per-`align` margin-side trick
documented below). The JS fallback initially dropped offset support to avoid parsing arbitrary CSS
lengths in JavaScript, but now resolves them via a DOM probe (see JS Fallback Path section) — safe
to do because the popover is hidden via `opacity: 0` until measurement completes.

Design constraints:

1. **CSS Anchor Positioning path** (primary): margins applied via custom properties, no arbitrary
   positioning properties. Both `gap` and `crossAxisShift` are honored exactly as specified.
2. **JS fallback path** (legacy browsers, less than 6% of users): both `gap` and `crossAxisShift`
   are honoured; CSS length strings are resolved to pixels via a hidden DOM probe per measurement.
   See JS Fallback Path section.
3. **RTL correctness**: directional semantics must be logical (start/end), not physical
   (left/right).
4. **Arrow integration**: 12 named `@position-try` rules (one per `axis` × `edge` × `align` combo)
   must all read the cross-axis margin, so arrow survives flip correctly.
5. **Token support**: `token('space.100')` must be passable for both `gap` and `shift.value`, not
   just hardcoded numbers. Passes through verbatim on the CSS path; resolved via DOM probe on the JS
   fallback path.

---

## Decision

The new shape for `TPlacement.offset`:

```ts
type TCrossAxisShiftOffset = { value: number | string; direction: 'forwards' | 'backwards' };

type TPlacement = {
	axis: 'block' | 'inline';
	edge: 'start' | 'end';
	align: 'start' | 'center' | 'end';
	offset: { gap: number | string; shift: TCrossAxisShiftOffset };
};
```

**Defaults:**

- `gap: 8` (pixels)
- `shift: { value: 0, direction: 'forwards' }`

**Type rules:**

- Numbers are always pixels.
- Strings are any valid CSS length: `'8px'`, `'0.5rem'`, `token('space.100')`, etc.
- `direction` is a logical orientation: `'forwards'` = toward the cross-axis end edge; `'backwards'`
  = toward the cross-axis start edge. Equivalent to `start/end` on the cross axis, but expressed
  without axis-specific language.
- `direction` exists (rather than allowing a signed `value`) because design tokens are opaque CSS
  strings and cannot be arithmetically negated; expressing direction as a sibling field lets `value`
  stay a positive token reference.

**Resolution:**

- `TPlacementOptions.offset` is a deep-partial type; consumers may omit parts and get defaults.
- `getPlacement()` returns a resolved `TPlacement` with all parts filled.
- `useAnchorPosition()` and fallback code paths receive a fully-resolved `TPlacement`.

---

## Background: How `gap` Worked Before This Change

Previously, `gap` (then named `away`) was:

- **In CSS**: A single logical edge margin (e.g., `margin-block-end: 8px` when the popup is below
  the trigger).
- **In JS fallback**: A signed coordinate delta along the edge axis, applied after alignment snap
  and before viewport clamp.
- **In API**: A standalone `Popup.Content` prop, separate from placement. Consumers wrote
  `offset={8}` directly.

Now, `gap` is part of the placement object as `placement.offset.gap` (alongside the new `shift`). On
the CSS path it is a single logical edge margin (the consumer-supplied value passed through
verbatim). On the JS fallback path it is resolved to pixels (see JS Fallback Path section) and added
to the edge-axis coordinate.

---

## CSS Anchor Positioning Path

**`gap` (unchanged):** One logical edge margin per side (block-start, block-end, inline-start,
inline-end). The margin direction determines which edge it applies to. Example:

```css
[popover] {
	anchor-name: --trigger;
	positioning-fallback: --below, --above, --right, --left;
}

@position-try --below {
	top: anchor(--trigger, bottom);
	margin-block-start: 8px;
}
```

**`shift` (new):** One cross-axis logical margin carrying a SIGNED value. The margin SIDE is chosen
based on `align` because CSS `position-area` anchors the popover to a specific edge:

- `align: 'start'` — popover anchored at cross-axis START. Use `margin-{cross}-start`. Positive
  value pushes toward end (forwards); negative pulls past start (backwards).
- `align: 'end'` — popover anchored at cross-axis END. Use `margin-{cross}-end` with the SIGN
  INVERTED (so `forwards` still maps to a positive `shift.value` from the consumer's perspective).
- `align: 'center'` — popover spans the full cross axis and is centered. Either margin side works;
  we use the START side for consistency.

Four custom properties cover all combinations (only one is non-zero at any time):

- `--ds-cross-axis-shift-margin-start`: block-axis cross (inline) START margin
- `--ds-cross-axis-shift-margin-end`: block-axis cross (inline) END margin
- `--ds-cross-axis-shift-margin-block-start`: inline-axis cross (block) START margin
- `--ds-cross-axis-shift-margin-block-end`: inline-axis cross (block) END margin

**Why side choice depends on `align`:**

CSS Anchor Positioning constrains the popover within its `position-area`. When `align: 'start'`, the
popover's start edge is anchored to the position area's start; adding margin on the END side has no
effect (the popover is already at the area's far end and cannot push past). The same is true
mirrored for `align: 'end'`: only END-side margin moves the box. Choosing the side per `align` makes
the API symmetric — `forwards` always shifts toward the cross-axis end, `backwards` always shifts
toward the start, regardless of which align value the consumer picks.

**Arrow handling:**

All 12 named `@position-try` rules (one per `axis` × `edge` × `align` combination) read the relevant
signed custom property. Each rule sets only the cross-axis START margin for its primary axis — never
both, never the END margin, never the primary-axis shift margin. This avoids margin conflicts that
previously caused ghost arrows. When CSS flips the edge (e.g., from below to above), the cross-axis
side does not change, so the same custom property still carries the offset. The `useAnchorPosition`
hook only updates the custom properties when the resolved placement itself changes; flipping inside
the browser's anchor positioning engine does not require a JS recomputation.

---

## JS Fallback Path

The JS fallback path (`computeFallbackPosition` in `internal/anchor-positioning-fallback.tsx`)
honours both `offset.gap` and `offset.crossAxisShift`. It computes a final position by:

1. Placing the popup at the trigger edge.
2. Adding the consumer-supplied `gap` (default 8px, which matches the historical
   `Popup.Content.offset` default) along the edge axis.
3. Picking the side with more viewport space if the requested side overflows.
4. Snapping the cross-axis position to the trigger's start, center, or end edge per `align`.
5. Applying the consumer-supplied cross-axis `shift` with the same per-`align` and per-`direction`
   sign rules as the CSS path. (`align: 'end'` inverts the sign so a `forwards` shift is consistent
   regardless of which edge the popover is anchored to; `direction: 'backwards'` inverts the sign on
   top of that.)
6. Clamping the result to the viewport so the popover is never offscreen.

**Resolving CSS length strings to pixels:**

`gap` and `shift.value` may be plain numbers, `${n}px` strings, or any other CSS length (tokens like
`token('space.100')` which expand to `var(--ds-space-100, 8px)`, `calc()` expressions, `rem`,
viewport units, etc). `useAnchorPosition` resolves them per measurement using
`resolveCssLengthToPixels` (`internal/resolve-css-length-to-pixels.tsx`):

1. Numbers are returned as-is.
2. `${n}px` strings hit a fast regex path (no DOM mutation) — this catches the common case produced
   by `getPlacement`'s number normalisation.
3. Everything else: mount a hidden `<div>` next to the popover, set `margin-left: <value>` on it (we
   use `margin-left` rather than `width` so signed values are preserved — `width` clamps to 0), read
   `parseFloat(getComputedStyle(probe).marginLeft)`, then remove the probe.

The probe is mounted inside the popover's parent so it inherits the same containing block, font
size, and custom-property scope — `var(--ds-space-100, 8px)` resolves the same way it would for the
popover itself.

The cost is one synchronous reflow per consumer offset value per measurement. The fallback only
resolves on placement/offset changes, not on every scroll or resize update, so this is not a hot
path.

**Why this is safe (no flash of wrong position):**

The reason we initially dropped offset support on this path was the "flash of wrong position"
problem: when the popover transitions from hidden to open via `showPopover()`, the browser may paint
it once at its UA-default location before our positioning code can run. We could not both keep that
frame visible AND resolve CSS length strings (which requires a probe in the visible DOM).

We later added `opacity: 0` hide-until-positioned (originally only to prevent the initial flash with
the _fixed_ gap path). Once that hide window existed, the cost of running a probe inside it became
invisible to users — which is what unlocked offset honouring on the JS path.

**Why hide-until-positioned (with `opacity: 0`):**

Some browsers (Firefox) fire the `toggle` event synchronously during `showPopover()` before laying
the popover out, so we cannot measure it inside that listener — we have to defer to a
`ResizeObserver` callback that fires after the browser has computed real dimensions for the popover.
`useAnchorPosition` synchronously sets `opacity: 0` inside the `toggle: open` listener, runs the
resolver and the position math, writes `top` and `left`, then removes the opacity property. The
popover is therefore never visibly painted at the wrong position. This is the same
hide-until-positioned pattern Floating UI uses for popper-style libraries.

If the JS-fallback effect runs _after_ the popover is already open (e.g. a popover mounted with
`isOpen={true}` — child effects run before parent effects in React, so the `Popover` component's
`showPopover()` has already fired the `toggle` event before the parent `useAnchorPosition` effect
attaches its listener), the hook detects this via `popover.matches(':popover-open')` and starts the
same hide-and-observe flow immediately, so the first measurement still happens.

**Why `opacity: 0` and not `visibility: hidden`:**

We initially used `visibility: hidden` for the hide. That broke `<dialog>` initial focus on Firefox:
the spec runs the dialog's auto-focus algorithm synchronously when the popover opens, and Firefox
skips elements that are `visibility: hidden` during focus traversal. Because our ResizeObserver
fires in a later frame than the dialog auto-focus runs, the initial-focus target was being skipped
and focus ended up on the body instead of the first form field. The Playwright spec
`__tests__/playwright/form-in-popup.spec.tsx` reproduces this on `desktop-firefox`.

`opacity: 0` keeps the element fully laid out and in the focus traversal — it only skips painting.
Initial-focus, keyboard navigation, and assistive tech all behave as though the popover were already
visible. Chromium happens to handle the `visibility` case more leniently (retrying focus after the
visibility property is dropped), which is why this only manifested as a Firefox CI failure.

**`token()` support is unaffected.** Tokens flow through verbatim as CSS values on the CSS path; on
the JS path they are resolved to pixels by the DOM probe described above. Consumers get visually
consistent rendering on both paths.

---

## Number / String Handling

`getPlacement` normalizes any number input to a `${n}px` string at the API boundary. After
resolution, internal code only sees strings:

- Consumer enters `gap: 8` → `placement.offset.gap === '8px'`.
- Consumer enters `gap: token('space.100')` → `placement.offset.gap === 'var(--ds-space-100, 8px)'`.
- Consumer enters `gap: '0.5rem'` → `placement.offset.gap === '0.5rem'`.

The CSS path passes the string verbatim to the browser. The JS fallback resolves it to pixels via
the DOM probe in `resolveCssLengthToPixels`. There is no manual CSS-string parser in the runtime —
the browser does the math in both paths.

---

## Why `forwards` / `backwards` Instead of `start` / `end`

The cross-axis offset direction is expressed as `forwards` and `backwards` rather than `start` and
`end` because:

1. **No axis-specific mental translation**: A consumer writing
   `shift: { value: 8, direction: 'forwards' }` does not need to think about whether the popup's
   placement axis is block or inline. The direction is always relative to the cross-axis end edge,
   regardless of axis orientation.

2. **RTL transparency**: In RTL layouts, `start` and `end` flip _per axis_. Callers would need to
   perform axis-dependent transforms, introducing bugs. `forwards` and `backwards` are independent
   of the layout direction; the CSS and JS paths handle the axis mapping internally.

3. **Semantic alignment with popper**: Legacy popper used positive-toward-end semantics, which maps
   directly to `forwards`. The term is familiar to migrating consumers.

---

## Legacy `[along, away]` Mapping

The `fromLegacyPlacement` adapter keeps popper's historical tuple names (`[along, away]`, also known
as `[skidding, distance]`) so existing call sites migrate without thinking. It maps the tuple to the
new internal field names:

```ts
const along = offset[0];
const away = offset[1];

const newOffset = {
	gap: away,
	shift: {
		value: Math.abs(along),
		direction: along >= 0 ? 'forwards' : 'backwards',
	},
};
```

This is a direct mapping because legacy popper's `along` (skidding) semantics — positive = toward
end — are identical to `forwards`. No behavior change occurs during migration.

---

## Breaking Changes

Top-layer is pre-production, so semver constraints are not strict. However, these are documented
breaking changes:

1. **`Popup.Content` no longer accepts a standalone `offset?: number` prop.** Consumers must now set
   `placement.offset.gap` instead.

2. **`TPlacement.offset` is required after resolution.** `TPlacementOptions.offset` is deep-partial,
   so callers can omit it, but `getPlacement()` always returns a fully-resolved offset with both
   `gap` and `crossAxisShift`.

3. **`useAnchorPosition` no longer accepts an `offset` parameter.** The hook signature is now:
   ```ts
   function useAnchorPosition({
   	placement,
   	triggerRef,
   	popoverRef,
   	zIndex,
   }: TUseAnchorPositionOptions): void;
   ```
   Offset is sourced entirely from `placement.offset`.

---

## Consumer Adapter Status

### Adapters forwarding legacy `[along, away]`:

- `PopupTopLayer` (popup)
- `PopupContentTopLayer` (popup-content)
- `SpotlightTopLayer` (spotlight)
- `TooltipTopLayer` (tooltip)

All four now accept an optional `offset?: [along: number, away: number]` parameter and map it via
`fromLegacyPlacement`.

### Adapters with no legacy offset:

- `InlineDialogTopLayer` (inline-dialog) — never had an offset prop.
- `DropdownMenuTopLayer` (dropdown-menu) — `offset` is internal only (between menu and trigger).
- `SelectTopLayer` (select) — no offset prop.
- `AvatarGroupTopLayer` (avatar-group) — no offset prop.
- `DateTimePickerTopLayer` (datetime-picker) — no offset prop.

These adapters continue to use `placement.offset` with defaults.

---

## Known Limitations

### Ghost arrows after CSS edge flip when `shift` is set

When **all three** of the following are true:

1. The popover has an arrow (`Popup.Content arrow={...}`).
2. The placement has a non-zero `offset.crossAxisShift.value`.
3. CSS Anchor Positioning flips the popover via `position-try-fallbacks` because of viewport
   overflow.

...the rendered popover may show a **ghost arrow** from a non-active `@position-try` rule alongside
the correct arrow. See VR snapshots `arrow-flip-block-end-shift`, `arrow-flip-block-start-shift`,
`arrow-flip-inline-end-shift`, `arrow-flip-inline-start-shift` for examples.

The cause is in `arrow/index.tsx`. The 12 named `@position-try` rules each render their own arrow
`::before` pseudo-element. When the browser flips between rules due to viewport overflow, geometry
from a sibling rule can remain visible. The custom properties themselves are correct (CSS edge
flip + non-arrow flip + shift works perfectly — see `flip-block-end-shift` and friends). The issue
is specific to the arrow geometry rules.

**Workaround for consumers**: do not combine `arrow` with `offset.crossAxisShift` on triggers near
the viewport edge. Centered triggers with arrow + shift work correctly.

**Tracked as a follow-up.** Fix likely involves auditing each of the 12 arrow `@position-try` rules
to ensure they explicitly reset arrow geometry not relevant to that fallback.

## Open Questions / Follow-Ups

1. **Token strings for `offset.gap` in existing consumers**: The type already supports
   `gap: token('space.100')`. No consumers use this yet. Should we document it as an escape hatch
   for consumers who want to avoid hardcoding pixels? Or is the number form sufficient?

2. **Exposed CSS custom properties**: The four `--ds-cross-axis-shift-margin-*` properties are
   currently implementation-private. Should we document them as a stable contract for advanced
   consumers who want to manipulate them directly (e.g., animating offset via CSS)?

3. **Offset animation**: Does the platform need built-in support for animating offset transitions
   (e.g., smooth expansion of a dropdown)? Currently, only the initial offset can be set. Changing
   it requires a new `useAnchorPosition` setup.

---

## References

- **`audit-decisions.md` — decision #1**: Original decision to drop along-axis offset (2026-03-17);
  now marked "Reversed 2026-04-21".
- **`popup-migration.md`**: Updated sections:
  - "Offset conversion" — remapped to include cross-axis shift handling.
  - "Key decisions" (item 5) — reworded from "dropped" to "preserved".
  - "Known gaps" — cross-axis gap removed; gap table reorganized.
  - "Risks when flag is turned on" (item 1) — cross-axis drop removed from risks.
- **Source files**:
  - `packages/design-system/top-layer/src/internal/resolve-placement.tsx` — `TPlacement` definition,
    `getPlacement()` defaults.
  - `packages/design-system/top-layer/src/internal/resolve-css-length.tsx` — `toCssLengthString`
    helper that normalizes number offsets to `${n}px` strings at the API boundary.
  - `packages/design-system/top-layer/src/internal/use-anchor-position.tsx` — custom property
    writes; JS fallback offset resolution.
  - `packages/design-system/top-layer/src/internal/anchor-positioning-fallback.tsx` — JS fallback
    math; takes pre-resolved pixel `gap` and `crossAxisShift`.
  - `packages/design-system/top-layer/src/internal/resolve-css-length-to-pixels.tsx` — DOM-probe
    resolver used by the JS fallback to convert CSS length strings (tokens, `calc`, `var`, etc) to
    pixels.
  - `packages/design-system/top-layer/src/arrow/index.tsx` — 12 `@position-try` rules with four
    custom property reads.
  - `packages/design-system/top-layer/src/placement-map/index.tsx` — `fromLegacyPlacement` legacy
    offset adapter.
  - Adapter files updated to forward the legacy tuple:
    - `packages/design-system/popup/src/popup-top-layer.tsx`
    - `packages/design-system/popup/src/compositional/popup-content-top-layer.tsx`
    - `packages/design-system/spotlight/src/ui/popover-content/index.tsx`
    - `packages/design-system/tooltip/src/tooltip.tsx`
