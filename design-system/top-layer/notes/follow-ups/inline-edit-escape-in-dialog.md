# Follow-up: InlineEdit's cancel Escape also asks a parent Dialog to close

**Status:** Done (D20, 2026-11-24), behind `platform-dst-top-layer`. `InlineEdit` calls
`preventDefault()` when it cancels an edit, and leaves the Escape to a layer open in its edit view.
See [`../decisions/consumed-escape.md`](../decisions/consumed-escape.md).

## Context

`Dialog` asks first. On Escape `Dialog` handles the `keydown`, calls `onClose`, and closes only when
`isOpen` becomes `false`. `Dialog` skips an Escape whose `keydown` an inner handler canceled, and
the browser makes no close request for it. See
[`../decisions/dialog-close-flow.md`](../decisions/dialog-close-flow.md).

## The problem

When an `InlineEdit` is editing inside a `Dialog`, popup or flag, Escape cancels the edit. The same
Escape also asks the parent layer to close, so the parent can close too. This is not new: it was the
same before ask-first.

Example: link-datasource `DatasourceModal`, test "when triggering inline-edit, pressing Escape,
should cancel editing and keep the modal open"
(`platform/packages/linking-platform/link-datasource/src/ui/common/modal/datasource-modal/test.tsx`).

## Options

- **`preventDefault()` on the InlineEdit Escape keydown** (behind `platform-dst-top-layer`). The
  parent `Dialog` (also in ModalDialog and Drawer) then skips the Escape. We tried this and
  confirmed it in Chromium, Firefox and WebKit, but did not ship it: we avoid canceling events
  unless they truly need it.
- **Dialog asks, the consumer decides.** `Dialog` already calls `onClose` with `reason: 'escape'`.
  The consumer can keep `isOpen` true while an edit is open. This needs no event cancelling, but
  each consumer must know about the edit state.
- **The edit stays inline and loses the edit.** Accept that Escape closes the parent layer, and the
  open edit is discarded with it.

## Outcome

D20 answers the questions this note left open:

- `InlineEdit` takes the cancel Escape with `preventDefault()`, so a `Dialog`, popup or flag around
  it stays open, and it leaves the Escape to a layer open in its edit view first.
- A sweep of the products on local consumption fixed every edit view it found whose layer could not
  close (Select and user picker menus, error `Popup`s, date pickers).

See [`../decisions/consumed-escape.md`](../decisions/consumed-escape.md).
