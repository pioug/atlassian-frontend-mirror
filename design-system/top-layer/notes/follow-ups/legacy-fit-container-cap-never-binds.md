# Follow-up: legacy `<Popup shouldFitContainer shouldFitViewport>` is never capped

## Context

On the LEGACY path, combining the two props leaves the popup uncapped: it renders its full content
height and runs off the bottom of the viewport with the controls at its end out of reach, which is
the symptom `shouldFitViewport` exists to prevent. The top-layer path caps it correctly.

Photographed by the flag pair in
`popup/src/__tests__/informational-vr-tests/popup-top-layer.vr.tsx`, fixture
`shouldFitContainer and shouldFitViewport together`. In the flag-OFF baseline the content's 100px
bands run past the frame edge and the sticky footer never appears; in the flag-ON one the footer is
pinned at the bottom of a capped scrollport, 5px clear of the viewport bottom.

This is a legacy-path defect, independent of the top-layer work. Nothing in this branch caused it
and nothing on the top-layer path can fix it.

## Mechanism

Two forcings in `popup/src/popup.tsx`, both keyed off `shouldFitContainer`:

```tsx
shouldRenderToParent={shouldRenderToParent || shouldFitContainer}
strategy={shouldFitContainer ? 'absolute' : strategy}
```

`shouldFitContainer` also wraps the trigger and the popup in a `position: relative` box, so the
popup's offsetParent is that box rather than the viewport. Popper's `maxSize` modifier
(`popper/src/max-size.tsx`) then computes, for a `bottom` placement:

```js
maxHeight = viewport.height - popperOffsets.y - viewportPadding;
```

The comment on that line reads `// Viewport-relative position of popper`, and under
`strategy: 'absolute'` it is not: `popperOffsets.y` is relative to the always-relative wrapper, so
it is a small constant (~29 measured, at any scroll position) instead of the popup's true viewport
offset (~530 in the fixture). The cap comes out around `720 - 29 - 5 = 686px`, far larger than the
~190px actually available, so it never binds. The error grows with the trigger's distance down the
page: the further down the popup is, the more the cap over-estimates.

The `top` branch of the same modifier reads `state.rects.reference.y`, which IS viewport-relative,
so a `top`-placed popup with `shouldFitContainer` is likely to cap correctly. Worth checking before
assuming the whole modifier is affected.

## What a fix looks like

Either resolve the popper offset to the viewport before subtracting (add the offsetParent's own
viewport offset when `strategy === 'absolute'`), or stop forcing `strategy: 'absolute'` for
`shouldFitContainer` and size the popup to the trigger some other way. The first is contained to
`max-size.tsx`; the second touches how `shouldFitContainer` works.

Neither is urgent for the top-layer rollout, which is why this is a note rather than a change: the
flag-ON path already caps, so the defect disappears wherever `platform-dst-top-layer` is enabled. It
matters for consumers still on the legacy path, and for anyone reading the flag pair and mistaking
the legacy half for a top-layer regression.

## Related

- [../decisions/fit-available-space.md](../decisions/fit-available-space.md) → _Update (2026-09-10):
  known limitations_
- `popup/src/internal/get-popup-axis-sizes.tsx` — what the prop pair maps to on the top-layer path
