# @atlaskit/eslint-plugin-design-system

## 13.20.1

### Patch Changes

- [`2896429aaa267`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2896429aaa267) -
  Update the no-custom-icons eslint rule to include checking for custom svg usage

## 13.20.0

### Minor Changes

- [`e8f8ff85f4834`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e8f8ff85f4834) -
  Add cssmap support for no-physical-properties rule

## 13.19.6

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 13.19.5

### Patch Changes

- Updated dependencies

## 13.19.4

### Patch Changes

- [#198800](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/198800)
  [`b57fbbece226f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b57fbbece226f) -
  Fixed some false positives in @atlaskit/design-system/use-modal-dialog-close-button ESLint rule

## 13.19.3

### Patch Changes

- Updated dependencies

## 13.19.2

### Patch Changes

- [#192592](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192592)
  [`558893bdbc7c3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/558893bdbc7c3) -
  Fixed no-legacy-icons auto fixer to retain size prop when migrating from migration to final core
  entry point
- Updated dependencies

## 13.19.1

### Patch Changes

- [#188952](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188952)
  [`1a88e6e2601ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1a88e6e2601ae) -
  Migrated usage of renamed/deprecated icons
- Updated dependencies

## 13.19.0

### Minor Changes

- [#187495](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187495)
  [`8c0b4fd35134d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c0b4fd35134d) -
  Introduces new ESLint rule to identify unused variables in cssMap.

## 13.18.1

### Patch Changes

- [#188850](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188850)
  [`8b19a85abe51e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8b19a85abe51e) -
  Add nmore cases to the new use correct field rule.
- Updated dependencies

## 13.18.0

### Minor Changes

- [#187514](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187514)
  [`c159d1d45ed81`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c159d1d45ed81) -
  Add new rule to check that inputs use the correct field component from form.

### Patch Changes

- Updated dependencies

## 13.17.3

### Patch Changes

- Updated dependencies

## 13.17.2

### Patch Changes

- Updated dependencies

## 13.17.1

### Patch Changes

- [#162714](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/162714)
  [`e92912cc20871`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e92912cc20871) -
  Fixes the import order bug in the no-utility-icons eslint rule.

## 13.17.0

### Minor Changes

- [#161015](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161015)
  [`c15d225be602e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c15d225be602e) -
  Adds a `enableAutoFixer` flag in the no-utility-rule config to allow more flexibility for
  developers.

## 13.16.1

### Patch Changes

- [#159753](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159753)
  [`756c84e9b07d1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/756c84e9b07d1) -
  Update no-utility-icons rule to add more robust fixes for new buttons cases.

## 13.16.0

### Minor Changes

- [#157767](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157767)
  [`f3d552d85708a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f3d552d85708a) -
  Introduces new ESLint rule to identify, discourage, and, where possible, fix use of utility icons.

### Patch Changes

- Updated dependencies

## 13.15.0

### Minor Changes

- [#149822](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149822)
  [`f9ab0e846ae21`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f9ab0e846ae21) -
  Updated to support `size` prop for new icons from `@atlaskit/icon`.

### Patch Changes

- Updated dependencies

## 13.14.2

### Patch Changes

- [#152496](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152496)
  [`0411aae834d96`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0411aae834d96) -
  Fix typescript issue for missing "json-schema-to-ts" dependency introduced by
  `no-emotion-primitives` lint rule changes

## 13.14.1

### Patch Changes

- Updated dependencies

## 13.14.0

### Minor Changes

- [#151383](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/151383)
  [`772bdcfd2ec5b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/772bdcfd2ec5b) -
  Add `no-emotion-primitives` lint rule.

## 13.13.0

### Minor Changes

- [#147266](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/147266)
  [`b5c2728320969`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b5c2728320969) -
  Add rule to encourage use of DS textarea component.
- [#147256](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/147256)
  [`df8b0619d7ebf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/df8b0619d7ebf) -
  Add rule to encourage use of DS textfield component.

## 13.12.0

### Minor Changes

- [#145064](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145064)
  [`7491e06cbbd8f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7491e06cbbd8f) -
  Add rule to encourage the usage of ADS radio over native radio input elements.

## 13.11.0

### Minor Changes

- [#145669](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145669)
  [`1bbae59bc57c9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1bbae59bc57c9) -
  Add rule to encourage use of DS code component over native HTML elements.

## 13.10.0

### Minor Changes

- [#145568](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145568)
  [`43180d95604d6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/43180d95604d6) -
  Add rule to encourage use of the DS heading component over native HTML headings.

## 13.9.0

### Minor Changes

- [#145662](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145662)
  [`acf5f6979c85f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/acf5f6979c85f) -
  Add rule to encourage use of the DS select component over native HTML selects.

## 13.8.0

### Minor Changes

- [#145074](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145074)
  [`97a43bf0f52f6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/97a43bf0f52f6) -
  Add rule to encourage the usage of ADS range over native range input elements.

## 13.7.0

### Minor Changes

- [#145592](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145592)
  [`101d557dd9e1d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/101d557dd9e1d) -
  Add rule for encouraging use of the image component over `img`.

### Patch Changes

- [#145048](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145048)
  [`4381ccf4b9460`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4381ccf4b9460) -
  Refactor duplicated utilities into own reusable files.

## 13.6.0

### Minor Changes

- [#145045](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145045)
  [`5aa392ee60fd9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5aa392ee60fd9) -
  Add rule to encourage the usage of ADS checkboxes over native checkbox input elements.

## 13.5.0

### Minor Changes

- [#141971](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141971)
  [`c16899828af3d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c16899828af3d) -
  Add new rule for `shouldRenderToParent` prop usage in popup and dropdown menu components.

## 13.4.1

### Patch Changes

- [#136299](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/136299)
  [`4da98e435c8da`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4da98e435c8da) -
  Add better logic to `use-modal-dialog-close-button` rule.

## 13.4.0

### Minor Changes

- [#133012](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133012)
  [`767ec60923d2e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/767ec60923d2e) -
  Adds a new eslint rule to ensure that the cx function is used properly in xcss props. This is
  required for smooth primitives migration onto compiled styles from emotion.

## 13.3.0

### Minor Changes

- [#131514](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131514)
  [`74ddca032fe0f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/74ddca032fe0f) -
  Fixes @atlaskit/eslint-plugin-ui-styling-standard/consistent-css-prop-usage to allow aliased
  imports, eg., import { css as css2 } from '@compiled/react'

## 13.2.0

### Minor Changes

- [#132664](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132664)
  [`30cdea781a4b2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/30cdea781a4b2) -
  Add rule for booleans on `autoFocus` in modal dialog.

### Patch Changes

- Updated dependencies

## 13.1.2

### Patch Changes

- [#131298](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131298)
  [`13ebcc2fd6d07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/13ebcc2fd6d07) -
  Update `use-modal-dialog-close-button` rule to include code within expression containers and
  logical expressions.

## 13.1.1

### Patch Changes

- [#127093](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127093)
  [`1378ea7a99ce1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1378ea7a99ce1) -
  Upgrades `jscodeshift` to handle generics properly.
- Updated dependencies

## 13.1.0

### Minor Changes

- [#127961](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127961)
  [`900f91f38c047`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/900f91f38c047) -
  Add rule for modal dialog to ensure a close button is used.

## 13.0.4

### Patch Changes

- [#128626](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128626)
  [`142648610a166`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/142648610a166) -
  Fixes the `consistent-css-prop-usage` rule to allow `xcss` pass-through values to the `xcss` prop.

## 13.0.3

### Patch Changes

- Updated dependencies

## 13.0.2

### Patch Changes

- [#122856](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122856)
  [`24978014b9d89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/24978014b9d89) -
  Update messaging for no-custom-icons to provide guideance around third party logos.

## 13.0.1

### Patch Changes

- [#119942](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119942)
  [`d5163d608020e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d5163d608020e) -
  "Modify the no-unsafe-design-token-usage rule to exclude the getTokenValue function when used in
  'none' mode for fallbackUsage. This adjustment is necessary because the getTokenValue function is
  not covered by the build-time @atlaskit/tokens/babel-plugin by design. As a result, using this
  function without a fallback can be unsafe, as it defaults to a blank value if applied on a webpage
  where the ADS theme is not enabled."

## 13.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

### Patch Changes

- Updated dependencies

## 12.2.0

### Minor Changes

- [#113173](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113173)
  [`46aad36c62f2f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/46aad36c62f2f) -
  Cuts a new changeset to land ESLint v9 changes to NPM fully (shipped internally Feb 5th:
  https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/109855)

### Patch Changes

- Updated dependencies

## 12.1.0

### Minor Changes

- [#112918](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112918)
  [`4a2db8e5349f6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4a2db8e5349f6) -
  Fixed bugs with `ensure-design-token-usage`, `no-legacy-icons` and also support ESLint v9
  context/sourceCode methods

## 12.0.0

### Major Changes

- [#111194](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111194)
  [`2e69750df9b79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2e69750df9b79) -
  Typography lint rules enable all patterns by default:
  - `use-tokens-typography` enables all patterns by default. Set lint rule config to
    `patterns: ['style-object']` for old default behaviour.
  - `use-primitives-text` and `use-heading` enables the `enableUnsafeReport` option by default. Set
    lint rule config to `enableUnsafeReport: false` for old default behaviour.

## 11.10.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- [#105414](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105414)
  [`6fe5695da9ee6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6fe5695da9ee6) -
  `use-tokens-typography` bug fix for font size 0 and non-pixel values.
- Updated dependencies

## 11.9.0

### Minor Changes

- [#108380](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108380)
  [`14e491279e7ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14e491279e7ae) -
  Fix `ensure-design-token-usage` to allow tokens for all Primitives, not just the root
  `@atlaskit/primitives` entrypoint.

## 11.8.4

### Patch Changes

- [#104581](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104581)
  [`d7e7feee083ad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d7e7feee083ad) -
  Updated behavior of no-legacy-icons autofixer to maintain appropriate sizing for legacy icon-only
  button components

## 11.8.3

### Patch Changes

- [#103619](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103619)
  [`ce8239e9cef45`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ce8239e9cef45) -
  make config type definitions compatible with typed flat configs

## 11.8.2

### Patch Changes

- [#102117](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102117)
  [`c52f9296040c2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c52f9296040c2) -
  Fix for false positives in XCSS styles for `untokenized-properties` pattern for
  `use-tokens-typography` rule.
- Updated dependencies

## 11.8.1

### Patch Changes

- [#101736](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101736)
  [`e2351dd4c21c2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e2351dd4c21c2) -
  `use-tokens-typography` allow `inherit` for `font`, `fontFamily` and `fontWeight` style
  properties.

## 11.8.0

### Minor Changes

- [#101370](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101370)
  [`d962c1dfecac6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d962c1dfecac6) -
  `use-tokens-typography` rule now reports on untokenized composite `font` styles. This new pattern
  is disabled by default but can be enabled under the name `untokenized-properties`.

## 11.7.0

### Minor Changes

- [#101162](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101162)
  [`e553a7506de2d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e553a7506de2d) -
  `use-tokens-typography` rule can now restrict capitalisation by banning the use of
  `textTransform: 'uppercase'`. This new pattern is disabled by default but can be enabled under the
  name `restricted-capitalisation`.

### Patch Changes

- Updated dependencies

## 11.6.1

### Patch Changes

- [#180521](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180521)
  [`595c61de31458`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/595c61de31458) -
  add missing meta.schema to no-unsafe-design-token-usage rule

## 11.6.0

### Minor Changes

- [`2034d96c50c40`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2034d96c50c40) -
  support eslint v9

## 11.5.0

### Minor Changes

- [#178296](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178296)
  [`0111a43a2fcfb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0111a43a2fcfb) -
  `use-tokens-typography` rule now reports on banned style properties like `lineHeight` and
  `letterSpacing`. This new pattern is disabled by default but can be enabled under the name
  `banned-properties`.

## 11.4.1

### Patch Changes

- [#177916](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177916)
  [`e37f82d3c0388`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e37f82d3c0388) -
  Fix for `use-tokens-typography` font weight number values as strings.

## 11.4.0

### Minor Changes

- [#177115](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177115)
  [`baf5f90665687`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/baf5f90665687) -
  `use-tokens-typography` rule now reports on `fontFamily` used with raw values. If a matching token
  is found, a fix is suggested. This new pattern is disabled by default but can be enabled under the
  name `font-family`.

## 11.3.0

### Minor Changes

- [#175432](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175432)
  [`0a1070983ac76`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0a1070983ac76) -
  `use-tokens-typography` rule now reports on `fontWeight` used with raw values (e.g. 600, 'bold').
  If a matching token is found, a fix is suggested. This rule is disabled by default but can be
  enabled under the name `font-weight`.

### Patch Changes

- [#173274](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173274)
  [`fd5bac37c73ba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fd5bac37c73ba) -
  Fix eslint type error.

## 11.2.0

### Minor Changes

- [#175583](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175583)
  [`75911cb003bd5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/75911cb003bd5) - ####
  no-legacy-icons

  Add new `shouldUseSafeMigrationMode` flag to no-legacy-icons rule. When set to true, the autofixer
  will only attempt to migrate icons that are visually similar and do not include secondary colors
  or sizes other than medium.

  Additionally, the autofixer will no longer attempt to explicity add `color="currentColor"` for
  every migration as this is now the default.

  #### no-deprecated-apis

  Refactored to fix type errors and match code style of other rules.

### Patch Changes

- Updated dependencies

## 11.1.0

### Minor Changes

- [#169407](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169407)
  [`fc5784691adcf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fc5784691adcf) -
  `use-tokens-typography` rule now reports on `fontSize` used with tokens since this is invalid
  syntax. If the token is a typography token, it will suggest switching `fontSize` to `font` with a
  fixer. If the token is not a typography token it will only report.

## 11.0.2

### Patch Changes

- [#171994](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171994)
  [`be58e4bb2e387`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be58e4bb2e387) -
  Migrating usages of UNSAFE types and entrypoints that have been renamed in `@atlaskit/icon` and
  `@atlaskit/icon-lab`.
- Updated dependencies

## 11.0.1

### Patch Changes

- [#169436](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169436)
  [`8c910a5de1c93`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8c910a5de1c93) -
  Updates `no-legacy-icon` to no longer error on references to @atlaskit/icon-object
- Updated dependencies

## 11.0.0

### Major Changes

- [#168980](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168980)
  [`d9aae425eae69`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d9aae425eae69) -
  `use-tokens-typography` defaults not adding token fallbacks anymore. Automatic fallbacks can still
  be enabled by setting the `shouldEnforceFallbacks: true` config option.

## 10.26.0

### Minor Changes

- [#162725](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162725)
  [`b2449424247a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b2449424247a3) -
  Updated `no-deprecated-icons` lint rule to include deprecated icons and auto fix for icons that
  have a replacement

### Patch Changes

- Updated dependencies

## 10.25.0

### Minor Changes

- [#165487](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165487)
  [`0e99fc2e1f211`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0e99fc2e1f211) -
  Add new rule for `@atlaskit/datetime-picker`. Ensures that the calendar button is used when
  possible to ensure the picker is accessible. Part of AUTOMAT campaign to migrate all AFM instances
  of date picker and date time picker to use new `shouldShowCalendarButton` prop.

## 10.24.1

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 10.24.0

### Minor Changes

- [#165462](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165462)
  [`a9c04a2aaf7e4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a9c04a2aaf7e4) -
  Introducing new rule to encourage adding/referencing accessible name to a Onboarding spotlight
  dialog component.

## 10.23.2

### Patch Changes

- [#161311](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161311)
  [`adbfbbf9f7aa0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/adbfbbf9f7aa0) -
  Updated `no-deprecated-apis` rule to mark Heading `level` prop as deprecated.

## 10.23.1

### Patch Changes

- [#160428](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160428)
  [`6d4fa76f052b2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d4fa76f052b2) -
  Releases an unreleased fix for the '../package.json' not found in
  @atlaskit/eslint-plugin-design-system@10.23.0

## 10.23.0

### Minor Changes

- [#153668](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153668)
  [`a6c96d74835d5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a6c96d74835d5) -
  Added a flat config preset equivalents for included eslint configs
- [#153712](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153712)
  [`566eb89dd2b9f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/566eb89dd2b9f) -
  Introducing new rule to warn the combination of separator and `as="li|ol|dl"`

## 10.22.1

### Patch Changes

- [#153007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153007)
  [`89e8b9b297149`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/89e8b9b297149) -
  Update `ensure-design-token-usage` rule to avoid false positive with Icon Tile component

## 10.22.0

### Minor Changes

- [#147366](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147366)
  [`7f5bab6a1ebd1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7f5bab6a1ebd1) -
  Add fixes for html anchors in the no-html-anchor rule

## 10.21.0

### Minor Changes

- [#142522](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142522)
  [`42f1b0abdb783`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/42f1b0abdb783) -
  Disallow ALL CAPS styles in XCSS using the `use-latest-xcss-syntax-typography` rule.

## 10.20.0

### Minor Changes

- [#142315](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142315)
  [`4810530a99092`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4810530a99092) -
  Add `no-dark-theme-vr-tests` rule

## 10.19.0

### Minor Changes

- [#141841](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141841)
  [`80d8b75d97395`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/80d8b75d97395) -
  Introducing new rule to encourage adding/referencing accessible name to a TagGroup component.

## 10.18.2

### Patch Changes

- [#137821](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137821)
  [`bcca6c1789a37`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bcca6c1789a37) -
  Rename of `@atlassian/icon-lab` to `@atlaskit/icon-lab`

## 10.18.1

### Patch Changes

- [`836af8b0a3b3e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/836af8b0a3b3e) -
  Adds the ability to automigrate more complex automigration cases with multiple of the same icon.

## 10.18.0

### Minor Changes

- [#136089](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136089)
  [`d0e47b2e03130`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0e47b2e03130) -
  Disallow wrapped tokens for typography properties in XCSS using the
  `use-latest-xcss-syntax-typography` rule.

## 10.17.3

### Patch Changes

- [#134533](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134533)
  [`729d2ac5a7b41`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/729d2ac5a7b41) -
  Disallow letter spacing and disallow font weight only when heading font token is used for
  `use-latest-xcss-syntax-typography` rule.

## 10.17.2

### Patch Changes

- [#133689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133689)
  [`5b1de3a5df2be`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5b1de3a5df2be) -
  Fix bug in no-legacy-icons where in certain tooling, the token() function wasn't recognised
  correctly when resolving icon colors.

## 10.17.1

### Patch Changes

- [#133643](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133643)
  [`1ab5ca9bddc97`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1ab5ca9bddc97) -
  Updated the list of upcoming icons after a new set of icons were added
- Updated dependencies

## 10.17.0

### Minor Changes

- [#131211](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131211)
  [`9877a261592a7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9877a261592a7) -
  Added an autofixer for `no-legacy-icons` eslint rule which migrates icons in the "Auto Migration"
  category to new icons. Use `shouldUseMigrationPath` option to control the import path of the new
  icon.

## 10.16.0

### Minor Changes

- [#130413](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130413)
  [`1a796c4acf4e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1a796c4acf4e9) -
  Added new eslint plugin, ensure-icon-color

## 10.15.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 10.14.0

### Minor Changes

- [#128926](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128926)
  [`5df26d24db3c7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5df26d24db3c7) - -
  Remove config for rules that do not belong in this plugin long-term:
  '@atlaskit/design-system/no-empty-styled-expression', '@atlaskit/design-system/no-exported-css',
  '@atlaskit/design-system/no-exported-keyframes' — they may be removed in a future release and
  prefer `@atlaskit/eslint-plugin/ui-styling-standard/recommended` for this type of rules in the
  future.
  - Reconfigure '@atlaskit/design-system/no-invalid-css-map' to work properly of the box alongside
    ADS.

## 10.13.0

### Minor Changes

- [#128427](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128427)
  [`ade1e717764e2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ade1e717764e2) -
  Update no-legacy-icons eslint rule following changes to color prop of new icon components

### Patch Changes

- [#127303](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127303)
  [`8c7d9e510fc2a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8c7d9e510fc2a) -
  New rule config option `enableUnsafeReport` for `use-primitives-text` and `use-heading` to enable
  error reporting for native typography elements that are not autofixable.
- Updated dependencies

## 10.12.5

### Patch Changes

- [#127454](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127454)
  [`e869f31dbe200`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e869f31dbe200) -
  No-legacy-icons ESLint rule errors at all references to a legacy icon.

## 10.12.4

### Patch Changes

- [#126974](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126974)
  [`bf10ab6817404`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bf10ab6817404) -
  Updates the no-legacy-icons eslint rule to account for upcoming icons.

## 10.12.3

### Patch Changes

- [#126553](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126553)
  [`a8d7e60d3b69d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a8d7e60d3b69d) -
  Update `no-legacy-icons` rule to use icon migration map from `@atlaskit/icon`.
- Updated dependencies

## 10.12.2

### Patch Changes

- [#124172](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124172)
  [`19b2005de7c1b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19b2005de7c1b) -
  Wrap use-heading, use-primitives-text and use-latest-xcss-syntax-typography with an error boudary
  to stop it breaking issue-automat CI.

## 10.12.1

### Patch Changes

- [#124216](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124216)
  [`66f55374a6828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/66f55374a6828) -
  use-primitives-text bug fix for inline ESlint ignore statements.

## 10.12.0

### Minor Changes

- [#123319](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123319)
  [`33c44e0d8f875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/33c44e0d8f875) -
  Enabled linting rule to discourage direct usage of HTML anchor elements in favor of Atlassian
  Design System link components

## 10.11.2

### Patch Changes

- [#122050](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122050)
  [`db22dc84c34c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db22dc84c34c3) -
  Moves away from the use of ts-node to esbuild-register for local consumption

## 10.11.1

### Patch Changes

- [#120669](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120669)
  [`9e1c531090ea4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9e1c531090ea4) -
  Dropped support for `UNSAFE` icon props in new buttons, which have now been removed.
- Updated dependencies

## 10.11.0

### Minor Changes

- [#120359](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120359)
  [`44b7939afb571`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/44b7939afb571) -
  New rule config option `enableUnsafeAutofix` to switch between error or suggest autofixes for
  `use-tokens-typography`, `use-primitives-text` and `use-heading`.

## 10.10.2

### Patch Changes

- [#120049](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120049)
  [`77504ff274f72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77504ff274f72) -
  DSP-19576: Assign names to anonymous default exports

## 10.10.1

### Patch Changes

- [#117847](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117847)
  [`5795b7b47ceac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5795b7b47ceac) -
  Removes redundant files from NPM deployment
- [#117920](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117920)
  [`57088349e6e38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57088349e6e38) -
  Updated guidance on no-legacy-icons lint rule to be more descriptive.

## 10.10.0

### Minor Changes

- [#116426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116426)
  [`29d6c074c76ea`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/29d6c074c76ea) -
  Add lint rule to detect use of custom icons

## 10.9.0

### Minor Changes

- [#116062](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116062)
  [`2959497ccf910`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2959497ccf910) -
  Adds `shouldAlwaysCheckXcss` config option to `consistent-css-prop-usage` to lint the `xcss` prop
  even when `excludeReactComponents` is enabled.

## 10.8.2

### Patch Changes

- [#115815](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115815)
  [`0368d6009fc75`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0368d6009fc75) -
  Adds better suggestions to the no-legacy-icons lint rule to detect manual and automatic migration
  opportunities.

## 10.8.1

### Patch Changes

- [#113465](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113465)
  [`1b198cf33c32e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1b198cf33c32e) -
  Create `use-latest-xcss-syntax-typography` rule. Bans the use of 'fontSize', 'lineHeight',
  'fontWeight' on xcss.
- Updated dependencies

## 10.8.0

### Minor Changes

- [#111403](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111403)
  [`f6f2f96728bc0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f6f2f96728bc0) -
  Marking the `overlay` prop on new Buttons as deprecated.

## 10.7.2

### Patch Changes

- [#112386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112386)
  [`762c18186f898`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/762c18186f898) -
  Internal refactoring to use `context.getSourceCode()` instead of `context.sourceCode` to better
  support older versions of eslint.

## 10.7.1

### Patch Changes

- [#111413](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111413)
  [`492737dbcfc65`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/492737dbcfc65) -
  Fixes `consistent-css-prop-usage` to prevent unsafe auto-fixes. Previously style declarations
  could be hoisted out of components even if they referenced variables only defined in the
  component's scope.

## 10.7.0

### Minor Changes

- [#110808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110808)
  [`24a3703dbdfe3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/24a3703dbdfe3) -
  Change use-tokens-typography rule to only suggest fixes.

## 10.6.1

### Patch Changes

- [#107720](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107720)
  [`b900316d320c7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b900316d320c7) -
  `use-latest-xcss-syntax`: Fix bug that caused an error to be thrown when accessing undefined
  sourceCode variable.
- [#93481](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93481)
  [`84dab79bd0c08`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/84dab79bd0c08) -
  Remove deprecation rules for `iconGradientStart` and `iconGradientStop` in @atlaskit/logo

## 10.6.0

### Minor Changes

- [#99829](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99829)
  [`f15d4f35b8f6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f15d4f35b8f6) -
  Add `use-menu-section-title` eslint rule.

## 10.5.0

### Minor Changes

- [#105106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105106)
  [`c1ef7e00be9d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1ef7e00be9d) -
  Introduces new ESLint rule to identify and discourage use of legacy icons.

## 10.4.5

### Patch Changes

- [#107585](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107585)
  [`c7428760443b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c7428760443b) -
  Fixes bugs with `no-html-button` and `no-html-anchor` rules that was falsely reporting for styled
  components not used in the same file they are defined in.

## 10.4.4

### Patch Changes

- [#107425](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107425)
  [`54fa5e256f80`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/54fa5e256f80) -
  Added `@atlaskit/design-system/no-html-button` rule to recommended configuration

## 10.4.3

### Patch Changes

- [#103109](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103109)
  [`387067d94233`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/387067d94233) -
  `use-latest-xcss-syntax` - Update to `error` in `recommended` and `all`.
- Updated dependencies

## 10.4.2

### Patch Changes

- [#104190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104190)
  [`a6243f719741`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a6243f719741) -
  `no-banned-imports`: Remove banned paths for unsafe Buttons and Pressable primitive

## 10.4.1

### Patch Changes

- [#103215](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103215)
  [`1108a9b46be2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1108a9b46be2) -
  Fixed an issue with the `use-tokens-typography` rule where font family properties that were
  already using a token could be misinterpreted and cause the font family property to be removed.

## 10.4.0

### Minor Changes

- [#103102](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103102)
  [`3c920b0719af`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c920b0719af) -
  Add `use-latest-xcss-syntax` eslint rule.

## 10.3.1

### Patch Changes

- [#102908](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102908)
  [`b08bb74e2894`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b08bb74e2894) -
  Fixed an issue with the `use-tokens-typography` rule where font weights that were already using a
  token could break the token matching logic and cause the font weight property to be removed.

## 10.3.0

### Minor Changes

- [#102286](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102286)
  [`8c56c1feba06`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8c56c1feba06) -
  Adds support for `role="button"` in `no-html-anchor` rule

## 10.2.1

### Patch Changes

- [#101749](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101749)
  [`08a34b7d741c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/08a34b7d741c) -
  use-primitives-text and use-heading lint rules to not target elements with no children.

## 10.2.0

### Minor Changes

- [#96661](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96661)
  [`ff9ef688b598`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff9ef688b598) -
  `use-primitives` rule: Adds ability to map negative margin values to negative spacing tokens.

## 10.1.0

### Minor Changes

- [#98883](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98883)
  [`482fe4d89379`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/482fe4d89379) -
  Automatically insert the default fallback value for a token when fallbacks are enforced

## 10.0.1

### Patch Changes

- [#98294](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98294)
  [`0663be43d057`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0663be43d057) -
  The `ensure-design-token-usage` rule will now ignore `xcss()` calls even if the `xcss` variable
  has been aliased.

## 10.0.0

### Major Changes

- [#96329](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96329)
  [`16e879f9ab10`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/16e879f9ab10) -
  Renamed the `no-html-button-element` rule to `no-html-button`. This rule is not yet in use, so it
  should not be a breaking change. The new name reflects the broadened scope of the rule to not only
  include `<button>` elements, but other forms of HTML buttons such as `<input type="button" />` and
  `role="button"`.

### Minor Changes

- [#97630](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97630)
  [`8cac5287d0c4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8cac5287d0c4) -
  Adding new rule: `no-html-anchor`. This discourages usage of native HTML anchors and favors ADS
  link components.

## 9.7.0

### Minor Changes

- [#91673](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91673)
  [`e757c83a22ee`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e757c83a22ee) -
  Introducing new rule to encourage adding/referencing accessible name to a Popup component.

## 9.6.0

### Minor Changes

- [#94356](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94356)
  [`8c4f5854f3da`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8c4f5854f3da) -
  The `icon-label` rule now supports label being defined via spreading render props in the new
  buttons.

## 9.5.2

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component

## 9.5.1

### Patch Changes

- [#87213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87213)
  [`c7caf85c839c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c7caf85c839c) -
  Internal refactoring to `no-invalid-css-map` to use new shared utilities from
  `@atlaskit/eslint-utils` for determining allowed functions calls.
- Updated dependencies

## 9.5.0

### Minor Changes

- [#91506](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91506)
  [`2724a3783955`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2724a3783955) -
  Add support for React 18 in non-strict mode.

## 9.4.1

### Patch Changes

- [#90125](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90125)
  [`3ee5bf94b4fd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3ee5bf94b4fd) -
  Added the `shouldEnforceFallbacks` option to the `use-tokens-typography` rule which can be used to
  prevent token fallback values being added automatically.

## 9.4.0

### Minor Changes

- [#88717](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88717)
  [`5332c5b63887`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5332c5b63887) -
  Adding new eslint rule `@atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop` to
  block using web platform drag and drop directly.

## 9.3.1

### Patch Changes

- [#88012](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88012)
  [`c478a4d80fc9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c478a4d80fc9) -
  The `no-*-tagged-template-expression` rules will no longer autofix usages with mixins in nested
  selectors. This is because they were producing an array syntax that is not valid in compiled or
  styled-components.

## 9.3.0

### Minor Changes

- [#87586](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87586)
  [`47d9f5fb1b11`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/47d9f5fb1b11) -
  Added use-heading rule

### Patch Changes

- [#87476](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87476)
  [`af296d200ad2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/af296d200ad2) -
  Internal refactoring to use `getCreateLintRule` from `@atlaskit/eslint-utils`
- Updated dependencies

## 9.2.5

### Patch Changes

- [#87434](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87434)
  [`dda5ca94da13`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dda5ca94da13) -
  `use-primitives` - bail on dimension properties that have token call values.

## 9.2.4

### Patch Changes

- [#86638](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86638)
  [`f003f07e88e1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f003f07e88e1) -
  Internal refactoring to use a shared `@atlaskit/eslint-utils` package
- Updated dependencies

## 9.2.3

### Patch Changes

- [#86352](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86352)
  [`c32535ff8734`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c32535ff8734) -
  Fixed an issue where the `ensure-design-token-usage` rule (and by extension
  `ensure-design-token-usage/preview` rule) would report on color properties even if `"color"` was
  not provided in the domains config.

## 9.2.2

### Patch Changes

- [#86321](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86321)
  [`b353b26e22b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b353b26e22b6) -
  Improvements for `no-*-tagged-template-expression` rules:

  - Fixed a bug that could produce syntax errors when mixins were present in nested selectors.
  - Disabled autofixing styled components usages with mixins in nested selectors, as there is no
    general equivalent.
  - Disabled autofixing function interpolations with non-expression bodies.

## 9.2.1

### Patch Changes

- [#85899](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/85899)
  [`4ee3baaad3b7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4ee3baaad3b7) -
  Loosen our final autofix check to just ignore all interpolated keys or properties in general for
  all `no-*-tagged-template-expression` rules as they may result in broken code in some edge-cases.

## 9.2.0

### Minor Changes

- [#84330](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/84330)
  [`391be0d8e414`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/391be0d8e414) - -
  `prefer-primitives`: This rule is now deprecated. Please use `use-primitives` instead.
  - `ensure-design-token-usage/preview`: This rule is now deprecated. Please use `use-tokens-space`
    instead.

## 9.1.0

### Minor Changes

- [#84334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/84334)
  [`b2134858ba58`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b2134858ba58) -
  The `use-tokens-typography` rule now applies token fallbacks that reference the constants exported
  via `@atlaskit/theme/typography`, rather than applying the fallback string inline.

## 9.0.0

### Major Changes

- [#83454](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83454)
  [`be8b7ad6ff8e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be8b7ad6ff8e) -
  Remove name autofixer from `consistent-css-prop-usage`. Variables for css / xcss / cssMap
  functions will no longer be required to end with "Styles".

  [BREAKING] Some rule options have been changed:

  - `fixNamesOnly` and `autoFixNames` have been removed, as there is no longer an autofixer that
    enforces variable names.
    - If you use `fixNamesOnly: true`, we recommend switching to using `autoFix: false`.
    - Users of the `autoFixNames` option should remove this from their configuration.
  - `autoFix` option has been added. This controls whether the remaining autofixers should run or
    not (e.g. hoisting `css` function calls, wrapping objects in `css` function calls), and is
    `true` by default.

## 8.38.0

### Minor Changes

- [#74844](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74844)
  [`7c7b8a771792`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7c7b8a771792) -
  Created `use-tokens-space` lint rule to replace `ensure-design-token-usage` rule for space values.

## 8.37.3

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 8.37.2

### Patch Changes

- [#80662](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80662)
  [`4833299b00d4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4833299b00d4) -
  For `no-css-tagged-template-expression` and `no-styled-tagged-template-expression`:

  - When importing from Emotion, stop applying autofixer when the styles contain `!important`.
  - When importing from any library, stop applying autofixer when a selector contains a tagged
    template interpolation (previously only styled-components).

- [#81697](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81697)
  [`cf3483e7e87d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cf3483e7e87d) -
  Adding a missing `license` entry to the `package.json` for this package. This package was already
  licensed under `Apache-2.0` (see `LICENSE` file), so this change is not changing it's license.

## 8.37.1

### Patch Changes

- [#81307](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81307)
  [`6420f933c8ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6420f933c8ae) -
  Fix issue where `use-primitives` was incorrectly transforming styles with string properties.

## 8.37.0

### Minor Changes

- [#81166](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81166)
  [`a249a1bd29a6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a249a1bd29a6) -
  Upgrade ESLint to version 8

## 8.36.3

### Patch Changes

- [#77172](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77172)
  [`0e9162a7371a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0e9162a7371a) -
  Fixes issues with CSS var and content string handling for the `no-*-tagged-template-expression`
  rules

## 8.36.2

### Patch Changes

- [#80471](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80471)
  [`bf21a3bfe85e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bf21a3bfe85e) -
  Add `autoFixNames` option to `consistent-css-prop-usage`. When set to false, the autofix naming
  that enforces style variables ending in the word "Styles" will be turned off. True by default.
- [#80469](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80469)
  [`0b4b7268ef16`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0b4b7268ef16) -
  Fixed an issue with `ensure-design-token-usage` where styles inside xcss could be incorrectly
  linted against.
- [#80518](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80518)
  [`0f90b6e17490`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0f90b6e17490) -
  Ignore function-like interpolations in selectors for `no-css-tagged-template-expression`,
  `no-styled-…`, and `no-keyframes-…`

## 8.36.1

### Patch Changes

- [#79810](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79810)
  [`8c6e96aa3cf0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8c6e96aa3cf0) -
  Fixed an issue with `ensure-design-token-usage` where color props on primitive components could
  report an error.

## 8.36.0

### Minor Changes

- [#78346](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78346)
  [`d20b2626a3b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d20b2626a3b0) -
  Adds support for use-primitives linting rule matching JSX elements declared before styles.

## 8.35.1

### Patch Changes

- [#78282](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78282)
  [`e19154833d5f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e19154833d5f) -
  Missing allowed props check for single paragraph elements

## 8.35.0

### Minor Changes

- [#77589](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77589)
  [`744ea21e3367`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/744ea21e3367) -
  Update use-primitives-text rule for new defaults in Text primitive component

### Patch Changes

- Updated dependencies

## 8.34.0

### Minor Changes

- [#75311](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75311)
  [`96ca033f8748`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/96ca033f8748) -
  Added new `use-tokens-typography` rule that handles converting fontSize and similar font
  properties to tokens. Removed typography functionality from `ensure-design-token-usage` rule.

## 8.33.0

### Minor Changes

- [#77488](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77488)
  [`babedf52898f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/babedf52898f) -
  Add support for inline `cx` func inside `xcss` prop for the `consistent-css-prop-usage` rule.

## 8.32.2

### Patch Changes

- [#77485](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77485)
  [`887b1a3193ce`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/887b1a3193ce) -
  For `no-styled-tagged-template-expression`, do not autofix component selectors for
  `styled-components` implementations

## 8.32.1

### Patch Changes

- [#77519](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77519)
  [`6507c28d3c88`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6507c28d3c88) -
  Refactor implementation of `no-css-tagged-template-expression`. No change to functionality
  expected.

## 8.32.0

### Minor Changes

- [#58240](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58240)
  [`39f3c929f0c4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/39f3c929f0c4) -
  Add new rule `no-html-button-element` to enforce usage of Pressable and Button

## 8.31.0

### Minor Changes

- [#75600](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75600)
  [`6259d0d74690`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6259d0d74690) -
  Migrates the ESLint rule from `@atlaskit/design-system/local-cx-xcss` to
  `@atlaskit/ui-styling-standard/local-cx-xcss`—disruption is unexpected as this rule is not in use.

## 8.30.0

### Minor Changes

- [#75603](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75603)
  [`51cf4796aa02`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/51cf4796aa02) -
  Use primitives text component rule

## 8.29.1

### Patch Changes

- [#70616](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70616)
  [`e80736fccc77`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e80736fccc77) -
  Moving "no-unsupported-drag-and-drop-libraries" check to pdnd 1.0 API
- [#75662](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75662)
  [`70585b558ebd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/70585b558ebd) -
  Adding "@formkit/drag-and-drop" to exclusion list for drag and drop library usage

## 8.29.0

### Minor Changes

- [#74069](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74069)
  [`9bdcd6529453`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9bdcd6529453) -
  Allow use-primitives linting rule to lint style declarations with dimension properties.

## 8.28.0

### Minor Changes

- [#72983](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72983)
  [`86e7b28c9c23`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/86e7b28c9c23) -
  Ported `no-keyframes-tagged-template-expression` and `no-styled-tagged-template-expression` rules
  from `@compiled/eslint-plugin`

## 8.27.0

### Minor Changes

- [#72966](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72966)
  [`ec187f466e23`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ec187f466e23) -
  Update `consistent-css-prop-usage` to incorporate some updates previously made to the
  `@compiled/eslint-plugin` equivalent.

  1. Add autofixer to add the `css` function for the following scenario:

  ```
  const styles = { ... };
  <div css={styles} />
  ```

  Note that this autofixer will not run if local variables are used inside the style object (e.g.
  `{ height: makeTaller ? '5px' : '2px' }`), or if there are spread elements, template literals, and
  other tricky-to-parse code. These continue to require fixing manually.

  (This rule would previously only autofix if the file was originally `<div css={{ ... }} />`)

  2. Add `import { css } from '@compiled/react'` (or `xcss`) automatically when fixing. The package
     from which to import the `css` function can be specified through the `importSource` option.

  3. Add `excludeReactComponents` to exclude linting React components (i.e. components that start
     with uppercase). Sometimes it may not be desirable to have this rule apply to React components
     (e.g. `@atlaskit/button`), which could either use the Emotion or Compiled APIs when they expose
     a `css` prop. Passing a function from the wrong library can result in the styling erroneously
     not being applied.

  4. Treat `{ ... } as const` statements the same way as `{ ... }` objects.

  5. Add `fixNamesOnly` to disable all autofixers _except_ the autofixer that adds `styles` to the
     end of existing style variables. For example, in
     `<div css={buttonComponent} />; const buttonComponent = css({ ... })`, `buttonComponent` will
     continue to be renamed to `buttonComponentStyles`. Autofixers that will be _disabled_ include
     hoisting the styles to the top-most scope, and adding the `css` function call around style
     objects.

## 8.26.0

### Minor Changes

- [#71429](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71429)
  [`457122c5d002`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/457122c5d002) -
  Add some ESLint rules from Compiled CSS-in-JS, and adapt them for the UI Styling Standard.

  Rules added:

  - `no-empty-styled-expression`: ban `styled({})` usages
  - `no-exported-css` and `no-exported-keyframes`: ban `css` and `keyframes` function calls that are
    exported
  - `no-invalid-css-map`: ban usages of the Compiled/`@atlaskit/css` `cssMap` function call that are
    not valid

  Changes made:

  - Add them to monorepo, modify to use the existing utility functions
  - Add support for CSS-in-JS libraries other than Compiled (styled-components, Emotion,
    `@atlaskit/css`, etc.) and `xcss` where appropriate

## 8.25.2

### Patch Changes

- [#71361](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71361)
  [`0f3be2c76337`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0f3be2c76337) -
  `use-primitives` no longer reports elements that have empty style objects.

## 8.25.1

### Patch Changes

- [#67941](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67941)
  [`0b1def807516`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0b1def807516) -
  Now rule is aplicable only to ButtonGroup ImportSpecifiers

## 8.25.0

### Minor Changes

- [#70369](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70369)
  [`611434ce1fe5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/611434ce1fe5) -
  ensure-design-token-usage no longer errors on color properties defined in SVG JSX elements.

## 8.24.0

### Minor Changes

- [#70036](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70036)
  [`667c0a990b15`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/667c0a990b15) -
  Allow linting of multiple property style objects in use-primitives rule.

## 8.23.4

### Patch Changes

- [#69370](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69370)
  [`e14e79732cd4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e14e79732cd4) -
  Add local-cx-xcss rule, which ensures that the `cx()` function (if imported from `@compiled/react`
  or `@atlaskit/css`) is only used within the `xcss` prop.

  Internal changes: Also refactored the utility functions used by
  `no-css-tagged-template-expression`.

## 8.23.3

### Patch Changes

- [#69222](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69222)
  [`a1c52086fdb9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a1c52086fdb9) -
  Address issues in consistent-css-prop-usage hoisting and naming fixers
- Updated dependencies

## 8.23.2

### Patch Changes

- [#65758](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65758)
  [`16e6a0fbe125`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/16e6a0fbe125) -
  Internal refactor of `use-primitves` rule. There should be no change to consumers of the rule.

## 8.23.1

### Patch Changes

- [#68093](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68093)
  [`4c5371a76547`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4c5371a76547) -
  Wrap ensure-design-token-usage with an error boudary to stop it breaking issue-automat CI.

## 8.23.0

### Minor Changes

- [#68090](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68090)
  [`251d7c1fca48`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d7c1fca48) -
  Modified fix naming convention for consistent-css-prop-usage rule to align with camelCase
  convention

### Patch Changes

- Updated dependencies

## 8.22.0

### Minor Changes

- [#63589](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63589)
  [`f59d997d1913`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f59d997d1913) -
  Implemented new fixers for cssOnTopOfModule and cssAtBottomOfModule violation cases

## 8.21.0

### Minor Changes

- [#66250](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66250)
  [`6ff74a16aee7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6ff74a16aee7) -
  Introducing new rule to encourage adding/referencing accessible name to a ButtonGroup component.

## 8.20.0

### Minor Changes

- [#66409](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66409)
  [`f6c48f4a67c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f6c48f4a67c1) -
  Implemented functionality for the consistent-css-prop-usage rule to account for cssMap usages

### Patch Changes

- [#66604](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66604)
  [`3205b1daf57f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3205b1daf57f) -
  Refactor internal logic of `use-primitives` to better handle cases it will not suggest
  transformations for, based on the value of CSS properties.

## 8.19.2

### Patch Changes

- [#66118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66118)
  [`93988e6fd035`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93988e6fd035) -
  `use-primitives` now handles tokenised padding/margin properties. This change is guarded by a
  config flag and not enabled by default.

## 8.19.1

### Patch Changes

- [#65221](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65221)
  [`a2ba22904ca0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a2ba22904ca0) -
  Allow for @atlaskit/design-system/use-primitives lint rule to take a configuration object.

## 8.19.0

### Minor Changes

- [#64899](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64899)
  [`442878c001f9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/442878c001f9) -
  Add `no-unsafe-style-overrides`. This rule marks any usage of unsafe style overrides as
  violations, such as usage of `css`, `theme`, and `cssFn` props.

## 8.18.1

### Patch Changes

- [#64857](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64857)
  [`1be24644c029`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1be24644c029) -
  `use-primitives` is now capable of converting styled components. This is guarded by a config flag
  so this release is only a patch.

## 8.18.0

### Minor Changes

- [#65123](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65123)
  [`f3b62a2c6bdd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f3b62a2c6bdd) -
  Add new rule to warn of rollout of required `headingLevel` prop in the `SpotlightCard` component
  of the onboarding package.

## 8.17.0

### Minor Changes

- [#64660](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64660)
  [`52bbf4498c2a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52bbf4498c2a) -
  Internal update to use the latest version of the `@atlaskit/tokens` package. The
  `no-unsafe-design-token-usage` rule should no longer error on typography tokens.

## 8.16.0

### Minor Changes

- [#58402](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58402)
  [`2b1a12e5936f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2b1a12e5936f) -
  Re-work `use-primitives` lint rule to only suggest `Box`, and only trigger a violation styles
  contain one style property and the style value can be mapped to a token.

## 8.15.5

### Patch Changes

- [#63526](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63526)
  [`cae958047771`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cae958047771) -
  Internal change to how typography tokens are imported. There is no expected behaviour change.
- Updated dependencies

## 8.15.4

### Patch Changes

- [#63768](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63768)
  [`56342fba2b72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56342fba2b72) -
  Fixes an issue with the `use-drawer-label` rule where named imports such as type imports from
  `@atlaskit/drawer` could incorrectly report an error.

## 8.15.3

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 8.15.2

### Patch Changes

- [#57118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57118)
  [`b9bd80957181`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9bd80957181) -
  Upgrade Emotion v10 (@emotion/core) to Emotion v11 (@emotion/react). No behaviour change expected.

## 8.15.1

### Patch Changes

- [#43718](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43718)
  [`8aebcad547a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8aebcad547a) -
  Deprecated tokens are now warned against even when a replacement token has not been specified
- Updated dependencies

## 8.15.0

### Minor Changes

- [#43258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43258)
  [`0004d49c240`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0004d49c240) - Adds a
  new argument `fallbackUsage` which replaces `shouldEnforceFallbacks`. This new argument is an enum
  which represents the three possible states this rule can be configured with.

  - `forced`: Fallbacks must always been in use
  - `none`: Fallbacks must never been in use. (Fixer will remove any value provided )
  - `optional`: (new) Fallbacks are optional

## 8.14.1

### Patch Changes

- [#42240](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42240)
  [`ec474733d38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec474733d38) - Handle
  destructured variables in link item rule.

## 8.14.0

### Minor Changes

- [#41884](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41884)
  [`862be3ee13b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/862be3ee13b) - Adds
  `no-css-tagged-template-expression` rule that disallows any `css` tagged template expressions that
  originate from `@emotion/react` and automatically converts them to the preferred call expression
  syntax.

## 8.13.1

### Patch Changes

- [#42031](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42031)
  [`0b60a2a6318`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b60a2a6318) - Add more
  test cases and handle undefined object property error.

## 8.13.0

### Minor Changes

- [#41825](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41825)
  [`f9641b28ed5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9641b28ed5) -
  Introducing new rule to encourage adding/referencing accessible name to a Drawer component.

## 8.12.1

### Patch Changes

- [#41836](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41836)
  [`93427b209ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93427b209ad) - Update
  all generated files for recent changes to link item rule.

## 8.12.0

### Minor Changes

- [#41346](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41346)
  [`b7e50f54fb3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7e50f54fb3) - Changed
  the no-unsupported-drag-and-drop-libraries to 'problem' type with 'error' severity. Therefore an
  error will now be thrown when a drag and drop package that is not Pragmatic drag and drop is
  imported in packages that have the rule enabled.

## 8.11.0

### Minor Changes

- [#41624](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41624)
  [`ee68a82c409`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee68a82c409) - Add
  fixer to and handle another invalid `href` value for link item rule.

## 8.10.1

### Patch Changes

- [#41402](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41402)
  [`25bf22e0ad8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/25bf22e0ad8) - Add
  better conditional checks in internal util.

## 8.10.0

### Minor Changes

- [#40425](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40425)
  [`5d0222e1bd7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d0222e1bd7) - Added
  new `no-unsupported-drag-and-drop-libraries` rule that detects imports of restricted drag and drop
  libraries, instead suggesting use of our library, Pragmatic drag and drop.

## 8.9.0

### Minor Changes

- [#40868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40868)
  [`3f36676cbfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f36676cbfb) - Add
  `use-href-in-linkitem` rule.

## 8.8.1

### Patch Changes

- [#39407](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39407)
  [`c6db573350d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6db573350d) - The
  themed() and AtlaskitThemeProvider legacy theming API's are now marked as deprecated and eslint
  rules have been modified to disallow new usage of them.

## 8.8.0

### Minor Changes

- [#40241](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40241)
  [`6c149f3e71d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c149f3e71d) - The
  `ensure-design-token-usage` rules now report on use of the CSS `calc` function when used with
  padding, margin, and gap properties.

## 8.7.1

### Patch Changes

- [#40106](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40106)
  [`d6845989896`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6845989896) -
  Configuration added to consistent-css-prop-usage where it is now possible to specify what function
  names the rule should lint against, and what position is recommended for styles (top or bottom).

## 8.7.0

### Minor Changes

- [#40128](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40128)
  [`859ef96da96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/859ef96da96) - Adds
  additional rule encouraging the use of CSS logical properties. This rule comes with a fix for code
  that uses object syntax (via css, styled or xcss) for styles.

## 8.6.0

### Minor Changes

- [#39578](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39578)
  [`192ba90d75b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/192ba90d75b) - The
  `ensure-design-token-usage` rules now support auto-fixing negative values to negative space
  tokens.

### Patch Changes

- Updated dependencies

## 8.5.0

### Minor Changes

- [#39701](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39701)
  [`4eab52ffd1c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4eab52ffd1c) - Add
  `@atlaskit/button/unsafe` to 'no-banned-imports' lint rule

## 8.4.5

### Patch Changes

- [#39649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39649)
  [`d37dcab0fc4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d37dcab0fc4) - Stop
  `prefer-primitives` from reporting on React components.

## 8.4.4

### Patch Changes

- [#39213](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39213)
  [`f7a807adba2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7a807adba2) - Update
  the `ensure-design-token-usage` rule to disallow setting the 'current surface' CSS variable
  (--ds-elevation-surface-current) to a hardcoded color.
- Updated dependencies

## 8.4.3

### Patch Changes

- [#39210](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39210)
  [`96e35ec4b9d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96e35ec4b9d) - Tweak
  `use-primitives` and `prefer-primitives` logic to stop false positives for component names that
  contain HTML element names.

## 8.4.2

### Patch Changes

- [#38362](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38362)
  [`fb85e69cf5e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb85e69cf5e) - Added
  this package into push model consumption.

## 8.4.1

### Patch Changes

- [#38433](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38433)
  [`b11339bc8a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b11339bc8a3) - Internal
  updates for ADS Typography ADG3 theme.
- Updated dependencies

## 8.4.0

### Minor Changes

- [#38670](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38670)
  [`0128df16060`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0128df16060) - Added
  new `prefer-primitives` rule that detects use of `<div>` and `<span>` either as HTML tags or via
  styled components (`styled.div`, `styled('div')`) and suggests using primitive components instead.

## 8.3.0

### Minor Changes

- [#38239](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38239)
  [`87feea3d8e0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87feea3d8e0) - Add
  banned import rule for `@atlaskit/primitives/pressable`

## 8.2.2

### Patch Changes

- [#37947](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37947)
  [`1859bc0b8c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1859bc0b8c7) - Update
  the casing on `xcss` to ensure consistency with the API and package consumption.

## 8.2.1

### Patch Changes

- [#37733](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37733)
  [`52b35a6b571`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52b35a6b571) - - Fixed
  an issue where the `ensure-design-token-usage` rule may incorrectly report variables that
  reference tokens as an error.
  - Fixed an issue where the `ensure-design-token-usage` rule may handle expressions that span
    multiple lines in template literals incorrectly.

## 8.2.0

### Minor Changes

- [#37278](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37278)
  [`a5c9f63d2a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5c9f63d2a8) - Add
  improved behavior for suggestions for `use-primitives` rule.

## 8.1.0

### Minor Changes

- [#37066](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37066)
  [`4f9c29b2f9f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f9c29b2f9f) - Added
  the `no-nested-styles` rule which disallows usage of nested styles. The `no-nested-styles` rule
  also disallows media queries that contain min-width or max-width. The Atlassian Design System
  `media` object should be used instead. Other forms of media queries are still allowed.

## 8.0.2

### Patch Changes

- [#37041](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37041)
  [`05a00999956`](https://bitbucket.org/atlassian/atlassian-frontend/commits/05a00999956) - `TODO`
  comments are no longer added when applying a spacing fix from `ensure-design-token-usage`.

## 8.0.1

### Patch Changes

- [#36624](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36624)
  [`278fb6833be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/278fb6833be) - The
  `ensure-design-token-usage` rule no longer lints against styles inside `xcss` as it already has
  type-safety built in for properties that accept tokens.

## 8.0.0

### Major Changes

- [#36273](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36273)
  [`3919464ef44`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3919464ef44) - Removed
  `ensure-design-token-usage-spacing`. Use `ensure-design-token-usage` instead. See release notes
  for v7.0.0 for more info.

  `ensure-design-token-usage` now **errors** against spacing properties by default.

  If the `domains` option is provided it will override any defaults, for example the following will
  ignore defaults and only error for color:

  ```js
  rules: {
    '@atlaskit/design-system/ensure-design-token-usage': [
      'error',
      {
        domains: ['color'],
        shouldEnforceFallbacks: false
      },
    ],
  },
  ```

  You can use `ensure-design-token-usage/preview` to **warn** about spacing properties until you are
  ready to set the main rule to error:

  ```js
  rules: {
    '@atlaskit/design-system/ensure-design-token-usage/preview': [
      'warn',
      {
        domains: ['spacing'],
        shouldEnforceFallbacks: false
      },
    ],
    '@atlaskit/design-system/ensure-design-token-usage': [
      'error',
      {
        domains: ['color'],
        shouldEnforceFallbacks: false
      },
    ],
  },
  ```

  In many cases `eslint --fix` will automatically apply migrations from hardcoded values and
  `gridSize` to space tokens.

## 7.0.3

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441)
  [`81c15e86b18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81c15e86b18) - Improved
  autofix for 50% border radius to shape token.

## 7.0.2

### Patch Changes

- [#35950](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35950)
  [`50cf866a219`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50cf866a219) - bump
  semver

## 7.0.1

### Patch Changes

- [#36144](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36144)
  [`8c955333863`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c955333863) - Fix
  ensure-design-token-usage to declare that is has suggestions, unblocking ESLint 7+ usage.

## 7.0.0

### Major Changes

- [#35383](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35383)
  [`177c8c14160`](https://bitbucket.org/atlassian/atlassian-frontend/commits/177c8c14160) - Merged
  the `ensure-design-token-usage` and `ensure-design-token-usage-spacing` rules into a single rule:
  `ensure-design-token-usage`. This rule enforces color and space tokens and will be extended to
  enforce domains such as typography and shape in the future. The rule accepts a `domains` option
  which allows you to specify which domains to lint, currently defaulting to 'color' and 'space'.
  This rule defaults to `error`.

  To update to this version:

  - If you are using the `ensure-design-token-usage` rule, add the `domains` property with a value
    of `['color']`:

    ```js
    rules: {
      '@atlaskit/design-system/ensure-design-token-usage': [
        'error',
        {
          domains: ['color'],
          shouldEnforceFallbacks: false
        },
      ],
    },
    ```

  - If you are using the `ensure-design-token-usage-spacing` rule, remove any references to it and
    add `'spacing'` to the domains array above.

    ```js
    rules: {
      '@atlaskit/design-system/ensure-design-token-usage': [
        'error',
        {
          domains: ['color', 'spacing'],
          shouldEnforceFallbacks: false
        },
      ],
    },
    ```

  - If you are not using either of these rules, no changes are required.

  Added a new rule `ensure-design-token-usage/preview` which is a direct clone of
  `ensure-design-token-usage`, but defaults to `warn`. Through this rule you can specify domains to
  enforce tokens for, but with a warning rather than a blocking error. This is intended to ease the
  introduction of certain tokens into a codebase.

## 6.2.1

### Patch Changes

- [#36054](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36054)
  [`0f48aae95e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f48aae95e4) - Patch
  for incorrect behavior in upstream library.

## 6.2.0

### Minor Changes

- [#34821](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34821)
  [`373b6b701ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/373b6b701ca) - Linters
  will now error when deprecated theme color mixins are imported

## 6.1.0

### Minor Changes

- [#34833](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34833)
  [`99d5309f42b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99d5309f42b) - The
  ensure-design-token-usage-spacing rule will now lint against inline style objects

## 6.0.1

### Patch Changes

- [#35448](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35448)
  [`fa18829653d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa18829653d) - Updated
  spacing rule to ignore gridSize functions that accept arguments as these are custom and not part
  of the Design System.

## 6.0.0

### Major Changes

- [#34804](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34804)
  [`c8174712a85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8174712a85) - New rule
  consistent-css-prop-usage available as part of the recommended preset. For detailed docs please
  see:
  https://atlassian.design/components/eslint-plugin-design-system/usage#consistent-css-prop-usage

## 5.5.0

### Minor Changes

- [#34739](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34739)
  [`35a57c481af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35a57c481af) - Improved
  import matching for no-deprecated-apis rule to match substrings of import paths.

## 5.4.2

### Patch Changes

- [#34873](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34873)
  [`121f9ae5c38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/121f9ae5c38) - Internal
  dependency bump.

## 5.4.1

### Patch Changes

- [#34778](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34778)
  [`432d4ce47ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/432d4ce47ee) - Account
  for additional border properties in spacing rule.

## 5.4.0

### Minor Changes

- [#33802](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33802)
  [`eb75c962cfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb75c962cfb) -
  `gridSize` imports from `@atlaskit/theme` are now deprecated in favor of applying space tokens via
  `@atlaskit/tokens`.

### Patch Changes

- [#34217](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34217)
  [`019af32072d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/019af32072d) - Add
  shape token handling to the `ensure-design-token-usage-spacing` rule.
- [`7b017c0be76`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b017c0be76) - Internal
  tweaks to spacing rule fixers.
- Updated dependencies

## 5.3.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 5.3.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 5.3.0

### Minor Changes

- [#33417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33417)
  [`51a48a1bb1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51a48a1bb1b) - Update
  docs to accept a `severity` property so the purpose of `recommended` is no longer double. "all"
  preset now respects this preference - before it was always "error". This makes the presets more
  aligned with the underlying implementations."

## 5.2.0

### Minor Changes

- [#31565](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31565)
  [`11e5168f1c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11e5168f1c2) - Internal
  refactor of ensure-design-token-usage which also addresses some false positives

## 5.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 5.0.3

### Patch Changes

- [#32916](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32916)
  [`7c55a69a5ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c55a69a5ec) - Fix
  issue where 'auto' may still be reported as an error in object styles.

## 5.0.2

### Patch Changes

- [#32895](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32895)
  [`a5f1c4fa284`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5f1c4fa284) - Update
  links in the `use-primitives` rule to point to the right docs URL.

## 5.0.1

### Patch Changes

- [#32846](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32846)
  [`31ebca384fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31ebca384fa) - Improved
  behaviour of `ensure-design-token-usage-spacing` rule to not report on or replace 0, auto, and
  calc within spacing properties.

## 5.0.0

### Major Changes

- [#32576](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32576)
  [`b910bbe6130`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b910bbe6130) - The
  following rules are now included in the recommended preset as errors:

  - ensure-design-token-usage
  - no-deprecated-apis
  - no-deprecated-imports
  - no-unsafe-design-token-usage

  The following rules are now included in the recommended preset as warnings:

  - no-deprecated-design-token-usage

### Minor Changes

- [`b689e24847d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b689e24847d) - All lint
  rule violations in IDEs now point to their corresponding documentation on
  https://atlassian.design.

## 4.20.0

### Minor Changes

- [#32211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32211)
  [`fa50be73bfe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa50be73bfe) - [ux]
  Spacing rule now also looks at and attempts to parse additional properties.

## 4.19.1

### Patch Changes

- [#32367](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32367)
  [`0047d204889`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0047d204889) - Docs are
  now generated from source.

## 4.19.0

### Minor Changes

- [#32306](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32306)
  [`ecbb3354125`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ecbb3354125) - This
  package now uses codegen to generate the rules index and presets. There is no change to the public
  api with this release.
- [`e00ab4b87d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e00ab4b87d9) - The
  README and website documentation now contain a generated table with all available rules in the
  plugin.

## 4.18.0

### Minor Changes

- [#31044](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31044)
  [`c858ddc70ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c858ddc70ff) - Add
  deprecated-imports entries to config that the rule no-deprecated-imports can read from.

## 4.17.1

### Patch Changes

- [#31568](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31568)
  [`fd4bdeabac4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd4bdeabac4) -
  ensure-design-token-usage: Fixes various false positives including linting of variable
  declarations, type definitions, switch cases and if statements

## 4.17.0

### Minor Changes

- [#31131](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31131)
  [`c80505045f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c80505045f0) - Added
  new rule to encourage use of @atlaskit/primitives components where relavant. Currently disabled by
  default, so there should be no expected change to consumers.

## 4.16.5

### Patch Changes

- [#30785](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30785)
  [`c82e6ef389c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c82e6ef389c) - Fix bug
  when replacing shorthand css property values with tokens, values without corresponding token won't
  be replaced. Also, allow styled2 alias to be matched in object styles for the spacing rule, given
  Jira frontend uses that alias extensively

## 4.16.4

### Patch Changes

- [#30707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30707)
  [`358730833d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/358730833d8) - Add
  overrides in @atlaskit/drawer to deprecated config

## 4.16.3

### Patch Changes

- [#30678](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30678)
  [`ed34264c827`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed34264c827) - Fix
  errors on tagged template literals for eslint rule ensure-design-token-usage-spacing and handle
  edgecases ensuring seamless fallback on errors

## 4.16.2

### Patch Changes

- [#30658](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30658)
  [`3db6efeac0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3db6efeac0d) - Improves
  internal configuration of spacing tokens rule.

## 4.16.1

### Patch Changes

- [#30604](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30604)
  [`29648ace573`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29648ace573) -
  Additional selector for ObjectExpression improves coverage of eslint rule.

## 4.16.0

### Minor Changes

- [#29960](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29960)
  [`efadee8e999`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efadee8e999) - Update
  no-deprecated-apis ESlint rule to accept configurations

## 4.15.6

### Patch Changes

- [#30134](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30134)
  [`6a43a780a85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a43a780a85) - Enhance
  token replacement capabilities of ensure-design-tokens-usage-spacing rule in tagged template
  literal strings

## 4.15.5

### Patch Changes

- [#30141](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30141)
  [`dda18b361da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dda18b361da) - Bump
  version of `eslint-codemod-utils`.

## 4.15.4

### Patch Changes

- [#27964](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27964)
  [`ada57c0423d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ada57c0423d) - Add lint
  rule to prevent use of `margin` CSS property.

## 4.15.3

### Patch Changes

- [#29613](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29613)
  [`965e9c7f5d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/965e9c7f5d7) - Fix
  spacing token autofix in tagged template literal styles, enabling replacement of expression to
  equivalent spacing tokens

## 4.15.2

### Patch Changes

- [#27634](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27634)
  [`cf16d8f8bcc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf16d8f8bcc) - Removes
  usage of tokens which have been removed from the codebase
- Updated dependencies

## 4.15.1

### Patch Changes

- [#29390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29390)
  [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal
  change to update token references. There is no expected behaviour or visual change.

## 4.15.0

### Minor Changes

- [#29346](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29346)
  [`17b3c102180`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17b3c102180) -
  ensure-design-token-usage-spacing only lints on spacing properties by default, with typography
  properties enabled via config

## 4.14.1

### Patch Changes

- [#28064](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28064)
  [`03697c65399`](https://bitbucket.org/atlassian/atlassian-frontend/commits/03697c65399) - Improved
  handling of font-family properties.

## 4.14.0

### Minor Changes

- [#27730](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27730)
  [`be1ec01a101`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be1ec01a101) - Added
  another valid callee `getTokenValue()` which is used for getting the current computed CSS value
  for the resulting CSS Custom Property, hard-coded colors that wrapped in `getTokenValue()` call
  won't fail.

## 4.13.10

### Patch Changes

- [#28011](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28011)
  [`00c057bdd71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00c057bdd71) - Removes
  spacing-raw & typography-raw entrypoints in favor of tokens-raw
- Updated dependencies

## 4.13.9

### Patch Changes

- Updated dependencies

## 4.13.8

### Patch Changes

- [#27783](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27783)
  [`f4c5d7db7aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4c5d7db7aa) - Updates
  fix for `ensure-design-token-usage-spacing` to ensure fixes are not applied erroneously.

## 4.13.7

### Patch Changes

- [#27592](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27592)
  [`41ac6cadd32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41ac6cadd32) - Adds
  support to the ensure-design-token-usage-spacing rule for replacing typography values with tokens

## 4.13.6

### Patch Changes

- [#27482](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27482)
  [`0518a6ab41d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0518a6ab41d) - Changes
  behavior of `ensure-design-token-usage-spacing` to fallback to px instead of rems when a fix is
  applied.

## 4.13.5

### Patch Changes

- [#27431](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27431)
  [`fd903efd5f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd903efd5f8) -
  Dependency bump of `eslint-codemod-utils`.

## 4.13.4

### Patch Changes

- Updated dependencies

## 4.13.3

### Patch Changes

- [#26561](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26561)
  [`4793b01cfcc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4793b01cfcc) - Add an
  optional `customTokens` configuration option for no-unsafe-design-token-usage

## 4.13.2

### Patch Changes

- [#26623](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26623)
  [`1a7a2c87797`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a7a2c87797) -
  @atlaskit/eslint-plugin-design-system now maps values to rem based tokens

## 4.13.1

### Patch Changes

- [#26604](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26604)
  [`cc76eda3bc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc76eda3bc0) - Add
  support for template literals in ensure-design-token-usage-spacing

## 4.13.0

### Minor Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`9693f6e7816`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9693f6e7816) - [ux]
  Adds a new case to the no-unsafe-design-token-usage rule to lint against uses of 'experimental'
  tokens and automatically replace them with their replacement (either a token or a fallback) via a
  fixer.

## 4.12.4

### Patch Changes

- [#26488](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26488)
  [`bc989043572`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc989043572) - Internal
  changes to apply spacing tokens. This should be a no-op change.

## 4.12.3

### Patch Changes

- [#26408](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26408)
  [`9de88fa1e1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9de88fa1e1e) - Internal
  changes to include spacing tokens in component implementations.

## 4.12.2

### Patch Changes

- [#26186](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26186)
  [`c6b748ff03a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6b748ff03a) - Small
  tweak to the ensure-design-token-usage-spacing rule to ensure we aren't over-eager in auto-fixing
  code with highly experimental tokens.

## 4.12.1

### Patch Changes

- [#26165](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26165)
  [`e86c57a4a60`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e86c57a4a60) - Improves
  the `no-raw-spacing-values` rule to include an autofixer. Spacing values that can be resolved to a
  token will be.

## 4.12.0

### Minor Changes

- [#26111](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26111)
  [`109c705cd9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c705cd9c) - [ux]
  Adds a new case to the no-unsafe-design-token-usage rule to lint against uses of 'experimental'
  tokens and automatically replace them with their replacement (either a token or a fallback) via a
  fixer.

## 4.11.2

### Patch Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`3ee63238f49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ee63238f49) - Update
  internals of Box, Text, Inline and Stack to handle `children` more accurately. Also update scope
  of `use-primitives` to suggest Box and Text more selectively.

## 4.11.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 4.11.0

### Minor Changes

- [#24934](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24934)
  [`268f92124e2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/268f92124e2) - Bolster
  isException logic to support descendants of excepted functions and to be case-agnostic

## 4.10.1

### Patch Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`d76851b2f42`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d76851b2f42) - Improved
  NaN handling and output
- [`0544fe823d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0544fe823d1) - Updates
  to account for nested unary selectors.
- [`1ed3db0c9be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ed3db0c9be) -
  Improvements to lint rule and accounting for edge cases

## 4.10.0

### Minor Changes

- [#24591](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24591)
  [`bb808f9a186`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb808f9a186) - Add
  exceptions option to ensure-design-token-usage rule

## 4.9.0

### Minor Changes

- [#24547](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24547)
  [`9701bf4a8b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9701bf4a8b3) - Fix
  false positives for variable names and object property keys

## 4.8.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 4.8.1

### Patch Changes

- [#24445](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24445)
  [`805d0fde0fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/805d0fde0fa) - Bump
  eslint-codemod-utils to 1.4.0, no real changes as no new imports are exercised

## 4.8.0

### Minor Changes

- [#23610](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23610)
  [`725f5fde8d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/725f5fde8d9) - Adds a
  rule to restrict usage of deprecated attribute `type` for inline-message

## 4.7.2

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`9f64ab9d5ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f64ab9d5ea) -
  Improvements / added robustness to edge cases previously unhandled.
- [`8e848e3a4a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e848e3a4a6) - Internal
  updates to a number of rules. Introduced a custom formatter for the rule 'no-raw-spacing-values'.
- [`31494c13aaa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31494c13aaa) - Type
  fixes to the internals of a number of rules.

## 4.7.1

### Patch Changes

- [#23674](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23674)
  [`37ac5652977`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37ac5652977) - Mark
  `isOpen` and `innerRef` props on @atlaskit/banner as deprecated.

## 4.7.0

### Minor Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`740057653f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/740057653f9) - Adds
  additional rule to restrict usage of banned imports from the design system.

## 4.6.0

### Minor Changes

- [#21819](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21819)
  [`f561f58bc7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f561f58bc7a) -
  Introduces a new rule `icon-label` to validate accessible usage of the icon components label prop
  when used with other design system components.

## 4.5.0

### Minor Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`b7235858f48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7235858f48) - Add new
  paths to the no-deprecated-imports rule for deprecated @atlaskit/logo exports.

## 4.4.6

### Patch Changes

- Updated dependencies

## 4.4.5

### Patch Changes

- [#20721](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20721)
  [`344784eec9e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/344784eec9e) - Fix
  linting error message for focusRing import

## 4.4.4

### Patch Changes

- [#20860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20860)
  [`55a212b8b01`](https://bitbucket.org/atlassian/atlassian-frontend/commits/55a212b8b01) - Adds an
  additional rule for DS users to opt into to using 'noop' as a common reference rather than
  rewriting anonymous functions.

## 4.4.3

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 4.4.2

### Patch Changes

- [#20033](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20033)
  [`b3e5a62a9e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3e5a62a9e3) - Adds
  `static` techstack to package, enforcing stricter style linting. In this case the package already
  satisfied this requirement so there have been no changes to styles.
- Updated dependencies

## 4.4.1

### Patch Changes

- [#20390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20390)
  [`236e6040fb9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/236e6040fb9) - Fixes a
  bug in the rule `ensure-design-token-usage` where some color value types were not being detected
  as hardcoded color usage. This affected Styled Components and Emotion CSS prop syntaxes.

  These color types have been fixed:

  - rgb
  - rgba
  - hsl
  - hsla
  - lch
  - lab
  - color()

## 4.4.0

### Minor Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`1065b5b1bbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1065b5b1bbb) - Fixed
  bug where deleted '[default]' tokens were not being detected by lint tooling

### Patch Changes

- Updated dependencies

## 4.3.0

### Minor Changes

- [#19019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19019)
  [`2dbc546f748`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2dbc546f748) - Fixes a
  bug where token paths including [default] were not being detected by the linter

### Patch Changes

- Updated dependencies

## 4.2.1

### Patch Changes

- [#19453](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19453)
  [`63a22b17621`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63a22b17621) - Fixes a
  bug where use of qualified type annotations would throw an error.

## 4.2.0

### Minor Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`afc248d2ded`](https://bitbucket.org/atlassian/atlassian-frontend/commits/afc248d2ded) - Adds a
  new rule, `use-visually-hidden` to complement the `@atlaskit/visually-hidden` component.
- [#18526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18526)
  [`0c0a8b5dff4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c0a8b5dff4) - Adds an
  additional rule 'no-deprecated-api-usage'. This rule targets APIs/props in the Design System that
  we intend to remove completely. This rule should be used by all product repos as it will provide
  an early warning of expected deprecations.
- [`93d6f8856f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93d6f8856f2) -
  @atlaskit/icon-priority has been deprecated due to low usage. It will be deleted after 21
  April 2022. If you rely on these icons, @atlaskit/icon-priority will still be available as a
  deprecated package on NPM, but we recommend self-hosting and managing.

## 4.1.1

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- Updated dependencies

## 4.1.0

### Minor Changes

- [#18168](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18168)
  [`52fbe80eeb5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52fbe80eeb5) - Moved
  logic for detecting deprecated tokens out of no-unsafe-design-token-usage and moves it into a new
  rule: no-deprecated-token-usage. This rule is solely reponsible for catching usage of deprecated
  tokens. In most cases this allows consumers to set this rule to "warn", allowing iterative
  migration to new token names rather than in a big bang.

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- [#17094](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17094)
  [`7da1a30902a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7da1a30902a) - Adds
  missing meta to `ensure-design-token-usage` rule.

## 4.0.0

### Major Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`a2f953f3814`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2f953f3814) -
  Previously the `ensure-design-token-usage` eslint rule contained all checks relating to token use.
  This has now been split up into two separate rules:

  `ensure-design-token-usage` now covers:

  - `legacyElevation` — warns about old usages of the elevation mixins or styles, which instead
    should use the `card` or `overlay` tokens.
  - `hardCodedColor` — warns about use of hard-coded colors such as `color: colors.B100`, which
    instead should be wrapped in a `token()` call. This covers the majority of cases in existing
    codebases when first adopting tokens.

  `no-unsafe-design-token-usage` (new) covers the remaining rules:

  - `directTokenUsage` — warns against using the CSS Custom Property name that is output in the
    browser by the `token()` call. Eg. directly using `var(--ds-accent-subtleBlue)` is bad.
  - `staticToken` — warns when tokens aren't used inline. Inlining the token usages helps with
    static analysis, which unlocks future improvements. Eg. pulling the token out into a const like
    `css={ color: token(primaryButtonText) }` is bad.
  - `invalidToken` — warns when using a token that doesn't exist (not one that's been renamed, see
    the next point).
  - `tokenRenamed` — warns when using a token that's been renamed in a subsequent release.
  - `tokenFallbackEnforced` — warns if a fallback for the token call is not provided. Eg. call with
    the fallback like this `token('color.background.disabled', N10)` instead of
    `token('color.background.disabled')`.
  - `tokenFallbackRestricted` — the opposite of `tokenFallbackEnforced`. Eg. do not pass in a
    fallback like this `token('color.background.disabled', N10)` and instead only include the token
    `token('color.background.disabled')`.

  Upgrading — some instances of `\\eslint-disable` may need to be changed to the new rule. If you
  have failing lint rules after only bumping this package then switch those ignores to use
  `no-unsafe-design-token-usage` instead.

### Patch Changes

- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- [`26719f5b7b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26719f5b7b0) - Update
  @atlaskit tokens dependency from a devDependency to a regular dependency
- [`a66711cd58c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a66711cd58c) - Remove
  `@atlaskit/tokens` from peer dependency.
- Updated dependencies

## 3.2.0

### Minor Changes

- [#16362](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16362)
  [`2af46de94ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2af46de94ba) - Adds
  additional rule to design system eslint plugin; no-deprecated-imports.

## 3.1.0

### Minor Changes

- [#16088](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16088)
  [`784f2560e9b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/784f2560e9b) - Includes
  additional rule in the recommended ruleset to restrict imports on older deprecated components.

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [#14319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14319)
  [`b6a55ffa092`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6a55ffa092) -
  Introduces fixes for various edge-cases and false positives:

  - Objects that are not considered "style blocks" are now ignored. Style blocks are considered as
    objects assigned to variables with names containing either "style", "css", or "theme" and type
    annotations including "CSSProperties" or "CSSObject".
  - Hexadecimal colors using the `0x` notation are now ignored

  Increasing the linting surface-area:

  - Colors used in shorthand css property values will now be linted against. (ie
    `border: solid 1px red`)
  - Strings passed directly into JSX attributes (props) are now linted (ie `<Button color="red" />`)

  General improvements:

  - Color names will now only match against "whole" words. Meaning strings that inadvertently
    include color names like the "tan" in "standard" will no longer fail.

  - Template literal styles are now linted against property values only. Meaning css property names
    that include colors like `white-space: nowrap` used in template literals will no longer error

  - Increased test coverage

- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`ac7a0fd6558`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac7a0fd6558) - You can
  now configure whether fallbacks are enforced or restricted when using tokens. Fallbacks are now
  restricted by default.

### Patch Changes

- Updated dependencies

## 1.0.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`6cc9dc02de1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6cc9dc02de1) - Adds
  token renaming rule (with autofix) to ensure-design-token-usage

### Patch Changes

- Updated dependencies

## 0.0.6

### Patch Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`297928490b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/297928490b8) - Fixes
  false negative reports for named legacy colors.
- [`c9d8cc07750`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9d8cc07750) - Converts
  internal code to TypeScript.
- [`8eea79b8ebc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8eea79b8ebc) - Update
  the function of checking if a node is a legacy elevation.
- [`7da605ccafe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7da605ccafe) - Adds
  suggestions for incorrect usages of color and tokens
- [`f875eb3f5cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f875eb3f5cf) - Will
  only error against hardcoded colors (Identifiers) that are assigned to an object property
- Updated dependencies

## 0.0.5

### Patch Changes

- [#12592](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12592)
  [`e11b3e4e1ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e11b3e4e1ee) -
  Restructures tokens into the following format {group}{property}{variant}{state}
- Updated dependencies

## 0.0.4

### Patch Changes

- [#12528](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12528)
  [`1926dba3536`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1926dba3536) - Adds,
  removes & renames tokens

  Adds:

  - `color.backgroundSelect`

  Renames:

  - `color.borderTextHighlighted` to `color.bordertextSelected`
  - `elevation.base` to `evelation.backgroundDefault`
  - `elevation.flatSecondary` to `elevation.backgroundSunken`
  - `elevation.backgroundCard` to `color.backgroundCard`
  - `elevation.backgroundOverlay` to `color.backgroundOverlay`
  - `elevation.borderOverlay` to `color.borderOverlay`
  - `elevation.shadowCard` to `shadow.card`
  - `elevation.shadowOverlay` to `shadow.overlay`

  Removes:

  - `elevation.boarderFlatPrimary`

  Updates:

  - `elevation.shadowOverlay` value to `DN100`
  - `color.textWarning` in light mode to `O800`
  - `color.iconBorderWarning` in light mode to `O600`

- Updated dependencies

## 0.0.3

### Patch Changes

- [#12570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12570)
  [`ade8d954aa5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ade8d954aa5) - Out of
  the box configs have been removed until stable release.
- [`f2a0a48903d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2a0a48903d) - Errors
  no longer show up on import declarations.
- [`b71d3cd3d2f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b71d3cd3d2f) - Internal
  artefacts no longer make their way to npm.

## 0.0.2

### Patch Changes

- [#12444](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12444)
  [`769ea83469c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/769ea83469c) - Moves
  tokens and eslint-plugin-design-system to the public namespace.
- Updated dependencies

## 0.0.1

### Patch Changes

- [#11993](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11993)
  [`c5ae5c84d47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5ae5c84d47) - Initial
  commit.
- Updated dependencies
