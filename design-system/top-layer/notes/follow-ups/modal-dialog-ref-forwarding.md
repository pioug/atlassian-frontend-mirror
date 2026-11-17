# Follow-up: ModalDialog forwards `ref` on the top-layer path

**Status:** Done (2026-11-17, D15 #540570). Found by jira `platform/modal`
`InternalJiraModal.test.tsx` (ref forwarding), which pins the legacy path only.

## What changed

The top-layer `ModalDialog` forwards its `ref` to the native `<dialog>`. Like the legacy `section`,
that element has the dialog role, the accessible name and the test id, and it contains all the
content. The content `div` was the other choice. It is the visible box (as the legacy `section` is),
but it has no `tabindex` on purpose, so `focus()` on it does nothing.

## Why it mattered

The entry-points `ModalTrigger` finds the modal through this `ref`, to move focus after the entry
point loads. Without it, a load that removed the focused loading content left focus on `<body>`, and
a modal `autoFocus` ref target in the loaded content did not get focus.

Tests: `modal-dialog/src/__tests__/unit/modal-dialog-top-layer.test.tsx` (the `ref` gets the
`<dialog>`), and `entry-points/src/modal-trigger/__tests__/playwright/focus-inside-on-load.spec.tsx`
(focus after the load, on both paths).

## Consumers that pass a `ref`

With the top layer on, these now get the `<dialog>` instead of `null`. Check them when the flag
rolls out:

- `@atlassian/entry-points` `ModalTrigger`: focus after the load (tested). It does not move focus
  into a `<dialog>` that closed before the content was ready (tested).
- jira `InternalJiraModal` forwards a `ref` for every Jira modal.
- jira `GspModalShell` (getting-started-by-intent).
- `@atlaskit/smart-card` `EmbedModal`: its own Escape handler (behind
  `platform_sl_embed_modal_escape_isolation`) uses the `ref`. With the `ref`, it would stop Escape
  before `Dialog` sees it, so the browser's close request would go to the next close watcher. On the
  top-layer path the handler now does nothing, and `Dialog` owns Escape (tested).
- `@atlaskit/feedback-collector` `FeedbackForm`: passes it to its consumer as `dialogRef`.
- dtac `SaveQueryModal`: uses it as the select `menuPortalTarget`, so the menus now portal into the
  `<dialog>`.
