# @atlaskit/top-layer

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
