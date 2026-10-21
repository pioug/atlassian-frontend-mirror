# Follow-up: Dialog can stay closed while `isOpen` is `true`

**Status:** Resolved by the ask-first decision and `closedby="none"`. Escape and backdrop click call
`onClose` in `flushSync` while the native dialog is still open, so it closes only when `isOpen`
becomes `false`. The browser does not close the dialog for other close requests (e.g. Android back).
A close that `Dialog` did not ask about (for example `dialog.close()` through the ref) is not
supported. `Dialog` shows the dialog again (a cheap guard), unless a layer that contains it is
closed. See [`../decisions/dialog-close-flow.md`](../decisions/dialog-close-flow.md).

**Popover is not affected the same way.** It also ends up natively closed with `isOpen` true, but it
unmounts, so nothing is stuck. Its docblock says it stays closed until the prop changes. Tooltip
relies on vetoing a light dismiss and re-showing natively, so reopening there would break it. Leave
Popover alone.

The sections below are history: they describe the old close flow and the options we had then.

## Context (history)

`Dialog` is controlled: `isOpen` is meant to be the source of truth. In the old flow, a user
dismissal changed the native state first:

1. An allowed Escape or backdrop click closes the native `<dialog>`.
2. The closed `toggle` event calls `onClose({ reason })`.
3. The consumer is expected to set `isOpen={false}`, and `Dialog` plays its exit.

See [`../decisions/dialog-close-flow.md`](../decisions/dialog-close-flow.md).

## The problem (history)

If the consumer's `isOpen={false}` and a reopen to `true` land in the same React batch, `Dialog`
only ever renders with `isOpen={true}`. Its open effect does not re-run, so `showModal()` is never
called again. The consumer believes the dialog is open, but it is natively closed and stuck in the
`exiting` phase, until `isOpen` toggles again.

The same desync happens with no batching at all if a consumer ignores `onClose` and leaves
`isOpen={true}`.

A user cannot realistically trigger the batched case. Code can: a reopen in the same callback or
effect that handles the close.

Found while fixing the flaky modal-dialog test "should call onOpenComplete when re-opened before
exit settles". Under parallel jest load, React batched the close and the reopen, and the dialog
never reopened.

## Options (history)

| Option                        | What it does                                                                                                                                                                                                                       | Covers                                                                                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Reconciliation** (rejected) | After a native close, if `isOpen` is still `true` once React commits, call `showModal()` again. For example, bump a native-close counter in the `toggle` listener and make the open effect depend on `[isOpen, nativeCloseCount]`. | Every case: batching, a reopen inside `onClose`, and an ignored `onClose`                                |
| `flushSync` around `onClose`  | The consumer's `setIsOpen(false)` commits before the listener returns, so a later reopen is always a separate render.                                                                                                              | Only a reopen in a later event or task. Not a reopen in the same callback, and not an ignored `onClose`. |
| Both                          | `flushSync` makes the normal path deterministic, and reconciliation catches the rest.                                                                                                                                              | Every case                                                                                               |

## To explore before deciding (history)

- Does `Popover` have the same desync? Light dismiss also closes it natively.
- The trade-off of reconciliation: a consumer that ignores `onClose` would now see the dialog close
  and then reopen, where today it gets a silent desync. Is that the behaviour we want, and does it
  need a changeset note?
- Does the reopen during exit go through the existing reopen-before-exit-settles path cleanly, with
  focus and `onOpenComplete` correct?
- For `flushSync`: does the `toggle` listener ever run inside a React render or effect, for example
  through the jsdom polyfill? `flushSync` warns there.

## Tests

Added in `__tests__/unit/dialog.tsx`:

- `isOpen` `false` and `true` in one `act()`: React renders only the final `true`, so the dialog
  stays open and there is no second `onEnterFinish` (`onOpenComplete` in modal-dialog). The earlier
  proposal here expected a second one; that was wrong.
- An ignored `onClose` on Escape and on backdrop click: the dialog stays open, with focus unchanged.
- In a browser without `closedby`, a non-cancelable `cancel`: `onClose` does not run, the dialog
  closes, and it opens again after `isOpen` goes `false`, then `true`.
