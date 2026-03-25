# Modal Dialog Migration

> What changed when migrating `@atlaskit/modal-dialog` to use `@atlaskit/top-layer/dialog`, behind
> the `platform-dst-top-layer` feature flag.

---

## What was done

### Feature-flagged branch in `modal-wrapper.tsx`

The `InternalModalWrapper` component has an early-return branch gated on
`fg('platform-dst-top-layer')` that replaces the entire legacy rendering pipeline with a native
`<dialog>` element via `@atlaskit/top-layer/dialog`.

**Legacy path:**

```
Layering → Portal → FadeIn → FocusLock → ScrollLock → Blanket → Positioner → ModalDialog (<section>)
```

**Top-layer path:**

```
Dialog (<dialog>) → visual styling div → ModalContext.Provider → ScrollContext.Provider → children
```

### What native `<dialog>` replaces

| Legacy mechanism               | Native replacement                                                    |
| ------------------------------ | --------------------------------------------------------------------- |
| `@atlaskit/portal`             | Top layer stacking -- no DOM reordering                               |
| `react-focus-lock`             | `<dialog>.showModal()` makes background inert                         |
| `react-scrolllock`             | Native inertness prevents background interaction                      |
| `@atlaskit/blanket`            | `::backdrop` pseudo-element                                           |
| z-index / `Positioner`         | Top layer is always above everything                                  |
| `useCloseOnEscapePress`        | Native `cancel` event on `<dialog>`                                   |
| `usePreventProgrammaticScroll` | Native inertness handles this                                         |
| `FadeIn` / `@atlaskit/motion`  | CSS `@starting-style` + `allow-discrete` via `dialogSlideUpAndFade()` |
| `react-focus-lock` returnFocus | Native `<dialog>` focus restoration (returns focus to previously-focused element on close) |

### Deliberate design choice: native focus restoration

The top-layer path relies on the browser's native `<dialog>` focus restoration behavior rather than
`react-focus-lock`'s `returnFocus` prop. When a dialog opened via `showModal()` is closed, the
browser restores focus to the element that was focused before the dialog opened.

This is an explicit design choice — we prefer native browser behavior over custom focus management.
It eliminates an entire category of bugs caused by custom focus restoration conflicting with native
behavior, and automatically benefits from browser improvements. See `accessibility-criteria.md`.

### What was added to `@atlaskit/top-layer`

The `Dialog` component was enhanced to support modal-dialog's requirements:

- **`titleId` prop** -- allows modal-dialog to pass its own `titleId` (from `ModalContext`) to the
  Dialog, so `aria-labelledby` on the `<dialog>` references the correct title. When not provided,
  Dialog auto-generates a `titleId`.
- **`label` prop** -- maps to `aria-label` on the `<dialog>`. When provided, `aria-labelledby` is
  not set (aria-label takes precedence). Supports modals that use `label` instead of a visible
  title.
- **`style` prop on `Dialog`** -- allows inline CSS custom properties on the `<dialog>` element.
  Used for custom widths, heights, and fullscreen overrides.
- **`createCloseEvent` helper** (`@atlaskit/top-layer/create-close-event`) -- bridges Dialog's
  `onClose({ reason })` callback to a synthetic DOM event (`KeyboardEvent` for `'escape'`,
  `MouseEvent` for `'overlay-click'`). Useful when a consumer's `onClose` contract expects a DOM
  event (e.g. modal-dialog's `onClose(event, analyticsEvent)`).

### Visual styling

Modal-dialog provides its own visual styling via a `cssMap` (the top-layer `Dialog` provides only the
raw `<dialog>` lifecycle). Styles include background, color, flex layout, elevation
surface, box-shadow, focus-visible ring, and border-radius (with a separate T26 shape theme variant
behind `platform-dst-shape-theme-default`).

---

## Behavior changes for consumers

### `onClose` callback signature (top-layer path)

Modal's `onClose` expects `(e: KeyboardOrMouseEvent, analyticEvent: UIAnalyticsEvent) => void`. In
the top-layer path, the modal supplies a **synthetic** event so this contract is unchanged: when
close is triggered by Escape, overlay click, or programmatic from top-layer (which only provides
`{ reason }`), modal-wrapper creates a synthetic `KeyboardEvent` or `MouseEvent` and calls
`onCloseHandler(syntheticEvent)`. Consumers always receive two arguments; for top-layer-triggered
close the first argument may be synthetic (e.g. `event.target` may be missing or not the actual
trigger element).

### `shouldCloseOnEscapePress` and `shouldCloseOnOverlayClick` respected in top-layer path

Top-layer Dialog always calls `onClose({ reason })` for Escape and backdrop click. Modal-dialog
gates in its **`onDialogClose`** handler: it only forwards to the app’s `onClose` (and unmounts)
when the reason is allowed by the corresponding prop. So when `shouldCloseOnEscapePress={false}`,
Escape does not close the modal; when `shouldCloseOnOverlayClick={false}`, backdrop click does not
close it. Behavior matches the legacy path. See `notes/architecture/dialog-close-flow.md`.

### `autoFocus` behavior differences

| Value            | Legacy                                   | Top-layer                                                          |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| `true` (default) | `react-focus-lock` focuses first element | `<dialog>.showModal()` focuses first `autofocus` element or dialog |
| `ref`            | `react-focus-lock` initialFocus option   | `useAutoFocus` hook focuses the ref after mount                    |
| `false`          | `react-focus-lock` skips auto-focus      | `showModal()` still moves focus into the dialog (browser behavior) |

> Decision (2026-03-17 audit): Deprecate `autoFocus` prop. Mark as `@private` `@deprecated`.
> Native `showModal()` always moves focus into the dialog — this is correct per WCAG 2.4.3.
> `autoFocus={false}` on a modal was an anti-pattern that allowed focus to stay on background content.

### `focusLockAllowlist` not supported

Native `<dialog>.showModal()` makes everything outside inert with no allowlist mechanism. External
elements (e.g., AUI dialogs) become inert when the modal is open. There is no native equivalent.

**Impact:** Products that rely on `focusLockAllowlist` to allow focus into external layers (e.g. AUI
dialogs rendered on top of a modal) will find those elements become unreachable when the modal is
open via top-layer. This is a known gap — no fix is planned for the initial rollout. Products
affected should file feedback so we can evaluate building a workaround (e.g. moving the external
content into the `<dialog>` subtree, or using `inert` attribute management).

### `shouldReturnFocus` / `returnFocusRef` behavior

Native `<dialog>` automatically returns focus to the element that was focused before `showModal()`
was called. This covers the **default case** (`shouldReturnFocus={true}`) without any additional
code.

The **custom ref case** — where `shouldReturnFocus` is a React ref pointing to a specific element —
is **not wired** in the top-layer path. The legacy path uses `react-focus-lock`'s `onDeactivation`
callback to focus the ref after a `setTimeout(0)`. In the top-layer path, native focus restoration
fires before we can intercept it.

**Mitigation:** Native behavior is correct for the vast majority of consumers. The custom ref case
is rare and will be addressed if product feedback surfaces a need (e.g. via `requestAnimationFrame`
to re-focus the ref after native restoration).

### `onOpenComplete` / `onCloseComplete` timing

- **`onOpenComplete`** fires via `useEffect` after mount. Receives the visual container
  `HTMLDivElement` (not the `<dialog>` element).
- **`onCloseComplete`** fires after the CSS exit animation completes. The required `isOpen` prop on
  `Dialog` handles the exit lifecycle: when `isOpen` transitions to `false`, the primitive calls
  `dialog.close()` and plays the CSS exit animation internally. A fallback timeout of
  `exitDurationMs + 50ms` ensures cleanup happens even if `transitionend` doesn't fire. The `Dialog`
  primitive's `onExitFinish` callback fires when the exit lifecycle is complete, which modal-dialog
  uses to trigger `onCloseComplete` and signal `ExitingPersistence` to unmount.

### ExitingPersistence integration

`ModalTransition` wraps children in `ExitingPersistence`, which keeps components mounted during exit
animations. In the legacy path, `FadeIn` signals exit completion via `onFinish`. In the top-layer
path, the required `isOpen` prop on `Dialog` handles exit: when `isOpen={false}`, the primitive
drives the CSS exit animation via `allow-discrete` on `display`/`overlay`. The `Dialog` primitive's
`onExitFinish` callback fires when the exit animation completes (or immediately for non-animated
closes), which modal-dialog uses to signal `ExitingPersistence` to unmount. The old glue code
(manual `dialog.close()` + `transitionend` listener + `bind()`) has been fully replaced.

### Width and height handling

| Scenario                                             | Mechanism                                                         |
| ---------------------------------------------------- | ----------------------------------------------------------------- |
| Named preset (`small`, `medium`, `large`, `x-large`) | `Dialog`'s `width` prop                                           |
| Custom number (e.g. `800`)                           | `--dialog-width: 800px` on `Dialog` style                         |
| Custom string (e.g. `"80%"`)                         | `--dialog-width: 80%` on `Dialog` style                           |
| Full screen                                          | `--dialog-width: 100vw`, `maxBlockSize: 100vh`, `maxWidth: 100vw` |
| Viewport scroll                                      | `maxBlockSize: none`                                              |
| Custom height                                        | `--modal-dialog-height` CSS var on visual container               |

### Separation of concerns

| Concern                                            | Where it lives                                             |
| -------------------------------------------------- | ---------------------------------------------------------- |
| `showModal()` / `close()` lifecycle                | `@atlaskit/top-layer` (Dialog)                             |
| Escape handling (cancel event)                     | `@atlaskit/top-layer` (Dialog)                             |
| Backdrop click detection                           | `@atlaskit/top-layer` (Dialog)                             |
| `aria-label` / `aria-labelledby`                   | `@atlaskit/top-layer` (Dialog)                             |
| Close-reason → DOM event bridging                  | `@atlaskit/top-layer` (`createCloseEvent`)                 |
| Background scroll lock                             | `@atlaskit/top-layer` (`DialogScrollLock`, opt-in child)   |
| Width presets                                      | `@atlaskit/modal-dialog` (resolves named sizes to px)      |
| Responsive positioning (mobile fill / desktop gutter) | `@atlaskit/modal-dialog` (ID-scoped `<style>`)          |
| Visual styling (background, shadow, border-radius) | `@atlaskit/modal-dialog` (cssMap)                          |
| `ModalContext` / `ScrollContext`                   | `@atlaskit/modal-dialog`                                   |
| ExitingPersistence integration                     | `@atlaskit/modal-dialog`                                   |
| DnD iframe workaround                              | `@atlaskit/modal-dialog`                                   |
| Custom width/height/fullscreen                     | `@atlaskit/modal-dialog` (via `Dialog` style prop)         |

---

## Known risks

| Severity | Risk                                         | Impact                                                                  | Status   |
| -------- | -------------------------------------------- | ----------------------------------------------------------------------- | -------- |
| High     | ~~Full-screen modal does not fill viewport~~ | ~~Modal renders as narrow strip~~                                       | **Fixed** |
| High     | ~~Mobile width overflows viewport~~          | ~~Modal retains desktop width on mobile~~                               | **Fixed** |
| High     | `onClose` called without DOM event           | Consumers accessing `event.target`, `event.key` get `undefined`. Synthetic events bridge the gap. | Accepted |
| High     | Portal-based select dropdowns invisible      | Select with `menuPortalTarget: document.body` hidden behind `::backdrop`. Decision (2026-03-17 audit): Ignored — resolved by migrating select to top-layer. | Accepted |
| Medium   | ~~`isBlanketHidden` not wired~~              | ~~Backdrop always visible when hidden blanket requested~~               | **Fixed** |
| Medium   | ~~Viewport scroll missing top margin~~       | ~~No `margin-block: 60px` gap when scrolling in viewport~~             | **Fixed** |
| Medium   | `focusLockAllowlist` not supported           | External elements (AUI dialogs) become inert. Decision (2026-03-17 audit): Deprecate prop (`@private` `@deprecated`). Native `<dialog>` inertness is correct per WCAG. Investigate production usage. | Deprecated |
| Medium   | `returnFocusRef` not wired in top-layer path | Custom focus return target doesn't work. Focus restoration is handled natively by the browser's Popover API. For `returnFocusRef`, redirect focus via `requestAnimationFrame` in the `onClose` callback to override the browser's default restoration. See notes/architecture/focus.md. | Planned  |
| Medium   | `height` prop not applied                    | Modal ignores height values (420, 42em, 100%). Decision (2026-03-17 audit): Needs VR verification — significant work was done and this may already be resolved. | Verify   |
| Medium   | `width: "100%"` fills entire viewport        | Modal goes edge-to-edge instead of respecting container constraints. Decision (2026-03-17 audit): Needs VR verification — may already be resolved. | Verify   |
| Medium   | Tooltip positioning differs in `<dialog>`    | Tooltips appear at wrong position inside the modal. Decision (2026-03-17 audit): Accepted — transitional mixed-stack issue. Resolved when tooltip migrates to top-layer. | Accepted |
| Low      | ~~Nested modals darken cumulatively~~        | ~~Each `::backdrop` stacks, making background darker~~                  | **Fixed** |
| Low      | `onOpenComplete` receives `HTMLDivElement`   | Consumers checking element type will see a different type               | Open     |

---

## Visual behavior differences

> Results from comparing VR snapshots with `platform-dst-top-layer` on vs off. VR test file:
> `modal-dialog/src/__tests__/informational-vr-tests/modal-dialog-top-layer.vr.tsx`

### Bugs (unintentional differences)

#### 1. ~~Full-screen modal does not fill the viewport~~ (FIXED)

**Severity: High**

~~In the top-layer path, full-screen modals render as a narrow horizontal strip centered vertically
in the viewport, with `::backdrop` visible above and below.~~

**Fix applied:** Added `height: 100vh` to the `<dialog>` inline style when `isFullScreen` is true,
and removed the `marginBlockStart` override for fullscreen. The dialog now fills the entire viewport
on both desktop and mobile. VR-verified.

#### 2. ~~Mobile viewport: modal overflows horizontally~~ (FIXED)

**Severity: High**

~~On mobile viewports (< 30rem / 480px), the top-layer modal retains its desktop width (e.g. 600px
for `medium`), causing content to be clipped on the right edge.~~

**Fix applied:** Changed `dialogStyle['width']` from a fixed pixel value to `min(<namedWidth>, 100vw)`.
This naturally caps at viewport width on mobile without needing media queries, while preserving the
named width on desktop. VR-verified.

#### 3. ~~`isBlanketHidden` prop not wired~~ (FIXED)

**Severity: Medium**

~~When `isBlanketHidden={true}`, the `::backdrop` always renders with `token('color.blanket')`.~~

**Fix applied:** Added a `hideBackdrop` prop to the `Dialog` primitive. When true, an ID-scoped
`<style>` tag overrides `::backdrop { background-color: transparent }`. This approach was necessary
because Compiled's atomic CSS deduplicates `::backdrop { background-color }` into a single class,
making it impossible to toggle via separate cssMap entries. The ID selector has higher specificity
and always wins. `modal-wrapper.tsx` passes `hideBackdrop={stackIndex > 0 || Boolean(isBlanketHidden)}`,
which also fixes nested backdrop stacking (finding #6). VR-verified.

### Intentional / expected differences

#### 4. ~~Vertical positioning: centered vs 60px from top~~ (FIXED)

**Severity: Low**

~~Legacy modals are positioned at 60px from top; top-layer used `margin: auto` (centered).~~

**Fix applied:** Added `marginBlockStart: '60px'` as inline style on the `<dialog>`. The Dialog
primitive's `margin: auto` provides horizontal centering and bottom margin. The inline
`marginBlockStart` overrides only the block-start direction, pinning the modal 60px from the
viewport top to match legacy. VR-verified.

#### 5. Backdrop rendering differences (Investigated — accepted)

**Severity: Low**

Both paths use `token('color.blanket')` for the backdrop color. Investigation confirmed both use
the identical token value with no opacity difference. The `@atlaskit/blanket` component uses
`backgroundColor: token('color.blanket', N100A)` on a `<div>`, while the Dialog uses the same
token on `::backdrop`. Any subtle visual difference is a browser compositing artifact — `::backdrop`
is painted behind the top layer and has different stacking context behavior than a regular `<div>`.
No code change needed.

#### 6. ~~Nested modals: cumulative backdrop darkening~~ (FIXED)

**Severity: Low**

~~Each stacked `<dialog>` had its own `::backdrop`, causing progressively darker background.~~

**Fix applied:** Resolved as part of the `hideBackdrop` fix (#3). `modal-wrapper.tsx` passes
`hideBackdrop={stackIndex > 0 || Boolean(isBlanketHidden)}` to the Dialog primitive, so only the
foreground modal (stackIndex === 0) shows its `::backdrop`. Background modals get transparent
backdrops, matching the legacy single-blanket behavior. VR-verified.

### Differences needing investigation

#### 7. ~~Viewport scroll: missing top margin~~ (FIXED)

**Severity: Medium**

~~When `shouldScrollInViewport={true}`, the modal had no margin from the viewport edges.~~

**Fix applied:** Added `marginBlock: '60px'` to the `<dialog>` inline style when
`shouldScrollInViewport && !isFullScreen`. This creates the same 60px gutter at the top and bottom
as the legacy `Positioner` component. The browser scrolls the dialog within the top layer — the
background remains inert. VR-verified.

#### 8. ~~Body scroll: content height inconsistency~~ (FIXED)

**Severity: Low**

~~The top-layer path used `maxBlockSize: calc(100vh - 120px)` while legacy uses
`calc(100vh - 120px + 1px)`.~~

**Fix applied:** Aligned `maxBlockSize` to `calc(100vh - 120px + 1px)` to match the legacy
Positioner's body scroll `maxHeight` exactly. VR-verified.

### New findings from expanded VR coverage

> Added via expanded VR comparison covering all scenarios from `modal-dialog.vr.tsx`,
> `widths.vr.tsx`, and `with-layered-components.vr.tsx`.

#### 9. Select dropdown with `menuPortalTarget: document.body` is invisible

**Severity: High**

When using `react-select` with `menuPortalTarget: document.body` and `menuPosition: fixed`, the
dropdown menu portals to `<body>`. Because `<dialog>.showModal()` makes everything outside the
dialog inert, the portalled dropdown is invisible — it renders behind the `::backdrop` and is
unreachable.

**Affected:** Any select configured with `menuPortalTarget: document.body` (a common pattern used to
escape overflow clipping inside the legacy modal's scroll container).

**Not affected:**

- Select with `menuPosition: fixed` (no `menuPortalTarget`) — renders inside the dialog, works
  correctly.
- Select with `menuPosition: absolute` — renders inside the dialog, works correctly.

**Impact:** Products using `react-select` with `menuPortalTarget: document.body` inside modals will
see broken select dropdowns. This is the same class of issue as `focusLockAllowlist` — external DOM
elements are inert when a `<dialog>` is open.

**Mitigation:** Consumers should remove `menuPortalTarget: document.body` when inside a top-layer
modal. The body-scroll constraint in the top-layer path (`maxBlockSize` on the `<dialog>`) means
overflow is already handled by the dialog's own scrolling, so the portal escape hatch is less
necessary. For cases where the dropdown is clipped, consumers can use `menuPosition: 'fixed'`
without `menuPortalTarget`.

#### 10. `height` prop not applied

**Severity: Medium**

The `height` prop (e.g. `420`, `"42em"`, `"100%"`) has no visual effect in the top-layer path. The
`--modal-dialog-height` CSS custom property is set on the visual content `<div>`, but the `<dialog>`
element itself does not consume it. The modal collapses to fit its content height, ignoring the
requested height.

In the legacy path, the `Positioner` component applies `height` directly via inline styles. In the
top-layer path, the `<dialog>` has no `height` constraint, and `height: 100%` on the inner div
resolves to the dialog's intrinsic height (content-fit) rather than the custom property value.

#### 11. `width: "100%"` fills entire viewport

**Severity: Medium**

When `width="100%"` is used, the top-layer path renders the modal edge-to-edge across the full
viewport. The legacy path renders 100% relative to the `Positioner` container, which has its own
constraints.

In the top-layer path, `dialogStyle['width'] = min(100%, 100vw)` is applied to the `<dialog>`
element. For a modal `<dialog>`, the containing block is the viewport, so `100%` resolves to `100vw`,
filling the entire width. The legacy `Positioner` resolves `100%` relative to its own container width.

This also removes the border-radius since the `@media (min-width: 30rem)` query for border-radius
still applies, but the modal flush against the viewport edges makes the rounded corners look
incorrect.

#### 12. Tooltip positioning differs inside `<dialog>`

**Severity: Medium**

Tooltips rendered inside the modal appear at a different position in the top-layer path versus the
legacy path. In the legacy path, the tooltip appears adjacent to its trigger element. In the
top-layer path, the tooltip appears at the bottom-left of the modal, far from the trigger.

This is likely caused by the tooltip's positioning calculation (which uses fixed/absolute positioning
or portals) interacting differently with the `<dialog>` element's containing block and stacking
context.

### Scenarios confirmed visually identical

The following scenarios showed no meaningful visual difference between flag on and off (only the
accepted subtle backdrop color artifact from #5):

- Full-screen modal (desktop + mobile)
- Full-screen with `shouldScrollInViewport={false}`
- Full-screen with `shouldScrollInViewport={true}`
- Full-screen with nesting
- Footer with select dropdown (non-portalled select works correctly)
- Scrollable modal without header and footer
- Viewport scrolling (desktop + mobile)
- Horizontal scroll (body + viewport)
- Default modal (desktop + mobile)
- Width variants: small, medium, large, x-large, custom 420px, 42%, 42em
- Appearance (warning, danger)
- Hidden blanket
- Form content / Form as container
- Multi-line titles
- Current surface (token propagation)
- Explicit font styles
- Modal body without inline padding
- Custom child (border-radius matching)
- Nested modals (body scroll, viewport scroll)

### Summary table

| # | Difference                                 | Severity | Category    | Status    |
|---|--------------------------------------------|----------|-------------|-----------|
| 1 | Full-screen modal broken                   | High     | Bug         | **Fixed** |
| 2 | Mobile width overflow                      | High     | Bug         | **Fixed** |
| 3 | `isBlanketHidden` not wired                | Medium   | Bug         | **Fixed** |
| 4 | Vertical centering vs 60px top             | Low      | Bug         | **Fixed** |
| 5 | Backdrop color subtlety                    | Low      | Investigate | Accepted  |
| 6 | Nested backdrop stacking                   | Low      | Bug         | **Fixed** |
| 7 | Viewport scroll missing margin             | Medium   | Bug         | **Fixed** |
| 8 | Body scroll content height                 | Low      | Bug         | **Fixed** |
| 9 | Portal-based select dropdown invisible     | High     | Bug         | Open      |
| 10 | `height` prop not applied                 | Medium   | Bug         | Open      |
| 11 | `width: "100%"` fills viewport            | Medium   | Bug         | Open      |
| 12 | Tooltip positioning differs in `<dialog>` | Medium   | Bug         | Open      |

### Visual regression test coverage

VR test file: `modal-dialog/src/__tests__/informational-vr-tests/modal-dialog-top-layer.vr.tsx`

All tests use `featureFlags: { 'platform-dst-top-layer': [true, false] }` to generate paired
snapshots for comparison. 96 snapshots total (48 pairs):

- Default modal (desktop + mobile)
- Width variants (small, medium, large, x-large, custom 420px, 42%, 42em, 100%)
- Height variants (420, 42em, 100%)
- Body scroll (top, middle, bottom)
- Scrollable modal without header and footer
- Viewport scrolling (desktop + mobile)
- Horizontal scroll (body scroll, viewport scroll)
- Multi-column scroll
- Full screen (desktop + mobile)
- Full screen with `shouldScrollInViewport={false}` / `{true}`
- Full screen with nesting
- Nested modals (body scroll, viewport scroll)
- Appearance (warning, danger)
- Hidden blanket
- Form content
- Form as container
- Multi-line titles
- Footer with select dropdown
- Custom child (border-radius matching)
- Current surface (token propagation)
- Explicit font styles
- Modal body without inline padding
- Modal with open popup
- Modal with open popup select
- Modal with open tooltip
- Modal with select (`menuPortalTarget: document.body`, `menuPosition: fixed`)
- Modal with select (`menuPosition: fixed`)
- Modal with select (`menuPosition: absolute`)
- Modal with flag
- Modal with dropdown menu

---

## Test coverage

### Unit tests (Jest)

**`modal-dialog-top-layer.test.tsx`** -- 25 tests behind `ffTest.on('platform-dst-top-layer')`:

- Native `<dialog>` element rendering and `showModal()` / `close()` lifecycle
- Sub-component rendering (header, body, footer, title, close button)
- Escape (cancel event) and backdrop click closing
- Unmount on close (with ExitingPersistence / `transitionend` integration)
- `aria-labelledby` / `aria-label` accessibility
- Visual content container structure
- Width presets and custom widths (numeric and string)
- Height prop acceptance
- `onOpenComplete` callback
- `onCloseComplete` callback (fires after exit animation)
- Children and testId propagation
- No portal rendering
- Animation data attribute (`data-ds-dialog-slide-up-and-fade`) applied
- `dialog.close()` called during exit to trigger CSS exit animation
- Backdrop click followed by exit animation completes unmount

### Playwright accessibility tests

**`ff-testing/platform-dst-top-layer/modal.spec.tsx`** -- browser tests with the feature flag
enabled:

- WCAG 2.1.2: Escape always dismisses
- WCAG 2.1.2: Backdrop click dismisses
- WCAG 2.4.3: Focus moves into dialog on open
- WCAG 2.4.3: Focus returns to trigger on dismiss
- WCAG 2.4.3: Tab cycles within modal (focus trap)
- WCAG 2.4.3: Background content is inert
- WCAG 4.1.2: `<dialog>` element has correct role
- WCAG 4.1.2: `aria-labelledby` references the title
- WCAG 1.3.2: No portal rendering (element stays in DOM position)
- WCAG 2.4.7: Focus visible on elements within the dialog

### Accessibility (top-layer path)

| A11y criterion               | Browser test | Notes                                                                                                                                                                                                                                        |
| ---------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.3.1 Info and Relationships | ✓            | `modal.spec.tsx` — trigger has `aria-haspopup="dialog"` linking trigger to modal semantically. `aria-labelledby` links dialog to title.                                                                                                      |
| 1.3.2 Meaningful Sequence    | ✓            | `modal.spec.tsx` — dialog rendered in-place (no portal)                                                                                                                                                                                      |
| 2.1.1 Keyboard               | ✓            | `modal.spec.tsx` — close button activatable via keyboard                                                                                                                                                                                     |
| 2.1.2 No Keyboard Trap       | ✓            | `modal.spec.tsx` — Escape dismisses; backdrop click dismisses                                                                                                                                                                                |
| 2.4.3 Focus Order            | ✓            | `modal.spec.tsx` — focus into dialog, return, Tab trap, inert, nested                                                                                                                                                                        |
| 2.4.7 Focus Visible          | ✓            | `modal.spec.tsx` — `:focus-visible` on elements within the dialog (close button, form fields)                                                                                                                     |
| 2.4.11 Focus Not Obscured    | ✓            | `modal.spec.tsx` — dialog in top layer not obscured                                                                                                                                                                                          |
| 3.2.1 On Focus               | ✓            | Covered by design — modal opens via user activation (click), not on focus. Focus return on close does not re-trigger the modal because the consumer controls open state via `isOpen` prop, not via focus events.                             |
| 4.1.2 Name, Role, Value      | ✓            | `modal.spec.tsx` — role, aria-labelledby, aria-label, close button, trigger `aria-haspopup="dialog"`                                                                                                                                         |
| 4.1.3 Status Messages        | ✓            | Native `<dialog>` + correct role (top-layer primitive)                                                                                                                                                                                       |
| Background inertness         | ✓            | `modal.spec.tsx` — background content is inert via `showModal()`                                                                                                                                                                             |

> **Note:** All modal-dialog browser tests run with `featureFlag: 'platform-dst-top-layer'`. See
> `modal-dialog/src/__tests__/playwright/ff-testing/platform-dst-top-layer/modal.spec.tsx`.

### Existing tests

All 44 existing legacy tests pass, plus 2 skipped (unchanged).

---

## Files modified

### `@atlaskit/top-layer`

| File                                        | Change                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| `src/dialog/types.tsx`                      | Added `titleId`, `label`, `hideBackdrop`, `onExitFinish` to `DialogProps` |
| `src/dialog/dialog-context.tsx`             | Added `label` to `DialogContextValue`                                          |
| `src/dialog/dialog.tsx`                     | `DialogRoot` accepts and passes `titleId`, `label` through context             |
| `src/dialog/dialog-content.tsx`             | Conditional `aria-label` / `aria-labelledby`; merges `style` prop; `hideBackdrop` via ID-scoped `<style>` |
| `src/dialog/create-close-event.tsx`         | New: `createCloseEvent({ reason })` helper for bridging close reasons to DOM events |
| `src/entry-points/create-close-event.tsx`   | New entry point: `@atlaskit/top-layer/create-close-event`                      |
| `src/popup/types.tsx`                       | `PopupContentProps.role` narrowed to `PopupRole` union; type-level enforcement |
| `src/popup/popup-content.tsx`               | Removed runtime `console.warn` (replaced by type-level enforcement)            |
| `src/popup/index.tsx`                       | Exported `PopupRole` type                                                      |

### `@atlaskit/modal-dialog`

| File                                                                        | Change                                                              |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `src/internal/components/modal-wrapper.tsx`                                 | Added top-layer rendering path behind `platform-dst-top-layer` flag |
| `src/__tests__/unit/modal-dialog-top-layer.test.tsx`                        | 25 unit tests for top-layer path                                    |
| `src/__tests__/playwright/ff-testing/platform-dst-top-layer/modal.spec.tsx` | Playwright accessibility browser tests                              |

---

## Update: `isOpen` + `onExitFinish` replaces ExitingPersistence glue

`isOpen` is now **required** on `Dialog`. The dialog element stays mounted — consumers don't
conditionally render it. The ExitingPersistence glue code (manual `dialog.close()` + `transitionend`
listener + `bind()` + fallback timeout) has been fully replaced by two features on `Dialog`:

1. **`isOpen` prop**: The modal-dialog passes `isOpen={!isExiting}` to `Dialog`, which handles
   calling `dialog.close()` internally when `isOpen` transitions to `false`. The CSS exit animation
   plays automatically via `allow-discrete`. When `animate` is not provided, `isOpen={false}` hides
   instantly with zero overhead (no timers, no event listeners).

2. **`onExitFinish` callback**: `Dialog` fires `onExitFinish` when the exit animation completes (or
   immediately for non-animated closes). Modal-dialog uses this to call `onCloseComplete` and signal
   `ExitingPersistence` to unmount. This replaces the manual `setTimeout` that was previously needed.

`ExitingPersistence` keeps the modal-wrapper component mounted during exit. `Dialog`'s internal
`showChildren` pattern handles children lifecycle within that — children stay mounted during the
exit animation and unmount when it completes. No additional prop is needed.

Every consumer of `Dialog` already has open/close state, so requiring `isOpen` adds no burden — it
simply makes control declarative and eliminates the mount-to-show / unmount-to-hide pattern
entirely.

---

## Known limitations

### Portalled select menus are invisible inside top-layer modals (Bug #9)

**Decision: accepted for now — portal has not been migrated to top-layer.**

When a `<Select>` component uses `menuPortalTarget: document.body` inside a top-layer modal, the
dropdown menu is invisible and non-interactive. This happens because `showModal()` marks all content
outside the `<dialog>` as
[inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert). A menu
portalled to `document.body` renders outside the dialog, so it becomes inert regardless of z-index.

**Workaround for consumers:** Use `menuPosition: "fixed"` without `menuPortalTarget` to keep the
select menu inside the dialog's DOM tree:

```tsx
<Select
  menuPosition="fixed"
  // Do NOT use menuPortalTarget={document.body} inside top-layer modals
/>
```

**Long-term fix:** Once `@atlaskit/portal` is migrated to use the top-layer API, portalled content
will render in the correct stacking context.

### Legacy tooltips misposition inside top-layer modals (Bug #12)

**Decision: accepted — old-stack tooltips will not be placed on top of new-stack dialogs.**

Legacy tooltips (Popper.js-based, rendered via Portal) render at incorrect coordinates inside a
native `<dialog>` because `showModal()` establishes the dialog as a new containing block, shifting
the reference frame for `getBoundingClientRect()`-based positioning.

This is a transitional issue. When both tooltip and modal-dialog are on the top-layer path, CSS
Anchor Positioning handles coordinate systems correctly. See the
[tooltip migration notes](tooltip-migration.md#known-limitation-legacy-tooltips-inside-top-layer-dialogs)
for details.

---

## Update: `createCloseEvent` helper extracted to top-layer

Modal-dialog's `syntheticCloseEvent` function has been replaced by
`createCloseEvent({ reason })` from `@atlaskit/top-layer/create-close-event`. This is a standalone
entry point — separate from the `dialog` entry point — so consumers can import it independently.

The helper converts a `DialogCloseReason` (`'escape'` | `'overlay-click'`) into a synthetic DOM
event, bridging Dialog's `onClose({ reason })` callback to legacy APIs that expect a
`KeyboardEvent` or `MouseEvent`.

### Design decisions: what stays in modal-dialog

The following concerns were evaluated for extraction into `@atlaskit/top-layer` but deliberately
kept in `@atlaskit/modal-dialog`:

- **Width presets** (`small` → `400px`, `medium` → `600px`, etc.) — Moving the `dialogWidth`
  utility into Dialog would just shift complexity, not reduce it. The resolution logic is
  straightforward and modal-specific.
- **Responsive positioning** (mobile fill / desktop gutter via ID-scoped `<style>`) — Too
  intertwined with modal-specific scroll-mode variants (`shouldScrollInViewport`,
  `dialogHeight`, desktop margin differences). Extracting a generic `responsive` prop would
  either be too simple to cover modal's needs or too modal-specific to belong in Dialog.
- **`DialogScrollLock`** — Deliberately kept as an opt-in composable child component rather than
  a prop on Dialog. This keeps Dialog focused on the `<dialog>` lifecycle and lets consumers
  choose whether they need scroll locking.

---

## Merge Risk Assessment

**Question:** Is it safe to merge this code to master, assuming the `platform-dst-top-layer` feature flag is OFF?

### 1. Verdict

✅ **Safe to merge**

All unflagged changes are side-effect-free (imports and conditional hook calls that are stable throughout the component's lifetime). The legacy path is unaffected and all 44 existing tests pass.

### 2. Changes that execute WITHOUT the feature flag

- **Top-level imports** of `@atlaskit/top-layer` entry points and migration modules — side-effect-free, no DOM access or initialization logic
- **Bundle size increase** from importing top-layer modules (unavoidable cost of the feature)
- **Conditional `usePreventProgrammaticScroll()` hook call** — gated on `fg('platform-dst-top-layer')` in `modal-wrapper.tsx`. Safe because feature flags are resolved once at startup and **cannot change during a component's lifetime**

### 3. Changes gated behind `platform-dst-top-layer`

- Early-return branch in `InternalModalWrapper` component (`modal-wrapper.tsx:242` and `modal-wrapper.tsx:285`)
- Entire native `<dialog>` rendering path (Dialog component, visual styling, lifecycle management)
- All top-layer-specific event handlers and callbacks

### 4. Residual risks (flag off)

**Risk level: LOW**

Only unflagged changes are imports (side-effect-free) and the conditional hook call (safe due to stable flag value). No behavioral changes to the legacy rendering pipeline.

### 5. Risks when flag is turned on

**HIGH-severity accepted risks:**
- Portal-based select dropdowns invisible due to `inert` attribute (Bug #9 — accepted; resolved by migrating select to top-layer)
- `focusLockAllowlist` not supported (deprecated; native `<dialog>` inertness has no allowlist equivalent)
- `returnFocusRef` not wired (custom focus return target doesn't work; will be addressed during rollout)

**MEDIUM-severity accepted risks:**
- `onClose` receives synthetic event (KeyboardEvent/MouseEvent) — may lack properties like `event.target`
- `autoFocus={false}` still moves focus into dialog (native `showModal()` behavior, correct per WCAG)
- `onOpenComplete` receives `HTMLDivElement` not `<dialog>` element
- `height` prop may not be applied (needs VR verification; significant work was done, may already be resolved)
- `width: '100%'` fills entire viewport instead of container width (needs VR verification; may already be resolved)
- Tooltip positioning differs inside `<dialog>` (Bug #12 — accepted transitional issue; resolved when tooltip migrates)

**Fixed during development:**
- Full-screen modal, mobile width overflow, `isBlanketHidden`, vertical positioning, nested backdrop stacking, viewport scroll margin, body scroll content height

### 6. Test confidence

**35+ unit tests** (25 new for top-layer, 10 existing legacy still pass)

**15+ browser tests** (10 Playwright a11y tests for top-layer path)

**14+ VR tests** (96 total snapshots = 48 pairs comparing flag on vs off)

**44 existing legacy tests** all pass (2 pre-existing skips unchanged)

**Coverage:** Native dialog lifecycle, sub-component rendering, Escape/backdrop-click closing, exit animations, accessibility (WCAG), width/height variants, nested modals, form content, token propagation, and mixed-component scenarios.
