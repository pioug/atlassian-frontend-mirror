# Follow-up: keep a gap between anchored popovers and the viewport edge

**Status:** Deferred 2026-10-02. Found by the VR run that forces `platform-dst-top-layer-tooltip` on
in every Gemini VR template.

## Problem

An anchored popover that does not fit to the available space sits flush against the viewport edge
when the browser keeps it on screen. There is no gap.

Seen in VR: townsquare `MetricPopup` (complete, percent, usd) and mercury `ActivityLogEntry` hover
(asks and focus-asks). Each one moves about 5px, to touch the edge. Their baselines were updated to
the flush position, so they show the current behaviour, not the target.

## Cause

`apply-anchor-positioning.tsx` writes the viewport padding margins (`VIEWPORT_PADDING`, `5px`) only
when `isFitting` is true, so only for `inlineSize` or `blockSize: 'max-available'`. Tooltip, and
every other popover with the default `'content'` sizes, gets no margins. The `max-*-size` backstop
already reserves `2 * 5px`, but nothing puts that space at the edge.

Note: the legacy `@atlaskit/popper` kept `5px` (`viewportPadding`) on `flip` and `preventOverflow`
for every popover.

## Target outcome

The goal is the best outcome, not parity with Popper. An anchored popover near the viewport edge
should:

1. Never touch the edge.
2. Stay aligned with its trigger. The gap must not move a start / end aligned popover off its
   trigger's edge, or a centred popover off centre.
3. Flip before it gets closer to the edge than the gap.
4. Behave the same on the CSS anchor path and the JavaScript fallback, and in every engine.
5. Use a spacing token for the gap, not a fixed `5px`. `space.100` (8px) matches the tooltip gap.

The fitting path today fails point 2. A slid popover keeps its padding on the anchor side, or sits
2.5px off centre (see `viewportFacingCrossAxisSides` in `fit-margins.tsx`). This happens because the
margins are written once, inline, before the browser chooses a fallback.

## Proposal

Give each fallback its own margins. `@position-try` rules can set margins, so each fallback can put
the gap only on the sides that face the viewport for that position. `@position-try` cannot be an
inline style, so top-layer would inject a small stylesheet (the popper adapter already injects a
zero-specificity rule into the document). Keep the keyword fallbacks as the default.

Simpler option, if the proposal does not work in every engine: write the current fit margins for
every anchored popover. This is a small change, but it keeps the alignment cost of point 2 and
spreads it to every popover.

## Next step

Build a top-layer example with popovers at each viewport edge, for each alignment and each fallback.
Test the `@position-try` margins in real Chrome, Safari and Firefox (not the Playwright builds), and
measure the gap and the alignment to the trigger. Then choose the approach.

Not yet checked: engine support for margins in `@position-try`, how it works with the slide cells,
and whether the JavaScript fallback has the same gap problem.

When this lands, update the baselines listed above, and
[../decisions/fit-available-space.md](../decisions/fit-available-space.md), which says the margins
are part of fitting only.
