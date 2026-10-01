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
interaction where a press on the trigger should leave the tooltip up. (The exception is a press that
changes the content. It is opt-in, through `hasNewContentOnTriggerClick`. See
[Content changes after a press](#content-changes-after-a-press-decided-2026-09-21).) Native
dismissal produces exactly the outcome the component already wanted, and `hideTooltipOnClick` was
the bespoke approximation of it (311 call sites in this monorepo, all of which get the same outcome
for free).

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

## Content changes after a press (decided 2026-09-21)

A common consumer pattern swaps the tooltip's content in response to the click it just received:
click "Copy", and the tooltip reads "Copied!" while the pointer still rests on the button. Legacy
kept the tooltip open through the click and simply re-rendered the new content. On the top-layer
path the press light-dismisses the tooltip on pointerup and the latch above blocks every re-show
until the pointer leaves and re-enters, so the new content is never seen while the pointer rests.

A carve-out was prototyped: clear the latch and re-show when `content` changes while the latch is
set and the pointer is still inside the trigger. It passed the affected consumer tests and kept the
pointer-dismissal contract tests green. It was rejected anyway:

- `content` is a `ReactNode`. Strings can be compared by value, but inline JSX
  (`<FormattedMessage>`, fragments, render functions) changes identity on every render, so the
  carve-out would re-show after any unrelated re-render while latched. That is the stale-tooltip
  hole the pending-show rule closes, reopened by another route.
- Comparing elements by `type` and shallow props narrows the hole without closing it, and puts a
  content-equality heuristic in the show path that consumers cannot reason about.
- One rule is easier to hold: after a press, the tooltip does not show again until the pointer
  re-enters the trigger, whatever the content does.

**Consequence.** Roughly 65 call sites across platform and jira use the "Copied!" swap. Under the
top-layer path they show the new content only after the pointer leaves and re-enters. Tests that
asserted the swap now `unhover()` then `hover()` before asserting the new content.

**Recommended consumer pattern (revised 2026-09-28).** Set `hasNewContentOnTriggerClick` on the
`Tooltip`. The press still light-dismisses the tooltip, but the tooltip shows itself again from the
trigger's `pointerup`, in the same task. No closed frame is painted, and the tooltip shows the new
content while the pointer rests. The rule above still holds: without the prop, a press closes the
tooltip until the pointer re-enters the trigger. The prop is an explicit opt-in, not a content
heuristic. Why this design was chosen, the options it replaced, and the browser event order it
depends on are in
[`tooltip-stay-open-on-trigger-click.md`](./tooltip-stay-open-on-trigger-click.md).

**Earlier pattern (2026-09-21 to 2026-09-28).** Before the prop, the recommendation was to put the
feedback outside the tooltip: a click-triggered `Popover` anchored to the trigger, with the
announcement in a persistent visually-hidden `role="status"` region, and the popup itself left
roleless. Three consumers used it:
`jira/src/packages/servicedesk/insight-common-cmdb-shared-copy-button/src/CopyButton.tsx`,
`jira/src/packages/assets-app/field-copy-text/src/FieldCopyTextStateless.tsx` and
`platform/packages/design-system/design-system-docs-ui/src/example/actions/copy.tsx`. On 2026-09-28
all three went back to the tooltip content swap and set `hasNewContentOnTriggerClick`. The popups
are gone. One trade-off remains: the popup's live region gave a reliable announcement, and the prop
adds none. The popup's lifetime rules are in
[`copied-popup-lifetime.md`](./copied-popup-lifetime.md).

### Swaps that still work: `key` remounts (probed 2026-09-24)

Some swaps do show the new content while the pointer rests, under the gate. The Jira issue view
copy-link button (`jira/src/packages/issue/permalink-button/src/PermalinkButton.tsx`) is one. It
goes through `jira/src/packages/platform/field-copy-text` with `remountOnChange`, which puts
`key={actualTooltipLabel}` on the `Tooltip`. That does not contradict the rule above.

A probe in real Chrome 153 separated the two mechanisms that consumer has:

| Variant                            | Gate on: new content while pointer rests | Gate off |
| ---------------------------------- | ---------------------------------------- | -------- |
| `key` remount + refocus the button | yes                                      | yes      |
| `key` remount only                 | yes                                      | yes      |
| refocus only                       | no                                       | yes      |
| neither                            | no                                       | yes      |

- **The remount is what works.** A new `key` mounts a new `Tooltip`, whose latch starts clear.
  Chrome then sends `mouseover` to the new trigger node without the pointer moving, with
  `relatedTarget` set to an ancestor because the old node is gone. The new tooltip treats that as
  re-entry.
- **The refocus does not.** Focus matches `:focus-visible`, but on the same instance the latch is
  still set, and only `blur` clears it.

This works by accident. It depends on the engine sending boundary events when the node under the
pointer is replaced, it fails if the two labels are ever the same string, and the `aria-live` span
mounts with its text already present, so it may not be announced. Do not copy it as a pattern.

Consequence for `field-copy-text`: of its 16 non-test consumers (2026-09-24), only 5 pass
`remountOnChange`. The other 11, mostly servicedesk, never show "Copied" to a pointer user under the
gate. The follow-up is one change in `field-copy-text/src/ExportedComponent.tsx` to the recommended
pattern above (now `hasNewContentOnTriggerClick`), in its own PR, not a change per consumer.

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
