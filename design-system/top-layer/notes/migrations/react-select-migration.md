# react-select (MenuPortal) → Top-Layer Migration Plan

> **🟢 STATUS: IMPLEMENTED (2026-06) - always-top-layer when flag is on**
>
> Source:
>
> - `packages/design-system/react-select/src/components/menu-portal-top-layer.tsx`
> - `packages/design-system/react-select/src/components/menu-portal.tsx` (flag-routing wrapper)
> - `packages/design-system/react-select/src/select.tsx` (always portal when flag on; legacy
>   `NotifyOpenLayerObserver` suppressed)
>
> Feature flag: `platform-dst-top-layer` (registered in
> `packages/design-system/react-select/package.json`).

## Overview

`@atlaskit/react-select`'s `MenuPortal` hosts the open menu in the browser top layer via
`@atlaskit/top-layer/popover` when the feature flag is on. The same code path is inherited by
`@atlaskit/select`, which wraps `react-select`.

This migration is in scope: the regular `Select` and `Select`-derived (`Async`, `Creatable`, etc.)
components in `@atlaskit/select` and the underlying menu portal in `@atlaskit/react-select`. It is
NOT in scope: `PopupSelect` (see `select-migration.md` for that flow, which uses `@atlaskit/popup`
directly and migrates via the popup migration).

## Always-top-layer behaviour

When `platform-dst-top-layer` is on:

- Every Select that opens a menu renders in the browser top layer - including the default
  `position: absolute` inline path (no `menuPortalTarget`, no `menuPosition="fixed"`).
- `menuPortalTarget` is a hint only. The host is always the top layer. Consumers that need a
  specific portal subtree should pass `components.MenuPortal`.
- The legacy `NotifyOpenLayerObserver` is suppressed because `Popover` from `@atlaskit/top-layer`
  notifies the open-layer observer internally; threading `handleOpenLayerObserverCloseSignal`
  through `MenuPortal.onTopLayerClose` preserves the existing close-on-higher-layer behaviour.

The original plan called for routing only the already-portaled path through the top layer; the scope
expanded during implementation because (a) the top-layer host is strictly better than
`position: absolute`/`fixed` for the inline path's clipping and stacking edge cases, and (b) a
single code path is more resilient than two.

## Focus contract

React-select uses combobox + virtual focus: DOM focus stays on the combobox input while the menu is
open; option selection is conveyed via `aria-activedescendant`. `MenuPortalTopLayer` therefore does
NOT trigger `useInitialFocus` - the top-layer host accepts focus only on user action (Tab into
options is not part of react-select's interaction model).

See `packages/design-system/top-layer/notes/architecture/focus.md` for the broader top-layer focus
substrate; the `react-select` carve-out lives in
`packages/design-system/react-select/__tests__/playwright/top-layer-focus.spec.tsx`.

**Focus return on close.** Custom menu content can take focus (for example DatePicker's calendar).
The platform restores focus only for a popover that is hidden while it is still in the DOM, not one
that is removed. So when `menuIsOpen` turns `false`, Select keeps the default menu portal mounted,
hides its manual Popover (`isOpen={false}`), and unmounts the menu after the Popover's
`onExitFinish`. Popover's fallback then returns focus that is inside the menu to the element that
was focused when the menu opened. There is no fallback to Select's input: Safari, like Firefox on
macOS, does not focus a clicked button, so a mouse-opened menu can have nothing to return to. See
[`../architecture/focus.md`](../architecture/focus.md#focus-restoration).

- **While closing**, the menu is not open anywhere: light dismiss, Escape, scroll capture and scroll
  lock stop, and `aria-expanded` and `aria-controls` follow `menuIsOpen`. A reopen during the close
  shows the same menu again. A custom `MenuPortal` has no exit signal, so it unmounts at once.
- **Return, not arrival.** Focus that reaches the input while the menu is closing is a return, so
  `openMenuOnFocus` does not reopen the menu. `onFocus` still fires.
- **Outside press.** `useManualLightDismiss` blurs focus that an outside press left inside the menu,
  so the press does not return focus, as with native light dismiss.

## Test coverage

- **Unit** - `src/__tests__/unit/menu-portal-top-layer.test.tsx`,
  `src/__tests__/unit/notify-open-layer-observer.test.tsx`. Detailed DOM-contract assertions live in
  the Playwright suite (jsdom does not render `MenuPortal` reliably because react-select reads
  `controlRef` at render time and the ref callback only fires post-commit).
- **Informational VR** - `src/__tests__/informational-vr-tests/menu-portal-top-layer.vr.tsx`.
  Snapshots both flag states for the default fixture and the `transform + overflow: hidden`
  clipped-ancestor fixture.
- **Playwright (package-level)** - `__tests__/playwright/top-layer-focus.spec.tsx` and
  `__tests__/playwright/top-layer-smoke.spec.tsx`.
- **Playwright (flag-isolated)** -
  `__tests__/playwright/ff-testing/platform-dst-top-layer/menu-portal.spec.tsx` for the top-layer
  contract (overflow escape, modal stacking, ARIA wiring, typing-to-filter).

## Caveats for rollout

1. **`menuPortalTarget` is now a hint.** Consumers that relied on the portal landing inside a
   specific subtree (e.g. for theme/token scope) lose that placement. The escape hatch is
   `components.MenuPortal`.
2. **Inline-now-top-layer:** Selects that were inline (no `menuPortalTarget`) now render in the top
   layer too. This changes their DOM ancestry, which can break tests that assert ancestry or
   consumer styles that depended on the menu being a CSS descendant of the Select container.
3. **`menuPosition="fixed"`** becomes a no-op under the top-layer path; kept in the type for
   back-compat.
4. **`PopupSelect`** is migrated separately via the popup migration; the two flags
   (`platform-dst-top-layer` + `popup`'s gate) can be rolled together because both target the same
   underlying top-layer primitive.
5. **The closed menu leaves the DOM later.** With the flag on, the hidden listbox stays in the DOM
   until the Popover's exit finishes. A test that checks right after a close that the listbox is
   gone should first call `flushPopoverExit()` (from
   `@atlaskit/top-layer/testing/flush-popover-exit`), or use `waitFor`.
