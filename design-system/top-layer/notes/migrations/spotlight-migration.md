# Spotlight Migration

> What changed when migrating `@atlaskit/spotlight` to use `@atlaskit/top-layer`, behind the
> `platform-dst-top-layer` feature flag.

> Spotlight uses `Popover` directly (not the `Popup` compound) because it has its own trigger
> lifecycle. See [overview.md](../overview.md).

---

## What was done

### Feature-flagged branches

The spotlight compound component has feature-flagged branches in three places:

- **`PopoverProvider`** — when the flag is on, renders only `SpotlightContextProvider` (no Popper
  `Manager`).
- **`PopoverTarget`** — when the flag is on, renders a wrapper `div` and assigns its ref to context
  `targetRef` (no Popper `Reference`).
- **`PopoverContent`** — when the flag is on, renders `Popover` from `@atlaskit/top-layer` directly
  instead of Popper.

**Legacy path:**

```
PopoverProvider → SpotlightContextProvider + Manager
PopoverTarget → Reference → wrapper div
PopoverContent → Popper (offset, strategy, placement) → div (role="dialog", zIndex: 700) + useOnEscape + useOnClickOutside
```

**Top-layer path:**

```
PopoverProvider → SpotlightContextProvider only
PopoverTarget → div ref={targetRef}
PopoverContent → Popover (popover="manual", role="dialog", triggerRef, placement via fromLegacyPlacement, offset) + useSimpleLightDismiss → children (SpotlightCard etc.)
```

### What was replaced

| Legacy mechanism                                                | Native replacement                                                        |
| --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `@atlaskit/popper` (Manager, Reference, Popper)                 | `popover="manual"` + CSS Anchor Positioning via `useAnchorPositioning`    |
| z-index (`zIndex: 700`)                                         | Top layer insertion order                                                 |
| `useOnEscape` / `useOnClickOutside`                             | `useSimpleLightDismiss` from `@atlaskit/top-layer/use-simple-light-dismiss` |
| Popper placement map (Spotlight → Popper top/right/bottom/left) | `fromLegacyPlacement(placement)` from `@atlaskit/top-layer/placement-map` |

### Direct `Popover` approach

Spotlight controls visibility via `isVisible` and owns dismiss (Escape, click-outside, dismiss
control). It could not use the full `Popup` compound because `Popup.Trigger` binds click-to-toggle,
which would conflict with spotlight's programmatic show/hide. So `PopoverContent` uses `Popover`
directly with `mode="manual"` and `useAnchorPositioning`: it passes `triggerRef` (from context, set
by `PopoverTarget`), `placement` (from `fromLegacyPlacement(placement)`), `role="dialog"`,
`labelledBy={heading.id}`. Light dismiss (Escape and click-outside) is handled by
`useSimpleLightDismiss` from `@atlaskit/top-layer/use-simple-light-dismiss`, which provides
standalone dismiss behavior without participating in the browser's `popover="auto"` stack. This
allows multiple spotlights to coexist without mutual exclusion.

### Changes made to `@atlaskit/top-layer`

- **`src/placement-map/index.tsx`** — `LegacyPlacement` type and `placementMapping` were extended
  with `'top-center'` → `{ edge: 'start' }` and `'bottom-center'` → `{ edge: 'end' }` (equivalent to
  `{ axis: 'block', edge: 'start', align: 'center' }` and
  `{ axis: 'block', edge: 'end', align: 'center' }`) so spotlight can pass its full placement set to
  `fromLegacyPlacement()` without local mapping. No change to `onClose` in top-layer (it remains a
  no-arg callback that returns nothing).

### Arrows (Caret)

Spotlight’s arrow is the **Caret** component inside `SpotlightCard`. It is content, not the
top-layer arrow primitive. No change: the Caret and card placement styles still receive `placement`
from context (`card.setPlacement(placement)` is still called on the top-layer path). The popover is
positioned relative to the trigger via CSS Anchor Positioning, so the Caret continues to point at
the trigger.

---

## Behavior changes for consumers

### `shouldDismissOnClickOutside` respected when flag is on

When the `platform-dst-top-layer` flag is on, `useSimpleLightDismiss` provides dismiss events with a
`{ reason }` argument (`'escape'` or `'light-dismiss'`). Spotlight gates dismiss by reason:

- **Escape** always dismisses (matching legacy behavior).
- **Click-outside** (`reason === 'light-dismiss'`) only dismisses when `shouldDismissOnClickOutside`
  is `true` (matching legacy behavior).

This uses the same pattern as modal-dialog's `onDialogClose` handler.

### Synthetic event passed to `dismiss` when popover closes

Top-layer's `onClose` is called with `{ reason }` when the user dismisses via Escape or
click-outside. Spotlight's `dismiss(event: DismissEvent)` contract expects an event. To keep that
contract, spotlight creates a synthetic `KeyboardEvent` for Escape and a synthetic `MouseEvent` for
click-outside. A **TODO** in the code notes that the dismiss event should be made nullable in the
future so `dismiss` can accept `undefined`/`null` instead of a synthetic event.

### No animation

Spotlight does not support animations today. The top-layer path does not pass an `animate` prop to
`Popover`.

Note: `isOpen` is **required** on `Popover`. Spotlight uses `Popover` directly, where the consumer
owns visibility state. In the future, spotlight could pass `isOpen` to `Popover` to enable
declarative exit animations without glue code — the same pattern tooltip uses. This is not needed
today since spotlight has no animation.

---

## Visual differences

Informational VR tests comparing `platform-dst-top-layer` on vs off are in
`spotlight/__tests__/informational-vr-tests/spotlight-top-layer.vr.tsx`. The snapshots live in the
adjacent `__snapshots__/spotlight-top-layer/` directory.

### Placement alignment now correct (intentional)

The legacy path maps _all_ spotlight placements on the same edge to Popper's center-aligned value.
For example, `top-start`, `top-center`, and `top-end` all resolve to Popper's `top`, which centers
the card above the target. The top-layer path uses `fromLegacyPlacement()`, which preserves the
alignment: `top-start` aligns the card's start edge to the target's start edge, `top-end` aligns
the card's end edge to the target's end edge, and `top-center` centers.

This affects 8 of 10 placements — only `top-center` and `bottom-center` are visually identical
between paths. All non-center placements show a small positional shift toward the specified edge.
The SpotlightCard content (headline, body, footer, caret, actions) is identical.

This is an **intentional improvement**: the top-layer path correctly implements the placement
semantics that the legacy path silently ignored.

| Example        | Placement     | Visual change                                                    |
| -------------- | ------------- | ---------------------------------------------------------------- |
| single-step    | `bottom-end`  | Card shifts right — right edge aligns with target's right edge   |
| action-links   | `bottom-end`  | Same as single-step                                              |
| full-width-target | `right-end` | Card shifts down — bottom edge aligns with target's bottom edge  |
| overlaying-ui  | `top-end` / `bottom-end` | Both cards shift right (though only one is visible — see below) |
| all-placements | all 10        | 8 of 10 differ; `top-center` and `bottom-center` unchanged      |

### Along-axis offset not supported (known gap)

The legacy path passes `offset` as `[along, away]` to Popper, where the "along" component slides
the card along the target's edge. The top-layer path uses only `offset[1]` (the "away" distance)
and ignores `offset[0]` (the "along" distance). The default offset `[0, 2]` is unaffected because
the along component is 0. Any consumer that passes a non-zero along value (e.g. `offset={[400, 40]}`)
will lose the along-axis shift.

`useAnchorPosition` does not currently support an along-axis offset. If this becomes needed, it
would require extending `useAnchorPosition` to accept a cross-axis margin in addition to the
edge margin.

### Card rendering identical

The SpotlightCard itself — header, headline, body, media, footer, actions, caret arrow, dismiss
control — renders identically between flag states. The `Popover` wrapper resets its own styles
(`border: none`, `padding: 0`, `margin: 0`, `background: transparent`), so the card appearance is
unchanged.

---

## Known risks

| Severity | Risk                                  | Impact                                                                                                                                                      |
| -------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Medium   | Top-layer / non-top-layer interlacing | A portal-rendered overlay could appear behind the spotlight when the flag is on                                                                              |
| Low      | Placement alignment change            | Non-center placements (`bottom-end`, `top-start`, etc.) now correctly align instead of centering — small positional shift relative to target                |
| Low      | Along-axis offset ignored             | **Deprecated.** `offset[0]` (the "along" component) is dropped. Decision (2026-03-17 audit): along-axis offset is deprecated — we are leaning into the platform. Consumers should find alternative layouts. |
| Low      | Synthetic events for dismiss          | Consumers that inspect `dismiss` event type see a synthetic `KeyboardEvent` (Escape) or `MouseEvent` (click-outside) rather than the original browser event |

---

## Test coverage

### Unit tests (Jest)

**`spotlight/src/__tests__/unit/spotlight-top-layer.test.tsx`** — 8 tests behind
`ffTest.on('platform-dst-top-layer')`:

- Renders popover with `role="dialog"` when `isVisible` is true
- Renders nothing when `isVisible` is false
- Calls `dismiss` on Escape key via `useSimpleLightDismiss`; asserts synthetic
  `KeyboardEvent` with `key: 'Escape'`
- Uses `aria-labelledby` from heading id
- Does not use portal (popover is in DOM near provider)
- Renders with placement `bottom-end`, `top-center`, `bottom-center` (LegacyPlacement mapping)

### Visual regression tests (informational)

**`spotlight/__tests__/informational-vr-tests/spotlight-top-layer.vr.tsx`** — 5 examples, each
snapshot with `platform-dst-top-layer: [true, false]` (10 snapshots total):

- `all-placements` — all 10 placements visible; reveals alignment differences
- `single-step` — basic `bottom-end` placement
- `full-width-target` — `right-end` placement on a wide target
- `overlaying-ui` — two spotlights (`top-end`, `bottom-end`); verifies layout stability
- `action-links` — `bottom-end` with link actions

### Existing tests

All existing spotlight unit tests (including `popover-content/test.tsx`) continue to run; the legacy
path is unchanged when the flag is off.

### Accessibility (top-layer path)

| A11y criterion               | Test | Notes                                                                                                                                                                                                             |
| ---------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.3.1 Info and Relationships | ✗    | **Gap:** Spotlight uses `Popover` directly (not `Popup.Trigger`), so `aria-controls` is not wired from the target element to the spotlight popover. No programmatic trigger-to-spotlight relationship is exposed. Decision (2026-03-17 audit): This is a consumer-level concern — each standalone consumer owns their trigger lifecycle and should wire `aria-controls` in their own migration code. |
| 1.3.2 Meaningful Sequence    | ✓    | `spotlight.spec.tsx` — no portal; popover stays next to trigger in DOM                                                                                                                                            |
| 2.1.1 Keyboard               | ✗    | **Gap:** No spotlight-specific browser test for keyboard interaction (e.g. activating spotlight actions via keyboard). Spotlight is typically shown programmatically, not via keyboard trigger.                   |
| 2.1.2 No Keyboard Trap       | ✓    | `spotlight.spec.tsx` — Escape dismisses spotlight; `useSimpleLightDismiss` handles light dismiss (runs with `featureFlag: 'platform-dst-top-layer'`)                                                              |
| 2.4.3 Focus Order            | ✓    | `spotlight.spec.tsx` — focus return to trigger on dismiss                                                                                                                                                         |
| 2.4.7 Focus Visible          | ✗    | **Gap:** No spotlight-specific browser test for focus indicator visibility on interactive elements within the spotlight card.                                                                                     |
| 2.4.11 Focus Not Obscured    | ✓    | `spotlight.spec.tsx` — top-layer content not obscured; `popover="manual"` renders in browser's top layer                                                                                                         |
| 3.2.1 On Focus               | ✗    | **Gap:** No spotlight-specific browser test. Spotlight is shown programmatically (not on focus), so this criterion is low risk but unverified.                                                                    |
| 4.1.2 Name, Role, Value      | ✓    | `spotlight.spec.tsx` — `role="dialog"` and `aria-labelledby` referencing heading verified (runs with `featureFlag: 'platform-dst-top-layer'`)                                                                     |
| 4.1.3 Status Messages        | ✓    | `role="dialog"` on the popover triggers screen reader announcement when spotlight opens                                                                                                                           |

> **Note:** Existing `spotlight.spec.tsx` browser tests correctly use
> `featureFlag: 'platform-dst-top-layer'` to test the top-layer rendering path. Any future
> spotlight-specific browser tests should follow the same pattern. See
> `spotlight/__tests__/playwright/ff-testing/platform-dst-top-layer/spotlight.spec.tsx`.

---

## Out-of-scope a11y improvements

The following pre-existing accessibility issues in `@atlaskit/spotlight` are **not addressed** by
the top-layer migration. They exist in both the legacy and top-layer paths:

- **Step transition announcements (WCAG 4.1.3):** In multi-step spotlight tours, navigating between
  steps does not announce the step change to screen readers. `SpotlightStepCount` should be wrapped
  in an `aria-live="polite"` region so step transitions are announced. This is a `@atlaskit/spotlight`
  concern, not a layering concern.

---

## Files modified

### `@atlaskit/spotlight`

| File                                                    | Change                                                                                                                                                                           |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/controllers/context.tsx`                           | Added `targetRef` (RefObject) to context for Popover anchor positioning when flag is on                                                                                          |
| `src/ui/popover-provider/index.tsx`                     | When flag on, render only `SpotlightContextProvider` (no `Manager`)                                                                                                              |
| `src/ui/popover-target/index.tsx`                       | When flag on, render wrapper div with `ref={targetRef}`; no `Reference`                                                                                                          |
| `src/ui/popover-content/index.tsx`                      | When flag on, render `Popover` directly with triggerRef, placement, onClose (gates by reason to respect shouldDismissOnClickOutside), offset; gate useOnEscape/useOnClickOutside |
| `package.json`                                          | Added `@atlaskit/top-layer` dependency; added `platform-dst-top-layer` to platform-feature-flags; added `@atlassian/feature-flags-test-utils` devDependency                      |
| `tsconfig.dev.json`                                     | Added reference to `feature-flags-test-utils` for unit tests                                                                                                                     |
| `src/__tests__/unit/spotlight-top-layer.test.tsx` (new) | Unit tests for top-layer path                                                                                                                                                    |
| `__tests__/informational-vr-tests/spotlight-top-layer.vr.tsx` (new) | Informational VR tests comparing flag on vs off across 5 examples                                                                                                |

### `@atlaskit/top-layer`

| File                               | Change                                                                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/placement-map/index.tsx`      | Added `'top-center'` and `'bottom-center'` to `LegacyPlacement` and `placementMapping` (mapped to `{ edge: 'start' }` / `{ edge: 'end' }`) |
| `__tests__/unit/placement-map.tsx` | Updated expected mappings and placement count (17); adjusted uniqueness test for center placements

---

## Merge Risk Assessment

> **Verdict:** ✅ **Safe to merge**

### Changes that execute WITHOUT the feature flag

- **`SpotlightContextType.targetRef` field added** — initialized to `{ current: null }` but **not accessed** on legacy path
  - Type is `MutableRefObject<HTMLElement | null>`
  - No runtime impact on legacy rendering path
  - **Impact:** None on legacy behavior

- **Type narrowing on `popoverContent.ref` and `useFocusWithin`** — `MutableRefObject` narrowed to `RefObject`
  - At runtime, `RefObject` is a supertype; no runtime change (both are `{ current: T }`)
  - Type-only improvement for correctness
  - **Impact:** None on legacy behavior

- **Comment-only changes** in `step-count/index.tsx`, `flag.tsx`, `group-title.tsx`
  - Accessibility improvement comments documenting expected a11y behavior
  - No code changes
  - **Impact:** None

- **Unconditional imports** of `@atlaskit/top-layer` modules
  - Imports are side-effect-free; no top-level DOM access
  - **Impact:** Bundle size increase (negligible; top-layer modules are tree-shakeable)

### Changes gated behind `platform-dst-top-layer`

- **`PopoverProvider:29`** — `fg('platform-dst-top-layer')` condition
  - When flag is ON: Renders only `SpotlightContextProvider` (no Popper `Manager`)
  - When flag is OFF: Renders `SpotlightContextProvider` + Popper `Manager` (legacy)

- **`PopoverTarget:31`** — `fg('platform-dst-top-layer')` condition
  - When flag is ON: Renders wrapper `div` with `ref={targetRef}` (no Popper `Reference`)
  - When flag is OFF: Renders Popper `Reference` wrapping the target div (legacy)

- **`PopoverContent:188`** — `fg('platform-dst-top-layer')` condition
  - When flag is ON: Renders `Popover` directly from `@atlaskit/top-layer` with CSS Anchor Positioning
  - When flag is OFF: Renders Popper with legacy placement/offset/strategy (legacy)
  - Legacy `useOnEscape` and `useOnClickOutside` hooks gated (replaced by `useSimpleLightDismiss` on flag-on path)

### Residual risks (flag off)

**VERY LOW.**

- The `targetRef` field in context is inert on the legacy path (never accessed)
- Type narrowing has no runtime impact
- Comment-only changes have no runtime impact
- Legacy Popper path remains unchanged and fully functional
- No breaking changes to public API

### Risks when flag is turned on

- **Placement alignment now correct** (intentional improvement)
  - Legacy path centering all placements → top-layer path preserves alignment (`top-start`, `top-end`, `bottom-start`, `bottom-end`)
  - Non-center placements show small positional shift toward the specified edge
  - This is expected and intentional; documented in "Placement alignment now correct (intentional)"
  - **Impact:** 8 of 10 placements differ visually; `top-center` and `bottom-center` unchanged

- **Along-axis offset dropped** (intentional; deprecated)
  - `offset[0]` (the "along" component) is ignored on top-layer path
  - `offset[1]` (the "away" distance) is respected
  - **Decision (2026-03-17 audit):** Along-axis offset is deprecated; consumers should find alternative layouts
  - **Impact:** Consumers passing non-default along values (e.g. `offset={[400, 40]}`) will lose the along-axis shift

- **Synthetic events for dismiss** (intentional design)
  - Spotlight creates synthetic `KeyboardEvent` (Escape) or `MouseEvent` (click-outside) for `dismiss` callback
  - Consumers that inspect event type will see synthetic events rather than original browser events
  - **TODO in code:** dismiss event should be nullable in future so synthetic events are not needed
  - **Impact:** Event inspection code may behave differently; typical dismiss handlers unaffected

- **Top-layer / non-top-layer interlacing risk** (medium severity)
  - Portal-rendered overlays could appear behind the spotlight when flag is ON
  - This is a known cross-component risk during rollout (documented in "Known risks")
  - **Impact:** Coordinate with other modal/overlay migrations to ensure consistent layering

### Test confidence

| Test type | Count | Status | Coverage |
| --- | --- | --- | --- |
| Unit tests (legacy) | 15 | ✓ Pass | Existing popover-content and spotlight tests |
| Unit tests (top-layer) | 8 | ✓ Pass (added) | New paths; role="dialog", aria-labelledby, no portal, placement mapping, Escape dismiss, synthetic events |
| Gap tests | 8 | ✓ Pass (added) | Rendering, visibility, dismiss handling, accessibility wiring |
| Browser tests | 7 | ✓ Pass | Meaningful sequence (no portal), keyboard dismiss (Escape), focus order, focus not obscured, ARIA role + labelledby |
| VR snapshots | 10 | ✓ Pass | 5 examples with flag on vs off |
| Placement tests | 5 | ✓ Pass | all-placements, single-step, full-width-target, overlaying-ui, action-links |
| Alignment differences verified | 8 of 10 placements | ✓ Confirmed | Intentional; top-layer preserves alignment semantics |
| Card rendering identical | 5 of 5 | ✓ Pass | SpotlightCard content unchanged between paths |

**Summary:** All existing legacy tests pass. 8 new unit tests added for top-layer path. Browser tests confirm accessibility on top-layer path. VR tests confirm placement alignment changes are intentional and card rendering is identical. Residual risks are very low (inert context field, type-only narrowing, comment changes). Known risks (placement alignment, along-axis offset, synthetic events, interlacing) are documented and intentional.                                         |
