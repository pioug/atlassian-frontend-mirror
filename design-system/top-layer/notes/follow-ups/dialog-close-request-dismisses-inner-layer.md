# Follow-up: a close request should dismiss the innermost ADS layer first

**Status:** Mostly moot. `Dialog` now has `closedby="none"`, so a close request with no key event
(Android back) goes past the dialog: no `cancel`, no ask, no reopen. It still does not close an open
Select menu, Popper or Spotlight inside the dialog first. Revisit if that is reported.

## Context

A close request (Escape, Android back) goes to the topmost close watcher. Modal dialogs and `auto`
and `hint` popovers have one. `manual` popovers do not, so a close request skips them.

ADS `manual` popovers that can be dismissed use `useSimpleLightDismiss`: the Select menu
(`react-select/src/components/menu-portal-top-layer.tsx`), Popper top-layer and Spotlight.

- **Escape:** `useSimpleLightDismiss` listens on `document` and calls `preventDefault()`. `Dialog`
  listens later, on `window`, sees `defaultPrevented` and does nothing. The browser makes no close
  request. So Escape closes the menu, and the dialog is not asked. This works today.
- **Android back:** there is no key event. The dialog has `closedby="none"`, so the close request
  skips it and the menu never sees it. Back navigates. (Before `closedby="none"`, the dialog got a
  `cancel` and asked, and a forced close reopened the dialog above the open menu. See
  [`dialog-forced-close-fallback.md`](./dialog-forced-close-fallback.md), superseded.)

The user expects back to close the menu first, as Escape does.

## Proposal

1. `useSimpleLightDismiss` adds each open layer to a small module-level list, with its element and
   its dismiss function. It removes the layer when it closes or unmounts.
2. On a close request, `Dialog` would need a signal. With `closedby="none"` there is no `cancel`, so
   this needs another hook (for example the Navigation API), which has its own user-activation rule.

Result: back would behave like Escape. It would close the innermost ADS layer first.

## Limits

- Layers from another copy of `@atlaskit/top-layer` are not in the list.
- Raw `manual` popovers that do not use `useSimpleLightDismiss` are not in the list.

## Tests

- Browser: hard, because Android back is not available in Playwright.

## Known case: one Escape closes a child popover and a parent popover

**Status:** Accepted. No code change. Revisit if a consumer (for example Forge) reports lost content
after an Escape.

When an open `auto` or `hint` popover is inside the dialog (for example a Tooltip, which uses
`popover="hint"`), `Dialog` does not take the Escape. It lets native light dismiss close the
popover. The browser then makes a close request, and a close request goes to the whole last close
watcher group. The browser closes each enabled watcher in the group, from the top, until one
refuses. The dialog's watcher is disabled (`closedby="none"`), so the browser skips it.

So one Escape can close more than the child popover when all of these are true:

1. The dialog is inside an `auto` popover, and the dialog opened with no user activation after the
   popover (for example Forge opens a modal after a fetch). The popover and the dialog are in one
   group.
2. A child popover opened with no user activation (for example a Tooltip opened by hover), so it
   joins the same group.
3. The user presses Escape.

The browser closes the tooltip, skips the dialog, and closes the parent popover. If the parent
unmounts its content, the dialog unmounts too, and `onClose` is not called.

Before `closedby="none"`, the dialog's enabled watcher refused the first such request. The refusal
used up the user activation, so a later request was forced and closed the parent popover anyway.

A native page has the same behaviour: a tooltip and a popover in one group close together.

### Options we did not take

- `Dialog` closes the child popover itself (`preventDefault()` and `hidePopover()`). Rejected:
  `Dialog` must not take over popover light dismiss.
- `closedby="closerequest"` while a child popover is open. The dialog refuses once. The next request
  with no user activation is forced, and the parent popover closes.
- Put the dialog in its own group. Not possible: a new group needs user activation.
- If a consumer needs a fix: the parent layer uses `popover="manual"` with `useSimpleLightDismiss`
  (no close watcher, so nothing in the group closes it), or the consumer renders the dialog so that
  closing the popover does not unmount it.
