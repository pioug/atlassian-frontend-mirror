# Round-trip: does the guard form survive every authoring form?

Closed question for [`../unsafe-selectors-plan.md`](../unsafe-selectors-plan.md) → Steps 1 and 3:
the guard forms, and the transform that emits them.

**Answer: yes. All seven forms emit `:nth-last-child(1 of :not(:where([popover], dialog, style)))`
(and the `:nth-child(…)` / `n+2` / plain `X:not(…)` variants) byte-equivalent modulo whitespace
normalisation. No form mangles, splits, or errors on the commas inside `of :not(…)`. 0 blockers.**

Two things _do_ change and both are load-bearing for the codemod, neither is a round-trip failure:

1. `@atlaskit/css` (strict API) cannot express **any** descendant/positional selector key — guard
   **and** baseline are the same TS error — so it has no sites to rewrite (see form 3).
2. The ratchet regexes go blind on the `:last-child` family after rewrite (see Codemod
   implications).

## Results

| Form                                                                        | Status                 | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                | Emitted selector text (or error)                                                                                                                                                                                                                  | Note                                                                                                                             |
| --------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1. `@compiled/react` `css()` object styles                                  | `proven-by-usage`      | Ships: `jira/src/packages/project-settings/issue-type-page-product-features-jsm-cmp/src/RestrictedAndReadOnly.tsx:170,189` (`css({ … '& > :nth-last-child(1 of :not(:where([popover], dialog)))' … })`). Re-proved by running `@compiled/babel-plugin` v2.0.0 on a 6-variant fixture.                                                                                                                                                                   | `._cit3idpf>:nth-last-child(1 of :not(:where([popover],dialog,style))){margin-right:0}`                                                                                                                                                           | Only change is cssnano whitespace removal after commas.                                                                          |
| 2. `@compiled/react` `cssMap()` / `cssMapScoped()`                          | `proven-by-usage`      | Ships: `kitsune/apps/feedback/src/components/JoinedButtons/JoinedButtons.tsx:22,38` (`cssMap`, `n+2 of`); `platform/packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx:492,2021` (`cssMapScoped`, 4-term `of` list). Validator run separately (next column).                                                                                                                                                 | `mapStyles.root = "_1e0c1txw _cit3idpf _2k5lidpf _dflu5scu"` with `_cit3idpf` = `>:nth-last-child(1 of :not(:where([popover],dialog,style)))`. `@compiled/eslint-plugin/no-invalid-css-map`: **0 messages**.                                      | The flagged high-risk case is clean — `no-invalid-css-map` neither rejects nor crashes on the `of` argument.                     |
| 3. `@atlaskit/css` `cssMap` / `css` / `cx`                                  | `proven-by-experiment` | Babel emit run through the same plugin with `importSources: ['@atlaskit/css']` (AFM's real option, from `artifacts/babel.config.js:44` / `studio/babel.config.js:62`). TS checked with `tsc` against `platform/packages/design-system/css/src/index.tsx`.                                                                                                                                                                                               | Emit: `._1fb8idpf>:nth-last-child(1 of :not(:where([popover],dialog,style))){margin-block-end:0}`. TS: `TS2353 … ''& > :nth-last-child(1 of :not(:where([popover], dialog, style)))'' does not exist in type …`                                   | **Same TS2353 for the baseline `'& > *:last-child'` and even `'&:last-child'`** — strict API has no positional sites to rewrite. |
| 4. `styled` template literals (emotion / `@compiled` / `styled-components`) | `proven-by-usage`      | Ships: `jira/src/packages/project-settings/issue-type-page/src/FieldInactive.tsx:651,658` (styled-components tpl); `platform/packages/editor/editor-common/src/styles/shared/table.ts:38,39` (emotion `css` tpl); `jira/src/packages/releases/issue-list/.../summary/Summary.tsx:80,88` (`@compiled` `styled.div({})`). Checked-in emitted snapshot: `jira/src/packages/project-settings/issue-type-page-field-active/tests/styledStyled.test.tsx:120`. | styled-components 3.4.10 / stylis 3.5.4: `.sc-hash > :nth-last-child(1 of :not(:where([popover],dialog,style))){margin-right:0;}`. `@emotion/babel-plugin` 11.13.5 minified: `&>:nth-last-child(n + 2 of :not(:where([popover], dialog, style)))` | Emotion's minifier keeps `n + 2` spacing; stylis' comma-splitting is top-level only, so `of :not(a, b)` is never split.          |
| 5. `xcss` (Primitives) and `css` prop values                                | `proven-by-usage`      | Ships in `xcss()`: `townsquare/packages/info-section/src/styles.tsx:57`. `css` prop object proved via the compiled babel run. Real `xcss.tsx` executed under `@babel/register`.                                                                                                                                                                                                                                                                         | `NODE_ENV=production` → `> :nth-last-child(1 of :not(:where([popover], dialog, style))){flex-shrink:0;}`. Non-production → `Error: Styles not supported for key '> :nth-last-child(1 of …)'`                                                      | The dev-only throw (`xcss.tsx:25,51`) fires identically for the pre-existing `> :last-child`, so the rewrite changes nothing.    |
| 6. raw `.css` (postcss / cssnano / lightningcss)                            | `proven-by-experiment` | No shipping example (`rg ":where(\[popover\]" -g '*.css'` → 0). Ran postcss 8.5.14, postcss-nested 5.0.6, postcss-selector-parser 6.1.2, cssnano 5.1.12 (confluence minifier), lightningcss 1.32.0 (jira/rspack), plus `jira/.stylelintrc.js` + `confluence/.stylelintrc.js`.                                                                                                                                                                           | cssnano and lightningcss both: `.a>:nth-last-child(1 of :not(:where([popover],dialog,style))){margin-right:0}`. stylelint: 0 selector warnings (only `ensure-design-token-usage` on the fixture's `color: red`).                                  | lightningcss is unchanged with `targets` down to chrome 80 / safari 12 — it does not attempt to downlevel or drop `of S`.        |
| 7. interpolated / concatenated selectors                                    | `proven-by-experiment` | Compiled babel run on a computed key ``[`& > .${CLS}:nth-last-child(1 of …)`]`` and a `styled.div` tpl with `${CLS}`; emotion `serializeStyles` + stylis on the same.                                                                                                                                                                                                                                                                                   | `._yxo6idpf>.my-cls:nth-last-child(1 of :not(:where([popover],dialog,style))){margin-right:0}`                                                                                                                                                    | Emission is fine; the **rewrite** is still unsafe because the selector text is not statically known — 83 sites must be skipped.  |

### Lint / ratchet side-effects (same rewrite, no round-trip failure)

- `@atlaskit/ui-styling-standard/no-unsafe-selectors` reports **3 messages per guarded selector**
  (`:nth-last-child`, `:not`, `:where` are all outside its `allowedPseudos` allowlist —
  `platform/packages/design-system/eslint-plugin-ui-styling-standard/src/rules/no-unsafe-selectors/constants.tsx`)
  where the baseline `:last-child` reported 1. Same rule ID, so one existing
  `eslint-disable-next-line` still suppresses all three. It does **not** crash.
- `@atlaskit/design-system/no-unsafe-style-overrides`: 0 messages (unrelated to selectors).
  `@atlaskit/design-system/no-nested-styles`: fires on `css()`/`styled`/`xcss` identically before
  and after.
- `NoUnsafeNthChildSelectors`
  (`platform/packages/monorepo-tooling/ratcheting/src/rules/no-unsafe-nth-child-selectors.ts:74`,
  `regexes: [/:first-child/, /:nth-child/, /:last-child/]`): `:nth-last-child` contains neither
  `:last-child` nor `:nth-child`, so **every `:last-child` → `:nth-last-child(1 of …)` rewrite
  becomes invisible to the ratchet**, while `:first-child` → `:nth-child(1 of …)` stays visible.

### Dynamic selector sites (form 7)

Single `rg` pass over all tracked `*.ts`/`*.tsx` for `:(first|last|nth|nth-last|only)-child` → 1,890
lines. Of those:

| Subset                                                           | Count             |
| ---------------------------------------------------------------- | ----------------- |
| Lines with a positional pseudo **and** a `${…}` on the same line | **83** (39 files) |
| …of which use the computed-key ``[`…${…}…`]:`` form              | 22                |
| String concatenation (`+ '…:last-child'`)                        | 0                 |
| All interpolated computed selector keys, any selector            | 2,894 lines       |

**Statically detectable: yes.** Every case is either a computed `ObjectProperty` whose key is a
`TemplateLiteral` with `expressions.length > 0`, or a tagged-template `css`/`styled` whose quasi
boundary falls inside the selector. Both are a one-predicate AST check; no heuristics needed.
Typical shape: `platform/packages/editor/renderer/src/ui/Renderer/RendererStyleContainer.tsx:1520`,
`platform/packages/editor/editor-plugin-block-controls/src/ui/global-styles.tsx:435`,
`jira/src/packages/servicedesk/knowledge-settings-ui-content/src/ViewSpace.tsx:582`
(``styles[`tbody tr:nth-child(${index + 1})`]`` — a runtime-indexed selector).

## How to reproduce

All scratch scripts live in the session scratchpad (`…/scratchpad/rt/`) and are not checked in.
`export OPENSSL_CONF=/dev/null` is only needed to work around a sandboxed-node OpenSSL config read.

```bash
cd /Users/areardon/atlassian/afm/master
export OPENSSL_CONF=/dev/null

# Shipping evidence
rg -n "of :not\(" --glob '!**/node_modules/**' -g '!*.snap'
rg -l ":where\(\[popover\]" --glob '!**/node_modules/**' -g '*.tsx' -g '*.ts'
rg -n ":where\(\[popover\]" --glob '!**/node_modules/**' -g '*.css' -g '*.scss'   # 0 hits

# Forms 1,2,3,5(css prop),7 — @compiled/babel-plugin v2.0.0, AFM's real options
#   (parserBabelPlugins: ['typescript','jsx'], importSources: ['@atlaskit/css'], increaseSpecificity: false)
node scratchpad/rt/run-compiled.js scratchpad/rt/fixture-compiled.tsx
node scratchpad/rt/run-compiled.js scratchpad/rt/fixture-atlaskit-css.tsx
node scratchpad/rt/run-compiled.js scratchpad/rt/fixture-dynamic.tsx

# Form 4 — emotion serialize + stylis, @emotion/babel-plugin, styled-components 3 stylis
node scratchpad/rt/run-emotion.js
node scratchpad/rt/run-emotion-babel.js scratchpad/rt/fixture-emotion.tsx
node scratchpad/rt/run-sc.js

# Form 5 — the real xcss.tsx under @babel/register (only ./tokens-map stubbed)
node scratchpad/rt/run-xcss.js                  # non-production: throws
NODE_ENV=production node scratchpad/rt/run-xcss.js

# Form 6 — postcss / postcss-nested / cssnano / postcss-selector-parser / lightningcss, then stylelint
node scratchpad/rt/run-css.js       scratchpad/rt/guard.css
node scratchpad/rt/run-lc-targets.js scratchpad/rt/guard.css
node scratchpad/rt/run-stylelint.js  scratchpad/rt/guard.css   # jira + confluence .stylelintrc.js

# Linting — AFM rules loaded from source via @babel/register, eslint 8.57.1 flat Linter
node scratchpad/rt/run-eslint.js    # ui-styling-standard/no-unsafe-selectors, design-system/*
node scratchpad/rt/run-eslint2.js   # @compiled/no-invalid-css-map

# Form 3 type check — tsc against @atlaskit/css source with paths mapping
(cd scratchpad/rt/ts && /Users/areardon/atlassian/afm/master/node_modules/.bin/tsc -p tsconfig.json)

# Form 7 counts
rg -n --glob '!**/node_modules/**' -g '*.ts' -g '*.tsx' \
  -e ':(first-child|last-child|nth-child|nth-last-child|only-child)' > positional.txt
rg -c '\$\{' positional.txt              # 83
rg -c '\[`[^`]*\$\{' positional.txt      # 22
```

## Codemod implications

- **Exclude `@atlaskit/css` `css()` / `cssMap()` entirely.** Its strict API rejects every
  descendant/positional selector key at the type level (`TS2353`), guard and baseline alike, so
  there is nothing to rewrite; teams already alias `@compiled/react`'s unbounded `css` for those
  rules — see `platform/packages/editor/editor-common/src/ui/Toolbar/ButtonGroup.tsx:7,19,22`.
- **Skip all 83 interpolated/computed selector sites** (39 files). Detect them as computed keys with
  a `TemplateLiteral` key that has expressions, or template-literal style bodies whose quasi
  boundary is inside a selector — do not attempt to reason about the interpolated text.
- **Land the guard's `style` term and update the ratchet regexes in the same change.** After
  rewriting, `NoUnsafeNthChildSelectors` no longer matches the whole `:last-child` /
  `:not(:last-child)` family (`:nth-last-child` matches none of its three regexes), so the count
  drops without the hazard being fixed unless the rule also learns
  `/:nth-last-child\((?!\d+ of )/`-style detection.
- **Budget for a 3× rise in `no-unsafe-selectors` reports per rewritten selector**
  (`:nth-last-child`
  - `:not` + `:where`, all non-allowlisted). Existing per-line disables still cover it, but any site
    the codemod touches that lacks a disable comment needs one emitted alongside the rewrite.
- **`xcss()` sites need no special handling but no benefit either.** `xcss.tsx:25,51` throws in
  non-production for _any_ child-combinator key, before and after the rewrite; only production emits
  the rule at all. Prefer migrating those sites to `@compiled` rather than guarding them in place.
- **No minifier work is needed.** cssnano 5.1.12 (confluence), lightningcss 1.32.0 (jira/rspack,
  even with chrome-80 targets), stylis 3/4, postcss-selector-parser 6.1.2 and both product stylelint
  configs all round-trip `of :not(a, b, c)` unchanged; the only normalisation is whitespace after
  commas.
