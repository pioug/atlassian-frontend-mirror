# Follow-up: move the viewport padding to a spacing value

**Status:** open. Raised by Declan Warn in the review of #568836 (2026-11-27).

## Problem

`VIEWPORT_PADDING` (`src/internal/anchored-popover-size.tsx`) is `5px`. That is the legacy
`@atlaskit/popper` value, not a value on the spacing scale.

## Why it is `5px` today

Parity with the legacy popup. The same value lets us turn on the top-layer visual regression tests
without a new baseline for every anchored popover. See
[../decisions/viewport-edge-gap.md](../decisions/viewport-edge-gap.md).

## What to do

After the top-layer visual regression tests are on, change `VIEWPORT_PADDING` to a spacing value
(for example `space.100`, `8px`, which matches the tooltip gap). Expect a new baseline for every
snapshot with a popover near a viewport edge.
