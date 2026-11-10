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

### Virtual focus at open

Every open gives the virtual focus (`aria-activedescendant`) to the selected option, else the first
option, as `openMenu('first')` does. This holds for a pointer or keyboard open, and for a controlled
or uncontrolled `menuIsOpen`.

A pointer open of a controlled menu that is already open (for example an `@atlaskit/select`
inline-mode menu) still moves the virtual focus: the press focuses the input, and the focus opens
the menu with `openMenu('first')`.

## Escape

On the top-layer path an open menu is its own layer. The top layer gives one Escape press to one
layer: the menu closes, and the layer under it (a Popup, a ModalDialog) stays open. Select does not
call `preventDefault()` or `stopPropagation()` for Escape itself.

`shouldPreventEscapePropagation` does nothing on the top-layer path (decision 10 in
`flag-on-all-tests/REPORT.md`). The top layer already keeps the parent layer open. To copy the
legacy behaviour, Select would have to call `stopPropagation()`, and that hides Escape from document
listeners (including the top-layer Escape handling of the layers under the menu). The prop is
`@deprecated`, so that no new callsites add it. Consumers remove it when `platform-dst-top-layer` is
cleaned up. Tests assert the outcome (the menu closes, the parent layer stays open), not a
`stopPropagation` spy.

A menu that is forced always open (`menuIsOpen` stays `true`) is content, not a layer. Render it in
place, with `menuRenderMode="inline"` on `@atlaskit/select` or `@atlaskit/user-picker` (decision 4,
see `select-migration.md`). Then Escape goes to the layer that contains it. As a layer, it would
claim every Escape and never close.

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
6. **`shouldPreventEscapePropagation`** does nothing on the top-layer path and is deprecated (see
   [Escape](#escape)).
