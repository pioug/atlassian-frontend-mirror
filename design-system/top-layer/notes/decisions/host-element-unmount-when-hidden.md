# Host element unmounts when hidden

## Status

**Decision recorded 2026-06-09**

`Popover` and `Dialog` only render their host element (the
`<div popover>` for `Popover`, the `<dialog>` for `Dialog`) while open or
their exit animation is playing. Once the exit completes, the host is
unmounted from the DOM.

## Context

The previous contract kept the host element mounted at all times so:

- consumers had a stable `ref` to read from,
- the trigger could keep a stable `aria-controls` relationship,
- `showPopover()` / `showModal()` toggled visibility on a persistent node.

The cost was an empty role-bearing element (`role="dialog"`,
`role="menu"`, etc.) remaining in the accessibility tree for every closed
top-layer instance on the page. Accessibility tooling and assistive tech
audits flagged this as a real problem: a screen reader user navigating the
tree could encounter dialogs that do nothing.

## Decision

Drive host-element mount/unmount off the `phase` state machine returned
by `useAnimatedVisibility` (`closed | entering | open | exiting`). The
host element is rendered while `phase !== 'closed'`.

- `isOpen=true` → phase transitions `closed → entering` (animated) or
  `closed → open` (non-animated) in the same commit the host mounts.
  `showPopover()` / `showModal()` runs from a layout effect.
- `isOpen=false` with an `animate` preset → phase moves to `exiting` and
  the host stays mounted while the CSS exit transition plays. When the
  `transitionend` fires (or the per-transition safety-net timeout of
  `exitDurationMs + 50ms` elapses), phase flips to `closed` and the host
  unmounts.
- `isOpen=false` without an `animate` preset → phase moves to `exiting`
  and a `useEffect` binds `toggle` / `close` listeners on the still-
  attached host. When the browser dispatches `toggle(closed)` (popover)
  or `close` (dialog), phase flips to `closed` and the host unmounts.
  This guarantees the toggle listener (which drives close-reason
  capture, nested focus restoration, and the `onClose` notification)
  runs against an attached element.

### Implementation notes

- Listener binding inside `Popover` is in a `useLayoutEffect`, ordered
  in source before the `showPopover()` layout effect. This is required
  because `showPopover()` dispatches `beforetoggle` synchronously; if
  listeners were bound from a regular `useEffect`, the first
  `beforetoggle` would fire before the listener attached, and the
  `previouslyFocusedElementRef` snapshot would never be taken —
  breaking nested-popover focus restoration on close.
- `closeReasonRef` is reset to `'light-dismiss'` at the start of every
  open cycle. The ref lives on the component (which stays mounted) and
  outlives the host element, so without an explicit reset a prior
  `'escape'` would leak into the next close, especially in the
  non-animated path where the host unmounts before `handleToggle` has a
  chance to reset it.

## Public contract

Stated in `TPopoverBaseProps` / `TDialogBaseProps`:

- The host element is in the DOM only while open or exit-animating.
  Exact unmount timing is private and may change.
- `id` (supplied or generated via `usePopoverId`) is stable across
  opens.
- `ref` is populated only while the host element is rendered. Consumers
  that read from the ref should gate the read on `isOpen` being `true`.

## Consequences

- Internal hooks that bind to the host element need to react to host
  remount across open cycles. Hooks that already depended on `isOpen`
  re-run automatically. Hooks that only had ref-object deps gained an
  `isOpen` option:
  - `useAnchorPosition`
  - `useAnchorPositionAtPoint`
  - `useWidthFromAnchor`
  - `useFocusWrap`

  The new option is optional for backwards compatibility, but consumers
  that compose with `Popover` / `Dialog` MUST pass it; otherwise the
  effect will keep listeners and styles bound to a stale (detached)
  element after the first close/re-open cycle.

- Trigger `aria-controls` becomes lifecycle-managed; see
  `aria-controls-trigger-contract.md`.

- VR/integration examples that opened a popover via
  `useEffect(setIsOpen(true))` after mount now race the snapshot,
  because the host is not in the DOM on initial render. These examples
  were switched to `useState(true)` so the host is rendered from the
  first commit and positioning effects run before the screenshot.

- Adopter packages had `aria-controls` handling updated to mirror the
  new contract; `inline-dialog` removes the stale attribute on each
  render when the value is `undefined`.

## References

- `notes/decisions/aria-controls-trigger-contract.md`
- `notes/architecture/focus.md`
- `notes/architecture/animations.md`
- `notes/architecture/dialog.md`
