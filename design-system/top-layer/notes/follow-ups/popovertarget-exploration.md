# Follow-up: explore `popovertarget` as a native open path

## Status

Exploration. Per-consumer reconcile is the active mechanism for the
`react-select` migration (see `MenuPortalTopLayer.handlePopoverClose`).
`Popover` itself is intentionally declarative and does not self-heal.

## Context

`@atlaskit/react-select` keeps its menu visible when a `pointerdown`
lands inside the Select control by:

1. Tracking the last gesture target via `useDismissTarget`.
2. In `MenuPortalTopLayer.handlePopoverClose`, swallowing `onClose` when
   the target is inside the control AND calling `showPopover()` again on
   the next microtask to re-open the popover that the browser already
   hid.

The HTML popover spec offers a more direct primitive for the common
"single button opens a popover" case: the `popovertarget` invoker
attribute. When the trigger is tagged as the popover's invoker, the
browser treats it as part of the popover's "topmost ancestor" chain and
suppresses light-dismiss on it natively. No userland reconcile, no
flash, no pointer tracking.

- Spec: <https://html.spec.whatwg.org/multipage/popover.html#the-popover-target-attributes>
- Topmost ancestor lookup: <https://html.spec.whatwg.org/multipage/popover.html#topmost-popover-ancestor>

## Why we did not adopt `popovertarget` in this PR

The first migration target (`@atlaskit/react-select`) cannot use it:

1. The "trigger" is a composite of the control container (`<div>`), the
   inner `<input>`, the dropdown indicator, the clear indicator, and
   per-chip remove buttons. `popovertarget` is a single attribute on a
   single button-shaped element. There is no way to tag all of them.
2. `popovertarget` only works on `<button>` and `<input type="button | submit | reset | image">`.
   The Select control is a `<div>` by design.
3. React-select opens on `mousedown`, not `click`, so a single drag-select
   gesture can open the menu and pick an option. `popovertarget` resolves
   on `click`, which would regress that interaction.
4. React-select's reducer assumes React state (`menuIsOpen`) is the source
   of truth. `popovertarget` shifts ownership to the browser and would
   require a sync-back via `toggle` events.
5. Even with `popovertarget` on the main control, clicks on the clear
   button, chips, or input would still light-dismiss. The per-consumer
   reconcile would still be needed for those.

## What `popovertarget` would buy us elsewhere

For greenfield consumers with a single, focusable, button-shaped trigger
(tooltips, simple disclosures, single-button menus, future first-party
components), `popovertarget` gives:

- Native open / close with no React reconcile in the loop.
- No `useDismissTarget` ceremony in the consumer.
- Implicit `aria-expanded` and `aria-details` wiring (per the popover
  invoker accessibility mapping in newer specs).
- Smaller surface area in the consumer: no `onClose` plumbing for the
  "trigger click" case.

## Exploration backlog

If we pursue this in a follow-up:

- **Design a `Popover.Trigger` wrapper** that renders a `<button>` (or
  forwards to `@atlaskit/button`), accepts the popover id, wires
  `popovertarget`, and exposes a clean prop surface. Document that it
  cannot be used with composite triggers.
- **Decide on the SSR-stable id contract.** `useId` in React 18+ is
  stable, but the trigger needs the id before the popover renders. May
  need an `id` prop on `Popover` (already supported) plus a generator
  helper (`createPopoverId()`).
- **Document the open-gesture semantics.** Make it explicit that
  `Popover.Trigger` opens on `click`, not `pointerdown`. Recommend the
  per-consumer reconcile pattern for components that need the latter.
- **Browser support floor.** `popovertarget` ships in Chromium 114+,
  Safari 17+, Firefox 125+. Confirm those line up with Atlaskit's support
  matrix before relying on it for new components.
- **Migration matrix.** For each existing top-layer consumer (Tooltip,
  Popup, Dropdown, Select, Modal, Spotlight, Flag, etc.), classify
  whether `popovertarget` is feasible (single button trigger) or whether
  per-consumer reconcile is required (composite trigger, mousedown-to-open,
  controlled state machine).
- **A11y verification.** Confirm screen reader behavior on each major OS
  / AT combination when using `popovertarget` versus current manual
  `aria-expanded` wiring.

## Decision

Keep per-consumer reconcile (in the small set of composite-trigger
consumers that need it) as the universal mechanism. Treat `popovertarget`
as an opt-in optimization for new, simple consumers and revisit when
there is a concrete candidate to migrate.
