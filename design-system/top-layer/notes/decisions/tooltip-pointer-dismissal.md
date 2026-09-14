# Tooltip keeps native pointer dismissal

> Why `@atlaskit/tooltip` leans into `popover="hint"` light dismiss instead of following the
> `mode="manual"` precedent, and what had to be added to make that safe.

## Decision

On the top-layer path (`platform-dst-top-layer-tooltip`), tooltip keeps `mode="hint"` and lets the
browser own pointer dismissal. It does **not** move to `mode="manual"`.

This is deliberately different from react-select, datetime-picker, spotlight, popper and flag, which
all opted out of native light dismiss. See [tooling-gotchas.md](../migrations/tooling-gotchas.md)
("Manual mode") and [datetime-picker-migration.md](../migrations/datetime-picker-migration.md).

## Why tooltip is different

Those components opted out because native dismissal fought their own dismissal model: they are
click-opened, focus-holding surfaces whose triggers are logically associated with the popover, so a
click on the trigger must toggle rather than dismiss.

A tooltip has neither property. It is hover and focus driven, holds no focus, and there is no
interaction where a press on the trigger should leave the tooltip up. Native dismissal produces
exactly the outcome the component already wanted, and `hideTooltipOnClick` was the bespoke
approximation of it (311 call sites in this monorepo, all of which get the same outcome for free).

## Why it needed work first

Native dismissal alone is not shippable, because the tooltip re-shows itself immediately afterwards:

| Step                                  | Flag off | Flag on before this change |
| ------------------------------------- | -------- | -------------------------- |
| Hover trigger                         | visible  | visible                    |
| `mousedown` held                      | visible  | visible                    |
| `mouseup`                             | visible  | unmounted (light dismiss)  |
| Pointer nudged 4px inside the trigger | visible  | **re-shown**               |

Two mechanisms combine to cause that:

1. Dismissal lands on **pointerup**, not mousedown. The HTML light dismiss algorithm records the
   topmost clicked popover on pointerdown and hides on the matching pointerup. The tooltip popover
   host is a sibling of the trigger with no `popovertarget`, so the topmost clicked popover for a
   trigger press is `null` and the whole hint stack is hidden. This is engine independent, and also
   happens under the `auto` fallback.
2. Tooltip's own `onMouseOver` fires again whenever the pointer crosses a boundary between elements
   **inside** the trigger. Real triggers have element children (`@atlaskit/button/new` renders a
   `<span>` for its label), so a few pixels of movement is enough.

## The contract that was added

Once a press has happened, the tooltip does not show again until the trigger is re-entered. Native
semantics are "dismissed until the pointer leaves and comes back", and tooltip now matches them.

Implemented in `tooltip.tsx` with a single ref, only ever set on the top-layer path:

| Signal                                    | Effect                                                  |
| ----------------------------------------- | ------------------------------------------------------- |
| Popover `onClose` (light dismiss, Escape) | Set. The browser dismissed us.                          |
| Trigger `mousedown`                       | Set, and cancel a show that has not landed yet.         |
| Trigger `mouseover` from outside          | Cleared. The pointer genuinely re-entered.              |
| Trigger `blur`                            | Cleared, so keyboard focus can still show the tooltip.  |
| Checked in `tryShowTooltip`               | Bails while set, **after** the "already active" branch. |

Three details matter:

- **Re-entry is detected on the way in, not on the way out.** `mouseout` also fires for boundary
  crossings inside the trigger, so clearing on leave needs the same `relatedTarget` test, and it
  breaks for a dismissal that happens after the pointer has already left (press elsewhere while the
  tooltip is fading out). Clearing on a `mouseover` whose `relatedTarget` the trigger does not
  contain has no such stuck state.
- **The `relatedTarget` test uses the trigger element, not the wrapping container.** In the wrapped
  children form the container is a `<div>` around the trigger, and the pointer can enter the
  container before the trigger, which would make a genuine entry look internal.
- **The bail sits after the "already active" branch** so a held press keeps a visible tooltip
  visible until pointerup, which is what the platform does.

## Consequence: the pending-show hole

A press that lands before the show delay has elapsed never reaches native light dismiss, because
there is no open popover on pointerup. Left alone, a quick click surfaces a tooltip a moment later
over content the press has already changed. That is the case `hideTooltipOnMouseDown` exists for.

The top-layer path therefore cancels a pending show on `mousedown` regardless of the prop. This is a
behaviour change on the top-layer path for triggers that do not set `hideTooltipOnMouseDown`, and it
is the reason the prop can eventually be retired for most of its call sites.

## The `auto` fallback is not a rollout concern

`popover.tsx` falls back to `mode="auto"` when `hint` is unsupported, and under `auto` merely
hovering a tooltip trigger would close an unrelated open `@atlaskit/popup`. That outcome was
measured, but on pinned Playwright WebKit 26 and Firefox 144 builds.

Those are not the support matrix. Platform ships to
`last 1 chrome / firefox / safari / ios_saf versions` plus `edge >= 18` (root `package.json`
`browserslist`), and current releases of those engines support `hint`. The fallback stays as a
safety net, and does not engage for supported users.

## Still open

- `hideTooltipOnMouseDown` (119 call sites) is still honoured. It remains the only way to hide
  before the press completes, which native dismissal cannot reproduce because it fires on release.
  Retiring it needs an audit of the content-removal call sites.
