# A Consumed Escape Keeps the Layer Open

**Status:** Decided 2026-11-24 (D20). `InlineEdit` follows it behind `platform-dst-top-layer`.

## The rule

When something does something with an Escape, it consumes the Escape, and no layer closes on that
press. One press undoes one thing, innermost first: a layer open inside a control, then the state of
the control (for example an inline edit leaves edit mode), then the layer around it (a modal or a
popup).

A control consumes an Escape only when it does something with it. A control with nothing to undo (an
inline edit in read view) leaves the Escape alone, and the layer around it closes. `InlineEdit`
calls `onCancel` only when it cancels an edit, so an Escape in read view does not call it.

An edit that cannot end on Escape does not consume it either. A controlled `InlineEdit` (`isEditing`
set) without `onCancel` cannot leave edit mode, so it resets the value and leaves the Escape to the
layer around it (a modal or a spotlight closes, as on the legacy path).

## What "consume" means

A control consumes an Escape when, in its `keydown` handler, it:

1. checks that the Escape is still free: not `event.defaultPrevented` (an inner handler took it),
   and no layer is open inside the control (`hasOpenDialogOrPopover({ within })`);
2. undoes its own state;
3. calls `preventDefault()`.

`preventDefault()` is the signal. `Dialog`, `useManualLightDismiss` and page surfaces skip a
`defaultPrevented` Escape (`isEscapeToHandle`), and the browser makes no close request for it, so an
`auto` or `hint` popover and a native `<dialog>` stay open too. The HTML standard: "If the web
developer cancels the event by calling `preventDefault()`, then nothing further happens"
([close requests](https://html.spec.whatwg.org/multipage/interaction.html#close-requests)).

Only the control that consumes the Escape calls `preventDefault()`. A wrapper inside the control
that prevents an Escape it does not consume makes the control skip it (step 1). The link-datasource
`InlineEditLayer` prevented every Escape in a table cell edit view so that a modal stayed open, and
the edit did not cancel. Its top-layer handler is removed: `InlineEdit` does both now.

`stopPropagation()` is not a claim. It hides the Escape from the `document` and `window` listeners,
so a `Dialog` and a manual popover do not see it, but the browser still makes the close request, so
an `auto` popover closes. It also hides the Escape from a manual popover open inside the control,
which listens on `document`. Legacy layers listen on `window` and do not check `defaultPrevented`,
so on the legacy path `stopPropagation()` was the only way to keep a layer open. Legacy
`ModalDialog` closes on a consumed Escape. The flag changes that.

## Why the control must look for layers inside it

React handlers run before the `document` and `window` listeners (see the listener order in
`claim-escape.tsx`). A layer inside the control that closes from `document` (a top-layer Select menu
or DatePicker calendar, both manual popovers with `useManualLightDismiss`) has not seen the Escape
yet, so the control cannot learn about it from `defaultPrevented`. It must check
`hasOpenDialogOrPopover({ within })` and leave the Escape alone while a layer is open inside it. An
inner React handler that consumes the Escape runs first, so `defaultPrevented` shows it.

## Limits

- **Focus decides which control hears the Escape.** A control is not a close watcher. It hears the
  Escape only while focus is inside it. With focus elsewhere in the modal, Escape closes the modal,
  and an open edit goes with it.
- **Only closable layers count.** `hasOpenDialogOrPopover` skips tooltips and popovers without
  `onClose`: a manual popover, a `Popup` and an `InlineDialog` (for example a field validation
  message). While one is open, the control still consumes the Escape, so a tooltip or a field error
  stays open for that press.
- **A menu that cannot close blocks the cancel.** A menu that its owner keeps open (for example a
  Select with `menuIsOpen: true`) takes every Escape, so the control never cancels on Escape. A
  field that opens its menu on focus takes two presses: the menu, then the edit. Fix it in the
  owner, behind the flag, with no key code: let the menu close. Either the Select owns its menu
  (`defaultMenuIsOpen`; the user picker without `open`, plus `autoFocus` where `open` gave the
  focus), or the owner's state drives it and the close callback clears that state
  (`JiraCascadingSelectField`, `StatusCategorySelect`, the servicedesk date fields). Do not end the
  edit from a menu close callback: it also runs on select and on blur, and on blur it ends the edit
  before the inline edit blur confirm, so focus moves back to the edit button. An edit view must not
  remount on render (a component type made in render, or inline `components`), or a menu closed by
  Escape opens again and focus is lost. The user picker `menuIsOpen` prop does not keep the menu
  open, because the picker state overrides it. Only `open` does.
- **A Select that clears on Escape consumes it.** With `escapeClearsValue`, the menu closed and a
  value, the top-layer Select clears the value and calls `preventDefault()`, so the edit or modal
  around it stays open for that press. With no value, the Escape goes on.
- **A held key undoes one thing.** `Dialog` and `useManualLightDismiss` take a repeat but do not ask
  to close. An `InlineEdit` in edit view takes a repeat and does not cancel, so holding Escape after
  it closes a Select menu keeps the edit. In read view, repeats reach the layer around.
- **Not for routing.** This is for a control that undoes its own state. Code that only moves an
  Escape around a layer is still not wanted (see the D16 decision in
  `manual-light-dismiss-escape-stacking.md`).

## Native and APG

- Native `<dialog>` and `[popover]` close watchers skip a canceled Escape `keydown`. See
  `__tests__/playwright/escape-target-selection.spec.tsx` (`prevent`).
- APG grid: "Escape: restores grid navigation. If content was being edited, it may also undo edits"
  ([grid, editing inside a cell](https://www.w3.org/WAI/ARIA/apg/patterns/grid/#gridNav_inside)).
- APG combobox: "Dismisses the popup if it is visible. Optionally, if the popup is hidden before
  Escape is pressed, clears the combobox"
  ([combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#keyboardinteraction)).
- APG menu: "Close the menu that contains focus" and return focus to its opener
  ([menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/#keyboardinteraction)).
- APG modal dialog: "Escape: Closes the dialog"
  ([dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#keyboardinteraction)). The
  pattern does not say what happens when a widget inside the dialog also uses Escape. The patterns
  above each give Escape one job for the innermost part, which matches one press, one thing.

## Tests

- `__tests__/playwright/consumed-escape.spec.tsx`: in a `Dialog` and in a manual popover with
  `useManualLightDismiss`, a handler that calls `preventDefault()` keeps the layer open, a handler
  that does not lets it close, and a handler that calls `stopPropagation()` hides the Escape from
  the layer.
- `__tests__/playwright/escape-target-selection.spec.tsx`: native `auto` popovers. A canceled Escape
  keeps the popover open (`prevent`); `stopPropagation()` does not stop the close request (`stop`).
- `@atlaskit/inline-edit` `escape-in-layer.spec.tsx`: inline edits in a top-layer `ModalDialog` and
  `Popup`, with each press, and legacy twins.
- `@atlaskit/link-datasource` `datasource-modal/test.tsx`: a table cell inline edit in a top-layer
  modal. Escape cancels the edit; with a status menu open, the first Escape closes the menu and the
  second cancels the edit. The modal stays open.
