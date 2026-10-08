# Follow-up: VR Chromium misplaces anchored popovers

**Status:** Fixed for workspace products 2026-10-08. `@atlassian/gemini` launches Chromium with
`--enable-blink-features=CSSAnchorUpdate,CSSAnchorWithTransforms`, the two fixes Chromium 144 turns
on by default. Mercury still runs an older published `@atlassian/gemini`, so its snapshots below
still record the bugs. Found by the VR run that forces `platform-dst-top-layer-tooltip` on in every
Gemini VR template.

## Problem

Gemini VR runs the Chromium that Playwright bundles, version 143.0.7499.4. That version has two
anchor positioning bugs. Current Chrome has neither. So these are bugs in the CI browser, not in
`@atlaskit/top-layer`.

1. **Scroll.** A popover anchored to an element inside a scrolled container is placed as if the
   container were not scrolled. The popover is off by exactly the container's `scrollTop`. Chrome
   154.0.8037.98 is correct. Blink feature `CSSAnchorUpdate` fixes it in Chromium 143.
2. **Transforms.** A popover is placed against its anchor's box without transforms, when the anchor
   or an ancestor has a CSS `transform`. The popover is off by exactly the reverse of the transform.
   Fixed in **Chrome 144**: Chrome for Testing 143.0.7499.192 is broken and 144.0.7559.133 is
   correct. Chrome 144 stable shipped on 2026-01-13. See
   [Anchor Positioning is transform-aware in Chrome 144+](https://www.bram.us/2025/11/20/anchor-positioning-is-transform-aware-in-chrome-144/)
   and the
   [CSSWG resolution](https://github.com/w3c/csswg-drafts/issues/8584#issuecomment-3109444615).
   Blink feature `CSSAnchorWithTransforms` fixes it in Chromium 143.

`CSSAnchorUpdate` also changes how an overflowing centred popover is placed. Chromium 143 takes the
next `position-try-fallbacks` entry (for example `block-end span-inline-end`). With the flag, and in
Chrome 144 and later, the popover stays centred and is shifted back inside the viewport, so it can
sit flush against the viewport edge.

The mercury baselines below were updated to the wrong position, so CI stays green. They record the
browser bug, not the target. Each VR file has a comment that points here. The modal-dialog baseline
was re-captured with the flags.

| Bug        | VR test                                                                                                                | Offset                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Transforms | mercury `OnboardingHierarchy - colored owned detail panel` (React Flow pan/zoom transform)                             | about 490px                   |
| Transforms | mercury asks and focus-asks `AskDatePicker` target date and propose new date popups (Popper `translate(-953px, 56px)`) | (+953, -56), outside the shot |
| Transforms | mercury `FocusAreaCheckboxFilter - target date selected` (Popper `translate(-5px, 40px)`)                              | (+5, -40)                     |
| Transforms | mercury `More Actions - action tooltip (hover)` (Popper `translate(-1000px, 40px)` on the dropdown menu)               | (+1000, -40)                  |

Files:

- `mercury/packages/onboarding/private-modules/onboarding-hierarchy/src/vr/OnboardingHierarchy.informational.vr.ts`
- `mercury/packages/{asks,focus-asks}/pages/details/src/header/date-picker/AskDatePicker.vr.tsx`
- `mercury/src/packages/FocusAreas/FocusAreaFilter/vr/FocusAreaCheckboxFilter.informational.vr.ts`
- `mercury/platform/packages/MercuryTable/commons/src/more-actions/vr/MoreActions.informational.vr.tsx`

## Evidence

Both bugs reproduce on a static page with a button that has `anchor-name` and a `popover="hint"`
element with `position-anchor` and `position-area`.

**Scroll:** a scroll container with `scrollTop = 399` around the button.

| Browser                                         | Popover top minus trigger top |
| ----------------------------------------------- | ----------------------------- |
| Playwright Chromium 143 (headless shell)        | 397px                         |
| Playwright Chromium 143 (`channel: 'chromium'`) | 397px                         |
| Chrome 154 (`channel: 'chrome'`)                | -1px to -2px                  |

The result is the same for a `static`, `relative` or `fixed` wrapper, with or without a transform,
and with or without `position-visibility: always`. In the real modal example, in Chromium 143 the
tooltip is at y 625 and the trigger at y 202 (the modal body `scrollTop` is 419). In Chrome 154 the
tooltip is next to the trigger.

**Transforms:** offset of the popover from its expected place (x, y in px).

| Case                                                   | Chromium 143 | Chrome 144, 146, 148, 154 |
| ------------------------------------------------------ | ------------ | ------------------------- |
| Trigger `translate(200px, 100px)`                      | -200, -100   | 0, 0                      |
| Trigger `scale(2)`                                     | -50, -30     | 0, 0                      |
| Ancestor `translate(100px, 60px) scale(1.8)`           | -140, -84    | 0, 0                      |
| Ancestor `position: fixed` + `translate(300px, 150px)` | -300, -150   | 0, 0                      |
| No transform                                           | 0, 0         | 0, 0                      |

Chromium 142 and 143 (both Playwright's 143.0.7499.4 and the final 143 stable) give the broken
offsets.

## Who is affected

Every gate-on VR snapshot of an anchored top-layer popover whose trigger is inside a scrolled
container, or has a transform on itself or an ancestor. Product users on Chrome 143 or older see the
same bugs.

Not yet checked: Safari and Firefox. The CSSWG change is recent, so they may still place popovers
against the untransformed box.

## Next step

1. When mercury bumps `@atlassian/gemini` to a version with the flags, re-baseline the mercury
   snapshots above and remove their comments.
2. When AFM moves Playwright to Chromium 144 or later, remove the flags from
   `platform/packages/monorepo-tooling/gemini/src/config/playwright-vr.config.ts`.
