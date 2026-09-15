# Follow-up: decide what a bare `width` in `<Popup xcss>` means on the top-layer path

## Context

`<Popup>`'s `xcss` is a `StrictXCSSProp` over padding and `width` only (`popup/src/types.tsx`).
Passing BOTH renders a different width on each code path:

| path                                 | surface | the element carrying `xcss` |
| ------------------------------------ | ------- | --------------------------- |
| legacy                               | 280px   | 248px                       |
| top-layer (`platform-dst-top-layer`) | 312px   | 280px                       |

Measured 2026-09-11 off
`popup/src/__tests__/informational-vr-tests/__snapshots__/popup-top-layer/xcss-width-and-padding-on-a-standard-popup--light--platform-dst-top-layer-{true,false}.png`,
with `width: 280px` and `space.200` padding.

The mechanism is the element the declarations land on. Legacy applies `xcss` to the popup container
itself, which is `box-sizing: border-box`, so `width: 280px` is the whole box and the padding eats
into it. The top-layer adapter has no `className` seam on `PopoverSurface` by design, so it applies
`xcss` to a `<div>` INSIDE the surface (`popup-top-layer.tsx`, and the same shape in
`compositional/popup-content-top-layer.tsx`). That inner `<div>` is `content-box`, so `width: 280px`
excludes its own padding, and the surface wraps it at 280 + 2 × 16 = 312px.

Nothing is wrong with either element in isolation. The defect is that one consumer declaration means
two things.

## Why the existing tests missed it

`popup/__tests__/playwright/fit-viewport.spec.tsx` covers `xcss` reaching the DOM, and it passes on
both paths, because its fixture passes `width` alone — where the two boxes agree at 280px. The
divergence needs `width` AND padding together. The jsdom tests added 2026-09-11 on both adapters
assert which ELEMENT carries the class, not what it computes to, so they agree with both renderings.

## Call sites at risk

Any site passing padding alongside `width`. The `width` values in tree are a link picker at 464px
and a session card at 240px; a 32px widening at either is a visible layout change, not a rounding
difference.

## The decision a fix has to make

Not "make them the same" — there are two defensible targets, and the choice changes what a bare
`width` (no padding, the common case) means:

1. **`box-sizing: border-box` on the wrapper.** The padded case matches legacy. A bare
   `width: 280px` still means 280px, so nothing moves for consumers who pass only `width`. Cheapest,
   and it keeps the surface the size the consumer asked for.
2. **Apply `xcss` to the surface instead.** Needs `PopoverSurface` to grow a `className` or `xcss`
   prop, which it refuses by design (see its docblock: "Presentational primitive - `children`-only
   by design"). Truest to legacy, most invasive.
3. **Leave it and narrow the type.** Drop `width` from the allowed keys on the top-layer path and
   make the wrapper's sizing the consumer's problem. Breaks the ~58 `shouldFitViewport` sites and
   both named call sites above, so only worth stating to reject.

Option 1 is the cheap one; the reason it is not done here is that this change adds tests only, and
picking a box model for a public styling seam belongs with whoever owns `xcss` on `Popup`.

## Related

- [../decisions/fit-available-space.md](../decisions/fit-available-space.md) → _Update (2026-09-10):
  known limitations_
- [custom-popup-component-contract.md](./custom-popup-component-contract.md) — the neighbouring
  seam, where the consumer's container rather than the consumer's `xcss` meets the cap
- `popup/src/__tests__/informational-vr-tests/popup-top-layer.vr.tsx` — the flag pair that found it
