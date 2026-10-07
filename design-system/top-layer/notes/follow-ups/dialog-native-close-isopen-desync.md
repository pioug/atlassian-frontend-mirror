# Follow-up: Dialog can stay closed while `isOpen` is `true`

**Status:** TODO. Leaning towards reconciliation (below), but more exploration is wanted first.

## Context

`Dialog` is controlled: `isOpen` is meant to be the source of truth. A user dismissal changes the
native state first:

1. An allowed Escape or backdrop click closes the native `<dialog>`.
2. The closed `toggle` event calls `onClose({ reason })`.
3. The consumer is expected to set `isOpen={false}`, and `Dialog` plays its exit.

See [`../decisions/dialog-close-flow.md`](../decisions/dialog-close-flow.md).

## The problem

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

## Options

| Option                       | What it does                                                                                                                                                                                                                       | Covers                                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Reconciliation** (leaning) | After a native close, if `isOpen` is still `true` once React commits, call `showModal()` again. For example, bump a native-close counter in the `toggle` listener and make the open effect depend on `[isOpen, nativeCloseCount]`. | Every case: batching, a reopen inside `onClose`, and an ignored `onClose`                                |
| `flushSync` around `onClose` | The consumer's `setIsOpen(false)` commits before the listener returns, so a later reopen is always a separate render.                                                                                                              | Only a reopen in a later event or task. Not a reopen in the same callback, and not an ignored `onClose`. |
| Both                         | `flushSync` makes the normal path deterministic, and reconciliation catches the rest.                                                                                                                                              | Every case                                                                                               |

## To explore before deciding

- Does `Popover` have the same desync? Light dismiss also closes it natively.
- The trade-off of reconciliation: a consumer that ignores `onClose` would now see the dialog close
  and then reopen, where today it gets a silent desync. Is that the behaviour we want, and does it
  need a changeset note?
- Does the reopen during exit go through the existing reopen-before-exit-settles path cleanly, with
  focus and `onOpenComplete` correct?
- For `flushSync`: does the `toggle` listener ever run inside a React render or effect, for example
  through the jsdom polyfill? `flushSync` warns there.

## Tests to add with the fix

- A test that batches `isOpen` `false` and `true` in one `act()`, and expects `showModal()` and a
  second `onOpenComplete`.
- A test where the consumer ignores `onClose`, and expects the dialog to reopen.
