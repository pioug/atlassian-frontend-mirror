# Phase 0b rung 2 — blast radius of `!important` host geometry

Gating survey for the host-hardening option in
[`../unsafe-selectors-plan.md`](../unsafe-selectors-plan.md) → Step 6, _Inheritance bleed_. **This
survey is why the plan rejects `!important` outright.** The proposal was that `@atlaskit/top-layer`
declare the following **at the host element** with `!important`, so hostile product CSS that reaches
the host — the `<div popover>` rendered at
`packages/design-system/top-layer/src/popover/popover.tsx:401` or the `<dialog>` rendered at
`packages/design-system/top-layer/src/dialog/dialog-content.tsx:273` — cannot move or resize it:

| Group      | Properties                                                                          |
| ---------- | ----------------------------------------------------------------------------------- |
| `position` | `position`                                                                          |
| `inset`    | `inset`, `top`, `right`, `bottom`, `left` (+ logical `inset-*`)                     |
| size       | `width`, `height`, `min-width`, `min-height`, `max-width`, `max-height` (+ logical) |
| `margin`   | `margin` + all longhands                                                            |
| `display`  | `display`                                                                           |

The question this document answers: **what would break?** `!important` at the host cannot be beaten
by any ordinary author rule, including an inline `style` attribute — only by another `!important`,
and then only at equal-or-higher specificity. Every declaration below that the design system itself
writes as a normal declaration therefore loses. All paths surveyed are the `platform-dst-top-layer`
gate-on paths. Verified 2026-08-10.

> **Dated survey — the file paths and line numbers below are as of 2026-08-10 and are not
> maintained.** On 2026-08-24 the four positioning/sizing hooks became one `useAnchoredPopover`
> ([../one-anchored-popover-hook.md](../one-anchored-popover-hook.md)), so read
> `use-anchor-position.tsx`, `use-anchor-position-at-point.tsx` and `use-width-from-anchor.tsx` as
> `src/internal/use-anchored-popover.tsx`, with every SIZE declaration (rows 8–10, 23, 32, 34, 35)
> now emitted from `src/internal/anchored-popover-size.tsx`. The blast radius is unchanged in kind:
> one hook still writes every geometry property as a non-`!important` inline style through the same
> `set-style.tsx`, so fact 1 and the mitigation site it names hold verbatim — there is now one
> writer to change instead of three. Two rows moved in substance: **row 10's
> `min-inline-size: max-content` floor no longer exists** (removed with the merge, see
> [../../decisions/width-from-anchor-floors.md](../../decisions/width-from-anchor-floors.md)), so
> the "losing it changes _flipping_" hazard is gone and is replaced by the placement-axis
> `min-{axis}-size` flip floor, which is in the same `min-*` group and carries the same hazard; and
> row 23's `useWidthFromAnchor('none')` call in popper no longer exists for the same reason.

Four structural facts drive most of the table:

1. **Every internal geometry write is a non-`!important` inline style.** `useAnchorPosition`,
   `useWidthFromAnchor` and popper's `useFitViewportMaxSize` all route through a `setStyle` helper
   that calls `element.style.setProperty(property, value)` with **no priority argument** —
   `top-layer/src/internal/set-style.tsx:21` and `popper/src/internal/set-style.tsx:24`. An
   `!important` author rule beats all of them. These two lines are also the cheapest mitigation
   site.
2. **`Dialog` has a typed public geometry prop.** `top-layer/src/dialog/types.tsx:67-78` declares
   `xcss?: XCSSProp<'margin' | 'height' | 'width' | 'maxWidth' | 'insetBlockStart' | 'insetInlineStart' | 'insetInlineEnd' | 'overflow' | 'scrollbarGutter', never>`
   — **seven of its nine allowed keys are in the proposed `!important` set**, and those seven keys
   _are_ the entire positioning strategy of `@atlaskit/drawer` and `@atlaskit/modal-dialog`.
3. **`Popover` exposes no host geometry API at all.** `top-layer/src/popover/types.tsx:44-60`
   restricts its only `xcss` props to animation properties, so every Popover-side breakage is
   hook-mediated rather than API-visible — which is what makes the custom-property hatch tractable
   there and intractable for `Dialog`.
4. **There is no `!important` anywhere in `top-layer/src` today**, so nothing in the primitive is
   already competing for these declarations. The competition is elsewhere (rows 44-48).

---

## Findings

`whoSetsIt`: `top-layer internal` | `adopter` | `public prop` | `consumer-documented`.

### Top-layer internals

| #   | path (`file:line`)                                                           | property                                                                           | whoSetsIt          | breaksUnderImportant | mitigation                                                                                             |
| --- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------ | -------------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | `top-layer/src/popover/popover.tsx:78-79,84`                                 | `margin: 0`, `inset: auto`, `height: auto`                                         | top-layer internal | no                   | These are the declarations that would _become_ `!important`; values already what we want.              |
| 2   | `top-layer/src/popover/popover.tsx:81-84` (comment)                          | `width`                                                                            | top-layer internal | yes                  | Width is deliberately left at the UA default so anchor-width matching owns it — do not force it.       |
| 3   | `top-layer/src/internal/use-anchor-position.tsx:294-297`                     | `margin: 0`, `inset: auto`                                                         | top-layer internal | no                   | Same values as the proposed forced values; redundant but harmless.                                     |
| 4   | `top-layer/src/internal/use-anchor-position.tsx:81-101,271-274,298`          | `margin-block-*` \| `margin-inline-*` (the offset gap)                             | top-layer internal | yes                  | `margin: 0 !important` erases `offset.gap` on every anchored surface; write it with `'important'`.     |
| 5   | `top-layer/src/internal/use-anchor-position.tsx:110-135,278-282,299,316-330` | `margin-*` (cross-axis shift)                                                      | top-layer internal | yes                  | Same fix as #4; the `--ds-cross-axis-shift-margin-*` custom properties survive but stop applying.      |
| 6   | `top-layer/src/internal/use-anchor-position.tsx:359-365`                     | `margin: 0`, `inset: auto` (JS fallback)                                           | top-layer internal | no                   | Same values as forced.                                                                                 |
| 7   | `top-layer/src/internal/use-anchor-position.tsx:406-407`                     | `top`, `left` (JS fallback)                                                        | top-layer internal | yes                  | `inset: auto !important` expands to all four longhands — every fallback-path popover unpositioned.     |
| 8   | `top-layer/src/internal/use-width-from-anchor.tsx:52,61`                     | `width` (`anchor-size(width)` / measured px)                                       | top-layer internal | yes                  | `match-anchor` mode dies; route through a host-read custom property (see Escape hatch).                |
| 9   | `top-layer/src/internal/use-width-from-anchor.tsx:79,87`                     | `min-width` (`anchor-size(width)`)                                                 | top-layer internal | yes                  | `min-anchor` mode dies; same fix as #8.                                                                |
| 10  | `top-layer/src/internal/use-width-from-anchor.tsx:68-71,92,96`               | `min-inline-size: max-content`                                                     | top-layer internal | yes                  | This floor is what drives `position-try-fallbacks` instead of wrapping — losing it changes _flipping_. |
| 11  | `top-layer/src/internal/set-style.tsx:20-22`                                 | all of rows 3-10                                                                   | top-layer internal | yes                  | Single choke point: add a `priority` argument and pass `'important'` for geometry writes.              |
| 12  | `top-layer/src/dialog/dialog-content.tsx:66`                                 | `margin: auto`                                                                     | top-layer internal | yes                  | Forcing `margin: auto` on the `<dialog>` host breaks every adopter margin (rows 28, 30).               |
| 13  | `top-layer/src/dialog/dialog-content.tsx:57-58`                              | `max-width: none`, `max-height: none`                                              | top-layer internal | yes                  | Forcing these removes the `maxWidth` key the public `xcss` prop advertises (rows 26, 28).              |
| 14  | `top-layer/src/dialog/dialog-content.tsx:59-64` (comment)                    | `height`                                                                           | top-layer internal | yes                  | Dialog deliberately omits `height: auto` because UA `inset: 0` + `margin: auto` centring needs it.     |
| 15  | `top-layer/src/popover/popover.tsx:92-94`, `dialog/dialog-content.tsx:75-77` | `display` (via `transition-property: overlay, display`, `allow-discrete`)          | top-layer internal | yes                  | A forced `display` never changes computed value, so the discrete display transition cannot run.        |
| 16  | `top-layer/src/popover/popover.tsx:396-398,406`                              | `display`                                                                          | top-layer internal | yes                  | UA `[popover]:not(:popover-open){display:none}` is the only thing hiding a mounted-but-closed host.    |
| 17  | `top-layer/src/internal/use-anchor-position.tsx:284-292`                     | fallback-applied `inset`/`margin` under `position-area` / `position-try-fallbacks` | top-layer internal | unknown              | Verify in Chromium whether a used position option still overrides an `!important` `inset`.             |
| 18  | `top-layer/src/internal/use-anchor-position-at-point.tsx:30-43,142-143`      | `position`, `top`, `left`, `width`, `height`                                       | top-layer internal | no                   | Synthetic anchor is a separate `document.body` child — safe **only** if the rule stays host-scoped.    |
| 19  | `top-layer/src/internal/resolve-css-length-to-pixels.tsx:89-98`              | `position`, `height`, `margin-left`                                                | top-layer internal | no                   | Probe is a host _child_; a descendant-scoped `margin !important` would silently zero every gap.        |

### `@atlaskit/popper` — the heaviest host writer

| #   | path (`file:line`)                                                      | property                                                        | whoSetsIt   | breaksUnderImportant | mitigation                                                                                     |
| --- | ----------------------------------------------------------------------- | --------------------------------------------------------------- | ----------- | -------------------- | ---------------------------------------------------------------------------------------------- |
| 20  | `popper/src/internal/use-fit-viewport-max-size.tsx:104`                 | `display: flex`                                                 | adopter     | yes                  | `shouldFitViewport` needs flex so an oversized child can shrink to the cap.                    |
| 21  | `popper/src/internal/use-fit-viewport-max-size.tsx:105-114`             | `min-inline-size: 0`, `max-block-size`, `max-inline-size`       | adopter     | yes                  | The viewport caps _and_ the deliberate neutralisation of row 10's floor both lose.             |
| 22  | `popper/src/internal/use-fit-viewport-max-size.tsx:44-56,63-68,115-121` | three `margin-*` longhands (legacy `viewportPadding: 5`)        | adopter     | yes                  | Capped popovers would sit flush against the viewport edge.                                     |
| 23  | `popper/src/popper-top-layer.tsx:229-240`                               | `min-inline-size: max-content` via `useWidthFromAnchor('none')` | adopter     | yes                  | Comment at `:236-237` states this floor is what drives `position-try-fallbacks` over wrapping. |
| 24  | `popper/src/popper-top-layer.tsx:242-257`                               | `display`, `margin`, `min-*`, `max-*` via `shouldFitViewport`   | public prop | yes                  | Public prop whose entire implementation is host-level and entirely inside the forced set.      |
| 25  | `popper/src/internal/set-style.tsx:24,33`                               | all of rows 20-23                                               | adopter     | yes                  | Second choke point; same `priority` fix as row 11.                                             |

### Public API surfaces that promise consumer control

| #   | path (`file:line`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | property                                                                                                   | whoSetsIt           | breaksUnderImportant | mitigation                                                                                                |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------- | -------------------- | --------------------------------------------------------------------------------------------------------- |
| 26  | `top-layer/src/dialog/types.tsx:61-78`, applied at `dialog/dialog-content.tsx:299-300`                                                                                                                                                                                                                                                                                                                                                                                                                    | `margin`, `height`, `width`, `maxWidth`, `insetBlockStart`, `insetInlineStart`, `insetInlineEnd`           | public prop         | yes                  | Re-plumb `xcss`'s geometry keys onto host-read custom properties, or carve `Dialog` out of rung 2.        |
| 27  | `top-layer/src/dialog/types.tsx:98-102`, applied at `dialog/dialog-content.tsx:295`                                                                                                                                                                                                                                                                                                                                                                                                                       | any of the five groups via `style`                                                                         | public prop         | yes                  | Inline `style` is a _normal_ declaration and loses to `!important`; document or re-plumb.                 |
| 28  | `drawer/src/drawer-panel/drawer-top-layer.tsx:43-52,265`                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `margin: 0`, `insetBlockStart/InlineStart: 0`, `insetInlineEnd: auto`, `height: 100dvh`, `maxWidth: 100vw` | adopter             | yes                  | Drawer would revert to the primitive's centred `margin: auto` — it would stop being a drawer.             |
| 29  | `drawer/src/drawer-panel/drawer-top-layer.tsx:74-88,140,265`                                                                                                                                                                                                                                                                                                                                                                                                                                              | `width` per `width` preset (`narrow`…`full`)                                                               | public prop         | yes                  | The public `width` prop lands directly on the host; only a custom property survives.                      |
| 30  | `modal-dialog/src/internal/components/modal-wrapper.tsx:60-79,419`                                                                                                                                                                                                                                                                                                                                                                                                                                        | `margin: 0px` / `@media margin: 60px auto`; `width: 100vw`, `height: 100vh` (`viewport-scroll`)            | adopter             | yes                  | Modal loses its 60px viewport inset and, in `viewport-scroll`, its full-viewport host.                    |
| 31  | `modal-dialog/src/internal/components/modal-wrapper.tsx:217-265,442-456`                                                                                                                                                                                                                                                                                                                                                                                                                                  | public `width`/`height` → `--modal-dialog-width` / `--modal-dialog-height`, read at `:147-149,157-159`     | public prop         | no                   | Lands on the inner surface `<div>`, not the host — **and is the working precedent for the escape hatch.** |
| 32  | `popup/src/popup-top-layer.tsx:75,200-205`                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `width` via `useWidthFromAnchor('match-anchor')`                                                           | public prop         | yes                  | Public `shouldFitContainer`; fixed by the same custom-property plumbing as row 8.                         |
| 33  | `popup/src/compositional/popup-content-top-layer.tsx:210-222`                                                                                                                                                                                                                                                                                                                                                                                                                                             | `width` / `min-width` via the same hook pair                                                               | public prop         | yes                  | Compositional `Popup` has the same `shouldFitContainer` exposure.                                         |
| 34  | `dropdown-menu/src/dropdown-menu-top-layer.tsx:153-158`                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `min-width` via `useWidthFromAnchor('min-anchor')`                                                         | public prop         | yes                  | `shouldFitContainer` on `DropdownMenu` maps to the `min-anchor` floor on the host.                        |
| 35  | `react-select/src/components/menu-portal-top-layer.tsx:81-86`                                                                                                                                                                                                                                                                                                                                                                                                                                             | `width: anchor-size(width)` via `useWidthFromAnchor('match-anchor')`                                       | adopter             | yes                  | **Highest-volume case:** every `Select` menu's "match the control width" behaviour is a host `width`.     |
| 36  | `tooltip/src/tooltip.tsx:770-776,790-807`; `select/src/popup-select/popup-select-top-layer.tsx:145-150`; `datetime-picker/src/internal/menu-top-layer.tsx:68-76` and `internal/fixed-layer-menu-top-layer.tsx:88-96`; `inline-dialog/src/inline-dialog-top-layer.tsx:163-168`; `avatar-group/src/components/avatar-group-top-layer.tsx:114-119`; `spotlight/src/ui/popover-content/top-layer.tsx:70-75`; `dropdown-menu/src/dropdown-menu-top-layer.tsx:146-151`; `popup/src/popup-top-layer.tsx:193-198` | `margin-*` (gap), `inset`/`top`/`left` via `useAnchorPosition`                                             | adopter             | yes                  | Every anchored adopter inherits rows 4, 5 and 7; one fix at row 11 covers all nine call sites.            |
| 37  | `spotlight/src/ui/popover-content/top-layer.tsx:97`, `spotlight/src/utils/use-position-area/index.tsx:27-40`                                                                                                                                                                                                                                                                                                                                                                                              | **reads** the host's resolved `position-area` to lay out card + caret                                      | adopter             | unknown              | A read-dependency on host positioning; confirm forced `inset`/`margin` do not change the resolved value.  |
| 38  | `flag/src/flag-group.tsx:380-385`                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | relies on the primitive's `inset: auto` / `margin: 0` / `height: auto` and the UA `width: fit-content`     | adopter             | unknown              | No positioning hook at all; forcing `width`/`height`/`display` to a chosen value is the risk here.        |
| 39  | `popup/src/popup-top-layer.tsx:289-297`                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | consumer `xcss` / `style`                                                                                  | public prop         | no                   | Popup's `xcss` reaches the inner `Container`, not the host — unaffected.                                  |
| 40  | `top-layer/notes/decisions/fixed-position-popover.md:19-35`                                                                                                                                                                                                                                                                                                                                                                                                                                               | `position: fixed`, `inset-*`                                                                               | consumer-documented | no                   | The documented fixed-position (flag) recipe styles a **child** of `Popover`, so it is already safe.       |
| 41  | `tokens/src/artifacts/themes/atlassian-motion.tsx:7-60,229`                                                                                                                                                                                                                                                                                                                                                                                                                                               | keyframe targets                                                                                           | top-layer internal  | no                   | DS enter/exit keyframes animate only `transform`/`opacity`, so no animation fights the forced set.        |

### Cascade-order and existing-`!important` reliance (question 3)

| #   | path (`file:line`)                                                                                    | property                                                                                                  | whoSetsIt          | breaksUnderImportant | mitigation                                                                                                              |
| --- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------ | -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 42  | `top-layer/src/dialog/types.tsx:61-66`, `dialog/dialog-content.tsx:283-303`                           | documented "consumer `xcss` applied after built-ins"                                                      | top-layer internal | yes                  | Equal-specificity last-wins is a documented contract; `!important` inverts it for 7 of 9 keys.                          |
| 43  | `top-layer/src/popover/popover.tsx:413-424`                                                           | entering/exiting animation `xcss` after `css`                                                             | top-layer internal | no                   | Animation properties only — outside the forced set.                                                                     |
| 44  | `navigation-system/src/ui/page-layout/root.tsx:58-67`                                                 | `> :not([data-layout-slot]) { display: none !important }` at (0,2,0)                                      | adopter            | yes                  | **Rung 2 alone loses:** a top-layer atomic class is (0,1,0), so rung 3 (specificity) must land with it.                 |
| 45  | `navigation-system/src/ui/page-layout/root.tsx:68-77`                                                 | gate-on variant excludes `dialog`/`[popover]` _because_ hosts are UA `display: none` when closed          | adopter            | yes                  | An in-repo dependency on the UA closed-state `display: none`; a forced `display` makes closed hosts grid items.         |
| 46  | `modal-dialog/src/internal/components/positioner.tsx:69-73`, `tooltip/src/tooltip-shortcut.tsx:44-47` | existing `insetBlockStart: '60px !important'`, `backgroundColor: 'unset !important'`                      | adopter            | no                   | Precedent that ADS already ships geometry `!important` against product globals; costs one lint suppression each.        |
| 47  | `pragmatic-drag-and-drop/core/src/util/popover-reset-styles.ts:25-41`                                 | second independent `[popover]` reset: `inset: unset`, `margin: 0`, `width: auto`, `height: auto` (inline) | adopter            | yes                  | **The hardening selector must be top-layer-class-scoped, not `[popover]`**, or pdnd's honey pot and drag preview break. |
| 48  | product CSS already shipping `!important` geometry that reaches a host                                | all five groups                                                                                           | adopter            | unknown              | Sizing job for the Phase 1b runtime detector; important-vs-important is decided by specificity.                         |

**Totals: 48 findings — 33 `yes`, 11 `no`, 4 `unknown`.**

### Question 3, stated plainly

**Yes, three separate things rely on cascade order or importance at the host today.**

1. **A documented ordering contract.** `top-layer/src/dialog/types.tsx:61-66` says the `xcss` prop
   is "applied after built-in dialog and animation styles so consumers can own" them, and
   `dialog-content.tsx:283-303` implements exactly that — built-ins via `css=`, consumer `xcss` via
   `className={cx(consumerXcss, …)}` afterwards, equal specificity, last-one-wins. `!important`
   inverts this for seven of the nine keys `xcss` accepts (row 26). The parallel ordering in
   `popover.tsx:413-424` is animation-only and unaffected.
2. **Specificity, not importance, is the real battleground.**
   `tooltip/src/tooltip-shortcut.tsx:44-47` already ships `!important` specifically "to override a
   more specific global style in Jira", and `navigation-system/src/ui/page-layout/root.tsx:58-67`
   ships `display: none !important` behind a child selector at (0,2,0). A Compiled atomic class is
   (0,1,0), so a rung-2 `!important` **loses to both**. Rungs 2 and 3 are not independent: rung 2
   must ship with raised host specificity, and note the ADS `no-unsafe-selectors` rule explicitly
   forbids the `&&` specificity-bumping idiom
   (`eslint-plugin-ui-styling-standard/src/rules/no-unsafe-selectors`), so the bump needs a
   different mechanism (e.g. compounding the `[popover]` attribute onto the class) plus a lint
   suppression.
3. **A second, non-top-layer `[popover]` host reset already exists.**
   `pragmatic-drag-and-drop/core/src/util/popover-reset-styles.ts:25-41` resets `inset`/`margin`/
   `width`/`height` as an inline `style` object on its own popover elements, and its comment at
   `:25-30` documents that `width`/`height: auto` (not `fit-content`) is deliberate — it avoids the
   same Safari flex-collapse bug `top-layer/notes/decisions/safari-popover-flex-collapse.md` and
   `popover.tsx:81-84` work around. If rung 2's selector is `[popover]`-scoped it breaks pdnd; if it
   forces `width: fit-content` it reintroduces a Safari bug two packages independently avoided.

---

## Verdict

`viable-with-carve-outs`.

`position` is nearly free, and `inset` / `margin` / `width` / `height` are recoverable — but only if
top-layer and popper first promote their own geometry writes to `important` priority (a `priority`
argument in the two `setStyle` helpers, `top-layer/src/internal/set-style.tsx:21` and
`popper/src/internal/set-style.tsx:24`) **and** `Dialog`'s typed `xcss` geometry keys
(`dialog/types.tsx:67-78`) are re-plumbed onto host-read custom properties, because today those keys
are the entire positioning strategy of `@atlaskit/drawer` and `@atlaskit/modal-dialog` (rows 26-30).
`display` and the `min-*`/`max-*` half of the size group must be dropped outright: forcing `display`
breaks the UA `:popover-open` toggle, the `allow-discrete` exit transition, popper's
`shouldFitViewport` flex host and navigation-system's safety-rail assumption (rows 15, 16, 20, 45),
and forcing `min-*`/ `max-*` means inventing host values that kill `useWidthFromAnchor`'s
`max-content` floor and popper's viewport caps (rows 10, 21, 23). Two further gates on landing at
all: the rule must be scoped to a top-layer class rather than `[popover]` (row 47), and it must ship
with rung 3, because at atomic-class specificity its `!important` already loses to rules that exist
in this repo (row 44).

## Escape hatch

**Primary: one host-read custom property per forced property, registered with
`@property { inherits: false }`.** The host declares
`width: var(--ds-top-layer-width, auto) !important` (and a var per forced property/longhand — four
each for `margin` and `inset`), and every DS-internal writer — `useAnchorPosition`'s gap,
`useWidthFromAnchor`'s width, popper's caps, `Dialog`'s geometry props — sets the **variable**
instead of the property, so no internal caller needs `!important` and no priority games are
required. The pattern works here, and there is precedent in the same code path: `modal-dialog`
already drives host-adjacent sizing through `--modal-dialog-width` / `--modal-dialog-height`
(`modal-wrapper.tsx:451-456`, consumed at `:147-149,157-159`), and `@property` is an explicitly
allowed at-rule in ADS styles
(`eslint-plugin-ui-styling-standard/src/rules/no-unsafe-selectors/index.tsx:19`). The
`inherits: false` registration is load-bearing: a plain inherited custom property set on `body` by
product CSS would leak into every host on the page and re-open the exact hole rung 2 closes.

**Secondary, for the residue we cannot enumerate:** a documented opt-out attribute on the host, so
the rule is authored as `.ds-top-layer-host:not([data-ds-geometry-unsafe]) { … !important }`. One
boolean, no var plumbing, and it gives an adopter or a product a way out without inverting the
cascade for everyone. Both hatches have to live inside the host's own declaration — an author rule
can never beat `!important` without its own `!important`, which is precisely the escalation we are
trying to end.

**Not viable as a hatch:** leaving `Dialog.xcss` as-is and telling consumers to add `!important`.
That would make drawer and modal-dialog ship `!important` geometry too (rows 28-30), and the
resulting important-vs-important fight is decided by specificity, which consumers cannot control
from an atomic class.

---

## Required VR coverage

The hosts only exist in the DOM **while open or exit-animating** (see
`unsafe-selectors-prework/insertion-positions-anchored.md`), so every fixture below must be a
`snapshotInformational` with a `prepare: async (page) => { await page.getByRole(…).click() }` that
opens the surface. Static closed-state `snapshot()` calls prove nothing about this change. Run both
suites (`yarn test:vr:aggregate <path> --update`) — regular and informational baselines live in
separate `__snapshots__` folders.

**Existing suites that are already the regression oracle for rung 2** (run with the gate on, before
and after):

- `top-layer/__tests__/vr-tests/js-fallback.vr.tsx` — the fallback `top`/`left` (row 7). **The
  single highest-value existing test for this change.**
- `top-layer/__tests__/vr-tests/placement-offset.vr.tsx` — the `offset.gap` margin (rows 4, 5).
- `top-layer/__tests__/vr-tests/popover-width-from-anchor.vr.tsx` — `match-anchor` / `min-anchor`
  (rows 8-10, 32-35).
- `top-layer/__tests__/vr-tests/all-placements.vr.tsx`, `placements.vr.tsx`, `css-fallbacks.vr.tsx`
  — flip/slide behaviour, which row 10 shows is coupled to the `max-content` floor.
- `top-layer/__tests__/vr-tests/multiple-popovers-on-same-anchor.vr.tsx`,
  `surface-inheritance-reset.vr.tsx`.
- `top-layer/__tests__/informational-vr-tests/safari-flex-collapse.vr.tsx` (rows 14, 47) and
  `ssr-dialog.vr.tsx` (rows 15, 16 — first paint / SSR is where a forced `display` shows up).

**New coverage required:**

1. **Adversarial host fixture** (new, `top-layer/__tests__/informational-vr-tests/`): a `Popover`
   and a `Dialog` whose consumer container carries hostile declarations for all five groups via
   `> *` / `:last-child`, snapshotted open, gate on and gate off. This is the fixture that proves
   the hardening works at all, and the only one that covers the balloon damage mode directly.
2. **`popper` `shouldFitViewport`** — `popper/src/**/__tests__/vr-tests` (3 suites) and
   `informational-vr-tests` (3): all four placement axes with the anchor near a viewport edge, so
   the caps, the `display: flex` host and the 5px viewport padding (rows 20-24) are all exercised.
3. **`drawer`** open at every `width` preset and every `enterFrom` (rows 28, 29) —
   `drawer/src/**/vr-tests` (5) + `informational-vr-tests` (3). The single most exposed adopter: its
   entire position comes from the `Dialog` `xcss` prop.
4. **`modal-dialog`** open in all three scroll modes (`body-scroll`, `viewport-scroll`,
   `full-screen`) × a named `width`, a numeric `width`, a `%` width and an explicit `height` (rows
   30, 31) — `modal-dialog/src/**/informational-vr-tests` (7 suites; no regular suite exists).
5. **`react-select` / `select`** menu open on a wide and a narrow control (row 35 — menu width must
   still equal control width) — `react-select/src/**/informational-vr-tests` (3),
   `select/src/popup-select/__tests__/informational-vr-tests`,
   `select/src/components/__tests__/vr-tests`.
6. **Anchored menu adopters open at the edge of the viewport** (gap + flip, rows 34, 36):
   `dropdown-menu` (`src/**/vr-tests`, 4 + 4) including `shouldFitContainer`, `popup` (7 + 4)
   including `shouldFitContainer`, `datetime-picker` (`src/components/__tests__/vr-tests`),
   `inline-dialog` (2 + 3), `tooltip` (`src/**/vr-tests`, 5 — cursor-anchored, so it also covers row
   18).
7. **Non-anchored / read-dependent adopters**: `flag` (2 + 3 — row 38, the only adopter with no
   positioning hook), `spotlight`/`onboarding`
   (`onboarding/src/components/__tests__/{vr-tests,informational-vr-tests}` — row 37's caret
   placement is the assertion), `avatar-group`
   (`avatar-group/src/components/__tests__/{vr-tests,informational-vr-tests}`).
8. **`navigation-system` page layout** with a `Popover`/`Dialog` as a direct `Root` child, closed
   and open (rows 44, 45) — this is the fixture that catches a forced `display` turning a closed
   host into an implicit grid track.

Per the plan, VR is only half of the verification: re-run the Phase 1b runtime detector with the
hardening on and diff host computed styles against a portalled baseline. Rows 17, 37, 38 and 48 are
the four `unknown`s that only a real browser can close.
