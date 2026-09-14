# Width From Anchor Floors

**Status:** Implemented 2026-08-14

`useWidthFromAnchor` declares at most one width floor per mode:

```css
/* mode: 'min-anchor' */
min-inline-size: anchor-size(self-inline); /* anchor floor */

/* mode: 'none' */
min-inline-size: max-content; /* content floor */
```

`mode: 'match-anchor'` has no floor. It sets `inline-size: anchor-size(self-inline)`, an exact size.

## Both floors keep the same axis on both sides

A floor is only meaningful if the property and the value talk about the same axis. `max-content`
resolves along the axis of whatever property it is set on, so the content floor is automatically
consistent. The anchor floor is not automatic: `anchor-size()` accepts three different axis notions,
and only one of them lines up with `min-inline-size`.

`min-inline-size` constrains the popover's OWN inline axis, and `self-inline` is the keyword that
measures the anchor along that same axis. Measured in Chromium 143, with an anchor 240px physical
wide and 40px physical tall, and the popover in `writing-mode: vertical-rl` so its inline axis is
vertical:

| declaration on the popover                  | resolves against               | floored extent |
| ------------------------------------------- | ------------------------------ | -------------- |
| `min-inline-size: anchor-size(self-inline)` | the popover itself             | height **40**  |
| `min-inline-size: anchor-size(inline)`      | the popover's containing block | height **240** |
| `min-inline-size: anchor-size(width)`       | physical, no writing mode      | height **240** |

Only the first is coherent: 40px is the anchor's extent along the same (vertical) axis the floor
constrains. The other two floor a vertical extent with a horizontal measurement. Note that `self-`
on `anchor-size()` refers to the element USING the function, not to the anchor - the anchor's own
writing mode never participates, which is worth stating because the name suggests otherwise.

In a horizontal writing mode, which is every consumer today, all three spellings resolve
identically, so the mismatch is invisible until someone sets `writing-mode` on a popover.

The JS fallback, for browsers with no `anchor-size()` support, has no `anchor-size()` to lean on and
`offsetWidth` / `offsetHeight` are both physical, so `getFallbackAnchorInlineSize` picks between
them using the popover's computed `writing-mode`. That reproduces `self-inline` rather than
approximating it, so neither path relies on the anchor's width being the inline one.

The two floors mean different things and belong to different modes. This note records why
`min-anchor` has the anchor floor and NOT the content floor, because the two were briefly combined
and the combination does not work.

## What each floor is for

**The anchor floor** is the contract of `min-anchor`: the popover is at least as wide as the anchor,
and can grow wider if its content requires it. Being a lower bound rather than an exact size is the
only thing that separates `min-anchor` from `match-anchor`.

**The content floor** exists for a different reason, and only for `mode: 'none'`. A popover with no
anchor-relative width, placed in a `position-area` span too narrow to hold it, will wrap its content
to fit that span. Wrapping makes it look like it fits, so its margin box never overflows, so
`position-try-fallbacks` never fires and the popover stays in the narrow span as a cramped column.
`min-inline-size: max-content` stops it wrapping, so the overflow is real and the fallback chain
repositions it.

## Why `min-anchor` does not get the content floor

Two reasons, one mechanical and one about intent.

**Mechanically, the two floors cannot both be minimums.** `min-inline-size` and `min-width` are the
same property in a horizontal writing mode, so declaring one floor on each does not combine them,
and picking the logical or the physical spelling makes no difference to that. They resolve by
cascade order, the later declaration wins, and the other floor is silently discarded. The
single-declaration form that would combine them is not valid CSS, because `min()`, `max()` and
`clamp()` take numeric values and `max-content` is a keyword:

```css
/* Not valid CSS */
min-inline-size: max(max-content, anchor-size(self-inline));
```

That leaves `inline-size` (or its physical `width`) as the only other property either floor could
move to, and that is an exact size rather than a lower bound. `inline-size: max-content` would floor
the popover, but it would also cap it at one unwrapped line of content, and being an inline style it
would override a width set from a consumer stylesheet. Neither is acceptable for a mode whose name
promises a minimum.

**On intent, `min-anchor` does not need it.** The content floor solves "this popover has no width
relationship to anything, so a narrow span silently squashes it". A `min-anchor` popover is not in
that position: the anchor floor already guarantees it is at least as wide as its anchor, and the
anchor is on screen. Wrapping down to the anchor width is a reasonable rendering rather than a
failure. For the current consumer it is the requested one: `@atlaskit/dropdown-menu` maps
`shouldFitContainer` to this mode, and fitting the container is exactly what wrapping to the anchor
width achieves.

## Trade-off accepted

A `min-anchor` popover with a narrow anchor and long content, in a span too narrow for that content,
wraps into a tall column instead of overflowing and being repositioned by `position-try-fallbacks`.

That is accepted. It is the behaviour the mode has always documented, and the alternative costs the
`min-anchor` contract itself: an exact `width` that caps the popover and overrides consumer styles.
If a consumer ever needs the anchor floor AND the overflow behaviour together, that is a third mode
and not a change to this one.

## History, so this is not rediscovered

The content floor was in `min-anchor` for a while, and was inert the whole time.

`min-anchor` began as `min-trigger` on a `width` prop, implemented as a single
`min-width: anchor-size(width)` declaration, documented as "at least as wide as the trigger, but can
grow wider if content requires it".

The commit that extracted the logic into this hook and renamed the modes also introduced
`min-inline-size: max-content` for `mode: 'none'`. It was hoisted into a shared local and spread
into the `min-anchor` branch alongside `min-width: anchor-size(width)`, which is the property
collision above. The anchor floor won by cascade order, so the content floor never had any effect on
`min-anchor`, which is why the collision survived unnoticed. The docblock was never updated and
continued to describe the original single-floor contract correctly.

A later change made the content floor effective by moving it to `width: max-content`. That resolved
the collision but adopted the leak as the design, and with it the cap and the consumer-style
override. It was reverted in favour of this note.

Removing the content floor left one declaration, briefly written as
`min-inline-size: anchor-size(width)` - the logical property from the floor that had just been
deleted, with the physical value from the floor that survived. That mix was caught in review, and
the value moved to `anchor-size(self-inline)` to match the property's axis. `mode: 'match-anchor'`
was converted from `width: anchor-size(width)` at the same time, for the same reason.

## Escape hatch

If both floors are ever genuinely required on one element, the only formulation that keeps them both
as true minimums is to resolve the content width in JavaScript and emit it as a length, so that it
composes inside `max()`:

```css
min-inline-size: max(anchor-size(self-inline), 312px); /* 312px measured from content */
```

`anchor-size()` is a length, so it is valid inside `max()`. The cost is a layout read on open plus a
`ResizeObserver` to stay correct as content changes, which is the JavaScript measurement that
`anchor-size()` exists to avoid. Do not pay it without a consumer that needs it.

## Tests

`__tests__/vr-tests/popover-min-anchor-narrow-span.vr.tsx` pins the narrow-span behaviour of all
three modes side by side, which is where the difference between the floors is visible: `min-anchor`
wraps to its anchor floor, `none` overflows and is repositioned, `match-anchor` wraps to the anchor
width exactly. Two roomy-span fixtures pin which floor binds for `min-anchor` when there is space
for both.

## Related

- Source: `src/internal/use-width-from-anchor.tsx`
- `@atlaskit/popper`: `src/internal/use-fit-viewport-max-size.tsx`, the `min-inline-size: 0` reset.
  Popper only ever uses `mode: 'none'`, which is the floor that reset is for. Both floors are on
  `min-inline-size`, so it would equally neutralise the ANCHOR floor if `min-anchor` were ever
  paired with it.
- [placement-offset.md](./placement-offset.md), the cross-axis shift decision that the same VR sweep
  landed alongside
