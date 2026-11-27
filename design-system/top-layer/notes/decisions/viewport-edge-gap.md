# Decision: every anchored popover keeps a gap to the viewport edge

**Date:** 2026-11-26. **Status:** decided and implemented.
`src/internal/anchor-positioning/viewport-padding-margins.tsx` writes the viewport padding margins
(`VIEWPORT_PADDING`, `5px`) for every anchored popover on the CSS path. Before this, only a fitting
popover (`'max-available'`) got them.

## Problem

An anchored popover with the default `'content'` sizes sat flush against the viewport edge when the
browser slid it to keep it on screen. The legacy `@atlaskit/popper` kept `5px`. Found by the visual
regression run that forces the top layer on (121 popup rows).

A `Select` menu had the opposite problem. It is a fitting popover, so it got the margins, and they
pushed the menu `5px` off a control that touched the viewport edge (23 rows).

## Decision

1. Every anchored popover reserves `5px` on the placement-axis side that faces the viewport, and on
   the cross-axis sides that face the viewport. So it slides and flips before it gets closer than
   `5px` to an edge.
2. The padding never moves a popover off its anchor. A start or end aligned popover has no padding
   on the anchor side. When the anchor is closer than `5px` to the edge, the popover stays lined up
   with the anchor and can touch the edge too. Legacy pushed the popover `5px` inward, off its
   trigger. We do not copy that.
3. A cross-axis size of `'match-anchor'` or `'min-anchor'` gets no cross-axis padding. A popover as
   wide as its anchor cannot pass the anchor toward the edge, so the padding would only push it off
   the anchor. This keeps a `Select` menu on its control, and a `shouldFitContainer` dropdown menu
   on its trigger.
4. The JavaScript fallback keeps no gap. It only has to be not broken.

## What we tried

Measured with a standalone harness on the real positioning modules: 6,480 static cases per browser,
plus scroll and `vertical-rl` runs, in Chrome 158, Firefox 160 (161 for the re-centre rules) and
Safari 27.

| Approach                                                                             | Result                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Margins inside `@position-try` rules, one set per fallback, in place of base margins | Same positions as plain margins for the slides. The default `position-area` alignment already slides an overflowing popover, so the slide fallbacks rarely fire. Kept for the centred cells only (point 5). |
| Insets of `clamp(0px, anchor(side), 5px)`, inline                                    | Best static result. Safari resolves the inline `anchor()` against the base cell only, so every flipped popover sat `13px` from its anchor.                                                                  |
| The same insets inside each `@position-try` rule                                     | Fixed Safari. In Chrome the popover then never picks a new position when the page scrolls. It follows its anchor off screen.                                                                                |
| Margins for every popover (this decision)                                            | Zero edge touches while the page scrolls, in Chrome and Safari. Same positions in all three engines, except the known `calc-size()` difference.                                                             |

## Known costs

- Visual regression baselines made with the legacy popup, where the example puts the trigger in the
  page corner, differ by `5px` (point 2). They need a new baseline at rollout.
- A start or end aligned popover that falls back to a centred cell sits `2.5px` off centre. The
  padding is on one cross-axis side only, and a `position-area` fallback keeps the base margins.
  This existed for fitting popovers; it now applies to every anchored popover (seen in the Spotlight
  inline fallbacks snapshot, where the caret is `2.5px` off its target). On the opposite edge the
  same popover has the padding (`5px`) on the anchor side, not the gap. See "The centred fallback
  fix" below.
- The slide to the far span keeps the padding on the anchor side, for the same reason.
- A `'min-anchor'` popover that is wider than its anchor has no cross-axis padding (point 3), so it
  can sit flush with the viewport edge. A `'min-anchor'` popover that is also fitting
  (`'max-available'` on the other axis) had the padding before this decision and loses it. No design
  system component uses that pair today.
- A `'match-anchor'` popover on a full-width anchor is `10px` narrower than the anchor, because the
  cross-axis cap is `100dvw - 2 * 5px`.
- After the page scrolls back, a popover that slid or flipped stays there. The browser keeps the
  last fallback that worked. This existed before.

## The centred fallback fix (not shipped)

**Decided 2026-11-26: we accept the `2.5px` cost.** It is rare. It needs a start or end aligned
popover, with a `'content'` or `'max-available'` cross axis, that does not fit its aligned span but
does fit centred on its anchor. With ordinary content (a 160px popover on an 80px anchor) the
harness found no case. Spotlight is the one place where it shows, because its caret points at the
target. The rest of this section records the fix, in case that changes.

A named `@position-try` rule can set margins for its own position. Four static rules, one per
centred cell, fix the `2.5px` cost and the wrong gap: 72 drift cases of 1,728 go to 0 and no other
row gets worse, in Chrome 158, Firefox 161 and Safari 27, static and scroll. The popover passes its
gap and shift through custom properties, and reads each rule name through
`var(--name, <plain cell>)`, so an element without the rules keeps the plain cell.

The rules must be in a stylesheet. An inline style cannot hold an at-rule. We tried two ways and
shipped neither:

| Way                                                   | Why not                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A style sheet added at runtime (`adoptedStyleSheets`) | We do not insert style sheets at runtime. It worked in all three engines, and inside a shadow root.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Static rules in `Popover`'s Compiled styles           | The build does not support it. `@atlaskit/ui-styling-standard/no-unsafe-selectors` rejects `@position-try`, and in CI the `Popover` base styles were lost: popovers on the JavaScript path moved to the page centre, and the centred fallback did not apply. Run alone on a small file, the Compiled babel plugin emits the rule correctly. A code review comment says the build wraps each declaration of a nested at-rule in an atomic class rule, as it does for `@media`, which is not valid inside `@position-try`. Not verified. |

The fix would need Compiled and the build to pass `@position-try` through first. The measurements
and the harness are in the spike notes (`edge-gap-spike/FINDINGS.md`).

## Not done

- A spacing value for the padding. It waits until the top-layer visual regression tests are on. See
  [../follow-ups/viewport-padding-spacing-value.md](../follow-ups/viewport-padding-spacing-value.md).
