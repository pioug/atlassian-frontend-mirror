# The copied popup stays until it is dismissed

> Why click feedback anchored to a copy button has no timer and does not follow pointer or focus
> state, and what that costs.

## Status

**Decision recorded 2026-09-23. Superseded 2026-09-28.** No component in the repo uses this popup
now. The note stays as a record, and for any surface that adds a separate feedback popup again.

The popup was implemented in three consumers:
`jira/src/packages/servicedesk/insight-common-cmdb-shared-copy-button/src/CopyButton.tsx`,
`jira/src/packages/assets-app/field-copy-text/src/FieldCopyTextStateless.tsx` and
`platform/packages/design-system/design-system-docs-ui/src/example/actions/copy.tsx` (with
`copy-with-status-popover.tsx`, now deleted).

All three now swap the tooltip content to "Copied" again, as on `master`, and set
`hasNewContentOnTriggerClick` on their `Tooltip`. With `platform-dst-top-layer-tooltip`, the tooltip
stays open through the press and shows the new content. Without the gate, the prop has no effect, so
the behaviour is the same as before. See
[`tooltip-stay-open-on-trigger-click.md`](./tooltip-stay-open-on-trigger-click.md).

## Decision

The copied popup opens on the press and closes only when the user dismisses it: Escape, or a press
outside. `mode="auto"` supplies both.

| Signal                             | Closes the popup |
| ---------------------------------- | ---------------- |
| Escape                             | yes              |
| Press outside                      | yes              |
| Press on the trigger again         | re-opens it      |
| A timer elapsing                   | no               |
| Pointer leaving the trigger        | no               |
| Focus leaving the trigger          | no               |
| The parent clearing `copied`       | no               |
| The anchor scrolling out of a clip | no               |

## Why not pointer exit

Closing on trigger `mouseleave` is the intuitive option, because it is what the tooltip this popup
replaced did. It was rejected on three grounds.

1. **It reimports the coupling the popup exists to escape.** The popup exists because pointer state
   is an unreliable carrier for click feedback — that is the whole content of
   [`tooltip-pointer-dismissal.md`](./tooltip-pointer-dismissal.md). It would also inherit that
   note's hardest detail: `mouseout` fires for boundary crossings _inside_ the trigger, and real
   triggers have element children (`@atlaskit/button/new` renders a `<span>`; `IconButton` renders
   an icon), so a naive handler closes on a few pixels of movement. Every consumer would have to
   re-implement the `relatedTarget`-contains test from `tooltip.tsx`.
2. **It covers one input mode of three.** Keyboard has no pointer exit, so it needs a separate blur
   rule. Touch has no pointer exit at all, so the popup would become _permanent_ there — the worst
   of the three outcomes. "Stays until dismissed" is one rule that holds for all three, and press
   outside is the same gesture on all three.
3. **It fires before the message is readable.** After the press the pointer is on the button and the
   common next move is straight to the paste target, so exit lands within ~100ms. Exit also carries
   no dismissal intent; Escape and a press outside do.

Focus exit was rejected for the same reason as (2): it is the keyboard half of a modality-specific
rule, and pairing the two gives two lifetimes for one popup.

## Why not a timer

The first cut used a 2s timer (`STATUS_DURATION_MS`) with an `idle` / `showing` / `hiding` state
machine, kept alive through the exit animation by `onExitFinish`. Against dismissal-driven closing:

- A timer races the announcement. The live region holds its text for `ANNOUNCEMENT_DURATION_MS`
  (5s), chosen so a screen reader can finish reading it even when queued behind something else. A 2s
  visual is gone while the message may still be being read.
- A timed message cannot be re-read, and the user has no control over when it goes.

The timer is not strictly worse, and it is still the right shape where staleness is the dominant
risk — see "Consequences". This is a judgement call, recorded rather than proven.

## Why `mode="auto"`, and what it costs

`mode="auto"` is what makes press-outside work, and press-outside is the only dismissal a mouse user
will discover: the popup has no close affordance and holds no focus. `mode="manual"` would leave
Escape as the only exit, which for a popup with no expiry is not shippable.

The price is a press-while-open race. Native light dismiss records the topmost clicked popover on
pointerdown and hides on the matching pointerup, and the popup host is a sibling of the trigger with
no `popovertarget`, so a second press dismisses the popup — landing either side of the consumer's
own click handler. All three consumers therefore stop racing it and re-open on their own terms: bump
a `key` so the dismissed element and its listeners are dropped, mount closed, then open in the
following render. `Popover` and `useAnchoredPopover` both need a fresh `false` → `true` transition
to show and position, so the two-render shape is load-bearing, not incidental.

That remount is the cost of `auto`, not the cost of persistence. It is why the two jira files carry
a `react-you-might-not-need-an-effect/no-chain-state-updates` suppression (platform does not run
that rule). It is about fifteen lines per consumer, and a shared hook was considered and rejected:
it would only save typing them, and it would put a public top-layer API behind a workaround for
consumers that cannot set `popovertarget` on their invoker.

`canAppear={() => !isOpen}` on the trigger tooltip is part of the same choice, where the trigger has
a tooltip (the two jira consumers; the docs-ui button has none). Re-entering the trigger clears the
tooltip's pointer-dismissal latch, so without it a hover would put a tooltip in the popup's place —
and under the `auto` fallback (no `popover="hint"` support) the tooltip opening would light-dismiss
the popup outright.

## Consequences

- **The popup can go stale.** It is top-layer, has no close affordance, and `useAnchoredPopover`
  writes `position-visibility: always`
  ([`position-visibility-always.md`](./position-visibility-always.md)), so it does not self-hide
  when its anchor is clipped fully out of a scroll container. In a table of copyable attributes a
  "Copied" chip can stay painted after its row has scrolled away.

  If that matters for a given surface, the instrument is an explicit `IntersectionObserver` on the
  anchor that closes the popup — which is what `position-visibility-always.md` prescribes for "close
  when the trigger leaves the screen" — or a timer. Not `mouseleave`.

- **One lifetime in the repo.** `design-system-docs-ui/src/example/actions/copy.tsx` first kept its
  2s timer, which is defensible for a docs page (short-lived surface, no scrolling table). It was
  aligned to this decision anyway (2026-09-23) so the three reference implementations agree, and so
  a fourth copy button has one pattern to copy rather than a choice to make. (2026-09-28: all three
  were replaced by `hasNewContentOnTriggerClick`, so the pattern to copy is now the prop.)

- **The popup outlives its source state.** In `FieldCopyTextStateless` the parent clears `copied` /
  `copyFailed` on its own timer; the popup holds `lastStatus` and stays up. That timer now decides
  how long the message is _announced_, not how long the popup is _shown_.

## References

- [`tooltip-pointer-dismissal.md`](./tooltip-pointer-dismissal.md) — why a press closes the tooltip
  by default, and the recommended consumer pattern.
- [`tooltip-stay-open-on-trigger-click.md`](./tooltip-stay-open-on-trigger-click.md) — the prop that
  lets the tooltip carry the copied message, and why it replaced this popup.
- [`position-visibility-always.md`](./position-visibility-always.md) — why an anchored surface never
  self-hides, and the prescribed way to close one when its anchor leaves the screen.
- [`host-element-unmount-when-hidden.md`](./host-element-unmount-when-hidden.md) — why the host is
  in the DOM only while open or animating out, so the popup's children need no `null` guard but must
  keep their last message through the exit.
