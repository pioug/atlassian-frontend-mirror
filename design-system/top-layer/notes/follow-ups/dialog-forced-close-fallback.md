# Follow-up: should Dialog keep a dialog open after a forced browser close?

**Status:** Superseded (2026-10-19). `Dialog` now renders `closedby="none"`, so the browser makes no
close request for it, and never forces a close. The same-task reopen and its code are deleted. See
[`../decisions/dialog-close-flow.md`](../decisions/dialog-close-flow.md#why-closedbynone) and
[`dialog-closedby.md`](./dialog-closedby.md).

## The problem

The HTML close-watcher rule stops pages from trapping users. Without new user input since the last
refused close request, a close request gets a `cancel` with `cancelable: false`, and the browser
closes the dialog. Chrome 126+ and Firefox 149+ apply it. `Dialog` took the Escape `keydown`, so
Escape never reached the rule. Android back, and an Escape that `Dialog` did not take (for example
focus in a raw `manual` popover), still did.

## What we did before

On a `cancel` that is not cancelable, `Dialog` asked (`onClose`). If `isOpen` stayed `true`, it
called `dialog.close()` and `dialog.showModal()` in the same task. `close()` destroyed the close
watcher that the browser was about to close, so the browser skipped its close. Then `Dialog`:

- showed each `Dialog` that was above it again, in order (a module-level open-dialog stack);
- restored focus and the scroll positions;
- skipped the lifecycle for the reopen (a `reopening` flag, and a replayed `beforetoggle` if it
  failed);
- checked in the next frame that every layer that contains the dialog was still open (the Forge
  case: a dialog inside an `auto` popover), and closed the dialog if not.

It worked in Chromium 143 and Firefox 153 (no frame painted the dialog closed). The costs:

- Each reopen moved the dialog to the top of the top layer, so it covered an open `manual` popover
  inside it.
- Focus churn: `focus` and `blur` handlers ran on each reopen.
- One native `close` event per reopen, for a close that did not happen.
- It defeated the close-watcher rule: on Android, back never left a refusing dialog.
- Dialogs from another copy of the package, and raw `<dialog>` elements, were not shown again.

## Why it is superseded

With `closedby="none"`, no close request reaches the dialog, so there is nothing to undo. Escape and
backdrop clicks are `Dialog`'s own listeners. Android back goes past the dialog (it navigates). We
accept that: it is what the close-watcher rule intends, and it removes all of the costs above.
