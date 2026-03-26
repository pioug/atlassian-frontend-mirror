# Menu keyboard behavior: design decision

## Question

The popup already bakes in keyboard behavior for `role="dialog"` (Tab wrapping via `useFocusWrap`).
Should it do the same for `role="menu"` — handling arrow keys, Home/End, type-ahead, etc.?

## Decision

**No.** Arrow key navigation and other menu-specific keyboard behavior is intentionally left to the
consumer component (e.g. `dropdown-menu`). The popup layer only provides initial focus placement,
focus restoration, and `aria-haspopup` syncing for menus.

## Rationale

### 1. Menu keyboard behavior is context-dependent

Unlike `role="dialog"` — where Tab wrapping is always the same pattern — `role="menu"` keyboard
behavior varies significantly depending on context:

- **Orientation**: Vertical menus use Up/Down arrows; horizontal menubars use Left/Right arrows.
- **Nesting**: Right/Left arrow behavior differs for flat menus, submenus, and menubar children. In
  a menubar submenu, Right Arrow closes the submenu and moves to the next menubar item. In a
  standalone menu, Right Arrow does nothing on a leaf item.
- **Item type**: `menuitemcheckbox` and `menuitemradio` toggle without closing the menu; plain
  `menuitem` activates and closes.
- **Control context**: A menu opened from a Menu Button behaves differently from a submenu within a
  Menubar.

There is no single "menu keyboard pattern" that the popup could implement generically.

### 2. Menus are composite widgets

The [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within)
classifies menus as **composite widgets** — containers that manage their own internal focus. The
menu component (not the overlay) is responsible for:

- Arrow key navigation between items
- Home/End key navigation
- Type-ahead character matching
- Enter/Space activation (with role-specific behavior)
- Submenu open/close coordination

Tab/Shift+Tab move focus **out** of the menu entirely — they do not navigate between items. This is
already handled correctly by `useFocusWrap` excluding `menu` from focus wrapping.

### 3. All major design systems separate these concerns

Radix, React Aria, Headless UI, and Chakra all implement menu keyboard behavior at the **menu
component layer**, not the popover/overlay layer. The popover handles visibility, positioning, and
generic dismiss. The menu handles keyboard navigation.

### 4. Our own codebase already follows this pattern

`@atlaskit/dropdown-menu` has its own `useArrowNavigation` hook and `FocusManager` that implement
the full menu keyboard pattern. Baking arrow keys into `top-layer` would conflict with that existing
logic.

## What top-layer handles for `role="menu"`

| Behavior                             | Hook                         | Rationale                                                                                       |
| ------------------------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| Initial focus → first focusable item | `useInitialFocus`            | APG: "when a menu opens, focus is placed on the first item"                                     |
| Focus restore → trigger on close     | Native browser (Popover API) | APG: "when menu closes, focus returns to the invoking element"; see notes/architecture/focus.md |
| `aria-haspopup="menu"` on trigger    | `roleToAriaHasPopup`         | WCAG 4.1.2: trigger must declare popup type                                                     |
| No Tab wrapping                      | `useFocusWrap` (excluded)    | APG: Tab exits the menu, not wraps within it                                                    |

## What consumers are responsible for

| Behavior                                             | Reference                                                                                         |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Arrow key navigation (Up/Down, Left/Right)           | [Menu and Menubar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/#keyboardinteraction) |
| Home/End key navigation                              | Same                                                                                              |
| Type-ahead character matching                        | Same (optional)                                                                                   |
| Enter/Space activation                               | Same                                                                                              |
| Submenu open/close coordination                      | Same                                                                                              |
| `menuitemcheckbox` / `menuitemradio` toggle behavior | Same                                                                                              |

## References

- [WAI-ARIA APG: Menu and Menubar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
- [WAI-ARIA APG: Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [WAI-ARIA APG: Keyboard Navigation Inside Components](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within)
