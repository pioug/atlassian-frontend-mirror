# Fitting an anchored popover to the available space

**Status:** Implemented 2026-08-17. Fixes CONFCLOUD-83586. Reshaped 2026-08-24, when the three hooks
this recipe was split across merged into one `useAnchoredPopover` — see
[One writer per property, now inside one hook](#one-writer-per-property-now-inside-one-hook).
Amended 2026-08-25: the cap became per-axis, the `150px` default stopped composing with the anchor
floor, and `placement.minSize` now composes with it instead of replacing it — see
[Two jobs, split: a per-axis cap and a whole-popover floor](#two-jobs-split-a-per-axis-cap-and-a-whole-popover-floor).
Amended again the same day: the anchor floor on a placement axis with **nothing** fitting is now
clamped to the viewport backstop, which it used to defeat — see
[The unfitted anchor floor is clamped](#the-unfitted-anchor-floor-is-clamped-the-fitting-one-is-not).
Amended 2026-09-01: the floor is CSS-path-only, because on the JS fallback it inflates the
measurement the flip decision reads — see [The JavaScript fallback](#the-javascript-fallback).
Amended 2026-09-04, three ways, after review: the default floor is clamped against the viewport so
some cell can always hold it; a non-anchor-relative inline axis is its natural width again
(`inline-size: max-content`), which restores the slide a too-narrow span used to get; and the fit
margins pad only the viewport-facing cross side of a start / end-aligned popover — see
[Update (2026-09-04)](#update-2026-09-04-three-corrections-from-review). Every measurement below
still holds; only the API around them and the floor's value changed.

Fitting constrains an anchored popover to the space between its anchor and the viewport edge, so
oversized content scrolls inside the popover instead of growing past the viewport and putting the
controls at the bottom out of reach.

It is **one hook call**, a per-axis size value, and no component prop:

```tsx
useAnchoredPopover({
	anchorRef: triggerRef,
	popoverRef,
	placement, // required, and carries `minSize`
	isOpen,
	inlineSize: 'max-available', // 'content' | 'match-anchor' | 'min-anchor' | 'max-available'
	blockSize: 'max-available', // both default to 'content'
});
```

`Popover` needs nothing: it establishes the formatting context unconditionally.

## The declarations

All of them come from one pure function, `getAnchoredPopoverSizeDeclarations` in
`internal/anchored-popover-size.tsx`, plus `getFitMarginDeclarations` in
`internal/anchor-positioning/fit-margins.tsx` for the margin half. For a resolved placement with
axis `A`, cross axis `C`, edge `E` and gap `G`:

| property             | value                                                                                                                                                     | when                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `max-{A}-size`       | `calc(100% - 5px - {G})` — the position-area cell                                                                                                         | **`A` itself** is fitting, on the CSS path                                                     |
| `max-{A}-size`       | `calc(100d{vw\|vh} - 2 * 5px)` — the viewport                                                                                                             | otherwise — the **unconditional** backstop                                                     |
| `max-{C}-size`       | `calc(100d{vw\|vh} - 2 * 5px)` — the viewport, never the cell                                                                                             | **always**                                                                                     |
| `inline-size`        | `max-content` — the natural width, a definite size the caps beat                                                                                          | inline is `'content'` or `'max-available'`, on the CSS path, unless `shouldPreserveInlineSize` |
| `{axis}-size`        | `anchor-size(self-{axis})`                                                                                                                                | that axis is `'match-anchor'`                                                                  |
| `min-{A}-size`       | `max({minSize}, <anchor floor>)`                                                                                                                          | `minSize` was set AND `A` is anchor-rel. †                                                     |
| `min-{A}-size`       | `placement.minSize`, **never clamped**                                                                                                                    | `minSize` was set — including `0`                                                              |
| `min-{A}-size`       | `<anchor floor>`                                                                                                                                          | else `A` is anchor-relative †                                                                  |
| `min-{A}-size`       | `min(150px, max(0px, calc((100d{vw\|vh} - anchor-size(self-{A})) / 2 - {G} - 5px)))` — clamped against the VIEWPORT, never the cell                       | else anything is fitting, on the CSS path                                                      |
| `min-{C}-size`       | `min(anchor-size(self-{C}), <viewport cap>)`, **clamped**                                                                                                 | `C` is `'min-anchor'`                                                                          |
| `margin-{A}-{E}`     | `5px`                                                                                                                                                     | anything is fitting, on the CSS path                                                           |
| `margin-{C}-{side}`  | `calc({shift} + 5px)`, composed, on the viewport-facing side(s)                                                                                           | anything is fitting, on the CSS path                                                           |
| `margin-{C}-{side}`  | `{shift}`, untouched, on the anchor-facing side                                                                                                           | `align` is `'start'` / `'end'`                                                                 |
| `display`            | `flex`, scoped to `:popover-open`, unconditional                                                                                                          | `Popover`'s stylesheet                                                                         |
| `> * { flex-grow }`  | `1`, unconditional                                                                                                                                        | `Popover`'s stylesheet                                                                         |
| `> * { min-*-size }` | `0`, unconditional - so the cap can reach a non-scrolling child. Written as `:where(host) > *`, zero specificity, so a minimum the child sets itself wins | `Popover`'s stylesheet                                                                         |

At most one `min-{A}-size` declaration is written, and the rows are read top down. The two EXPLICIT
minimums — `placement.minSize` and the anchor floor — **compose** as `max()`, because both were
asked for and `max()` is the operator for "satisfy both". The `150px` default is the only
alternative: it never composes with either, because nobody asked for it. A knock-on worth stating:
`max(0px, anchor-size(…))` is the anchor size, so `minSize: 0` removes the flip floor but not an
anchor floor. † `'min-anchor'` takes the anchor floor whether or not anything is fitting;
`'match-anchor'` takes it only where there is a flip for it to drive, because otherwise there is
nothing to flip out of and the cap already beats its definite `{axis}-size`, so a floor would buy
nothing.

`<anchor floor>` is the one term whose clamping depends on whether there is a cell for it to
overflow:

| `<anchor floor>` on `A`             | when                                   | why                                                 |
| ----------------------------------- | -------------------------------------- | --------------------------------------------------- |
| `anchor-size(self-{A})`             | anything is fitting, on the CSS path   | it must exceed the CELL cap to drive the flip       |
| `min(anchor-size(self-{A}), <cap>)` | nothing is fitting, or the JS fallback | no cell cap exists — `max-{A}-size` is the backstop |

Only the anchor term is clamped, never the composition around it:
`max({minSize}, min(anchor, <cap>))` rather than `min(max({minSize}, anchor), <cap>)`.
`placement.minSize` is a literal length the consumer wrote and it already overhangs the backstop on
an axis with no anchor floor, so clamping it only when the axis happens to be anchor-relative would
make one input behave two ways. See
[The unfitted anchor floor is clamped](#the-unfitted-anchor-floor-is-clamped-the-fitting-one-is-not).

`viewportPadding = 5px` and the default gap are carried over from legacy `@atlaskit/popper`, so a
migrating consumer keeps the same clearance from the viewport edge.

Everything is written with **logical** properties — `inline-size` / `block-size`,
`anchor-size(self-inline)`. The one physical spelling is deliberate: the viewport unit is `dvw` /
`dvh` picked from the popover's measured `writing-mode`, because the logical `dvi` / `dvb` follow
the ROOT element's writing mode (css-values-4), not the popover's, so they cap the wrong axis
whenever the two differ. A wrong pairing is invisible in a horizontal writing mode, which is why
`anchored-popover-size.test.tsx` asserts the vertical case explicitly.

### The four axis values, and the four rules that fill them in

- **`'content'`** writes no author size on the block axis and `inline-size: max-content` on the
  inline axis (Rule 4). **`'match-anchor'`** is `{axis}-size: anchor-size(self-{axis})`.
  **`'min-anchor'`** is `min-{axis}-size: anchor-size(self-{axis})`. **`'max-available'`** caps.
- **`'max-available'` means a different reference on each axis**, because the reference follows the
  axis ROLE, not the axis. On `A` it is the CELL; on `C` it is the VIEWPORT — see
  [Why the cross axis is capped to the viewport](#why-the-cross-axis-is-capped-to-the-viewport-not-the-cell).
  A consequence: on the cross axis `'max-available'` and `'content'` emit exactly the same
  declarations, because the viewport cap is written either way. Cross-axis fit is only observable
  through Rule 1.
- **Rule 1 — fitting mirrors onto a `'content'` axis, and feeds the CAPS.** If either axis asked to
  fit, an axis still on `'content'` fits too. It only ever fills `'content'`; an explicit value is
  never overridden. `placement` can be auto-resolved, so a consumer cannot always tell which axis is
  the placement axis — and `blockSize: 'max-available'` on a `left` / `right` placement still has to
  cap the cell, which is on inline there. The mirror is a **per-axis** record, and the cap reads it,
  so `'max-available'` on one axis caps that axis and says nothing about the other.
- **Rule 2 — fitting ANYTHING floors the placement axis, on the CSS path.** `min-{A}-size` turns on
  whenever either axis asked to fit, whatever value `A` itself was given, because flipping is a
  whole-popover outcome. Its value composes the two explicit minimums — `placement.minSize` and the
  anchor size when `A` is anchor-relative — as `max()`, uses whichever applies alone, and falls back
  to `FALLBACK_MINIMUM_MAIN_AXIS_SIZE` (150px, clamped against the viewport so the roomier cell can
  always hold it — see [Update (2026-09-04)](#update-2026-09-04-three-corrections-from-review)) only
  when neither does. An explicit `minSize` always beats that default, **including `minSize: 0`** —
  the "cap me but do not move me" escape hatch, which works on any axis with no anchor floor.
  `resolvePlacement` leaves `minSize` `undefined` rather than defaulting it, precisely so `0` stays
  distinguishable from unset. The rule is CSS-path-only because a floor is a flip driver and the JS
  fallback has no cell to overflow; `minSize` still applies there, see
  [The JavaScript fallback](#the-javascript-fallback). Why the floor exists at all:
  [the cap alone suppresses `position-try-fallbacks`](#the-cap-alone-suppresses-position-try-fallbacks);
  why the cap is per-axis and this is not:
  [Two jobs, split](#two-jobs-split-a-per-axis-cap-and-a-whole-popover-floor).
- **Rule 3 — the viewport backstop is not optional.** `max-inline-size` and `max-block-size` against
  the viewport are written for every anchored popover, fitting or not, whatever the axis values are.
  That is also a bug fix: a `'match-anchor'` popover on a trigger wider than the viewport used to be
  able to overhang the screen. A floor beats a cap in CSS min/max resolution, so the one thing that
  could still defeat it — an anchor floor on a placement axis with nothing fitting — is clamped to
  it; see
  [The unfitted anchor floor is clamped](#the-unfitted-anchor-floor-is-clamped-the-fitting-one-is-not).
- **Rule 4 — a non-anchor-relative inline axis is its NATURAL width.** `inline-size: max-content` is
  written whenever the inline axis is `'content'` or `'max-available'`. Under `position-area` the
  containing block is the cell, so a CSS `auto` inline size shrink-to-fits a `span-*` cell too
  narrow for the content and wraps into it, which never overflows and so never slides to the roomier
  side. `max-content` keeps the overflow real; being a definite size rather than a min, the caps
  still beat it, which is what the `min-inline-size: max-content` it replaces could not offer. Not
  written on the block axis, where block flow does not wrap, and not for `'min-anchor'`, whose
  contract is to wrap down to the anchor. See
  [Update (2026-09-04)](#update-2026-09-04-three-corrections-from-review).

### Why `100%` is the available space

The host carries `position-area`, and css-anchor-position-1 makes the position-area region the box's
containing block, with an explicit note that "some property values, like `max-height: 100%`, will be
relative to the position-area as well". So `100%` on the placement axis is the distance from the
anchor edge to the viewport edge — no measurement, no listeners, no custom properties. Percentages
do not subtract margins, so the gap (a real margin, written by `edgeMargin`) and the reserved
padding are subtracted explicitly.

The cell also follows whichever side `position-try-fallbacks` settles on, so the cap tracks a flip
with no recomputation.

### Why the cross axis is capped to the viewport, not the cell

Legacy `maxSize` capped the cross axis at `viewport.{width,height} - 2 * viewportPadding`. For a
`span-*` placement the cell is narrower than the viewport, so capping to the cell would make content
that fits on screen today start wrapping. The units are the dynamic-viewport units `dvw` / `dvh`,
each picked from the popover's measured `writing-mode` so that it constrains the axis its property
names. NOT the logical `dvi` / `dvb`: those resolve against the root element's writing mode, so in a
popover whose writing mode differs from the document's they would cap the other axis. They are
Baseline 2022, comfortably below the CSS Anchor Positioning floor that gates this path.

## The cap alone suppresses `position-try-fallbacks`

This is the part that is easy to miss and is the reason for the floor.

Overflow detection uses the box's own margin box **after** the clamp — css-anchor-position-1 §6.5:
"Descendants overflowing el don't affect this calculation, only el's own margin box". A clamped
popover therefore never overflows, no fallback is ever tried, and it stays on the side the consumer
asked for and shrinks. Next to a trigger near the viewport edge that means a few unusable pixels: in
the ticket's geometry, a 53px letterbox.

Legacy popperjs did the opposite by construction. Its `maxSize` modifier declared
`requiresIfExists: ['offset', 'preventOverflow', 'flip']` and ran in `beforeWrite`, so it capped the
**post-flip** placement. Reproducing that is a parity requirement, not a nice-to-have.

### The fix: a floor on the placement axis

`min-{A}-size: 150px` makes the margin box genuinely overflow once the cell is smaller than the
floor, so **ordinary overflow detection fires and the fallback chain runs normally**. No
engine-specific keyword is involved. This is the CSS transliteration of Floating UI's documented
`size()`-before-`flip()` ordering, and it is what Blink's layout lead recommended for this exact
problem in csswg-drafts#13617.

Because overflow is measured on the margin box, the flip threshold is `floor + gap + padding`: the
popover moves once the cell is smaller than that. At the default floor that is `150 + 8 + 5 = 163`.
The threshold is not a constant — it moves with whichever floor Rule 2 picked, so an anchor-relative
placement axis on a 40px trigger flips at `40 + 8 + 5 = 53` instead. Same mechanism, smaller number;
see [Two jobs, split](#two-jobs-split-a-per-axis-cap-and-a-whole-popover-floor).

Measured on the ticket geometry and on the two cases that bracket it — **identical in Chromium,
Firefox and WebKit**, and pinned by `__tests__/playwright/fit-available-space.spec.tsx`:

| case                                                     | cap only (the bug) | cap + floor                  |
| -------------------------------------------------------- | ------------------ | ---------------------------- |
| A — 40px below / 340px above, 200px content              | below, **27px**    | **above, 200px**, no scroll  |
| B — 180px below / 200px above, 100px content (fits)      | below, 100px       | below, 150px — **stays put** |
| C — ticket 320x256, trigger low (66/170), 400px content  | below, **53px**    | **above, 157px**, scrolls    |
| D — ticket 320x256, trigger high (176/60), 400px content | below, 163px       | below, 163px — unchanged     |

### The cost, accepted

Case B is the trade: the floor pads a 100px popover to 150px. A fitting popover has a minimum size.
That is worth it for portable flip behaviour, and it is why fitting stays **opt-in** — see
[Not doing](#deliberately-not-doing).

Revisit when `max-block-size: calc-size(stretch, min(size, MAX))` is portable. That formulation says
"cap to the cell, but only if the content is taller" directly and needs no floor at all. It is
Chrome-only today and will never ship in Firefox, so a two-branch `@supports` version is the most
that is available.

### Where the floor is NOT capped, and why that matters

An anchor floor on the **cross** axis is composed with the cap as `min(floor, cap)` — there the
floor is a size contract (a full-width `min-anchor` trigger would otherwise floor the popover wider
than the viewport, because CSS min/max resolution lets a min beat a max).

On the **placement** axis, while anything is fitting, the floor must stay uncapped. Its whole job
there is to exceed the cap, because that is what makes the box overflow a too-small cell.
`min(floor, cap)` there collapses the floor onto the cap and silently restores the flip suppression
the floor was added to fix. This was written the wrong way first and caught by the inline-axis test.

With **nothing** fitting the placement-axis anchor floor IS clamped — see
[The unfitted anchor floor is clamped](#the-unfitted-anchor-floor-is-clamped-the-fitting-one-is-not).

## Two jobs, split: a per-axis cap and a whole-popover floor

**Decided 2026-08-25.** "Fitting" was doing two unrelated jobs off one whole-popover `isFitting`
boolean: capping, and enabling the flip. They are now separated, because they do not have the same
scope.

**The cap is per-axis.** Each axis has its own available space, so `'max-available'` on one axis
caps that axis and says nothing about the other. Rule 1's mirror still fills an axis left on
`'content'` — that is the one thing it can meaningfully mirror, and it is now what the cap reads.
Its record used to be dead code (`isFitting` was computed from the raw values, and every read tested
only for `'match-anchor'` / `'min-anchor'`, values the mirror can never produce), so replacing it
with the raw options changed no output for any input. It is now load-bearing: it is what decides
cell cap versus backstop.

**The floor is not per-axis, and stays whole-popover.** Its job is to make the margin box overflow a
too-small cell so ordinary overflow detection fires and `position-try-fallbacks` moves the popover.
Flipping is a whole-popover outcome rather than an axis one, so the floor turns on whenever ANY axis
asked to fit, including on an axis the consumer sized explicitly, and including when the axis they
named turned out to be the cross axis.

**The DEFAULT never composes; the two explicit minimums do.** `max(150px, anchor-size(self-{A}))` is
gone: that was two floors fighting over one axis, and the 150px term only ever won by overriding the
size the consumer explicitly asked for — a 40px icon trigger with
`<Popup shouldFitContainer shouldFitViewport>` rendered a 150px-wide popover. The anchor size drives
the flip perfectly well on its own — 40px + 8px gap + 5px padding is a 53px margin box, so any cell
narrower than 53px overflows and the fallback chain runs.

`placement.minSize` is the other explicit request, so it does NOT replace the anchor floor: the two
compose as `max(minSize, anchor-size(self-{A}))`. Amended 2026-08-25, after a first pass made the
whole chain first-wins. `<DropdownMenu shouldFitContainer>` maps to `inlineSize: 'min-anchor'`,
whose documented contract is a menu at least as wide as its trigger, and first-wins let
`placement.minSize: 40` return a 40px menu on a 200px trigger. Two explicit minimums is exactly what
`max()` is for. The knock-on is intended: `minSize: 0` no longer removes an anchor floor, because
`max(0px, anchor)` is the anchor — `minSize: 0` means "do not apply the flip floor", not "break my
`min-anchor` contract", and it still opts out entirely on any axis with no anchor floor, which is
the case it exists for.

The gap that leaves, recorded rather than fixed: on a **fitting** `'min-anchor'` placement axis
there is no way to express "cap me but do not move me", because the anchor floor is uncapped there
and drives the flip whatever `minSize` says. (Written as unqualified when this landed; narrowed the
same day, because with nothing fitting the anchor floor is clamped — see
[The unfitted anchor floor is clamped](#the-unfitted-anchor-floor-is-clamped-the-fitting-one-is-not).)
That belongs with the other `'min-anchor'` floor question — see
[width-from-anchor-floors.md](./width-from-anchor-floors.md) → _Update (2026-08-25)_.

### Why this is safe for `match-anchor` on the placement axis

That was the one case the composition was written for, and it survives untouched. With
`inline-size: anchor-size(self-inline)` plus an **uncapped**
`min-inline-size: anchor-size(self-inline)`, CSS min/max resolution applies the min last, so the min
beats the max and **the cap is INERT there** — the floor does all the work. The popover renders at
the anchor's width, overflows a cell narrower than that, and flips. Which cap the axis was given
cannot change that outcome, which is why dropping the cell cap on an explicitly-sized axis (below)
is not a regression for it.

### The consequence to know about

Under per-axis caps, `{inlineSize: 'max-available', blockSize: 'match-anchor'}` on a BLOCK placement
no longer puts the cell cap on block: block was answered explicitly, so the mirror skips it and it
gets only the Rule 3 viewport backstop. It still gets the floor, because something is fitting,
valued at the anchor's block size. That is the intended consequence of the split, and
`__tests__/playwright/anchored-popover-size.spec.tsx` pins it on both sides ("the mirror fills a
content block axis, which then takes the CELL cap and stays put" versus "an explicit match-anchor
block axis keeps the viewport backstop, so it overflows the cell and moves").

Two things deliberately left alone here:

- The **cross-axis** anchor floor keeps its `min(floor, cap)` clamp. There it is a size contract,
  not a flip driver.
- `'min-anchor'` on the placement axis with **nothing** fitting still emitted an uncapped
  `min-{A}-size: anchor-size(…)`, which defeats the viewport backstop on that axis. Left open on
  2026-08-25 and closed later the same day — see the section below.

## The unfitted anchor floor is clamped; the fitting one is not

**Decided 2026-08-25**, closing the second bullet above.

`'min-anchor'` earned an anchor floor whether or not anything was fitting, and the placement-axis
floor was never clamped. Together those defeated the **unconditional viewport backstop**: with
nothing fitting, `max-{A}-size` is not a cell cap but the backstop itself, and CSS resolves the min
after the max, so an unclamped floor made it inert and the popover could be sized past the screen.

**It was live, not latent.** `<DropdownMenu shouldFitContainer>` maps to `inlineSize: 'min-anchor'`
and passes no fit value, so on a `left-*` / `right-*` placement inline is the placement axis with
nothing fitting. On a trigger wider than `100dvw - 10px` — a full-width table cell, a wide column
header — the menu was floored wider than the viewport. The asymmetry was visible in the code the
whole time: the same expression gates `'match-anchor'` on `isFitting` and does not gate
`'min-anchor'`.

**Why clamping is safe here and not while fitting.** The floor is left uncapped so it can exceed the
CELL cap, which is what makes the margin box overflow a too-small cell so `position-try-fallbacks`
moves the popover. With nothing fitting there is no cell cap on that axis, so there is nothing to
flip out of: uncapped buys nothing and only defeats the backstop.

Be precise about the converse, because the obvious "simplification" is to clamp unconditionally and
the usual objection to it does not actually hold. Clamping to the **viewport** cap cannot suppress a
flip: a placement-axis cell is at most the viewport, and the clamped floor's margin box is
`viewport - 2 * padding + gap + padding = viewport + gap - padding`, which exceeds the viewport for
any `gap > padding` (8 > 5 by default). So the clamped floor still overflows every cell it could be
placed in. What an unconditional clamp really breaks is the **size promise**: `'min-anchor'` and
`'match-anchor'` stop meaning "at least / exactly the anchor's size" for an anchor wider than the
viewport. The rule is still written as "a fitting placement-axis floor is never clamped" rather than
as "clamped to the viewport cap but not to the cell cap", because the second form is the one a later
reader finishes collapsing into `min(floor, cap)` against whichever cap the axis actually has — and
that one IS the flip suppression. It has been written the wrong way round here before.

`placement.minSize` stays **outside** the clamp: `max(minSize, min(anchor, cap))`, not
`min(max(minSize, anchor), cap)`. A literal length the consumer wrote already overhangs the backstop
on an axis with no anchor floor (`min-{A}-size: placement.minSize` is emitted unclamped), so
clamping it only when an unrelated axis value happens to be `'min-anchor'` would make one input
behave two different ways. `min-anchor` is the opposite kind of request: a contract with a trigger
whose size the consumer often does not control.

What remains open, and is now the only face of it: on a fitting anchor-relative placement axis, an
anchor wider than the viewport still floors the popover past the backstop, and there is still no way
to express "cap me but do not move me" there. The half reachable from a product prop is
`'match-anchor'`, via `<Popup shouldFitContainer shouldFitViewport>` on a `left-*` / `right-*`
placement; `'min-anchor'`'s only consumer, `@atlaskit/dropdown-menu`, has no fit prop and so never
reaches the fitting branch.

## `display: flex` is structurally required, and must not be inlined

Without a flex formatting context the cap is cosmetic: percentage resolution uses the parent's
_computed_ size (`auto`), not its used size, so the child lays out at its intrinsic size and spills
straight out of the capped host.

(Grid looks like a tidier fit, since a grid item in a `minmax(0, 1fr)` track has an automatic
minimum of `0`. It clamps an auto-sized or scrolling child, but not one with an explicit `width`:
grid `stretch` cannot override a specified size where `flex-shrink` can, so a `width: 9999px` child
stays 9999px wide. Measured on all three engines, 2026-09-11.)

But an **inline** author `display: flex` defeats the user-agent rule
`[popover]:not(:popover-open) { display: none }`, because author origin beats user-agent origin.
After `hidePopover()` a fitting popover stays `display: flex` at full size, where an unfit one
correctly goes to `display: none` with a 0x0 box. `useAnimatedVisibility` only leaves the `exiting`
phase after the exit animation settles, so the unmount can never win that race; under
`prefers-reduced-motion` (`animation-name: none`) or `shouldAnimate={false}` there is no fill-mode
opacity to mask it, leaving a genuinely visible, hit-testable, non-light-dismissible ghost.

**This was a live latent defect in the shipped `@atlaskit/popper` recipe.** Popper escaped it only
because it hardcodes `shouldAnimate={false} mode="manual"`; both `@atlaskit/popup` adapters pass
`shouldAnimate` unconditionally, so wiring them up would have shipped it.

Inline styles cannot be scoped to a pseudo-class, so **`display` cannot be owned by a style-writing
hook.** It is declared in `Popover`'s `cssMap` as `&:popover-open { display: flex }`. That is an
architectural constraint, not a preference. Pinned by the "a closed fitting popover is not left
displayed" test, which calls `hidePopover()` directly so the element is still mounted when it is
measured.

**The child `min-*-size: 0` reset is needed, and dropping it was a regression.** Per css-flexbox-1
§4.5 a flex item's automatic minimum size is
`min(specified size suggestion, content size suggestion)` while its computed `overflow` is
`visible`, and a min beats a max — so a child that does NOT scroll stops shrinking at its
MIN-CONTENT size and overhangs the host's cap by whatever the cap asked for beyond that.
`@atlaskit/popper`'s `useFitViewportMaxSize` wrote the reset to `element.firstElementChild` for
exactly that reason; this recipe briefly dropped it on the argument that "the child that needs the
cap is by definition the one that scrolls", which is true of `PopoverSurface` and false of a custom
`popupComponent`. The measurement that found "removing the reset changed nothing" was taken against
a scrolling child, where it is indeed a no-op.

Note what the reset does and does not buy for a NON-scrolling child: its box now honours the cap, so
the elevation and background are the right size, but its content still spills out of it, because
nothing is scrolling. That is the same deal the deleted hook offered — the surface's own `overflow`
is the consumer's responsibility, which is what forwarding `shouldFitViewport` to a custom
`popupComponent` is for. Restoring the reset restores the pre-merge behaviour; it does not promise
more than that.

It now lives beside `flex-grow` in `Popover`'s stylesheet rather than as an inline style from a
hook, which keeps the hook a single-element writer. Cascade order is not a hazard: `0` only ever
displaces the INITIAL `auto`, so a child with its own explicit minimum keeps it.

Pinned by `the cap reaches a child that does NOT scroll` in
`__tests__/playwright/fit-available-space.spec.tsx` (600px of cross-axis content in a 320px
viewport, measuring the CHILD, since the host is capped either way). Without the reset it fails on
all three engines.

Two in-tree `<Popup shouldFitViewport>` call sites have non-scrolling children, so both are
affected: `jql-builder/basic-picker`'s `ui/main.tsx` with `FixedWidthPopupComponent` (explicit
`overflow: visible`) and portfolio-3's `ai-work-suggestion-popup/view.tsx` with its
`CustomPopupContainer` (`overflow` unset). How narrow the window has to get before either one
overhangs depends on that container's min-content size, which has not been measured — do not quote a
threshold here without measuring one. The remaining ~66 containers with a visible or unset
`overflow` never ask to fit, so they have no cap to defeat.

**`& > * { flex-grow: 1 }` is needed, and is not cosmetic.** A flex item sizes to content on the
main axis where block flow made a block child fill. Without it, every anchor-width mode renders a
surface shrink-wrapped to its content instead of matching the trigger: measured at host 80px /
surface 30px under `match-anchor`. It is a no-op on the `width: fit-content` hosts that leave both
axes `'content'`.

**`row` is mandatory.** `flex-shrink` applies only to the main axis, so row is what lets an
oversized child shrink to the inline cap; the block axis works through cross-axis stretch. Measured:
`flex-direction: column` leaves a 9999px-wide child unclamped.

## One writer per property, now inside one hook

Every property has exactly one writer. Two writers on one property is not a tidiness concern here —
it is the direct cause of two defects that shipped:

- **A clobbered cross-axis shift.** Popper's hook wrote `5px` onto both cross-axis margin sides,
  which are exactly the antisymmetric `crossAxisShift` pair, and it ran second. Any consumer with a
  non-zero along-offset plus `shouldFitViewport` lost its shift entirely. The padding is now
  **composed** onto the shift (`calc({shift} + 5px)`) by the code that owns those sides. For a
  centred popover equal additions to both sides leave the pair antisymmetric about its centre, so
  `anchor-center` still centres the border box and the shift still displaces it by its full value,
  while the margin box grows by exactly the `2 * 5px` the cross-axis cap subtracts. For a start /
  end-aligned popover only the viewport-facing side is padded, since 2026-09-04 — see
  [Update (2026-09-04)](#update-2026-09-04-three-corrections-from-review).
- **`setStyle` cleanup hazards.** `useAnchorPosition` removed the `margin` shorthand on cleanup,
  which per CSSOM removes the longhands a later writer added; and the later writer's snapshot of
  `margin-inline-start` was the shift value written moments earlier by another hook, so its cleanup
  re-inlined a stale value.

**The invariant survived; the mechanism changed.** This recipe originally partitioned the properties
across three hooks — `useFitAvailableSpace` for the size properties, `useAnchorPosition` for all
four logical margins, `useWidthFromAnchor` for the inline size and its floor. That partition was
hand-maintained and nothing enforced it; `setStyle` has no ownership guard. Since 2026-08-24 the
same invariant is enforced **by construction inside `useAnchoredPopover`**, and the partition is
between pure functions inside one call rather than between hooks a consumer has to remember to call
together:

- **`getAnchoredPopoverSizeDeclarations`** (`internal/anchored-popover-size.tsx`) owns every size
  property — both caps, both floors, and the anchor-relative sizes. One pure function means the
  cap↔floor asymmetry is a local truth table rather than a contract between two files that has to
  agree about which axis is which. It was wrong twice while it was a contract; see
  [../plans/one-anchored-popover-hook.md](../plans/one-anchored-popover-hook.md).
- **`getFitMarginDeclarations`** (`internal/anchor-positioning/fit-margins.tsx`) owns the reserved
  viewport padding, because it has to compose onto margins the positioning half already writes. That
  padding is a _distance from the viewport edge_ — the same category as `gap` (distance from the
  anchor) and `crossAxisShift`. It is legacy popper's `preventOverflow` padding, not a size.
- **`Popover`** still owns `display` and the child's `flex-grow`, because only a stylesheet can
  scope a declaration to `:popover-open` — see
  [`display: flex` is structurally required](#display-flex-is-structurally-required-and-must-not-be-inlined).
  Both are applied **unconditionally**, so there is no prop to forget.

What the merge bought, beyond the ownership guarantee: the fit request cannot be half-passed to some
writers and not others; `placement` is passed once and is required rather than defaulted, so nothing
can silently compose against `axis: 'block'`; and the positioning path —
`supportsAnchorPositioning() && !forceFallbackPositioning`, and separately `supportsAnchorSize()` —
is resolved once at the top and passed down, rather than probed three different ways by three hooks
that could disagree.

What it cost: the merged hook re-runs its size writes whenever a positioning dependency changes.
Redundant work, no correctness issue.

### Two hook-only designs that were built and measured, and failed

Both were attempts to drop the `Popover` prop so the recipe would be hooks-only — which is worth
wanting, because forgetting the prop yields caps that silently do nothing: the same failure shape as
the bug being fixed.

**A hook cannot own `display`, even writing both states.** The idea was to set `display: flex` on
the popover's `toggle` event and `display: none` on close, never relying on the user-agent rule. It
fails because **`toggle` is dispatched asynchronously.** After `hidePopover()` there is a paintable
window where the popover is closed but still displayed — the ghost, just briefer. The synchronous
`beforetoggle` fires too early: setting `display: none` there removes the element before the exit
animation can play. `:popover-open` in a stylesheet is the only thing that changes `display` at
exactly the moment the state changes _and_ keeps the `allow-discrete` transition. Measured: the
closed-state test read `display: grid` instead of `none` on all three engines.

**`display: grid` with `minmax(0, 1fr)` tracks does not clamp an explicitly sized child.** This
looked like it would remove the need for the `> *` child rule — a grid item in a `1fr` track has an
automatic minimum size of `0`, so nothing has to be written to the child. It does clamp an
auto-sized or scrolling child (measured on all three engines, 2026-09-11; an earlier version of this
paragraph blamed `1fr` resolving against max-content, which is wrong). But grid `stretch` cannot
override a specified size: a `width: 9999px` child stayed `9999px` wide and popper's existing cap
test failed with `10102 > 1020`. Flex works because `flex-shrink` shrinks the item to the capped
container — which is exactly why the child's automatic minimum has to be reset, and why the `> *`
rule is needed.

**Making the flex context unconditional was measured and adopted.** It was initially rejected on
blast radius — `Popover` is rendered by 11 adopter packages with 181 VR baselines between them. Both
concerns turned out to be empty:

- **Zero VR churn.** All 181 baselines across `top-layer`, `popper`, `popup`, `dropdown-menu` and
  `react-select`, on both runners, are unchanged BY this branch. Run twice. Not the same as green:
  six in `popup`'s regular suite fail locally against their checked-in PNGs, and they predate this
  work. `with-surface-detection` (23px), `wrapper-should-have-focus-ring` (24px) and four
  `modal-appearance` variants on `mobile-chromium` (40px and 1,735px). Determined from the branch
  diff rather than a second build: this branch touches none of their baselines, none of their
  examples, and nothing in their runtime graph — `with-surface-detection` and `modal-appearance` set
  no feature flags at all and `wrapper-should-have-focus-ring` sets an unrelated one, so all three
  render the legacy path, and the only legacy-reachable source this branch changed is comment-only
  (`popper/src/popper.tsx`, `popup/src/compositional/popup.tsx` and
  `trigger-ref-object-context.tsx`). Same inputs, same output, so the merge base fails them too. The
  three sub-50px deltas are rasterisation-scale drift between a local runner and the environment
  that produced the PNG.
- **Nothing renders 2+ in-flow children into a `Popover`.** Audited repo-wide, including all four
  passthrough seams (popper's render prop, 198 `popupComponent`s, spotlight's `children` across 297
  files, 135 tooltip `component`s). The only 2-child cases are two jsdom unit tests. The
  structurally-multi-root families all collapse to one flex item, because the extra roots either
  render `null` or are `position: fixed`.

That removes the prop, and with it the failure mode where a consumer wires the caps and forgets the
prop — a cap that silently does nothing, which is the same shape as the bug this fixed.

## The JavaScript fallback

Only the viewport caps. Best effort: none of what fitting adds survives this path.

The cell cap is meaningless there: with no `position-area` the containing block is the viewport, so
`calc(100% - …)` resolves to a whole-viewport cap and quietly stops constraining anything. No
margins either — the gap and the shift are coordinate deltas on that path, so writing them as
margins would double-apply them.

**And no flip floor.** It was written here at first, on the grounds that 150px is also a design
minimum. It is not — `max(150px, anchor)` overriding a size the consumer asked for is one of the
bugs the per-axis split fixed — and here it is actively harmful. `computeFallbackPosition` picks a
side from the popover's MEASURED size, so a floor only inflates the measurement it reads: 40px of
content with 90px of room below it fits, and did before this recipe existed, but a
`min-block-size: 150px` makes neither side "fit", flips it to the roomier one, and in a short
viewport the off-screen clamp then drags it back down over its own trigger. `placement.minSize`
still applies on both paths — that one is a consumer request rather than a flip driver.

Which leaves fitting emitting the same declarations as not fitting here, because the viewport
backstop is unconditional. That is why the opt-in control pair in `fit-available-space.spec.tsx`
branches on the path: on this one there is no difference to assert.

**What the merge fixed here: `forceFallbackPositioning` now reaches the size half.** While the
recipe was split, `useFitAvailableSpace` could not see that option at all, so forcing the JS
fallback still emitted `calc(100% - …)` — a cap resolving against the viewport, constraining
nothing. This was the one live manifestation of the three hooks disagreeing about which positioning
path was active; the `supportsAnchorSize()` / `supportsAnchorPositioning()` divergence itself was
inert. Now `isUsingCssAnchorPositioning = supportsAnchorPositioning() && !forceFallbackPositioning`
is computed once and passed into the size function.

Anchor-relative sizes work on this path as they always did: `anchor-size()` needs the
`position-anchor` only the CSS path writes, so when it is unavailable the anchor is **measured** and
a pixel length is emitted instead. What changed is that the measurement is now resolved once, for
both axes, and skipped entirely when neither axis asked for an anchor-relative size — a
position-only consumer pays no layout read.

A JS-measured anchor-edge cap would close the gap and is deliberately not built yet. Firefox 147 (13
Jan 2026) enabled anchor positioning by default, so the population on this path is much smaller than
the Playwright pin suggests — **the pin still has it off**, which is why Firefox exercises the
fallback in CI and not the CSS path. Confirm the real support floor before taking on the measurement
cost and a second writer. The prior attempt's history records two measuring iterations that
oscillated because they measured the host, whose size the cap changes.

## Why not the alternatives

- **`position-try-order: most-block-size`** — Chrome only. Silently a no-op in WebKit (WebKit
  bug 317916) _and_ Firefox (bug 2050547), while `CSS.supports` returns `true` in both, so it cannot
  be feature-detected; MDN/BCD reports support incorrectly. It also means "roomiest side always
  wins", not "flip when needed": measured moving a popover that fits below (180/200, 100px content)
  to above. Against ~53 `@atlaskit/popup` sites that is a broad placement change, and the five
  `<Popper>`-direct sites it would also hit are the ones that _work_ today — two of them
  caret-anchored editor autocompletes (jira JFX `SuggestionsPopup`, `@atlaskit/jql-editor`), where
  moving the surface mid-typing is a pure regression. Case B is the case it gets wrong; the floor is
  the case it gets right.
- **Capped terminal `@position-try` options** (uncapped base so overflow detection stays real, cap
  only in the last-resort options) — dead in Chrome. Controlled measurement: an inline
  `max-block-size: 100px` clamps to 100px, but the identical declaration inside `@position-try` lays
  out at 200px while `getComputedStyle` reports 100px. WebKit honours it. Worth filing a crbug.
- **`max-block-size: stretch`** — byte-identical to the calc in Chrome, unsupported in WebKit 26
  where it silently reverts to no cap. Safari 26 is exactly the version with `position-area` but not
  `stretch`, so `supportsAnchorPositioning()` returns true, the fit path runs, and nothing caps.
- **JS-measured px caps** — what legacy popperjs did, and what every mature library still does
  (Floating UI's `size`, Radix and Base UI's `--*-available-height`). Kept in reserve as the only
  approach that also covers a non-anchor-positioning engine. See the fallback section above.

## Deliberately not doing

- **Making fitting the default.** A default cap is a default _placement_ change, because of the
  floor and the flip it enables. Three teams have already added explicit `shouldFitViewport={false}`
  opt-outs. Revisit separately.
- Everything under [Why not the alternatives](#why-not-the-alternatives).

`shouldFitViewport` is best documented to consumers as **transitional**.
`safari-popover-flex-collapse.md` cites
[whatwg/html#11176](https://github.com/whatwg/html/issues/11176), which proposes a user-agent
`max-height` default for exactly this failure — the platform is heading toward fitting as an
invariant rather than a knob.

## Consequences worth knowing

- **`scrollable-region-focusable`.** Making the surface genuinely scrollable means axe now requires
  the scroll container to have keyboard access. Real popup content has focusable children, so this
  is a non-issue in practice — but a fitting popup whose content is entirely non-interactive will
  newly trip the rule. It surfaced while building the popup fixture, which is why that fixture has a
  footer button.
- ~~**`'content'` loses the `max-content` content floor**~~ — **superseded 2026-09-04.** Between
  2026-08-24 and 2026-09-04 a `'content'` (then `'auto'`) inline axis wrote no size, so content
  wider than the space beside the trigger wrapped into that space instead of overflowing and
  sliding. The natural width is back as a definite `inline-size: max-content`, which the caps beat;
  see [Update (2026-09-04)](#update-2026-09-04-three-corrections-from-review) and
  [width-from-anchor-floors.md](./width-from-anchor-floors.md).
- **The popover's content becomes a flex item.** A consumer rendering more than one direct child of
  `Popover` gets flex row layout rather than block flow. Every in-tree case renders a single wrapper
  element (`PopoverSurface`, a `popupComponent`, or one render-prop element), but the type is
  `children: ReactNode` and does not enforce it.
- **Fitting depends on an unwritten contract on the popover's content root.** The caps reach the
  content through a flex formatting context, which means the root has to be a single in-flow box
  with a non-`visible` `overflow`. Since 2026-09-10 the `PopupComponentProps` docblock says so, but
  nothing types it and there is no dev warning. Several in-tree custom `popupComponent`s break it.
  See
  [../follow-ups/custom-popup-component-contract.md](../follow-ups/custom-popup-component-contract.md).
- **The floor now drives flips for consumers that asked not to flip.** `shouldFlip={false}` is
  already a documented no-op on the top-layer path, so a fitting consumer that set it gets the
  fallback chain regardless — and Rule 2 makes the chain fire more often. `placement.minSize: 0` is
  the expressible answer, and did not exist before.

- **A small anchor-relative popover is no longer padded out to 150px.** The floor on an
  anchor-relative placement axis is now the anchor's size alone, so a 40px icon trigger with
  `shouldFitContainer shouldFitViewport` renders a 40px-wide popover instead of a 150px one, and
  still flips. See [Two jobs, split](#two-jobs-split-a-per-axis-cap-and-a-whole-popover-floor).

### One bug this closed

`match-anchor` with an inline-axis placement used to get a cap and **no floor on either axis** —
total flip suppression, the exact failure this note exists to fix. It was only latent (see
[../plans/one-anchored-popover-hook.md](../plans/one-anchored-popover-hook.md) for why), but it was
reachable from the type system. `'match-anchor'` on a fitting placement axis now gets a matching
**uncapped** anchor floor — `anchor-size(self-{A})`, so it flips rather than shrinking below the
anchor size. It was first written as `max(150px, anchor-size(self-{A}))`; the `max()` was dropped on
2026-08-25 because the anchor term alone already drives the flip, and the 150px term only won by
overriding an explicit request.

## Tests

- `__tests__/playwright/anchored-popover-size.spec.tsx` — 22 tests over the merged recipe (66 runs
  across the three engines), driving `examples/161-testing-popover-anchored-size.tsx`: Rule 1 in
  both directions plus its negative case, the Rule 2 threshold pinned to within 7px either side
  (cell 170 stays, cell 156 moves), `minSize: 0` staying put at exactly `cell - 8 - 5`, the viewport
  backstop on a 600px trigger in a 400px viewport, `match-anchor` vs `min-anchor` on the block axis,
  the inline-placement-axis flip for both `right-start` (the ADS side-nav flyout) and `left-start`
  (the people-and-teams hierarchy pickers), and `forceFallbackPositioning`. Passes on all three
  engines. Geometry, not declarations. The 2026-08-25 split added seven: a small `match-anchor` axis
  rendering at the anchor's size rather than 150px, the anchor floor's own flip threshold pinned 7px
  either side of 53 (`min-anchor`, not `match-anchor` — a definite `{axis}-size` overflows a small
  cell on its own, so that variant would pass with no floor at all), the per-axis cap as a matched
  pair differing only in `blockSize: 'content'` vs `'match-anchor'` (both with `minSize: 0`, because
  at the default floor the min beats the max and the two caps are indistinguishable — which is how
  the whole-popover cap survived unnoticed), and `minSize` COMPOSING with the anchor floor — a
  matched pair on a 120px anchor with `minSize: 40` (the anchor wins, 120px) and `minSize: 200`
  (`minSize` wins, 200px), so `max()` itself is under test rather than one lucky number. Under the
  first-wins mutation the `minSize: 40` case reads 40px against a measured 120px anchor and fails on
  all three engines. The clamp added two more, a matched pair differing only in `blockSize`: an
  800px trigger in a 700px viewport on an INLINE placement axis with `inlineSize: 'min-anchor'`,
  unfitted (the popover comes out at the 690px backstop and NARROWER than its trigger) and fitting
  (it stays at the anchor's full 800px). Each is the other's mutation guard: reverting the clamp
  fails the first at `800 <= 691`, and dropping its `isFitting` guard fails the second at
  `|690 - 800| <= 1`, both on all three engines. There is deliberately no `expectOnScreen` in that
  pair — with an anchor wider than the viewport less the padding, neither cell beside it can hold
  the popover at any size, so the contract under test is the popover's inline EXTENT rather than its
  position.
- `__tests__/playwright/fit-available-space.spec.tsx` — cases A–D plus the inline axis, an uncapped
  control, the scrolling surface (which doubles as the WebKit flex-collapse pin), and the two
  closed-state ghost checks. Expectations are derived from the measured trigger, so the recipe
  itself is the assertion, and each test branches on a runtime `CSS.supports('anchor-name', '--a')`
  probe so Firefox asserts the fallback contract rather than being skipped.
- `__tests__/playwright/anchored-popover-geometry.tsx` — the shared `readGeometry` /
  `expectGeometry` / `expectedFittedSize` helpers both suites measure through. Not a spec file;
  follows the `focus-interaction-scenarios.tsx` convention. Its flip threshold is now
  `marginBoxAround({ size })` rather than a hard-coded 163, because the threshold moves with
  whichever floor Rule 2 picked.
- `src/internal/__tests__/anchored-popover-size.test.tsx` — 39 tests: the truth table without a
  browser. Axis mapping, cap spellings, the cross-axis `min()` clamp, every branch of the floor's
  chain (the `max()` composition on both a `'min-anchor'` and a fitting `'match-anchor'` placement
  axis, each minimum alone, and the 150px default), Rule 1's fill-only behaviour and the per-axis
  cap that reads it, and `minSize: 0` on both a fitting and an anchor-relative axis — where it
  zeroes the floor in the first case and leaves the anchor floor standing in the second. The
  placement-axis clamp is pinned from four sides: unfitted (clamped), fitting (not clamped),
  composed with a `minSize` (`max(40px, min(anchor, cap))`, so the nesting itself is pinned), and on
  the JavaScript fallback with a measured length. A fifth case asserts BOTH axes of an unfitted
  `'min-anchor'` popover at once, because the two clamps come from different code paths and a
  `dvw`/`dvh` swap in either is invisible while only one axis is asserted. jsdom has no layout or
  cascade, so it stops at the declaration boundary on purpose.
- `__tests__/vr-tests/popover-fit-floor.vr.tsx` — a 2x2 of
  `{roomy, cramped} x {default floor, minSize: 0}`, so the two columns differ only in `minSize`. The
  cost of Rule 2 (a surface stretched to 150px with empty space below) and its benefit (flipped
  above at full height instead of a ~27px letterbox) are both visible in one sheet. Two more
  fixtures, `fit-floor-anchor-{roomy,cramped}`, photograph the anchor floor: an 80px trigger with an
  80px popover beside it, which is the half of the 2026-08-25 change a number cannot review. All six
  are photographed on `desktop-chromium` only, because every existing VR baseline in this package
  uses the single default variant; cross-engine coverage of the same behaviours comes from
  `anchored-popover-size.spec.tsx` above, which runs all three engines.

  Two JavaScript-fallback twins sit alongside, `js-fallback-fit-floor-{roomy,modest-cell}`: the
  roomy one hugs the same 56px content that `fit-floor-roomy-default` stretches to 150px, and the
  80px-cell one stays BELOW its anchor, which is the side the floor would change. Writing the floor
  on that path moves them by 10,612 and 25,442 pixels. What they guard is the popover's SIZE and
  SIDE on the fallback path, not `PopoverSurface`'s rendering there: every fixture in this file
  renders a solid block in place of the surface, for the reason under
  [A VR fixture about size needs ink](../rules/testing.md). `popover-cross-axis-shift.vr.tsx` and
  `placement-offset.vr.tsx` keep the same twin-per-path convention, though those two twins do wrap
  `PopoverSurface`.

  Every fixture in the file was converted to that solid rendering on 2026-09-11, and the conversion
  is what makes them fail when they should. Under a mutation that drops both caps,
  `fit-floor-cramped-min-size-zero` moved 1,045 pixels white-on-white and now moves 19,156;
  `fit-floor-short-viewport` moved 250 and now moves 15,806. The other five do not move under that
  mutation either way, correctly: no cap binds in any of them. The roomy cells have room to spare,
  `fit-floor-cramped-default` flips into one that does, and the two `fit-floor-anchor-*` fixtures
  never take a cell cap at all — their placement axis is `'match-anchor'`, so the recipe only ever
  writes them the viewport backstop, which their uncapped anchor floor then beats. They are pinned
  by `anchor-size()` instead: dropping the FLOOR rather than the caps moves
  `fit-floor-roomy-default` by 24,019 pixels, `fit-floor-cramped-default` by 24,782 and
  `fit-floor-short-viewport` by 9,108, which is the positive control that these baselines are
  insensitive to the cap rather than blind.

- `__tests__/vr-tests/popover-fit-scroll.vr.tsx` — what a capped popover LOOKS like, which the
  geometry suites measure but cannot review. `fit-scroll-capped-surface` is 600px of content in a
  ~333px cap (the popover measures 382px to 715px), so `PopoverSurface` scrolls and its sticky
  footer is pinned to the bottom of the scrollport, 5px clear of the viewport bottom; removing the
  caps moves it by 6,974 pixels. `fit-backstop-taller-than-viewport` is Rule 3 with NOTHING fitting:
  an inline placement centres 2,000px of content vertically, so both capped block edges land in
  frame, and removing the caps moves it by 8,902 pixels. Both put a SOLID marker in the frame rather
  than relying on a scrollbar, which the runner's Chromium draws as an overlay.
- `@atlaskit/popup`: `__tests__/playwright/fit-viewport.spec.tsx` — the legacy/top-layer parity
  pair, a custom-`popupComponent` variant, and an opt-out control. Verified to fail when the
  adapter's wiring is removed. Plus four flag-pair fixtures in
  `src/__tests__/informational-vr-tests/popup-top-layer.vr.tsx`, from
  `examples/24-fit-viewport.vr.ap.tsx`, which is the popup half of the four `shouldFitViewport`
  fixtures `@atlaskit/popper` already photographs across the same pair. `shouldFitViewport` and
  `<Popup xcss>` had no VR baseline in either state, and `shouldFitContainer` had none in effect:
  `popup/src/__tests__/vr-tests/should-fit-container.vr.tsx` exists with a checked-in PNG but is
  `snapshot.skip`ped pending UTEST-2316, as is `dropdown-menu`'s.

  Two mutations, each failing a disjoint set and neither touching a flag-OFF baseline: forcing
  `inlineSize` and `blockSize` to `'content'` fails the three FIT baselines (6,974 / 6,974 / 8,403
  pixels) and leaves the xcss one alone, since it sets neither fit prop; dropping the
  `className={xcss}` wiring fails only the xcss baseline, at 13,835 pixels.

- `@atlaskit/popper`: `src/__tests__/playwright/max-size.spec.tsx` — its flag pair never actually
  toggled the flag (see the spec header) and its FF-on assertions read a declaration off an element
  the cap no longer reaches; both fixed here.

Deliberately not photographed, for one geometric reason rather than effort: the host's
`min-*-size: 0` child reset. The automatic minimum size it neutralises applies only to the flex MAIN
axis, which is inline, so a block-axis fixture does not exercise it at all (measured: deleting
`min-block-size: 0` moved no baseline). On the inline axis the cap is always bounded by a viewport
edge, so a child that refuses to shrink leaves the frame rather than growing inside it, and the two
states differ by a 5px strip at that edge. `fit-available-space.spec.tsx`'s "the cap reaches a child
that does NOT scroll" measures it at a 290px delta in a 320px viewport, which no fixed VR device can
reproduce.

Deliberately not tested, for one structural reason rather than effort: cross-axis `'max-available'`
in isolation, because it emits the same declarations as `'content'`. Rule 1's `size` record used to
be on this list too — it was unobservable while `isFitting` was computed from the raw values. Since
the cap reads the record it decides cell cap versus backstop, so it is observable at both the
declaration and the geometry boundary, and is pinned at both.

### One visual change to know about

`min-block-size: 150px` plus the default `align-items: stretch` means a fitting popover whose
content is shorter than the floor has its surface stretched to 150px, where block flow left
transparent host below it. Arguably the better rendering — the surface fills the box it was floored
to — but it is a real difference. Now covered: `__tests__/vr-tests/popover-fit-floor.vr.tsx`'s
`fit-floor-roomy-default` baseline is exactly this case, next to the `minSize: 0` control that hugs
its 56px content.

`@atlaskit/popper`'s flag-on VR baselines do **not** need regenerating, contrary to an earlier note
here: those fixtures use `110vw` / `110vh` / `9999px` content, so the 150px floor never binds.
Measured — zero churn.

Two baselines in this package did move when the hooks merged, both legitimately:

- `popover-min-anchor-narrow-span/none-narrow-span--default.png` — the `max-content` content floor
  the `'content'` axis no longer carries. This is the wrapping consequence in the consequences list,
  photographed.
- `informational-vr-tests/.../safari-flex-collapse-max-height-popover--desktop-webkit.png` —
  **independent evidence for the unconditional viewport backstop.** The old baseline shows the
  popover overflowing off the bottom of a 720px viewport with its sticky footer off screen; the new
  one is capped to the viewport with the footer visible. Example 154 moved from a position-only hook
  call, which emitted no caps at all, to one that always emits the backstop.

The 2026-08-25 split moved **no** existing baseline. Two new PNGs, no others:
`fit-floor-anchor-roomy` and `fit-floor-anchor-cramped`. The causal story, checked before running:
only three example files pass `inlineSize` / `blockSize` / `minSize` at all, and none of them lands
in a changed configuration. `86-vr-popover-width-from-anchor` and
`88-vr-popover-min-anchor-narrow-span` size the INLINE axis on a BLOCK placement, so inline is the
cross axis — nothing is fitting, the cross-axis clamp is untouched, and the placement-axis floor is
absent before and after. `89-vr-popover-fit-floor`'s original four fixtures fit the placement axis
itself with no anchor-relative axis, so they get cell cap plus `150px` / `0px` either way. Every
changed declaration family needs an anchor-relative placement axis or an explicitly-sized
non-fitting axis, and no fixture had either until these two. Under the mutation that restores
`max(150px, anchor-size(…))` the two new baselines differ by 236 and 408 pixels while those four
stay green — which is the evidence that their untouched baselines are correct rather than lucky.

The `minSize`-composes amendment later the same day moved **no** baseline and added no fixture. It
can only change an axis that has BOTH a `placement.minSize` and an anchor floor, and nothing has
both: `89-vr-popover-fit-floor`'s four `minSize` fixtures fit the placement axis with no
anchor-relative axis, its two `fit-floor-anchor-*` fixtures pass no `minSize`, and no other example
in this package or any design-system consumer passes `minSize` at all. No new fixture was added
either — three numeric floor outcomes that differ only in pixels are exactly what a screenshot
cannot review, and the geometry pair in `anchored-popover-size.spec.tsx` distinguishes them by
measurement instead.

The clamp on the unfitted anchor floor moved **no** baseline either, and added no fixture. Two
independent reasons, both checked from the code before running anything:

- **No fixture reaches the branch.** It touches exactly one declaration: `min-{A}-size` on a
  placement axis that is `'min-anchor'` with nothing fitting. `min-anchor` appears in three places
  repo-wide. `86-vr-popover-width-from-anchor` and `88-vr-popover-min-anchor-narrow-span` put it on
  the INLINE axis of a BLOCK placement, so it is the CROSS axis and takes the untouched cross-axis
  clamp. `@atlaskit/dropdown-menu`'s `shouldFitContainer` is the only consumer, and its one VR
  fixture (`18-should-fit-container`) passes no `placement`, so it defaults to `bottom-start` —
  block placement again. No fixture anywhere combines `min-anchor` with a `left-*` / `right-*`
  placement.
- **Even in the branch, the pixels only move for an oversized anchor.** `min(anchor, cap)` IS
  `anchor` for any anchor at or below `100dvw - 10px`. The widest anchor in any of these fixtures is
  260px, and dropdown-menu's is a full-width button inset by `space.800` on both sides, so it is
  `viewport - 64px` — comfortably inside the cap.

No new VR fixture, deliberately: the only rendering the clamp changes is one where the popover is
partly off screen, which is precisely what a screenshot cannot review. The geometry pair in
`anchored-popover-size.spec.tsx` measures it instead, in both directions.

## Update (2026-09-04): three corrections from review

Three things a review of the merged recipe found, each a real rendering difference from legacy
popper — two at the ~58 `shouldFitViewport` sites, one at every content-sized popover near an inline
edge — and none covered by the tests as written.

### The fit margins inset a start / end-aligned popover by 5px

`getFitMarginDeclarations` added the 5px viewport padding to BOTH cross-axis margins. The
antisymmetry argument above is correct for `anchor-center`, and only for it: a `span-*` cell aligns
the popover's MARGIN box to the anchor's edge, so `bottom-start` rendered its border box at
`trigger.x + 5px`, `bottom-end` 5px short of the trigger's end edge, and `right-start` 5px below the
trigger's top. It was photographed in the `fit-floor-anchor-*` baselines before anyone noticed.
Legacy popper aligns exactly and applies its padding only at a collision.

Now only the viewport-facing cross side is padded: `end` for `align: 'start'`, `start` for
`align: 'end'`, both for `'center'`. The border box lands on the anchor edge, and the margin box
still grows toward the viewport by the 5px the overflow judgement is meant to reserve.

**Known cost.** A slide fallback (`span-inline-end` → `span-inline-start`) does not swap the inline
margins the way `flip-inline` does, so a slid start-aligned popover keeps its padding on what is now
the anchor side and sits flush with the viewport edge. Alignment in the requested position — the
common case — wins over 5px of clearance in the fallback one. Pinned by the `ALIGNED_FIT_CASES` in
`__tests__/playwright/anchored-popover-size.spec.tsx` on both paths; the fallback computes alignment
from coordinates, so each case is its own control there.

### The 150px floor could push the popover off screen

Cases A–D all have at least one cell ≥ 163px. In a viewport too short for that on EITHER side — a
300px embedded panel with the trigger near its middle, mobile landscape, an on-screen keyboard
shrinking `dvh` — every try-fallback overflows, css-anchor-position-1 §6.5 falls back to the base
position, and the unclamped floor pushes a 150px box past the viewport edge with its scrollbar end
and footer controls unreachable. That is the ticket's own failure mode, in the ticket's own viewport
class (320×256).

The default floor is now written as
`min(150px, max(0px, calc((100d{vi|vb} - anchor-size(self-{A})) / 2 - {G} - 5px)))`. The two cells
sum to `viewport - anchor`, so the roomier is at least half of that, and a floor whose margin box
fits inside that half is guaranteed a cell somewhere in the chain. This is **not** the
`min(floor, cap)` that suppresses flipping: it is relative to the viewport, not to the current cell,
so a small base cell still overflows it. It needs the anchor's size, so the hook now resolves
`anchor-size()` (or measures, on a positioning-only engine) for any fitting popover, not only an
anchor-relative one. Only the DEFAULT is clamped: `placement.minSize` and the anchor floors are
explicit requests and keep their existing contracts, including the accepted overhang of a fitting
`'match-anchor'` axis on an oversized trigger.

In every viewport the existing tests use (≥ 400px with a 20px trigger) the clamp does not bind and
nothing moves. Pinned by case E in `__tests__/playwright/fit-available-space.spec.tsx`: 400×300,
trigger at 150, so the cells are 130 and 150 and neither holds 163; the clamped floor is 127, its
140px margin box overflows the cell below and fits above, and the popover flips and stays on screen.
`defaultFloor` in `anchored-popover-geometry.tsx` mirrors the formula.

### Dropping the content floor made every content-sized popover wrap instead of slide

The 2026-08-24 merge removed `useWidthFromAnchor`'s `min-inline-size: max-content` on the grounds
that a keyword cannot be composed inside `min()` and so would beat the viewport cap. True of a MIN.
The consequence was broader than the trade-off described: a CSS `auto` inline size shrink-to-fits
its containing block, which under `position-area` is the `span-*` cell, so every `bottom-start`
`<DropdownMenu>`, `<Popup>` and `<Popper>` near the inline-end edge — the row-action "…" menu —
wrapped its content into a column instead of overflowing the cell and sliding to `bottom-end`.
`none-narrow-span--default.png` recorded it. And the documented escape, "ask for `'max-available'`",
cannot work: on the cross axis it is defined to be indistinguishable from `'content'`, and the flip
floor only lands on the placement axis.

Rule 4 restores the natural width as a **definite** `inline-size: max-content`, which a `max` beats,
so the viewport backstop and the cell cap both still win. It is written for `'content'` and
`'max-available'` on the inline axis, never for the anchor-relative values (`'min-anchor'` wraps
down to the anchor by contract), never on the block axis, and only on the CSS path, where the
fallback's containing block is the viewport and shrink-to-fit already is the natural width for
anything that fits on screen. One consumer opts out: `@atlaskit/popper`'s imperative `createPopper`
adapter positions the CALLER's element, whose own stylesheet `width` the inline declaration overrode
(its flag-on VR baselines shrank from 224px to 125px on the first run), so both of its bridges pass
`shouldPreserveInlineSize: true`. Everything positioning an unstyled `Popover` host takes the
default. Consumers that never had the floor (`@atlaskit/tooltip`, `@atlaskit/spotlight`,
`@atlaskit/inline-dialog`, …) now slide in a narrow span too, which is the legacy `preventOverflow`
behaviour they had before the top layer.

Pinned by "a content-sized popover overflows a narrow span cell and slides" in
`anchored-popover-size.spec.tsx`, which needed a `wrappableContent` fixture param: a fixed-size box
has a min-content width equal to its max-content width, so with the existing fixtures "wrapped" and
"overflowed" measured the same — which is how the change went unnoticed by 22 geometry tests.
`none-narrow-span--default.png` was regenerated and shows the slide again.

### Tests

VR, one baseline per correction, because each is a rendering the geometry tests could not see:

- **Alignment** — `__tests__/vr-tests/popover-fit-alignment.vr.tsx`, fixture
  `examples/84-vr-popover-fit-alignment.vr.ap.tsx`:
  `fit-align-{bottom-start,bottom-end,right-start}`. A fitting popover rendered as a solid block,
  with a 2px ruler laid in flow on the trigger's aligned edge and running alongside the popover, so
  the old 5px inset reads as a gap between ruler and popover. The `fit-floor-anchor-{roomy,cramped}`
  baselines moved with the fix: identical columns, every popover row exactly 5px higher.
- **Slide, not wrap** — `popover-min-anchor-narrow-span.vr.tsx`: `none-narrow-span` already rendered
  the slide and is unchanged by this work (one line, in the inline-end-aligned cell, where a wrap
  would show a five-line column), so the new baseline is `content-width-row-action-slides`, an 80px
  trigger 80px from the inline-end edge with `inlineSize` on `'content'`, the row-action shape, so
  the slide reads without the `'min-anchor'` comparison.
- **The floor yields** — `popover-fit-floor.vr.tsx`: `fit-floor-short-viewport--mobile`, on the
  393px-wide `mobile-chromium` device with an INLINE placement and a 100px anchor 157px in (cells
  157 and 136, neither holds 163). The popover flips to the inline-start cell at 144px, on screen;
  the unclamped floor left it in the base cell with its margin box 27px (border box 22px) past the
  inline-end edge. VR devices are fixed Playwright projects (1280x720, 393x727, 390x664, 768x1024,
  1920x1080, 2560x1440), so the 300px-tall block-axis geometry has no device to run on and stays
  with Playwright case E.

### Two renames, same day

`'fit-available'` → `'max-available'` (commit 1345317): the value is a cap, not a fill, and "fit"
read as stretch; `max-available` names the `max-*-size` it writes, as `min-anchor` names its
`min-*-size`. Then `'auto'` → `'content'`: `auto` is only conventional as a default keyword, and its
CSS meaning for a positioned box is shrink-to-fit, exactly what Rule 4 removed, so the name
contradicted what it writes. `content` has CSS precedent (`flex-basis: content` is "sized from the
content"), and the four values now read as one pattern: sized by **content** / **match-anchor** / at
least **min-anchor** / at most **max-available**. Declarations unchanged; no baseline moved.

## Update (2026-09-10): known limitations

Recorded here from the follow-up notes the fit work left behind, so the trade-offs stay next to the
recipe. None is a bug; each is a place where the recipe is less precise than it could be, or a
consumer that does not ask it to fit, with why it was left.

- **A slid start / end-aligned fitting popover sits flush with the viewport edge.** The fit padding
  is on the viewport-facing cross side only (see the 2026-09-04 update above), and a slide fallback
  (`span-inline-end` → `span-inline-start`) does not swap the inline margins the way `flip-inline`
  does, so in the slid state the padding is on the anchor side and the viewport side has none.
  Fixing it needs per-option margins, i.e. named `@position-try` rules in a stylesheet, the same
  mechanism the Chrome sizing bug under [Why not the alternatives](#why-not-the-alternatives) makes
  unattractive. Measure how often the slide state is reached before spending on it.
- **The clamped default floor is viewport-relative, so a tall anchor shrinks it further than the
  cells strictly require.** `(viewport - anchor) / 2` is a lower bound on the roomier cell, not its
  size: an anchor at the very top of the viewport has a cell below it nearly the whole viewport
  tall, and the floor is still clamped to half. Harmless, since the floor only has to be large
  enough to overflow a too-small cell, but a consumer who sees a fitting popover floored at 127px in
  a 300px panel and asks why now has this paragraph.
- **The 150px constant is still not a design decision.** Unchanged from
  [../plans/should-fit-viewport.md](../plans/should-fit-viewport.md); the clamp changes where it
  stops applying, not what it is.
- **The JavaScript fallback has no anchor-edge cap and never re-measures the anchor.** The first
  half is recorded under [The JavaScript fallback](#the-javascript-fallback), with why it is
  deferred. The second: `'match-anchor'` and `'min-anchor'` emit a MEASURED pixel length there,
  taken once in the layout effect, and nothing refreshes it. The effect's deps contain nothing that
  changes when the anchor resizes, the fallback's own `ResizeObserver` observes the POPOVER and
  disconnects after one valid measurement, and the `scroll` / `resize` listeners call `update()`,
  which rewrites only `top` / `left`. So `<Popup shouldFitContainer>` on a trigger whose label
  changes while open, or a window resize that reflows a full-width trigger, leaves `inline-size`
  pinned to the stale value. Not a regression: `useWidthFromAnchor` was equally blind. The CSS path
  is unaffected, since `anchor-size()` tracks the anchor itself. **Why it was left.** Re-measuring
  inside `update()` puts a SECOND writer on the size properties, against the one-writer invariant
  above, and still misses an anchor that resizes without a window event. A real fix observes the
  anchor and re-runs the size half only, which is cheaper now that sizing lives in the same effect
  as `update()`, but not free. Weigh it against the fallback being best-effort: with no cell cap
  either, anchor-relative sizing there is already the weaker contract.
- **`placement.minSize: 0` cannot stop the flip on a fitting anchor-relative placement axis.** On an
  axis that is `'min-anchor'` or `'match-anchor'` while something is fitting, `minSize: 0` composes
  as `max(0px, anchor)`, which IS the anchor floor, so the flip stands. See
  [width-from-anchor-floors.md](./width-from-anchor-floors.md) → _Update (2026-08-25, later)_ for
  why clamping it there is not the answer either.
- **`<Popup xcss>` with a `width` AND padding renders 32px wider on the top-layer path** (280px
  legacy, 312px top-layer), because `xcss` lands on a content-box child of `PopoverSurface` rather
  than on a border-box container. Found by the flag pair in `popup`'s `popup-top-layer.vr.tsx`,
  whose baselines are checked in as the record.
  [../follow-ups/popup-xcss-width-divergence.md](../follow-ups/popup-xcss-width-divergence.md)
- **Legacy `<Popup shouldFitContainer shouldFitViewport>` is not capped at all**, because
  `strategy: 'absolute'` makes popper's `maxSize` modifier read an offsetParent-relative offset, so
  its cap never binds. A legacy-path defect that the top-layer path does not share, and the second
  divergence the flag pair found; worth knowing before anyone reads the flag-off half as a top-layer
  regression.
  [../follow-ups/legacy-fit-container-cap-never-binds.md](../follow-ups/legacy-fit-container-cap-never-binds.md)
- **Every flag-on popup baseline carries a focus ring the flag-off one does not.** `popup-top-layer`
  focuses the trigger when `autoFocus` is `false`, where legacy leaves focus where it was. Visible
  in all four pairs in `popup-top-layer.vr.tsx`, and unrelated to sizing, but it is a rendering
  difference between the paths and so belongs on this list beside the two real ones.
- **`@atlaskit/datetime-picker`'s calendar is never asked to fit.** Legacy `menu.tsx` sets
  `overflow: hidden` with no cap, so it clips rather than scrolls. The top-layer adapter
  (`fixed-layer-menu-top-layer.tsx`) wraps the calendar in a `PopoverSurface` and calls the hook
  with both axes at `'content'`, so it does get Rule 3's unconditional viewport backstop and the
  surface scrolls at the viewport edge, but it has no cell cap and no flip floor: a calendar taller
  than the space below its trigger overflows the cell rather than moving. A consumer decision, not a
  recipe gap.

## Related

- Source: `src/internal/use-anchored-popover.tsx` (the one hook),
  `src/internal/anchored-popover-size.tsx` (the whole size recipe, pure),
  `src/internal/anchor-positioning/fit-margins.tsx` (the reserved padding, composed onto the shift),
  `src/internal/supports-anchor-size.tsx`, `src/popover/popover.tsx`
- [width-from-anchor-floors.md](./width-from-anchor-floors.md) — the floors this composes with
- [placement-offset.md](./placement-offset.md) — the cross-axis shift the margins compose with
- [safari-popover-flex-collapse.md](./safari-popover-flex-collapse.md) — the WebKit collapse the
  scrolling surface has to survive
- [../plans/one-anchored-popover-hook.md](../plans/one-anchored-popover-hook.md) — why the three
  hooks became one, and the four problems the split caused
- [../follow-ups/custom-popup-component-contract.md](../follow-ups/custom-popup-component-contract.md)
  — the six-point `popupComponent` contract the caps depend on, and the containers that break it
- [../migrations/popup-migration.md](../migrations/popup-migration.md) → _Risks when flag is turned
  on_ — the rollout checks the fit work surfaced
- [../architecture/positioning.md](../architecture/positioning.md)
