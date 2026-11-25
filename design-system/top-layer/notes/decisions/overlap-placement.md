# Overlap placement

Set `edge` to `overlap-start`, `overlap-center`, or `overlap-end` to align the popover over its
anchor.

```tsx
placement: { axis: 'block', edge: 'overlap-start', align: 'start' }
```

`edge` aligns matching edges or centers along `axis`. `align` aligns the other axis. Overlap edges
shift into view when the requested position would overflow, without flipping or using a directional
slide animation.

Use `TAnchoredPlacementOptions` from `@atlaskit/top-layer/resolve-placement` when annotating options
that may use overlap edges. `TPlacementOptions` describes adjacent placement and resolves to
`TPlacement`.

For overlap edges, `offset.gap` defaults to zero and positive values move toward the logical end
along the placement axis. `offset.crossAxisShift` moves along the other axis, with `forwards` toward
its logical end. Both accept pixel numbers and CSS lengths. If an offset uses a CSS custom property,
its value must resolve to a length (for example, `0px`) so it can be added to the anchor coordinate.

Sizing remains separate: `match-anchor` fills a cell, `min-anchor` lets a wider editor cover that
cell, and content-sized surfaces can grow independently. CSS anchor positioning follows layout
changes natively. When CSS anchor positioning or sizing is unavailable, the existing JavaScript
fallback places the popover beside the anchor. `overlap-start` and `overlap-center` use the end
edge, and `overlap-end` uses the start edge. The HTML root, body and popover are assumed to share
the same writing-mode orientation for CSS overlap.

## Inline editor example

The `overlap-inline-editor` example matches the cell width and aligns to its block-start edge. The
browser tests also cover wider editors, end alignment, and RTL.

The editor's first row matches the cell height and centers the input within that row. Logical
offsets compensate for the surface padding so the input text stays aligned with the cell. The
validation message grows below the input. Centering the whole popup would move the input away from
the cell when that message appears.
