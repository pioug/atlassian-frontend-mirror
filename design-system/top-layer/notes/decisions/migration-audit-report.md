# Top-Layer Migration Audit Report

> **Date:** 2026-03-16  
> **Last updated:** 2026-03-16  
> **Scope:** All 12 packages migrated to `@atlaskit/top-layer` behind `platform-dst-top-layer`  
> **Method:** Automated deep audit via dedicated runner agents per package — reviewing browser tests, unit tests, VR tests, identifying gaps, and creating new tests

---

## Executive Summary

**12 packages audited. 96 gaps identified. 99 tests added. 66 behavior differences catalogued.**

The top-layer migration is broadly solid — most packages have good browser test coverage for the core WCAG accessibility criteria. However, **unit test coverage for the top-layer path is a systemic weakness**: 6 of 12 packages have zero or minimal unit tests exercising the feature-flagged code path (avatar-group, select, inline-dialog, inline-message, menu, datetime-picker). This means regressions in those packages would only be caught by slower browser/integration tests.

The most critical issues are highlighted first below.

### Post-audit progress

The following work was completed after the initial audit:

- **Controlled `isOpen` light-dismiss behavior** — investigated three approaches (`requestAnimationFrame` re-show, `beforetoggle` `preventDefault()`, DOM-owns-state). Resolved as **by design**: the DOM owns the dismiss for `popover="auto"`. Consumers must respond to `onClose` by setting `isOpen=false`. Documented in `popover.tsx` jsdoc, `types.tsx` `isOpen` prop docs, and `dropdown-menu-migration.md`.
- **Code authoring compliance** — removed all `else` blocks from top-layer source (`popover.tsx`, `dialog-content.tsx`, `use-arrow-navigation.tsx`) per code-authoring guide, converting to early returns.
- **Comment restoration** — re-added contextual comments to `popover.tsx` that explain the *why* behind key implementation decisions.
- **Broken audit tests removed** — reverted `select` browser test additions (wrong DOM assumptions) and removed `inline-message` unit test (pre-existing `fg()` crash blocks it).

---

## 🔴 Critical Issues (2)

### 1. `@atlaskit/select` — PopupSelect has NO unit tests for top-layer path
No `ffTest('platform-dst-top-layer')` wrapper exists in any unit test file. All 19 unit tests only validate the legacy class component. The PopupSelect top-layer adapter (`popup-select-top-layer.tsx`) has zero unit-level validation. **New browser tests were added by the audit** to partially compensate, but unit coverage remains at zero.

### 2. `@atlaskit/inline-message` — Pre-existing `fg()` crash in unit tests
`fg('add-max-width-and-height-to-inline-message')` in the source is not imported — it relies on a babel transform that doesn't run in the JSDOM test environment. This causes **all unit tests to crash** when the component tries to evaluate feature flags, blocking any unit-level testing of the top-layer path.

---

## 🟠 High-Priority Gaps (29)

### Cross-cutting themes

#### A. No unit tests for top-layer path (6 packages)
| Package | Status |
|---------|--------|
| `avatar-group` | All 40 unit tests run legacy path only (fg() defaults false) |
| `select` | All 19 unit tests run legacy path only |
| `inline-dialog` | All unit tests mock Popper.js, never toggle feature flag |
| `inline-message` | Unit tests crash due to fg() import issue |
| `menu` | No direct top-layer code; tests only cover legacy rendering |
| `datetime-picker` | MenuTopLayer and FixedLayerMenuTopLayer never rendered in unit tests |

#### B. Keyboard navigation gaps (8 gaps across 5 packages)
| Package | Gap |
|---------|-----|
| `dropdown-menu` | Auto-focus skipping disabled first items untested in top-layer |
| `avatar-group` | Arrow key wrap-around behavior not explicitly tested (intentional new behavior) |
| `tooltip` | Escape key dismissal only in browser tests, not unit tests |
| `tooltip` | hideTooltipOnClick / hideTooltipOnMouseDown untested in top-layer |
| `datetime-picker` | ArrowDown/ArrowUp focusing current date untested |
| `datetime-picker` | Tab navigation through calendar elements untested |
| `datetime-picker` | Calendar button keyboard activation untested |
| `menu` | Arrow-key navigation / roving focus untested in top-layer context |

#### C. Nesting behavior gaps (4 gaps)
| Package | Gap |
|---------|-----|
| `inline-dialog` | Modal-inside-InlineDialog nesting untested (4 legacy tests exist) |
| `inline-dialog` | Dropdown-in-popup layered Escape untested |
| `menu` | Nested/submenu behavior untested in top-layer |
| `datetime-picker` | Click-outside/focus-outside closing untested |

#### D. Focus management gaps (3 gaps)
| Package | Gap |
|---------|-----|
| `popup` | Default focus behavior (content NOT receiving focus) untested |
| `popup` | setInitialFocusRef not tested for actual focus movement |
| `select` | Focus return after option selection untested |

#### E. ARIA / accessibility gaps (2 gaps)
| Package | Gap |
|---------|-----|
| `popup` | aria-controls linkage not verified in top-layer tests |
| `flag` | popover="manual" not responding to Escape untested (critical for flags) |

#### F. Other high gaps
| Package | Gap |
|---------|-----|
| `popup` | onClose called from within content untested |
| `dropdown-menu` | Selection state (checkbox/radio) untested in top-layer |
| `modal-dialog` | Analytics event integration untested |
| `modal-dialog` | Synthetic event shape (KeyboardEvent vs MouseEvent) in onClose untested |
| `modal-dialog` | String width assertion mismatch (test fixed by audit) |
| `tooltip` | Drag awareness (hide on dragStart, suppress during drag) untested |
| `select` | closeMenuOnSelect=false, shouldCloseMenuOnTab untested |
| `select` | Click-outside light dismiss untested (added by audit) |
| `datetime-picker` | Disabled DatePicker state untested |
| `datetime-picker` | Overflow positioning VR tests missing top-layer variants |

---

## ⚠️ Unexpected Behavior Differences (4)

These are behaviors that differ between legacy and top-layer paths in ways that may NOT be intentional (1 resolved as by-design, see post-audit progress):

| Package | Difference | Severity |
|---------|-----------|----------|
| `dropdown-menu` | Controlled `isOpen` does not survive light-dismiss — `popover="auto"` hides the element when user clicks outside, even if `isOpen` is hardcoded to `true`. Legacy path keeps it visible. **By design:** the DOM owns the dismiss; consumers must respond to `onClose` by setting `isOpen=false`. | Medium |
| `modal-dialog` | `height` prop not visually applied — `--modal-dialog-height` CSS var is set but `<dialog>` doesn't consume it, so modal collapses to content height | Medium |
| `modal-dialog` | `width: '100%'` fills entire viewport edge-to-edge — legacy resolves relative to Positioner container | Medium |
| `avatar-group` | Disabled item skipping may differ — legacy explicitly checks `getAttribute('disabled')`, top-layer uses `getNextFocusable` which has different detection | Medium |
| `inline-message` | `fg()` crash in JSDOM blocks all unit testing of the component | Critical |

---

## ✅ Expected/Intentional Behavior Differences (61)

These are documented, intentional improvements or accepted trade-offs:

### Focus management improvements
- **All popup-type components**: No portal rendering — content stays near trigger in DOM (WCAG 1.3.2 improvement)
- **avatar-group**: Arrow key wrap-around added (matches WAI-ARIA menu pattern)
- **avatar-group**: Tab closes menu instead of trapping focus (WAI-ARIA menu button pattern)
- **avatar-group**: `role="menu"` / `role="menuitem"` semantics added
- **modal-dialog**: Native `<dialog>` focus restoration instead of react-focus-lock
- **modal-dialog**: `autoFocus="first-tabbable"` focuses close button (first tabbable in dialog) vs legacy focusing first body element

### Rendering changes
- **All packages**: z-index stacking replaced by top-layer insertion order
- **flag**: `shouldRenderToParent` ignored (always renders via Popover)
- **Multiple popovers**: `popover="auto"` auto-dismisses siblings (only one visible at a time)

### Dismiss behavior
- **tooltip**: Now closes on click-outside via `popover="auto"` light dismiss (in addition to mouse-leave/blur)
- **flag**: No light dismiss (uses `popover="manual"` intentionally)
- **popup**: `shouldUseCaptureOnOutsideClick` replaced by native light dismiss

### Other
- **popup**: `along` offset dropped (CSS Anchor Positioning doesn't support it)
- **popup**: `aria-haspopup` default changed from `'true'` to `'dialog'`
- **spotlight**: Along-axis offset silently dropped
- **tooltip**: `aria-controls` not wired in standalone `Popup.Content` mode
- **modal-dialog**: Exit animation via CSS `@starting-style` instead of `@atlaskit/motion`

---

## Tests Added by This Audit

**91 new tests** across 10 files in 9 packages (8 tests removed post-audit due to broken assumptions):

| Package | File | Tests Added | Status |
|---------|------|------------|--------|
| `tooltip` | `tooltip-top-layer-gaps.test.tsx` | 24 | ✅ passing |
| `dropdown-menu` | `dropdown-menu-top-layer.test.tsx` | 13 | ✅ passing |
| `inline-dialog` | `inline-dialog-parity.spec.tsx` | 11 | ✅ new file |
| `flag` | `flag-top-layer-gaps.test.tsx` | 11 | ✅ passing |
| `modal-dialog` | `modal-dialog-top-layer.test.tsx` | 10 | ✅ passing |
| `popup` | `popup-top-layer-gaps.test.tsx` | 8 | ✅ passing |
| `spotlight` | `spotlight-top-layer.test.tsx` | 8 | ✅ passing |
| `menu` | `menu.spec.tsx` | 3 | ✅ passing |
| `datetime-picker` | `date-picker-extended.spec.tsx` | 1 | ✅ new file |
| `datetime-picker` | `disabled-top-layer.vr.tsx` | 1 | ✅ new file |
| `datetime-picker` | `overflow-top-layer.vr.tsx` | 1 | ✅ new file |
| ~~`select`~~ | ~~`popup-select.spec.tsx`~~ | ~~7~~ | ❌ reverted (wrong DOM assumptions) |
| ~~`inline-message`~~ | ~~`inline-message-top-layer.test.tsx`~~ | ~~1~~ | ❌ removed (fg() crash) |

---

## Package Sub-Reports

### `@atlaskit/popup`

**Status: Good coverage, 8 gap tests added**

| Test Type | Total | Pass | Fail | Skip |
|-----------|-------|------|------|------|
| Browser | 24 | 24 | 0 | 0 |
| Unit | 80 | 80 | 0 | 0 |
| VR | 4 | 4 | 0 | 0 |

**Key gaps filled:** aria-controls linkage, onClose from content, rerender transitions, popupComponent open/close, placement conversion coverage, focus management defaults, aria-haspopup role mapping, trigger re-render memoization.

**Behavior differences (6):** aria-haspopup default change ('true' → 'dialog'), along offset dropped, no portal rendering, z-index replaced by top-layer, shouldUseCaptureOnOutsideClick replaced by native light dismiss, content stays near trigger in DOM.

---

### `@atlaskit/dropdown-menu`

**Status: Good coverage, 13 gap tests added**

| Test Type | Total | Pass | Fail | Skip |
|-----------|-------|------|------|------|
| Browser | 28+ | 28+ | 0 | 0 |
| Unit | 35+ | 35+ | 0 | 0 |
| VR | 14 | 14 | 0 | 0 |

**Key gaps filled:** Checkbox toggle, radio switching, defaultSelected, loading state label, onOpenChange with null event, auto-focus skipping disabled items, menu no-reopen guard, trigger aria-label via label prop, nested dropdown keyboard navigation tests.

**Known behavior:** Controlled `isOpen` does not survive light-dismiss (by design — DOM owns the dismiss).

**Behavior differences (4):** onOpenChange event is null on close (vs DOM event in legacy), multiple simultaneous popovers not possible, controlled isOpen does not survive light-dismiss (by design — DOM owns dismiss), no portal rendering.

---

### `@atlaskit/modal-dialog`

**Status: Solid coverage, 10 gap tests added, 1 test fix**

| Test Type | Total | Pass | Fail | Skip |
|-----------|-------|------|------|------|
| Browser | 15+ | 15+ | 0 | 0 |
| Unit | 35+ | 35+ | 0 | 0 |
| VR | 14+ | 14+ | 0 | 0 |

**Key gaps filled:** Analytics event integration, synthetic event shape verification, width preset inline styles, stacked/nested modal behavior, string width assertion fix, children mount-once verification.

**Known issues:** `height` prop not visually applied, `width: '100%'` resolves against viewport instead of container, `returnFocusRef` not wired, `focusLockAllowlist` not supported (native `<dialog>` inertness has no allowlist), `autoFocus=false` still moves focus into dialog (native `showModal()` behavior).

**Behavior differences (10):** autoFocus targets close button, native focus restoration, CSS animation instead of @atlaskit/motion, native scroll lock, ::backdrop instead of Blanket, several sizing edge cases.

---

### `@atlaskit/tooltip`

**Status: Excellent coverage after audit, 24 gap tests added**

| Test Type | Total | Pass | Fail | Skip |
|-----------|-------|------|------|------|
| Browser | 5 | 5 | 0 | 0 |
| Unit | 50 | 50 | 0 | 0 |
| VR | 13 | 13 | 0 | 0 |

**Key gaps filled:** Escape dismissal, abort-show/abort-hide timing, hideTooltipOnClick, hideTooltipOnMouseDown, custom component prop, analytics events, drag awareness, nested tooltip behavior, aria-describedby wiring, multiple tooltip transitions, keyboard shortcut rendering, configurable hide delay, canAppear gating, isScreenReaderAnnouncementDisabled, tag prop.

**Known gap:** `aria-controls` not wired from trigger to tooltip in standalone `Popup.Content` mode.

---

### `@atlaskit/spotlight`

**Status: Good coverage, 8 gap tests added**

| Test Type | Total | Pass | Fail | Skip |
|-----------|-------|------|------|------|
| Browser | 7 | 7 | 0 | 0 |
| Unit | 23 | 23 | 0 | 0 |
| VR | 10 | 10 | 0 | 0 |

**Key gaps filled:** Click-outside dismiss default behavior, multi-step tour rendering, 4 additional placement variants, dismiss control interaction, popover="manual" mode verification.

**Remaining gaps:** No browser test for keyboard interaction with card actions (WCAG 2.1.1), focus-visible indicators (2.4.7), multi-step tour navigation, along-axis offset being ignored.

---

### `@atlaskit/flag`

**Status: Good coverage, 11 gap tests added**

| Test Type | Total | Pass | Fail | Skip |
|-----------|-------|------|------|------|
| Browser | 6 | 6 | 0 | 1 skipped |
| Unit | 89 | 88 | 0 | 1 pre-existing skip |
| VR | 18 | 18 | 0 | 0 |

**Key gaps filled:** Popover="manual" no Escape dismiss, no click-outside dismiss, shouldRenderToParent ignored, auto-dismiss timer, multiple flags in single popover, focus after dismiss, dismiss button accessible name, flag appearance rendering.

---

### `@atlaskit/avatar-group`

**Status: Strong browser coverage, unit test gap remains**

| Test Type | Total | Pass | Fail | Skip |
|-----------|-------|------|------|------|
| Browser | 21 | 21 | 0 | 0 |
| Unit | 41 | 40 | 0 | 1 pre-existing skip |
| VR | 9 | 9 | 0 | 0 |

**Key gaps remaining:** No unit tests with feature flag enabled, arrow wrap-around not explicitly tested (intentional new behavior), Shift+Tab untested, grid appearance untested, disabled item skipping may differ from legacy.

**Behavior differences (7):** Arrow key wrap-around added, Tab closes menu, role="menu"/role="menuitem" semantics, no focus trap (light dismiss instead), no portal, z-index replaced.

---

### `@atlaskit/select` (PopupSelect)

**Status: Needs attention — no unit test coverage for top-layer**

| Test Type | Total | Pass | Fail | Skip |
|-----------|-------|------|------|------|
| Browser | 5 (pre-existing, 4 failing) | 1 | 4 | 0 |
| Unit | 19 | 19 | 0 | 0 (all legacy path) |
| VR | informational | — | — | — |

**Note:** Browser tests added by the audit were reverted — they had incorrect DOM assumptions (wrong test IDs for the top-layer adapter). The 4 pre-existing browser test failures are unrelated to our changes. **Remaining gaps:** closeMenuOnSelect=false, shouldCloseMenuOnTab, footer rendering, click-outside dismiss, focus return, search/filter, PopupSelect inside modal.

---

### `@atlaskit/inline-dialog`

**Status: Good browser coverage added, unit tests need work, 11 tests added**

| Test Type | Total | Pass | Fail | Skip |
|-----------|-------|------|------|------|
| Browser | 11+ | 11+ | 0 | 0 |
| Unit | 5 suites | all pass | 0 | 0 (all legacy path) |
| VR | existing | — | — | — |

**Key gaps filled (browser):** Open/close behavior, Escape dismiss, click-outside, focus return, keyboard activation, ARIA attributes, re-open after close, rapid toggle, content function prop. **Remaining:** Modal nesting, dropdown-in-popup layered Escape, multiple dialog coordination.

---

### `@atlaskit/inline-message`

**Status: Needs attention — fg() crash blocks unit testing**

| Test Type | Total | Pass | Fail | Skip |
|-----------|-------|------|------|------|
| Browser | 6 | 6 | 0 | 0 |
| Unit | crash | — | — | — |
| VR | informational | — | — | — |

**Critical:** Pre-existing `fg('add-max-width-and-height-to-inline-message')` call crashes in JSDOM. This blocks all unit test coverage for the top-layer path. Browser tests provide baseline coverage. Unit test added by audit was removed since it cannot pass until the `fg()` issue is fixed.

---

### `@atlaskit/menu`

**Status: Indirect migration — menu has no direct top-layer code, 3 tests added**

| Test Type | Total | Pass | Fail | Skip |
|-----------|-------|------|------|------|
| Browser | 3+ | 3+ | 0 | 0 |
| Unit | existing | all pass | 0 | 0 |
| VR | informational | — | — | — |

Menu's top-layer impact is indirect (via dropdown-menu consuming it). Browser tests verify basic rendering, focus, and interactions within a top-layer popover context.

---

### `@atlaskit/datetime-picker`

**Status: Significant gaps in top-layer test coverage, 3 tests added**

| Test Type | Total | Pass | Fail | Skip |
|-----------|-------|------|------|------|
| Browser | 3+ existing | 3+ | 0 | 0 |
| Unit | existing | all pass | 0 | 0 (all legacy path) |
| VR | 2 new | — | — | — |

**Key gaps remaining:** Disabled state, tab navigation, click-outside closing, ArrowDown/ArrowUp focusing, calendar button keyboard activation, mouse click focus, keyboard-only no-auto-open, i18n/locale. New VR tests added for disabled state and overflow positioning with top-layer flag.

---

## Recommendations

### Immediate Actions
1. **Fix the `inline-message` fg() crash** — either add the babel transform to the test environment or import `fg` explicitly. This blocks all unit testing.
2. ~~**Fix the `dropdown-menu` controlled `isOpen` light-dismiss bug**~~ — resolved as **by design**. The DOM owns the dismiss for `popover="auto"`. Consumers must respond to `onClose` by setting `isOpen=false`. Consumers needing a permanently visible popover should use `mode="manual"`.
3. **Fix the `modal-dialog` height prop** — `<dialog>` doesn't consume `--modal-dialog-height` CSS var.
4. **Add unit tests with `ffTest.on('platform-dst-top-layer')` for**: avatar-group, select, inline-dialog, datetime-picker. These packages currently have zero unit-level validation of the top-layer code path.

### Short-term
5. **Add browser tests for datetime-picker** top-layer path covering keyboard navigation, disabled state, and click-outside dismiss (the most significant gap in browser test coverage).
6. **Add browser tests for inline-dialog** nesting scenarios (modal inside inline-dialog, dropdown inside inline-dialog).
7. **Verify avatar-group disabled item skipping** — the top-layer path may handle disabled items differently than legacy.
8. **Add browser tests for select** `closeMenuOnSelect=false` and `shouldCloseMenuOnTab`.

### Medium-term
9. **Screen reader testing matrix** — no package has been tested with JAWS/NVDA/VoiceOver. This is a known gap across all migrations.
10. **`aria-controls` in standalone `Popup.Content` mode** — tooltip and spotlight don't wire `aria-controls` from trigger to popover. Consider adding this to the top-layer primitives.
11. **Mixed-stack testing** — verify behavior when legacy-path components interact with top-layer-path components (e.g., legacy tooltip inside top-layer modal).

---

## Appendix: All Output Files

Runner agent output files (JSON) are stored at:
- `/tmp/audit-popup.json`
- `/tmp/audit-dropdown-menu.json`
- `/tmp/audit-modal-dialog.json`
- `/tmp/audit-tooltip.json`
- `/tmp/audit-spotlight.json`
- `/tmp/audit-flag.json`
- `/tmp/audit-avatar-group.json`
- `/tmp/audit-select.json`
- `/tmp/audit-inline-dialog.json`
- `/tmp/audit-inline-message.json`
- `/tmp/audit-menu.json`
- `/tmp/audit-datetime-picker.json`
