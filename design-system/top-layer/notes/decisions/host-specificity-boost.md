# Host specificity boost

**Status:** implemented 2026-10-07 for `Popover` and `Dialog`. Step 1 of
[`../plans/unsafe-selectors-plan.md`](../plans/unsafe-selectors-plan.md).

`Popover` and `Dialog` render their host inline in the consumer's DOM, so a consumer rule such as
`.toolbar > div` can land on it. Each host declares its own styles at (0,4,0), so a class-level
consumer rule loses. The boost uses `:defined`, repeated three times, on the host class. Every
built-in element matches `:defined` in every state, and `no-unsafe-selectors` allows it.

**Selectors considered.** `[popover]` also matches in every state, but `<dialog>` has no attribute
that is always present, and both hosts use one selector for consistency. A rendered `[data-*]`
attribute would also work, but needs a `no-nested-selectors` disable. `&&&&` (the host class 4
times) compiles correctly, but `no-unsafe-selectors` bans a chained `&` as a specificity hack, and
the ratchet counts that disable. `!important` breaks 33 of 48 measured sites.

## `Popover`: done

`src/popover/popover.tsx` declares the host's styles at (0,4,0), with no class-level copy:

| Selector                                   | Compiled output                                   | Declares                       |
| ------------------------------------------ | ------------------------------------------------- | ------------------------------ |
| `&:defined:defined:defined`                | `.<class>:defined:defined:defined`                | Everything below but `display` |
| `&:popover-open:popover-open:popover-open` | `.<class>:popover-open:popover-open:popover-open` | `display: flex`                |

The host is a built-in element, so it always matches `:defined`, and the `:defined` block holds in
every state, including the exit animation. `display` is the one property that depends on the open
state: an author `display` that also matched a closed host would beat the UA
`[popover]:not(:popover-open) { display: none }` rule and leave a hit-testable ghost (see
`./fit-available-space.md`). So `display: flex` is keyed on `:popover-open`, and the closed
`display: none` is left to the UA rule.

`:defined` is on the `no-unsafe-selectors` allow list, so neither block needs an ESLint disable. An
earlier version keyed the block on `[popover]`, which also matches in every state but is an
attribute, so each key needed a `no-nested-selectors` disable. The owner switched to `:defined`
because it needs no disable and `Dialog` uses the same selector.

**What the block declares.** Each value is what the host computes when no consumer rule lands on it,
so the block changes nothing until a consumer rule competes. The one exception is visible only in
`getComputedStyle`: `align-self` and `justify-self` compute to `normal` instead of `auto`. On a
positioned host both behave as `normal`, so layout does not change.

| Property                                                         | Value          | Why                                                                                              |
| ---------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------ |
| `display`                                                        | `flex`         | Open state only. See `./fit-available-space.md`                                                  |
| `flex-direction`, `flex-wrap`, `align-items`, `justify-content`  | initial values | The child fill relies on a single-line `row` container                                           |
| `position`                                                       | `fixed`        | The UA value. The JavaScript fallback writes viewport coordinates                                |
| `border`, `padding`, `margin`, `inset`, `overflow`, `background` | resets         | Formerly class-level                                                                             |
| `width`                                                          | `fit-content`  | The UA value, so anchor-width matching is unchanged (`./width-from-anchor-floors.md`)            |
| `height`                                                         | `auto`         | Formerly class-level. See `./safari-popover-flex-collapse.md`                                    |
| `min-width`, `max-width`, `min-height`, `max-height`             | initial values | The size hooks write their own values inline                                                     |
| `align-self`, `justify-self`                                     | `normal`       | Under `position-area`, `normal` gives the area's default alignment, such as `anchor-center`      |
| `transform`, `translate`, `scale`, `rotate`                      | `none`         | A consumer transform would move the host. The motion keyframes still win, as animations do       |
| `opacity`                                                        | `1`            | The keyframes and the JavaScript fallback's inline `opacity: 0` still win                        |
| The 7-property surface reset                                     | reset values   | `TBoostedSurfaceReset` checks the names, and `popover-host-specificity.vr.tsx` checks the result |

**What it leaves out.**

- `box-sizing`. A page with `* { box-sizing: inherit }` passes the host's value to every descendant,
  and with no padding or border it does not change the host's own box.
- `color`, `font`, `direction` and `writing-mode`. These must inherit.
- Paint properties the DS has never set, such as `box-shadow`, `filter` and `background-image`.
  Compiled writes `background: transparent` as `background-color` only.
- Properties that are inert on a fixed-position host: `float`, `order`, `flex` and `z-index`.
- `transition` and `animation`. See the limits.

**Where the DS still wins.** Inline styles beat any selector, so the positioning hooks keep control
of `margin`, `inset`, sizes, `top`, `left` and `opacity`. Animations beat normal declarations.

**The exit gap is closed.** The first version keyed the whole block on `:popover-open`, with a
class-level copy for the exit. `:popover-open` stops matching as soon as the popover closes, so
during the exit animation a consumer rule landed again and the host jumped. The `:defined` block
matches during the exit too. The closed `display: none` still comes from the UA rule, and it does
not cut the exit short: the `overlay, display` transition in `styles.motion` (`allow-discrete`)
holds `flex` for the exit duration.

**Before open, and with no Popover API.** The `:defined` block also matches in the mount frame
before `showPopover()`, but the UA `display: none` hides the host then, and the layout effect opens
it before the first paint. A browser with no Popover API has no UA `[popover]` rules, so the host
used to render in flow. Now the boost makes it `position: fixed` at its static position.
`@atlaskit/top-layer` needs the Popover API, so this is noted only.

**Limits.**

- A consumer `display` rule can still land on a closed host, during the exit or before it opens, the
  same as before the boost. Boosting the closed `display: none` needs a `:not(:popover-open)`
  selector. `no-unsafe-selectors` forbids `:not`, and the ratchet counts that disable, so adding it
  needs a ratchet exclusion agreed with #help-ui-styling-standard.
- A consumer `animation` or `transition` declaration still replaces the popover's own motion. A
  consumer `transition` can also make the Chromium exit jump.
- A consumer rule of (0,4,0) or more can still win, such as one with an ID, or one with
  `!important`.
- The boost defends the host box only. A descendant rule such as `.consumer div` still restyles
  `PopoverSurface` and the content inside the host.

**Evidence.** All 45 host-landing rules in the corpus were at most (0,3,1). Compile: Babel extract
and `@atlaspack/rust` both write the 38 boosted rules and the 1 `display` rule, `@compiled/css`
`sort()` and the `ap` sorter (`ap_compiled_css`) keep all 39, and Chromium `replaceSync` keeps all
39 in every output. Browser fixtures (Chromium 143, real Safari 27, real Firefox 153), using the
compiled CSS and the real `styles.motion`, 2026-10-02:

- **Open state.** 16 of 17 class-level hostile rules lose, anchored and bare, on all three engines.
  The one that wins is a consumer `animation`, as expected. `!important` and ID rules also win.
- **Exit, hostile rules without `display`.** No jump on any engine, animated or not, except the
  consumer `transition` (Chromium) and `animation` cases. The first version jumped in Chromium for
  every animated case. Live Chromium sampling with a consumer `align-self: center`: the first
  version jumped 171 px when the exit started, and this version follows the unhostile exit frame for
  frame. Chromium holds `display: flex` for about 100 ms, then goes to `none`. Safari 27 and Firefox
  153 report `display: none` from the first frame after close, in both versions.
- **Exit, hostile rules with `display: block`.** The host changes only `display`, and the box
  changes with it. This is the first limit above.
- **Placement.** Seven placements, including two flips, with hostile `align-self` and `justify-self`
  rules: all correct when open on every engine. In Chromium the first version jumped at exit start
  for 19 of 35 cells; this version jumps for none.

The `ap` build is also checked by the Gemini VR tests in `popover-host-specificity.vr.tsx`
(Chromium). Four hostile selector shapes, from (0,1,0) to (0,3,1), attack every boosted property
except `pointer-events`, which a snapshot cannot see. They run with CSS anchor positioning, with the
JavaScript fallback, and with no positioning hook, plus a two-item content for the flex container
properties. Every hostile snapshot matches its baseline. Mutation check, 2026-10-02: removing any
one declaration from the boost fails at least one snapshot, for every property except `position`,
and reverting the whole boost fails every open hostile snapshot, the fallback one included.

- `position` does not show. The top layer computes a `relative` host to `absolute`, which lands
  where `fixed` does while the page is not scrolled.
- The snapshot compares each pixel with Playwright's default colour threshold (0.2), so a change to
  a low-contrast pixel does not fail it. The `overflow` and `min-height` mutants first passed for
  this reason, not because of a first-paint timing difference: the clip only removed a subtle fill
  from a white page, and the taller surface was white on white. The two-item content now uses bold
  fills, and the fixtures with no positioning hook use a dark page. Both mutants now fail.
- The positioning hooks write the max sizes and the placement-axis min size inline, so only the
  fixture with no positioning hook catches `max-width` and `max-height`.

Three `Limit` snapshots pin the ID, `!important` and descendant limits.

**No feature gate.** Every usage of `@atlaskit/top-layer` is already behind a gate or an experiment.

**After the move from `[popover]` to `:defined`** (2026-10-07). The evidence above was measured with
`[popover]`. Only the selector changed. ESLint and the typecheck pass; the compile and browser
checks were not run again.

## `Dialog`: done, except the 9 `xcss` properties

`src/dialog/dialog-content.tsx` declares the `<dialog>` host's styles at (0,4,0), except the 9
properties that its `xcss` prop allows:

| Selector                    | Compiled output                    | Declares                                |
| --------------------------- | ---------------------------------- | --------------------------------------- |
| `&:defined:defined:defined` | `.<class>:defined:defined:defined` | Every boosted property except `display` |
| `&[open][open][open]`       | `.<class>[open][open][open]`       | `display: block`                        |
| none (class level, (0,1,0)) | `.<class>`                         | `margin: auto`, `max-width: none`       |

**Why not boost the geometry too.** `Dialog`'s `xcss` is (0,1,0) and allows `margin`, `height`,
`width`, `maxWidth`, `insetBlockStart`, `insetInlineStart`, `insetInlineEnd`, `overflow` and
`scrollbarGutter` (`src/dialog/types.tsx`). A boosted default for any of these would beat the
adopter's own `xcss`. The adopters set them like this, through `xcss` only (neither passes `style`):

| Adopter                                                      | `xcss` on the `<dialog>`                                                                                                                                                               | Varies by                                                  |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `modal-dialog` (`src/internal/components/modal-wrapper.tsx`) | `body-scroll`: `overflow: visible`, `margin: 0`, and `margin: 60px auto` from 30rem. `viewport-scroll`: `scrollbar-gutter: stable`, `width: 100vw`, `height: 100vh`. Full screen: none | Scroll mode and the 30rem breakpoint                       |
| `drawer` (`src/drawer-panel/drawer-top-layer.tsx`)           | `margin: 0`, `inset-block-start: 0`, `inset-inline-start: 0`, `inset-inline-end: auto`, `height: 100dvh`, `max-width: 100vw`, a `width` preset, and the `--x` and `--y` variables      | `width` (360px, 480px, 600px, 95vw, 100vw) and `enterFrom` |

`modal-dialog`'s width and height presets go to its inner surface, as inline `--modal-dialog-width`
and `--modal-dialog-height` variables, not to the `<dialog>`. The drawer also sets the motion
through `enteringAnimationXcss` and `exitingAnimationXcss`. The other importers (two
`navigation-system` examples, a `tooltip` example and the `top-layer` examples) set no `xcss`.

The owner chose to boost everything except these 9. The two alternatives were rejected:

- Routing the 9 through CSS variables that the boosted block reads would stop the `xcss` geometry
  keys from working. That is a breaking change to a public prop, so a major, and both adopters would
  change.
- Inline defaults would beat the adopters' `xcss`, and `modal-dialog`'s breakpoint margin cannot be
  inline.

**The selectors.** The main block keys on `:defined`, like `Popover` (see "Selectors considered"
above). `display` depends on the open state, so it is keyed on `[open]`, which needs a
`no-nested-selectors` disable that the ratchet does not count. `:modal` would need a
`no-unsafe-selectors` disable, which the ratchet counts.

**What the block declares.** The padding, `border`, `max-height` and `background` resets, which were
class level. The initial values of `min-width`, `min-height`, `transform`, `translate`, `scale`,
`rotate` and `opacity`. `align-self` and `justify-self: normal`, which compute to `normal` instead
of `auto`, with no layout change. The UA modal values `position: fixed` and `inset-block-end: 0`.
The 7-property surface reset. `display: block`, the UA value, while open.

**Exit and closed states.** Chromium is the only engine with an exit animation here (it supports
`overlay`), and it keeps the UA modal values during the exit, so the main block matches what it
computes. Safari 27 and Firefox 153 hide the dialog on `close()`; there, a closed dialog now
computes `position: fixed` and `inset-block-end: 0` instead of `absolute` and `auto`, which does not
show under `display: none`. `Dialog` unmounts the host after the exit.

**Limits.**

- A consumer rule can still set the 9 `xcss` properties. Closing this needs the variable design
  above, and so a major.
- A consumer `display` rule can still land on a closed dialog, between `close()` and the unmount.
  This is unchanged, and it needs `:not([open])`, as for `Popover`.
- A rule of (0,4,0) or more, such as one with an ID, still wins, and so does `!important`. A
  consumer `animation` or `transition` still replaces the dialog's own motion.
- The boost defends the host box only, not the content inside it, and not `::backdrop`.

**Evidence.** Compile: Babel extract and `@atlaspack/rust` both write the 25 main-block rules and
the 1 `[open]` rule (`@atlaspack/rust` writes each twice, and the sorters remove the copies).
`@compiled/css` `sort()` and the Parcel optimizer keep all 26, and `replaceSync` keeps all 26 in
Chromium 143, Safari 27 and Firefox 153. Browser fixtures, using the compiled CSS of `Dialog`,
`modal-dialog` and `drawer`, class lists composed with Compiled's `ax`, and a scrolled page,
2026-10-06:

| Fixture                                       | Before                                           | After, Chromium 143, Safari 27, Firefox 153                          |
| --------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| 4 class-level rules, (0,1,0) to (0,3,1), open | Every attacked property leaks, and the box moves | No change, in all 3 engines and both builds                          |
| `display: none` rule, open                    | The dialog hides                                 | No change                                                            |
| ID rule, `!important` rule                    | Leak                                             | Leak (limit)                                                         |
| Rule on the 9 `xcss` properties               | Leak                                             | Leak (limit)                                                         |
| Chromium exit, 4 class-level rules            | Every attacked property leaks, and the box moves | No change                                                            |
| No hostile rule                               | Reference                                        | Same boxes; only `align-self` and `justify-self` compute differently |

Each fixture ran for a bare `Dialog`, `modal-dialog` with the medium width in `body-scroll` mode,
and the narrow `drawer`. The adopters' geometry was the same before and after.

The `ap` build is checked by the Gemini VR tests in `dialog-host-specificity.vr.tsx` (Chromium).
Three hostile selector shapes and a `display: none` rule attack every boosted property, and a fourth
fixture checks geometry through `xcss` with `margin: 0`, where `align-self` and `justify-self` show.
Every hostile snapshot matches its baseline. Mutation check, 2026-10-06: removing the whole boost
fails all 5 hostile snapshots, and the baselines and limits still pass. Removing any one declaration
fails at least one snapshot, except `pointer-events` and `position`, which a snapshot cannot see;
the padding, `border` and `background-color` mutants also change the baselines. The non-text mutants
ran before the card's long word was lengthened, which changes only the line breaks. Three `Limit`
snapshots pin the ID, `!important` and `xcss` limits.
