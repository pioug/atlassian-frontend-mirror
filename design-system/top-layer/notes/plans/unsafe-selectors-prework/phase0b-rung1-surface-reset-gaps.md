# Phase 0b rung 1 — `surfaceResetStyles`: current state and remaining gaps

Investigation only. No source edits were made.

## Status since this audit

The line numbers below are from the audit and have drifted. Read the code, not the numbers.

- **`pointer-events: auto` has landed** in both copies (`src/popover/popover.tsx`,
  `src/dialog/dialog-content.tsx`). The reset is now seven properties.
- **The sync check has landed, but not as the test proposed below.** It is a TypeScript identity
  type. `src/internal/surface-reset.tsx` declares `TSurfaceReset`, and each copy asserts
  `true satisfies TSurfaceResetCheck<typeof surfaceResetStyles.root>`. Extra, missing or widened
  properties fail the build. No source parsing is needed.
- **`line-height` is dropped. The owner decided it is not needed in the host reset.** Three reasons:
  1. The reset excludes `font` as theming on purpose, and `line-height` is a `font` shorthand
     component. Pinning `line-height: 20px` while `font-size` inherits breaks scaled regions (editor
     zoom, density). That is the same reason this audit gave `font-size` only an escape-hatch
     verdict.
  2. DS-owned surface content sets its own `font` token: `tooltip/src/tooltip-container.tsx`,
     `menu/src/internal/components/menu-item-primitive.tsx`, `flag/src/flag.tsx`,
     `modal-dialog/src/modal-body.tsx` and `modal-title.tsx`, the primitives `Text`
     (`primitives/src/compiled/components/text.tsx`), and `heading/src/heading.tsx`. So inherited
     `line-height` reaches only raw consumer text in popup, inline-dialog, spotlight or drawer
     content that uses no typography primitive.
  3. The "19 `line-height: 0` icon wrappers" figure below is a grep count with no placement
     analysis. Those rules sit on icons _inside_ triggers. The host inserts _after_ the trigger, so
     it inherits from the trigger's parent, not from the icon wrapper. This is reasoning, not
     browser-verified.

## What the reset is

`surfaceResetStyles` is a `cssMap` block that neutralises **inherited** text-layout properties which
leak into a top-layer surface. The leak exists because top-layer promotion is paint/stacking only —
the host stays a DOM child of its trigger, so CSS inheritance still flows into it (the legacy portal
path avoided this by rendering at `<body>`).

Two co-located, deliberately duplicated copies, kept aligned only by a comment
(`popover/popover.tsx:59`, `dialog/dialog-content.tsx:36`). Duplication is forced, not accidental:

> `popover.tsx:61` —
> ``// `no-imported-style-values` — Compiled styles are null at runtime), so the reset is``

### Definition and application sites (verified against working tree)

| Copy    | Defined at                                                                   | Applied at                                                                    | Host element                                |
| ------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------- |
| Popover | `platform/packages/design-system/top-layer/src/popover/popover.tsx:63`       | `platform/packages/design-system/top-layer/src/popover/popover.tsx:415`       | `<div popover={mode}>` at `popover.tsx:401` |
| Dialog  | `platform/packages/design-system/top-layer/src/dialog/dialog-content.tsx:38` | `platform/packages/design-system/top-layer/src/dialog/dialog-content.tsx:286` | `<dialog>` at `dialog-content.tsx:273`      |

Both plan-cited line numbers (`popover.tsx:415`, `dialog-content.tsx:286`) are **exact — no drift**.
In both cases the reset is applied **at the host element itself** (second entry in the host's `css`
array, after the primitive's own `styles.root` / `dialogStyles.root` and before consumer
`className`/`xcss`), so everything inside the surface inherits the reset values. These are the only
two top-layer host elements in the package — no third primitive is missing the reset.

### Inheritance mechanic (relevant to every verdict below)

CSS inheritance walks the **DOM tree**, not the box tree, so a host's out-of-flow status
(`position: fixed`, UA-supplied for `:popover-open` / `showModal()`) is **irrelevant** — every truly
inherited property reaches the host. The `text-decoration` carve-out the plan cites is a different
mechanism: `text-decoration` is _not inherited_, it _propagates_ through the box tree, and
propagation is specified to stop at out-of-flow descendants. That claim is **correct**, but it does
not generalise: `text-shadow`, `visibility`, `line-height` etc. are genuinely inherited and do reach
the host. Only `text-decoration` (and its box-tree-propagated siblings, e.g. `text-emphasis`) get a
free pass.

## Currently covered properties (6)

| Property         | Value    | `popover.tsx` | `dialog-content.tsx` |
| ---------------- | -------- | ------------- | -------------------- |
| `white-space`    | `normal` | 65            | 40                   |
| `word-break`     | `normal` | 66            | 41                   |
| `overflow-wrap`  | `normal` | 67            | 42                   |
| `text-align`     | `start`  | 68            | 43                   |
| `text-indent`    | `0`      | 69            | 44                   |
| `text-transform` | `none`   | 70            | 45                   |

**Drift check: the two copies are identical in effect — zero property drift.** Same six
declarations, same values, same order. The only difference is the surrounding prose: `popover.tsx`
carries the full rationale, and `dialog-content.tsx:32-34` adds a Dialog-specific note that the
reset is box-side-effect-free so it does not reintroduce the `margin: auto` centering problem.
Nothing to report as a diff of property names.

### Deliberate exclusions, as documented in source

> `popover.tsx:56` —
> ``// avoided this by rendering at `<body>`). Excludes `color`/`font` (theming) and``
>
> `popover.tsx:57` — ``// `direction`/`unicode-bidi` (RTL must inherit).``

`dialog-content.tsx:31` repeats the same exclusion clause. There is **no decision note** in
`notes/decisions/` for the reset — these two comment lines are the entire recorded justification,
and the `font` clause is what implicitly excludes `line-height`, `font-size`, `font-family`,
`font-weight` and `font-style` (all `font` shorthand components).

Worth flagging for the escape-hatch decision: the portal-path baseline these properties _used_ to
resolve against is set by `@atlaskit/css-reset`, at
`platform/packages/design-system/css-reset/src/base.tsx:20`:

> ``font: ${token('font.body', `normal 400 14px/1.42857142857143 ${fontFamily}`)};``

`font.body` = `normal 400 14px/20px "Atlassian Sans", …`. So "reset the font cluster to
`token('font.body')`" is not a theming imposition — it is exactly what the surface inherited under
the old portal path, and because tokens resolve through inherited custom properties it stays correct
inside `[data-subtree-theme]` regions.

## Sync-test status

> **Superseded:** the `TSurfaceResetCheck` identity type now keeps the copies in sync. See
> [Status since this audit](#status-since-this-audit).

**No unit test asserts the two copies are identical — `syncTestExists: false`.** Nothing under
`__tests__/unit/` (24 files) references `surfaceReset`, `whiteSpace`, or `nowrap`.

Existing coverage is one VR test only:

- `__tests__/vr-tests/surface-inheritance-reset.vr.tsx` →
  `examples/81-vr-surface-inheritance-reset.vr.ap.tsx`
- It exercises **one** property (`white-space: nowrap` ancestor, `Popover` only) and does not touch
  `Dialog` at all, so it would not catch the two copies drifting apart.

Implementation caveat for the plan's "add a unit test asserting the two objects are identical": with
Compiled, `cssMap` results are compiled away and are null at runtime (quoted above), so the two
objects cannot be compared directly. The test has to compare the two **source** declaration blocks
(read + parse both files) or diff `getComputedStyle` on two rendered hosts.

## Candidate properties

`reaches` = does it actually reach the out-of-flow `position: fixed` host. Evidence counts are
occurrences inside `platform/packages/design-system` only (a lower bound; product code and non-AFM
stylesheets are additional).

| Property                                                    | Inherited                                                                             | Reaches out-of-flow host                                                             | Currently excluded, and why                                                                         | Recommend                                                                                                                                                                                                                   |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `line-height`                                               | Yes                                                                                   | Yes                                                                                  | Yes, implicitly, via the `font` (theming) clause at `popover.tsx:56`                                | **leave-out** (owner decision, after this audit). The original verdict was **add** at `20px`, to neutralise `line-height: 0`/`1` icon wrappers (19 sites). Dropped: see [Status since this audit](#status-since-this-audit) |
| `pointer-events`                                            | Yes                                                                                   | Yes                                                                                  | No — not mentioned anywhere                                                                         | **add** (`auto`) — functional, not cosmetic; `auto` on a descendant genuinely restores hit-testing, and there are 71 `pointerEvents: 'none'` sites                                                                          |
| `letter-spacing`                                            | Yes                                                                                   | Yes                                                                                  | No                                                                                                  | **add** (`normal`) — cheap; note it is _not_ part of the `font` shorthand, so it needs its own declaration even if the font cluster is reset wholesale                                                                      |
| `word-spacing`                                              | Yes                                                                                   | Yes                                                                                  | No                                                                                                  | **add** (`normal`) — zero blast radius, same class as `letter-spacing`                                                                                                                                                      |
| `text-shadow`                                               | Yes                                                                                   | Yes                                                                                  | No                                                                                                  | **add** (`none`) — genuinely inherited (unlike `text-decoration`), bleeds from heading/label containers                                                                                                                     |
| `visibility`                                                | Yes                                                                                   | Yes (`visible` on a descendant of `hidden` does un-hide)                             | No                                                                                                  | **leave-out** — forcing `visible` would reveal surfaces inside deliberately hidden regions, a worse failure than the edge case it fixes; prefer a dev-only warning                                                          |
| `font-size`                                                 | Yes                                                                                   | Yes                                                                                  | Yes — deliberately, `font` (theming) clause at `popover.tsx:56`                                     | **add-with-escape-hatch** — `font-size: 0` is a live hazard (3 sites) but a blanket `14px` breaks intentionally scaled regions (editor zoom, density)                                                                       |
| `writing-mode`                                              | Yes                                                                                   | Yes                                                                                  | No — the `direction`/`unicode-bidi` carve-out is about RTL, which does not extend to vertical modes | **add** (`horizontal-tb`) — a `vertical-rl` ancestor rotates the whole surface _and_ flips the meaning of the host's own logical `inset`/`text-align: start` and the anchor-position math                                   |
| `user-select`                                               | No (but `auto` resolves from the parent's used value, so `none` propagates in effect) | Yes                                                                                  | No                                                                                                  | **add**, and the value must be `text` — `auto` would be a no-op; a `user-select: none` drag/chrome ancestor (25 sites) makes surface text unselectable and uncopyable                                                       |
| `cursor`                                                    | Yes                                                                                   | Yes                                                                                  | No                                                                                                  | **add** (`auto`) — `not-allowed`/`grabbing`/`wait` ancestors (36 sites) mislabel the entire surface                                                                                                                         |
| `font-weight`, `font-style`                                 | Yes                                                                                   | Yes                                                                                  | Yes — implicitly, `font` (theming) clause                                                           | **add** (`400` / `normal`) — bold/italic bleed from `<th>`, `<strong>`, `<em>`, `<summary>` and label ancestors is the likeliest font-cluster leak and is not a theming decision                                            |
| `font-family`                                               | Yes                                                                                   | Yes                                                                                  | Yes — deliberately, `font` (theming) clause                                                         | **add-with-escape-hatch** — monospace/code and editor contexts bleed in, but pinning `font.family.body` forecloses deliberately monospace surfaces                                                                          |
| `font-variant`                                              | Yes                                                                                   | Yes                                                                                  | Yes — implicitly, `font` clause                                                                     | **leave-out** — no observed `small-caps` hazard; only worth it as a free rider if the `font` shorthand is used (see note below)                                                                                             |
| `caret-color`                                               | Yes                                                                                   | Yes                                                                                  | No                                                                                                  | **leave-out** — no observed `caret-color: transparent` ancestor; zero-cost to add if the Phase 1b detector finds one                                                                                                        |
| `list-style`, `border-collapse`, `border-spacing`           | Yes                                                                                   | Yes                                                                                  | No                                                                                                  | **leave-out** — UA and author rules matching `ul`/`ol`/`table` _inside_ the surface beat inheritance, so the leak is largely theoretical                                                                                    |
| `text-align-last`, `tab-size`, `hyphens`, `text-wrap-style` | Yes                                                                                   | Yes                                                                                  | No                                                                                                  | **leave-out** — no observed hazard; note `white-space: normal` already resets `text-wrap-mode` but _not_ `text-wrap-style` (`balance`/`pretty`)                                                                             |
| `text-orientation`                                          | Yes                                                                                   | Yes                                                                                  | No                                                                                                  | **leave-out** — moot once `writing-mode` is reset; it only applies in vertical modes                                                                                                                                        |
| `-webkit-text-size-adjust`                                  | Yes                                                                                   | Yes                                                                                  | No                                                                                                  | **leave-out** — desktop-first surfaces, no observed usage                                                                                                                                                                   |
| `scrollbar-width`, `scrollbar-color`                        | Yes                                                                                   | Yes                                                                                  | No                                                                                                  | **leave-out** — theming-adjacent and normally set on the scroll container itself, not a wide ancestor                                                                                                                       |
| `color`                                                     | Yes                                                                                   | Yes                                                                                  | Yes — deliberately, `font`/`color` (theming) clause                                                 | **leave-out** — largest VR blast radius and ADS surfaces set their own text color; keep the exclusion                                                                                                                       |
| `direction`, `unicode-bidi`                                 | Yes                                                                                   | Yes                                                                                  | Yes — deliberately, `popover.tsx:57` (RTL must inherit)                                             | **leave-out** — correct as written                                                                                                                                                                                          |
| `text-decoration`                                           | No                                                                                    | **No** — propagates through the box tree, and propagation stops at out-of-flow boxes | No                                                                                                  | **leave-out** — the plan's claim is verified                                                                                                                                                                                |

### Implementation note on the font cluster

`font: token('font.body')` would reset `font-style`, `font-weight`, `font-size`, `line-height` and
`font-family` in one theme-aware declaration (and matches the old portal baseline exactly). Prefer
**longhands** anyway: the shorthand couples the two properties that need an escape hatch
(`font-size`, `font-family`) to the two that do not (`font-weight`, `font-style`), and it silently
resets `font-variant`/`font-stretch`/`font-kerning` to initial as a side effect.

## Gate status

**The reset is not behind any feature gate today — `gate: null`.** `surfaceResetStyles.root` is in
the unconditional part of both hosts' `css` arrays, and `@atlaskit/top-layer/src` contains **no**
feature-gate calls at all (no `fg(`, no `@atlaskit/platform-feature-flags` usage).

Adoption is gated one level up, in the consumers that switch between the legacy portal and the
top-layer path — e.g. `packages/design-system/popper/src/popper.tsx:115` and
`packages/design-system/drawer/src/drawer.tsx:150`. Three distinct gate names exist across
`packages/design-system`: `platform-dst-top-layer`, `platform-dst-top-layer-spotlight`,
`platform-dst-top-layer-tooltip`. So the plan's "land rungs 1 and 2 behind the same flag as the
rollout" needs a decision: the natural gate is `platform-dst-top-layer`, but it is not currently
readable from inside this package, and Jira's unit tests force all `platform-dst-top-layer*` gates
off — a gated reset would go unexercised in that suite.

## Work items

Rung 1 implies the following. **Not implemented — investigation only.**

- [x] `pointer-events: auto`: landed in both copies.
- ~~`line-height`~~: dropped by owner decision; see
  [Status since this audit](#status-since-this-audit).
- [ ] Add the remaining eight `add`-verdict properties to **both** copies, keeping them identical:
      `platform/packages/design-system/top-layer/src/popover/popover.tsx` and
      `platform/packages/design-system/top-layer/src/dialog/dialog-content.tsx` (`letter-spacing`,
      `word-spacing`, `text-shadow`, `writing-mode`, `user-select: text`, `cursor`, `font-weight`,
      `font-style`). The plan routes `font-weight` / `font-style` to the components, not the host.
- [ ] Decide the `font-size` / `font-family` escape hatch. This reverses a documented exclusion
      (`popover.tsx:56`), so it needs owner sign-off plus a documented opt-out. Blocking
      sub-question: survey DS-internal styles that deliberately set
      `line-height`/`font-size`/`font-family` on wrappers around triggers.
- [x] ~~Add the sync test (`__tests__/unit/surface-reset-in-sync.test.tsx`, comparing parsed source
      declarations).~~ Landed instead as the `TSurfaceResetCheck` identity type in
      `src/internal/surface-reset.tsx`. A type needs no parsing and fails at build time.
- [ ] Update the rationale + `KEEP IN SYNC` comments in both files (`popover.tsx:52-62`,
      `dialog-content.tsx:29-37`) to name the newly covered properties and the surviving exclusions.
- [ ] Extend VR coverage:
      `platform/packages/design-system/top-layer/examples/81-vr-surface-inheritance-reset.vr.ap.tsx`
      currently exercises only `white-space: nowrap` on `Popover`. Add ancestor cases for
      `writing-mode: vertical-rl`, `font-weight: bold`, `letter-spacing`, and a `Dialog` variant.
      Regenerate `platform/packages/design-system/top-layer/__tests__/vr-tests/__snapshots__/`.
- [ ] Add functional coverage VR cannot provide (clickability / selectability), e.g.
      `platform/packages/design-system/top-layer/__tests__/playwright/surface-reset-functional.spec.tsx`
      for `pointer-events` and `user-select`.
- [ ] Decide gating (see **Gate status**): gate the additions behind `platform-dst-top-layer` or
      land them ungated, and record the choice.
- [ ] Changeset under `platform/.changeset/` for `@atlaskit/top-layer` (`minor`,
      `--isUxChange=true`).
