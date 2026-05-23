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
