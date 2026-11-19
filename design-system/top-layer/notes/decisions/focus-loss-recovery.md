# Focus lost inside a layer

> What layers do when their content removes, disables, hides or makes inert the focused element, and
> the browser moves focus to `<body>`: nothing. Focus stays where the browser put it, while the
> layer is open and when it closes. The consumer owns focus after such a change.

## Status

**Decision recorded 2026-11-18** (gap G3 of the consumer Escape and focus inventory). It replaces
two earlier cuts of slice D14: move lost focus while the layer is open, and return lost focus to the
opener at the close (see [Rejected](#rejected)). No code change: this note and the tests pin the
browser behaviour.

## Decision

1. **While a layer is open, lost focus stays with the browser.** No layer moves it. The browser
   moves focus to `<body>` and keeps the user's place for Tab (see [The browser](#the-browser)).
2. **A close does not take lost focus back.** A `Popover` returns focus to its opener only when
   focus is in it at the close, as native popover restoration does. A modal `Dialog` returns focus
   on close in any case (native `close()`).
3. **The consumer owns focus after it loses it.** See [Consumers](#consumers).

A layer does not heal a focus change that has already happened. That would repair a consumer's
mistake after the browser acted, and override the platform.

## The browser

Probed on 2026-11-18 in Chromium, Firefox and WebKit (Playwright), with a modal `<dialog>`, a
non-modal `<dialog>`, `auto` and `manual` popovers, and a plain page:

- Focus goes to `<body>` (the focus fixup rule). On a removal, Firefox and WebKit fire no event. For
  a disabled or hidden element, they fire `blur` at the next rendering update. Chromium fires `blur`
  at once.
- **The browser keeps the user's place.** After a removal, Tab goes to the next element and
  Shift+Tab to the previous one, in all three engines (the sequential focus navigation starting
  point). For a disabled, hidden or inert element, Chromium and Firefox keep the place. WebKit does
  not, and Tab starts again from the top (of the dialog, in a modal).
- **Modal `<dialog>`:** Escape still closes it and returns focus to the opener. Content outside is
  inert and not in the accessibility tree, so a screen reader stays in the dialog.
- **`auto` popover:** Escape closes it, but native restoration needs focus inside, so focus stays on
  `<body>`. After a removal and the close, Tab goes to the next element after the popover. Shift+Tab
  goes to the trigger in Chromium and WebKit. In Firefox, the first Shift+Tab leaves focus on
  `<body>`, and the second goes to the last element on the page.

## Consumers

A consumer that loses focus fixes it in its own code. No layer API is needed:

- **One press removes the focused element and closes the layer** (for example "Cancel" that swaps
  back to an "Add" button): keep the content as it is until the layer has closed, for example reset
  that state when the layer opens again. Focus is then in the layer at the close, and the close
  returns it to the opener.
- **A removal while the layer stays open** (for example a deleted row): move focus to a logical
  element, as the APG says: the item after the deleted one, else the one before, else the layer.
- **A control that disables or hides itself** (for example "Save" while it saves): keep it focusable
  while it is busy, or move focus as for a removal.

## The legacy path

| Layer          | Legacy focus code                         | After a loss                                      | Close after a loss                    |
| -------------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------------- |
| `ModalDialog`  | `react-focus-lock` (no `persistentFocus`) | `<body>` (`isFreeFocus()` allows it); Tab goes on | Returns focus to the trigger          |
| `Popup`        | `focus-trap` 2.4.6                        | `<body>`; the next Tab goes to the first element  | Returns focus to the trigger (always) |
| `DropdownMenu` | Keys on `window`                          | `<body>`; ArrowDown focuses the first item        | Returns focus to the trigger          |

The legacy path did not move lost focus while open either. On the top layer, `ModalDialog` matches
it. `Popup` and `DropdownMenu` differ after a close: focus stays on `<body>`, where `focus-trap`
returned it to the trigger. `DropdownMenuTopLayer` handles its keys on the menu, so ArrowDown does
nothing after a loss. These are migration differences that the consumer fixes (see
[Consumers](#consumers)), not layer bugs.

## Rejected

### Move focus while the layer is open

The first cut of D14 moved lost focus while the layer was open, by role: in a dialog to the nearest
focusable element (else the layer), in a menu or listbox to the nearest item (else the opener), in a
layer with no role to the opener that controls it. It used a document-wide tracker, a
`MutationObserver` and a microtask check. A probe of real ADS components showed problems:

- **A second Enter or Space activates another control.** A button that disables itself (for example
  "Save" while it saves) gave focus to the next button. A second Enter then activated it (in the
  probe, it closed the modal). With focus on `<body>`, the second Enter does nothing.
- **A `Popup` lost focus to its trigger while it stayed open** (a `Popup` has no role, and its
  trigger controls it). Enter on the trigger then closed it.
- **WebKit:** after a recovery in a modal, Escape no longer returned focus to the trigger.
- **Moving focus has side effects.** Focus that the layer moved opened a `TimePicker` menu (it opens
  on focus), and needed changes in `react-select`, `datetime-picker` and Jira callsites.
- It is about 1,000 lines with document listeners, for a case where the browser already keeps the
  user's place for Tab.

Also rejected: focus the layer itself (as Radix does), which loses the browser's place for Tab, and
focus the first element (as focus-trap, MUI and React Aria do), which sends a removed list row to
the top of the dialog.

### Return lost focus to the opener at the close

The second cut recorded the element in a `Popover` that had focus last (capture `focus` and `blur`).
Before the close, focus on `<body>` with a recorded element that was gone or could not take focus
counted as inside, so the close returned focus to the opener, as the legacy `Popup` did. Rejected:

- **It heals a focus change that has already happened**, to repair a consumer's mistake. The native
  popover does not.
- **It must tell a loss from focus that the user moved.** Tab out was easy (`relatedTarget`). A
  press on text gives the same `blur` (no `relatedTarget`) as Chrome gives while it removes the
  focused element. So after a press on text, a close that also removed that element pulled focus to
  the opener. A fix depended on Chrome's timing.

## Standards and the platform

- [APG, Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
  asks authors to manage it: "Authors need to manage events that effect the currently active
  element", for example focus "the list item following the deleted item".
- [WCAG F85](https://www.w3.org/WAI/WCAG22/Techniques/failures/F85) (2.4.3) is about dialogs and
  menus as they open and close: on a close, focus returns to the trigger, or to a logical element
  next to a removed trigger. A close with focus inside does this. After a consumer lost focus, the
  consumer owns it (APG).
- WHATWG is adding a `focusreset` event so that authors and libraries can react to lost focus
  ([whatwg/html#13050](https://github.com/whatwg/html/pull/13050),
  [#12842](https://github.com/whatwg/html/issues/12842)). There is no plan for the browser to move
  focus itself.
- Screen readers differ when focus is lost
  ([Sarah Higley](https://sarahmhigley.com/writing/focus-navigation-start-point/)): JAWS, TalkBack
  and Narrator restart the reading cursor at the top; VoiceOver on macOS keeps its place. In a modal
  `<dialog>`, the top is the top of the dialog.

Libraries differ too: Radix focuses the container, focus-trap, MUI and React Aria focus the first
element, Floating UI moves focus to the nearest element only with `restoreFocus` (default `false`),
and react-focus-lock and Headless UI do nothing while open.

## Tests

`__tests__/playwright/popover-close-after-focus-loss.spec.tsx` (Chromium, Firefox and WebKit): focus
stays on `<body>` after a removal, a disable, and a press that removes the focused button and
closes; after the close, Tab goes on from the user's place; Tab and Shift+Tab out of an open
popover. `Popup`'s `__tests__/playwright/top-layer-focus.spec.tsx`: Tab out of a popup with no role.

## Known gaps

- **A `Select` in-place menu** with focused custom content that is removed keeps the field in its
  focused state with focus on `<body>`. Not probed.
- **WebKit and a disabled or hidden element** lose the place for Tab (native behaviour).
- No screen reader was tested for this decision; the findings above come from the cited tests and
  the Chromium accessibility tree.

## Revisit when

`focusreset` ships in browsers, or screen reader testing shows that focus on `<body>` is a real
problem for our users. A conservative option then: move focus only for a removal (not a disabled
button), to the nearest element, and only in a dialog.
