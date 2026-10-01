# Tooltip stays open on a trigger press: re-show on `pointerup`

> Why `hasNewContentOnTriggerClick` keeps the tooltip a `popover="hint"` and shows it again from the
> trigger's `pointerup`, which options were rejected, and which browser event order it depends on.

## Status

**Decision recorded 2026-09-28.** Behind `platform-dst-top-layer-tooltip`. Implemented in
`TopLayerTooltipPopup` in `platform/packages/design-system/tooltip/src/tooltip.tsx`. A first
prototype used `mode="manual"`; this design replaced it.

## Problem

On the top-layer path the tooltip is `Popover mode="hint"`. A press on the trigger light-dismisses
it, and the browser gives no way to cancel that. See
[`tooltip-pointer-dismissal.md`](./tooltip-pointer-dismissal.md). A consumer that changes `content`
on the press ("Copy" to "Copied!") therefore never shows the new content while the pointer rests on
the trigger.

## Decision

`Tooltip` gets an opt-in prop, `hasNewContentOnTriggerClick`. When it is set and the tooltip is
open, the tooltip listens for `pointerup` and `mouseup` on the trigger and calls `showPopover()`.

- The popover stays `hint`. The browser still owns light dismiss, Escape and stacking.
- The tooltip does not set the pointer-dismissal latch on `mousedown` for this path.
- `showPopover()` does nothing when the popover is already open, so the second listener is safe.
  `mouseup` covers environments that dismiss on `mouseup`, such as the jsdom test polyfill.
- `hideTooltipOnClick` and `hideTooltipOnMouseDown` turn the prop off.
- `useAnimatedVisibility` returns to `open` when the element is shown natively again while `isOpen`
  stays `true`. Before, the host kept its exit styles.

The default does not change. Without the prop, a press still closes the tooltip.

### Why it works

| Step | What happens                                                                         |
| ---- | ------------------------------------------------------------------------------------ |
| 1    | `pointerdown`: the browser records the topmost clicked popover. It is `null`.        |
| 2    | `pointerup`: the browser runs light dismiss and hides the tooltip.                   |
| 3    | `pointerup` is dispatched. The tooltip calls `showPopover()`. This is the same task. |
| 4    | `click`: the consumer changes `content`.                                             |
| 5    | The next frame paints the tooltip open, with the new content.                        |

The browser does not paint between step 2 and step 3. The entry transition does not start again. The
two `toggle` events coalesce into one `open -> open` event, so `Popover` does not call `onClose`.

Probe results (2026-09-28, 40 frames sampled after the press):

| Browser     | Popover mode      | Closed frames | `toggle` events |
| ----------- | ----------------- | ------------- | --------------- |
| Chrome 153  | `hint`            | 0             | `open -> open`  |
| Firefox 153 | `hint`            | 0             | `open -> open`  |
| Safari 27   | `auto` (fallback) | 0             | `open -> open`  |

## Rejected options

- **`mode="manual"` (the first prototype).** It removes light dismiss, so the tooltip must re-invent
  it: close on leave, blur, scroll and a press outside. It must also handle Escape in JavaScript,
  and cancel the `keydown` in the correct order so that a modal dialog below stays open.
- **`showPopover({ source: trigger })`.** The browsers read `source`, but it does not stop the
  dismiss. The "topmost clicked popover" step ignores `source`, so a press on the trigger still
  hides the tooltip. The probe measured a closed tooltip after the press in all three browsers.
- **A temporary `popovertarget` on the trigger for the press.** It works, but only on `<button>` and
  `<input>`. Tooltip triggers can be any element. Chrome also exposes the trigger as expanded while
  the attribute is set.
- **Re-show in the `toggle` handler.** `toggle` fires in a later task. Chrome paints 1 closed frame.
  Firefox and Safari start the entry transition again (opacity near 0 at 30 ms).
- **The `actionFeedback` chip (branch `areardon/tooltip-copy-feedback`).** Too big: a new API and a
  migration of many call sites. Repeated keyboard presses pile up chips. It needs top-layer changes
  that are not behind a gate.
- **Re-show when `content` changes after a press (no new API).** `content` is a `ReactNode`. Inline
  JSX changes identity on every render, so the tooltip would re-show after any re-render. This was
  already rejected in
  [`tooltip-pointer-dismissal.md`](./tooltip-pointer-dismissal.md#content-changes-after-a-press-decided-2026-09-21).

## Dependency on the event order

The design depends on one browser behaviour: **the browser runs light dismiss for a press before it
dispatches `pointerup` to page listeners, in the same task.** Chrome 153, Firefox 153 and Safari 27
all do this. The design also depends on `toggle` coalescing: the browser queues the `toggle` event,
so a show in the same task turns `open -> closed` into one `open -> open` event.

If an engine changes this order, one of two things happens:

- The dismiss runs after the listener. `showPopover()` does nothing, the dismiss then hides the
  tooltip, and it stays closed.
- The dismiss runs in a separate task. The browser can paint a closed frame, and the tooltip
  flickers.

The jsdom unit tests use a popover polyfill, so they cannot detect either change. The guard is the
real-browser test
`platform/packages/design-system/tooltip/__tests__/playwright/stay-open-on-trigger-click.spec.tsx`.
It samples the open state on every frame from `pointerdown` to 20 frames after `click`, and fails on
a closed frame, a restarted transition or a `-> closed` toggle. The test was checked against two
mutants in Chromium: with the re-show blocked, and with the re-show moved to `toggle`. It fails for
both.

`@atlaskit/tooltip` does not opt in to `atlassian.integrationTests.additionalBrowsers`, so CI runs
that test on Chromium only. The same assertions were run by hand against real Firefox 153 (WebDriver
BiDi) and real Safari 27 (`safaridriver`) on 2026-09-28.

## Consequences

- The prop is the recommended way to show click feedback in the tooltip. It replaces the separate
  "copied" popup pattern. The three components that used the popup now use the prop. See
  [`tooltip-pointer-dismissal.md`](./tooltip-pointer-dismissal.md) and
  [`copied-popup-lifetime.md`](./copied-popup-lifetime.md).
- The tooltip still closes on pointer leave, blur, scroll, Escape and a press outside.
- The prop adds no live region. This note does not verify whether a screen reader announces the new
  content.
