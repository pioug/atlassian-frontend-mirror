# Fitting an anchored popover to the available space

> **Status: executed 2026-08-17.** PR1–PR3 are implemented. The design rationale now lives in
> [../decisions/fit-available-space.md](../decisions/fit-available-space.md), which supersedes this
> plan — read that first. This file is kept for the audit trail and for the corrections below.
>
> ### Claims in this plan that validation found wrong
>
> 1. **"~71 raw greps"** — not reproducible. The raw grep is 171 lines / 103 files; no filter
>    yields 71. The **58 real enabler sites** and the **53 via `@atlaskit/popup`** are both correct.
> 2. **"4 via the transparent `JiraPopup` passthrough"** — it is **2** (`AppTabMenu.tsx`,
>    `ColumnVisibilityPicker.tsx`). The other two files mention `JiraPopup` but destructure the prop
>    in a custom `popupComponent` rather than enabling it. Separately, **5** more enablers route
>    through `@atlassian/entry-points/popup-trigger`, another `@atlaskit/popup` wrapper.
> 3. **"Mercury owns ~30 of the popup sites"** — 29 sites live under `mercury/`, but
>    `@teams/Mercury` owns only **15** (`@teams/MercuryTable` 9, `@teams/StrategyCollection` 3,
>    `@teams/PassionFruit` 2).
> 4. **"seven custom `popupComponent`s … implement none of it"** — 7 use the discard idiom, but
>    **21** destructure the prop in total, and **four of them re-implement the exact same inert
>    `overflow: auto`-with-no-cap toggle** (jira `issue/deeplink`, `DeepLinkPopupStorageInit`,
>    `development/deeplink`, `summary-connect-dev-tools`). The bug was copied, not just shipped
>    once. A fifth forwards the prop to a DOM `<div>` behind an experiment.
> 5. **"the only in-tree non-zero along-offset also passes `shouldFitViewport={false}`"** — wrong
>    reason, right conclusion. The `<Popper>` sites with a non-zero along-offset simply **omit** the
>    prop (it defaults to `false`), and there are several (spotlight's legacy path,
>    `RowPopupButton`, `NudgeSpotlight`). The one site that literally pairs `={false}` with a
>    non-zero along-offset is an `@atlaskit/popup` consumer, which cannot reach `<Popper>` under the
>    flag at all. Still latent.
> 6. **"jsdom only ever runs the JS fallback, so no unit test can assert the CSS-path cap"** — the
>    first clause is wrong: `src/internal/__tests__/use-anchor-position.test.tsx` already forces the
>    CSS branch with `window.CSS = { supports: () => true }`. What jsdom cannot do is assert the
>    _effect_ of a percentage cap, because it has no layout or cascade. Conclusion stands.
>
> ### Two things this plan missed that changed the work
>
> - **`@atlaskit/popper`'s `max-size.spec.tsx` never toggled the flag.**
>   `featureFlag: 'platform-dst-top-layer=false'` / `'=true'` registers a flag _named_
>   `platform-dst-top-layer=true`, so both halves ran FF-off. Its FF-on assertions also read a
>   declaration off the consumer element, which the caps stopped landing on months ago. Same bug in
>   `accessibility.spec.tsx` and `top-layer-popper-escaped.spec.tsx`. PR3 must not use it as the
>   parity template — it fixes it instead.
> - **Firefox cannot test the CSS path.** The Playwright pin has anchor positioning **off**
>   (`CSS.supports('anchor-name','--a') === false`), so top-layer's `desktop-firefox` enrolment
>   exercises the JS fallback, not the cell cap. The specs branch on a runtime probe rather than
>   being Chromium-only, so they assert the right contract per engine and start testing the CSS path
>   automatically when the pin moves.
>
> Also of note: `page.locator(...).boundingBox()` is unreliable here — on WebKit it reported the
> trigger at `{x: 0, width: 44}` while the element's own `getBoundingClientRect()` said
> `{x: 280, width: 80}`. Measure inside `page.evaluate`.

_Re-evaluated against HEAD (`b36362d27e8c6`). Fixes CONFCLOUD-83586._

Two earlier attempts are **discarded** — `areardon/top-layer-fit-viewport-caps` (`c7e740d309cda`,
which promoted popper's hook and wired both popup adapters) and
`areardon/top-layer-fit-viewport-single-owner` (`ea072ebdcd7a1`, the placement/sizing split plan).
Cite them as prior art only. This note supersedes both.

## The bug

`shouldFitViewport` promises a `max-width`/`max-height` constraining the popup to the viewport.
Under the top-layer path its entire implementation is a toggle between `{ overflow: 'auto' }` and
`{}` on a wrapper div (`popup/src/popup-top-layer.tsx:44-47,303`; identically in
`popup/src/compositional/popup-content-top-layer.tsx:39,258`). Nothing writes a cap, and
`overflow: auto` with no cap is inert — so tall content grows past the viewport and the controls at
the bottom become unreachable. The wrapper is also nested inside `PopoverSurface`, which already
sets `overflow: auto` unconditionally (`top-layer/src/popover-surface/popover-surface.tsx:24`), so
the prop toggles a property that is already set on its parent. Inert in both directions.

**Scope:** ~58 real enabler call sites (not the ~71 raw greps suggest). ~53 go through
`@atlaskit/popup` — including 4 via the transparent `JiraPopup` passthrough — and are broken.
Exactly 5 go through `<Popper>` directly and work today, because `@atlaskit/popper` already ships
the cap (`popper/src/internal/use-fit-viewport-max-size.tsx`). Mercury owns ~30 of the popup sites.
Three teams have already added explicit `shouldFitViewport={false}` opt-outs; seven custom
`popupComponent`s destructure the prop purely to keep it off the DOM and implement none of it.

## The mechanism, measured

Chrome 143.0.7499.4 and WebKit 26.0, driven locally with the exact declarations the hooks write.
**Measure one popover per page load** — several open popovers on one page gave inconsistent readings
and cost two rounds of wrong conclusions.

### The cell-relative cap is sound and portable

Because the host carries `position-area`, its containing block _is_ the cell between the anchor edge
and the viewport edge, so `100%` means "available space". Spec-blessed: the region becomes the box's
containing block, with an explicit note that "some property values, like `max-height: 100%`, will be
relative to the position-area as well", and percentages do not subtract margins — so the
`- 5px - gap` correction is the right shape. 400x400, anchor 20px from the top: cell 360 → cap 347 →
popover 347 tall, 5px clear of the edge, surface scrolling. Identical in both engines.

### `display: flex` is structurally required — and must not be written inline

Without it the cap is cosmetic. Both engines, 400x400, 800px content: host capped to 347 but the
surface still lays out at 800 and spills to 848, past the viewport. A percentage cap only reaches
the child through a flex (or grid) formatting context plus `min-block-size: 0`, because percentage
resolution uses the parent's _computed_ height (`auto`), not its used height.

But an **inline** author `display: flex` defeats the UA rule
`[popover]:not(:popover-open) { display: none }` — author origin beats UA. Measured in both engines:
after `hidePopover()`, a fitting popover stays `display: flex` at full size with opacity back to 1,
where an unfit one correctly goes to `display: none`, box 0x0. `useAnimatedVisibility` only leaves
the `exiting` phase after the exit animation settles, so the unmount can never win that race; under
`prefers-reduced-motion` (`animation-name: none`) or any `shouldAnimate={false}` consumer there is
no fill-mode opacity to mask it, leaving a genuinely visible, hit-testable, non-light-dismissible
ghost.

**This is a live latent defect in the shipped popper recipe** (`use-fit-viewport-max-size.tsx:104`).
Popper escapes it only because it hardcodes `shouldAnimate={false} mode="manual"`; both popup
adapters pass `shouldAnimate` unconditionally, so popup would inherit it.

Verified fix: scope the declaration to `:popover-open` in `Popover`'s own stylesheet
(`.fitting:popover-open { display: flex }`). Measured in both engines — the cap still applies while
open (267px, scrolling) and the closed state returns to `display: none`. Inline styles cannot be
scoped to a pseudo-class, so **`display` cannot be owned by a style-writing hook**. That is an
architectural constraint, not a preference.

### The cap suppresses `position-try-fallbacks`

Overflow detection uses the box's own margin box _after_ the clamp (css-anchor-position-1 §6.5:
"Descendants overflowing el don't affect this calculation, only el's own margin box"), so a clamped
popover never overflows and no fallback is ever tried. It stays on the requested side and shrinks.
Legacy popperjs did the opposite by construction — `maxSize` declares
`requiresIfExists: ['offset', 'preventOverflow', 'flip']` and runs in `beforeWrite`, capping the
_post-flip_ placement — so this is a parity break. Both engines. The claim in the discarded caps
branch that the cap "tracks flips automatically" is false: it follows a flip once one happens, but
it prevents one happening.

## The fix for flip suppression: a `min-block-size` floor

Not `position-try-order`. Put a floor on the host alongside the cap. The floor makes the box
genuinely overflow once the cell is smaller than the floor, so **ordinary overflow detection fires
and the fallback chain runs normally** — no engine-specific keyword involved. This is what Blink's
layout lead recommended for exactly this problem in csswg-drafts#13617, and it is the CSS
transliteration of Floating UI's documented `size()`-before-`flip()` ordering.

Measured, `min-block-size: 150px` alongside the cell cap, **identical in Chrome 143 and WebKit 26**:

| case                                                     | cap only (today) | cap + floor                  |
| -------------------------------------------------------- | ---------------- | ---------------------------- |
| A — 40px below / 340px above, 200px content              | below, **27px**  | **above, 200px**, no scroll  |
| B — 180px below / 200px above, 100px content (fits)      | below, 100px     | below, 150px — **stays put** |
| C — ticket 320x256, trigger low (66/170), 400px content  | below, **53px**  | **above, 157px**, scrolls    |
| D — ticket 320x256, trigger high (176/60), 400px content | below, 163px     | below, 163px — unchanged     |

Case B is the one `position-try-order` gets wrong: the floor leaves a popover that fits where the
consumer asked for it. The cost is also visible in case B — the floor pads a 100px popover to 150px.
That is the trade: a minimum height for fit-mode popovers, in exchange for portable flip behaviour.
Pick the floor as a design constant, document it, and revisit when
`max-block-size: calc-size(stretch, min(size, MAX))` is portable (Chrome 138+/129+ only today;
Safari 27 beta ships ~Sept 2026; never Firefox — Jake Archibald's June 2026 write-up ships a
two-branch `@supports` version for exactly this reason).

### Why not the alternatives

- **`position-try-order: most-*-size`** — Chrome only. Silently a no-op in WebKit 26 (WebKit bug
  317916, NEW, unmilestoned) _and_ in Firefox (bug 2050547, NEW), while `CSS.supports` returns
  `true` in both, so it cannot be feature-detected; MDN/BCD reports support incorrectly. It also
  means "roomiest side always wins", not "flip when needed" — measured moving a popover that fits
  below (180/200, 100px content) to above. Against ~53 popup sites that is a broad placement change,
  and the 5 `<Popper>`-direct sites it would also hit are the ones that _work_ today — two of them
  caret-anchored editor autocompletes (jira JFX `SuggestionsPopup`, `@atlaskit/jql-editor`), where
  moving the surface mid-typing is a pure regression. It does at least not cause cross-axis drift
  (measured: ties resolve to the base position).
- **Capped terminal `@position-try` options** (uncapped base so overflow detection stays real, cap
  only in the last-resort options) — dead in Chrome. Controlled measurement: an inline
  `max-block-size: 100px` clamps to 100px, but the identical declaration inside `@position-try` lays
  out at 200px while `getComputedStyle` reports 100px. WebKit 26 honours it. No crbug appears to
  exist for this; worth filing.
- **`max-block-size: stretch`** — byte-identical to the calc in Chrome 143, unsupported in WebKit 26
  where it silently reverts to no cap. Safari 26 is exactly the version with `position-area` but not
  `stretch`, so `supportsAnchorPositioning()` returns true, the fit path runs, and nothing caps.
- **JS-measured px caps** — what legacy popperjs did, and still what every mature library does
  (Floating UI's `size`, Radix and Base UI's `--*-available-height`). Kept in reserve: it is the
  only approach that also covers a non-anchor-positioning engine, but the cap branch's own history
  records two measuring iterations that oscillated because they measured the host, whose size the
  cap changes.

## Where it belongs

**An option on `useAnchorPosition`**, plus two declarations carved into `Popover`'s Compiled styles.

Four of the five property groups the recipe needs — primary cap, cross cap, margins, and any
fallback-ordering — require that hook's private state: the resolved `TPlacement`, the gap string,
`supportsAnchorPositioning()`, and the CSS-vs-JS branch. Margins are already its exclusive, now
type-enforced property. The carve-out into `Popover` is `display: flex` scoped to `&:popover-open`
(see above) and the child `min-*-size: 0` as a `> *` selector rather than poking
`element.firstElementChild`.

### What HEAD changed

- **The scratch plan's defect 2 is dead.** `b36362d27e8c6` deleted the last physical size spellings
  from `use-width-from-anchor.tsx`; there is now exactly one floor declaration per mode, always
  `min-inline-size`. A later logical reset does land.
- **The margin collision got structurally worse.** `edgeMargin` derives
  `margin-${axis}-${anchorFacingEdge}` from the placement and `CROSS_AXIS_SHIFT_CUSTOM_PROPERTY` is
  keyed on the exhaustive `margin-${TPlacementAxis}-${TPlacementEdge}` union, so
  `useAnchorPosition`'s claim over all four logical margin sides is now type-enforced. A second hook
  writing margins is fighting a typed contract.
- **A live defect nobody named:** the fit hook writes `5px` onto both cross-axis margin sides, which
  are exactly the antisymmetric `crossAxisShift` pair, and `fromLegacyPlacement` maps popper's
  `offset[0]` straight into `crossAxisShift`. Any popper consumer with a non-zero along-offset plus
  `shouldFitViewport` loses its shift today. (In practice the only in-tree non-zero along-offset
  also passes `shouldFitViewport={false}`, so it is latent.)
- **`setStyle` cleanup hazards:** `useAnchorPosition` removes the `margin` shorthand on cleanup,
  which per CSSOM removes the longhands a later writer added; and the later writer's snapshot of
  `margin-inline-start` is the shift value written moments earlier by another hook, so its cleanup
  re-inlines a stale value.
- **`dropdown-menu` now ships `mode: 'min-anchor'`**, so a blind `min-inline-size: 0` reset is one
  prop away from deleting a documented `shouldFitContainer` contract in another package. Compose as
  `min(anchor-size(self-inline), <cap>)` instead of choosing.
- **Firefox 147 (13 Jan 2026) enabled anchor positioning by default.** The JS fallback is therefore
  _not_ "all of Firefox" — that conclusion came from the 144.0.2 Playwright pin, not the support
  floor (`last 1 firefox versions`). Confirm on the current release before scoping any fallback
  work.
- `safari-popover-flex-collapse.md` now cites whatwg/html#11176, which proposes a UA `max-height`
  default for exactly this failure — so the platform is heading toward fitting as an invariant.
  Document `shouldFitViewport` as transitional rather than a permanent knob.

## Plan

**PR1 — `@atlaskit/top-layer`: the fit option, and `Popover` owns `display`.** Add the option to
`useAnchorPosition` (one `setStyle` batch, no second writer), the `:popover-open`-scoped
`display: flex` and `> * { min-*-size: 0 }` to `Popover`'s `cssMap`, the cell cap, and the
`min-block-size` floor. Compose margins rather than overwriting them, and compose the width floor as
`min(anchor-size(self-inline), <cap>)`. Delete `popper/src/internal/use-fit-viewport-max-size.tsx`
and its copied `set-style.tsx`; popper delegates. This also fixes popper's three live bugs
(clobbered `crossAxisShift`, the 5px cross-axis drift, the inline `display`). `@atlaskit/top-layer`
minor, `@atlaskit/popper` patch.

**PR2 — `@atlaskit/popup`: wire both adapters.** Turn the option on for `shouldFitViewport`, delete
both inert `overflow: auto` wrappers, and make the cap reach the custom `popupComponent` branch. Own
`overflow` from the host side rather than forwarding sizing props — the in-tree custom containers
implement none of them, and one write fixes both branches. Keep the host `overflow: visible` so the
surface's `box-shadow` is never clipped. Note the colour picker's
`cc_color_picker_fix_viewport_clip` experiment sets `popupComponent={undefined}` when **enabled**,
so the product is shipping toward the default branch; both still need fixing.

**PR3 — tests that would have caught this.** The discarded reachability spec passes on a 53px
letterbox, so reachability alone is not enough. Primary fixture in `@atlaskit/top-layer` (the only
one of the three packages declaring `additionalBrowsers: ["desktop-firefox", "desktop-webkit"]`),
one popover per page load, geometry assertions not CSS declarations: cases A–D above, both axes (the
existing example is `right-start`, the ticket is `bottom-end`), a custom-`popupComponent` variant,
an FG-on/FG-off pair driving the same example as the parity contract, a `prefers-reduced-motion`
close asserting no ghost, and a `clientHeight > 0` assertion on WebKit to pin the flex-collapse
workaround. jsdom only ever runs the JS fallback, so no unit test can assert the CSS-path cap.

**Deliberately not doing:** `max-block-size: stretch`; capped `@position-try` options;
`position-try-order`; a JS-measured fallback cap until the Firefox floor is confirmed; making
fitting the default (a default cap is a default _placement_ change — revisit after PR1–3 land).

**Follow-ups to file:** nested anchored overlays inside a now-genuinely-scrollable surface (nothing
in the package sets `position-visibility`); `appearance="UNSAFE_modal-below-sm"` still unimplemented
on the top-layer path; `@atlaskit/datetime-picker`'s calendar has no height cap in either path; the
Chrome `@position-try` sizing bug.

> **Update (2026-09-10).** Each of the four now has a home. The nested overlays are a rollout check
> under [../migrations/popup-migration.md](../migrations/popup-migration.md) → _Risks when flag is
> turned on_, `UNSAFE_modal-below-sm` is a row in its _Known gaps_, and the calendar and the Chrome
> bug are in [../decisions/fit-available-space.md](../decisions/fit-available-space.md) under
> _Update (2026-09-10): known limitations_ and _Why not the alternatives_.
