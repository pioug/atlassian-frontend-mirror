# @atlaskit/spotlight

## 0.15.7

### Patch Changes

- Updated dependencies

## 0.15.6

### Patch Changes

- Updated dependencies

## 0.15.5

### Patch Changes

- [`6d0485dce81c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d0485dce81c4) -
  Internal: updated to the new `@atlaskit/top-layer` `Popover`/`Dialog` behaviour where the host
  element unmounts after the exit animation completes. No consumer action required.
- Updated dependencies

## 0.15.4

### Patch Changes

- [`e5b4070f51a93`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e5b4070f51a93) -
  Remove Top Layer compatibility aliases and expose close-event helpers from the `dialog` and
  `popover` entry points.
- Updated dependencies

## 0.15.3

### Patch Changes

- Updated dependencies

## 0.15.2

### Patch Changes

- Updated dependencies

## 0.15.1

### Patch Changes

- [`f7c1be45b8989`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f7c1be45b8989) -
  Split `@atlaskit/top-layer` migration out from main `platform-dst-top-layer` FG to
  `platform-dst-top-layer-spotlight` FG. This should be a noop for functionality.

## 0.15.0

### Minor Changes

- [`e09d8bc884f22`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e09d8bc884f22) -
  Add a new `@atlaskit/spotlight/spotlight-context-provider` entry point that exports
  `SpotlightContextProvider`. The provider accepts an optional `targetRef` prop which, when
  supplied, is used as the anchor element for `PopoverContent`'s positioning — letting
  `PopoverContent` be rendered in a React subtree that doesn't share a `PopoverProvider` /
  `PopoverTarget` with its visual anchor (for example, when the content is mounted by an external
  system but the anchor is owned by the host app).

## 0.14.14

### Patch Changes

- Updated dependencies

## 0.14.13

### Patch Changes

- Updated dependencies

## 0.14.12

### Patch Changes

- Updated dependencies

## 0.14.11

### Patch Changes

- Updated dependencies

## 0.14.10

### Patch Changes

- Updated dependencies

## 0.14.9

### Patch Changes

- Updated dependencies

## 0.14.8

### Patch Changes

- Updated dependencies

## 0.14.7

### Patch Changes

- Updated dependencies

## 0.14.6

### Patch Changes

- [`570302d63431d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/570302d63431d) -
  Automatic arrow placement on popover reposition as part of top-layer integration. Changes are
  behind `platform-dst-top-layer` feature flag.

## 0.14.5

### Patch Changes

- [`25115a2ad97bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/25115a2ad97bf) -
  Add `appearance` prop to `SpotlightPrimaryAction` and `SpotlightPrimaryLink`. Available prop
  values are `outline` (default), and `primary`.

## 0.14.4

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

- Updated dependencies

## 0.14.3

### Patch Changes

- [`8f22e8eba4151`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8f22e8eba4151) -
  Changed the motion uplift feature gate for Spotlight from `platform-dst-motion-uplift` to
  `platform-dst-motion-uplift-spotlight`

## 0.14.2

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

- Updated dependencies

## 0.14.1

### Patch Changes

- Updated dependencies

## 0.14.0

### Minor Changes

- [`651ab3c79c1b4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/651ab3c79c1b4) -
  [ux] Add a feature-gated top-layer positioning path for Spotlight.

## 0.13.0

### Minor Changes

- [`aef119573f01b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aef119573f01b) -
  Autofix: add explicit package exports (barrel removal)

### Patch Changes

- Updated dependencies

## 0.12.2

### Patch Changes

- Updated dependencies

## 0.12.1

### Patch Changes

- Updated dependencies

## 0.12.0

### Minor Changes

- [`856de5254340b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/856de5254340b) -
  [ux] Added motion on open and close of Spotlight behind fg platform-dst-motion-uplift

## 0.11.3

### Patch Changes

- Updated dependencies

## 0.11.2

### Patch Changes

- [`02483200273ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/02483200273ec) -
  Enrol all Design System UI packages into the React Compiler with platform gating via
  isReactCompilerActivePlatform.
- Updated dependencies

## 0.11.1

### Patch Changes

- Updated dependencies

## 0.11.0

### Minor Changes

- [`58f8502090976`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/58f8502090976) -
  Expose `placement` prop on `SpotlightCard`. `SpotlightCard` is now better supported to render
  outside of a `PopoverProvider`.

## 0.10.10

### Patch Changes

- Updated dependencies

## 0.10.9

### Patch Changes

- Updated dependencies

## 0.10.8

### Patch Changes

- Updated dependencies

## 0.10.7

### Patch Changes

- [`5db9e3f21a52f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5db9e3f21a52f) -
  Internal refactoring
- Updated dependencies

## 0.10.6

### Patch Changes

- [`9b038ce3c261e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9b038ce3c261e) -
  Create `SpotlightPrimaryLink` and `SpotlightSecondaryLink` components.

## 0.10.5

### Patch Changes

- Updated dependencies

## 0.10.4

### Patch Changes

- Updated dependencies

## 0.10.3

### Patch Changes

- Updated dependencies

## 0.10.2

### Patch Changes

- Updated dependencies

## 0.10.1

### Patch Changes

- Updated dependencies

## 0.10.0

### Minor Changes

- [`51928601f0216`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/51928601f0216) -
  Updated border radius values behind a feature gate `platform-dst-shape-theme-default`.

### Patch Changes

- Updated dependencies

## 0.9.8

### Patch Changes

- [`14e6e700928ef`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/14e6e700928ef) -
  Internal changes to how border width and radius are applied.
- Updated dependencies

## 0.9.7

### Patch Changes

- Updated dependencies

## 0.9.6

### Patch Changes

- Updated dependencies

## 0.9.5

### Patch Changes

- [`e0d5103c4e6cd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e0d5103c4e6cd) -
  Expose `strategy` prop on `PopoverContent` which is passed through to the underlying
  `react-popper`.

## 0.9.4

### Patch Changes

- [`063f646d9daec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/063f646d9daec) -
  Added `usePreloadMedia` hook to preload video and image assets before they are rendered in the
  DOM.

  This hook is useful in the context of `@atlaskit/spotlight` where by default media will only load
  when `PopoverContent.isVisible` is set to true. `usePreloadMedia` preloads the assets for better
  performance and user experience. The hook accepts a source URL and a MIME type, creates a
  temporary media element to trigger browser caching, and the cached asset will be used when the
  actual media element is rendered.

  Supported MIME types:
  - Videos: `video/mp4`, `video/webm`, `video/ogg`, `video/mpeg`, `video/x-matroska`
  - Images: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`

  Example usage: usePreloadMedia(videoSrc, { mimetype: 'video/mp4' });

## 0.9.3

### Patch Changes

- Updated dependencies

## 0.9.2

### Patch Changes

- [`80f0a09eede30`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/80f0a09eede30) -
  Fix bug where PopoverContent initially renders in the default position before updating to user
  supplied position.

## 0.9.1

### Patch Changes

- Updated dependencies

## 0.9.0

### Minor Changes

- [`e84be109faebe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e84be109faebe) -
  Apply `overflow: hidden` on `SpotlightMedia`.

### Patch Changes

- Updated dependencies

## 0.8.0

### Minor Changes

- [`2a1e06ea7c3d7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2a1e06ea7c3d7) -
  Expose `offset` prop on `PopoverContent`. `PopoverContent` can now be manually positioned anywhere
  within the viewport.

## 0.7.2

### Patch Changes

- [`ccbe07df5c620`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ccbe07df5c620) -
  Update documentation to include motion example.

## 0.7.1

### Patch Changes

- [`991d1598db6d6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/991d1598db6d6) -
  Documentation for upcoming beta release.

## 0.7.0

### Minor Changes

- [`6e38d616cae8e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e38d616cae8e) -
  Allow back, next, done actions to be passed into PopoverContent. These actions will be used if no
  onClick handler is passed to SpotlightSecondaryAction, SpotlightPrimaryAction. If onClick handlers
  are provided to the specific components, then they will take preference over what is passed to
  PopoverContent.

## 0.6.4

### Patch Changes

- Updated dependencies

## 0.6.3

### Patch Changes

- [`1b4bf57dec49e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1b4bf57dec49e) -
  Make 'click-outside-to-dismiss' functionality optional.
- Updated dependencies

## 0.6.2

### Patch Changes

- Updated dependencies

## 0.6.1

### Patch Changes

- [`598872f9c6e06`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/598872f9c6e06) -
  Spotlight now dismisses on user click-outside.

## 0.6.0

### Minor Changes

- [`c43cbdde6f08c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c43cbdde6f08c) -
  `PopoverContent` `dismiss` prop is now required.

## 0.5.1

### Patch Changes

- [`4f9f525caaa13`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4f9f525caaa13) -
  Implement 'dismiss on escape key press' functionality. Escape will cause the current spotlight to
  call the `dismiss` function passed to `PopoverContent`. Implementation of the `dismiss` function
  is up to the consumer of the package.
- Updated dependencies

## 0.5.0

### Minor Changes

- [`72526321aecd0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/72526321aecd0) -
  Create UNSAFE_UpdateOnChange component to test strategies for recalculating PopoverContent
  position when the DOM changes.

## 0.4.1

### Patch Changes

- [`499c871b73060`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/499c871b73060) -
  Exports the PopoverContentProps

## 0.4.0

### Minor Changes

- [`07392017dde4f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/07392017dde4f) -
  Remove `width: fit-content` styling from `PopoverTarget`.

## 0.3.5

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components
- Updated dependencies

## 0.3.4

### Patch Changes

- [`cc92031710191`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cc92031710191) -
  `SpotlightDismissControl` now applies `autofocus` when it is mounted.

## 0.3.3

### Patch Changes

- [`bd8e43d78afb8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bd8e43d78afb8) - -
  Add `role="dialog"` to PopoverContent. `aria-labelledby` is internally managed by
  `SpotlightContext`.
  - Add `aria-label='Dismiss'` to `SpotlightDismissControl`.
  - Add `aria-label'` prop to `SpotlightPrimaryAction`.
  - Add `aria-label'` prop to `SpotlightSecondaryAction`.

## 0.3.2

### Patch Changes

- [`ec2250eef3ec9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ec2250eef3ec9) -
  Spotlight now accepts `top-center` and `bottom-center` placements to ensure SpotlightCard content
  can be seen on small viewports.

## 0.3.1

### Patch Changes

- [`89687a02d7e6b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/89687a02d7e6b) -
  Internal changes to support @compiled/react.

## 0.3.0

### Minor Changes

- [`7e3c08df816e2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7e3c08df816e2) - -
  Apply `z-index: 700` to caret to fix a bug with box-shadow in dark mode.
  - Apply `color: var(--ds-color-text-inverse)` to `SpotlightCard` so consumers get inverse color
    styles without needing to use `Text`.
  - Remove `SpotlightShowMoreControl` references in examples and documentation. Functionality
    remains unchanged.

## 0.2.6

### Patch Changes

- [`918be17f9334c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/918be17f9334c) -
  Vertically align heading to caret.

## 0.2.5

### Patch Changes

- [`568c26a3efec9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/568c26a3efec9) -
  Apply elevation.shadow.overflow box-shadow to SpotlightCard.

## 0.2.4

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 0.2.1

### Patch Changes

- [`3b5b4a919aaaf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3b5b4a919aaaf) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 0.2.0

### Minor Changes

- [`7663adf335f3f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7663adf335f3f) -
  Rename `Spotlight` to `SpotlightCard`. Removed `TourContext` - please use `useState` to manage
  Spotlight visibility instead.

## 0.1.0

### Minor Changes

- [`0bc8c3d1f15ee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0bc8c3d1f15ee) -
  Apply `flex-direction: row-reverse;` to `SpotlightControls` to make `SpotlightDismissControl` the
  first focusable element in `Spotlight`.

### Patch Changes

- [`6fa400e1910b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6fa400e1910b7) -
  Styling update to `PopoverContent` to set `z-index: 700` to ensure `Spotlight` displays correctly
  on top of Atlassian layering elements.
- Updated dependencies

## 0.0.18

### Patch Changes

- [`24f083242a2df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/24f083242a2df) -
  Styling update to `PopoverTarget` to set `width: fit-content` to ensure `PopoverContent` displays
  correctly in relation to target element.
- Updated dependencies

## 0.0.17

### Patch Changes

- Updated dependencies

## 0.0.16

### Patch Changes

- [`13c698778e3c6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/13c698778e3c6) -
  [ux] Atlaspack version bump

## 0.0.15

### Patch Changes

- [`5d9897e6c4558`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d9897e6c4558) -
  Temporary styling update to SpotlightPrimaryAction, SpotlightSecondaryAction,
  SpotlightDismissControl, SpotlightShowMoreControl to more closely match design ahead of visually
  refreshed tokens.

## 0.0.14

### Patch Changes

- [`85a83a17c7d56`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/85a83a17c7d56) -
  Tweak offset of caret positioning so as not to overlap the target component.
- Updated dependencies

## 0.0.13

### Patch Changes

- [`15963c2a4fb01`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/15963c2a4fb01) -
  Create StepCount component.

## 0.0.12

### Patch Changes

- [`7121a32fb1613`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7121a32fb1613) -
  Create ShowMoreControl component.

## 0.0.11

### Patch Changes

- [#200012](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/200012)
  [`fa829c42fc74f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fa829c42fc74f) -
  Create SpotlightMedia component.

## 0.0.10

### Patch Changes

- [#198989](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/198989)
  [`c4a86f623352d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c4a86f623352d) -
  Allow Spotlight to be dismissed. Implement basic Spotlight Tour functionality.

## 0.0.9

### Patch Changes

- [`d972e69e6461e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d972e69e6461e) -
  Create Body component. Rework spacing of Spotlight card. Minor refactoring.

## 0.0.8

### Patch Changes

- [`9d9570259070a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9d9570259070a) -
  Create PopoverProvider, PopoverTarget, PopoverContent components.
- [`9d9570259070a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9d9570259070a) -
  Create Caret component. Positions the Spotlight UI card in relation to the Caret component, and
  positions the Caret component in relation to the PopoverTarget element.

## 0.0.7

### Patch Changes

- [#197821](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197821)
  [`f9dbe2c16f7e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f9dbe2c16f7e0) -
  Create PopoverProvider, PopoverTarget, PopoverContent components.

## 0.0.6

### Patch Changes

- [`11c7c29e7cff4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/11c7c29e7cff4) -
  Create Controls, and DismissControl components.

## 0.0.5

### Patch Changes

- [`d63550f8e338a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d63550f8e338a) -
  Create Footer, Actions, PrimaryAction, SecondaryAction components.

## 0.0.4

### Patch Changes

- Updated dependencies

## 0.0.3

### Patch Changes

- [#193958](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193958)
  [`6fb7706c6ce32`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6fb7706c6ce32) -
  Create Header and Headline components.
- Updated dependencies

## 0.0.2

### Patch Changes

- [#189418](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189418)
  [`3f609b46c1aec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f609b46c1aec) -
  Create initial @atlaskit/spotlight package scaffold.
