# Follow-up: remove consumer focus and Escape code that the gap fixes made redundant

**Status:** TODO (second sweep pass). The design-system gap fixes (G1 autoFocus before show, G2 late
focus target, G3 focus lost on unmount, G4 opener gone, G5/G6 keys from nested layers, ask-first
close) make more consumer code redundant on the top-layer path. Each gap's decision note lists the
consumers its author found:

- [../decisions/react-autofocus-and-late-initial-focus.md](../decisions/react-autofocus-and-late-initial-focus.md)
  (G1, G2)
- [../decisions/focus-loss-recovery.md](../decisions/focus-loss-recovery.md) (G3)
- [../decisions/focus-return-when-opener-is-gone.md](../decisions/focus-return-when-opener-is-gone.md)
  (G4 and trigger focus return)
- [../decisions/manual-light-dismiss-escape-stacking.md](../decisions/manual-light-dismiss-escape-stacking.md)
  (G5, G6)
- [../decisions/wrappers-ask-first-close.md](../decisions/wrappers-ask-first-close.md) (for example
  jira incidents-empty-page `mode="manual"`)

Rule (unchanged): gate the consumer code off on the top-layer path; gate-off stays as master; no new
consumer Escape or focus code; tests pin both paths.

Related small items:

- Pressable `autoFocus` attribute (needs a feature-flag dependency in `@atlaskit/primitives`).
- Issue view arrow shortcuts should skip keys while a layer is open inside them (G5); arrow keys on
  DatePicker month buttons now reach the issue view.
- Journeys modals: refuse the close while the form has unsaved changes (owner `onClose`), instead of
  blocking Escape per field.
- About 50 callers pass Popup `shouldReturnFocus={false}`; on the top layer they now get no focus
  return, as on legacy. Check product tests that expected a return.
- eoc `focus-state` keeps a react-focus-lock active around in-place dialogs; its form test is about
  2× slower in jsdom. Let the lock yield to top-layer dialogs.
- MultiActionTitleDropdown (ai-mate) opens on click on the top-layer path; tell the owners.
