# @atlaskit/top-layer

## 0.18.0

### Minor Changes

- [`b7ed2b39d3ef8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b7ed2b39d3ef8) -
  Internal: align code with package conventions. No functional changes

## 0.17.0

### Minor Changes

- [`2fd74328732bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2fd74328732bf) -
  Add dialogMotion animation preset with token-based motion values and backdrop animation

## 0.16.0

### Minor Changes

- [`6d0485dce81c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d0485dce81c4) -
  `Popover` and `Dialog` now unmount their host element after the exit animation completes, instead
  of leaving an empty `role` / `aria-*` element in the accessibility tree.

  Other small changes that fall out of this:
  - The popover/dialog `id` stays stable across opens.
  - `ref.current` is only populated while the host element is rendered. Read the ref inside
    `onOpenChange` / `onEnterFinish`, or gate the read on `isOpen`.
  - `onEnterFinish` and `onExitFinish` now fire before the internal phase transition that drives the
    unmount, so consumers reading the host element (or a forwarded ref) inside those callbacks
    always see it attached to the DOM, regardless of React batching semantics.
  - `getAriaForTrigger` returns `aria-controls: undefined` while `isOpen` is `false`; spreading the
    result onto a JSX element strips the attribute from the DOM and avoids a dangling reference.
  - `useAnchorPosition`, `useAnchorPositionAtPoint`, and `useWidthFromAnchor` now require `isOpen`
    so positioning re-runs against the freshly mounted host element on each open.
    `useWidthFromAnchor` also requires `anchorRef`.
  - `DialogScrollLock` now requires an `isOpen` prop so the scroll lock is released the moment
    `isOpen` flips to `false`, regardless of React's unmount timing.
  - `useInitialFocus` now follows the WAI-ARIA APG Combobox Pattern: when a `menu` or `listbox`
    popup is controlled by a focused combobox-like textbox whose `aria-controls` (or legacy
    `aria-owns`) references the popup, initial focus stays on the textbox instead of moving into the
    popup. Navigation is expected to be proxied via `aria-activedescendant`. Both variants are
    detected:
    - **In-popup combobox**: the focused textbox lives inside the popup.
    - **External combobox**: the focused textbox is rendered OUTSIDE the popup (for example
      `react-select`-style menus that portal the listbox). The carve-out also accepts the case where
      the textbox's `aria-controls` references a DESCENDANT of the popup host (such as
      react-select's inner `MenuList` element). Without this carve-out, moving focus into the
      listbox would blur the external textbox and cause libraries like `react-select` to close the
      menu on the same interaction that opened it.

    Popups that are not opened from a combobox-like trigger continue to receive their
    role-appropriate initial focus.

## 0.15.0

### Minor Changes

- [`e5b4070f51a93`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e5b4070f51a93) -
  Remove Top Layer compatibility aliases and expose close-event helpers from the `dialog` and
  `popover` entry points.

## 0.14.0

### Minor Changes

- [`021a645c6f39a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/021a645c6f39a) -
  Remove the `Popup` compound and `PopupSurface`; use `Popover`, `PopoverSurface`,
  `useAnchorPosition`, `useWidthFromAnchor`, `usePopoverId`, and `getAriaForTrigger` instead.

  Nested-popover focus restoration is now automatic: `Popover` snapshots `document.activeElement` in
  `beforetoggle` (newState='open') and restores it on close for focus-capturing roles (`dialog`,
  `alertdialog`, `menu`, `listbox`, `tree`, `grid`) when the close reason is Escape or programmatic.
  Click-outside (light dismiss) intentionally does not restore focus, matching the HTML Popover
  spec's `focusPreviousElement=false` rule. This fixes a Firefox bug where nested popovers left
  focus on `<body>` after dismiss.

## 0.13.0

### Minor Changes

- [`cf4af9aa9a2fe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cf4af9aa9a2fe) -
  Fix tooltip with `position="mouse-x"` / `position="mouse-y"` not respecting the `mousePosition`
  prop when the `platform-dst-top-layer` feature flag is enabled.

  The cursor-anchored tooltip is now positioned via a new `useAnchorPositionAtPoint` hook in
  `@atlaskit/top-layer`, which delegates to `useAnchorPosition` against a hidden anchor element
  placed once at the cursor location at show time. The popover stays anchored at that location and
  does not follow subsequent pointer movement.

  `useAnchorPosition` now also accepts an optional `isEnabled` prop (defaults to `true`); when
  `false`, the hook is a no-op.

## 0.12.2

### Patch Changes

- [`7210e88c14f95`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7210e88c14f95) -
  Internal: align package with house authoring rules (style-only refactors).

## 0.12.1

### Patch Changes

- [`c3913985e2415`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c3913985e2415) -
  Internal: remove unused `src/arrow/` module. The `arrow()` preset and `TArrowPreset` type were
  never exported from `package.json` and had no consumers in the codebase.

## 0.12.0

### Minor Changes

- [`cc76d2e733b71`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cc76d2e733b71) - -
  The prop `onEnterFinish` has been added to `Popup.Content` and `Popover`, for lifecycle
  coordination after the entry animation completes.
  - The prop `onExitFinish` has been added to `Popup.Content`, for lifecycle coordination after the
    exit animation completes. `Popover` already exposed this prop.

  - Updates the popup trigger's `aria-expanded` attribute, so it stays `"true"` for the full
    duration of the popup's open and close animations, only going `false` after the exit animation
    completes.

  - Internal refactor to the popup context to use a string union for state.

## 0.11.0

### Minor Changes

- [`c54bd48a31fbb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c54bd48a31fbb) -
  The slide and fade animation now supports right-to-left text direction.

## 0.10.0

### Minor Changes

- [`dec4f3444bce8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dec4f3444bce8) -
  Hardens Popup, Popover, and Dialog through stricter typed contracts, focus-management fixes, and
  clearer entry points.
  - **Stricter API contracts.** Popup, Popover, and Dialog props are now discriminated unions, so
    misuse (manual mode with `onClose`, dialogs without a label, popovers without an accessible name
    for their role) fails at compile time.
  - **Better defaults.** `Popup`'s `placement` prop now defaults to "below trigger, centered, with
    `space.100` gap", removing the awkward `placement={{}}` boilerplate.
  - **Focus-management fixes.** Empty/loading dialogs no longer trap Tab on `<body>`; rapid
    open/close/open sequences no longer focus a torn-down popover; nested top-layer popovers stay in
    their own focus scope.
  - **Cleaner entry points.** `createCloseEvent` is now available as per-primitive subpaths
    (`@atlaskit/top-layer/dialog/create-close-event` and
    `@atlaskit/top-layer/popover/create-close-event`); the combined entry point is deprecated. The
    placement-map entry point now exposes a public `LEGACY_PLACEMENTS` const for migration
    consumers.
  - **Per-primitive data attributes.** Animation hooks now emit `data-ds-popover-*` for Popover and
    `data-ds-dialog-*` for Dialog, preventing cross-primitive selector collisions.
  - **Performance and internal correctness.** `setStyle` snapshots and restores prior inline values;
    CSS-length resolution is memoised and probes inside the popover for correct token scope;
    placement resolution is stable across renders.

## 0.9.0

### Minor Changes

- [`8e9ab10567283`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e9ab10567283) -
  When `platform-dst-top-layer` is enabled, the open layer observer registration now happens inside
  the `Dialog` and `Popover` primitives directly, so `popup`, `modal-dialog`, and `tooltip` no
  longer register with the open layer observer separately (avoiding double-counting).
  - `Dialog` registers as `type: 'modal'`, with a no-op `onClose`, as there is no current use case
    for programmatic close of modals via the open layer observer.
  - `Popover` registers as `type: 'popup'` for interactive overlay roles (`dialog`, `alertdialog`,
    `menu`, `listbox`, `tree`, `grid`) and omits `type` for other roles (e.g. `tooltip`).
  - A new `programmatic` value has been added to `TPopoverCloseReason` to distinguish programmatic
    closes, such as those from the open layer observer's `closeLayers()` calls.

## 0.8.0

### Minor Changes

- [`cce485619197c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cce485619197c) -
  Remove arrow() implementation, as there are currently no consumers of it.

## 0.7.1

### Patch Changes

- Updated dependencies

## 0.7.0

### Minor Changes

- [`43e486948865a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/43e486948865a) -
  Added a new `useWidthFromAnchor` hook exported from `@atlaskit/top-layer/use-width-from-anchor`,
  for setting the width of a popover element relative to its anchor trigger. Supports three modes:
  `'none'` (no width constraint), `'match-anchor'` (popover matches anchor width exactly), and
  `'min-anchor'` (popover is at least as wide as the anchor).

  Renamed the `width` prop on `Popup.Content` to `widthFromAnchor`, and updated its type from a
  string enum `'content' | 'trigger' | 'min-trigger'` to `'none' | 'match-anchor' | 'min-anchor'` to
  match the new hook.

## 0.6.3

### Patch Changes

- [`7250582895c0b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7250582895c0b) -
  Top-layer adoption work behind the `platform-dst-top-layer` feature flag. Public adopter APIs are
  intentionally kept narrow while the top-layer API surface settles, with one exception called out
  below.

  Highlights:
  - Pass the full `[along, away]` legacy popper offset through to the new top-layer
    `placement.offset` API (via `fromLegacyPlacement`). Previously only the `away` axis was
    forwarded, which dropped the `along` offset for consumers of `Popup`, `PopupSelect`,
    `Spotlight`, and `Tooltip` when `platform-dst-top-layer` is enabled.
  - Fix broken import of `dialogHeight` and `dialogWidth` from the removed utils module in
    `@atlaskit/modal-dialog`.

  Public API:
  - **`@atlaskit/tooltip`** (`minor`): add an optional `testId?: string` field to `TriggerProps`.
    This is additive (no existing prop changes shape). Required because `@atlaskit/button/new` (and
    other `Pressable`-backed primitives) overwrite `data-testid` from spread, so the legacy
    `(triggerProps as any)['data-testid']` workaround is silently absorbed by those consumers. A
    typed `testId` field flows through their own `testId` destructure instead, restoring
    `data-testid` propagation onto the rendered trigger element.
  - **`@atlaskit/popup`**, **`@atlaskit/dropdown-menu`** (`patch`): no public type changes. Wider
    `aria-haspopup` unions that the FF-on path produces are bridged at the package boundary into
    `@atlaskit/top-layer` with localised `FUDGE(top-layer-api)` casts, documented in
    `packages/design-system/top-layer/notes/decisions/migration-roadmap.md` ("Open API decisions
    deferred to a follow-up PR"). They will be widened in a follow-up `minor` PR once the top-layer
    API is committed.
  - **`@atlaskit/modal-dialog`**, **`@atlaskit/select`**, **`@atlaskit/spotlight`**
    (`patch`/`minor`): no public type changes; bug fixes only.

  Merge-readiness fixes (FF-on test wiring + adopter behavior):
  - **`@atlaskit/popup`** (`minor`): wire the compositional `PopupContent` to delegate to
    `PopupContentTopLayer` when `platform-dst-top-layer` is enabled. Previously only the legacy
    `Popup` component had the FF branch, leaving consumers of the compositional API on the legacy
    popper path.
  - **`@atlaskit/select`** (`minor`): add an `onClick` handler to the `PopupSelect` top-layer
    trigger so clicks open/close the menu (mirrors the legacy global click handler in
    `popup-select.tsx`). Add explicit Escape handling on the menu's `onKeyDown` so the menu closes
    and focus returns to the trigger.
  - **`@atlaskit/top-layer`** (`patch`): the `<dialog>` rendered by the Dialog primitive now sets
    `aria-modal="true"` explicitly. Modern browsers infer modal semantics from `.showModal()` but
    some assistive tech still keys off the explicit attribute.
  - **`@atlaskit/top-layer`** (`patch`): guard `use-anchor-positioning` against environments where
    `ResizeObserver` is not defined (e.g. jest's `node` environment, used by the post-office test
    suite). The observer is used to wait for the popover's first valid layout before measuring;
    consumers in non-DOM jest environments now get a no-op observer and the scroll/resize listeners
    still apply if the host environment polyfills `showPopover`. Real browsers always have
    `ResizeObserver`.
  - **`@atlaskit/modal-dialog`** (`patch`): on the FF-on path, drop the `tabIndex={-1}` (and unused
    `:focus-visible` outline) from the modal content wrapper. The native `<dialog>.showModal()`
    focus-delegate algorithm picks the first focusable descendant (including `tabindex=-1`), and the
    wrapper was hijacking initial focus from the close button. Also honor `shouldReturnFocus={ref}`
    on the FF-on path (an unmount-cleanup focuses the ref after `dialog.close()` so it overrides the
    browser's automatic return-to-trigger). Boolean `shouldReturnFocus={false}` is not yet honored
    on the FF-on path — see `top-layer/notes/merge-blockers.md`.
  - **`@atlaskit/datetime-picker`** (`patch`): on the FF-on path, set `mode="manual"` on the
    `Popup.Content` rendered by both `internal/menu-top-layer.tsx` (date-picker calendar) and
    `internal/fixed-layer-menu-top-layer.tsx` (time-picker menu). With the default `mode="auto"`,
    the same click event that opens the menu (which targets the react-select combobox input —
    outside the popover element) bubbles to the browser's native popover light-dismiss handler and
    immediately closes the menu. react-select / DateTimePicker already own outside-click and Esc
    dismissal via their own state, so opting out of the native auto-dismiss is the correct
    integration. Also extend the existing Esc → trigger-focus restoration in
    `components/date-picker.tsx` to the FF-on path (manual mode disables the browser's built-in
    focus return, and the legacy code path was already handling this for itself behind an FF
    negation).
  - **`@atlaskit/popup`** (no public API change): no source changes — only FF-on Playwright
    spec/example fixes drove the suite from 21/3/2 to 27/0/0. Notable: the two `test.fixme`'d
    nested-popover cases were not browser limitations; `popover="auto"` chains correctly via DOM
    ancestry (the original fixmes had the wrong testId selector). Added `testId` props to two
    examples (`16-popup-with-a11y-props`, `18-should-fit-container`) so default-shape tests can
    reach the trigger.
  - Test alignment for FF-on Playwright suites across `popup`, `select`, `datetime-picker`,
    `inline-dialog`, `inline-message`, and `modal-dialog`: selector updates to match the new
    top-layer testId convention (`${testId}--content`, `[role="dialog"][aria-label="calendar"]`),
    per-spec `skipAxeCheck()` for example-level color-contrast violations unrelated to the
    migration, and focus assertions adjusted to match native `<dialog>` / `Popup.Content` auto-focus
    semantics (focus lands on the first focusable child, not the dialog container itself).
  - **`@atlassian/capacity-planning-capacity-graph`**, **`@atlaskit/color-picker`**,
    **`@atlassian/timeline-table`**, **`@atlassian/global-side-navigation`** (`patch`): scope `fg`
    mocks in unit tests so `platform-dst-top-layer` returns `false`. JSDOM does not implement the
    native Popover API (`showPopover`/`hidePopover`/`toggle` events), so leaving the gate ON in unit
    tests caused popover content to remain in the DOM after close and broke close-behaviour
    assertions. Browser coverage for the FF-on path is provided by the Playwright suites listed
    above.
  - **`@atlaskit/dropdown-menu`** (no public API change): test/example-only fixes for the FF-on
    Playwright suite. Added `role="menuitem"` to the nested-trigger `ButtonItem` in
    `examples/93-testing-nested-keyboard-navigation-top-layer.tsx` to satisfy axe's
    `aria-required-children` rule on the parent menu. Added a `test.beforeEach(skipAxeCheck)` to
    `dropdown-menu.spec.tsx` (FF-on suite) for example-level `color-contrast` violations on the
    pre-existing `color.text.selected`/`color.background.selected` token pair (3.91:1). Replaced a
    deadlocking `await expect(moveItem).not.toBeFocused()` pre-open assertion (Playwright's
    auto-wait blocks 5s on the absent element) with `await expect(moveItem).not.toBeVisible()`.
    Suite result: 22/22 passing.

## 0.6.2

### Patch Changes

- [`9d77f6602f870`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9d77f6602f870) -
  Fix two CSS anchor positioning bugs for aligned placements (align-start/align-end):
  1. Popups at viewport corners now correctly fall back to the diagonally opposite corner when their
     preferred placement has no space, rather than remaining partially off-screen.

  2. Popups near a single viewport edge now correctly trigger position fallbacks when their content
     is wider than the available space, rather than wrapping content into a narrow column.

## 0.6.1

### Patch Changes

- [`2bed6255731de`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2bed6255731de) -
  Top-layer adoption work behind the `platform-dst-top-layer` feature flag. Public adopter APIs are
  intentionally kept narrow while the top-layer API surface settles, with one exception called out
  below.

  Highlights:
  - Pass the full `[along, away]` legacy popper offset through to the new top-layer
    `placement.offset` API (via `fromLegacyPlacement`). Previously only the `away` axis was
    forwarded, which dropped the `along` offset for consumers of `Popup`, `PopupSelect`,
    `Spotlight`, and `Tooltip` when `platform-dst-top-layer` is enabled.
  - Fix broken import of `dialogHeight` and `dialogWidth` from the removed utils module in
    `@atlaskit/modal-dialog`.

  Public API:
  - **`@atlaskit/tooltip`** (`minor`): add an optional `testId?: string` field to `TriggerProps`.
    This is additive (no existing prop changes shape). Required because `@atlaskit/button/new` (and
    other `Pressable`-backed primitives) overwrite `data-testid` from spread, so the legacy
    `(triggerProps as any)['data-testid']` workaround is silently absorbed by those consumers. A
    typed `testId` field flows through their own `testId` destructure instead, restoring
    `data-testid` propagation onto the rendered trigger element.
  - **`@atlaskit/popup`**, **`@atlaskit/dropdown-menu`** (`patch`): no public type changes. Wider
    `aria-haspopup` unions that the FF-on path produces are bridged at the package boundary into
    `@atlaskit/top-layer` with localised `FUDGE(top-layer-api)` casts, documented in
    `packages/design-system/top-layer/notes/decisions/migration-roadmap.md` ("Open API decisions
    deferred to a follow-up PR"). They will be widened in a follow-up `minor` PR once the top-layer
    API is committed.
  - **`@atlaskit/modal-dialog`**, **`@atlaskit/select`**, **`@atlaskit/spotlight`**
    (`patch`/`minor`): no public type changes; bug fixes only.

  Merge-readiness fixes (FF-on test wiring + adopter behavior):
  - **`@atlaskit/popup`** (`minor`): wire the compositional `PopupContent` to delegate to
    `PopupContentTopLayer` when `platform-dst-top-layer` is enabled. Previously only the legacy
    `Popup` component had the FF branch, leaving consumers of the compositional API on the legacy
    popper path.
  - **`@atlaskit/select`** (`minor`): add an `onClick` handler to the `PopupSelect` top-layer
    trigger so clicks open/close the menu (mirrors the legacy global click handler in
    `popup-select.tsx`). Add explicit Escape handling on the menu's `onKeyDown` so the menu closes
    and focus returns to the trigger.
  - **`@atlaskit/top-layer`** (`patch`): the `<dialog>` rendered by the Dialog primitive now sets
    `aria-modal="true"` explicitly. Modern browsers infer modal semantics from `.showModal()` but
    some assistive tech still keys off the explicit attribute.
  - **`@atlaskit/top-layer`** (`patch`): guard `use-anchor-positioning` against environments where
    `ResizeObserver` is not defined (e.g. jest's `node` environment, used by the post-office test
    suite). The observer is used to wait for the popover's first valid layout before measuring;
    consumers in non-DOM jest environments now get a no-op observer and the scroll/resize listeners
    still apply if the host environment polyfills `showPopover`. Real browsers always have
    `ResizeObserver`.
  - **`@atlaskit/modal-dialog`** (`patch`): on the FF-on path, drop the `tabIndex={-1}` (and unused
    `:focus-visible` outline) from the modal content wrapper. The native `<dialog>.showModal()`
    focus-delegate algorithm picks the first focusable descendant (including `tabindex=-1`), and the
    wrapper was hijacking initial focus from the close button. Also honor `shouldReturnFocus={ref}`
    on the FF-on path (an unmount-cleanup focuses the ref after `dialog.close()` so it overrides the
    browser's automatic return-to-trigger). Boolean `shouldReturnFocus={false}` is not yet honored
    on the FF-on path — see `top-layer/notes/merge-blockers.md`.
  - **`@atlaskit/datetime-picker`** (`patch`): on the FF-on path, set `mode="manual"` on the
    `Popup.Content` rendered by both `internal/menu-top-layer.tsx` (date-picker calendar) and
    `internal/fixed-layer-menu-top-layer.tsx` (time-picker menu). With the default `mode="auto"`,
    the same click event that opens the menu (which targets the react-select combobox input —
    outside the popover element) bubbles to the browser's native popover light-dismiss handler and
    immediately closes the menu. react-select / DateTimePicker already own outside-click and Esc
    dismissal via their own state, so opting out of the native auto-dismiss is the correct
    integration. Also extend the existing Esc → trigger-focus restoration in
    `components/date-picker.tsx` to the FF-on path (manual mode disables the browser's built-in
    focus return, and the legacy code path was already handling this for itself behind an FF
    negation).
  - **`@atlaskit/popup`** (no public API change): no source changes — only FF-on Playwright
    spec/example fixes drove the suite from 21/3/2 to 27/0/0. Notable: the two `test.fixme`'d
    nested-popover cases were not browser limitations; `popover="auto"` chains correctly via DOM
    ancestry (the original fixmes had the wrong testId selector). Added `testId` props to two
    examples (`16-popup-with-a11y-props`, `18-should-fit-container`) so default-shape tests can
    reach the trigger.
  - Test alignment for FF-on Playwright suites across `popup`, `select`, `datetime-picker`,
    `inline-dialog`, `inline-message`, and `modal-dialog`: selector updates to match the new
    top-layer testId convention (`${testId}--content`, `[role="dialog"][aria-label="calendar"]`),
    per-spec `skipAxeCheck()` for example-level color-contrast violations unrelated to the
    migration, and focus assertions adjusted to match native `<dialog>` / `Popup.Content` auto-focus
    semantics (focus lands on the first focusable child, not the dialog container itself).
  - **`@atlassian/capacity-planning-capacity-graph`**, **`@atlaskit/color-picker`**,
    **`@atlassian/timeline-table`**, **`@atlassian/global-side-navigation`** (`patch`): scope `fg`
    mocks in unit tests so `platform-dst-top-layer` returns `false`. JSDOM does not implement the
    native Popover API (`showPopover`/`hidePopover`/`toggle` events), so leaving the gate ON in unit
    tests caused popover content to remain in the DOM after close and broke close-behaviour
    assertions. Browser coverage for the FF-on path is provided by the Playwright suites listed
    above.
  - **`@atlaskit/dropdown-menu`** (no public API change): test/example-only fixes for the FF-on
    Playwright suite. Added `role="menuitem"` to the nested-trigger `ButtonItem` in
    `examples/93-testing-nested-keyboard-navigation-top-layer.tsx` to satisfy axe's
    `aria-required-children` rule on the parent menu. Added a `test.beforeEach(skipAxeCheck)` to
    `dropdown-menu.spec.tsx` (FF-on suite) for example-level `color-contrast` violations on the
    pre-existing `color.text.selected`/`color.background.selected` token pair (3.91:1). Replaced a
    deadlocking `await expect(moveItem).not.toBeFocused()` pre-open assertion (Playwright's
    auto-wait blocks 5s on the absent element) with `await expect(moveItem).not.toBeVisible()`.
    Suite result: 22/22 passing.

## 0.6.0

### Minor Changes

- [`a75acf807a927`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a75acf807a927) -
  The public APIs for the Open Layer Observer from @atlaskit/layering have been re-exported from the
  @atlaskit/top-layer package. The long term vision is for all layering concerns to come from the
  top-layer package.

## 0.5.1

### Patch Changes

- [`693551fc3e8c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/693551fc3e8c4) -
  useAnchorPosition no longer re-runs its positioning effect when a fresh placement object reference
  with the same resolved shape is passed (eg an inline literal on every render). The hook
  structurally compares the resolved placement and reuses the previous reference when the shape is
  unchanged.

## 0.5.0

### Minor Changes

- [`6e656fce5ceee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e656fce5ceee) -
  Fix anchor positioning so multiple popovers can share the same trigger element. Previously the
  second `useAnchorPosition` call on the same trigger would overwrite the first call's `anchor-name`
  style, leaving the first popover unpositioned.

## 0.4.0

### Minor Changes

- [`58c9d421e96b1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/58c9d421e96b1) -
  Improves the jsdom test polyfill (`testing/polyfill`) to better match WHATWG popover spec
  semantics:
  - Adds the `el.popover` IDL getter/setter so feature-detection (`supportsPopoverHint()` etc) works
    in jsdom and `popover="hint"` is exercised in tests rather than silently falling back to
    `popover="auto"`.
  - Implements a separate hint stack so opening a `hint` does not close open `auto` popovers;
    opening an `auto` closes all hints; light-dismiss and Escape walk both stacks per spec.
  - Implements proper "topmost popover ancestor" lookup that walks both DOM ancestry and the invoker
    chain (via `popovertarget`), so opening a popover from a button inside another popover does not
    close the parent.
  - Light-dismiss now uses pointerdown + pointerup (with `mousedown` + `mouseup` fallback) and a
    same-target check so drag-out and drag-in gestures do not dismiss popovers.
  - `togglePopover()` now returns the actual resulting open state.
  - Per-method patching (`showPopover` / `hidePopover` / `togglePopover`) so partial native support
    in future jsdom versions still patches the missing methods.
  - Disconnected popovers are pruned from the open stacks (defends against test-pollution).
  - Clears any inline `opacity: 0` set by callers (such as `use-anchor-positioning`'s
    "hide-until-measured" guard) once the open toggle fires, since jsdom does not deliver
    `ResizeObserver` callbacks.
  - Treats `popover=""` (empty value) as `auto` per spec.

## 0.3.0

### Minor Changes

- [`60e2bb08cd411`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/60e2bb08cd411) -
  Expose Popover API and HTMLDialogElement jsdom polyfill (and toBeVisible patch) via new
  testing/polyfill and testing/to-be-visible subpath exports. Adopters can now opt in to the
  polyfill in their jest setup with a single import.

## 0.2.0

### Minor Changes

- [`997849983979b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/997849983979b) -
  Add `placement.offset = { gap, crossAxisShift }`.
  - `gap` is the distance from the trigger along the placement axis (default
    `token('space.100', '8px')`).
  - `crossAxisShift` is a perpendicular nudge with `{ value, direction: 'forwards' | 'backwards' }`.
  - Both accept numbers or CSS length strings (tokens, `calc()`, `var()`, etc).

  The JS fallback path now also honours `gap` and `crossAxisShift`. CSS length strings are resolved
  to pixels per measurement via a hidden DOM probe (the popover stays at `opacity: 0` until the
  first measurement completes, so there is no flash). Previously, the JS fallback applied a fixed
  8px gap and ignored `crossAxisShift`.

  The standalone `Popup.Content` `offset` prop is removed in favour of `placement.offset`.
  `fromLegacyPlacement` continues to accept a popper-style `[along, away]` tuple for migrations and
  now produces the new field names internally.

### Patch Changes

- Updated dependencies

## 0.1.5

### Patch Changes

- [`034e29787df79`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/034e29787df79) -
  Fix arrow tips being squared off instead of coming to a point by changing clip-path inset from 1px
  to 0px

## 0.1.4

### Patch Changes

- [`f4eca31807dcc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f4eca31807dcc) -
  Add new xcss on popover to support customize background color and address arrow style issue

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [`02483200273ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/02483200273ec) -
  Enrol all Design System UI packages into the React Compiler with platform gating via
  isReactCompilerActivePlatform.
- Updated dependencies

## 0.1.0

### Minor Changes

- [`f0bc04c9aec75`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0bc04c9aec75) -
  Creation of `@atlaskit/top-layer` — low-level layering primitives built on native browser APIs.

  Provides three core building blocks for layered UI:
  - **`Popover`** — Wraps the native Popover API (`popover="auto"`). Manages visibility, animation,
    focus wrapping, and initial focus.
  - **`Dialog`** — Wraps the native `<dialog>` element. Manages `showModal()`/`close()`, animation,
    focus trapping, Escape handling, and backdrop click detection.
  - **`Popup`** — Compound component (`Popup` + `Popup.Trigger` + `Popup.Content` + `Popup.Surface`)
    composing Popover with CSS Anchor Positioning, trigger wiring, and automatic ARIA attributes.

  Key design decisions:
  - Browser-native first: Popover API and `<dialog>` instead of portals, z-index, and custom
    layering
  - CSS-first positioning: CSS Anchor Positioning with a JS fallback for older browsers
  - CSS-first animation: `@starting-style` for entry, `transition-behavior: allow-discrete` for exit
  - Accessibility by construction: TypeScript discriminated unions enforce WCAG 4.1.2 at compile
    time
  - Entry-point friendly for Volt: each primitive available via its own entry point

### Patch Changes

- [`f0bc04c9aec75`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0bc04c9aec75) -
  Fix JS fallback positioning in Firefox: defer position calculation to requestAnimationFrame in the
  toggle event handler, since Firefox fires the toggle event synchronously during showPopover()
  before layout runs, causing offsetWidth/offsetHeight to be 0. Also remove the unnecessary initial
  update() call that ran while the popover was still hidden. Fix VR tests to actually open the popup
  before taking snapshots (they were previously only capturing the closed trigger button). Add
  additional JS fallback VR tests for align-end and inline-end alignment variants.
- [`f0bc04c9aec75`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0bc04c9aec75) -
  Defer useAnchorPosition cleanup via queueMicrotask to prevent one-frame position jump during exit
  animations

## 0.0.1

### Patch Changes

- Initial release of `@atlaskit/top-layer`.
