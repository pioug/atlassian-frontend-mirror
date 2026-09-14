# Surface style abstraction — is there a shared home for the "opinionated" resets?

Investigation only. No source edits were made.

## The pending decision

`@atlaskit/top-layer` applies `surfaceResetStyles` at the host element in two deliberately
duplicated copies — `platform/packages/design-system/top-layer/src/popover/popover.tsx:63` (applied
`popover.tsx:415`) and `platform/packages/design-system/top-layer/src/dialog/dialog-content.tsx:38`
(applied `dialog-content.tsx:286`) — kept aligned only by the `KEEP IN SYNC` comment at
`popover.tsx:59` / `dialog-content.tsx:36`, with no test.

The proposal is to split the reset by kind:

- **Mechanical / defensive** (`pointer-events`, `white-space`, `overflow-wrap`, `text-align`,
  `text-indent`, `text-transform`, `line-height`, `visibility`) stays at the host — single correct
  value at a boundary.
- **Opinionated typography** (`font-weight`, `font-style`, `letter-spacing`, `word-spacing`,
  `text-shadow`, `cursor`) moves down to the surface / component layer — no single value is right
  for a tooltip, a modal body and a dropdown item alike.

## The deciding question

Is there somewhere the opinionated resets could live **once**, or does "put them in the components"
mean ~12 duplicated copies?

**Short answer: there is one shared home, `PopoverSurface`, and it reaches 4 of the 12 adopters.**
It is a real abstraction, not a hypothetical — but it is not a common ancestor, so it is not a
single home for all 12.

---

## 1 + 4. Per-adopter: surface appearance source, and typography already owned

`Q1` = where background / radius / elevation / padding come from. `Q4` = does the package already
set any of `font*` / `lineHeight` / `letterSpacing` / `wordSpacing` / `textShadow` / `cursor` on, or
inside, its own surface.

| Adopter           | Q1                 | Shared thing (if any)                                                                                           | Evidence                                                                                                                                                                                                             | Q4                       | Properties already owned                                                                       | Evidence                                                                                                                             |
| ----------------- | ------------------ | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `tooltip`         | `own-styles`       | none (`Popover` is host only)                                                                                   | `packages/design-system/tooltip/src/tooltip-container.tsx:15` (`cssMap`), bg `:19`, radius `:20`                                                                                                                     | **yes — on the surface** | `font`, `cursor`, `textShadow` (child)                                                         | `tooltip/src/tooltip-container.tsx:22`; `tooltip/src/tooltip-primitive.tsx:29`; `tooltip/src/tooltip-shortcut.tsx:26,43`             |
| `popup`           | `mixed`            | `PopoverSurface` (top-layer path)                                                                               | `popup/src/popup-top-layer.tsx:31,302`; `popup/src/compositional/popup-content-top-layer.tsx:30,254`; legacy own `cssMap` `popup/src/popper-wrapper.tsx:27`                                                          | no                       | — (only `color`, `popper-wrapper.tsx:38`)                                                      | —                                                                                                                                    |
| `dropdown-menu`   | `mixed`            | legacy `@atlaskit/popup`; content padding/typography `@atlaskit/menu` `MenuGroup`                               | `dropdown-menu/src/dropdown-menu.tsx:14,289`; top-layer path re-declares surface locally `dropdown-menu/src/dropdown-menu-top-layer.tsx:44` (**bypasses `PopoverSurface`**)                                          | **yes — inside surface** | `font`                                                                                         | `dropdown-menu/src/internal/components/group-title.tsx:10`; content via `menu/src/internal/components/menu-item-primitive.tsx:40,87` |
| `select`          | `mixed`            | `@atlaskit/react-select` (standard); `PopoverSurface` (`PopupSelect` top-layer)                                 | `select/src/create-select.tsx:10`; `select/src/popup-select/popup-select-top-layer.tsx:24,383` — but **also** keeps a duplicate local surface `cssMap` at `:44`; legacy `select/src/popup-select/menu-dialog.tsx:20` | no (delegated)           | — (surface content typography lives in `react-select`)                                         | —                                                                                                                                    |
| `react-select`    | `own-styles`       | none                                                                                                            | `react-select/src/components/menu.tsx:36` (radius `:41`, bg `:44`, shadow `:45`); top-layer path also local, `react-select/src/components/menu-portal-top-layer.tsx:25` (**bypasses `PopoverSurface`**)              | **yes — inside surface** | `cursor`, `fontSize`, `font`, `fontWeight`                                                     | `react-select/src/components/option.tsx:63,66,78`; `react-select/src/components/group-heading.tsx:45,46,47`                          |
| `datetime-picker` | `mixed`            | `PopoverSurface` (top-layer); `@atlaskit/select` `components.Menu` (TimePicker)                                 | `datetime-picker/src/internal/menu-top-layer.tsx:15,105`; `datetime-picker/src/internal/fixed-layer-menu-top-layer.tsx:12,116`; legacy own `datetime-picker/src/internal/menu.tsx:41`                                | no (delegated)           | — (`cursor` hits are on the trigger, `date-time-picker-container.tsx:58,70`)                   | —                                                                                                                                    |
| `inline-dialog`   | `own-styles`       | none (`Popover` host only)                                                                                      | `inline-dialog/src/inline-dialog-top-layer.tsx:39` (bg `:44`, radius `:45`, shadow `:46`, padding `:48`); legacy `inline-dialog/src/inline-dialog-container.tsx:17`                                                  | no                       | — (only `color`)                                                                               | —                                                                                                                                    |
| `spotlight`       | `mixed`            | `@atlaskit/primitives/compiled` `Box` (`backgroundColor` prop only); typography delegated to `Heading` / `Text` | `spotlight/src/ui/card/top-layer.tsx:18,68`; legacy `spotlight/src/ui/card/legacy.tsx:17,132`                                                                                                                        | no (delegated)           | —                                                                                              | `spotlight/src/ui/headline/index.tsx:39`; `spotlight/src/ui/step-count/index.tsx:8`                                                  |
| `avatar-group`    | `shared-component` | `PopoverSurface` (top-layer); `@atlaskit/popup` + `@atlaskit/menu` `MenuGroup` (legacy)                         | `avatar-group/src/components/avatar-group-top-layer.tsx:10,177`; `avatar-group/src/components/avatar-group.tsx:19,346`                                                                                               | no                       | — (font/cursor hits are trigger-only, `avatar-group/src/components/more-indicator.tsx:155,32`) | —                                                                                                                                    |
| `flag`            | `mixed`            | primitives `Box` (`padding` + `backgroundColor` props); own radius/shadow                                       | `flag/src/flag.tsx:203` (`Box`), own `cssMap` `:31` (shadow `:37`, radius `:38`)                                                                                                                                     | **yes — inside surface** | `font`, `fontWeight`                                                                           | `flag/src/flag.tsx:52`; `flag/src/flag-actions.tsx:34,64,80`                                                                         |
| `modal-dialog`    | `own-styles`       | none (`Dialog` is host / modality only)                                                                         | `modal-dialog/src/internal/components/modal-wrapper.tsx:90` (bg `:95`, shadow `:101`, radius `:123`), applied `:442`; legacy `modal-dialog/src/internal/components/modal-dialog.tsx:38`                              | **yes — inside surface** | `font`, `fontSize`, `fontStyle`, `fontWeight`, `letterSpacing`, `lineHeight`                   | `modal-dialog/src/modal-body.tsx:21`; `modal-dialog/src/modal-title.tsx:29,30,31,33,35,42`                                           |
| `drawer`          | `own-styles`       | none (`Dialog` host only)                                                                                       | `drawer/src/drawer-panel/drawer-top-layer.tsx:42` (surface key `:63`, bg `:67`); legacy `drawer/src/drawer-panel/drawer-panel.tsx:24`                                                                                | **yes — on the surface** | `fontFamily`                                                                                   | `drawer/src/drawer-panel/drawer-top-layer.tsx:70`; `drawer/src/drawer-panel/drawer-panel.tsx:35`                                     |

### Tally

- **Q1:** `shared-component` 1 · `mixed` 6 · `own-styles` 5 · `shared-style-export` **0**.
- **Q4: 6 of 12** already set at least one property from the opinionated / font-cluster set on or
  inside their own surface (`tooltip`, `dropdown-menu`, `react-select`, `flag`, `modal-dialog`,
  `drawer`). Of the other 6, four delegate content typography to a _different_ shared component
  (`react-select` for `select`/`datetime-picker`, `@atlaskit/menu` for `avatar-group`, primitives
  `Text`/`Heading` for `spotlight`); only `popup` and `inline-dialog` are genuinely typography-free
  content shells whose children come from the consumer.

### The one shared abstraction that exists

`PopoverSurface` — `top-layer/src/popover-surface/popover-surface.tsx:40`, exported at
`top-layer/src/entry-points/popover-surface.tsx:1` and via the `"./popover-surface"` subpath in
`top-layer/package.json`. Its `cssMap` at `popover-surface.tsx:16` supplies
`elevation.surface.overlay`, `radius.small`, `elevation.shadow.overlay`, `overflow: auto` — **and
already carries one boundary reset of exactly the kind under discussion**:
`color: token('color.text')` at `popover-surface.tsx:21`, with the comment that content must not
inherit the trigger's ambient colour. `color` is deliberately excluded from the host reset, so the
precedent for "opinionated reset lives on the surface component, not the host" is already
established and shipped.

Reach: **4 of 12** packages (`popup`, `select`/`PopupSelect`, `datetime-picker`, `avatar-group`), 6
call sites. Limits:

- `dropdown-menu` (`dropdown-menu-top-layer.tsx:44`) and `react-select`
  (`menu-portal-top-layer.tsx:25`) are on the top-layer path and re-declare the surface locally
  rather than using it.
- `tooltip` and `spotlight` need a bold-neutral background, not `elevation.surface.overlay`
  (`tooltip-container.tsx:19`; `spotlight/src/ui/card/top-layer.tsx:68`), so they cannot adopt it
  as-is.
- There is **no `DialogSurface` counterpart** in `top-layer/package.json` exports, so `modal-dialog`
  and `drawer` have no shared surface at all.
- `PopoverSurface` is `children`-only by design and exposes no `style`/`className`/`xcss`/`ref`
  (documented `popover-surface.tsx:34-38`), so it cannot be parameterised for the divergent cases
  without breaking that contract.

`@atlaskit/primitives` has **no** `Surface`-with-elevation concept. `Box`'s `backgroundColor` prop
accepts `elevation.surface.*` tokens but that is a background colour only — no `box-shadow`, no
`elevation` prop (`primitives/src/compiled/components/box.tsx:644-655`). `surface-provider` /
`surface-context` is a React context carrying the current background-colour token
(`primitives/src/utils/surface-provider.tsx:13`), not a rendered surface.

---

## 2. What actually forces the duplication

Not a Compiled build limitation the team invented — two enabled ESLint rules, working as a pair.

Enabled repo-wide for `platform/` at `platform/eslint.config.cjs:404`
(`plugin:@atlaskit/ui-styling-standard/recommended`), both at `error`:
`eslint-plugin-ui-styling-standard/src/presets/recommended.codegen.tsx:19` and `:22`.

1. **`no-exported-styles`** — blocks `export`ing a `css` / `cssMap` / `keyframes` / `styled` /
   `xcss` value. `eslint-plugin-ui-styling-standard/src/rules/no-exported-styles/index.tsx:46`;
   checkers list at `:28-34`.
2. **`no-imported-style-values`** — blocks any _imported identifier_ appearing inside a
   `css`/`cssMap`/`styled`/`keyframes`/`xcss` call (`no-imported-style-values/index.tsx:175-182`)
   **and** inside a `style` / `css` / `xcss` JSX attribute (`:183`, report at `:106-111`). The
   second half is the one that bites: `css={[styles.root, importedReset.root]}` on the host is a
   violation even if the import somehow existed.

The stated reason, one line:

> `eslint-plugin-ui-styling-standard/constellation/no-exported-styles/usage.mdx:7` — "Compiled style
> declarations are null at runtime, so using imported styles will cause unexpected errors."

### Precisely what is and is not shareable under this pair

| Thing                                                                       | Shareable?                            | Why                                                                                                                                                 |
| --------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| A `cssMap` / `css` / `xcss` / `styled` export                               | **No**                                | `no-exported-styles/index.tsx:46`                                                                                                                   |
| An imported `cssMap` object composed into a `css` array on JSX              | **No**                                | `no-imported-style-values/index.tsx:183` — the JSX-attribute visitor                                                                                |
| A plain imported constant (`const RESET_WEIGHT = 400`) used inside `cssMap` | **No**                                | any imported `Identifier` is reported, `:106-111`; the rule doc's own incorrect example imports plain `HEIGHT` / `colorKey`                         |
| An imported plain object spread into `cssMap` (`...sharedReset`)            | **No**                                | same visitor; also `@atlaskit/design-system/no-invalid-css-map` requires statically analysable literals                                             |
| `token(...)` from `@atlaskit/tokens`                                        | **Yes**                               | default allow-list, `eslint-utils/src/allowed-function-calls/default-allowed.tsx:137`; re-asserted per-rule at `presets/recommended.codegen.tsx:55` |
| `keyframes()` from `@atlaskit/css` / `@compiled/react` as a _value_         | Yes (call only; still not exportable) | `default-allowed.tsx:138-141`                                                                                                                       |
| `@atlaskit/theme/constants` `fontSize` / `fontFamily` / `layers`            | Yes                                   | `default-allowed.tsx:130-136`                                                                                                                       |
| A shared **React component** that owns its own co-located styles            | **Yes, unrestricted**                 | not a style import at all — this is what `PopoverSurface` is                                                                                        |

So exactly two things can be shared: **token values** and **components**. Nothing in between. There
is no sanctioned "shared style module" escape hatch in `packages/design-system`; the only
`no-exported-styles` suppressions in the whole of `packages/design-system` are in docs UI, examples,
fixtures and codemod payloads (e.g. `design-system-docs-ui/src/example/example-code.tsx:56`,
`primitives/examples/ai/box.tsx:25`) — never in shipped component source.

---

## 3. Viable homes for the opinionated resets

| #   | Home                                                                                          | Verdict            | Cost                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --- | --------------------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| a   | Shared component wrapper every surface renders (`PopoverSurface`, plus a new `DialogSurface`) | `viable-with-cost` | reaches only 4/12 today; needs 6 non-adopters converted and 2 (`tooltip`, `spotlight`) can't take its background, so it needs props — breaking its documented no-props contract (`popover-surface.tsx:34-38`)                                                                                                                                                                                                                                                   |
| b   | Shared token set — values shared, rules re-declared per component                             | `viable`           | `token()` is the one allow-listed import (`default-allowed.tsx:137`), but there is no `font.weight.regular`-equivalent token for `letter-spacing: normal` / `word-spacing: normal` / `text-shadow: none`, so it covers only the font cluster                                                                                                                                                                                                                    |
| c   | Accepted per-component duplication                                                            | `viable`           | 12+ copies across 24 code paths (each adopter has a legacy and a gated top-layer surface), no enforcement, and 6 of 12 surfaces are not the element the consumer's content actually hangs off                                                                                                                                                                                                                                                                   |
| d   | Shared constant + codegen, or a lint-enforced sync test                                       | `viable-with-cost` | plain shared constants are `blocked-by-constraint` (`no-imported-style-values/index.tsx:106-111`), so it must be _generated source text_ via `@atlassian/codegen` `createSignedArtifact` (`design-system/codegen/src/index.tsx:3`) — precedent exists for eslint presets and token metadata, none for component style blocks; a runtime `expect(a).toEqual(b)` test is impossible because `cssMap` is compiled away, so the test has to parse both source files |
| e   | Keep them at the host                                                                         | `viable`           | imposes one value on all 12 surfaces — but for 4 of the 6 properties that is the only value anyone wants, and any adopter that disagrees overrides it one level down, which `tooltip` already does (`tooltip-container.tsx:22`, `tooltip-primitive.tsx:29`)                                                                                                                                                                                                     |

### The measurement that decides between them

The six "opinionated" properties are not one class:

- `font-weight`, `font-style` — components of the `font` shorthand. The 6 adopters that already set
  `font: token('font.body*')` (`tooltip-container.tsx:22`, `group-title.tsx:10`,
  `group-heading.tsx:46`, `flag.tsx:54`, `modal-body.tsx:21`, plus `menu-item-primitive.tsx:87`) are
  **already immune** — the shorthand resets weight and style. Pushing these down is codifying what
  half the adopters do and what the other half get from `react-select` / `@atlaskit/menu` / `Text`.
- `cursor` — owned in exactly two places, `tooltip-primitive.tsx:29` and
  `menu-item-primitive.tsx:40,115`. Everywhere else it is unowned.
- `letter-spacing`, `word-spacing`, `text-shadow` — **not part of the `font` shorthand**, and
  unowned across all 12. A repo-wide grep of the 12 packages plus `@atlaskit/menu` returns exactly
  two hits, and neither is a boundary reset: `tooltip/src/tooltip-shortcut.tsx:43`
  (`textShadow: 'unset'` on a shortcut chip) and `modal-dialog/src/modal-title.tsx:33`
  (`letterSpacing: 'inherit'`, a deliberate pass-through). No component wants a _different_ value
  for these — they want `normal` / `normal` / `none`, which is the mechanical-property test, not the
  opinionated one.

---

## Recommendation

**Split the split.** Move only `font-weight` and `font-style` down to the component layer — they are
`font`-shorthand components that 6 of 12 adopters already reset via `font: token('font.body*')` and
the rest inherit from `react-select` / `@atlaskit/menu` / primitives `Text`, so this is
codification, not new work (home **e→b**: no new rules, existing `token('font.body')` usage carries
it). Keep `letter-spacing`, `word-spacing`, `text-shadow` and `cursor` at the host: they are unowned
in all 12 packages, every adopter wants the same value, and there is no shared home that reaches
more than 4 of them — `PopoverSurface` (`top-layer/src/popover-surface/popover-surface.tsx:40`) is
the only real abstraction and `modal-dialog` / `drawer` have no equivalent at all, so pushing them
down means ~12 copies across ~24 code paths for no expressive gain. Where a component genuinely
disagrees it overrides one level in, which `tooltip` already demonstrates
(`tooltip-primitive.tsx:29`).

This is partly a null result and should be recorded as one: **there is no single shared home.** The
`PopoverSurface` finding is real and worth banking — it already carries a `color` boundary reset
(`popover-surface.tsx:21`), which is the precedent for putting opinionated resets on a surface
component — but at 4/12 reach it cannot carry this decision.

## What this changes in Phase 0b rung 1

The rung 1 note (`phase0b-rung1-surface-reset-gaps.md`) recommends ten additions, and flagged
`font-weight` / `font-style` as "cutting against the deliberate `color`/`font` theming exclusion — a
decision, not a patch". That decision now resolves:

1. **Drop `font-weight` and `font-style` from the rung 1 host additions.** They are the only two of
   the ten that have a defensible component-layer home, and 6 of 12 adopters already cover them.
   This shrinks rung 1 from ten additions to eight and removes the only two that require
   relitigating the `font` theming exclusion.
2. **Keep `letter-spacing`, `word-spacing`, `text-shadow`, `cursor` at the host as rung 1 intended**
   — reclassify them in the note from "opinionated" to **mechanical**, with the evidence above (zero
   owners across 12 packages, one agreed value each). That removes them from the pending design
   decision entirely.
3. **The sync test rung 1 asks for stays necessary and stays awkward.** It cannot be
   `expect(popoverReset).toEqual(dialogReset)` — `cssMap` is compiled away
   (`no-exported-styles/usage.mdx:7`) — so it must diff the two source blocks or compare
   `getComputedStyle` on two rendered hosts. Home **d**'s codegen variant (`@atlassian/codegen`
   `createSignedArtifact`, `design-system/codegen/src/index.tsx:3`) is the only mechanism in the
   repo that would make the two copies structurally impossible to drift, but there is no precedent
   for generating component style blocks and it is likely disproportionate for two files.
4. **Add a `DialogSurface` to the new-adopter checklist as a follow-up, not a blocker.** The
   asymmetry — `popover` has a shared surface, `dialog` has none — is why `modal-dialog` and
   `drawer` each own a full surface (`modal-wrapper.tsx:90`, `drawer-top-layer.tsx:42`). It is worth
   a separate note; it does not gate rung 1.
