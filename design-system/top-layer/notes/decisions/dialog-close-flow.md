# Dialog close flow

How closing works for `@atlaskit/top-layer` Dialog: who triggers it, who closes the `<dialog>`, and
how consumers limit which user actions can dismiss it (e.g. modal-dialog with
`shouldCloseOnEscapePress` / `shouldCloseOnOverlayClick`).

---

## Summary

This document covers Dialog-specific close triggers and dismissal control. The shared terminology,
state machine, native event ordering, and host mounting behavior are defined by the
[canonical visibility lifecycle contract](../architecture/animations.md#canonical-visibility-lifecycle-contract).

User dismissal follows Popover behavior: **the dialog closes first, then the consumer is told why.**
An allowed Escape or backdrop click closes the native `<dialog>`, and the closed `toggle` event
calls `onClose({ reason })`. The consumer cannot reject the dismissal from `onClose`; it must set
`isOpen={false}` to keep its controlled state in sync with the native dialog.

Which user actions may dismiss the dialog is decided **before** the event, through the `dismissedBy`
prop:

| `dismissedBy`                          | Escape  | Backdrop click |
| -------------------------------------- | ------- | -------------- |
| `'escape-and-outside-click'` (default) | closes  | closes         |
| `'escape'`                             | closes  | ignored        |
| `'none'`                               | ignored | ignored        |

A consumer-initiated close is not a reason the primitive produces. The consumer sets
`isOpen={false}`, and `Dialog` calls `dialog.close()` without calling `onClose`.

---

## Escape key

1. The user presses Escape and the native **`cancel`** event fires on the `<dialog>`.
2. `handleCancel` ignores a `cancel` that targets a nested dialog, and a spurious Safari `cancel`
   that belongs to an open child popover (see `safari-escape-nested-popover-in-dialog.md`). In the
   Safari case it calls `preventDefault()` so the dialog stays open.
3. If `dismissedBy` is `'none'`, it calls **`event.preventDefault()`**, so the dialog stays open.
4. Otherwise it records the reason `'escape'` and lets the browser close the dialog.
5. The closed **`toggle`** event calls **`onClose({ reason: 'escape' })`**.
6. The consumer sets **`isOpen={false}`**. The exit animation plays (if animated), then
   `onExitFinish` fires and the `<dialog>` unmounts.

---

## Backdrop (overlay) click

1. The user clicks the backdrop. Browsers retarget clicks on `::backdrop` to the `<dialog>` element,
   so the click target is the dialog itself, not a child.
2. There is no native close-on-backdrop for a modal `<dialog>`, so the `click` listener handles it.
   If `dismissedBy` is `'escape-and-outside-click'`, it records the reason `'overlay-click'` and
   calls **`dialog.close()`**. Otherwise the click is ignored.
3. The closed **`toggle`** event calls **`onClose({ reason: 'overlay-click' })`**.
4. The consumer sets **`isOpen={false}`**, as for Escape.

---

## Consumer gating (e.g. modal-dialog)

Consumers gate dismissal by choosing `dismissedBy`, not by ignoring `onClose`. modal-dialog maps its
props in `getDialogDismissedBy` (`modal-wrapper.tsx`):

- both `shouldCloseOnEscapePress` and `shouldCloseOnOverlayClick` → `'escape-and-outside-click'`
- only `shouldCloseOnEscapePress` → `'escape'`
- otherwise → `'none'`

`dismissedBy` has no "outside click without Escape" option, because that is a poor pattern.
modal-dialog shims that one combination with its own backdrop listener until
`shouldCloseOnEscapePress` is removed.

---

## Order of operations

1. **Trigger:** an allowed Escape or backdrop click closes the native dialog.
2. **Native closed `toggle` fires:** `onClose({ reason })` runs.
3. **The consumer updates state:** it sets `isOpen={false}`.
4. **Exit:** if animation is enabled, the captured host animations settle.
5. **`onExitFinish` fires:** the consumer can coordinate external lifecycle (e.g.
   `onCloseComplete`).
6. **Children unmount, then the `<dialog>` host element unmounts.** See
   `host-element-unmount-when-hidden.md`. Non-animated closes defer the host unmount through the
   `toggle`/`close` event, so the close-reason and native focus restoration paths run against the
   still-attached element.

When `isOpen` becomes `true` again, a fresh `<dialog>` mounts, `showModal()` is called, and the
entry animation plays. The consumer never unmounts the `Dialog` React component to close the dialog;
the primitive owns the lifecycle of the `<dialog>` DOM node.
