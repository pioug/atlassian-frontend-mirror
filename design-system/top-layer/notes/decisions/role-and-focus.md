# Role and focus are a package deal

> Why the popup `role` alone decides whether opening moves focus, why `@atlaskit/popup`'s
> `autoFocus` has no effect on the top-layer path, how `autoFocus` goes away, and how the role
> decides whether a nested layer is part of an outer dialog's Tab order.

## Status

**Decision recorded 2026-10-13.** Behind `platform-dst-top-layer`. Implemented in
`src/internal/use-initial-focus.tsx` (`Popover`) and in `@atlaskit/popup`'s `popup-top-layer.tsx`
and `compositional/popup-content-top-layer.tsx`. It replaces a short-lived internal `Popover`
option, `initialFocus: 'role' | 'none'`, that `autoFocus={false}` mapped to. That option is removed.

## Rule

A popup that does not take focus must not claim a focus-moving role. A focus-moving role always
takes focus.

| Role                    | On open                                               |
| ----------------------- | ----------------------------------------------------- |
| `dialog`, `alertdialog` | `[autofocus]` element, or the first focusable element |
| `menu`                  | First menu item                                       |
| `listbox`               | Selected option, or the first option                  |
| No role, any other role | Focus stays where it is                               |

Details of each target are in [`../architecture/focus.md`](../architecture/focus.md#initial-focus).

### The combobox exception

If a focused combobox or text field controls the popup (its `aria-controls` or `aria-owns`
references the popup), focus stays on that field. APG lets a combobox control a `listbox`, `grid`,
`tree` or `dialog` popup, and DOM focus stays on the combobox. The same check
(`isComboboxControllingPopup`) runs for `menu`, `listbox`, `dialog` and `alertdialog`.

For `dialog` and `alertdialog` the field must be **outside** the dialog. A dialog that contains its
own combobox still takes focus. Without this guard, a combobox inside the dialog whose
`aria-controls` points at a listbox inside the dialog matches the check and stops the dialog from
taking focus. This is why the carve-out is per role, not hoisted above all roles.

## `autoFocus` on `@atlaskit/popup`

On the top-layer path, `autoFocus` has no effect on initial focus. To keep focus where it is, do not
use `dialog`, `alertdialog`, `menu` or `listbox`. For those roles, `setInitialFocusRef` still wins
over the role default. The legacy path (flag off) does not change.

`DropdownMenu`, `InlineDialog`, `PopupSelect`, `avatar-group` and `spotlight` already worked this
way on the top-layer path. Popup now matches them.

## `setInitialFocusRef` is dialog-only

**Decision recorded 2026-10-13.** A major release of `@atlaskit/popup`, types only (no runtime
check). `setInitialFocusRef` is in the `content` args (classic `Popup`) and the `children` args
(composable `PopupContent`) only when `role` is `'dialog'` or `'alertdialog'`. `ContentProps` has no
setter; `DialogContentProps` adds it. `Popup` and `PopupContent` have two call signatures, the
dialog one first, so a `string` role, a role that can be another role, `menu`, `listbox` or no
`role` prop gets no setter. Until the `platform-dst-top-layer` cleanup, the dialog signature also
takes `undefined` (`role` is required), so a role gated on the flag keeps the setter and nothing
changes with the flag off. Consumers add the gated role and a name by hand (no codemod).

Why:

- **Only a dialog lets the author choose.** The APG dialog and alert dialog patterns ask the author
  to pick the initial target (the least destructive action, or a heading for long content).
- **Other roles have a fixed rule.** A menu focuses its first item and a listbox its selected
  option. A custom target can only repeat the rule or break it, and `Popover` already applies it.
- **No role means no focus move.** If content must take focus when it opens, it is a dialog: give it
  `role="dialog"` and a name. A hover card must not take focus, so it loses the setter.

The runtime still passes the setter for every role, but on the top-layer path its target takes focus
only for a role that moves focus (see the next section). DS internals that need it on the legacy
path read it through an internal cast (`DropdownMenu`) or an explicit `role={undefined}`
(`avatar-group`). Entry-points `PopupTrigger` passes the setter for every role through one internal
cast; its own load focus (on the container while loading, then into the content) does not change.
Teams `PopupTriggerWithHover` passes the setter for every role: through the dialog signature with no
role or a dialog role, through an internal cast with another role. The casts go at the flag cleanup.

### Popup hands the target to `Popover`

**Decision recorded 2026-10-21.** Popup stores the setter's target in a ref and passes it to
`Popover` as `initialFocusRef`. `useInitialFocus` focuses it in place of the role default, so focus
moves once. Before, a Popup effect focused the target after `Popover` had focused the role default.

`initialFocusRef` is used only by the roles that move focus: `dialog`, `alertdialog`, `menu` and
`listbox`, in both the types and the runtime. That is wider than Popup's setter (dialog-only)
because `Popover` is a lower-level primitive. It is the first choice in each of those role branches,
after the combobox check, and only when the popover contains it.

This changes behaviour behind `platform-dst-top-layer`. Before, Popup's effect focused the setter's
target for every role. Now a consumer that passes the setter with no role, or with a role that does
not move focus, keeps focus where it is. For example, Teams `PopupTriggerWithHover` passes the
setter with no role. Such a consumer must use `role="dialog"` and a name if its content must take
focus. Popup's `useRoleProps` adds the ref only to the role variants that move focus, so the types
hold the whole way down. See [`../architecture/focus.md`](../architecture/focus.md#initialfocusref).

## Why

- **The role is a promise.** `dialog`, `menu` and `listbox` tell assistive technology that focus is
  in the popup or can be moved there with the pattern's keys. A `menu` that does not take focus
  breaks arrow keys. A `dialog` that does not take focus wraps Tab only after the user tabs in.
- **One input, not two.** With `role` and `autoFocus`, a consumer can ask for a dialog that does not
  behave like one. With `role` only, there is no such state.
- **The real cases have a role fix.** The 34 call sites with a focus-moving role and
  `autoFocus={false}` fall into four groups. Click-opened popups are fine with role focus. Hover
  cards drop the role. Combobox popups use the exception above. Hover-or-keyboard cards should set
  the role only for keyboard opens (guidance; the two mercury cards are a follow-up for that team).

### Rejected: keep `initialFocus: 'none'` for `autoFocus={false}`

It kept the old contract, but it allowed a `dialog` or `menu` role on a popup that does not take
focus. It also added a `Popover` option that only Popup used.

## Removal plan

1. Now: `autoFocus` is `@deprecated` in Popup's types, with a note on the top-layer behaviour.
   Consumers that need focus to stay drop or change the role behind the flag.
2. Flag cleanup, in a major release of `@atlaskit/popup`: remove `autoFocus`, with a codemod that
   deletes the prop. Call sites that pass `autoFocus={false}` with a focus-moving role need a person
   to choose the role.

## Content that asks for focus, and focus only on the open

**Decisions recorded 2026-11-10 and 2026-11-16** (gaps G1 and G2). The role decides the popup's own
initial focus. Content can still ask for focus:

- **React `autoFocus`, or a `focus()` call in a content effect** (a ref callback, a layout effect,
  `componentDidMount`). The layer shows before its content effects, so the call works. The popup's
  initial focus then does nothing, because focus is already inside. This holds for every role.
- **Focus moves only on the open.** A `setInitialFocusRef` target, a `DropdownMenu` item or
  `ModalDialog` content that mounts after the open does not take focus from the layer. Content that
  needs focus later turns the open's focus off with the wrapper's restricted opt-out (Popup
  `UNSAFE__disableInitialAutoFocus`) and moves focus itself.

See [`react-autofocus-and-focus-on-open.md`](./react-autofocus-and-focus-on-open.md).

## Nested layers and Tab: does the layer own its focus?

**Decision recorded 2026-11-02** (Q7 of the flag-on-all-tests report). A focus wrap (`useFocusWrap`,
used by `Dialog` and by a `Popover` with `role="dialog"` or `"alertdialog"`) treats a nested layer
(a `[popover]` or `<dialog>` inside it) by one rule: **does the nested layer own its focus?** A
layer owns its focus when it is a `<dialog>` (implicit role `dialog`) or has `role="dialog"` or
`role="alertdialog"`. These are the roles that turn on `useFocusWrap` (`roleRequiresFocusWrap`). The
rule is `isFocusOwningLayer` in `src/focus/is-focus-owning-layer.tsx`.

| Nested layer                                         | Focus is inside it                  | Outer Tab order (`getFocusables`)   |
| ---------------------------------------------------- | ----------------------------------- | ----------------------------------- |
| Owns its focus (`<dialog>`, `dialog`, `alertdialog`) | Outer wrap steps aside, inner wraps | Left out, with everything inside it |
| Open, other role or no role (`menu`, `listbox`, ...) | Outer wrap handles Tab              | Included, in DOM order              |
| Closed                                               | Cannot hold focus                   | Left out (not rendered)             |

- **Step aside** (`isNestedLayerFocused` with a focus-owning `layerFilter`): the outer wrap leaves
  Tab alone only when focus is inside a nested layer that owns its focus. Any such layer between the
  focused element and the outer layer counts, at any depth. So focus in a menu inside a nested
  dialog leaves Tab to that dialog.
- **Tab order** (`getFocusables`): an element is left out when any layer between it and the outer
  layer owns its focus. Elements of other open nested layers are candidates in DOM order. A closed
  nested layer is left out by its open state (`:popover-open`), always. The visibility check
  (`checkVisibility()`) also leaves its content out where the browser supports it.
- **Result**: Tab enters an open menu or listbox popup, moves through it and leaves it, as in the
  browser's own Tab order. Wrapping is A → B → C → A with no stop on `<body>`, also when the last
  element of the dialog is in an open menu.
- The listener stays in the capture phase. A listener inside the dialog that reads
  `document.activeElement` for a Tab keydown sees the element that the wrap moved focus to. It must
  read `event.target` to get the element that had focus.

Before this decision, every nested layer was left out of the outer Tab order, and the outer wrap
stepped aside for focus in any nested layer. Tab skipped an open menu or listbox popup in a dialog,
and Tab from inside one followed the browser, with a `<body>` stop at the end of a modal dialog.

### Other focus helpers

- **Arrow keys keep to one layer.** `useArrowNavigation` moves within one menu level, so it filters
  its candidates with `isInContainerLayer` (`src/focus/is-in-container-layer.tsx`). Elements in a
  nested layer (an open submenu, a listbox popup in an item) are not arrow-key targets. A caller
  that needs the container's own layer only passes a `filter` that rejects elements in nested layers
  to `getFirstFocusable`, `getLastFocusable` or `getNextFocusable`. `isInContainerLayer` is that
  filter inside this package; it is not a public entry point.
- **A menu closes before the wrap moves focus.** An open menu is now part of a dialog's Tab order,
  so `useArrowNavigation` closes the menu on Tab in the capture phase on the document, before the
  dialog's own capture listener. Closing returns focus to the trigger, and the dialog then moves
  focus on from the trigger. So Tab in a `DropdownMenu` inside a modal closes the menu and focuses
  the next element of the modal, not the trigger and not `<body>`. Outside a dialog, the browser
  moves focus on from the trigger, as before.
- **Initial focus almost never changes.** `useInitialFocus` and the callers of `getFirstFocusable`
  (Popup `setInitialFocusRef` callers, entry-points triggers, account menu) run when a layer opens.
  Nested layers are usually closed then. An open layer that does not own its focus can already be
  inside the dialog, for example the flag group host, which renders inside the topmost open modal.
  It is the last child of the dialog, so it becomes the first element only when the dialog has no
  focusable element of its own.
- **Flags in a modal are in its Tab order.** The flag group host is an open popover with no role,
  inside the topmost open modal. Tab from the last element of the modal moves to the flags, and on
  from the last flag element wraps to the first element of the modal. Pinned in `@atlaskit/flag`'s
  `flag-group-in-modal.tsx`.

### Accepted edges

The browser's own Tab order applies in two cases. Both are pinned in
`__tests__/unit/focus-wrap-nested-layers.test.tsx`.

1. **Focus inside an `<iframe>`.** A keydown in the iframe stays in the iframe's document, so the
   focus wrap cannot see it. If the iframe is the last element of a modal dialog, Tab from inside it
   goes to the browser (a `<body>` stop). The next Tab enters the dialog again, natively, because
   the page outside a modal dialog is inert.
2. **A nested product-built `role="dialog"` layer with no focus wrap** (for example a plain
   `<div popover role="dialog">`). It owns its focus by role, so the outer wrap steps aside inside
   it and leaves its elements out of the outer Tab order. It does not wrap itself, so Tab inside it
   follows the browser. Build such a layer with `Popover` (`role="dialog"`) or `Dialog`, which wrap.

## A Select's input and its in-place menu are one field

**Decision recorded 2026-11-02** (Q7 jira follow-up). On the top-layer path,
`@atlaskit/react-select` renders its menu in place, in a popover with no role. So Tab can move focus
from the input to content in the menu, for example inline buttons or a checkbox. Select treats the
input and the menu as one field for focus:

- **Tab into the menu is not a blur.** The menu stays open and the input keeps its value. Select
  does not call `onBlur` or `onMenuClose`. When focus moves back to the input from the menu, Select
  does not call `onFocus` again.
- **A key on menu content belongs to that content.** Select leaves Enter, Space, Backspace, Delete,
  ArrowLeft, ArrowRight, Tab and typing to the content. So Enter or Space on a button activates the
  button, and does not select an option. Select handles only an option navigation key (ArrowUp,
  ArrowDown, Home, End, PageUp, PageDown) and Escape. Even these keys go to the content when:
  - the content used the key (`defaultPrevented`), for example the DatePicker calendar;
  - the key is in a layer nested in the menu;
  - the key is in an element that uses it itself: a text field, a `<select>`, a `contenteditable`
    element, or an `<input>` such as a radio or range (a checkbox or a button input does not);
  - for a navigation key, there is no option to move to.
- **A navigation key acts as if it was pressed in the input.** Select focuses the input first, then
  moves the focused option.
- **Leaving both closes the menu and blurs.** When focus leaves the input and the menu, Select calls
  `onMenuClose` and `onBlur`, as for a blur of the input. The `onBlur` event is then from the menu
  element that lost focus. A consumer with a controlled `menuIsOpen` must close the menu in
  `onMenuClose`. `blur()` with focus in the menu blurs the field in the same way.
- **A close with focus in the menu returns focus, and the field stays focused.** Select hides the
  menu's popover before it unmounts it, so the popover returns focus to the element that had focus
  when the menu opened: usually the input, or the DatePicker calendar button. If focus falls to
  `<body>` as the menu hides or unmounts, Select focuses the input. Select does not call `onFocus`
  again for focus that comes back to the input this way.

The Select owns this (`select.tsx`), so products do not need their own focus code for it (jira
inline config buttons, field-parent). Pinned in react-select's `focus-in-menu.test.tsx`.

**Known edge: focus lost while the menu stays open.** If the focused content in the menu becomes
disabled or is removed, focus falls to `<body>` with no blur event. Until the menu closes, Select
still treats the field as focused: the control keeps its focus style, and `onBlur` is not called.
When the menu closes, Select sets this right. If focus is still on `<body>`, Select focuses the
input. If focus moved outside the field, Select blurs the field, as for a blur of the input. If
focus moves back to the input before the menu closes, Select calls `onFocus` again with no `onBlur`
before it. With `openMenuOnFocus`, that focus also opens the menu again, so the focused option goes
back to the selected option or the first option. For example, jira's inline config buttons disable a
focused button when the mouse moves to another option. A document `focusin` listener could close
this gap. It is not added now.
