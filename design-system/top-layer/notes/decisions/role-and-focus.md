# Role and focus are a package deal

> Why the popup `role` alone decides whether opening moves focus, why `@atlaskit/popup`'s
> `autoFocus` has no effect on the top-layer path, and how `autoFocus` goes away.

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
use `dialog`, `alertdialog`, `menu` or `listbox`. `setInitialFocusRef` still wins over the role
default. The legacy path (flag off) does not change.

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

The runtime still passes the setter for every role. DS internals that need it on the legacy path
read it through an internal cast (`DropdownMenu`) or an explicit `role={undefined}`
(`avatar-group`). Entry-points `PopupTrigger` passes the setter for every role through one internal
cast; its own load focus (on the container while loading, then into the content) does not change.
Teams `PopupTriggerWithHover` passes the setter for every role: through the dialog signature with no
role or a dialog role, through an internal cast with another role. The casts go at the flag cleanup.

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
