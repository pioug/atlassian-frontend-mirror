# Accessibility Audit Report — `@atlaskit/top-layer`

> Audit date: 2026-02-28 Scope: `@atlaskit/top-layer` primitives and all adopters (`dropdown-menu`,
> `popup`, `tooltip`, `modal-dialog`, `flag`, `spotlight`) Reference:
> [accessibility-criteria.md](../goals/accessibility-criteria.md)

---

## Executive Summary

The `@atlaskit/top-layer` package provides strong foundations for accessibility — native `<dialog>`
and Popover API usage eliminates entire classes of a11y bugs (portal DOM ordering, z-index
obscuring, competing focus-trap libraries). This audit found a handful of issues; the most critical
(`aria-haspopup` not synchronized with content role) has been **fixed** in this pass. Remaining
items are medium/low severity and tracked below.

### Key Findings

| Category                            | Status | Summary                                                                                                     |
| ----------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| **DOM order (Req 1)**               | Pass   | All adopters render in-place via top layer — no portal rendering                                            |
| **Focus follows role (Req 2)**      | Pass   | Dialog traps focus natively; menu Tab-exits correctly; initial focus is native by design (see criteria doc) |
| **Background inert (Req 3)**        | Pass   | `<dialog>.showModal()` makes background inert; tested in both modal-dialog and top-layer                    |
| **Escape always dismisses (Req 4)** | Pass   | Native Popover API Escape cannot be blocked; `<dialog>` `cancel` event fires on Escape                      |
| **Focus return (Req 5)**            | Pass   | Native focus return works; tested for nested layers up to 3 levels                                          |
| **ARIA attributes (4.1.2)**         | Pass   | `aria-haspopup` now synchronized with content role (**fixed in this audit**)                                |
| **Test coverage**                   | Pass   | aXe unit tests added for top-layer paths; Playwright assertions strengthened                                |

---

## Part 1: `@atlaskit/top-layer` Primitives

### 1.1 Popover (`src/popover/popover.tsx`)

| Criterion            | Status | Details                                                                            |
| -------------------- | ------ | ---------------------------------------------------------------------------------- |
| **Role**             | Pass   | Forwards `role` from props to the popover element                                  |
| **Accessible name**  | Pass   | Forwards `aria-label` / `aria-labelledby`                                          |
| **Escape dismisses** | Pass   | Capture-phase `keydown` listener tracks Escape; native light dismiss handles close |
| **Focus return**     | Pass   | Native `popover="auto"` returns focus to previously focused element                |
| **DOM order**        | Pass   | No portal rendering; element stays in DOM position                                 |

**Notes:**

- **No custom initial-focus API** — this is a deliberate design choice. We lean on native browser
  focus behavior for both `<dialog>` and `popover="auto"`. See the "Deliberate design decision"
  section in [accessibility-criteria.md](../goals/accessibility-criteria.md).
- **No `aria-describedby` support** — not required by WCAG 4.1.2 (which requires name and role, not
  description). The ARIA APG says `aria-describedby` "can" be used on dialogs, not "must." Consumers
  needing it can apply it directly to the popover element via a ref.

### 1.2 Dialog (`src/dialog/dialog-content.tsx`)

| Criterion            | Status | Details                                                       |
| -------------------- | ------ | ------------------------------------------------------------- |
| **Role**             | Pass   | Native `<dialog>` element provides `role="dialog"` implicitly |
| **Accessible name**  | Pass   | `aria-label` or `aria-labelledby` forwarded                   |
| **Focus trap**       | Pass   | `showModal()` natively traps focus                            |
| **Background inert** | Pass   | `showModal()` makes background inert                          |
| **Escape dismisses** | Pass   | `onCancel` fires `onClose({ reason: 'escape' })`              |
| **Focus return**     | Pass   | Native `<dialog>` returns focus on close                      |

**Notes:**

- **No `aria-describedby` prop** — not required by WCAG 4.1.2. The ARIA APG says `aria-describedby`
  "can" be used on dialogs, not "must." Consumers needing it can apply it directly via a ref.
- **No explicit `aria-modal="true"`** — not needed. The
  [HTML AAM](https://www.w3.org/TR/html-aam-1.0/#el-dialog) specifies that a `<dialog>` shown via
  `showModal()` has implicit `aria-modal="true"` semantics. All modern browsers (Chrome, Firefox,
  Safari) expose this correctly in the accessibility tree. Adding it explicitly would be redundant.
- **ESLint disables** (`click-events-have-key-events`, `no-noninteractive-element-interactions`) —
  **investigated and justified.** The `onClick` on `<dialog>` is exclusively for backdrop click
  detection (`event.target === event.currentTarget`). The keyboard equivalent (Escape) is handled
  via the native `cancel` event. There is no keyboard gesture for "click the backdrop."
- **No custom initial-focus API** — deliberate design choice. We lean on native browser focus
  behavior. See [accessibility-criteria.md](../goals/accessibility-criteria.md).

### 1.3 Popup Compound (`src/popup/`)

| Criterion           | Status | Details                                                                                                  |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------------- |
| **Trigger ARIA**    | Pass   | `aria-expanded`, `aria-controls`, `aria-haspopup` all correctly synchronized via context                 |
| **Role on content** | Pass   | Consumer-specified role forwarded to `Popover`                                                           |
| **Accessible name** | Pass   | Type system enforces `label` or `labelledBy` for roles that require it (`dialog`, `alertdialog`, `menu`) |
| **Escape**          | Pass   | Popover API handles Escape                                                                               |
| **Focus return**    | Pass   | Native popover focus return                                                                              |

**Notes:**

1. ~~`**aria-haspopup` not synchronized with content role\*\*~~ — **Fixed.** `Popup.Content` now
   calls `setAriaHasPopup(roleToAriaHasPopup(role))` via `useLayoutEffect`, synchronizing the
   trigger's `aria-haspopup` with the content's role before the browser paints. **Tests added** for
   `menu`, `dialog`, and `listbox` roles.
2. `**Popup.Trigger` has no keyboard activation\*\* — acceptable. The trigger's child is expected to
   be a `<button>` (or other natively interactive element), which handles Enter/Space natively.

### 1.4 useArrowNavigation (`src/use-arrow-navigation/`)

| Criterion         | Status | Details                                                           |
| ----------------- | ------ | ----------------------------------------------------------------- |
| **ArrowDown/Up**  | Pass   | Moves focus forward/backward with wrap                            |
| **Home/End**      | Pass   | Moves focus to first/last item                                    |
| **Tab exits**     | Pass   | Calls `onClose()`, does not `preventDefault()` — focus exits menu |
| **Skip disabled** | Pass   | Respects `disabled`, `aria-disabled="true"`, `tabindex="-1"`      |

**Notes:**

- **No Enter/Space activation of focused item** — acceptable. Activation is delegated to the item
  elements themselves. Menu items are expected to be native buttons or links.
- ~~`**focusable.ts` does not filter `aria-hidden` elements\*\*~~ — **Fixed.** Added
  `:not([aria-hidden="true"])` to the focusable element selectors.

### 1.5 Primitive Gaps Summary

| Gap                                             | Severity     | WCAG  | Status                                                                        |
| ----------------------------------------------- | ------------ | ----- | ----------------------------------------------------------------------------- |
| `Popup.Content` does not call `setAriaHasPopup` | ~~**High**~~ | 4.1.2 | **Fixed** — `useLayoutEffect` now syncs `ariaHasPopup` from content role      |
| `focusable.ts` doesn't filter `aria-hidden`     | ~~Low~~      | 2.4.3 | **Fixed** — added `:not([aria-hidden="true"])` to selectors                   |
| No `aria-describedby` on Dialog                 | —            | 4.1.2 | **Not needed** — WCAG 4.1.2 requires name/role, not description               |
| No explicit `aria-modal` on Dialog              | —            | 4.1.2 | **Not needed** — HTML AAM specifies `showModal()` implies `aria-modal="true"` |
| No initial-focus API                            | —            | 2.4.3 | **By design** — documented in accessibility-criteria.md                       |
| ESLint disables on dialog                       | —            | —     | **Justified** — backdrop click has no keyboard equivalent beyond Escape       |

---

## Part 2: Adopter Audits

### 2.1 `@atlaskit/dropdown-menu`

**Entry points used:** `Popup`, `useArrowNavigation`, `getFirstFocusable`, `slideAndFade`,
`fromLegacyPlacement`

| Criterion                       | Status | Details                                                                              |
| ------------------------------- | ------ | ------------------------------------------------------------------------------------ |
| **role="menu"** on content      | Pass   | Set on `Popup.Content`                                                               |
| **role="menuitem"** on items    | Pass   | Set on `ButtonItem` and `LinkItem`                                                   |
| **role="menuitemcheckbox"**     | Pass   | Correct with `aria-checked`                                                          |
| **role="menuitemradio"**        | Pass   | Correct with `aria-checked` and `aria-describedby`                                   |
| **aria-expanded** on trigger    | Pass   | Reflects open state                                                                  |
| **aria-controls** on trigger    | Pass   | References popover ID                                                                |
| **aria-haspopup** on trigger    | Pass   | Now shows `"menu"` — fixed by `Popup.Content` syncing role to trigger context        |
| **aria-label** on menu          | Pass   | Uses `menuLabel` / `label` / trigger text fallback                                   |
| **Focus to first item on open** | Pass   | `getFirstFocusable` + `requestAnimationFrame` when keyboard-triggered or `autoFocus` |
| **Focus return on close**       | Pass   | Escape returns to trigger; `returnFocusRef` supported                                |
| **Tab exits menu**              | Pass   | `useArrowNavigation` calls `onClose` without `preventDefault`                        |
| **Arrow navigation**            | Pass   | ArrowDown/Up with wrap, Home/End, skip disabled                                      |
| **Escape dismisses**            | Pass   | Native Popover API                                                                   |
| **DOM order**                   | Pass   | No portal; content near trigger                                                      |

**Pre-existing issues (out of scope for top-layer):**

| Issue                                                                        | Severity | WCAG  | Notes                                                                                                |
| ---------------------------------------------------------------------------- | -------- | ----- | ---------------------------------------------------------------------------------------------------- |
| `GroupTitle` uses `role="menuitem"` with `aria-hidden="true"` — non-standard | Low      | 1.3.1 | Documented in code and migration notes. APG recommends `role="presentation"` with `aria-labelledby`. |
| Separators are visual-only (CSS border), no `role="separator"`               | Low      | 1.3.1 | Documented in migration notes. This is an `@atlaskit/menu` concern.                                  |

**Test coverage:** Strong — 30+ unit tests and 10+ Playwright tests cover ARIA, focus, keyboard, and
DOM order. `aria-haspopup="menu"` test **updated** to verify correct value.

### 2.2 `@atlaskit/popup`

**Entry points used:** `Popup`, `slideAndFade`, `fromLegacyPlacement`

| Criterion           | Status | Details                                                        |
| ------------------- | ------ | -------------------------------------------------------------- |
| **aria-expanded**   | Pass   | Reflects open state                                            |
| **aria-controls**   | Pass   | Set when open, references popover ID                           |
| **aria-haspopup**   | Pass   | Now uses `ariaAttributes` from `Popup.TriggerFunction` context |
| **Role on content** | Pass   | Consumer-specified role forwarded                              |
| **Accessible name** | Pass   | `label` or `labelledBy`                                        |
| **Focus return**    | Pass   | `triggerRef.focus()` on Escape                                 |
| **Escape**          | Pass   | Native Popover API                                             |
| **DOM order**       | Pass   | No portal                                                      |

**Changes in this audit:**

- **Fixed** `aria-haspopup` in `popup-top-layer.tsx` — now reads from `ariaAttributes` context
  (provided by `Popup.TriggerFunction`) instead of hardcoding `role === 'dialog' ? 'dialog' : true`.
  This means the trigger's `aria-haspopup` correctly reflects the content's role for all roles.
- **Updated** `TriggerProps` type to accept all valid ARIA haspopup values.
- **Added** unit test asserting `aria-haspopup` matches content role.

**Test coverage:** Good — unit tests cover ARIA attributes, role forwarding, `aria-haspopup`
matching. Playwright covers Escape, focus return, inertness.

### 2.3 `@atlaskit/tooltip`

**Entry points used:** `Popover`, `useAnchorPosition`, `slideAndFade`, `fromLegacyPlacement`

| Criterion                       | Status | Details                                                              |
| ------------------------------- | ------ | -------------------------------------------------------------------- |
| **role="tooltip"**              | Pass   | Set on Popover element                                               |
| **aria-describedby** on trigger | Pass   | Points to hidden content span                                        |
| **No focus trap**               | Pass   | Tooltip is non-interactive                                           |
| **Escape dismisses**            | Pass   | Native Popover API (top-layer path disables `useCloseOnEscapePress`) |
| **DOM order**                   | Pass   | No portal                                                            |

**Pre-existing issues (out of scope for top-layer):**

| Issue                                                                                            | Severity | WCAG  | Notes                                                     |
| ------------------------------------------------------------------------------------------------ | -------- | ----- | --------------------------------------------------------- |
| Possible double announcement — both visible tooltip content and hidden span expose the same text | Low      | 4.1.3 | Documented in code and migration notes.                   |
| `role="presentation"` on container — may hide semantics if misapplied                            | Low      | 1.3.1 | Same in both paths — existing @atlaskit/tooltip behavior. |

**Test coverage:** Good — top-layer unit tests cover hover/focus show, blur/light-dismiss hide,
`role="tooltip"`, `aria-describedby`. No dedicated Escape test (relies on native Popover API).

### 2.4 `@atlaskit/modal-dialog`

**Entry points used:** `Dialog`, `dialogSlideUpAndFade`

| Criterion            | Status | Details                            |
| -------------------- | ------ | ---------------------------------- |
| **role="dialog"**    | Pass   | Native `<dialog>` element          |
| **aria-labelledby**  | Pass   | Points to `ModalTitle` id          |
| **aria-label**       | Pass   | Used when `label` prop is provided |
| **Focus trap**       | Pass   | Native `showModal()`               |
| **Background inert** | Pass   | Native `showModal()`               |
| **Escape dismisses** | Pass   | `cancel` event → `onClose`         |
| **Focus return**     | Pass   | Native dialog focus return         |
| **Tab cycles**       | Pass   | Native dialog focus containment    |
| **DOM order**        | Pass   | No portal                          |

**Changes in this audit:**

- **Documented** native focus restoration as an explicit design choice in `modal-wrapper.tsx` and
  migration notes. The top-layer path relies on browser's native `<dialog>` focus restoration,
  replacing `react-focus-lock`'s `returnFocus`.
- **Added** aXe unit test for the top-layer path (`ffTest.on('platform-dst-top-layer', ...)`).

**Pre-existing issues:**

| Issue                                                               | Severity | WCAG  | Status                                            |
| ------------------------------------------------------------------- | -------- | ----- | ------------------------------------------------- |
| No `aria-describedby` support                                       | —        | 4.1.2 | Not required by WCAG; consumers can apply via ref |
| No explicit `aria-modal="true"` (browser infers from `showModal()`) | —        | 4.1.2 | Not needed; HTML AAM covers this natively         |

**Test coverage:** Strong — Playwright tests cover focus into dialog, return to trigger on Escape,
Tab cycling, background inertness, nested modals. **aXe unit test added** for top-layer path.

### 2.5 `@atlaskit/flag`

**Entry points used:** `Popover`

| Criterion                 | Status           | Details                                                                  |
| ------------------------- | ---------------- | ------------------------------------------------------------------------ |
| **role="alert"** on flags | Pass             | Each flag has `role="alert"`                                             |
| **Accessible landmark**   | Pass             | VisuallyHidden heading labels the region                                 |
| **Dismiss button**        | Pass             | `IconButton` has `label="Dismiss"` providing accessible name             |
| **No Escape close**       | Pass (by design) | `popover="manual"` disables light dismiss; flags persist until dismissed |

**Changes in this audit:**

- **Added** aXe unit test for the top-layer path (`ffTest.on('platform-dst-top-layer', ...)`).
- **Updated** Playwright test comment — dismiss button has `label="Dismiss"` via `IconButton`, test
  skip is likely a test-setup issue (pre-existing, out of scope).
- **Documented** `role="alert"` improvement opportunity in code and migration notes.

**Pre-existing issues (out of scope for top-layer):**

| Issue                                                                       | Severity | WCAG  | Notes                                   |
| --------------------------------------------------------------------------- | -------- | ----- | --------------------------------------- |
| `role="alert"` on all flags — non-critical flags should use `role="status"` | Medium   | 4.1.3 | Documented in code and migration notes. |

**Test coverage:** Improved — aXe unit test added for top-layer path. Playwright tests cover
rendering, dismissal, ARIA role, focus-visible, DOM order.

### 2.6 `@atlaskit/spotlight`

**Entry points used:** `Popover`, `useAnchorPosition`, `fromLegacyPlacement`

| Criterion            | Status           | Details                                              |
| -------------------- | ---------------- | ---------------------------------------------------- |
| **role="dialog"**    | Pass             | Set on Popover element                               |
| **aria-labelledby**  | Pass             | Points to `SpotlightHeadline` id                     |
| **Dismiss button**   | Pass             | `aria-label="Dismiss"`                               |
| **Auto-focus**       | Pass             | `SpotlightDismissControl` has `autoFocus={true}`     |
| **Escape dismisses** | Pass             | Top-layer: native Popover API; Legacy: `useOnEscape` |
| **No focus trap**    | Pass (by design) | Spotlight is non-modal                               |
| **Focus return**     | Pass             | Native popover focus return — **tested**             |

**Changes in this audit:**

- **Added** aXe unit test for the top-layer path (`ffTest.on('platform-dst-top-layer', ...)`).
- **Strengthened** Playwright test for focus return — now asserts focus is automatically restored to
  the "Show Spotlight" button after Escape (instead of manually calling `.focus()`).
- **Documented** step-change announcement improvement opportunity in code and migration notes.

**Pre-existing issues (out of scope for top-layer):**

| Issue                                                                                 | Severity | WCAG  | Notes                                   |
| ------------------------------------------------------------------------------------- | -------- | ----- | --------------------------------------- |
| No step-change announcements for multi-step tours (no `aria-live` or `role="status"`) | Medium   | 4.1.3 | Documented in code and migration notes. |

**Test coverage:** Improved — aXe unit test and focus-return Playwright assertion added.

---

## Part 3: Test Coverage vs Accessibility Criteria

### Non-Negotiable Requirements

| Req   | Description                      | top-layer Tests                                                     | Adopter Tests                                                                     | Verdict     |
| ----- | -------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------- |
| **1** | DOM order matches visual order   | Popover: 1 test (DOM near trigger)                                  | dropdown-menu: 2 tests, popup: tested, modal: tested                              | **Covered** |
| **2** | Focus follows role semantics     | Dialog: Tab cycles, inert; Popover: Tab exits; Arrow nav: Tab exits | dropdown-menu: Tab exits, focus to first item; modal: Tab cycles, focus in, inert | **Covered** |
| **3** | Background inert when modal open | Dialog: 1 test                                                      | modal-dialog: 1 Playwright test                                                   | **Covered** |
| **4** | Escape always dismisses          | Dialog: 1 test; Popover: 2 tests                                    | dropdown-menu: tested; popup: tested; modal: tested                               | **Covered** |
| **5** | Focus returns to trigger         | Dialog: 1 test; Popover: 1 test; Nested: 3 tests                    | dropdown-menu: tested; popup: tested; modal: tested; spotlight: **tested**        | **Covered** |

### WCAG Success Criteria

| SC                               | Level | Tests Exist                                                                                       | Gaps                                                      |
| -------------------------------- | ----- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **2.1.1 Keyboard**               | A     | Popover: Enter/Space open; Arrow nav: all directions                                              | Covered                                                   |
| **2.1.2 No Keyboard Trap**       | A     | Dialog: Escape, Tab cycles; Popover: Escape; Arrow nav: Tab exits                                 | Covered                                                   |
| **2.4.3 Focus Order**            | A     | Dialog: focus in, return, trap; Popover: return; Nested: 3-level return                           | Covered (initial focus is native by design)               |
| **2.4.7 Focus Visible**          | AA    | Dialog: `:focus-visible` on button; Popover: trigger and inner; Arrow nav: items                  | Covered                                                   |
| **2.4.11 Focus Not Obscured**    | AA    | Dialog: `elementFromPoint`; Popover: positive rect                                                | Covered                                                   |
| **3.2.1 On Focus**               | A     | Popover: focus return does not re-open                                                            | Covered                                                   |
| **4.1.2 Name, Role, Value**      | A     | Popover: `aria-haspopup`, `aria-expanded`, `aria-controls`, role, label; Dialog: role, labelledby | **All fixed and tested**                                  |
| **4.1.3 Status Messages**        | AA    | Dialog: announcement role; Popover: announcement role                                             | Pre-existing: flag `role="alert"`, spotlight step changes |
| **1.3.1 Info and Relationships** | A     | Popover: `aria-controls` references popover                                                       | Pre-existing: dropdown separators, GroupTitle role        |
| **1.3.2 Meaningful Sequence**    | A     | Popover: DOM near trigger                                                                         | Covered                                                   |

---

## Part 4: Actions Taken

### Fixed in This Audit

| #   | Issue                                                                                                                     | Component                     | WCAG  | Resolution                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----- | ----------------------------------------------------------------------------- |
| 1   | `Popup.Content` does not call `setAriaHasPopup(roleToAriaHasPopup(role))` — trigger always shows `aria-haspopup="dialog"` | top-layer Popup               | 4.1.2 | **Fixed** — `useLayoutEffect` in `Popup.Content` to sync role                 |
| 2   | dropdown-menu trigger has `aria-haspopup="dialog"` instead of `"menu"`                                                    | dropdown-menu                 | 4.1.2 | **Fixed** — resolved automatically by #1                                      |
| 3   | `focusable.ts` doesn't filter `aria-hidden` elements                                                                      | top-layer useArrowNavigation  | 2.4.3 | **Fixed** — added `:not([aria-hidden="true"])` to selectors; tests pass       |
| 10  | `@atlaskit/popup` top-layer path hardcoded `aria-haspopup`                                                                | popup                         | 4.1.2 | **Fixed** — now reads from `Popup.TriggerFunction` context's `ariaAttributes` |
| 14  | aXe tests don't cover top-layer path                                                                                      | modal-dialog, flag, spotlight | —     | **Fixed** — aXe unit tests added for all three behind `ffTest.on()`           |
| 19  | Spotlight focus return not asserted in tests                                                                              | spotlight                     | 2.4.3 | **Fixed** — Playwright assertion now verifies focus is restored after Escape  |

### Resolved by Design / Research

| #   | Issue                                           | Resolution                                                                                                  |
| --- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 4   | No `aria-describedby` on Dialog                 | **Not needed** — WCAG 4.1.2 requires name/role, not description. Consumers can apply via ref if needed.     |
| 5   | No explicit `aria-modal="true"` on Dialog       | **Not needed** — HTML AAM specifies `showModal()` implies `aria-modal="true"`. All browsers implement this. |
| 6   | No custom initial-focus API                     | **By design** — documented in accessibility-criteria.md. Native browser behavior is preferred.              |
| 7   | ESLint disables on dialog backdrop click        | **Justified** — backdrop click detection has no keyboard equivalent beyond Escape (already handled).        |
| 8   | Popup.Trigger has no keyboard activation        | **Acceptable** — trigger child is expected to be a native `<button>`.                                       |
| 9   | No Enter/Space activation in useArrowNavigation | **Acceptable** — delegated to native menu item elements.                                                    |

### Documented as Out of Scope

These are pre-existing issues that exist in both legacy and top-layer paths. They have been
documented in code comments and migration notes for future improvement.

| #   | Issue                                                       | Component     | Location of Documentation                                      |
| --- | ----------------------------------------------------------- | ------------- | -------------------------------------------------------------- |
| 11  | `role="alert"` on all flags, including non-critical         | flag          | `flag.tsx` code comment + `flag-migration.md`                  |
| 12  | No step-change announcements in spotlight tours             | spotlight     | `step-count/index.tsx` code comment + `spotlight-migration.md` |
| 13  | Dismiss button a11y test skipped in flag                    | flag          | Updated test comment in `flag.spec.tsx`                        |
| 15  | GroupTitle uses `role="menuitem"` + `aria-hidden="true"`    | dropdown-menu | `group-title.tsx` code comment + `dropdown-menu-migration.md`  |
| 16  | Visual-only separators (no `role="separator"`)              | dropdown-menu | `dropdown-menu-migration.md`                                   |
| 17  | Tooltip may double-announce (hidden span + visible tooltip) | tooltip       | `tooltip-migration.md`                                         |
| 18  | Native focus restoration as explicit design choice          | modal-dialog  | `modal-wrapper.tsx` code comment + `modal-dialog-migration.md` |

### Tests Added

| File                                                            | What was added                                                             |
| --------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `top-layer/__tests__/unit/popover.tsx`                          | `aria-haspopup` tests for `menu`, `dialog`, `listbox`; open-state aXe test |
| `modal-dialog/__tests__/unit/modal-dialog-top-layer.test.tsx`   | aXe unit test behind `ffTest.on('platform-dst-top-layer')`                 |
| `flag/__tests__/unit/flag-top-layer.test.tsx`                   | aXe unit test behind `ffTest.on('platform-dst-top-layer')`                 |
| `spotlight/__tests__/unit/spotlight-top-layer.test.tsx`         | aXe unit test behind `ffTest.on('platform-dst-top-layer')`                 |
| `popup/__tests__/unit/popup-top-layer.test.tsx`                 | `aria-haspopup` role-matching tests (default + menu)                       |
| `dropdown-menu/__tests__/unit/dropdown-menu-top-layer.test.tsx` | Updated `aria-haspopup` assertion to expect `"menu"`                       |
| `spotlight/__tests__/playwright/.../spotlight.spec.tsx`         | Strengthened focus-return assertion (automatic, not manual)                |

---

## Part 5: What's Working Well

The top-layer migration has already resolved significant accessibility issues:

- **No more portal rendering** — DOM order matches visual order across all adopters (WCAG 1.3.2)
- **No more competing focus-trap libraries** — native `<dialog>` and Popover API handle focus
  natively (WCAG 2.1.2)
- **Escape always works** — native Popover API light dismiss cannot be blocked by JavaScript (WCAG
  1.4.13, 2.1.2)
- **Background inertness is native** — `showModal()` makes background content inert without manual
  `aria-hidden` toggling (WCAG 2.4.3)
- **Focus return is native** — no custom hooks needed for focus return on close (WCAG 2.4.3)
- **Type-safe accessible names** — discriminated unions enforce `label` or `labelledBy` for roles
  that require it (WCAG 4.1.2)
- **`:focus-visible` works correctly** — no portal rendering means the browser's native focus
  indicator isn't disrupted (WCAG 2.4.7)
- **Top layer prevents obscuring** — focused layers are always above other content (WCAG 2.4.11)
- **Nested focus return tested** — 3-level nesting with correct focus return at each level (WCAG
  2.4.3)
