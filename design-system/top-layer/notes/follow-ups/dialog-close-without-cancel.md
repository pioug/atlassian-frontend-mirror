# Follow-up: Dialog does not call `onClose` when it closes without asking

**Status:** Resolved. Closing the native dialog directly is not supported. `Dialog` shows the dialog
again and does not call `onClose`. ModalDialog and Drawer have no code for it. See
[`../decisions/dialog-close-flow.md`](../decisions/dialog-close-flow.md#a-close-that-dialog-did-not-ask-about).

The sections below are history.

## Context

`Dialog` asks first. It calls `onClose` from its Escape `keydown` handler or its own backdrop click
handler, and it closes only when `isOpen` becomes `false`. The `<dialog>` has `closedby="none"`, so
the browser does not close it for a user action. See
[`../decisions/dialog-close-flow.md`](../decisions/dialog-close-flow.md).

## The problem

Some native closes give `Dialog` no close reason:

- a `<form method="dialog">` submit inside the dialog
- a direct `dialog.close()` call (for example by third-party code)
- a `dialog.requestClose()` call: it fires a cancelable `cancel`, which `Dialog` does not handle in
  the standard path (in the fallback for browsers without `closedby`, `Dialog` refuses it)
- in the fallback only, a `cancel` that is not cancelable (not expected: see
  [`../decisions/dialog-close-flow.md`](../decisions/dialog-close-flow.md#fallback-browsers-without-closedby))

`Dialog` does not call `onClose` for these. The native dialog is closed while `isOpen` stays `true`.
This is not new: it was the same before ask-first.

## Options

- Call `onClose` for an unexpected native close (no reason, `isOpen` still `true`), with a new
  reason (for example `'native'`). The dialog then stays closed until `isOpen` changes. Today
  ModalDialog and Drawer already treat `onExitFinish` while open (Drawer: a closed `toggle`) as a
  close they must sync, and call their consumer's `onClose` with an Escape event.
- Document that consumers must not close the native dialog directly.

## To explore

- Which reason name, and is a new `TDialogCloseReason` value a breaking change for consumers that
  switch on the reason?
- Does any ADS component or product use `<form method="dialog">` inside a top layer `Dialog`?
