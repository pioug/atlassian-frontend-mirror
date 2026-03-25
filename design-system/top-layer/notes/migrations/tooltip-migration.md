# Tooltip Migration

> What changed when migrating `@atlaskit/tooltip` to use `@atlaskit/top-layer`, behind the
> `platform-dst-top-layer` feature flag.

---

## What was done

### Feature-flagged branch in `tooltip.tsx`

The `Tooltip` component has a feature-flagged branch (`platform-dst-top-layer`) that replaces the
legacy rendering pipeline with native `popover="auto"` via `Popup.Content` from
`@atlaskit/top-layer`.

**Legacy path:**

```
Portal (zIndex=tooltip) → Popper (placement, referenceElement, strategy) → ExitingPersistence → FadeIn → TooltipContainer
```

**Top-layer path:**

```
Popup.Content (popover="auto", role="tooltip", placement, offset, animate) → TooltipContainer
```

### What was replaced

| Legacy mechanism                        | Native replacement                                                    |
| --------------------------------------- | --------------------------------------------------------------------- |
| `@atlaskit/portal` (zIndex=tooltip)     | `popover="auto"` renders in the browser's top layer                   |
| `@atlaskit/popper` (Popper.js)          | CSS Anchor Positioning via `useAnchorPositioning`                     |
| z-index stacking (`layers.tooltip()`)   | Top layer insertion order                                             |
| `useCloseOnEscapePress`                 | Native `popover="auto"` light dismiss                                 |
| `ExitingPersistence` + `FadeIn`         | CSS `@starting-style` + `allow-discrete` via `slideAndFade()`         |
| `VirtualElement` (mouse positioning)    | JS `useLayoutEffect` with viewport clamping                           |

### Standalone `Popup.Content` approach

Tooltip could not use the full `Popup` compound component because tooltip has a complex hover/focus
lifecycle managed by `tooltip-manager` (delay scheduling, singleton management, drag awareness,
scroll-hide). The `Popup.Trigger` sub-component binds a click handler and calls `togglePopover()`,
which conflicts with tooltip's hover-based show/hide.

Instead, `TopLayerTooltipPopup` uses `Popup.Content` directly in **standalone mode** (without
`Popup.Trigger`), letting tooltip's existing state machine control visibility via React conditional
rendering. When the component mounts, `Popup.Content` calls `showPopover()` internally. When it
unmounts, `hidePopover()` is called in the layout effect cleanup.

### Change to `@atlaskit/top-layer`: viewport edge clipping fix

VR testing revealed that centered tooltips (the default alignment) near a viewport edge were clipped
in the top-layer path, whereas the legacy Popper.js path would shift them to stay in view. The root
cause was that `placementToTryFallbacks()` in `use-anchor-positioning.tsx` only generated a simple
primary-axis flip keyword (e.g. `flip-block`) for centered placements, providing no cross-axis shift
fallbacks.

The fix expanded centered-placement fallbacks to include cross-axis aligned `position-area` values:

```
block-end span-inline-end, block-end span-inline-start, flip-block, block-start span-inline-end, block-start span-inline-start
```

This gives the browser 5 fallback positions to try in order:
1. Same edge, start-aligned (shift for near-edge overflow)
2. Same edge, end-aligned (shift for far-edge overflow)
3. Flipped edge, centered (primary flip)
4. Flipped edge, start-aligned (flip + shift)
5. Flipped edge, end-aligned (flip + shift)

This restores parity with the legacy Popper.js overflow prevention and benefits all consumers of
`@atlaskit/top-layer`, not just tooltip.

---

## Behavior changes for consumers

### Light dismiss via `popover="auto"`

`popover="auto"` provides native light dismiss (click-outside closes) and native Escape handling.
Tooltips now close on click-outside in addition to mouse-leave/blur. The existing
`useCloseOnEscapePress` hook is disabled when the flag is on:

```typescript
useCloseOnEscapePress({
  onClose: hideTooltipOnEsc,
  isDisabled: state === 'hide' || state === 'fade-out' || fg('platform-dst-top-layer'),
});
```

The `onClose` prop passed to `Popup.Content` calls
`apiRef.current?.requestHide({ isImmediate: true })`, bridging the native popover dismiss back into
tooltip-manager's lifecycle.

### Hide behavior

On the top-layer path, when the tooltip hides non-immediately, it sets state to `'top-layer-exit'`
(keeping the component mounted for the exit animation) and passes `isOpen={false}` to `Popover`.
The primitive handles `hidePopover()`, the CSS exit transition, and the `transitionend` listener
internally. When the exit animation completes, `Popover` fires the `onExitFinish` callback, which
tooltip uses to call `setState('hide')` and `apiRef.current?.finishHideAnimation()` to complete the
tooltip-manager lifecycle. The legacy `before-fade-out` -> `fade-out` states (which drive
`@atlaskit/motion` exit animations) are skipped entirely. Both CSS entry and exit animations work
via `@starting-style` / `allow-discrete` in the animation preset.

### `content` function `update` is a no-op

When `content` is a function, it receives `{ update }`. On the top-layer path, `update` is a
no-op -- CSS Anchor Positioning (or the JS fallback) handles repositioning automatically without
the consumer needing to trigger updates.

### Offset

Tooltip uses a 4px offset (smaller than the default 8px popover offset), passed via the `offset`
prop on `Popup.Content`.

### Animation

A module-level `slideAndFade()` preset instance is created once and passed to `Popup.Content`'s
`animate` prop. This provides CSS-based entry transitions using `@starting-style` and
`allow-discrete` for progressive enhancement.

---

## Positioning: two strategies

### Non-mouse positions

`top`, `bottom`, `left`, `right`, and their `-start`/`-end` variants use CSS Anchor Positioning via
`useAnchorPositioning`, with a JS fallback for browsers that don't support it. The `triggerRef` is
passed to `Popup.Content` so it can set up the anchor relationship.

### Mouse-tracking positions (`mouse`, `mouse-x`, `mouse-y`)

These exist for large trigger elements (e.g. a wide table row) where anchoring to the element's
center would place the tooltip far from the cursor. Instead, the tooltip follows the mouse:

- `mouse`: both X and Y track the cursor
- `mouse-y`: Y tracks cursor, X anchored to trigger
- `mouse-x`: X tracks cursor, Y anchored to trigger

The tooltip still renders as `<div popover="auto">` in the browser's top layer. The difference is
only in positioning:

1. `triggerRef` is passed as `undefined` to `Popup.Content`, which causes `useAnchorPositioning`
   to skip.
2. A `useLayoutEffect` computes `top`/`left` from stored mouse coordinates with viewport clamping.
   The effect re-runs whenever `mousePos` changes so the tooltip tracks the cursor.
3. Directional slide animations are disabled (`--ds-popover-tx`/`--ds-popover-ty` set to `0`) since
   there is no meaningful entrance direction when following a mouse.

CSS Anchor Positioning does not apply here -- a mouse cursor is not a DOM element. JS positioning is
the only viable approach for this use case.

---

## Known risks

| Severity | Risk                                          | Impact                                                    | Status   |
| -------- | --------------------------------------------- | --------------------------------------------------------- | -------- |
| Medium   | Top-layer / non-top-layer interlacing         | A portal-rendered popup could appear behind a tooltip     | Open     |
| Low      | `content` function `update` is a no-op        | Consumers calling `update()` get no repositioning trigger | Open     |
| Low      | Mouse-tracking positions use JS positioning   | Minor visual stutter possible while tracking cursor       | Open     |

### Resolved risks

| Risk                                          | Resolution                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Viewport edge clipping for centered tooltips  | Fixed in `placementToTryFallbacks()` — cross-axis `position-area` fallbacks now shift the popover to avoid clipping |
| Exit animation skipped                        | Fixed — `Popover` now handles exit animation internally via `isOpen` + `allow-discrete`. Tooltip uses `onExitFinish` callback to complete the tooltip-manager lifecycle after the CSS exit transition plays. |

---

## Test coverage

### Unit tests (Jest)

**`tooltip-top-layer.test.tsx`** -- 16+ tests behind `ffTest.on('platform-dst-top-layer')`:

- Show on hover after delay
- Hide on unhover
- Re-show after unhover
- Hide on light dismiss (popover close via toggle event)
- Re-show after light dismiss
- Show on focus (keyboard)
- Hide on blur
- Hide on scroll
- Delay prop respected
- `onShow` callback fires when tooltip becomes visible
- `onHide` callback fires when tooltip is hidden
- Singleton behavior (only one tooltip visible)
- Empty content (`""`) guard
- Null content guard
- Immediate hide during waiting-to-hide
- Render prop children support
- `popover="auto"` element rendered
- `role="tooltip"` set on popover element
- `showPopover()` called when tooltip becomes visible
- No portal rendering (tooltip is in DOM near trigger)
- Animation data attribute applied
- 4px offset used

### Visual regression tests

**`tooltip.vr.tsx`** — All existing `snapshot()` calls now include `'platform-dst-top-layer': [true, false]`
in `featureFlags`, generating side-by-side snapshots for comparison between the legacy and top-layer
paths. This covers: default tooltip, custom component, dynamic position, mouse-x, mouse-y, truncate,
keyboard shortcuts (3 variants), and keyboard shortcut global styles.

**`vr-position-all.tsx`** — New example with separate hoverable buttons for each cardinal position
(`top`, `right`, `bottom`, `left`). Four additional `snapshot()` calls (one per position) target
individual triggers by `testId`, each with the `platform-dst-top-layer` feature flag variants.

### Existing tests

All existing legacy tests continue to pass.

### Accessibility (top-layer path)

| A11y criterion | Test | Notes |
| --- | --- | --- |
| 1.3.1 Info and Relationships | ✗ | **Gap:** Standalone `Popup.Content` does not wire `aria-controls` from trigger to tooltip. Tooltip manages its own `aria-describedby` on the trigger, but the inverse `aria-controls` link is not set. Decision (2026-03-17 audit): This is a consumer-level concern. Each standalone consumer owns their trigger lifecycle and should wire `aria-controls` in their own migration code. Tooltip already provides `aria-describedby` which links trigger to content. |
| 1.3.2 Meaningful Sequence | ✓ | `tooltip.spec.tsx` — no portal rendering; unit tests validate DOM order |
| 2.1.1 Keyboard | ✓ | `tooltip.spec.tsx` — keyboard focus shows tooltip; unit tests |
| 2.1.2 No Keyboard Trap | ✓ | `tooltip.spec.tsx` — Escape dismisses tooltip; unit tests |
| 2.4.3 Focus Order | ✓ | Top-layer `popover.spec` validates focus return to trigger on dismiss |
| 2.4.7 Focus Visible | ✓ | `tooltip.spec.tsx` — `:focus-visible` on trigger; top-layer `accessibility.spec` |
| 2.4.11 Focus Not Obscured | ✓ | `tooltip.spec.tsx` — top-layer content not obscured; top-layer `accessibility.spec` |
| 3.2.1 On Focus | ✓ | Top-layer `accessibility.spec` validates focus return does not re-open layer |
| 4.1.2 Name, Role, Value | ✓ | Unit: `role="tooltip"` set on popover element; top-layer `accessibility.spec` validates ARIA attributes |
| 4.1.3 Status Messages | ✓ | Top-layer `accessibility.spec` validates role-based screen reader announcement |

> **Note:** Tooltip has dedicated top-layer browser tests in
> `tooltip/src/__tests__/playwright/ff-testing/platform-dst-top-layer/tooltip.spec.tsx` (5 tests).

---

## Known limitation: legacy tooltips inside top-layer dialogs

**Decision: accepted — old-stack tooltips will not be placed on top of new-stack dialogs.**

When a legacy tooltip (Popper.js-based, rendered via Portal) appears inside a native `<dialog>`
opened with `showModal()`, the tooltip position is incorrect. The tooltip renders at the wrong
coordinates (e.g. bottom-left of the modal instead of adjacent to the trigger).

**Root cause:** `showModal()` establishes the `<dialog>` element as a new
[containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block) for all
positioned descendants. Popper.js calculates tooltip position using `getBoundingClientRect()`
(viewport-relative coordinates), but the containing block context shifts the reference frame,
causing the position to be offset.

**Why this is accepted:**

- The tooltip package has its own top-layer migration path (this document). When both the tooltip
  and the modal are on the top-layer path, CSS Anchor Positioning handles the coordinate system
  correctly.
- Mixed-stack scenarios (old tooltip inside new dialog) are transitional and will be resolved once
  all consumers are migrated to the top-layer path.
- Fixing the legacy Popper.js path to account for containing block shifts would add complexity to
  code that is being replaced.

**Tracked as:** Bug #12 in the
visual diff report (removed — decisions captured in [audit-decisions.md](../decisions/audit-decisions.md)).

---

## Out-of-scope a11y improvements

The following pre-existing accessibility issues in `@atlaskit/tooltip` are **not addressed** by the
top-layer migration. They exist in both the legacy and top-layer paths:

- **Potential double-announce with `aria-describedby` + `role="tooltip"` (WCAG 4.1.2):** Tooltip
  sets `aria-describedby` on the trigger referencing the tooltip content, and the popover has
  `role="tooltip"`. Some screen reader/browser combinations may announce the tooltip content twice.
  This is a `@atlaskit/tooltip` concern, not a layering concern.

---

## Files modified

### `@atlaskit/tooltip`

| File                                            | Change                                                                                                  |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `src/tooltip.tsx`                               | Feature-flagged top-layer path; `TopLayerTooltipPopup`                                                  |
| `src/__tests__/unit/tooltip-top-layer.test.tsx` | Unit tests for top-layer path                                                                           |
| `src/__tests__/vr-tests/tooltip.vr.tsx`         | Added `platform-dst-top-layer: [true, false]` to all snapshots; added 4 position-specific snapshots     |
| `examples/vr-position-all.tsx`                  | New example with per-position hoverable buttons for VR testing                                           |

### `@atlaskit/top-layer`

| File                                                | Change                                                                                          |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `src/internal/use-anchor-positioning.tsx`            | `placementToTryFallbacks()` expanded with cross-axis `position-area` fallbacks for centered placements |

---

## Merge Risk Assessment

**Question:** Is it safe to merge this code to master, assuming the `platform-dst-top-layer` feature flag is OFF?

### 1. Verdict

✅ **Safe to merge**

All unflagged changes are side-effect-free (imports only) with no behavioral changes to the legacy path. The `role` prop change preserves the default value. All existing legacy tests pass.

### 2. Changes that execute WITHOUT the feature flag

- **Top-level imports** of `@atlaskit/top-layer` modules — side-effect-free, no DOM access or initialization logic
- **Bundle size increase** from importing top-layer modules (unavoidable cost of the feature)
- **`role` prop change on `tooltip-primitive`** — was hardcoded as `role="tooltip"`, now it's a prop with `role = 'tooltip'` as default. No behavioral change on the legacy path; preserves identical default value

### 3. Changes gated behind `platform-dst-top-layer`

- Feature-flagged branch in `tooltip.tsx` (`tooltip.tsx:265`, `tooltip.tsx:307`, `tooltip.tsx:608`)
- Entire `Popup.Content` rendering path (standalone popover mode with CSS Anchor Positioning)
- `useCloseOnEscapePress` hook disabled when flag is on (native `popover="auto"` provides light dismiss)
- Bug fix in `tooltip-manager.tsx` for the `waiting-to-hide` phase (`tooltip-manager.tsx:120`) — gated behind the flag; surrounding code comments are the only unflagged change

### 4. Residual risks (flag off)

**Risk level: VERY LOW**

The `role` prop change preserves the default value, ensuring zero behavioral change on the legacy path. The imports are side-effect-free. No code execution changes when flag is off.

### 5. Risks when flag is turned on

**MEDIUM-severity known issues:**
- Top-layer/non-top-layer interlacing — a portal-rendered popup could appear behind a tooltip (accepted; resolved once all consumers migrate)
- `content` function `update` is a no-op — consumers calling `update()` get no repositioning trigger (accepted; CSS Anchor Positioning/JS fallback handles repositioning automatically)
- Mouse-tracking positions use JS positioning — minor stutter possible while tracking cursor (accepted; necessary for mouse-following behavior)

**ACCEPTED transitional issue:**
- Legacy tooltips inside top-layer dialogs are mispositioned (Bug #12) — when a legacy tooltip appears inside a native `<dialog>`, it renders at wrong coordinates. Resolved when both tooltip and modal migrate to top-layer path. See `modal-dialog-migration.md#known-limitation-legacy-tooltips-inside-top-layer-dialogs`

### 6. Test confidence

**50 unit tests pass** (24 gap tests added for top-layer path)

**5 browser tests pass** (dedicated top-layer tests in `tooltip.spec.tsx`)

**13 VR tests pass** (all existing snapshots now include `platform-dst-top-layer: [true, false]` pairs; 4 new position-specific snapshots added)

**All existing legacy tests pass** — no regressions

**Coverage:** Show/hide on hover/focus, delay behavior, light dismiss, singleton management, scroll-hide, all cardinal positions, keyboard shortcuts, mouse-tracking positions (mouse, mouse-x, mouse-y), accessibility (WCAG), and integration with `Popup.Content`.
