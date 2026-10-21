# Follow-up: React `autoFocus` inside a top layer `Dialog` does nothing

**Status:** TODO. Five fields in four Jira consumers are fixed behind `platform-dst-top-layer` in
this branch. The general fix is open.

## Context

`Dialog` (and so `ModalDialog` with `platform-dst-top-layer` on) opens the `<dialog>` with
`showModal()` in a layout effect. The browser then runs the dialog focusing steps: it focuses the
first descendant with the HTML `autofocus` attribute, else the first focusable descendant. See
[`../architecture/focus.md`](../architecture/focus.md#react-18-autofocus-caveat).

## The problem

React 18 does not set the HTML `autofocus` attribute for the JSX `autoFocus` prop. It calls
`focus()` on the element when it commits it. Children commit before their parent's layout effects
run, so that `focus()` call comes before `Dialog` calls `showModal()`. At that time the `<dialog>`
is closed, so its content is not rendered, and the browser ignores the call. Then `showModal()`
focuses the first focusable element, not the field that asked for focus.

The legacy `ModalDialog` rendered visible content in a portal, so the early `focus()` call worked.
This is not caused by ask-first: it happens whenever the gate is on.

React 19 does not fix this for client rendering. `react-dom` 19.2 does not set the `autofocus`
attribute for `autoFocus` (its `setProp` skips it), and it calls `focus()` during the commit, as
React 18 does. Its server renderer does emit `autofocus` in the HTML.

The problem only affects a field that mounts with the dialog. A field that mounts later, in an open
dialog (for example after a loading panel or an entry point load), gets focus from `autoFocus`.

## Evidence

These Jira tests failed in their `🧪ff-on` variant (`expect(element).toHaveFocus()` or a missing
validation message, because the user typed in the wrong field):

- `jira/src/packages/servicedesk/insight-object-schema-create-object-type-modal/tests/CreateObjectTypeModal.test.tsx`:
  "should show validation error when display name is empty on submit" (modern and legacy). Source:
  `CreateObjectTypeModal.tsx` and `FormFields.tsx` (`TextField autoFocus`).
- `jira/src/packages/portfolio-3/portfolio/src/app-simple-plans/view/main/tabs/releases/project-releases/release-dialog/test.tsx`:
  "creates a release with fixed dates". Source: `view.tsx` (`AkTextField autoFocus`).
- `jira/src/packages/servicedesk/workflow-templates/tests/AddNewWorkflowPanel.test.tsx`: "Input
  focus › will be on the workflow name by default". Source: `AddNewWorkflowPanel.tsx`
  (`Textfield autoFocus`).
- `jira/src/packages/inline-issue-type-config/create-issue-type-modal/tests/CreateIssueTypeModalWrapper.test.tsx`:
  "should autoFocus the select issue type field on open". Source: `AddIssueTypeForm.tsx`
  (`Select autoFocus`, from `react-select`).

With the gate on, these consumers now do one of these, and keep `autoFocus` with the gate off:

- pass the field ref to `ModalDialog` `autoFocus={ref}` (`CreateObjectTypeModal.tsx`, `view.tsx`).
  `ModalDialog` focuses the ref in an effect, after `showModal()`.
- set the native `autofocus` attribute with a ref callback (`FormFields.tsx`,
  `AddNewWorkflowPanel.tsx`, and on the `react-select` input in `AddIssueTypeForm.tsx`).

All of them keep `autoFocus` with the gate on too. The native attribute only works for an element
that is in the dialog when `showModal()` runs, and `ModalDialog` `autoFocus={ref}` focuses the ref
once, when the dialog opens. A field that mounts later needs `autoFocus`. Two consumers do mount
later in the product:

- `AddNewWorkflowPanel.tsx`: the modal opens on the bulk update spinner panel, then shows this panel
  after a fetch (`PickedWorkflowTemplateModal.tsx`).
- `AddIssueTypeForm.tsx`: it opens in an entry-point modal, which first shows a loading state.

Tests that mount the field after the modal opened cover both (`AddNewWorkflowPanel.test.tsx`,
`CreateIssueTypeModalWrapper.test.tsx`).

Entry-point modals (`ModalTrigger` from `@atlassian/entry-points`) also run `FocusInsideOnLoad`
after the entry point loads. It focuses the `autoFocus` ref of the modal, else the first focusable
element, so it overrides both the native attribute and React's `autoFocus`. With the gate off, the
header close button comes first in `AddIssueTypeForm`, so focus most likely moves there (not
verified in the product). With the gate on, the top-layer `ModalDialog` does not forward its `ref`
(a TODO in `modal-wrapper.tsx`), so `FocusInsideOnLoad` finds no modal and does nothing, and
`autoFocus` keeps focus on the select.

Other consumers can have the same problem. A search for `autoFocus` inside `ModalDialog` content
finds more.

## Options

- `Dialog` renders its children only after `showModal()`, so their commit (and React's `focus()`
  call) comes after the dialog opens. This changes when consumer effects run, and can delay content
  by one render.
- Consumers use `ModalDialog` `autoFocus={ref}`. This works today and needs no `Dialog` change, but
  each consumer must change.
- Consumers set the native `autofocus` attribute with a ref callback. The browser dialog focusing
  steps honour it. It also works for a `Dialog` without `ModalDialog`, but only for content that is
  in the dialog when it opens. Keep `autoFocus` for content that mounts later.
- Document only: add the caveat to the `ModalDialog` and `Dialog` docs, and to the migration notes.

## To explore

- Should `FocusInsideOnLoad` prefer an `[autofocus]` element before the first focusable element, as
  the dialog focusing steps do? It needs the top-layer `ModalDialog` to forward its `ref` first.
- How many Jira and Confluence consumers use JSX `autoFocus` inside `ModalDialog` content?
- Can a lint rule find JSX `autoFocus` inside `ModalDialog` content?
