# React `autoFocus`, and focus only on the open

> How content inside a top-layer popover or dialog asks for focus when the layer opens, and why a
> layer does not move focus to content that mounts later. Gaps G1 and G2 of the consumer focus
> inventory (2026-11-02).

## Status

**G1 decided 2026-11-16** (user): a layer shows before its content effects run, so React's own
`autoFocus` and `focus()` calls work. This replaces the 2026-11-02 decision (ADS inputs set the
native `autofocus` attribute), which only covered ADS inputs. **G2 decided 2026-11-10** (user):
layers move focus only on the open. The change is in `Popover` and `Dialog`, with no gate (it is a
`@atlaskit/top-layer` primitive change). G1 replaces decision D2 of the flag-on-all-tests report
("no primitive change; each consumer fixes it itself") for focus and for measurement at mount.

## G1: focus asked for while the layer opens

### Terms

- **Show:** the native `showPopover()` or `showModal()` call. Before it, the layer and its content
  are in the DOM but not rendered, and the browser ignores a `focus()` call on them.
- **Content effects:** what React runs for new content in the same commit, once it is in the DOM:
  `autoFocus` (a `focus()` call), ref callbacks, `useLayoutEffect` and `componentDidMount`. React
  runs them child-first, siblings in order. `useEffect` runs later, after paint.

### Problem

`Popover` and `Dialog` called `showPopover()` and `showModal()` in their own layout effect. React
runs the `autoFocus` logic of an element before the `useLayoutEffect` of the component that renders
it, so the content effects ran first. React 18.3 and 19.3 render no `autofocus` attribute on the
client for the JSX `autoFocus` prop (checked in Chromium, Firefox and WebKit). React calls `focus()`
on the element in the commit (`commitMount`, for `<input>`, `<button>`, `<select>` and
`<textarea>`). `react-select` calls `focus()` in `componentDidMount`. Consumers call `focus()` in
ref callbacks and layout effects. All of these ran while the layer was closed, so its content was
not rendered, and the browser ignored the call. Nothing records it.

The legacy path rendered content that was already visible (a portal), so the call worked. With the
gate on in all tests (flag-on-all-tests report, chunk D2), 51 tests failed on this, and about 15
consumers had a workaround.

### Options

1. **The layer shows before its content effects.** Chosen (2026-11-16). See the decision.
2. **The layer renders its content one commit after the show.** Content effects then run with the
   layer open. But the effects of the component that renders the layer run in the first commit, with
   no content: a consumer `useEffect` that focuses or reads a ref into the content when the layer
   opens, which works today, would break. It also changes initial focus (the browser focuses an
   empty layer). Rejected.
3. **The layer records failed `focus()` calls** (patch `HTMLElement.prototype.focus` while a layer
   opens) or reads React props from DOM nodes (`__reactProps$`). Global or private hooks. Rejected.
4. **Each consumer fixes it** (D2): `ModalDialog autoFocus={ref}`, Popup `setInitialFocusRef`, or
   the attribute set by hand. Rejected by the user: no consumer focus workarounds.
5. **ADS inputs set the native `autofocus` attribute for `autoFocus`.** Chosen on 2026-11-02, then
   replaced. It covered only ADS inputs: a raw `<input autoFocus>`, `Pressable` and an imperative
   `focus()` still failed. The attribute also made the browser a second focus picker that we cannot
   turn off: it focused the field before a `setInitialFocusRef` target, ignored
   `UNSAFE__disableInitialAutoFocus` and the combobox rule, and refocused the field on each reopen.
6. **A top-layer API to mark the initial focus element.** A new API that duplicates `autoFocus`.
   Rejected.
7. **DS inputs focus in a passive effect** (as `@atlaskit/button` already does with `useAutoFocus`).
   It works, but in a dialog focus moves twice (first focusable, then the field) and it can come
   after a paint. Not chosen. `Button` keeps its effect, which works.

### Decision

A layer that mounts open shows before its content effects run
(`internal/sync-native-open/use-sync-native-open.tsx`). Every open from `closed` mounts the host, so
this covers every open.

The timing in one commit, when a layer mounts open:

| Step | Before                                    | Now                                                     |
| ---- | ----------------------------------------- | ------------------------------------------------------- |
| 1    | Content effects run on a hidden layer     | `FirstSibling` shows the layer                          |
| 2    | The layer's layout effect shows the layer | Content effects run on a visible layer                  |
| 3    | Initial focus                             | The layer's layout effect: initial focus, unless inside |
| 4    | Paint, then `useEffect`                   | Paint, then `useEffect` (no change)                     |

- **How.** We call `.showPopover()` and `.showModal()` early, in a layout effect in `FirstSibling`,
  so that we play nicely with the timing of React's built-in `autoFocus` behaviour. The host renders
  `FirstSibling`, an internal component that renders nothing, before `children`.
  - React runs its `autoFocus` logic in the same tree walk as `useLayoutEffect`. React runs the
    `autoFocus` logic of an element _before_ the `useLayoutEffect` of the component that renders it.
  - The `useLayoutEffect` in `FirstSibling` always runs before the effects of its later siblings
    (`children`), no matter how deep they are. This is React's commit order.
  - So the layer shows before React runs its own `autoFocus` code on `children`, and the React
    `autoFocus` prop on JSX in `children` works.

  `FirstSibling` finds the host by its `id` (see "Finding the host" below), binds the host's
  `beforetoggle` and `toggle` listeners (`beforetoggle` fires during the show), and shows the layer.

  <!-- prettier-ignore -->
  ```tsx
  <div popover>              // 5. host layout effect: initial focus
    <FirstSibling />         // 1. showPopover()
    <Card>                   // 4. Card's layout effects
      <Body>                 // 3. Body's layout effects
        <input autoFocus />  // 2. focus() works: the layer is visible
      </Body>
    </Card>
  </div>
  ```

- **Why a component and not the host ref.** React attaches a parent's ref after all of its
  children's effects, so the host ref comes too late. A first-child element would have a direct
  reference to its parent, but adds a node that every consumer sees (`:first-child` CSS,
  `firstElementChild`, DOM snapshots).
- **The layer's own layout effect** then finishes the show: it runs initial focus (`Popover`), and
  lets the nested layers that wait for it show (see "Nested layers").
- **The `[autofocus]` step after the content effects.** The browser's `[autofocus]` step runs in the
  show, before the content's ref callbacks. So once the content effects have run, if focus has not
  moved since the show, the layer focuses the first `[autofocus]` element that can take focus (a
  disabled, inert or hidden one is skipped; one that Tab skips is not). An attribute set by hand in
  a ref callback works, as before.
- **Initial focus does nothing when focus is already inside the layer.** Precedence: the content's
  own focus (React `autoFocus`, a `focus()` call), then an `[autofocus]` element, then
  `initialFocusRef` (Popup `setInitialFocusRef`), then the role default. Before, `initialFocusRef`
  won over an `[autofocus]` element (focus moved twice). A close and a reopen in the same task
  (before a paint) can leave focus inside the layer (WebKit, or a `manual` popover), and it stays
  there. In Chromium and Firefox an `auto` popover returns focus on the close, so the reopen takes
  initial focus. Not consistent, but focus is inside the open layer either way, and the case is rare
  (user, 2026-11-17). After a paint, every browser has moved focus out of a closed layer (we
  checked), so a later reopen takes initial focus as before. Focus on the layer element itself does
  not count: a wrapper can put focus there while its content loads. The entry-points `PopupTrigger`
  does: when the module loads before the content (the content still waits for its query), it moves
  focus from its loading element to the container, which stays when the loading element goes. The
  rules are in one function, `setInitialFocus`, which `Popover` and the exported `applyInitialFocus`
  share (user, 2026-11-17). So the entry-points triggers keep content `autoFocus` after a load too.
- **Finding the host.** React attaches the host ref after the content effects, so `FirstSibling`
  finds the host by its `id` (`document.getElementById`). `Popover` and `Dialog` always render an
  `id` (the `id` prop, or a `useId` value), and it must be unique, as `aria-controls`,
  `popovertarget` and anchoring already need. If the host is not found (for example in a shadow
  root, which we do not support), the layer shows from its own layout effect, as before, and content
  `autoFocus` does not work (user, 2026-11-17).
- **A re-show that is not a reopen** (StrictMode in development, a Suspense or Activity reveal)
  hides and shows the layer again without a new `isOpen`. React does not run the content's
  `autoFocus` again, so the layer puts focus back where it was when it hid, if focus has not moved
  since the show.
- **Nested layers** that open in the same commit: a layer inside another one (in the DOM) waits
  until its parent has shown, its content effects have run and it has taken initial focus
  (`internal/layer-show.tsx`). So the parent takes initial focus first, and the nested layer returns
  focus there when it closes. The nested layer's own content `autoFocus` does not work in that case.
  Nested layers that open together are not a supported pattern.

Results:

- React `autoFocus` on `<input>`, `<button>`, `<select>` and `<textarea>` works in a layer, for ADS
  components and raw elements. So does `focus()` in a ref callback, a layout effect or
  `componentDidMount`.
- **Several `autoFocus` elements:** the last one keeps focus, as on the legacy path (React calls
  `focus()` for each in commit order).
- **`UNSAFE__disableInitialAutoFocus`** turns off our initial focus. The content's own `focus()`
  calls still work.
- **Content layout effects and ref callbacks** see a shown layer, so a measurement at mount
  (`getBoundingClientRect()`) returns real sizes, as on the legacy path.
- **`ModalDialog autoFocus={ref}`** still runs after the open (a passive effect), so a ref target
  wins over an `autoFocus` field, as on the legacy path.
- **`Dialog` moves focus twice** when the content asks for it: `showModal()` runs the dialog
  focusing steps before the content effects (the first focusable element takes focus), then the
  content's `autoFocus` or the `[autofocus]` step moves it. Both moves are in the same task, before
  paint, so listeners see two `focus` events and the user sees one.
- **A reopen during the exit** keeps the mounted content, so React does not run `autoFocus` again.
  The role default and `initialFocusRef` apply, as before, unless focus is still inside (a close and
  a reopen in the same task).

### What stays out

- **`autoFocus` on other elements** (for example a `div` with `tabIndex`). React does not focus
  them, inside a layer or not.
- **A layer in a shadow root.** We do not support it (see "Finding the host").

## G2: focus only on the open

### Problem

Content that mounts after a layer opened (an entry point, a lazy import, Suspense, content that
waits for data) asks for focus too late for the open: a Popup `setInitialFocusRef` target, a
`DropdownMenu` item, `ModalDialog` content after a loading state. The open has already moved focus
(the role default, or the `<dialog>` itself), or moved none.

### Decision

**Layers move focus only on the open (user, 2026-11-10).** `Popover` reads `initialFocusRef` once,
as it opens, and `Dialog` keeps the native `showModal()` focus. No wrapper moves focus to content
that mounts later. A consumer that wants focus somewhere else, or later, turns the open's focus off
with the wrapper's restricted opt-out, where it has one, and moves focus itself:

- **Popup** (not `PopupContent`): `UNSAFE__disableInitialAutoFocus`. The open moves no focus, so the
  content (or its entry point wrapper) moves it when it is ready. The entry-points `PopupTrigger`
  sets it behind `platform_dst-automated_focus`.
- **`DropdownMenu`**: the menu focuses an item only as it opens (2026-11-09). Entry point code moves
  focus to items that mount later. See
  [`../migrations/dropdown-menu-migration.md`](../migrations/dropdown-menu-migration.md).
- **`ModalDialog`**: no prop stops the open's focus: `showModal()` always runs the dialog focusing
  steps (the first `[autofocus]` element, else the first sequentially focusable element, else the
  `<dialog>`). `autoFocus={ref}` moves focus to a ref target that is there at the open (in an effect
  after `showModal()`). `UNSAFE__disableInitialAutoFocus` turns off only that `autoFocus` ref focus.
  Content that needs focus later moves it itself, after the open. The entry-points `ModalTrigger`
  sets the opt-out behind `platform_dst-automated_focus`.

A `setInitialFocusRef` target, an `autoFocus` ref target or an `[autofocus]` element that is in the
layer when it opens still takes focus, as before. An element with React `autoFocus` that mounts in a
layer that is already open still focuses itself through React's `focus()` call.

### What the legacy path did differently

- **Popup** moves focus to its container one frame after the open, unless a `setInitialFocusRef`
  target is set (its focus trap's initial focus). So on the legacy path the target, or the
  container, wins over content `autoFocus`. On the top-layer path the content's own focus wins.
- **Popup** honours a `setInitialFocusRef` target that is set after the open: the focus trap runs
  again with the new target. It does so even after the user moved focus, and even with
  `UNSAFE__disableInitialAutoFocus`.
- **`DropdownMenu`** passed its first item through `setInitialFocusRef`, so a late first item took
  focus.
- **`ModalDialog` in an entry point**: the entry-points `FocusInsideOnLoad` moves focus into the
  modal when the entry point loads. It finds the modal through the `ModalDialog` `ref`. The
  top-layer path did not forward the `ref`, so focus went to `<body>` when the load removed the
  focused loading content. Now it forwards the `ref` to the native `<dialog>` (2026-11-17, see
  [`../follow-ups/modal-dialog-ref-forwarding.md`](../follow-ups/modal-dialog-ref-forwarding.md)).

### Options considered (2026-11-02, before the decision)

1. **`Popover` watches its content** (a `MutationObserver`) until a target arrives. It cannot see a
   target set without a DOM change, and it would put a wrapper rule in the primitive. Rejected.
2. **Each wrapper focuses its own late target when it arrives** (Popup `setInitialFocusRef`,
   `DropdownMenu` first item, `ModalDialog` content), while focus is still where the open left it.
   Built on the integration branch, then dropped by the 2026-11-10 decision: a layer moves focus
   only on the open, and the opt-out covers content that needs focus later.
3. **Each consumer focuses its own late target.** Chosen, through the opt-outs above.

## Tests

Focus and React timing tests run in a browser. jsdom keeps smoke tests for the patterns that
consumers check in their own jsdom tests, so a jsdom gap shows up here first.

- `modal-dialog`:
  - `__tests__/playwright/top-layer-focus.spec.tsx` (Chromium): several `autoFocus` fields, a field
    that mounts later, an `autoFocus` ref over an `autoFocus` field, a ref callback `autoFocus` ref,
    and content and an `autoFocus` ref target that mount later do not take focus.
  - `modal-dialog-top-layer-initial-focus.test.tsx` (jsdom smoke): `autoFocus` on a Textfield and a
    Select, an `autoFocus` ref, and a `focus()` in a ref callback.
- `popup`:
  - `__tests__/playwright/top-layer-focus.spec.tsx` (Chromium): a late `setInitialFocusRef` target
    does not take focus on the top layer (`Popup` and `PopupContent`) and does on the legacy path; a
    target set in a `useEffect`; `UNSAFE__disableInitialAutoFocus` leaves focus to the content.
  - `popup-top-layer-initial-focus.test.tsx` (jsdom smoke): `autoFocus` on a Textfield and a Select,
    a `setInitialFocusRef` ref callback, and a `focus()` in a ref callback.
- `top-layer`:
  - `__tests__/playwright/show-before-content-effects.spec.tsx` (Chromium, Firefox and WebKit):
    content focus calls on the open for each layer kind, the precedence rules,
    `UNSAFE__disableInitialAutoFocus`, focus return, a reopen during the exit (also one where the
    close left focus inside), measurement at mount, nested layers, and StrictMode.
  - `show-before-content-effects.test.tsx` (jsdom smoke): content `autoFocus` for each layer kind, a
    layer that mounts open (also in StrictMode), and a popover that opens with its parent dialog.
  - `polyfill-show-before-content-effects.test.tsx`: the jsdom polyfill models the browser for both
    show orders.
  - `use-initial-focus.test.tsx` (`[autofocus]` in a dialog: a disabled or inert one is skipped; one
    with `tabindex="-1"` or `aria-disabled` is focused; `[autofocus]` over `initialFocusRef`).
