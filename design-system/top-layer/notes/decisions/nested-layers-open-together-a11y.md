# Nested Layers That Open in the Same Commit: Accessibility

**Status:** Decided 2026-11-11 for D11.A (#540946). This note uses desk research of the specs and
guides below. It has no browser or screen reader probe.

## Our position

- Do not design nested layers to open in the same commit (at the same time). Open an inner layer on
  a user action, after its parent has opened.
- One exception: a layer that shows state, for example a field error, can be open when its parent
  opens.
- Our API cannot prevent it: layers compose, so any layer can start open inside another layer.
- React can also show nested layers again in the same commit: a Suspense reveal, or an Activity
  show. This is normal React behavior. A call site can make it rare (see
  [Layers that open in the same commit](#layers-that-open-in-the-same-commit)), but the top layer
  cannot prevent it.
- So we make it work: the inner layer shows on top, and takes its initial focus after its parent.
  This is a defensive fix for React's effect order, not support for the pattern.

Layers that the user opens one after the other are a different case. They are correct and
accessible, and most are good or acceptable UX (see
[Layers that the user opens one after the other](#layers-that-the-user-opens-one-after-the-other)).
Each one opens in its own commit, so the parent has already shown. This worked before the show
order.

## Layers that the user opens one after the other

Each case below, except a dialog over a dialog, is correct only when the inner layer is inside its
parent in the DOM. A layer that is outside a modal dialog in the DOM (for example, in a portal) is
inert while the modal is open, so the user cannot use it (see
[whatwg/html #9936](https://github.com/whatwg/html/issues/9936)). The topmost modal dialog is never
inert, wherever it is in the DOM. `Popover` and `Dialog` render in place, so this holds.

Escape closes one layer per press, the topmost first (see
[outside-press-closes-every-layer.md](./outside-press-closes-every-layer.md)).

### A menu or select in a modal dialog

For example, a `DropdownMenu` or a `Select` in a modal form.

- **Correct:** yes. The menu shows above the dialog, and is not inert, because it is inside the
  dialog.
- **Accessible:** yes. A menu takes focus on its first item (APG menu button). A select keeps focus
  on its input, and moves through the options with `aria-activedescendant` (APG combobox). Escape
  closes the menu, and focus stays in the dialog, on the trigger. The next Escape closes the dialog.
- **UX:** good. Material 1 is the one exception we found: it asks confirmation dialogs to avoid
  "simple menus".

### A submenu

A menu item opens a submenu, and both menus stay open.

- **Correct:** yes. HTML keeps an `auto` popover open when the new one is inside it.
- **Accessible:** yes. APG Menu and Menubar: Enter or Right Arrow "opens the submenu and places
  focus on its first item". Left Arrow closes it "and returns focus to the parent `menuitem`".
  Escape closes the menu that has focus. Tab closes all menus.
- **UX:** acceptable for one level in an action menu, with care. NN/g on contextual menus: "Limit
  the use of submenus", and "If a submenu is needed, make sure that none of its options open yet
  another level of submenus". A submenu can close when the pointer moves away from its item. For
  navigation menus, NN/g says a dropdown "becomes frustrating with two tiers", and suggests a mega
  menu or a landing page. Open submenus on click, not on hover.

### A tooltip in a layer

A tooltip on a button in a dialog or a menu.

- **Correct:** yes. A `hint` popover does not close the `auto` popovers below it.
- **Accessible:** yes, when it meets WCAG 1.4.13 Content on Hover or Focus (AA): the user can
  dismiss it without moving the pointer or focus (Escape), move the pointer over it, and it stays
  until they do. Escape closes the tooltip first, not the dialog.
- **UX:** good.

### A field error in a layer

A `manual` popover with an error message on a field in a layer. For example, the validation error of
`InlineEditableTextfield` (an `InlineDialog`) in a modal dialog.

- **Correct:** yes. A `manual` popover stays open until its state changes. It shows state, so it can
  also be open when its parent opens (see [Our position](#our-position)).
- **Accessible:** yes, when the error is in text and tied to its field (WCAG 3.3.1 Error
  Identification), for example with `aria-describedby`. WCAG 1.4.13 does not require an input error
  to be dismissible. Escape closes the dialog, not the error: a plain `manual` popover does not take
  Escape. A risk: a floating error can cover the next field. If it covers all of a field that takes
  focus, that fails WCAG 2.4.11.
- **UX:** acceptable. Error text next to the field does not cover anything, so prefer it when there
  is room.

### A confirmation over a dialog

For example, "Discard changes?" over an edit dialog.

- **Correct:** yes. The top dialog is the topmost modal, and the dialog below it is inert. When the
  top dialog closes, focus returns to its opener in the dialog below.
- **Accessible:** yes. The APG modal dialog example does this. Escape closes only the top dialog.
- **UX:** a smell. Atlassian: "Don't use dialogs to trigger other dialogs, as this is inaccessible
  and confusing." Carbon and Material say the same (see
  [What design systems say](#what-design-systems-say)). Prefer a confirmation inside the dialog, for
  example a step that replaces its content.

## Layers that open in the same commit

**React shows nested layers again that the user already opened.** This is normal React behavior:

- **Suspense:** a boundary hides content that it already showed, and shows it again when it is
  ready. React cleans up the layout effects on hide, and runs them again on reveal. The fallback
  replaces shown content only when the update that suspends is not in `startTransition` or
  `useDeferredValue`.
- **Activity** (React 19.2): a hidden Activity destroys the effects of its content, and re-creates
  them when it shows again.

The top layer cannot prevent this. A call site can make it rare: put a Suspense boundary inside the
layer, around the part that can suspend, or start the update in a transition. A call site cannot
always rule it out, for example inside an Activity that a parent owns. Unit tests cover each case
(`__tests__/unit/layer-show-order.test.tsx`). The Activity tests run only on React 19.2 and later
(`USE_REACT_NEXT=true`). Even with the show order, a hide and reveal is poor UX: the layers
disappear for a moment, and focus goes to the initial focus target, not to where the user was.

**Code that opens nested layers in the same commit.** This is against our position:

- An inner layer that is already open when its parent first opens. For example, a modal that opens
  with its select menu open. The APG combobox pattern says "The popup is hidden by default", and
  shows it on a user action: Down Arrow, an Open button, typing, or (in some implementations) focus.
  The APG menu button pattern opens its menu only on a user action too. See
  [Smells at call sites](#smells-at-call-sites).
- The same mount happens again in React Strict Mode (development only), which runs the effects
  twice. A `key` remount, server-side rendering that hydrates open layers, and the first show of an
  Activity that pre-rendered while hidden are also mounts in the same commit.

**Not a smell: a combobox that shows its popup on focus.** It can open the popup right after its
modal opens, when it takes the modal's initial focus. A popup that keeps focus on its input is a
change of content, not a change of context, so it passes WCAG 3.2.1 On Focus. (A menu or dialog that
opens on focus and takes focus fails 3.2.1.) The popup opens from the focus event, after the modal
has shown, so it does not need the show order.

### Why the order matters

No source covers layers that open in the same commit. From the rules below, it passes when the
innermost layer is on top, and focus ends where that layer puts it. The show order does this.

The old order broke these rules. The outer layer showed last, so it was on top:

- It covered the inner layer, and the inner layer's focusable elements (2.4.11).
- Showing it closed an inner `auto` popover, for example a `Popup` or `DropdownMenu` menu, which
  called `onClose` as if the user had dismissed it. Focus stayed in the outer layer.

Screen readers (not tested): NVDA speaks the containers that focus enters, by comparing the old and
new focus ancestors. If the browser reports only the last focus move, NVDA should announce the outer
dialog and then the inner layer.

### Why the top layer does not skip the effect re-run

- **On hide**, the effect cleanup closes the layer. React gives the cleanup no signal to tell a hide
  from an unmount, and both need the layer closed:
  - A modal dialog that stays open while hidden keeps the rest of the page inert, and that includes
    the Suspense fallback. Focus stays in a dialog that the user cannot see.
  - A popover that stays open while hidden still takes the first Escape and light dismiss. The next
    `auto` popover or modal dialog closes it, and it calls `onClose`.
- **On reveal**, `isOpen` is still `true`, so the layer must show again. React runs the effects
  child first, so the order problem comes back. The show order fixes it.
- A `<Suspense>` inside `Dialog` or `Popover` would not replace the show order. It changes the
  fallback behavior, and it does not cover Activity or a sibling that suspends.

### Limits

- **Legacy roots.** In a React 18 `ReactDOM.render` root, Suspense does not clean up layout effects
  when it hides content (React 18.3 source: "Suspense layout effects semantics don't change for
  legacy roots"). An open `Dialog` there stays open while hidden, and the page is inert. A local
  test on React 18.3 confirmed it. The show order does not cause this.
- **Focus restore after a reveal.** A unit test covers it. After a reveal (or a mount in the same
  commit), an inner popover records the element that had focus when it showed (its parent's initial
  focus target) as its focus restore target, not its trigger. So closing it returns focus to that
  element, not to the trigger as APG expects. This is an edge case.

## Decision

The top layer shows nested layers that open in the same commit parent first, so the innermost layer
is on top, and takes its initial focus after its parent. See
[Layer show order](../architecture/layer-show-order.md).

This is a defensive fix for React's effect order: React runs child effects first, so without it the
parent shows last and covers the child. It does not change [our position](#our-position).

No WCAG rule limits how many layers are open, or how they open. The rules that apply (2.4.3 and
2.4.11) need focus in a logical place, and not covered. Our position is a UX rule for call sites,
not a WCAG rule. Design systems, Atlassian's included, also discourage one dialog that opens another
dialog.

## What the standards say

- **APG Dialog (Modal) pattern:** "A dialog is a window overlaid on either the primary window or
  another dialog window." Its modal dialog example "demonstrates multiple layers of modal dialogs".
  It expects focus to move into the new dialog, and, with exceptions, to return to its opener on
  close.
- **WAI-ARIA `aria-modal`:** the user can use only the modal's content, and other content should be
  inert. It says nothing about how many modals can be open.
- **HTML:** `showModal()` makes the dialog "the top-most modal dialog", so the platform expects a
  stack. Popovers can nest ("a tree of popovers"). Showing an `auto` popover closes the other open
  `auto` popovers "unless they are an ancestor of" the new one.
- **WCAG 2.4.3 Focus Order (A):** when a modal dialog opens, focus moves into it, and the content
  outside it is inert.
- **WCAG 2.4.11 Focus Not Obscured (Minimum) (AA):** "A properly constructed modal dialog will
  always pass this SC." The risk is a layer that covers the focused element.
- **WCAG 3.2.1 On Focus (A):** a layer that opens on focus and moves focus is a change of context,
  and fails. A change of content, such as a dynamic menu, is not a change of context unless it also
  moves focus.
- **WCAG 3.2.5 Change on Request (AAA):** a change of context must come from a user request. A click
  that opens two layers is a user request. A layer that opens on page load, with no request, can
  fail at AAA. F52 is the failure for this, but it covers only new windows.

No WCAG success criterion limits the number of open layers, or says that layers must open one at a
time.

## What design systems say

These are usability rules, not WCAG rules.

- **Atlassian Modal dialog:** "Use one at a time." and "Don't use dialogs to trigger other dialogs,
  as this is inaccessible and confusing." But `@atlaskit/modal-dialog` still supports a stack
  (`stackIndex`, `onStackChange`, and the `40-multiple` example).
- **Carbon:** "Don't nest modals."
- **Material (v1):** "Avoid dialogs launching dialogs." Full-screen dialogs are the exception. It
  also asks confirmation dialogs to avoid "simple menus".
- **Melanie Sumner** gives the reasons: it is not clear where focus returns or what Escape closes,
  and the screen reader announcements overlap. She says that improper focus handling "can fail" WCAG
  2.1.2, 2.4.3 and 2.4.7. She does not say that nested modals always fail. She also says that APG
  recommends against modals in modals, but APG's own example has them.
- **Scott O'Hara** (in whatwg/html #9936) says that popups that are open with a modal should be DOM
  descendants of it, so the user stays in its context. The show order uses this rule: a layer finds
  its parent in the DOM.

## Smells at call sites

These are not violations. Fix them at the call site, not in the top layer:

- A dialog that opens another dialog. Prefer one dialog with steps, an inline disclosure, or a
  non-modal popup.
- Layers that the user did not ask for, for example a dialog that opens with its menu or select menu
  already open. The APG menu button and combobox patterns only describe a popup that the user opens.
  The show order still makes the result correct (inner layer on top), so the user is not stuck, but
  the call site should open the inner layer on a user action.
- The alternative: if an inner surface must show when its parent opens, make it part of the parent's
  content, not its own layer. For example, `PopupSelect` renders its menu inline
  (`menuRenderMode="inline"`). A command palette's result list is the same case.

## Sources

Read 2026-11-11.

- [APG Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [APG Modal Dialog Example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/)
- [APG Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [APG Menu and Menubar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
- [APG Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WAI-ARIA 1.2 (`aria-modal`)](https://www.w3.org/TR/wai-aria-1.2/#aria-modal)
- [HTML: the dialog element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element)
- [HTML: popover](https://html.spec.whatwg.org/multipage/popover.html)
- [Understanding 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- [Understanding 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- [Understanding 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [Understanding 3.2.1 On Focus](https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html)
- [Understanding 3.2.5 Change on Request](https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html)
- [Understanding 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- [F52](https://www.w3.org/WAI/WCAG22/Techniques/failures/F52)
- [React: Suspense](https://react.dev/reference/react/Suspense) (caveats)
- [React: Activity](https://react.dev/reference/react/Activity)
- [Atlassian Modal dialog usage](https://atlassian.design/components/modal-dialog/usage)
- [Carbon Dialogs](https://carbondesignsystem.com/patterns/dialog-pattern/)
- [Material Design 1 Dialogs](https://m1.material.io/components/dialogs.html)
- [NN/g: Menu-Design Checklist](https://www.nngroup.com/articles/menu-design/)
- [NN/g: Contextual Menus](https://www.nngroup.com/articles/contextual-menus/)
- [Melanie Sumner: Avoid adding modals to other modals or dropdowns](https://melsumner.github.io/avoid-modals-in-nested-contexts)
- [whatwg/html #9936](https://github.com/whatwg/html/issues/9936)
- [NVDA Developer Guide](https://download.nvaccess.org/documentation/developerGuide.html)
