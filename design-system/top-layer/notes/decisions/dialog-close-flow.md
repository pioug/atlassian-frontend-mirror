# Dialog close flow

How closing works for `@atlaskit/top-layer` Dialog: who triggers it, who actually closes the
`<dialog>`, and how consumers can keep the dialog open (e.g. modal-dialog with
`shouldCloseOnEscapePress` / `shouldCloseOnOverlayClick`).

---

## Summary

The dialog **does not close itself**. The browser does not close it on Escape (we call
`preventDefault()`), and there is no native "close on backdrop click" for `<dialog>`. The dialog
closes when the **consumer sets `isOpen={false}`**, which causes `Dialog` to call `dialog.close()`
internally. The `Dialog` element stays mounted in the DOM — it is never unmounted to close the
dialog. Children unmount after the exit animation completes (or immediately for non-animated
closes).

Top-layer **always** calls `onClose({ reason })` when Escape or backdrop click happens. The consumer
decides whether to set `isOpen={false}` in response. So "closing" is: **trigger → top-layer calls
`onClose` → consumer sets `isOpen={false}` → `Dialog` calls `dialog.close()` → exit animation plays
(if animated) → `onExitFinish` fires → children unmount → dialog element stays in DOM but hidden**.
If the consumer does not update `isOpen` (e.g. it ignores that reason), the dialog stays open.

When `isOpen` transitions back to `true`, `showModal()` is called again and the entry animation
plays.

---

## Escape key

1. User presses Escape → the native **`cancel`** event fires on the `<dialog>`.
2. We call **`event.preventDefault()`** so the browser does **not** close the dialog. The element
   stays open.
3. We call **`onClose({ reason: 'escape' })`** so the consumer can react.
4. If the consumer wants to close, it sets **`isOpen={false}`**.
5. `Dialog` detects the `isOpen` change and calls **`dialog.close()`**. The exit animation plays (if
   animated), then `onExitFinish` fires, children unmount, and the dialog element stays in the DOM
   but hidden.

If the consumer **does not** set `isOpen={false}` (e.g. it ignores `reason === 'escape'` when its
own `shouldCloseOnEscapePress` is false), the dialog stays open. Top-layer has no close flags;
gating is done in the consumer’s `onClose` handler.

---

## Backdrop (overlay) click

1. User clicks the backdrop (click target is the `<dialog>` element itself, not a child).
2. There is **no** native close-on-backdrop for `<dialog>`; we detect this in our `onClick` handler.
3. We call **`onClose({ reason: 'overlay-click' })`** so the consumer can react.
4. Same as Escape: the dialog only closes when the consumer sets `isOpen={false}`, which causes
   `Dialog` to call `dialog.close()`.

If the consumer does not set `isOpen={false}` (e.g. it ignores overlay-click when
`shouldCloseOnOverlayClick` is false), the dialog stays open.

---

## Programmatic close

Close button or other explicit close calls **`onClose({ reason: 'programmatic' })`**. Again, the
dialog closes only when the consumer sets `isOpen={false}` in response.

---

## Consumer gating (e.g. modal-dialog)

Top-layer Dialog does **not** accept `shouldCloseOnEscapePress` or `shouldCloseOnOverlayClick`. It
always calls `onClose({ reason })` for escape and overlay click.

Consumers that need to gate closing (e.g. `@atlaskit/modal-dialog`) do so in their **`onClose`**
handler: they receive the reason and only set `isOpen={false}` when the reason is allowed. For
example, modal-dialog only forwards to `onCloseHandler()` when
`(reason === 'escape' && shouldCloseOnEscapePress) || (reason === 'overlay-click' && shouldCloseOnOverlayClick) || reason === 'programmatic'`.
When it does not forward, `isOpen` remains `true`, so the dialog stays open.

---

## Order of operations: onClose before close

`onClose` is always invoked **before** the dialog closes. We never call `dialog.close()` from the
event handlers; we only call `onClose`. The dialog closes later when `isOpen` becomes `false`. So
the order is:

1. **Trigger** (escape / backdrop click / programmatic) → `onClose({ reason })` runs
2. **Consumer updates state** → sets `isOpen={false}` (or ignores, keeping the dialog open)
3. **`Dialog` reacts to `isOpen={false}`** → calls `dialog.close()`
4. **Exit animation plays** (if `animate` is provided) → `transitionend` fires (with fallback
   timeout)
5. **`onExitFinish` fires** → consumer can coordinate external lifecycle (e.g. `onCloseComplete`)
6. **Children unmount** — the `<dialog>` element stays in the DOM

When `isOpen` transitions back to `true`, children re-mount, `showModal()` is called, and the entry
animation plays. The consumer never unmounts the `Dialog` element itself to close the dialog.
