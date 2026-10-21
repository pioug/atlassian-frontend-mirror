# Follow-up: should Dialog set the native `closedby` attribute?

**Status:** Done (2026-10-19). `Dialog` always renders `closedby="none"`. It handles Escape and
backdrop clicks with its own listeners, and has a `cancel` fallback for browsers without `closedby`.
See [`../decisions/dialog-close-flow.md`](../decisions/dialog-close-flow.md).

## Context

The native `closedby` attribute on `<dialog>` sets which user actions can close it:

- `any`: close requests (Escape, Android back) and light dismiss (a click outside).
- `closerequest`: close requests only.
- `none`: no user action.

An absent or invalid value is Auto. For `showModal()`, Auto is `closerequest`.

With `none`, the dialog's close watcher is turned off. "Request to close a close watcher" returns
before it fires `cancel`, so the browser never forces a close for it. See the HTML spec,
[close requests and close watchers](https://html.spec.whatwg.org/multipage/interaction.html#close-requests-and-close-watchers).

## Browser support

| Browser                      | `closedby`                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| Chrome, Edge, Chrome Android | 134+                                                                                            |
| Firefox                      | 141+                                                                                            |
| Safari, iOS Safari           | Not shipped. Not in Safari 27.0 (checked in real Safari 27.0, 2026-10-19). On in WebKit `main`. |

- WebKit `main` has `CloseWatcherEnabled` as `status: stable`, `defaultValue: true`, with the
  description "Enable Close Watcher API including dialog closedby attribute"
  (`Source/WTF/Scripts/Preferences/UnifiedWebPreferences.yaml`). So `closedby` and the close-watcher
  rule ship together in WebKit. The first Safari with it is after 27.0.
- In real Safari 27.0: `'closedBy' in HTMLDialogElement.prototype` is `false`, `CloseWatcher` is
  `undefined`, and `requestClose()` exists. 10 back-to-back Escapes on a refusing raw modal
  `<dialog>` gave 10 cancelable `cancel` events.
- MDN browser-compat-data (`html/elements/dialog.json`, `closedby`): Chrome 134, Firefox 141, Safari
  `preview`.

Feature detection: `'closedBy' in HTMLDialogElement.prototype`.

### Policy check

The Atlassian browser policy (`.agents/skills/frontend-tech-stack/references/browser-support.md`) is
the last 2 versions of Edge, Firefox, Safari, iOS Safari and Chrome Android, and the last 5 of
Chrome. Safari and iOS do not ship `closedby`, so `Dialog` keeps a fallback for them. The attribute
is fixed, so the server and client markup are the same. Only the fallback uses feature detection, in
an effect.

## What we chose

- Always `closedby="none"`, for every `dismissedBy` value.
- Standard path: `use-escape-keydown.tsx` and `use-backdrop-click.tsx` ask through `onClose`.
- Fallback: `use-cancel-fallback.tsx` binds only when `closedby` is not supported. It refuses each
  `cancel` and does not ask. Delete it when every supported browser has `closedby`.
- Other close requests (Android back) go past the dialog. On Android, back navigates.

## Options we did not choose

- **`closedby="none"` for `dismissedBy="none"` only.** It keeps the forced-close problem for every
  other value, so `Dialog` still needed the same-task reopen.
- **`closedby="any"`.** `cancel` cannot tell a backdrop click from an Escape, and `Dialog` would
  have to refuse each `cancel` to ask first.
- **No `closedby` (the old way).** It needs the reopen after a forced close. See
  [`dialog-forced-close-fallback.md`](./dialog-forced-close-fallback.md) (superseded).

## React and test notes

- Use the lowercase `closedby` attribute. `@types/react` 18.3 has
  `closedby?: 'any' | 'closerequest' | 'none'`.
- The jsdom polyfill (`src/testing/polyfill.tsx`) adds a `closedBy` IDL property and honours
  `closedby` for Escape, as a browser that supports it. Delete
  `HTMLDialogElement.prototype.closedBy` in a test to model a browser without it (then the polyfill
  ignores the attribute, and `Dialog` binds its fallback).

## When to revisit

- Safari stable ships `closedby` and meets the browser policy: delete `use-cancel-fallback.tsx`.
