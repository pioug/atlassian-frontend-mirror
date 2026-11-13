# Dialog (modal) vs Dialog (non-modal)

Quick reference for the differences between modal and non-modal `<dialog>` elements.

## Comparison

|                               | `<dialog>` non-modal (`.show()`)                                            | `<dialog>` modal (`.showModal()`) |
| ----------------------------- | --------------------------------------------------------------------------- | --------------------------------- |
| Top layer                     | No (per [WHATWG issue #11105](https://github.com/whatwg/html/issues/11105)) | Yes                               |
| `::backdrop` pseudo-element   | No                                                                          | Yes                               |
| Background inert              | No                                                                          | Yes                               |
| Focus trap                    | No                                                                          | Yes                               |
| Close on Esc / close request  | No (default)                                                                | Yes (default)                     |
| Light dismiss (click outside) | Yes, when `closedby="any"`                                                  | Yes, when `closedby="any"`        |
| Multiple open at once         | Yes                                                                         | Yes (stacked)                     |
| Implicit ARIA role            | `dialog`                                                                    | `dialog`                          |
| Open API                      | `.show()` / `open` attribute                                                | `.showModal()`                    |

## Modal dialog (`.showModal()`)

Modal dialogs:

- Are promoted to the **top layer**, painting above all other content including fixed/sticky
  elements.
- Add a `::backdrop` pseudo-element behind the dialog but above the rest of the page.
- Make the rest of the document **inert** — keyboard focus, pointer events, and assistive technology
  are all blocked outside the dialog. The dialog itself and its flat-tree descendants are exempt.
- **Trap focus** inside the dialog via the dialog focusing steps.
- Respond to **close requests** (e.g. Esc key) by default — `closedby` defaults to the
  `Close Request` state for modal dialogs.

Use modal dialogs when the user must respond before continuing (e.g. confirmation prompts,
destructive action warnings, blocking forms).

See
[§4.11.4 The dialog element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element)
and
[§6.3.1 Modal dialogs and inert subtrees](https://html.spec.whatwg.org/multipage/interaction.html#modal-dialogs-and-inert-subtrees).

## Non-modal dialog (`.show()`)

Non-modal dialogs:

- Are **not** promoted to the top layer — they render in normal stacking order.
- Have **no backdrop** and do not make the background inert.
- Do **not** trap focus — the user can tab freely around the rest of the page.
- Do **not** respond to close requests by default — `closedby` defaults to `None` for non-modal
  dialogs.

Use non-modal dialogs when the user needs to reference or interact with the rest of the page while
the dialog is open (e.g. a find-and-replace panel, a floating inspector).

> **Note:** Spec editors recommend using `<dialog popover="auto">` or `<dialog popover="manual">`
> over `.show()` for non-modal dialogs. This gives top-layer promotion and light dismiss behaviour
> alongside the `dialog` role and semantics. See the
> [popover attribute spec](https://html.spec.whatwg.org/multipage/popover.html#the-popover-attribute).

## The `closedby` attribute

Added to the living standard, `closedby` controls what user actions automatically close the dialog:

| Value               | State         | Effect                                                         |
| ------------------- | ------------- | -------------------------------------------------------------- |
| `any`               | Any           | Close requests (Esc) **and** clicking outside close the dialog |
| `closerequest`      | Close Request | Only close requests (Esc) close the dialog                     |
| `none`              | None          | No user action automatically closes the dialog                 |
| _(missing/invalid)_ | Auto          | `Close Request` for modal, `None` for non-modal                |

"Light dismiss" (clicking outside the dialog) is only active when `closedby="any"`. For modal
dialogs, a click on the `::backdrop` is what triggers this.

`@atlaskit/top-layer` `Dialog` sets `closedby="none"`. It handles Escape and backdrop clicks with
its own listeners. See
[Why not native light dismiss](../decisions/dialog-close-flow.md#why-not-native-light-dismiss).

## `requestClose()` vs `close()`

- `.close(returnValue?)` — closes the dialog immediately and synchronously.
- `.requestClose(returnValue?)` — fires the close watcher (respects `closedby`; fires a `cancel`
  event that can be prevented). Use this when you want to give the page a chance to intercept the
  close (e.g. "unsaved changes" guard).

## Focus management

The dialog focusing steps run when a dialog is shown:

1. If a descendant has `autofocus`, focus it.
2. Otherwise focus the first focusable descendant.
3. Otherwise focus the `<dialog>` element itself.

Always use `autofocus` on the element the user is expected to interact with first. This makes intent
explicit and keeps behaviour stable as the dialog's DOM changes over time.

## Nested layers

A `Dialog` or `Popover` inside another layer that shows in the same commit shows after that layer,
so it is on top. See [layer-show-order.md](./layer-show-order.md).

## The topmost dialog

These apply to `@atlaskit/top-layer` `Dialog` (and so to top-layer `ModalDialog` and `Drawer`).

### Only the topmost modal dialog is live

While modal dialogs are open, the topmost one blocks the document. Everything outside it is inert,
**popovers too**, even a popover that opened after the dialog and paints above it. A layer that must
stay usable while a dialog is open must be inside the topmost dialog. The jsdom polyfill models the
same rule.

### Dialog aware portal (`@atlaskit/top-layer/dialog-aware-portal`)

`DialogAwarePortal` picks its place once, in its first render: inside the topmost open `Dialog`,
else in place. So its children are in the document in the first commit, and the mount effects of
their parents can reach them. It keeps no list of open dialogs. It reads the DOM:

- Candidates: open `<dialog>` elements with `data-top-layer-open-requested`, which `Dialog` sets
  while `isOpen` is `true`. A `Dialog` that is closing, hidden by Suspense, or waiting to show is
  not open, so it is not a candidate. A `<dialog>` that something else opens is not a candidate
  either.
- Order: the browser does not give the top-layer order, so the open order tracker (Escape ownership)
  gives it. On a tie, the later one in DOM order wins.

Then:

- It does not move into a `Dialog` that opens later, or in the same commit. Its children are inert
  until that dialog closes. The rule: a `Dialog` covers what was open before it, as the browser does
  with a manual popover. A portal inside the React tree of that `Dialog` is inside it in place.
- Why no move on open: every move makes screen readers read a `role="alert"` again, and it
  interrupts the reading of the new dialog. VoiceOver read it again after a remount, `append()` and
  `moveBefore()` (2026-11-12). We do not change the role of the children to stop it. See
  [`decisions/dialog-covers-what-was-open-before.md`](../decisions/dialog-covers-what-was-open-before.md).
- If its dialog closes or unmounts in the commit that mounts the portal, the render still sees that
  dialog open. Its layout effect then sees the dialog closed (or no longer requested), and picks
  again before paint. So a flag that a submit handler shows as it closes the modal does not show in
  the closing modal and then move.
- When its dialog closes (the `close` event), it picks again. It skips that dialog and the dialogs
  inside it, which include the dialogs that its own children render. A move remounts the children,
  and a screen reader reads a `role="alert"` in them again. If `Dialog` shows the dialog again after
  a close that it did not ask for, the portal stays.
- A move does not take focus. The browser returns focus in `close()`, before the `close` event.
- Nothing renders on the server, or while the client hydrates. It picks after hydration, so a
  `Dialog` that shows in the hydration commit counts.

The top-layer `FlagGroup` wraps each flag's host in it (decision 2, 2026-10-29; pick once,
2026-11-12). See `migrations/flag-migration.md`.

## Server-side rendering

For details on how `<dialog>` is rendered server-side, how `showModal()` is invoked after hydration,
and how this compares with the legacy `@atlaskit/modal-dialog` (pre-top-layer) SSR flow, see
[ssr.md](./ssr.md).

## Spec references

- Dialog element:
  https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element
- Dialog light dismiss:
  https://html.spec.whatwg.org/multipage/interactive-elements.html#dialog-light-dismiss
- Modal dialogs and inert subtrees:
  https://html.spec.whatwg.org/multipage/interaction.html#modal-dialogs-and-inert-subtrees
- Top layer concept: https://html.spec.whatwg.org/multipage/interaction.html#top-layer
- WHATWG issue #11105 (confirms `.show()` is not in the top layer):
  https://github.com/whatwg/html/issues/11105
