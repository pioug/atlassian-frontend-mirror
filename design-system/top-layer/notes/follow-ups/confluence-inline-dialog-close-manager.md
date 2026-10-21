# Follow-up: Confluence's inline dialog close manager on the top-layer path

**Status:** TODO (Confluence code).

## Context

A Confluence `contextMenu` Forge app lives in a `Popup` (`ForgeAction` in
`confluence/next/packages/highlight-actions/src/ForgeAction.tsx`). When the app opens a Forge modal,
Escape must close only the modal (DSP-3552).

Confluence closes that `Popup` with its own hook, `useInlineDialogCloseManager`
(`confluence/next/packages/forge-ui/src/hooks/useInlineDialogCloseManager.tsx`). It adds a `window`
`keydown` listener that closes the popup on every Escape, and it ignores `defaultPrevented`. Its
other users are `ByLineForgeApp` and `ReadingAidsPopup`. `ForgeAction` passes no `onClose` to
`Popup`.

So forge-ui keeps a workaround: on Escape in a Confluence Custom UI modal, `dismissEscape` in
`platform/packages/forge/forge-ui/src/renderer/forge-ui-renderer/CustomUIRenderer.tsx` calls
`stopPropagation()` (to stop the close manager) and, on the top-layer path, `preventDefault()` (to
stop the browser's close request).

## The fix

On the top-layer path (`platform-dst-top-layer`), in `ForgeAction`, `ByLineForgeApp` and
`ReadingAidsPopup`:

1. Pass `onClose` to `Popup`.
2. Skip `useInlineDialogCloseManager`. Native light dismiss covers Escape and outside clicks.
3. Keep the Forge modal a DOM child of the `Popup` (no portal, no `dialogs.showDialog`). Otherwise
   `showModal()` hides the popup.

Then the browser gives "only the top layer closes": the first Escape closes the modal, the next one
closes the popup. A Playwright repro of this passed in Chromium, Firefox and WebKit.

## After the fix

Remove the top-layer branch of forge-ui's `dismissEscape`, and map `closeOnEscape` to
`shouldCloseOnEscapePress`. Keep the legacy-path `stopPropagation()` until the flag is removed:
legacy layers ignore `defaultPrevented`.
