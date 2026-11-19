# Focus Management

Focus management in `@atlaskit/top-layer` covers three areas: focus wrapping, initial focus
placement, and focus restoration. This document explains the decisions and implementation for each.

---

## Focus wrapping for dialogs

### Problem

Native `<dialog>.showModal()` wraps focus through `<body>` at the boundary: `A → B → C → body → A`.
The [APG Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) requires direct
wrapping: `A → B → C → A`. This is consistent across all major browsers (Chrome, Firefox, Safari,
Edge) — it's how the
[sequential focus navigation algorithm](https://html.spec.whatwg.org/multipage/interaction.html#sequential-focus-navigation)
works, not a browser bug.

Popovers with `role="dialog"` have no native focus wrapping at all — Tab freely escapes to
background content.

### Decisions

- **Popovers with `role="dialog"` get focus wrapping.** Tab/Shift+Tab cycle within the popover.
  Light dismiss (Escape, click outside) still works via `popover="auto"`. Sources:
  [APG Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/),
  [MDN `dialog` role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/dialog_role).

- **Popovers with other roles do not get focus wrapping.** Focus is allowed to leave the popover,
  and it stays open. The
  [popover spec](https://open-ui.org/components/popover.research.explainer/#focus-management) does
  not prescribe focus trapping — it's the `role="dialog"` that requires wrapping. Other roles have
  their own keyboard patterns (e.g.
  [menus use arrow keys](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/), not Tab).

- **`Dialog` (`<dialog>.showModal()`) also uses focus wrapping.** Overrides the native `<body>`
  intermediate step. We could get away with the native behavior, but it's right to be fully spec
  compliant and to align keyboard behavior across all dialogs.

### Implementation

`useFocusWrap` hook (`src/internal/use-focus-wrap.tsx`):

- Intercepts `Tab` and `Shift+Tab` (capture phase, `preventDefault()`)
- Remaps them to `getNextFocusable({ container, direction })`, which handles wrapping
- Uses a non-tabbable focused element only as the navigation origin so focus can leave it;
  `tabindex="-1"` elements remain excluded as destinations
- Used in `Popover` (active when role is `'dialog'`) and `Dialog` (always active)

### Nested top-layer scopes

A dialog can hold other layers: a menu or a listbox popup, a date-picker calendar, or another
dialog. One rule decides how a nested layer (a `[popover]` or `<dialog>` inside the container) takes
part in the outer focus wrap: **does it own its focus?** It does when it is a `<dialog>` or has
`role="dialog"` / `"alertdialog"` (`isFocusOwningLayer`, the same roles that turn on
`useFocusWrap`). See
[`../decisions/role-and-focus.md`](../decisions/role-and-focus.md#nested-layers-and-tab-does-the-layer-own-its-focus).

Both layers of a nested dialog attach a `useFocusWrap` listener, and the capture-phase listener on
the outer layer fires first. If the outer layer handled Tab while focus was inside the inner dialog,
it would call `preventDefault()` and move focus to one of its own focusables, ejecting focus from
the inner dialog and triggering its blur handlers (which typically close it).

So `useFocusWrap` calls `isNestedLayerFocused` (focus-owning layers only) before it intercepts Tab.
The helper returns `true` when `document.activeElement` is inside the container and some layer
between it and the container owns its focus. Then the outer hook returns early and the inner hook
takes over.

The contract:

- **Inside our own layer, or in a nested layer that does not own its focus** (an open menu or
  listbox popup) → handle Tab normally (cycle). `getFocusables` includes the elements of open nested
  layers that do not own their focus, in DOM order, so Tab enters, moves through and leaves them.
- **Inside a nested layer that owns its focus** → skip; the inner hook handles it. Its elements are
  not in our Tab order, at any depth.
- **Outside our layer** (body, a sibling layer, or no active element) → handle Tab to reclaim focus
  into our scope when the keydown reaches us.

The "reclaim from loose focus" branch matters for the `<Dialog>` modal case: if the user clicks
outside and presses Tab, focus should snap back into the modal rather than wander the page. With
focus on `<body>`, the keydown does not reach the dialog, and the browser enters the modal dialog
itself, because the page outside it is inert.

Two consequences:

- The listener moves focus in the capture phase. A listener inside the dialog that reads
  `document.activeElement` for a Tab keydown sees the new focus target, so it must read
  `event.target` for the element that had focus.
- `useArrowNavigation` closes its menu on Tab in the capture phase on the document, before the
  dialog's listener. Focus returns to the trigger, and the dialog moves on from there. Arrow keys
  keep to the menu's own layer (`isInContainerLayer`).

Two edges follow the browser's own Tab order: focus inside an `<iframe>` (its keydown does not reach
us), and a nested product-built `role="dialog"` layer that does not wrap focus itself.

### TODO: empty layers

Layers with no focusable descendants (e.g. spinner-only loading) soft-lock on Tab. JSDoc on `Dialog`
/ `Popover` recommends rendering a focusable on open, but this is not enforced. Possible follow-up:
fall back to focusing the container itself (`tabIndex={-1}`).

---

## Initial focus

### Problem

When a dialog or popover opens, focus needs to move to an appropriate element inside it
([WCAG 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html)). The
question is whether native browser behavior handles this for us, or whether we need custom logic.

### What the browser gives us natively

**`<dialog>.showModal()` handles initial focus completely.** The
[dialog focusing steps](https://html.spec.whatwg.org/multipage/interactive-elements.html#dialog-focusing-steps)
algorithm:

1. If a descendant has `autofocus`, focus it
2. Otherwise, focus the first focusable descendant
3. If no focusable descendants, focus the `<dialog>` element itself

This covers every case. No custom code needed. Validated as consistent across all three engines
(April 2026, Playwright 1.57.0):

| Engine   | Version      | `autofocus` respected | First focusable fallback |
| -------- | ------------ | --------------------- | ------------------------ |
| Chromium | 143.0.7499.4 | ✅                    | ✅                       |
| Firefox  | 144.0.2      | ✅                    | ✅                       |
| WebKit   | 26.0         | ✅                    | ✅                       |

**`showPopover()` does NOT auto-focus the first focusable child.** The
[popover focusing steps](https://html.spec.whatwg.org/multipage/popover.html#popover-focusing-steps)
algorithm only moves focus when:

1. The popover element itself has `autofocus`, OR
2. A descendant has `autofocus` (the "autofocus delegate")

Without `autofocus`, focus stays on the trigger — regardless of role. Independently verified in
Chromium:

| Scenario                               | Native `showPopover()` behavior | APG requirement       | Gap?    |
| -------------------------------------- | ------------------------------- | --------------------- | ------- |
| `role="dialog"`, no `autofocus`        | Focus stays on trigger          | Focus first focusable | **Yes** |
| `role="dialog"`, child has `autofocus` | Focuses the autofocus child     | Focus autofocus child | No      |
| `role="menu"`                          | Focus stays on trigger          | Focus first menu item | **Yes** |
| `role="listbox"`, selected option      | Focus stays on trigger          | Focus selected option | **Yes** |
| `role="tooltip"`                       | Focus stays on trigger          | No focus movement     | No      |

### Why not just use the `autofocus` attribute?

We can't replace the hook with static `autofocus` attributes because:

- **First focusable is dynamic.** It depends on rendered content, not something known at author
  time.
- **Role-specific logic.** Different roles need different targets: `dialog` → first focusable,
  `listbox` → selected option (`[aria-selected="true"]`), `tooltip` → nothing.
- **Consumer `autofocus` must still work.** If a consumer places `autofocus` on a specific element,
  that should win — the hook checks for `[autofocus]` first, then falls back.

### React `autoFocus`: the layer shows before its content effects

Terms:

- **Show:** the native `showPopover()` or `showModal()` call. Before it, the layer and its content
  are in the DOM but not rendered, and the browser ignores a `focus()` call on them.
- **Content effects:** what React runs for new content in the same commit, once it is in the DOM:
  `autoFocus` (React calls `.focus()`, as the JSX prop does not set the HTML `autofocus` attribute
  on the client), ref callbacks, `useLayoutEffect` and `componentDidMount`. React runs them
  child-first, siblings in order. `useEffect` runs later, after paint.

**Before:** the layer showed in its own layout effect. React runs the `autoFocus` logic of an
element before the `useLayoutEffect` of the component that renders it, so the layer showed after its
content effects. A content `autoFocus` or `focus()` call landed on a hidden layer and did nothing.

**Now:** we call `.showPopover()` and `.showModal()` early, in a layout effect in `FirstSibling`, so
that we play nicely with the timing of React's built-in `autoFocus` behaviour. `Popover` and
`Dialog` render `FirstSibling`, an internal component that renders nothing, before `children`
(`internal/sync-native-open/use-sync-native-open.tsx`):

- React runs its `autoFocus` logic in the same tree walk as `useLayoutEffect`. React runs the
  `autoFocus` logic of an element _before_ the `useLayoutEffect` of the component that renders it.
- The `useLayoutEffect` in `FirstSibling` always runs before the effects of its later siblings
  (`children`), no matter how deep they are. This is React's commit order.
- So the layer shows before React runs its own `autoFocus` code on `children`, and the React
  `autoFocus` prop on JSX in `children` works.

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

In one commit, when a layer mounts open:

1. `FirstSibling` shows the layer.
2. The content effects run. A `focus()` call works, and a measurement sees real sizes.
3. The layer's own layout effect takes initial focus, unless focus is already inside.
4. Paint, then `useEffect`.

So React `autoFocus` (ADS components and raw elements) and `focus()` in a ref callback, a layout
effect or `componentDidMount` work, as on the legacy path. `FirstSibling` finds the host by its `id`
in the document. If it cannot (for example in a shadow root, which we do not support), the layer
shows in step 3, as before, and content `autoFocus` does not work. See
[`../decisions/react-autofocus-and-focus-on-open.md`](../decisions/react-autofocus-and-focus-on-open.md).

Entry-point triggers (`PopupTrigger` and `ModalTrigger` from `@atlassian/entry-points`) also move
focus with `FocusInsideOnLoad` after the entry point loads. With `platform_dst-automated_focus` on,
they use `applyInitialFocus`, so focus that the loaded content took (React `autoFocus`) stays. A
`setInitialFocusRef` target or a modal `autoFocus` ref target still comes first. When the module
loads before the content (the content still waits for its query), `PopupTrigger`'s loading element
still has focus. That focus is the trigger's, so it moves it to the container first. `ModalTrigger`
does not move focus into a `<dialog>` that closed before the content was ready. With the gate off,
they move focus to the first focusable element or the container, so content `autoFocus` loses. The
modal `FocusInsideOnLoad` finds the modal through the `ModalDialog` `ref`. On the top-layer path,
`ModalDialog` forwards its `ref` to the native `<dialog>` (see
[`../follow-ups/modal-dialog-ref-forwarding.md`](../follow-ups/modal-dialog-ref-forwarding.md)).
Browser tests: `focus-inside-on-load.spec.tsx` in
`entry-points/src/popup-trigger/__tests__/playwright/` and in
`entry-points/src/modal-trigger/__tests__/playwright/`. Layers move focus only on the open: content
that needs focus later moves it itself (see
[`../decisions/react-autofocus-and-focus-on-open.md`](../decisions/react-autofocus-and-focus-on-open.md)).

### Decisions

- **`Dialog` does not use `useInitialFocus`.** Native `showModal()` handles it. This is correct — no
  changes needed.
- **`Popover` uses `useInitialFocus`.** This fills a genuine gap in the Popover API. Without it,
  `role="dialog"`, `role="menu"`, and `role="listbox"` popovers violate WCAG 2.4.3.

### Implementation

`useInitialFocus` hook (`src/internal/use-initial-focus.tsx`):

- On open, resolves the correct focus target based on role. For the roles that move focus, an
  `initialFocusRef` target inside the popover comes first (see [`initialFocusRef`](#initialfocusref)
  below):
  - `dialog`: `initialFocusRef` target, `[autofocus]` element, or first focusable
  - `menu`: `initialFocusRef` target, or first focusable (menu item)
  - `listbox`: `initialFocusRef` target, `[aria-selected="true"]` option, or first focusable
  - `tooltip` / no role: no focus movement
- Combobox carve-out (for `menu`, `listbox`, and `dialog` / `alertdialog`): if the popup is owned by
  a focused combobox-like textbox, focus stays on the textbox and the popup surfaces the active
  option via `aria-activedescendant`. For `dialog` / `alertdialog`, the textbox must be outside the
  dialog: a dialog that contains its own combobox still takes focus. A single predicate
  (`isComboboxControllingPopup`) covers both layouts:
  - **In-popup combobox**: the focused textbox lives inside the popup `container` (the popup is
    rendered as a child of the combobox wrapper).
  - **External combobox**: the focused textbox is rendered OUTSIDE the popup (`react-select`
    pattern, where the listbox is portalled separately from the textbox).

  Acceptance criteria for the focused element:
  - Role / element-type filter: `role="combobox"`, `role="textbox"`, `TEXTAREA`, `contentEditable`,
    or `INPUT` of text-like type (`text`, `search`, `email`, `url`, `tel`, `password`, or
    unspecified). Non-text input types (`button`, `checkbox`, etc.) are rejected.
  - Reference filter: `aria-controls` (or legacy `aria-owns`) IDREFS must resolve to an element that
    IS or CONTAINS the popup container.

  Without this carve-out, moving focus into the listbox would blur the external textbox and cause
  libraries like `react-select` to close the menu on the same interaction that opened it.

  **Considered and rejected: hoisting the carve-out above all role branches.** Doing so would give
  role-undefined popups (e.g. `@atlaskit/react-select`'s `MenuPortalTopLayer`, where the listbox
  role lives on a descendant of a roleless Popover host) an explicit "combobox owns me" guarantee
  instead of relying on the "no role = no focus movement" fall-through. The
  `container.contains(referenced)` wrapper-shape match makes it tempting to apply to all
  popup-shaped roles, but it is over-broad for `dialog` popups that themselves contain a separate
  combobox widget. `@atlaskit/datetime-picker`'s calendar dialog renders `react-select` inside it;
  the active combobox's `aria-controls` resolves to a listbox inside the dialog container, which
  falsely matches the wrapper-shape rule and suppresses the dialog's own focus contract. A per-role
  opt-in for the wrapper-shape match was prototyped and discarded as added complexity for a
  hypothetical future caller — current consumers (`react-select`, `TimePicker`, `DatePicker`) all
  work correctly under the role-specific placement.

- Fires each time the popover shows, once its content effects have run. `useInitialFocus` returns
  `setInitialFocus`. The popover shows from `FirstSibling`, before the content effects, and
  `Popover`'s own layout effect calls `setInitialFocus` after them. It does nothing when focus is
  already inside the popover (the content, or the browser's `[autofocus]` step, moved it there).
  Focus on the popover element itself does not count. All the initial focus rules are in one
  function, `setInitialFocus` (`src/internal/set-initial-focus.tsx`). `Popover` and the exported
  `applyInitialFocus` both use it, so a wrapper that sets focus later (for example after an entry
  point loads) follows the same rules. The show effect runs:
  - When `isOpen` turns `true`: `closed → entering` (animated), `closed → open` (not animated), and
    a reopen during the exit, `exiting → entering`. When a user dismisses the popup (Escape, close
    button, light dismiss) the browser natively restores focus to the trigger as part of
    `hidePopover()` / `<dialog>.close()`. If the consumer reopens before the exit transition has
    settled, the phase machine jumps `exiting → entering` without passing through `closed`. Without
    focus there, the popup would be visible again with focus stranded on the trigger, a keyboard
    usability gap for menu / dialog / listbox roles.
  - When React creates the effect again while the popover stays open: strict mode, a Suspense or
    Activity hide and reveal, and Fast Refresh. The popover hides and shows again. It puts focus
    back where it was when it hid, if that element can still take focus, else it takes initial focus
    as on an open. A `Dialog` does the same (`showModal()` moves focus, then the layer puts it
    back). So nested layers that show again end with focus in the innermost one.
  - Other renders (`entering → open`, a new `role` or `initialFocusRef`) do not run the show effect,
    so they do not move focus.
- Focus moves the instant the host element first becomes visible — not after the entry transition
  settles. APG expects keyboard focus to land on the new menu / dialog the moment it opens, so a
  `transitionend`-gated focus call (~150ms late on a typical entry animation) is a focus-stealing
  hazard: subsequent user input (e.g. an arrow-left to back out of a nested submenu) can land before
  the deferred `focus()` fires, snapping focus back to a now-stale element.
- Synchronous inside the show layout effect, with no `requestAnimationFrame` wrapper. The host is
  already in the top layer. A popover inside a parent layer that opens in the same commit waits
  until that parent has shown and taken its initial focus (`layerShowOrder` in
  `internal/layer-show.tsx`), so the innermost layer ends with focus (see
  [layer-show-order.md](./layer-show-order.md)). Focus lands in the same task as the open, before
  the browser paints, so the first frame already shows focus where it belongs and the content's own
  `useEffect`s see it there.
- **Content that moves focus itself.** Content that calls `.focus()` in its content effects (React
  `autoFocus`, a ref callback, a layout effect, or a class `componentDidMount`, as `react-select`'s
  `autoFocus` does) runs after the show and before initial focus, so its focus wins and initial
  focus does nothing. Content that calls `.focus()` in a `useEffect` runs after initial focus, so
  its focus wins and listeners see two focus moves. To choose the target without moving focus
  yourself, use `initialFocusRef` (`setInitialFocusRef` in `@atlaskit/popup`).
- Only used in `Popover`, not `Dialog`.

#### Programmatic reopen during the exit

A consumer can flip `isOpen` false → true during the exit without a user close gesture:

- **In the same task, before a paint:** browsers differ, and the result is not consistent. In
  Chromium and Firefox an `auto` popover returns focus to the trigger on the close, so the reopen
  takes initial focus. In WebKit, and for a `manual` popover in every browser, focus is still
  inside, so it stays on the element that had it. Either way focus is inside the open popup. We
  accept this for an edge case (user, 17 Nov 2026).
- **Later in the exit (after a paint):** every browser has already moved focus out of the closed
  popover (to the trigger, or to `body`), so the role default takes focus, as on
  `closed → entering`. To choose another target, use `initialFocusRef`.

We checked both cases in Chromium, Firefox and WebKit (17 Nov 2026). Before, focus that the close
left inside did not count, so the same-task reopen took initial focus in every browser. We removed
that exception to keep the rule simple: focus already inside stays.

#### `initialFocusRef`

`Popover` takes an optional `initialFocusRef`. `getInitialFocusTarget` uses it as the first choice
in each role branch that moves focus. For a dialog, `getInitialFocusTarget` picks the
`initialFocusRef` target, then the first `[autofocus]` element, then the first focusable element. It
runs only when focus is not already inside, so an `[autofocus]` element that the browser or the
layer already focused wins (see below).

- **Roles:** only `dialog`, `alertdialog`, `menu` and `listbox` use it. The types accept it only for
  those roles (`TRoleWithInitialFocus`), and the runtime ignores it for other roles and for no role.
  Use it for `dialog` and `alertdialog`, where the author chooses the target. `menu` and `listbox`
  already focus the right element.
- **Inside the popover only:** a target that the popover does not contain (outside it, or not in the
  DOM) is ignored, and the role default applies.
- **Combobox carve-out first:** the carve-out decides whether focus moves. The target only decides
  where. A combobox that controls the popover keeps focus.
- **Popup:** `@atlaskit/popup` passes its `setInitialFocusRef` target only for roles that move
  focus. `useRoleProps` (`popup/src/internal/top-layer-bridge.tsx`) puts `initialFocusRef` only on
  those role variants, so the types hold the whole way down.
- **Timing:** read after the content effects have run, with the role default, so our code moves
  focus once. Set the target in a ref callback (for example as the `ref` of an element in
  `children`) or in the content's own layout effect, which runs first. A target set in the content's
  `useEffect` is too late, and the role default takes focus. Content that mounts later does not get
  focus: layers move focus only on the open. Content that needs focus later uses Popup
  `UNSAFE__disableInitialAutoFocus` and moves focus itself (see
  [`../decisions/react-autofocus-and-focus-on-open.md`](../decisions/react-autofocus-and-focus-on-open.md)).
- **Focus already inside wins:** the target applies only when the content has not moved focus into
  the popover. An `[autofocus]` element wins too: the browser's popover focusing steps focus one
  that is in the DOM at the show, and the popover focuses one that a content effect marked (a ref
  callback) once the content effects have run. Before, the target won and focus moved twice.
- **Reopen mid-exit:** the content stays mounted, so the target takes focus again, unless focus is
  still inside (see "Programmatic reopen during the exit" above).

It replaced an effect in `@atlaskit/popup` that ran after `Popover`'s initial focus and focused the
target a second time. Listeners saw two focus moves, and the effect keyed on `isOpen`, not on the
phase rules above.

#### Role and focus are a package deal

The role alone decides initial focus. There is no opt-out: a popup that must not take focus must not
use `dialog`, `alertdialog`, `menu` or `listbox`. `@atlaskit/popup`'s `autoFocus` has no effect on
the top-layer path. See [`../decisions/role-and-focus.md`](../decisions/role-and-focus.md).

Not done: `preventScroll` on the initial `focus()`. It would also stop the popover's own scroll
container from scrolling a selected listbox option into view, so it is not a safe one-line change.

---

## Focus restoration

Focus restoration is handled by a combination of the browser's native Popover/Dialog APIs and a
narrow internal fallback for nested popovers. Consumers do not pass a ref, do not call
`trigger.focus()`, and do not need to know whether a popover is nested - Popover handles all of it
automatically.

The two primitives use different browser APIs with subtly different behavior on light dismiss, and
the Popover API has a known nested-popover gap that we backfill ourselves.

### Keyboard versus pointer activation (Safari)

Restoration returns focus to whatever was focused when the overlay opened. On the keyboard path
(focus the trigger, then Enter) that is the trigger, so close returns focus to the trigger in
Chrome, Firefox, and Safari alike (verified against WebKit 26 and real Safari 26.5).

Safari, and Firefox on macOS, do not focus a `<button>` on a pointer click, so a mouse-opened
overlay has no trigger focus to restore and focus is left on `<body>` on close. This is native
behavior for both `<dialog>` and `[popover]`. Chrome, and Firefox on other platforms, focus the
button on click, so they restore to the trigger for pointer activation too. We lean into the
platform here rather than normalizing it.

Practical consequence for tests: exercise restoration by opening via the keyboard (focus the
trigger, then Enter), not `trigger.click()`, which never focuses the trigger on Safari.

### Dialog (`<dialog>.close()`) — always restores

`<dialog>.close()` **unconditionally** restores focus to the element that was focused before
`showModal()` was called — regardless of how the close was triggered:

| Dismissal method       | Focus restored? |
| ---------------------- | --------------- |
| **Escape**             | ✅ Yes          |
| **Backdrop click**     | ✅ Yes          |
| **Programmatic close** | ✅ Yes          |

This is because all three paths end with `dialog.close()`, and the
[dialog close algorithm](https://html.spec.whatwg.org/multipage/interactive-elements.html#close-the-dialog)
always restores focus. Backdrop clicking a modal dialog is a "dismiss this overlay" gesture — the
user didn't click on a specific element behind it (the backdrop blocks interaction), so restoring
focus to the trigger is the correct behavior.

### Popover (`hidePopover()`) — conditional restoration

The Popover API's restoration depends on the dismissal method, a saved restoration target, and focus
remaining inside the popover:

### Browser behavior by dismissal method

| Dismissal method                  | `focusPreviousElement` | Focus restored to trigger?      |
| --------------------------------- | ---------------------- | ------------------------------- |
| **Escape**                        | `true`                 | ✅ Yes                          |
| **Click-outside** (light dismiss) | `false`                | ❌ No — focus stays where it is |
| **Programmatic `hidePopover()`**  | `true`                 | ✅ Yes                          |
| **Another auto popover opens**    | `false`                | ❌ No                           |

### The `previouslyFocusedElement` mechanism

For the first popover in an auto/hint stack, `showPopover()` saves the previously focused element.
The table above describes whether each dismissal method requests restoration, not whether it
necessarily occurs. The hide algorithm also requires focus to remain inside the popover.

This restoration happens **synchronously during the hide algorithm**, before the `toggle` event
fires, but after the closing `beforetoggle` event. Our closed `toggle` handler therefore observes
the result of native restoration.

### Why click-outside does NOT restore focus

The HTML Popover spec's light dismiss algorithm explicitly passes `focusPreviousElement=false`. This
is intentional: click-outside is a dismissal gesture where the user clicked on something else. The
browser preserves the user's click context rather than yanking focus back to the trigger.

This is the correct behavior per WCAG — the click event still fires on the clicked element, and
focus stays where the user intended.

A manual popover closes through `isOpen={false}`, which our fallback treats as a programmatic close.
So `useManualLightDismiss` blurs focus that an outside press left inside the popover before it calls
`onClose`, and the close does not return focus, as with native light dismiss.

### Why Dialog and Popover differ on light dismiss — and why that's correct

This asymmetry is a deliberate platform decision that we lean into, not a bug:

- **Dialog backdrop click**: The `::backdrop` is an opaque overlay that blocks interaction with the
  page. Clicking it is a "dismiss this modal" gesture — the user didn't click on a specific element
  behind the dialog. Restoring focus to the trigger preserves the user's context.

- **Popover click-outside**: Popovers don't block the page. Clicking outside is an "I want to
  interact with something else" gesture. The browser preserves the user's click target rather than
  yanking focus back to the trigger, which respects the user's intent.

### Nested popovers: native behavior and our fallback

The [show popover algorithm](https://html.spec.whatwg.org/multipage/popover.html#show-popover) (step
15.8) enables native restoration only for the first popover in an auto/hint stack. Nested popovers
do not save a native restoration target. This is specified behavior, not a Firefox-specific bug.

Without our fallback, closing a submenu can leave focus on the document body instead of its trigger
in the parent menu. The fallback also supports manual popovers, which do not save a native
restoration target.

#### Preserve focus moved elsewhere

The
[hide popover algorithm](https://html.spec.whatwg.org/multipage/popover.html#hide-popover-algorithm)
(step 20.2) restores only when restoration is requested and focus is still on the popover or a
shadow-including descendant. It does not scroll the viewport.

We let the browser restore focus first, then apply our fallback. We track focus across opening and
closing to avoid overriding focus moved elsewhere:

1. **Before open:** Remember the focused element so we can return focus to it on close. The target
   is never inside the popover: when focus is already inside (StrictMode shows the popover again
   after its content moved focus in, or it reopens during its close), keep the earlier target.
2. **Before close:** Skip custom restoration if the close is a light dismiss or focus is already
   outside the popover.
3. **After native restoration:** Otherwise, check focus in the closed `toggle` handler. If focus is
   inside the popover or on the document body, return it to the element focused before opening.
   Leave focus on any other element alone, including a parent menu item or replacement popover.

The body fallback accounts for focus lost when the popover becomes hidden. Checking focus before
close prevents it from reclaiming focus that was already on the body. Restoration does not depend on
role or whether focus entered automatically.

Focus that the content lost (a removed, disabled or hidden element) is already on the body, so the
close leaves it there. No layer moves lost focus, while open or at the close. See
[`../decisions/focus-loss-recovery.md`](../decisions/focus-loss-recovery.md).

#### Verified browser timing

Testing on 15 September 2026 covered native-only Escape and `hidePopover()` closes for outermost and
nested auto popovers in Chromium 143, Firefox 144.0.2, and WebKit 26.0. All 12 cases passed.

In every case, focus remained inside during both closing `beforetoggle` listeners. For outermost
popovers, native restoration followed those listeners and preceded closed `toggle`.

A microtask queued in `beforetoggle` is not a reliable post-restoration checkpoint:

- **Escape:** Chromium and WebKit ran the microtasks before restoration; Firefox ran them after.
- **Programmatic close:** All three restored before `hidePopover()` returned and before the
  microtasks ran.

Nested popovers did not restore to their trigger. Focus temporarily remained on the hidden child,
then fell to body. That focus loss could occur before or after `toggle`, which is why the fallback
accepts either inside focus or body focus.

#### Consumer behavior

Consumers do not need to restore focus to the trigger. Native restoration runs first; our fallback
runs before `onClose`. Click-outside dismissal leaves focus to the browser.

Consumers should not unconditionally restore focus in `onClose`: doing so can override focus moved
elsewhere or return focus to the trigger after click-outside dismissal.

### When custom focus handling IS needed

The only case where custom focus code is appropriate is when an action needs focus on a **different
element** than the trigger, for example because the action removes the trigger. The consumer moves
focus in the action's handler, or the new element uses `autoFocus`. Focus that has left the layer is
not moved back. `dropdown-menu`'s `returnFocusRef` is a no-op on this path
(`migrations/dropdown-menu-migration.md`).

Native restoration and the internal fallback finish before `onClose` is called. Consumers can focus
their chosen destination synchronously in `onClose`. No delay, such as `requestAnimationFrame`, is
needed to wait for restoration.

---

## Role-to-behavior summary

### By role (Popover primitive)

Restoration is independent of role. The restoration columns assume focus entered the popover and has
not moved elsewhere; a tooltip that receives focus through interaction is eligible too.

| Role            | Initial Focus           | Focus Wrapping              | Restoration (Escape, outermost)   | Restoration (Escape, nested)               | Restoration (click-outside) |
| --------------- | ----------------------- | --------------------------- | --------------------------------- | ------------------------------------------ | --------------------------- |
| `dialog`        | First focusable element | Tab wraps within content    | ✅ Browser restores               | ✅ Popover internal fallback               | ❌ No restoration           |
| `alertdialog`   | First focusable element | Tab wraps within content    | ✅ Browser restores               | ✅ Popover internal fallback               | ❌ No restoration           |
| `menu`          | First menu item         | No Tab wrapping (Tab exits) | ✅ Browser restores               | ✅ Popover internal fallback               | ❌ No restoration           |
| `listbox`       | First/selected option   | No Tab wrapping (Tab exits) | ✅ Browser restores               | ✅ Popover internal fallback               | ❌ No restoration           |
| `tree` / `grid` | Not yet implemented     | No wrapping                 | ✅ Browser restores               | ⚠️ Fallback runs but `useInitialFocus` gap | ❌ No restoration           |
| `tooltip`       | No focus change         | No wrapping                 | ❌ No restoration (nothing moved) | ❌ No restoration (nothing moved)          | ❌ No restoration           |

### Dialog primitive (`<dialog>.showModal()`)

| Concern           | Behavior                                                                    |
| ----------------- | --------------------------------------------------------------------------- |
| Initial focus     | Native `showModal()` algorithm: `[autofocus]` element, or first focusable   |
| Focus wrapping    | `useFocusWrap` hook — Tab cycles within content (overrides native body hop) |
| Focus restoration | Always restores to trigger — Escape, backdrop click, and programmatic close |

---

## Contrast: Dialog vs Popover

| Concern            | Dialog (`<dialog>`)               | Popover (`<div popover>`)                        |
| ------------------ | --------------------------------- | ------------------------------------------------ |
| **Initial focus**  | Native `showModal()` — consistent | `useInitialFocus` hook — fills a Popover API gap |
| **Focus wrapping** | `useFocusWrap` hook               | `useFocusWrap` hook (same)                       |
| **Focus restore**  | Native `dialog.close()` — always  | Native Popover API — conditional on dismiss type |

Initial focus is the only area where the two primitives use different strategies: Dialog relies on
native `showModal()` (which is consistent across browsers), while Popover requires the custom
`useInitialFocus` hook because `showPopover()` does not auto-focus without `autofocus`.

Focus restoration differs in behavior on light dismiss: `dialog.close()` always restores (backdrop
click is a dismiss gesture against an opaque overlay), while the Popover API deliberately does not
restore on click-outside (the user clicked on something else). See
[Why Dialog and Popover differ on light dismiss](#why-dialog-and-popover-differ-on-light-dismiss--and-why-thats-correct)
above.

## Spec references

- **HTML Living Standard — Popover API**: https://html.spec.whatwg.org/multipage/popover.html
  - Show algorithm: captures `previouslyFocusedElement`
  - Hide algorithm: conditionally restores via `focusPreviousElement` parameter
  - Light dismiss: passes `focusPreviousElement=false`
  - Close watcher (Escape): passes `focusPreviousElement=true`
- **WCAG 2.4.3 Focus Order**: focus order must preserve meaning and operability
- **WAI-ARIA APG Dialog pattern**: focus returns to the invoking element on close

## Browser support

The fallback is not a browser-specific workaround. The native restriction to the first popover in an
auto/hint stack comes from the HTML specification. Package browser tests cover native restoration,
nested restoration, and focus transfers before and during close.

## Related files

- `src/internal/use-focus-wrap.tsx` — focus wrapping hook
- `src/internal/use-initial-focus.tsx` — initial focus hook
- `src/internal/role-types.tsx` — role types
- `src/popover/popover.tsx` — Popover primitive (owns nested-popover focus restoration fallback via
  `beforetoggle` snapshot)
- `examples/130-testing-native-focus-restoration.tsx` — outermost native restoration fixture
- `examples/140-testing-nested-focus-restoration.tsx` — nested restoration fixture covering
  dialog/alertdialog/menu/listbox/tooltip roles
- `__tests__/playwright/native-focus-restoration.spec.tsx` — outermost browser tests
- `__tests__/playwright/nested-focus-restoration.spec.tsx` — nested browser tests (Escape /
  programmatic / click-outside per role, Chromium + Firefox)
