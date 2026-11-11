# Layer show order

How `Dialog` and `Popover` keep a nested layer above its parent when both show in the same commit.
The code is `layerShowOrder` in `src/internal/layer-show.tsx`.

## The problem

The top layer stacks layers in show order: the last layer shown is on top. `Dialog` and `Popover`
show in a layout effect, and React runs child layout effects before parent ones. So when a layer and
a layer inside it show in the same commit, the inner layer shows first, and its parent covers it.

```tsx
<ModalDialog onClose={closeModal}>
	<Popup isOpen={isMenuOpen} onClose={closeMenu} trigger={renderTrigger} content={renderMenu} />
</ModalDialog>
```

|                        | Layout effects run | Layers show      | On top    |
| ---------------------- | ------------------ | ---------------- | --------- |
| Without the show order | menu, then modal   | menu, then modal | the modal |
| With the show order    | menu, then modal   | modal, then menu | the menu  |

For an `auto` popover (the default mode, used by `Popup` and `DropdownMenu`) it is worse. Showing a
modal dialog or an `auto` popover hides every open `auto` popover that is not its ancestor. So the
modal closes the menu as it shows, and the menu calls `onClose` as if the user had dismissed it.

## When it happens

Only when nested layers show in the same commit. When the user opens a menu in an open modal, the
menu shows in its own commit. The modal has already shown, so nothing waits.

Nested layers show in the same commit in two ways:

- **React shows them again.** This is normal React behavior, and the call site does not always
  control it:
  - A Suspense reveal. A boundary outside the layers hides content that it already showed, for an
    update that is not in a transition. React cleans up the layout effects on hide, and runs them
    again on reveal.
  - An Activity show (React 19.2). A hidden Activity destroys the effects of its content, and
    creates them again on show.
- **Code opens them together.** This is against our position:
  - Layers that mount open together, for example a modal that opens with its menu already open.
  - Strict Mode (development only), a `key` remount and hydration replay such a mount.

Our position: do not design nested layers to open in the same commit. A layer that shows state, for
example a field error, is the exception. But the API cannot prevent it (layers compose), and React
can show nested layers again together, so it must work. The show order is a defensive fix for
React's effect order, not support for the pattern. For the position and the accessibility rules, see
[nested-layers-open-together-a11y.md](../decisions/nested-layers-open-together-a11y.md).

## How it works

1. **Render.** Each layer host renders `data-top-layer-open-requested` while its `isOpen` is `true`.
2. **Effect.** A layer finds its parent layer: the nearest layer around it in the DOM with that
   attribute. If the parent has not shown yet, the layer joins the queue. Otherwise, it shows at
   once.
3. **Show.** The layer shows (`showModal()` or `showPopover()`), marks itself as shown, then shows
   the queued layers inside it whose parent has shown, in DOM order.

DOM order puts a parent before the layers inside it. So when the outer layer shows, each queued
layer inside it shows after its own parent, in one pass. A layer looks only at its parent: if its
grandparent opens in the same commit, its parent does too, so its parent is still waiting.

## Why this design

- **Effects, not render.** Render can run without a commit, and React gives no signal when it throws
  a render away. The attribute is plain render output, so render stays pure.
- **The DOM, not the React tree.** Escape ownership finds layers in the DOM, and the browser finds
  the ancestor of an `auto` popover in the DOM. So the show order, Escape ownership and the browser
  agree.
- **"Parent open-pending", not "has a parent".** A layer inside a parent that is already open must
  show at once, because that parent's effect does not run again.
- **Only the parent.** The parent's state already includes the grandparent's, so a longer chain
  needs no extra check.
- **One queue, sorted by DOM order.** Layers join the queue child first. Sorting by DOM order puts
  each parent before the layers inside it.
- **Only layers whose parent has shown.** A portal can put a layer inside the outer layer in the DOM
  while its own parent shows later. It keeps waiting.

## Focus

- `Dialog` takes focus natively in `showModal()`. `Popover` takes its initial focus right after
  `showPopover()`, because a hidden popover cannot take focus.
- Each layer shows, and takes focus, before the layers inside it. So the innermost layer takes focus
  last, and keeps it.
- An inner popover records its focus restore target (`beforetoggle`) after its parent has focus. So
  closing it returns focus into the parent.
- A `Popover` takes initial focus again when React shows it again while it stays open (Strict Mode,
  a Suspense reveal, an Activity show), as a `Dialog` does natively. See
  [focus.md](./focus.md#initial-focus).

## What does not wait

- A layer that opens in a later commit than its parent. Its parent has already shown.
- A show from an event. `Dialog` shows again in `reopenAfterUnaskedClose`, when the browser closes
  it while its `isOpen` is `true`.

## Limits

- A waiting layer shows from the layout effect of the outer layer that shows it: usually the
  outermost layer that opens in the same commit. So code between them in the React tree (for example
  a wrapper component) runs its layout effects before the waiting layer shows. A layout effect there
  that focuses or measures the waiting layer sees it hidden. Passive effects (`useEffect`) run after
  every layer has shown. For example, a react-select menu that is open on mount scrolls its focused
  option into view in `componentDidMount`, so inside a `Dialog` that opens with it nothing scrolls.
- For the same reason, an error from a waiting layer's `showModal()` comes from the effect of the
  outer layer that shows it, and an error boundary between the two layers does not catch it.
- More than one copy of `@atlaskit/top-layer` on a page is a bug, and is not supported. Each copy
  keeps its own state, so a layer from one copy inside an open layer from another copy waits for it,
  and never shows.
- After a reveal (or a mount in the same commit), an inner popover records the element that had
  focus when it showed (its parent's initial focus target) as its focus restore target, not its
  trigger. So closing it returns focus to that element. This is an edge case.
- Only layers that open in the same commit wait. A parent that closes and opens again in a later
  commit, while a layer inside it stays open, shows above that layer, and above layers that open
  inside that layer in the same commit.

## Tests

- `__tests__/unit/layer-show-order.test.tsx`: show order, focus, `auto` popovers, Suspense,
  transitions and Activity. The Activity tests run on React 19.2 and later (`USE_REACT_NEXT=true`).
- `__tests__/playwright/layer-show-order.spec.tsx`: in real browsers, the innermost layer gets the
  pointer and the focus.
- `__tests__/vr-tests/layer-show-order.vr.tsx`: screenshots of nested layers that mount open
  together.
