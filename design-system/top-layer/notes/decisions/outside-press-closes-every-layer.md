# Outside Press Closes Every Layer, Escape Closes One

**Status:** Implemented. Probed 2026-10-28.

Light dismiss has two inputs, and they stack differently:

- **A press outside** closes every open layer that the press is outside, on the same press.
- **Escape** closes one layer per press, the topmost first.

This is how the browser behaves. We copy it, so it is not a gap.

## Rules

- **Press:** a pointer press that starts and ends outside a layer (at `pointerup`) closes that
  layer. Each layer decides alone ("is the press inside me?"). No layer needs to know about the
  others, so there is no shared stack for presses.
- **Escape:** one owner per press. Layers that listen separately must agree on who goes first, so
  Escape uses the shared stack in
  [`internal/escape-ownership`](../../src/internal/escape-ownership/). See
  [manual-light-dismiss-escape-stacking.md](./manual-light-dismiss-escape-stacking.md).

"Inside" means DOM containment. Top-layer layers render in place (no portal), so a layer that opens
from another layer is inside it in the DOM.

## Who closes what on a press

| Layer                                                 | Who handles the press                        | Inside                                         |
| ----------------------------------------------------- | -------------------------------------------- | ---------------------------------------------- |
| `auto` or `hint` popover (`Popover`, tooltip)         | The browser                                  | The popover and its descendant popovers        |
| `Dialog`                                              | `use-backdrop-click.tsx` (`closedby="none"`) | Everything but the backdrop                    |
| `useManualLightDismiss` (incl. `Popup mode="manual"`) | `use-outside-press.tsx`                      | `popoverRef` and `additionalInsideElementRefs` |
| `manual` popover without the hook (a field error)     | Nobody: it stays open                        | Not applicable                                 |

## Browser evidence

Probed 2026-10-28 with a real mouse press (Playwright): Chrome 156, Playwright Firefox 144 and
Playwright WebKit 26.0. All three agree, except where WebKit has no `closedby`.

**Three nested `popover="auto"` (A contains B contains C):**

| Press               | Result                      |
| ------------------- | --------------------------- |
| Outside all three   | A, B and C all close        |
| Inside B, outside C | C closes. A and B stay open |

**A modal `<dialog>` with an open `popover="auto"` inside it:**

| `closedby`               | Press on the backdrop (outside both)                                                     | Press in the dialog, outside the popover |
| ------------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------- |
| `any`                    | Both close (WebKit: only the popover closes)                                             | Only the popover closes                  |
| not set (`closerequest`) | Only the popover closes                                                                  | Only the popover closes                  |
| `none`                   | Only the popover closes                                                                  | Only the popover closes                  |
| `none` + our `Dialog`    | Both close: the browser closes the popover, `use-backdrop-click.tsx` closes the `Dialog` | Only the popover closes                  |

The last row comes from the unit tests (with the polyfill) and the code, not from a browser probe.
So our `Dialog` behaves as `closedby="any"` does in Chrome and Firefox, also in Safari.

## Tests

- `__tests__/unit/dialog.tsx`: "closes an auto popover in the dialog and asks to close the dialog on
  one backdrop press", and "closes only the auto popover on a press in the dialog content".
- `__tests__/unit/use-manual-light-dismiss.test.tsx`: "dismisses the popover and a nested manual
  popover with the hook on one press outside both", and "dismisses only the nested manual popover on
  a press inside the popover, outside the nested one".

## Limit

Containment is DOM-based. A layer that opened from the popover but renders elsewhere (a legacy
portalled layer with the top-layer gate off) is outside it, so a press in it dismisses the popover.
Pass that element in `additionalInsideElementRefs`. Do not add a press stack for it.
