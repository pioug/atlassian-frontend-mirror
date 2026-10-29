# Manual Light Dismiss: Escape Goes to the Layer Above

**Status:** Implemented 2026-10-27, shared ownership reworked 2026-10-28

`useManualLightDismiss` lets a layer that opened after its popover, outside the popover and not
around it, have the Escape while that layer is open and takes Escape: it does not call
`preventDefault()` and does not call `onClose`. The open order comes from one `beforetoggle`
listener on `document`. See
[`has-escape-owner-above.tsx`](../../src/internal/escape-ownership/has-escape-owner-above.tsx) and
[`open-order-tracker.tsx`](../../src/internal/escape-ownership/open-order-tracker.tsx).

## The problem

The hook listens for Escape on `document`, wherever focus is, as a native close watcher does. It
already let an open layer _inside_ the popover take Escape first. But a layer can also open above
the popover from _outside_ it, without a pointer press (a press outside dismisses the popover
first):

- a tooltip that opens on hover or focus;
- a modal `Dialog` that a keyboard shortcut or code opens;
- another manual popover with the hook, opened without a press outside the first one.

The hook took that Escape and called `preventDefault()`. That cancels the browser's close request,
and the `Dialog` sees `defaultPrevented`, so the layer below closed and the layer on top stayed
open.

## Browser evidence

Probed 2026-10-27 with trusted input in Chrome 156, Firefox 153 and Safari 27 (where a tooltip is
`popover="auto"`, because `hint` is not supported). All three behaved the same.

| Case (two Escape presses)                          | Native `auto` popover            | Hook before            | Hook now              |
| -------------------------------------------------- | -------------------------------- | ---------------------- | --------------------- |
| Hover tooltip opens after the popover              | tooltip, then popover            | popover; tooltip stays | tooltip, then popover |
| Shortcut opens a modal dialog after the popover    | `showModal()` closes the popover | popover; dialog stays  | dialog, then popover  |
| Auto popover opened by keyboard before the popover | n/a                              | popover, then auto     | popover, then auto    |
| Sibling manual popover opened after                | n/a                              | first popover          | sibling, then popover |

A reviewer asked whether a close request could now close a whole close watcher group (see
[dialog-close-request-dismisses-inner-layer.md](../follow-ups/dialog-close-request-dismisses-inner-layer.md)).
Probed the same day in all three browsers: an auto popover, a manual popover with the hook inside
it, then one or two hover tooltips (one opening as the other closes) inside the auto popover. One
Escape closed only the open tooltip. The auto popover and the manual popover stayed open.

## Decisions

- **One ordering rule for popovers and page surfaces.** A descendant takes Escape before its
  ancestors. Otherwise the later open is above, as with native close watchers. A page surface has no
  open order, so it ranks just above its nearest containing layer (and a surface outside every layer
  ranks below every layer). This prevents a cycle where an older manual popover waits for a newer
  popover, the newer popover waits for its page surface, and the page surface waits for the older
  popover. Comparing only the outermost layers that differ also breaks the cycle, but it ranks a
  tooltip that opens last inside the older popover below the newer popover, so Escape closes the
  newer popover and the tooltip stays open. Element-scoped listeners keep their local scope, plus
  manual popovers that listen on the whole document.
- **`Dialog` uses the same order.** `Dialog` used to decide from focus (the nearest layer on the
  focused element's path, or the dialog that focus was last in). For a modal dialog that finds the
  same top layer, because only the top modal can hold focus, but it was a second stack model, and it
  relied on `Dialog` listening last. Now `Dialog` asks `hasEscapeOwnerAbove` in its `window` capture
  listener. It also gives a later layer outside it (for example an `auto` popover opened by code)
  the Escape first, as the native order does.
- **Ownership precedes the decision to close.** A surface inside a layer claims Escape even when
  `shouldClose` returns false or the key repeats. Otherwise the native close request can dismiss an
  auto popover around the surface and its manual popover.

- **Order, not a document-wide check.** "Any open layer anywhere" is simpler, but it sends Escape to
  an auto popover that is _below_ the manual popover (opened earlier by keyboard, which does not
  light dismiss), and it cannot order two manual popovers that both use the hook (each would wait on
  the other).
- **`beforetoggle`, not `toggle`.** `beforetoggle` fires synchronously when a popover or a
  `<dialog>` opens. `toggle` is task-queued, and in Chrome it had not arrived before an Escape that
  followed the open.
- **What counts as a layer above:** an open modal `<dialog>`, an open `auto` or `hint` popover, or
  an open manual popover with the hook (`data-top-layer-takes-escape`). Checked at Escape time, so a
  closed layer or a cancelled open does not count.
  - A manual popover without the hook (for example a field error) opts out of light dismiss, so it
    does not count.
  - A `<dialog>` counts when the browser closes it on Escape: in a browser with `closedby`, when its
    computed `closedBy` is not `"none"` (a modal dialog without the attribute is `"closerequest"`),
    and in a browser without it (Safari 27), when it is modal. Probed 2026-10-28 in Chrome 156,
    Firefox 153 and Safari 27: Escape in a modal `closedby="none"` dialog inside an auto popover
    closes the popover, not the dialog (Safari ignores the attribute and closes both). `Dialog` has
    `closedby="none"` but takes Escape itself, so it marks itself with `data-top-layer-takes-escape`
    while open. A dialog that does not count is part of the layer around it, so it does not keep
    that layer open. The same rule applies to layers inside the popover and in `Dialog`.
- **A layer above that stays open keeps the popover open.** A `Dialog` or a hook whose consumer
  ignores `onClose` still takes the press. One press, one layer, as with native close watchers.
- **One open order for the page, bound in an insertion effect.** The first version recorded, per
  popover, the layers that opened while its effect was bound. A review proved three gaps: a layer
  that opened in the same commit as the popover was not seen as above it (`Popover` opens in a
  layout effect, before the passive effect bound), two manual popovers that opened together were
  ordered by bind order, and an effect re-run while open forgot the layers above. Now one
  `beforetoggle` listener on `document` gives each element an open order, and the hooks start it in
  an insertion effect: React runs every insertion effect of a commit before any layout effect, and
  never on the server. A first version started it during render, which bound a `document` listener
  during server rendering (Jira's SSR tests report that as a browser API call in SSR). The order
  lives in module scope, outside the hooks, so an effect re-run keeps it. A layer that opened before
  the listener existed has no order: it is below. A popover that opened before the listener existed
  is ordered when its effect runs. Two copies of the package on one page are a bundling bug, so the
  copies do not share one order.
- **Open orders are held in a `WeakMap`.** On Escape, the hook looks at the open layers in the
  document and asks the map about each one, so it never keeps a removed element alive. `Popover`
  mounts a new element on each open, so a long-lived page sees many tooltip elements.
- **A page surface inside the popover takes Escape first.** A `mode: 'page-surface'` surface (or
  `useCloseOnUnclaimedEscape` without `targetRef`) also listens on `document`, so the listener that
  bound first ran first, and either layer could close. A surface that listens on `document` now sets
  `data-top-layer-surface-takes-escape`, and a popover around it leaves the Escape to it. As with
  any layer above, the popover stays open if the surface decides to stay open.
- **Outside presses are not stacked.** One press outside dismisses every open manual popover with
  the hook, as native light dismiss does. See
  [outside-press-closes-every-layer.md](./outside-press-closes-every-layer.md).
- **The listener order is a contract.** `Dialog`, `useCloseOnUnclaimedEscape` and the hook rely on
  the target and phase of each Escape listener: an element, then `document`, then `window`, then the
  browser close request. A listener sees only the `defaultPrevented` of earlier listeners, so it
  must find a layer above it that listens later. See the listener order in
  [`claim-escape.tsx`](../../src/internal/escape-ownership/claim-escape.tsx).

## Focus

Focus does not change the layer order. The open layers decide it: a layer inside another goes first,
and otherwise the layer that opened last. `Dialog`, `useManualLightDismiss` and a page surface
without `targetRef` listen on `document` or `window`, so they hear Escape wherever focus is. A
native close request also goes to the topmost close watcher, wherever focus is.

But focus can stop a layer from getting the Escape:

- **The `keydown` starts at the focused element.** A handler on its path (for example a combobox
  that clears its input) can call `preventDefault()` and take the Escape. Every layer then ignores
  it, and so does the browser. A handler that calls `stopPropagation()` before `document` hides it
  from our `document` and `window` listeners, but the browser still closes the topmost `auto` or
  `hint` popover.
- **`useCloseOnUnclaimedEscape` with `targetRef`** listens on that element, so it hears Escape only
  while focus is inside it. It still waits for every owner above it on the page.
- **IME composition** belongs to the focused field. Escape during composition is ignored.

## Not covered

- A layer that opens before the first render of any hook in the document has no open order, so it is
  below every popover that opens later. That matches the stack, except for a popover that was
  already open when its hook first rendered: it is ordered as if it opened when its effect ran.
- Layers in a shadow root: `beforetoggle` is not composed, and `querySelectorAll` does not search
  shadow roots. Top-layer does not support shadow roots yet.
- A `<dialog>` opened by setting its `open` attribute, not with `show()` or `showModal()`. The
  browser gives it no close watcher, so Escape does not close it, but the checks count it as a layer
  that takes Escape (its `closedBy` is not `"none"`). Open dialogs with `show()` or `showModal()`.
- Nested layers that open in the same commit. React runs child layout effects first, so an inner
  `Dialog` calls `showModal()` before the outer one, and the outer dialog ends up above it in the
  top layer. Escape follows containment and closes the inner dialog, which the outer one covers.
  This is an open order problem in `Dialog` and `Popover`, not an Escape one; it predates this work.
  A manual popover inside a `Dialog` that opens with it has the same open order.
- `useManualLightDismiss` and `useCloseOnUnclaimedEscape` mark and listen in a passive effect (a
  layout effect would warn when server rendering in a DOM test environment). For a popover that
  opens outside a React event, a keydown before passive effects flush does not see it. `Dialog`
  marks and listens in a layout effect.
- A browser without `beforetoggle` on `<dialog>` does not record a `Dialog` above, so that case
  behaves as before.
- Layers that are not `<dialog>` or `[popover]` elements (legacy portalled layers with the top-layer
  gate off). They were not covered before either.
- A plain element (not a `[popover]`) cannot take part in the stack: the checks query
  `dialog, [popover]`, and a plain element fires no `beforetoggle`. So the hook throws for one in
  the default `mode: 'popover'`. A page surface (for example a drawer) uses `mode: 'page-surface'`
  instead: outside a layer it is below every layer. Inside a layer it inherits that layer's position
  and takes Escape before its ancestors, as `useCloseOnUnclaimedEscape` does. It adds the outside
  press to that hook. The Jira inline invite assignee field and the Studio chat drawer use it. Page
  surfaces that close on Escape only use `useCloseOnUnclaimedEscape` directly.
