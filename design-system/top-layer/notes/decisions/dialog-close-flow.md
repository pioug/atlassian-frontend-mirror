# Dialog close flow

How closing works for `@atlaskit/top-layer` Dialog: who triggers it, who closes the `<dialog>`, and
how consumers limit which user actions can dismiss it (e.g. modal-dialog with
`shouldCloseOnEscapePress` / `shouldCloseOnOverlayClick`).

---

## Summary

This document covers Dialog-specific close triggers and dismissal control. The shared terminology,
state machine, native event ordering, and host mounting behavior are defined by the
[canonical visibility lifecycle contract](../architecture/animations.md#canonical-visibility-lifecycle-contract).

User dismissal **asks first, closes second.** An allowed Escape or backdrop click calls
`onClose({ reason })` while the native `<dialog>` is still open. The dialog closes only when the
consumer sets `isOpen={false}`. A consumer that keeps `isOpen` `true` refuses the dismissal: the
dialog stays open, focus does not move, and no `toggle` or `close` event fires.

**Rule: every Dialog can refuse.** If `onClose` does not set `isOpen={false}`, the dialog stays
open, however many times the user presses Escape or clicks the backdrop, in every browser.

**The browser never closes the dialog for a user action.** The `<dialog>` always has
`closedby="none"`. `Dialog` handles the two user actions itself, and asks:

- Escape: `Dialog` handles the `keydown` (`use-escape-keydown.tsx`). For an Escape meant for this
  dialog it calls `preventDefault()` and asks. See [Escape key](#escape-key).
- Backdrop click: `Dialog` handles the `click` (`use-backdrop-click.tsx`). See
  [Backdrop (overlay) click](#backdrop-overlay-click).
- Other close requests (for example the Android back button) go past the dialog. `Dialog` does not
  ask, and the dialog does not close. On Android, back navigates as if the dialog was not there. See
  [Other close requests](#other-close-requests).
- Browsers without `closedby` (Safari 27 and earlier) use a small fallback that refuses each
  `cancel` (`use-cancel-fallback.tsx`). See
  [Fallback: browsers without `closedby`](#fallback-browsers-without-closedby).
- `Popover` stays notify-after, because popover light dismiss cannot be canceled.

With no close request for the dialog, the browser's close-watcher rule (a `cancel` that is not
cancelable, which forces a close) never applies to it. See
[Why `closedby="none"`](#why-closedbynone).

`onClose` runs inside `flushSync` when `Dialog` asks, so the consumer's answer commits before the
event handler returns. A `false` then `true` in one batch never closes the native dialog. React
batches both updates into one render, so `isOpen` never commits as `false`.

Which user actions may dismiss the dialog is decided **before** the event, through the `dismissedBy`
prop:

| `dismissedBy`                          | Escape  | Backdrop click |
| -------------------------------------- | ------- | -------------- |
| `'escape-and-outside-click'` (default) | asks    | asks           |
| `'escape'`                             | asks    | ignored        |
| `'none'`                               | ignored | ignored        |

A consumer-initiated close is not a reason the primitive produces. The consumer sets
`isOpen={false}`, and `Dialog` calls `dialog.close()` without calling `onClose`.

Consumers should not call `dialog.requestClose()` or `dialog.close()` through the ref, or submit a
`<form method="dialog">`. They set `isOpen={false}`. `requestClose()` turns on the dialog's close
watcher for that call, so it fires a `cancel` that is always cancelable. `Dialog` does not handle it
in the standard path, so the dialog closes. In the fallback, `Dialog` refuses it.

### A close that `Dialog` did not ask about

Decision: closing the native dialog directly is not supported. `Dialog` has one cheap guard: if the
native dialog closes while `isOpen` is still `true`, it calls `showModal()` again in the closed
`toggle` listener, before the exit starts. `onClose` does not run, and there is no exit and no
`onExitFinish`. `isOpen` stays the source of truth.

Why a guard and not support:

- Consumers cannot reach the `<dialog>` easily. ModalDialog and Drawer do not expose it, so a direct
  `close()` means someone went looking for it.
- Support cost real code in each wrapper (a closed `toggle` listener, a "forced closed" state, an
  `onClose` with a made-up Escape event) for a case that should not happen.
- Without a guard, the `<dialog>` unmounts while `isOpen` is `true`. ModalDialog keeps its scroll
  lock, and nothing on screen explains why.

Limits:

- The reopen is a new `showModal()`. Focus goes to the initial focus target, and the dialog moves to
  the top of the top layer. Exit styles can show for one frame before the `toggle` task runs.
- No reopen inside a closed layer (a closed `<dialog>` or `[popover]` that contains the dialog). An
  open modal there is not visible, but it still makes the rest of the page inert. The dialog stays
  closed until `isOpen` changes. ModalDialog then ends its `ModalTransition` exit at once when the
  consumer closes it.

---

## Escape key

`Dialog` has one internal hook for this, `use-escape-keydown.tsx`. It listens for `keydown` on
`window` while the `<dialog>` is mounted.

1. The user presses Escape. Inner handlers run first (bubble phase). If one called
   `preventDefault()`, `Dialog` does nothing. This is a decision: the inner handler took the Escape,
   so one press undoes one thing, as with native `<dialog>`. Legacy ModalDialog and Drawer ignore
   `defaultPrevented` and close anyway. We keep legacy as it is; the difference goes away when the
   flag rolls out.
2. `Dialog` checks that the Escape is meant for this open dialog:
   - Focus is in this dialog: on `event.composedPath()`, the first `<dialog>` or open `auto` or
     `hint` popover is this dialog. A nested dialog takes its own Escape. With focus in an open
     `auto` or `hint` popover, `Dialog` does not take the Escape: the popover light-dismisses. A
     `manual` popover does not take Escape, so `Dialog` takes it, as a native modal `<dialog>`
     would. ADS manual popovers that close on Escape (`useSimpleLightDismiss`) call
     `preventDefault()` first, so `Dialog` does not take that Escape.
   - Focus is on `<body>` (the focused element was removed, or `blur()`), and focus was last in this
     dialog. Only the top modal can hold focus, so that dialog is the top modal. Each `Dialog`
     records this on `focusin`, because removing the focused element fires no event in Firefox and
     WebKit. This matches legacy ModalDialog and Drawer: one ask per key press, no forced close. See
     [`../follow-ups/dialog-escape-with-focus-on-body.md`](../follow-ups/dialog-escape-with-focus-on-body.md).
     A click on content that cannot take focus moves focus to the `<dialog>`, not to `<body>`.
   - An open child `auto` or `hint` popover takes the Escape first, also with focus outside it (for
     example on its trigger). If `Dialog` canceled the `keydown`, the browser would not close the
     popover. `Dialog` checks in the capture phase, before the popover closes.
   - An IME composition is skipped. During the exit (the native dialog is closed) `Dialog` does
     nothing.
3. `Dialog` calls **`event.preventDefault()`**. This stops the browser's close request. With
   `closedby="none"`, the request would skip this dialog and go to the next close watcher in its
   group (for example a parent `auto` popover, which would close). In browsers without `closedby`,
   it would fire `cancel`.
4. A held key repeats `keydown`. `Dialog` cancels each one but asks once per key press.
5. If `dismissedBy` allows Escape, `Dialog` calls **`onClose({ reason: 'escape' })`** in
   `flushSync`.
6. The consumer sets **`isOpen={false}`**. `Dialog` calls `dialog.close()`, the exit animation plays
   (if animated), then `onExitFinish` fires and the `<dialog>` unmounts. If the consumer keeps
   `isOpen` `true`, nothing else happens.

That is the only `preventDefault()` that `Dialog` calls on the Escape `keydown`. If an inner handler
calls `stopPropagation()`, `Dialog` does not see the Escape, and does not ask. The browser makes a
close request, which goes past the dialog.

## Other close requests

A close request with no Escape `keydown` that `Dialog` takes goes past the dialog. Examples: the
Android back button, an Escape that an inner handler stopped with `stopPropagation()`, and an Escape
with focus on `<body>` after it was last outside the dialog. The dialog's close watcher is turned
off (`closedby="none"`), so the browser fires no `cancel` and does not close it. `Dialog` does not
ask.

On Android, back then does what it does with no dialog: a history traversal. Three things to know:

- **Another layer can take it.** A close request goes to the last close watcher group. If an `auto`
  popover is in that group (for example a parent popover that opened with no user input in between,
  as in Forge), it closes. The dialog inside it then unmounts with the popover.
- **Same-document navigation can leave the modal open.** If the route change does not unmount the
  dialog, the URL changes behind an open modal.
- **No earlier history entry.** Back leaves the page.

We accept this. Asking on back (or keeping a guard such as "unsaved changes" across it) would need
the History or Navigation API, and the browser applies the same user-activation rule there.

Sources:

- HTML spec:
  [close requests and close watchers](https://html.spec.whatwg.org/multipage/interaction.html#close-requests-and-close-watchers).
  "Process close watchers" skips a watcher whose "get enabled state" is `false`, and "request to
  close a close watcher" returns before `cancel` for it. The dialog's "get enabled state" is `false`
  when its computed closed-by state is None (unless `requestClose()` runs).
- [`../follow-ups/dialog-closedby.md`](../follow-ups/dialog-closedby.md) for browser support.

## Fallback: browsers without `closedby`

`closedby` ships in Chrome 134+ and Firefox 141+. Safari 27.0 does not ship it (no `closedBy` IDL
property and no `CloseWatcher`, checked in real Safari 27.0 on 2026-10-19). A browser without
`closedby` ignores the attribute. A close request that `Dialog` did not take then fires `cancel` on
the dialog, and the browser closes it unless the `cancel` is canceled. Examples:

- Safari sends `cancel` to the dialog for an Escape that an open child `auto` popover took (see
  [`safari-escape-nested-popover-in-dialog.md`](./safari-escape-nested-popover-in-dialog.md)).
- An Escape that an inner handler stopped with `stopPropagation()`.

`useCancelFallback` binds a `cancel` listener only when `'closedBy' in HTMLDialogElement.prototype`
is `false`. It calls `preventDefault()` and does not ask, as `closedby="none"` would. The check runs
in an effect, so it never changes the server markup. It is a feature check, not a Safari check, so
Safari moves to the standard path when it ships `closedby`.

Safari 27.0 has no close-watcher rule: in real Safari 27.0, 10 back-to-back Escapes on a refusing
raw modal `<dialog>` gave 10 cancelable `cancel` events, and the dialog stayed open (2026-10-19).
WebKit ships `closedby` and the rule behind one flag (`CloseWatcherEnabled`), so a browser without
`closedby` should never send a `cancel` that is not cancelable. If one does, the browser closes the
dialog and it runs the normal close path: the exit, then `onExitFinish` while `isOpen` is `true`. It
stays closed until `isOpen` changes.

Chrome 126 to 133 has the rule but not `closedby`. These versions are outside the browser policy
(the last 5 Chrome versions).

## Why `closedby="none"`

Before this, `Dialog` used the default (`closerequest` for a modal). It took the Escape `keydown`,
and asked through `cancel` for other close requests. The HTML close-watcher rule then forced a close
for a second close request with no user input in between (Chrome 126+, Firefox 149+), for example
Android back. `Dialog` undid each forced close by showing the dialog again in the same task. That
worked, but it moved the dialog to the top of the top layer, churned focus, fired native `close`
events, and needed a check of the parent layers in the next frame. See
[`../follow-ups/dialog-forced-close-fallback.md`](../follow-ups/dialog-forced-close-fallback.md)
(superseded).

With `closedby="none"`:

- No close request reaches the dialog, so there is never a forced close. All the reopen code is
  gone.
- The two user actions that `Dialog` supports (Escape and backdrop clicks) are its own listeners, in
  every browser.
- The cost: other close requests (Android back) go past the dialog without asking.

## Why Dialog owns Escape

We first let the browser own Escape: `Dialog` asked only through `cancel`. In Chrome a refusing
dialog then closed on the second Escape (forced). Firefox 149+ does the same. ModalDialog and Drawer
needed "refuse forever" for legacy parity, so they had their own `keydown` helper. We decided that
blocking a close is a `Dialog` feature:

- The same behaviour in every browser.
- One place for the Escape rules, not a copy in each wrapper.
- A guard ("unsaved changes") cannot be passed by a fast double Escape.

It is not a keyboard trap. The user can still Tab to the dialog's controls (for example a close
button). See `../goals/accessibility-criteria.md`.

---

## Backdrop (overlay) click

1. The user clicks the backdrop. Browsers retarget events on `::backdrop` to the `<dialog>` element,
   so the event target is the dialog itself, not a child.
2. A modal `<dialog>` does not close on a backdrop click unless it has `closedby="any"`. `Dialog`
   sets `closedby="none"` (see [Why not native light dismiss](#why-not-native-light-dismiss)), and
   listens for `click` (`use-backdrop-click.tsx`). As native light dismiss, the press and the
   release must both be on the backdrop: the `pointerdown` and the `pointerup` targets are the
   dialog. Otherwise the click is ignored:
   - A drag from the content to the backdrop: `click` fires on the nearest common ancestor, the
     dialog, but the press was in the content.
   - A drag from the backdrop to the content: the release was in the content.
   - A click with no press, such as a synthetic `click()`. A keyboard cannot click the backdrop;
     Escape is the keyboard path.

   - A press with a button other than the primary one (e.g. a right-click), or a `pointercancel`.

   `pointerdown` (not `mousedown`) covers mouse, touch and pen. Each press is used once: the `click`
   clears it. To simulate a backdrop click in tests, fire `pointerDown` and `pointerUp` on the
   dialog before `click`, or use `userEvent`.

3. If `dismissedBy` allows backdrop clicks and the dialog is open, it calls
   **`onClose({ reason: 'overlay-click' })`** in `flushSync`. Otherwise the click is ignored. The
   `open` check skips clicks during the exit, so one dismissal calls `onClose` once.
4. The consumer sets **`isOpen={false}`**, as for Escape.

### Why not native light dismiss

Native light dismiss for a modal `<dialog>` is `closedby="any"`. We do not use it:

- **Safari does not ship it.** It fails the browser policy, so `Dialog` needs the JavaScript path
  anyway.
- **It loses the reason.** A native backdrop dismissal fires `cancel`, as an Escape does. `Dialog`
  could not report `reason: 'overlay-click'`.
- **It needs `cancel`.** `Dialog` would have to refuse the `cancel` to ask first, and a refused
  light dismiss uses up the user activation. With `closedby="none"` the browser sends no `cancel`.

Our listener copies the one useful native rule: the press and the release must both be on the
backdrop. See [`../follow-ups/dialog-closedby.md`](../follow-ups/dialog-closedby.md).

---

## ModalDialog and Drawer

Legacy ModalDialog and Drawer have parity tests (`modal-dialog-close-parity.test.tsx`,
`drawer-close-parity.test.tsx`) on both flag states. `Dialog` now gives them "refuse forever", the
Escape owner rules and the backdrop press rule. The wrappers add no Escape or backdrop listeners of
their own.

ModalDialog maps `shouldCloseOnOverlayClick` and `shouldCloseOnEscapePress` to `dismissedBy`
(`shouldCloseOnOverlayClick` alone is `'escape-and-outside-click'`, and ModalDialog ignores
`onClose` calls with `reason: 'escape'`: `Dialog` still cancels the Escape `keydown`). Drawer uses
the default, `'escape-and-outside-click'`.

Known differences from legacy:

- A drag from the backdrop to the content does not close ModalDialog, also during the exit. Legacy
  ModalDialog closes for it: its content is inside the Blanket, so the `click` lands on the Blanket.
  Legacy Drawer does not close for it (its Blanket is a sibling of the panel), so Drawer matches.
- **Escape and backdrop clicks during the exit do not call `onClose` again.** Legacy calls `onClose`
  again for an Escape or a backdrop click while the exit animation plays. The top-layer path does
  not. See [No second `onClose` during the exit](#no-second-onclose-during-the-exit).

The Android back button does not reach the wrappers: it goes past the dialog (see
[Other close requests](#other-close-requests)).

A close that `Dialog` did not ask about (a `<form method="dialog">` submit, `dialog.close()` through
a ref, or `requestClose()`) needs no wrapper code: `Dialog` shows the dialog again. See
[A close that `Dialog` did not ask about](#a-close-that-dialog-did-not-ask-about).

### No second `onClose` during the exit

Decision: during the exit, ModalDialog and Drawer do not call `onClose` for an Escape or a backdrop
click. Legacy did. We removed the exit-only listeners (`useExitDismiss`) that copied it.

Why:

- During the exit, the modal or drawer is already closing: the consumer closed it after `onClose`. A
  second `onClose` asks to close something that is already closing. The consumer can do nothing with
  it.
- It is noise: a second analytics event for one dismissal, and consumer `onClose` code runs twice.
- `Dialog` already skips Escape and backdrop clicks while it is closed. The wrappers now follow the
  same rule as every other `Dialog` consumer.

Effects:

- Nested layers: during a nested modal or drawer exit, focus is back on its trigger in the parent.
  An Escape then asks the parent to close. Legacy kept that Escape for the exiting nested layer. A
  second Escape now closes the next layer, as it does for any stack of layers.

---

## Order of operations

1. **Trigger:** an allowed Escape or backdrop click. The native dialog stays open.
2. **Ask:** `onClose({ reason })` runs in `flushSync`.
3. **The consumer updates state:** it sets `isOpen={false}`, and `Dialog` calls `dialog.close()`.
4. **Exit:** if animation is enabled, the captured host animations settle.
5. **`onExitFinish` fires:** the consumer can coordinate external lifecycle (e.g.
   `onCloseComplete`).
6. **Children unmount, then the `<dialog>` host element unmounts.** See
   `host-element-unmount-when-hidden.md`. Non-animated closes defer the host unmount through the
   `toggle`/`close` event, so native focus restoration runs against the still-attached element.

For a close that `Dialog` did not ask about, `Dialog` shows the dialog again, and none of these
steps run. Inside a closed layer, it runs steps 4 to 6 while `isOpen` stays `true`.

When `isOpen` becomes `true` again, a fresh `<dialog>` mounts, `showModal()` is called, and the
entry animation plays. The consumer never unmounts the `Dialog` React component to close the dialog;
the primitive owns the lifecycle of the `<dialog>` DOM node.
