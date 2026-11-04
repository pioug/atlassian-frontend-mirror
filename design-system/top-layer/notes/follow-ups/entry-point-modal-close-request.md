# Follow-up: content of an entry-point modal cannot answer a close request

**Status:** TODO. Out of scope for the top-layer rollout branch (2026-11-02): do not change
`@atlassian/entry-points` there.

## Problem

A plain `ModalDialog` owner refuses a close by not acting on `onClose`. An entry-point modal opened
with `ModalTrigger` or `FullScreenModalTrigger` has no such owner for its content:

- The trigger passes its own `onClose` to the ModalDialog
  (`entry-points/src/modal-trigger/modal-trigger.tsx:253`). It always calls
  `entryPointProps.onClose`, then `closeModal()`, then `dispose()`.
- The content gets `onClose` (close now), `setShouldCloseOnEscapePress` and
  `setShouldCloseOnOverlayClick`. It can turn Escape off, but it is never asked, so it cannot answer
  an Escape with a confirm such as "Discard changes?".

Jira has a copy of the trigger with the same shape:
`jira/src/packages/platform/modal-entry-point-pressable-trigger/src/ModalEntryPointPressableTrigger.tsx`.

## Consumer workarounds that stay until this is fixed

These keep their own Escape listeners on the top-layer path:

- `jira/src/packages/servicedesk/knowledge-suggestions/src/ImprovementArticleModal.tsx:632-660`: a
  document listener shows the discard confirm. It runs before every layer, so with a menu open in
  the modal, Escape shows the confirm instead of closing the menu.
- `jira/src/packages/growth/premium-upgrade-modal/src/ui/modal-contents/index.tsx:253-266`: a
  document listener stops Escape and closes with analytics. On top-layer the Dialog never sees the
  Escape, and one press closes nested popovers and the modal together.
- `jira/src/packages/servicedesk/workforce-optimization-routing/src/RovoGenerationProgress.tsx:277-292`
  (inside `TeamContextEditorModal`): Escape cancels a running Rovo generation.
- Silent refusals through setter effects (could move to the same fix):
  `RoutingPreferencesCapacityModal.tsx`, `BulkImportScheduleModal.tsx`,
  `growth/cross-flow-next-ui/.../common-cross-flow-modal.tsx`.

## Options

1. Let the trigger pass the request to its content, under the existing ModalDialog contract (a hook
   such as `useModalCloseRequest(handler)`, or a prop). While a handler is set, Escape, an overlay
   click or the close button calls it instead of closing; content calls `onClose` to close. Small
   new entry-points API.
2. No API: these consumers render their own ModalDialog, so `onClose` is a normal request. The
   unsaved state lives in the lazy-loaded content, so the content must render the ModalDialog, which
   changes the loading shell.
3. No API: refuse quietly with `setShouldCloseOnEscapePress(false)`. Escape does nothing; only the
   close button shows the confirm.

## Related fix (done)

`editor-plugin-rule` bound Escape to `() => true`, so ProseMirror called `preventDefault()` on every
Escape in an editor with `rulePlugin`, and the top-layer Dialog skipped it. On the top-layer path
the binding is now off (`platform/packages/editor/editor-plugin-rule/src/pm-plugins/keymap.ts`), so
an Escape in such an editor asks the modal again, as on legacy. `ImprovementArticleModal` uses
`rulePlugin`.
