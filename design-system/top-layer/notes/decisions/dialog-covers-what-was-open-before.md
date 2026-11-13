# A Dialog covers what was open before it

## Status

**Decided (2026-11-12).** Applies to `DialogAwarePortal` (`@atlaskit/top-layer/dialog-aware-portal`)
and the top-layer `FlagGroup`, which wraps each flag host in it (#540706).

## Decision

`DialogAwarePortal` does not move its children into a `Dialog` that opens after they mount. The new
`Dialog` covers them, and they are inert until it closes. The browser does the same with a manual
popover that is open when a modal opens.

The portal picks its place once, when it mounts: inside the topmost open `Dialog`, else in place. It
picks again only when that `Dialog` closes. It keeps no list of open dialogs. See
[`architecture/dialog.md`](../architecture/dialog.md) ("Dialog aware portal").

## Why

- **Every move makes screen readers read the flag again.** VoiceOver read a `role="alert"` flag
  again after each way of moving it (2026-11-12): a remount (what a portal target change does),
  `append()`, and `moveBefore()`. The alert is assertive, so on each modal open it would interrupt
  the reading of the new modal.
- **We keep the flag's role.** A flag that drops `role="alert"` after it shows, so that a move is
  not read, changes its semantics. That is confusing for assistive technology users.
- **A remount resets state.** The enter animation plays again, an `AutoDismissFlag` timer starts
  again, and an expanded bold flag collapses.
- **A move can lose focus.** When a flag's own action opens the modal, the browser returns focus to
  that action on close. If the flag moved into the modal, the action is inside the closing dialog,
  and focus goes to `<body>` (Chromium, every way of moving).
- **Keyboard users lose nothing.** The legacy `ModalDialog` focus lock keeps keyboard focus out of a
  flag outside it by default (`allowlistElements` in `modal-wrapper.tsx`).

## Costs we accept

- A pointer user cannot use a flag that showed before a modal until the modal closes. Legacy flags
  (z-index 600) painted above the modal blanket (510).
- A modal that blocks its close keeps that flag unusable until it closes.
- When its `Dialog` closes, the portal must move its children: a closed `Dialog` unmounts its
  `<dialog>`, and children left in it would leave the page. The move remounts them, so a screen
  reader reads a flag in them again, once for each close.

A flag that shows in the commit that closes its `Dialog` (for example, a submit handler that shows a
flag and closes the modal) is not in this cost. The first render still sees the `Dialog` open, so
the flag mounts in it. The portal's layout effect sees the close and picks again in the same task,
before paint. Without this, the flag stays in the closing `Dialog` until the `close` task. Chromium
and WebKit ran that task before the next frame, but Firefox ran a frame first (2026-11-12).

## Rejected options

- **Move into a `Dialog` that opens later**, with a remount, `append()` or `moveBefore()`. Each
  makes VoiceOver read the flag again. `append()` also closes the flag's popover and stops its
  animation. `moveBefore()` keeps both, and keeps focus if the flag moves out on the dialog's
  `beforetoggle`, but the flag is still read again.
- **Remount a moved flag without `role="alert"`.** It changes the semantics of the item.
- **Keep a stack of open dialogs.** Not needed: the portal reads the DOM and the open order tracker.

## Revisit when

- A screen reader does not read an alert again after `moveBefore()`. Then a move on open costs only
  code.
