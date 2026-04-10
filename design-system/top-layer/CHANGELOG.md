# @atlaskit/top-layer

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
