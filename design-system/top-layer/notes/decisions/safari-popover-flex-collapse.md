# Safari top-layer flex collapse

## Status

**Fixed for `Popover` (2026-07-09) — `height: auto` added to the `Popover` reset. The `Dialog` reset
is deliberately left unfixed; see [Decision](#decision-fix-popover-not-dialog) below.**

The Safari `[popover]` / `<dialog>` flex-collapse bug fixed in `@atlaskit/pragmatic-drag-and-drop`
([PR 394379](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/394379)) also
affects `@atlaskit/top-layer`. An earlier investigation (2026-07-07) concluded it did not, because
the reproduction placed the scrollable body on a consumer card with a **fixed** height. That shape
does not trigger the bug. The real Trello structure uses a `max-height: 100%` column with a
`flex: 1 1 auto` scroll child, which does reproduce it — see **Reproduction** below.

---

## The bug

Safari applies the spec user-agent value `width: fit-content; height: fit-content` to top-layer
elements (`[popover]` and `<dialog>`). The block-axis `fit-content` is an **indefinite** height.

The collapse triggers when, inside that top-layer element:

- the content root is a flex column with `max-height: 100%` and **no definite height**, and
- it has a `flex: 1 1 auto; overflow-y: auto` child.

`max-height: 100%` then resolves against the indefinite ancestor, and on WebKit the flexible
`overflow: auto` child collapses the whole column to ~0px. Chromium and Firefox resolve it to the
content height. This is the exact shape of a Trello list (`.m-list` + `.listCards`).

---

## Reproduction (empirical)

Measured `scrollBody.clientHeight` (and the column height) for a shown top-layer element containing
the Trello-shaped column, across engines:

| Engine                           | No reset (`fit-content`) | With `height: auto` |
| -------------------------------- | ------------------------ | ------------------- |
| Chromium 143                     | content height (fine)    | content height      |
| Firefox 144                      | content height (fine)    | content height      |
| WebKit 18.4 (Playwright)         | **~0px (collapsed)**     | content height      |
| WebKit 26 (Playwright)           | **~0px (collapsed)**     | content height      |
| Real Safari 26.5 (via WebDriver) | **~0px (collapsed)**     | content height      |

Key findings:

- The collapse only reproduces for an element promoted to the **top layer** (a shown `[popover]` /
  `<dialog>`). A plain in-flow `fit-content` `<div>` does not trigger it.
- It is **not** fixed in current Safari (26.5) — the reset is genuinely required.
- `height: auto` alone fixes it; `width: auto` is **not** needed and is deliberately avoided so
  anchor-width matching (`useWidthFromAnchor`) is unaffected. Confirmed the popover width is
  identical with and without the fix.

---

## The fix

Add `height: auto` to the `Popover` user-agent reset (`src/popover/popover.tsx`, `styles.root`),
overriding the UA `height: fit-content`. Applied to every popover.

Width is intentionally left as the UA default: for `Popover`, `width` is meaningful for anchor-width
matching, so only the block axis is reset. `Popover` is a clean place to fix this because it sets
`inset: auto` and is anchor-positioned, so `height: auto` resolves to the content height with no
layout side effects.

## Decision: fix Popover, not Dialog

`Dialog` was **not** given the `height: auto` fix, on purpose.

Unlike `Popover`, a modal `<dialog>` keeps the user-agent default `inset: 0` (block-start and
block-end both `0`). Setting `height: auto` therefore stretches the `<dialog>` to fill the viewport
height, which collapses the block-axis `margin: auto` centering and top-anchors the content. The
only way to re-center a full-height box is an explicit centering layout
(`display: flex; align-items: center; justify-content: center`).

That approach works (verified on WebKit that the flex column no longer collapses, and on Chromium
that content-sized dialogs re-center), but it has real costs:

- **It violates the primitive's contract.** `Dialog` documents itself as having _no layout
  opinions_; consumers provide their own styling. Baking in centering forces a layout opinion onto
  the primitive and onto every consumer.
- **It creates an opt-out coupling.** Every consumer that manages its own positioning would have to
  reset `display: block` to escape the centering. `@atlaskit/modal-dialog` (block flow, top-aligned)
  needs exactly that; `@atlaskit/drawer` is immune only because its surface fills the box. Future
  top-layer `Dialog` consumers are far more likely to be layout-owning packages that would hit the
  same surprise.
- **The real consumers do not need it.** Every product consumer of the `Dialog` primitive
  (`modal-dialog`, `drawer`, nav) sets its own height and never hits the collapse. The collapse only
  affects a `max-height: 100%` flex column placed directly inside a bare `<dialog>`, a shape that
  today exists only in these test examples.

So the collapse is left for a `Dialog` consumer to handle (bound the column height, or apply their
own `height: auto` reset on their surface) if they ever build that shape. This keeps the primitive
unopinionated and avoids a permanent footgun for present and future consumers.

> **Follow-up:** document this Safari `<dialog>` limitation for consumers publicly. Tracked in the
> "Known limitations" section of the package `README.md`.

---

## Regression guard (Popover)

Only `Popover` is guarded, matching the fix.

- **Example:** `examples/154-testing-safari-flex-collapse-max-height.tsx` — renders the
  Trello-shaped column (`max-height: 100%` + `flex: 1 1 auto; overflow-y: auto` `<ol>`) directly
  inside a `Popover` (and a `Dialog`, kept as a manual repro of the unfixed dialog behaviour), with
  **no drag and drop**.
- **Spec:** `__tests__/playwright/safari-flex-collapse.spec.tsx` — opens the popover and asserts the
  scroll body has a non-zero rendered height. It leaves the surface open (does not close it) to
  avoid the known Playwright-WebKit interactive close-hang for this package.
- **WebKit coverage:** top-layer opts into the `desktop-webkit` integration browser via
  `package.json` -> `atlassian.integrationTests.additionalBrowsers`, so the spec runs on Safari
  (WebKit) in CI alongside Chromium and Firefox.
- **Informational VR:** `examples/153-testing-safari-flex-collapse.tsx` and
  `__tests__/informational-vr-tests/safari-flex-collapse.vr.tsx` provide a visual `desktop-webkit`
  baseline of the open popover.

---

## Upstream bug status

There is no dedicated WebKit bug report for this collapse. The closest tracked item is the WHATWG
HTML spec issue [whatwg/html#11176](https://github.com/whatwg/html/issues/11176) ("Popover and
dialog elements with lots of content can be inaccessible"), which targets the same user-agent
`fit-content` root cause and proposes a user-agent `max-height` default. The collapse is best
understood as an emergent interaction of two per-spec behaviors (user-agent `fit-content` sizing on
top-layer elements plus the flexbox `min-height: auto` default), which is likely why it is a spec
gap rather than a filed WebKit defect.

---

## References

- [pdnd PR 394379](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/394379)
  — original Safari fix.
- [whatwg/html#11176](https://github.com/whatwg/html/issues/11176) — WHATWG spec issue on
  popover/dialog `fit-content` overflow accessibility; the closest upstream tracking of the root
  cause.
- `packages/pragmatic-drag-and-drop/core/src/util/popover-reset-styles.ts` — the pdnd reset.
- `src/popover/popover.tsx`, `src/dialog/dialog-content.tsx` — top-layer user-agent resets.
- Trello list source (`trello/web`): `app/src/components/List/List.module.less`,
  `ListCards.module.less`, `useListHeaderAsDragHandle.ts`.
