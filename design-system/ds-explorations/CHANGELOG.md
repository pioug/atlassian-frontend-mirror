# @atlaskit/ds-explorations

## 5.0.7

### Patch Changes

- Updated dependencies

## 5.0.6

### Patch Changes

- [`c72a8190e4e4f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c72a8190e4e4f) -
  add types to generated code for tokens
- Updated dependencies

## 5.0.5

### Patch Changes

- [`74c2f420ee49b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/74c2f420ee49b) -
  Internal changes to how border radius is applied.

## 5.0.4

### Patch Changes

- [`098cfbb01dc36`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/098cfbb01dc36) -
  Add missing npmignore files to remove unnecessary files from published package

## 5.0.3

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- [#124329](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124329)
  [`b0d988fe689d9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b0d988fe689d9) -
  Consolidate ADS themes by adding the icon.color.subtlest with the value equal to icon.color.subtle
  to non-brand-refresh themes
- Updated dependencies

## 5.0.0

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

## 4.4.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 4.3.5

### Patch Changes

- [#105744](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105744)
  [`bc9ed5e4ee94d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc9ed5e4ee94d) -
  Updated 'ak-postbuild' script to also build '@atlaskit/platform-feature-flags'
- Updated dependencies

## 4.3.4

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 4.3.3

### Patch Changes

- Updated dependencies

## 4.3.2

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 4.3.1

### Patch Changes

- Updated dependencies

## 4.3.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 4.2.0

### Minor Changes

- [#111878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111878)
  [`223959ef57c80`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/223959ef57c80) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 4.1.0

### Minor Changes

- [#109764](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109764)
  [`1a7a3be1e63f7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1a7a3be1e63f7) -
  Change the InteractionSurface background styles' internal psuedo-selector (no expected difference
  to specificity or anything)

## 4.0.1

### Patch Changes

- [#110191](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110191)
  [`c3dc02298f8aa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3dc02298f8aa) -
  [ux] Change heading xsmall lineheight from 16 to 20 for minor third theme.
- Updated dependencies

## 4.0.0

### Major Changes

- [#101788](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101788)
  [`1c8f141e2bb6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c8f141e2bb6) -
  Removed Text component. Use `@atlaskit/primitives` instead.

## 3.5.2

### Patch Changes

- [#98149](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98149)
  [`45101e24202a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/45101e24202a) -
  Internal change only; update generated styles.
- Updated dependencies

## 3.5.1

### Patch Changes

- [#94487](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94487)
  [`6f9d7796415a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6f9d7796415a) -
  Internal codegen changes. No external change.
- Updated dependencies

## 3.5.0

### Minor Changes

- [#91140](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91140)
  [`2afd28c5e0b2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2afd28c5e0b2) -
  Add support for React 18 in non-strict mode.

## 3.4.0

### Minor Changes

- [#85745](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/85745)
  [`0e9c8c15ef86`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0e9c8c15ef86) -
  Added new color token `color.link.visited.pressed`.

### Patch Changes

- Updated dependencies

## 3.3.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 3.3.0

### Minor Changes

- [#78900](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78900)
  [`6ea786dd8082`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6ea786dd8082) -
  Add UNSAFE_small fontsize token.

### Patch Changes

- Updated dependencies

## 3.2.7

### Patch Changes

- [#81644](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81644)
  [`8ab7a816dca7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ab7a816dca7) -
  Revert input border change from the previous version

## 3.2.6

### Patch Changes

- [#80805](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80805)
  [`427c2dd9e0d6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/427c2dd9e0d6) -
  Update input border color token and width to meet 3:1 color contrast
- Updated dependencies

## 3.2.5

### Patch Changes

- [#79770](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79770)
  [`542e29efe0ad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/542e29efe0ad) -
  Update imports from @atlaskit/tokens
- Updated dependencies

## 3.2.4

### Patch Changes

- [#77148](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77148)
  [`d2c916f37431`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d2c916f37431) -
  Codegen updates
- Updated dependencies

## 3.2.3

### Patch Changes

- [#74836](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74836)
  [`3963062ac997`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3963062ac997) -
  Codegen to add in new font family tokens. Not exposed in any components.
- Updated dependencies

## 3.2.2

### Patch Changes

- [#72557](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72557)
  [`0c78c9c18cb7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c78c9c18cb7) -
  Fix font family not preferencing apple system fonts on macOS

## 3.2.1

### Patch Changes

- [#67463](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67463)
  [`adf1c3ebf0fd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/adf1c3ebf0fd) -
  Fixed an issue with `Text` where text could render incorrectly if a typography token theme was not
  present on a page.
- Updated dependencies

## 3.2.0

### Minor Changes

- [#63526](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63526)
  [`e8835feffae9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e8835feffae9) -
  Internal change to improve token sorting logic for typography tokens. Typography tokens are now
  marked as active though they are still in development and not recommend for use without prior
  approval from ADS.

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#59752](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59752)
  [`df0bbb7c4cc1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/df0bbb7c4cc1) -
  Removed minor-second typography theme: `typography`. ADG3 and Minor third themes remain as the two
  typography themes.

### Patch Changes

- Updated dependencies

## 3.0.6

### Patch Changes

- [#56371](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56371)
  [`8714b4418a12`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8714b4418a12) -
  Testing new publish workflow

## 3.0.5

### Patch Changes

- [#41365](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41365)
  [`f0a165587f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0a165587f2) - Internal
  change to update codegen styles.
- Updated dependencies

## 3.0.4

### Patch Changes

- [#41516](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41516)
  [`350e4081d89`](https://bitbucket.org/atlassian/atlassian-frontend/commits/350e4081d89) - [ux]
  Regenerates codegen artifacts as a result of changes to color palettes and token values
- Updated dependencies

## 3.0.3

### Patch Changes

- [#40324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40324)
  [`8d123310957`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d123310957) - Minor
  internal changes. There is no expected behaviour change

## 3.0.2

### Patch Changes

- [#41492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41492)
  [`dc028fe1e3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc028fe1e3b) - Loosen
  SurfaceProvider type to `any`.

## 3.0.1

### Patch Changes

- [#40650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40650)
  [`07aa588c8a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07aa588c8a4) - Reverts
  the fix to text descender cut-off, due to incompatibilities with Firefox and Safari.

## 3.0.0

### Major Changes

- [#41301](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41301)
  [`5f80fdb81a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f80fdb81a0) - Remove
  Box, Inline, Stack components. These components are deprecated in favour of @atlaskit/primitives.

## 2.4.0

### Minor Changes

- [#41275](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41275)
  [`1fd49b30e7e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fd49b30e7e) - Revert
  removal of Box, Inline, Stack entry-points.

## 2.3.2

### Patch Changes

- [#40299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40299)
  [`b1882fdd842`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1882fdd842) - Change
  typography token naming to be more verbose.

## 2.3.1

### Patch Changes

- [#40041](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40041)
  [`83cd2ae7c5a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83cd2ae7c5a) -
  Regenerates codegen artifacts as a result of introducting new visited link token.
- Updated dependencies

## 2.3.0

### Minor Changes

- [#40054](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40054)
  [`933fd5192d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/933fd5192d6) - -
  Removes UNSAFE_Box component.
  - Removes UNSAFE_Inline component.
  - Removes UNSAFE_Stack component.

## 2.2.15

### Patch Changes

- [#39854](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39854)
  [`6b3e7af515d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b3e7af515d) - Updates
  based on new codgen for tokens (no API change).
- Updated dependencies

## 2.2.14

### Patch Changes

- [#39578](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39578)
  [`813edf2fe03`](https://bitbucket.org/atlassian/atlassian-frontend/commits/813edf2fe03) - Minor
  internal changes. There is no expected behaviour change.
- Updated dependencies

## 2.2.13

### Patch Changes

- [#39430](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39430)
  [`88e4ac397ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88e4ac397ea) -
  Regenerates codegen artifacts as a result of introducting new accent interaction tokens.
- Updated dependencies

## 2.2.12

### Patch Changes

- [#39135](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39135)
  [`437a056278c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/437a056278c) - Update
  to reflect latest tokens.
- Updated dependencies

## 2.2.11

### Patch Changes

- [#38620](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38620)
  [`103ee1d5dd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/103ee1d5dd4) - Internal
  updates to generated artifacts.

## 2.2.10

### Patch Changes

- [#38433](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38433)
  [`b11339bc8a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b11339bc8a3) - Internal
  updates for ADS Typography ADG3 theme.
- Updated dependencies

## 2.2.9

### Patch Changes

- [#38209](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38209)
  [`56b444b56a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56b444b56a8) - Fix a
  bug where text descenders were cut off at high zoom levels on Windows

## 2.2.8

### Patch Changes

- [#37182](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37182)
  [`74f7af9882b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/74f7af9882b) - [ux]
  correct fallback color of token color.border.focused to meet contrast requirement

## 2.2.7

### Patch Changes

- [#36967](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36967)
  [`298df94426c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/298df94426c) -
  Regenerates codegen'd artifacts as a result of introducting new brand background design tokens.
- Updated dependencies

## 2.2.6

### Patch Changes

- [#36279](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36279)
  [`27f6081edf2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27f6081edf2) -
  Regenerates codegen hashes to surface changes to tokens

## 2.2.5

### Patch Changes

- [#36218](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36218)
  [`7c1c449eb96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c1c449eb96) - Updated
  space token descriptions.

## 2.2.4

### Patch Changes

- [#36072](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36072)
  [`267a88221e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/267a88221e8) - Internal
  change to update codegen.

## 2.2.3

### Patch Changes

- [#35526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35526)
  [`55be182b904`](https://bitbucket.org/atlassian/atlassian-frontend/commits/55be182b904) -
  Regenerates codegen'd artifacts as a result of introducting new design tokens.
- Updated dependencies

## 2.2.2

### Patch Changes

- [#35385](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35385)
  [`79e94411a9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79e94411a9c) - Bump to
  account for regeneration of tokens artifacts.
- Updated dependencies

## 2.2.1

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 2.2.0

### Minor Changes

- [#34217](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34217)
  [`78a3f27cc3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78a3f27cc3a) -
  Regenerate style maps based on token updates.

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 2.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 2.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 2.0.13

### Patch Changes

- [#32211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32211)
  [`1aa8720a4ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1aa8720a4ff) - Internal
  refactor.

## 2.0.12

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 2.0.11

### Patch Changes

- [#32311](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32311)
  [`a02eed2974e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a02eed2974e) - Move
  codegen into @atlassian scope to publish it to private registry

## 2.0.10

### Patch Changes

- [#31378](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31378)
  [`9fb52345e8d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fb52345e8d) - Update
  some examples to use Inline and Stack from `@atlaskit/primitives`.

## 2.0.9

### Patch Changes

- [#31206](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31206)
  [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades
  component types to support React 18.

## 2.0.8

### Patch Changes

- [#30905](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30905)
  [`6ce08fbcba2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ce08fbcba2) - [ux]
  Fixed a bug where the `<Box>` `justifyContent` prop was mistakenly applying `alignItems` for
  `start` and `end` values

## 2.0.7

### Patch Changes

- [#31127](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31127)
  [`66493433ce9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/66493433ce9) - Removes
  temporary, internal-only unsafe exports as they now live in @atlaskit/primitives/responsive.

## 2.0.6

### Patch Changes

- [#30708](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30708)
  [`4b219ed17bf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b219ed17bf) -
  Breakpoint constants added to be used in responsive spikes initially

## 2.0.5

### Patch Changes

- [#30487](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30487)
  [`a70970a5aab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a70970a5aab) - Mark
  Box, Inline, and Stack as deprecated, planned for future removal.

## 2.0.4

### Patch Changes

- [#30125](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30125)
  [`7f5f23dcb68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f5f23dcb68) -
  Introduce shape tokens to some packages.

## 2.0.3

### Patch Changes

- [#29387](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29387)
  [`069494fbea6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/069494fbea6) - Internal
  change. There is no behaviour or visual change.
- Updated dependencies

## 2.0.2

### Patch Changes

- [#27634](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27634)
  [`cf16d8f8bcc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf16d8f8bcc) - Removes
  usage of tokens which have been removed from the codebase
- Updated dependencies

## 2.0.1

### Patch Changes

- [#28784](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28784)
  [`290b1f069bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/290b1f069bd) -
  Regenerate codegen styles

## 2.0.0

### Major Changes

- [#27891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27891)
  [`544c409d79f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/544c409d79f) -
  **Breaking Change**

### `Text`

fontSize, fontWeight, and lineHeight APIs have changed due to typography tokens being introduced.
The new values for fontSize and lineHeight follow a scale whereas fontWeight accepts keyword values.

### `Box`

`padding`, `paddingBlock`, and `paddingInline` prop values now follow the pattern `space.x` instead
of `scale.x` to align with spacing tokens.

### `Inline` and `Stack`

`gap` prop values now follow the pattern `space.x` instead of `scale.x` to align with spacing
tokens.

## 1.7.0

### Minor Changes

- [#28165](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28165)
  [`642298a54dc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/642298a54dc) - Box -
  Allow `display` prop to take `inline-block`.

## 1.6.4

### Patch Changes

- [#27875](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27875)
  [`1e46e236f6f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e46e236f6f) - This
  changeset exists because a PR touches these packages in a way that doesn't require a release

## 1.6.3

### Patch Changes

- [#28011](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28011)
  [`00c057bdd71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00c057bdd71) - Removes
  spacing-raw & typography-raw entrypoints in favor of tokens-raw
- Updated dependencies

## 1.6.2

### Patch Changes

- Updated dependencies

## 1.6.1

### Patch Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`f7b2dbd6eba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7b2dbd6eba) - Add
  fontWeight 600 to Text. Add justifyContent spaceBetween to Inline. Add overflow hidden, position
  fixed, and start/end flex values to Box. Add shadow and layer props to Box.

## 1.6.0

### Minor Changes

- [#27076](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27076)
  [`9f9498aafb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f9498aafb1) - [ux] Box
  API introduces `hidden` for `overflow` prop.

## 1.5.0

### Minor Changes

- [#27789](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27789)
  [`c146611a18c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c146611a18c) - [ux]
  Migrate progress-indicator package to use spacing primitives to control spacing in both component
  and examples. Spacing values have been slightly updated depending on indicator size and spacing
  properties

## 1.4.0

### Minor Changes

- [#27894](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27894)
  [`7f886c0aa18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f886c0aa18) - The
  `Inline` component now allows children to be justified 'space-between'.

## 1.3.2

### Patch Changes

- [#27629](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27629)
  [`f824dcfff6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f824dcfff6e) - Internal
  changes to satisfy various lint warnings & errors

## 1.3.1

### Patch Changes

- [#27433](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27433)
  [`04f01205c6b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04f01205c6b) - Applies
  rem instead of pixels as spacing tokens fallbacks. This should have no visual or behavioural
  change.

## 1.3.0

### Minor Changes

- [#27482](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27482)
  [`7d6e345cd63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d6e345cd63) - Bump to
  account for bump in `@atlaskit/tokens`.

## 1.2.2

### Patch Changes

- [#27209](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27209)
  [`1dec7b39f7b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1dec7b39f7b) - -
  Children are only iterated over when divider prop is passed. There should be no behaviour change.
  - Add `user-select: none;` to divider.

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#26801](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26801)
  [`e6fb7598867`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6fb7598867) - Exposes
  additional public entrypoints for `Inline` and `Stack`. Loosens the types of `children` for the
  `Inline`, `Stack` and `Box` as it was causing unexpected friction.

## 1.1.0

### Minor Changes

- [#26803](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26803)
  [`93d75a4e289`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93d75a4e289) - Adding
  id prop for Text component so that element can be updated with id attribute. It's a way for an
  element to be uniquely identifiable for a range of reasons. For example: URL anchors, reference
  target for integrations and accessible label references.

## 1.0.0

### Major Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`30c6ec5a76f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30c6ec5a76f) -
  **Breaking Change**

  The package has been moved to a v1 state. It is no less or more stable (see readme for more
  information) however this update is to ensure that the consumption of minor versions for the
  package in downstream dependencies is correctly resolved.

  This update also includes changes to the way the `Text` component behaves with `Box`:
  - Text will now remove redundant DOM elements if it detects that it is already in the context of a
    `Text` element. This will only occur if the Text element that is a candidate for removal does
    not apply any custom property.
  - Text will also try to apply a color that is accessible if no user choice has been provided and
    the background of the surface causes an accessibility failure.

### Minor Changes

- [`664d3fe6586`](https://bitbucket.org/atlassian/atlassian-frontend/commits/664d3fe6586) - Use
  spacing tokens for all spacing-related props. Remove old SPACING_SCALE and GlobalSpacingToken.

### Patch Changes

- [`f5ae2702e35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5ae2702e35) - Box
  component now infers HTML attribute props from `as` prop.
- [`7c6009de2f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c6009de2f1) - [ux]
  Updates the visual appearance to match the legacy light mode palette.

## 0.1.5

### Patch Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`7014fd08976`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7014fd08976) - [ux]
  Inline gap prop now internally sets column-gap; Stack gap prop now internally sets row-gap
- [`ba660f4f76f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba660f4f76f) - Add
  `start` and `end` values to Stack and Inline flex properties.
- [`3ee63238f49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ee63238f49) - Update
  internals of Box, Text, Inline and Stack to handle `children` more accurately. Also update scope
  of `use-primitives` to suggest Box and Text more selectively.
- [`9dec0fe6946`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dec0fe6946) - Add
  overflow prop to Box.
- [`7a9e73ec430`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a9e73ec430) - [ux]
  Internal changes to how styles are represented in SectionMessage. Some minor visual changes to the
  color and spacing of SectionMessage. No changes to the SectionMessage API.

## 0.1.4

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 0.1.3

### Patch Changes

- [#24929](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24929)
  [`d6328e5e1ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6328e5e1ec) - Removes
  the default values for `<Text />`.

## 0.1.2

### Patch Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`37246e87cfc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37246e87cfc) - Adds
  position static to Box. Changes lozenge to use position static instead of relative.
- [`09c2fef4837`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09c2fef4837) -
  Introduces a `className` to `Box`.
- [`862d3b09b49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/862d3b09b49) - Add
  `shouldTruncate` prop to Text to enable truncating text with an ellipsis. Defaults to false.
- [`def8e951547`](https://bitbucket.org/atlassian/atlassian-frontend/commits/def8e951547) - Drop
  href from Text. Reduce `as` options available for Text to account only for the most basic HTML
  elements that typically contain text.
- [`22198a90b65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22198a90b65) - Add
  textTransform prop, verticalAlign prop, and fontWeight '700' option to Text component. Changed
  fontSize prop options to include 'px' unit. Add default 'border-box' box-sizing to Text. Export
  BoxProps, TextProps, and SPACING_SCALE.

## 0.1.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 0.1.0

### Minor Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`57b94585c64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57b94585c64) - Breaking
  change to the color props which now require a fallback. Generated colors now also include
  additional background color types.
- [`57c59a5c2d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c59a5c2d2) - Initial
  implementation of UNSAFE_Box

### Patch Changes

- [`72c111790cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/72c111790cf) - [ux]
  Refine implementation of Text primitive
- [`c28d7c86875`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c28d7c86875) - Add base
  interface to primitives in ds-explorations.
- [`e11b4abd515`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e11b4abd515) - Adds
  initial implementation of Inline and Stack. Adds "block" option to Box `display` prop. Removes
  "baseline" option from Box `justifyContent` prop. Removes `gap` prop from Box.
- [`0dbb4833163`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0dbb4833163) - Exports
  primitives components. Adds basic line-height values to Text.
- [`ea36ea17c4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea36ea17c4e) - Text now
  supports text-align and it's used for Badge to retain existing visuals

## 0.0.3

### Patch Changes

- [#23579](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23579)
  [`40151c42d7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/40151c42d7d) - Update
  background, text and icon disabled colors to use alpha base tokens

## 0.0.2

### Patch Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`232b2b765b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/232b2b765b9) - Internal
  changes to the way styles are created for the `Box` and `Text` components. Both components now use
  a wrapper over the `af/codegen`'s expected API to generate styles and types from the tokens
  package.
- [`29b8b26ee79`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29b8b26ee79) - Updates
  Box, Text to include partial implementations to spike and experiment with different usages.

## 0.0.1

### Patch Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029)
  [`f7edb043597`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7edb043597) - Initial
  release, no API exposed.
