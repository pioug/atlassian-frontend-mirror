# Controlled wrappers ask first on close

> Why `Popup`, `PopupContent`, `DropdownMenu`, `PopupSelect` and `InlineDialog` render a `manual`
> popover with ask-first light dismiss on the top-layer path, as `Dialog` asks first. What this
> changes for the native `auto` behaviours that the wrappers used, and the edges we accept.

## Status

**Decision recorded 2026-11-03** (user decision, item 2 of the 3 Nov list). Implemented in the
wrappers, behind `platform-dst-top-layer` (the top-layer files render only with the gate on).
`useManualLightDismiss` asks about an outside press after its `click`. A `manual` `Popover` returns
focus and hides the popovers inside it as it hides (see below). These are not gated, as the rest of
`@atlaskit/top-layer` (its callers are behind flags). Spotlight and Jira page surfaces also use the
hook; their tests cover the outside press.

**Amended 2026-11-09** (user decision): `Popup` `shouldReturnFocus={false}` is a no-op again on this
path. See "Focus return" below.

**Amended 2026-11-18:** the wrapper focus return matches the native return of an `auto` popover
only: it returns focus to the opener when focus was in the popup. It does not fall back to the
trigger, and it does not move focus that was already lost: once the browser has moved focus (for
example to `<body>`), no layer moves it back. An Escape from inside a popup reaches the
`useManualLightDismiss` listener on the document, as for every manual popover: there is no host
claim.

**Amended 2026-11-20** (user decision): `Popover` with `mode="manual"` fills the gaps of `manual`
compared with `auto` itself, so no consumer can forget a hook: it returns focus after the commit
that hides it, and hides the open popovers inside it. Before, a copy of a focus-return hook in each
wrapper package did the first, and `useManualLightDismiss` did the second. A return inside the
commit (at `hidePopover()`) was tried first and dropped: it broke a close and reopen during the exit
animation in Chromium, Firefox and WebKit, and moved focus in the middle of React's commit.

## The problem

A native `auto` popover closes itself on a press outside it and on Escape (light dismiss). The
browser fires `beforetoggle` for the close, but the close cannot be canceled. The wrappers then call
`onClose` (or `onOpenChange`) after the popover has closed.

A consumer that controls `isOpen` can refuse a close: it keeps `isOpen` `true`. The legacy path
supports this, because every legacy wrapper only asks (`onClose` is a request). On the `auto` path
the popover is closed anyway, while the consumer thinks that it is open. `Popover` stays closed
until `isOpen` changes, and the trigger still has `aria-expanded="true"` (see
[`../follow-ups/dialog-native-close-isopen-desync.md`](../follow-ups/dialog-native-close-isopen-desync.md)).

Evidence (3 Nov, with the gate on in every test):

- `@atlassian/conversation-assistant` `MultiActionTitleDropdown` (hover to open, `useHoverToOpen`).
  It refuses the close from a click on the trigger while the pointer is on it. On `auto`, the press
  on the trigger is outside the menu, so the browser closed the menu before the click. Its test
  "keeps the menu open when the trigger is clicked while hovered" failed.
- Jira `issue/quick-add` `QuickAddItemsCompact` and `issue-navigator/actions-pluggable-items` tests.
  Their menus are open from a fixed prop, and the tests had to change to work around the close.
- Jira `portfolio-3` dependency-line and view-settings popups refuse an outside press in `onClose`
  (while a line is selected, or while `isDialogLocked`).

## Decision

**Ask first, close second.** On the top-layer path, a DS wrapper whose consumer controls `isOpen`
and gets `onClose` treats `onClose` as a request, as `Dialog` does
([`dialog-close-flow.md`](./dialog-close-flow.md)).

- The wrapper renders `popover="manual"` and uses `useManualLightDismiss`.
- **Outside press:** a pointer press that starts and ends outside the popup and its trigger calls
  `onClose` with the same arguments as before (reason `light-dismiss`, a `MouseEvent`), after the
  press's own `click` (see [When an outside press asks](#when-an-outside-press-asks)).
- **Escape:** the topmost layer takes it, and calls `onClose` (reason `escape`, a `KeyboardEvent`
  with `key: 'Escape'`). The rules of
  [`manual-light-dismiss-escape-stacking.md`](./manual-light-dismiss-escape-stacking.md) apply: one
  press closes one layer, and a claimed Escape is skipped. Handlers around the popup can see the
  Escape before the close, as on the legacy path.
- **The layer hides only when `isOpen` becomes `false`.** If the consumer keeps `isOpen` `true`, the
  layer stays open and visible, focus does not move, and the Escape is still taken (a layer that
  stays open keeps the layers below it open).
- **The trigger counts as inside.** A press on it does not ask. The trigger's own click decides, as
  on the legacy path: `DropdownMenu` and `PopupSelect` toggle, and a `Popup` or `InlineDialog`
  trigger does what the consumer's handler does.
- **Tab in `DropdownMenu` asks too.** Tab asks every menu in the stack to close, innermost first, in
  one `flushSync`. If the root menu closed, focus is on the root trigger before the browser moves
  it, so Tab moves on from the trigger, as before.
- `requestClosePopovers()` asks, as before.
- When the consumer accepts, the result is the same as on the `auto` path: the same close reasons
  and events, the popup hides before the click of the press, and focus goes to the same place.

Tooltip (`hint`) stays native. It owns its open state, and nothing can refuse its close.

### Per wrapper

| Wrapper                                 | Before                     | Now                                        |
| --------------------------------------- | -------------------------- | ------------------------------------------ |
| `Popup`                                 | `auto` (default)           | `manual`, asks first                       |
| `Popup mode="manual"`                   | `manual`, asks first       | No change                                  |
| `PopupContent` (compositional)          | `auto`                     | `manual`, asks first                       |
| `DropdownMenu`, nested menus included   | `auto`                     | `manual`, asks first (also on Tab)         |
| `PopupSelect`                           | `auto`                     | `manual`, asks first                       |
| `InlineDialog`                          | `auto`                     | `manual`, asks first                       |
| `Spotlight`                             | `manual`, asks first       | No change                                  |
| Select and DatePicker/TimePicker menus  | `manual`, Select asks      | No change: `react-select` owns the open    |
| `AvatarGroup` overflow menu             | `auto`                     | No change: see below                       |
| Tooltip                                 | `hint`                     | No change                                  |
| `FlagGroup`, InlineEdit error, `Popper` | `manual`, no light dismiss | No change: they stay open until state says |

`AvatarGroup` stays `auto`. Its open state is internal, its close handler always sets it to `false`,
and no consumer gets `onClose`. Nothing can refuse, so `auto` gives the same result with less code.

Uncontrolled `DropdownMenu` and `PopupSelect` (no `isOpen` prop) always accept, so they behave as
before.

`Popup` without `onClose`:

- Default mode: an outside press and Escape ask nobody, so the popup stays open, and it takes the
  Escape. The legacy popup did the same (its close manager called `onClose?.()`, and the layering
  kept the layers below it open).
- `mode="manual"`: as before, it does not light dismiss and does not take Escape. It stays open
  until state says (for example a field error).

So on the top-layer path, `mode` matters only for a `Popup` without `onClose`.

`InlineDialog` without `onClose` does not light dismiss and does not take Escape, as on the legacy
path (CI round 7: a Jira validation hint in an `InlineEdit` took the Escape, so the edit did not
cancel). `hasOpenDialogOrPopover()` does not count it.

### Why in the wrappers

- The primitives already have the parts. `useManualLightDismiss` is the ask-first light dismiss for
  a `manual` popover (outside press, Escape stack), and `Popover` returns focus for every mode.
- [`dialog-native-close-isopen-desync.md`](../follow-ups/dialog-native-close-isopen-desync.md) says
  to leave `Popover` alone: Tooltip vetoes a light dismiss and shows itself again natively.
- Whether a close can be refused is a wrapper contract (a controlled `isOpen` with `onClose`).
  `Popover` does not know it.

## What changes for the `auto` behaviours we used

| `auto` behaviour                                       | Now                                                                                                            |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Light dismiss on an outside press                      | `useManualLightDismiss`: same rule (start and end outside, any button, capture phase), asked after the `click` |
| Escape closes the topmost popover                      | `useManualLightDismiss`, same stack                                                                            |
| A press inside a nested popover keeps its parents open | Same: "inside" is DOM containment, and layers render in place                                                  |
| One outside press closes every popover it is outside   | Same: each layer asks for itself                                                                               |
| Opening an `auto` popover closes the others            | Gone (see below)                                                                                               |
| `showModal()` closes the open `auto` popovers          | Gone (see below)                                                                                               |
| Hiding a popover hides the `auto` popovers inside it   | Same: a `manual` `Popover` hides the open popovers inside it as it hides (see below)                           |
| Native focus return on Escape or a close from `isOpen` | `Popover` returns focus after the commit that hides the popover (see below)                                    |
| Light dismiss returns no focus                         | Same: the hook marks its request, and `Popover` returns no focus for that close                                |
| `onClose` in the `toggle` task after the press         | `onClose` after the press's `click` (outside press) or in the `keydown` (Escape)                               |

### Another layer that opens does not close the popup

An `auto` popover that opened closed the other `auto` popovers that were not its ancestors. A
`manual` popover is not in that stack. A layer that opens without a press (by keyboard, hover or
code) leaves an open wrapper popup open, so two can be open. Escape closes the later one first. A
press on the trigger of another layer is an outside press, so the first layer asks to close, as
before.

The legacy path did not close a popup when another layer opened either.

### A modal dialog that opens does not close the popup

`showModal()` closed the open `auto` popovers. Now a modal that opens while a popup or menu stays
open (an item that keeps its menu open, a button in a popup that does not close it) leaves the popup
open behind the modal. When the modal closes, it returns focus to its opener in the popup. The
legacy path did the same.

A press in a modal that renders outside the popup (not inside it in the DOM) is an outside press for
the popup, so the popup asks to close then. A modal that renders in the popup is inside it.

### When an outside press asks

**Updated 2026-11-03 (CI round 7).** The first version asked at `pointerup`, when native light
dismiss decides. That is earlier than the `auto` path told its owner (the `toggle` task, after the
`click`), and earlier than the legacy layers closed (`click`). Owners that act on the answer before
the `click` broke:

- **Click-through.** An owner that renders a blanket while the popup is open removed it before the
  `click`. In a browser, the `click` then lands on the element under the blanket (for example a
  page-tree row), and the handlers on the blanket's path do not run (Confluence
  `ContextualCreateContentPopover`).
- **`click` handlers around the press.** A form that checks, in a capture `click` listener, whether
  its picker is open saw it closed, and cancelled (Jira inline issue create).
- **An element that opens the popup on its own press** (an element that is not the trigger) closed
  it at `pointerup`, then opened it again at `mouseup` or `click` (editor AI definitions keywords).

So `useManualLightDismiss` still decides at `pointerup`, but asks after the `click`:

- It asks as the press's `click` reaches the window (in a microtask, so the updates of the `click`
  handlers commit first), in `flushSync`, as the legacy layers closed from a `click` listener on the
  window. Every handler on its path has run, with the popup still open. The DOM changes after the
  `click`, so nothing clicks through. Tests that click outside and check at once pass, as on the
  legacy path (19 Nov CI: 12 Jira test files failed when the hook only asked in a task).
- When no `click` reaches the window (a handler stopped it, or a press with another button), it asks
  in a task after the press. A mouse sends the `click` in the same task as `pointerup`, so the task
  is after the `click`.
- Touch and pen: the `click` of a tap can come in a later task, so it waits for the `click` and asks
  after it, as for a mouse. A tap with no `click` does not ask, as the legacy layers, which closed
  from `click`. The next press decides. Asking at the next press would close the layer before that
  press's `click`, which could then land on the element under it.
- It does not ask when the popup closed in the meantime. So a shared "one menu open" state (Jira
  QuickAdd) closes the first menu and opens the second one from the `click`, and the first menu is
  not asked.
- One press still asks every layer it is outside. The drag, touch scroll and keyboard `click` rules
  do not change.

An element that opens or toggles the popup in its own `click` handler (not the trigger) no longer
closes it at `pointerup` and opens it again at `click`. Its handler runs first, then the popup asks:
a toggle closes the popup (the ask is skipped, because it is closed), and an element that only opens
it ends with the popup closed, as on the `auto` path and the legacy path. A consumer with a second
toggle gives the popup that element as a trigger, or handles the close in `onClose`. An
`aria-controls` that lists the popup does not make it inside (19 Nov review: native and legacy treat
that press as an outside press).

### Inner popovers when an outer one hides

When an `auto` popover hid, the browser hid the `auto` popovers inside it in the same step. A
`manual` popover inside it stayed open, and took the next Escape, until the outer popover's content
unmounted after its exit animation (Jira timeline-table meatballs menu: the nested "Move" popup took
the Escape, and focus did not return to the cell).

So as a `manual` `Popover` hides, it hides the open popovers inside it, innermost first, in the same
step. Each inner `Popover` tells its owner through `onClose` (reason `light-dismiss`). The owner
cannot keep it open: the layer around it has closed. A modal `<dialog>` inside is left alone: it
makes the page around it inert, so the popup cannot close from a press or Escape while it is open.

### Focus return

`hidePopover()` on a `manual` popover returns no focus natively. `Popover`'s fallback returns focus
to the opener in the closed `toggle` task, which is later than the native return.

So a `manual` `Popover` returns focus as it hides, with focus in it (an Escape, or a close from
`isOpen`), for every owner: `Popup`, `PopupContent`, `DropdownMenu`, `PopupSelect`, `InlineDialog`,
Spotlight. Focus goes to the opener (the element that had focus when the popup opened), when it is
outside the popup and takes focus. This is the native target, and the only one: when the opener is
`<body>` or gone, focus stays where the browser puts it, as for an `auto` popover.

It runs in a microtask after the commit that hides the popover, not in the commit: React drops the
focus events that the browser sends during its commit (so `onFocus` handlers around the trigger do
not run), and the blur and change handlers of the element that loses focus would run in the middle
of the commit (CI round 7: avp `row_limit` tests, agent-session-card). Waiting returns live in
`internal/manual-hide/pending-focus-returns.tsx`, one per popover.

Every top-layer layer shows through `useSyncNativeOpen`. Just before it shows a layer, it cancels
the waiting return of that layer (a reopen during the exit animation, or a StrictMode re-show: focus
stays inside), then runs the other waiting returns. So a layer that opens in the same commit (a
modal dialog that a menu item opens) records the element that focus returned to as its opener, as
before. (20 Nov review: this replaced a capture `beforetoggle` listener on the document, which also
depended on `<dialog>` firing `beforetoggle`.) A removed popover returns no focus, as native removal
returns none. The fallback in the `toggle` task finds no target after the return.

Tab in `DropdownMenu` hides the menus that accept in `flushSync`, in the `keydown` listener of
`useArrowNavigation`. The hook then runs the waiting focus returns at once, so focus is back on the
root opener before the browser acts on the Tab, as after the native return. A key from the user gets
a microtask checkpoint as the listener returns, but a key sent from script gets none before the Tab
default action: Playwright sends keys to Firefox from privileged script (`nsITextInputProcessor` in
its Juggler driver), and user-event dispatches them from JS (20 Nov: the Firefox Tab-exit specs
failed without this, Chromium passed). `manual-menu-tab-exit.spec.tsx` (top-layer) and the
`DropdownMenu` Tab-exit specs check it in three browsers.

A light dismiss returns no focus, as native light dismiss does: `useManualLightDismiss` marks the
popover while the owner's answer commits (in `flushSync`), and `Popover` skips the return for that
close. The hook no longer blurs focus that the press left inside (20 Nov review): with the mark the
blur was redundant, and it threw focus out of a popup whose owner refused the close. An owner that
closes later, after a press that did not move focus (its `mousedown` called `preventDefault()`),
gets the focus return of a close from `isOpen`.

`Popover` records the opener in the `beforetoggle` of the show, before content effects and initial
focus move focus in.

`Popup` `shouldReturnFocus={false}` is a no-op on this path (user decision, 2026-11-09). The wrapper
only emulates the native return of an `auto` popover, so it keeps the platform contract, and the
native return has no opt-out. A consumer that wants another target moves focus before or as the
popup closes (for example in `onClose`). The return acts only when focus has no place: in the popup
or on `<body>`. This reverses a 3 Nov lead call that made `false` stop the return, as on the legacy
path. That call took focus return away from about 50 callsites that pass `false`.

## Accepted edges

- **A tap whose `click` never comes** (a handler prevented it) does not close the layer. The next
  press outside does, after its own `click`.
- **An inner popover whose owner refuses its close.** When the outer popover closes, `Popover` hides
  the open popovers inside it natively, and each owner gets `onClose`. An owner that keeps `isOpen`
  `true` is out of sync with the native state (see
  [`../follow-ups/dialog-native-close-isopen-desync.md`](../follow-ups/dialog-native-close-isopen-desync.md)).
  It shows only if the outer content stays mounted after the close and opens again: the inner
  popover then stays hidden until its `isOpen` changes. The DS wrappers unmount their content after
  the exit animation.
- **A wrapper popup and another `auto` popover can be open together** (for example an `AvatarGroup`
  overflow menu opened by keyboard). See above.
- **A consumer that never sets `isOpen` `false`** keeps the layer open for every outside press and
  Escape, as on the legacy path. Use `mode="manual"` without `onClose` for a popup that must not
  take Escape.
- **An opener that is `<body>` or gone at close** (the trigger did not take focus on press, for
  example legacy `@atlaskit/button` or a Safari click; the popup opened at mount; or the opener was
  an item of a menu that closed since): no focus return, as for an `auto` popover. The legacy path
  focused the trigger. This decision does not change it.
- **Tab in `DropdownMenu` asks only `DropdownMenu` menus.** The menu stack is every
  `[popover][role="menu"]` around the focused item, but only a `DropdownMenu` can be asked. A root
  menu that is not a `DropdownMenu` (for example a product `Popover` with `role="menu"` around a
  nested `DropdownMenu`) stays open, and Tab moves on from where focus is.

## Related fixes on this branch

- **One key acts on one menu level** (`useArrowNavigation`, `@atlaskit/top-layer`). A menu skips a
  key that a nested menu already acted on (`defaultPrevented`). Without it, an ArrowLeft in a nested
  menu also closed the menu around it: the nested menu's close returns focus to its trigger, in the
  menu around it, in a microtask after its commit, before the outer menu's listener runs
  (`dropdown-menu-nested-focus-timing.spec.tsx`, Chromium and WebKit). With `auto`, the browser
  restores focus only for the first popover in the stack, so a nested `auto` menu got `Popover`'s
  fallback in the `toggle` task, after the key.
- **A click on a `DropdownMenu` group title does not close the menu.** The title has
  `role="menuitem"` and `aria-hidden` (`GroupTitle`). The legacy menu closes only for its registered
  items. Found while writing the browser tests.

## Consumers it fixes

- Jira `portfolio-3` dependency-line and view-settings popups refuse an outside press in `onClose`
  (while a line is selected, or while `isDialogLocked`). The refusal now works on the top-layer
  path.
- A `DropdownMenu` or `Popup` that a consumer keeps open from a fixed `isOpen` stays open.

## Tests

- Unit: `popup-ask-first-close.test.tsx`, `composable-popup-ask-first-close.test.tsx` (popup),
  `dropdown-menu-top-layer-ask-first-close.test.tsx` (dropdown-menu),
  `popup-select-ask-first-close.test.tsx` (select), `inline-dialog-ask-first-close.test.tsx`
  (inline-dialog). The refusal tests fail on the `auto` path. The tests of an accepted close pin the
  `auto` path's result, and also pass on it.
- Playwright, all three engines: `top-layer/__tests__/playwright/manual-ask-first-close.spec.tsx`
  (example `173-testing-manual-ask-first-close.tsx`): the ask-first model on a `manual` popover with
  `useManualLightDismiss` (refused and accepted outside press and Escape, nested and sibling layers,
  one Escape per layer, focus after each close).
- Playwright smoke tests per wrapper, Chromium in CI: `ask-first-close.spec.tsx` in the
  `ff-testing/platform-dst-top-layer` suites of popup, dropdown-menu, select (`popup-select`) and
  inline-dialog. Their examples have Workbench entries in `examples/testing/`, which the CI bundler
  needs.
