# Follow-up: enforce the custom `popupComponent` container contract

## Context

On the top-layer path a size cap reaches `Popup`'s content only through the popover host's first
child. `Popover` is `display: flex` with a `& > *` rule that sets `flex-grow: 1`,
`min-inline-size: 0` and `min-block-size: 0`, and the size recipe never looks past that child. A cap
that works therefore depends on a six-point contract on the consumer's container:

1. **Exactly one in-flow root.** A second in-flow root becomes a second flex item, laid out in a row
   beside the first.
2. **The root in flow**, not `position: absolute` or `fixed`. An out-of-flow root is not a flex
   item, so `flex-grow` and cross-axis stretch never reach it.
3. **A non-`visible` computed `overflow` ON THE ROOT ITSELF**, so the root is the scroll container.
   The `min-*-size: 0` reset caps the root's BOX whatever its `overflow` is (see
   [../decisions/fit-available-space.md](../decisions/fit-available-space.md) → _The child
   `min-*-size: 0` reset_); what a `visible` root loses is the scrolling, so its content spills out
   of a correctly-sized box.
4. **Block size left `auto`**, so cross-axis stretch can size it.
5. **Inline size not pinned above the cap, and not `flex-shrink: 0`.**
6. **The `overflow` on the root, not on a descendant.** `& > *` reaches exactly one level.

Since 2026-09-10 the contract is stated in the `PopupComponentProps` docblock
(`popup/src/types.tsx`). Nothing types it and nothing warns about it.

### Why the contract is on the consumer

PR2 of [../plans/should-fit-viewport.md](../plans/should-fit-viewport.md) planned to own `overflow`
from the host side rather than forward sizing props. That was never implemented: both adapters
forward `shouldFitViewport` to the container, and the host stays `overflow: visible` so the
surface's `box-shadow` is not clipped. The reason is jql-builder's `FixedWidthPopupComponent`, which
declares `overflow: visible` deliberately and carries the elevation shadow, so owning `overflow`
from the host would have been actively wrong there. The consequence, that the contract moved onto
the consumer, was not written down at the time.

## In-tree containers that break it

| container                                           | which point | why                                                                                                                    |
| --------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| jql-builder basic-picker `FixedWidthPopupComponent` | 3           | `overflow: visible` **deliberately**, and it carries the elevation shadow.                                             |
| avp `NonScrollingPopupContainer`                    | 3           | Refuses overflow by design, and says so in its own docs. Currently opted out of fitting.                               |
| `RoutingHistoryTriggerFilter`                       | 3, 6        | No CSS on the root at all; the inner `Box` is `overflow: visible`.                                                     |
| mercury `AIPopup` / `Glow.tsx`                      | 1, 2, 6     | Extra nesting, and an absolutely-positioned glow border that tracks the clamped root while the content spills past it. |
| `SurveyInsightsPopup`                               | 1, 6        | `overflow: hidden`, but conditional double nesting.                                                                    |
| both `HelpSpotlightPopup` twins                     | 3           | Zero CSS on the root. Currently opted out of fitting.                                                                  |

## Consequence

Their BOX is capped like anyone else's, so the flip and the size are pinned, but their content
spills out of it because nothing scrolls. A spill is not something a snapshot of the host catches.

Of ~185 `popupComponent` sites, 14 reference `shouldFitViewport` and 4 act on it, all keyed on
`(!shouldRenderToParent || shouldFitViewport)`. `shouldRenderToParent` is deliberately not forwarded
on the top-layer path (see [../migrations/popup-migration.md](../migrations/popup-migration.md) →
_No-op props_), so those four receive `undefined` and the branch reads as "fitting applies".
Correct, and since 2026-09-10 by recorded decision rather than by accident.

## Suggested implementation

A dev-only warning when a fitting popover's first child has a computed `overflow` of `visible`.
Cheap (one `getComputedStyle` read in a layout effect that already runs), and estimated to catch
five of the six points.

**Why it is not in this PR.** It would fire in every consumer test suite that forces the gate on
(adminhub, for one, mocks `checkGate` to `true`, so `platform-dst-top-layer` runs ON in its jest
shards), and many jest setups fail on `console.warn`. It needs its own rollout: land the warning
behind a condition those suites can control, or fix the six containers first.

## Test coverage to add

No baseline exercises a real non-scrolling container. The behaviour is covered on all three engines
only in the abstract, by `the cap reaches a child that does NOT scroll` in
`__tests__/playwright/fit-available-space.spec.tsx`. Treat the six containers above as a pre-100%
checklist (the rollout list is in
[../migrations/popup-migration.md](../migrations/popup-migration.md) → _Risks when flag is turned
on_), and once the warning exists add a `popupComponent` shaped like one of them to
`popup/examples/98-testing-fit-viewport.tsx`, so the warning has a test that fires it.

## Related code

- `popup/src/types.tsx` — the `PopupComponentProps` docblock that states the contract
- `popup/src/popup-top-layer.tsx`, `popup/src/compositional/popup-content-top-layer.tsx` — where
  `shouldFitViewport` is forwarded and `shouldRenderToParent` is not
- `top-layer/src/popover/popover.tsx` — the `display: flex` host and its `& > *` rule
- `top-layer/__tests__/playwright/fit-available-space.spec.tsx` — the abstract non-scrolling case
