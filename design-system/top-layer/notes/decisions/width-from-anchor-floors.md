# Anchor-relative size floors

**Status:** Implemented 2026-08-14 as `useWidthFromAnchor`'s `mode`. Now `useAnchoredPopover`'s
per-axis `inlineSize` / `blockSize`, and the analysis generalised from "width" to "either axis" —
see [Update (2026-08-24)](#update-2026-08-24-the-floors-under-one-hook). Amended twice on
2026-08-25: the `150px` default stopped composing with the anchor floor, and the anchor floor on a
placement axis with **nothing** fitting is now clamped to the viewport cap — see
[Update (2026-08-25, later)](#update-2026-08-25-later-the-unfitted-anchor-floor-is-clamped). The
measurements below are unchanged.

At most one floor per axis:

```css
/* 'min-anchor' */
min-inline-size: anchor-size(self-inline); /* anchor floor */

/* 'none', now 'content' — REMOVED 2026-08-24, see the update below */
min-inline-size: max-content; /* content floor */
```

`'match-anchor'` has no floor of its own. It sets `inline-size: anchor-size(self-inline)`, an exact
size.

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
`offsetWidth` / `offsetHeight` are both physical, so `measureAnchorSize` swaps them based on the
popover's computed `writing-mode`. That reproduces `self-inline` / `self-block` rather than
approximating them, so neither path relies on the anchor's width being the inline one. It is skipped
entirely when neither axis asked for an anchor-relative size, so a position-only consumer pays no
layout read.

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

Its `none-narrow-span` baseline was regenerated on 2026-08-24: with the content floor removed, that
panel now wraps rather than overflowing and being repositioned. It is the one visual record of that
change, so treat a diff there as significant rather than as drift. `min-anchor` and `match-anchor`
are unchanged.

## Update (2026-08-17): `shouldFitAvailableSpace` composes with these floors

The hazard recorded below in **Related** — a second hook resetting `min-inline-size` to `0` and
silently taking the anchor floor with it — has been removed. `@atlaskit/popper` no longer owns a
copy of the fit recipe; `useWidthFromAnchor` takes a `shouldFitAvailableSpace` option and owns this
property outright on both paths.

In fit mode each mode composes rather than being overridden:

| mode           | inline is the CROSS axis                | inline is the PLACEMENT axis             |
| -------------- | --------------------------------------- | ---------------------------------------- |
| `min-anchor`   | `min(anchor-size(self-inline), <cap>)`  | `max(150px, anchor-size(self-inline))` ‡ |
| `none`         | `0` ‡‡                                  | `150px`                                  |
| `match-anchor` | unchanged (the cap beats an exact size) | unchanged                                |

‡ **Superseded 2026-08-25.** The `150px` default no longer composes with the anchor floor; the only
`max()` left on the placement axis composes the anchor floor with an explicit `placement.minSize` —
see
[Update (2026-08-25)](#update-2026-08-25-the-default-stopped-composing-the-explicit-minimums-still-do)
below. Everything else in this table still holds.

Two points this note's analysis makes load-bearing:

- **The escape hatch below is the shape that got used.** `anchor-size()` is a length, so it composes
  inside `min()` / `max()` — which is what makes the anchor floor cappable without a measurement.
- **The content floor cannot be composed, so it gives way.** ‡‡ `max-content` is a keyword, so
  `min(max-content, <cap>)` is invalid CSS for the same reason
  `max(max-content, anchor-size(self-inline))` is. In fit mode the cap is the stronger promise, so
  `mode: 'none'` loses its content floor on the cross axis. The consequence is the one described in
  **Trade-off accepted**, in reverse: a narrow cross-axis span wraps rather than overflowing.

Note the asymmetry, which is deliberate: on the PLACEMENT axis the floor is **not** capped. There
its job is to exceed the cap, because that is what makes the popover overflow a too-small
position-area cell so `position-try-fallbacks` can flip it. See
[fit-available-space.md](./fit-available-space.md). (Narrowed on 2026-08-25: that holds only while
something is fitting, which is the mode this whole table is about. With nothing fitting the anchor
term is clamped — see
[Update (2026-08-25, later)](#update-2026-08-25-later-the-unfitted-anchor-floor-is-clamped).)

## Update (2026-08-24): the floors under one hook

`useWidthFromAnchor` is gone. Its `mode` is now `useAnchoredPopover`'s per-axis `inlineSize` /
`blockSize`, `'none'` is spelled `'content'` (`'auto'` until 2026-09-04), and both floors are
emitted from `getAnchoredPopoverSizeDeclarations` in `internal/anchored-popover-size.tsx` — the same
pure function that emits the caps, which is what makes the asymmetry above a local truth table
rather than a contract between two files. It had been wrong twice while it was a contract.

Three substantive changes, beyond the rename:

**The floors are per-axis, not inline-only.** Every declaration is derived from the resolved
placement axis, so `'min-anchor'` on a `left` / `right` placement floors the BLOCK axis, and the
same anchor-vs-content axis-coherence argument applies verbatim with `self-block` in place of
`self-inline`. The `TAnchorSizeValues` record carries one value per axis for exactly this reason.

**The content floor is removed on BOTH axes, unconditionally.** ‡‡ The 2026-08-17 update above
dropped it only in fit mode on the cross axis. It is now dropped outright, because the viewport
backstop is unconditional: `max-inline-size` / `max-block-size` are written for every anchored
popover, fitting or not, and `min-inline-size: max-content` beats any of them for content wider than
the viewport. `max-content` is a keyword and cannot be composed inside `min()`, so there was no
third option — this is the mechanical argument in **Why `min-anchor` does not get the content
floor**, applied to the cap rather than to the anchor floor.

The consequence is **Trade-off accepted** in reverse, and it is now the shipped default: a
`'content'` popover in a `position-area` span too narrow for its content wraps to that span rather
than overflowing and being repositioned. `@atlaskit/popper`, `@atlaskit/popup` and
`@atlaskit/dropdown-menu` all inherit it, and it moved one VR baseline in this package
(`popover-min-anchor-narrow-span/none-narrow-span--default.png`). A consumer that wanted the flip
should ask for `'max-available'`, which supplies a `<length>` floor that CAN compose.

‡‡ **Superseded 2026-09-04.** There WAS a third option: write the natural width as a definite
`inline-size: max-content` rather than as a min. A definite size loses to `max-inline-size`, so the
viewport backstop and the cell cap both still win, and the popover still overflows a too-narrow span
and slides. The "ask for `'max-available'`" escape never worked on the cross axis, where it is
defined to be indistinguishable from `'content'`. The natural width is now Rule 4 in
`getAnchoredPopoverSizeDeclarations`, written for `'content'` and `'max-available'` on the inline
axis and for nothing else, and the `none-narrow-span` baseline shows the slide again.

This also weakens the premise of **Trade-off accepted** above: the alternative to wrapping is no
longer "an exact `width` that caps the popover", because a definite `max-content` composes with a
`min-inline-size` floor into "at least the anchor, and the natural width above it". `'min-anchor'`
is still excluded from Rule 4, for a different reason: its one consumer is
`<DropdownMenu shouldFitContainer>`, whose legacy path sized the menu to EXACTLY the trigger's
width, so wrapping down to the anchor is the parity rendering, and the `min-anchor-narrow-span`
baseline pins it. Including it is a one-line change if a consumer ever wants the anchor floor AND
the slide. See
[fit-available-space.md → Update (2026-09-04)](./fit-available-space.md#update-2026-09-04-three-corrections-from-review).

**`'match-anchor'` gains a floor when the placement axis is capped.**
`max(<flip floor>, anchor-size(self-{axis}))`, uncapped — the `max()` was dropped on 2026-08-25, see
below. Without a floor a definite `{axis}-size` clamps silently to the max, so the popover would
shrink below the anchor size rather than flipping — a cap with no floor, which is the failure the
flip floor exists to prevent. It applies only while fitting; unfitted it would just defeat the
viewport backstop.

The floor/cap asymmetry is unchanged and is now stated in one place: the **placement-axis** floor is
never clamped, because its job is to exceed the cap; the **cross-axis** floor is clamped with
`min(floor, cap)`, because there it is a size contract and CSS min/max resolution lets a min beat a
max. (Narrowed later on 2026-08-25: the placement-axis half of that holds only while something is
fitting — see
[Update (2026-08-25, later)](#update-2026-08-25-later-the-unfitted-anchor-floor-is-clamped).)

## Update (2026-08-25): the DEFAULT stopped composing; the explicit minimums still do

`max(150px, anchor-size(self-{axis}))` is gone. That was two floors fighting over one axis, and the
`150px` term only ever won by overriding the size the consumer explicitly asked for: a 40px icon
trigger with `shouldFitContainer shouldFitViewport` rendered a 150px-wide popover. The anchor term
drives the flip on its own, since `40px + 8px gap + 5px padding` overflows any cell narrower than
53px. `150px` is now a last resort, used only when neither explicit minimum applies.

`placement.minSize` is the other **explicit** minimum, so it composes with the anchor floor rather
than replacing it: `max(placement.minSize, anchor-size(self-{axis}))`, at most one declaration. (A
first pass on 2026-08-25 made the whole chain first-wins; that was corrected the same day.
`<DropdownMenu shouldFitContainer>` maps to `inlineSize: 'min-anchor'`, whose documented contract is
a menu at least as wide as its trigger, and first-wins let `minSize: 40` return a 40px menu on a
200px trigger.)

Two consequences for this note:

- **The escape hatch above is the shape that got used on BOTH axes, in opposite directions.**
  `anchor-size()` is a length, so it composes inside `min()` on the cross axis — which is what makes
  that floor cappable without a measurement, and that clamp is untouched — and inside `max()` on the
  placement axis, where the composition is now with `minSize` rather than with the `150px` default.
  (Later the same day the placement axis gained a `min()` of its own, so `min()` is no longer
  cross-axis-only: an unfitted anchor term is clamped there too, and the two nest as
  `max(minSize, min(anchor, cap))`. See
  [Update (2026-08-25, later)](#update-2026-08-25-later-the-unfitted-anchor-floor-is-clamped).)
- **`minSize: 0` no longer removes an anchor floor**, because `max(0px, anchor)` is the anchor. That
  is intended: `minSize: 0` means "do not apply the flip floor", not "break my `min-anchor`
  contract", and it still opts out entirely on any axis with no anchor floor.

Left open at the time, and **closed later the same day**: `'min-anchor'` on the placement axis with
**nothing** fitting emitted an uncapped `min-{axis}-size: anchor-size(…)`, which defeated the
viewport backstop on that axis — the second bullet in
[../plans/one-anchored-popover-hook.md](../plans/one-anchored-popover-hook.md) → _The cap↔floor
rules are a contract between two files_. See
[Update (2026-08-25, later): the unfitted anchor floor is clamped](#update-2026-08-25-later-the-unfitted-anchor-floor-is-clamped)
below. The `minSize` composition added a second face of the question, and that one is still open: on
a **fitting** `'min-anchor'` placement axis there is no way to express "cap me but do not move me",
because the anchor floor is uncapped there and drives the flip whatever `minSize` says.

Full reasoning, and why the cap became per-axis while the floor did not:
[fit-available-space.md](./fit-available-space.md) → _Two jobs, split: a per-axis cap and a
whole-popover floor_.

## Update (2026-08-25, later): the unfitted anchor floor is clamped

The anchor floor on the **placement** axis is now `min(anchor-size(self-{axis}), <viewport cap>)`
when **nothing** is fitting, and stays uncapped as `anchor-size(self-{axis})` when something is. The
cross-axis clamp is untouched, so an unfitted `'min-anchor'` popover now gets the same
`min(anchor, cap)` shape whichever role the axis plays — for two different reasons.

Why the split, in one line each: the uncapped floor exists to exceed the **cell** cap, so the margin
box overflows a too-small cell and `position-try-fallbacks` runs. With nothing fitting there is no
cell cap on that axis — `max-{axis}-size` is the unconditional viewport backstop instead — so an
uncapped floor has no flip to drive and only makes the backstop inert. That was live:
`<DropdownMenu shouldFitContainer>` maps to `inlineSize: 'min-anchor'` with no fit value, so a
`left-*` / `right-*` placement on a trigger wider than `100dvw - 10px` floored the menu wider than
the screen.

The same test, read the other way, also decides the **JS fallback**: there is no cell there either,
whatever the axis was asked for, so a fitting placement axis takes the clamped `min(anchor, cap)`
shape on that path too and the `150px` default is not written at all. The floor cannot help there
and can hurt — see [fit-available-space.md](./fit-available-space.md) → _The JavaScript fallback_.

`placement.minSize` stays outside the clamp — `max(minSize, min(anchor, cap))` — because a literal
length the consumer wrote already overhangs the backstop on an axis with no anchor floor, so
clamping it only when the axis happens to be anchor-relative would make one input behave two ways.
And note what an unconditional clamp would and would not break: it cannot suppress a flip (the
clamped floor's margin box still exceeds any cell, since a cell is at most the viewport), but it
does silently break `'min-anchor'`'s "at least as wide as the anchor" promise for an oversized
anchor. The rule is written as "a fitting placement-axis floor is never clamped" anyway, because the
more precise version is the one a later reader collapses into `min(floor, cap)`. Measurements and
the mutation results: [fit-available-space.md](./fit-available-space.md) → _The unfitted anchor
floor is clamped; the fitting one is not_.

**What this closes, and what stays open.** Closed: the unfitted case, which is the only one
`@atlaskit/dropdown-menu` can reach — it has no `shouldFitViewport`-style prop, so neither axis ever
fits, and its menu can no longer be floored past the viewport on any placement. Still open, and now
the only face of the question: on a fitting anchor-relative placement axis there is no way to
express "cap me but do not move me". In practice that means `'match-anchor'`, reachable from
`<Popup shouldFitContainer shouldFitViewport>` on a `left-*` / `right-*` placement, and not
`'min-anchor'`, whose only consumer is the one just named. The anchor floor is uncapped there by
design, so an anchor wider than the viewport still floors the popover past the backstop, and
`minSize: 0` does not help any more because it composes as `max(0px, anchor)`, which IS the anchor.
Clamping it there is not the answer: per the paragraph above that breaks the size promise, and it is
the rule shape a later reader finishes collapsing into the real flip suppression. Expressing both
would need a third value on `TPopoverAxisSize` — do not add one without a consumer that needs it.

## Related

- Source: `src/internal/anchored-popover-size.tsx` (the floors and the caps, one function),
  `src/internal/use-anchored-popover.tsx` (the anchor measurement for the fallback path)
- [fit-available-space.md](./fit-available-space.md), which composes with both floors and explains
  the cap/floor asymmetry
- [placement-offset.md](./placement-offset.md), the cross-axis shift decision that the same VR sweep
  landed alongside
- [../plans/one-anchored-popover-hook.md](../plans/one-anchored-popover-hook.md), why the floors and
  the caps ended up in one function
