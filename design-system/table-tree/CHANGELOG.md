# @atlaskit/table-tree

## 9.12.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 9.11.1

### Patch Changes

- Updated dependencies

## 9.11.0

### Minor Changes

- [`cdd8a85db4ed4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cdd8a85db4ed4) -
  Export proper types for all table tree elements. Remove all remnants of extract react types.

## 9.10.5

### Patch Changes

- Updated dependencies

## 9.10.4

### Patch Changes

- [#120049](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120049)
  [`77504ff274f72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77504ff274f72) -
  DSP-19576: Assign names to anonymous default exports

## 9.10.3

### Patch Changes

- [#116402](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116402)
  [`2d5c40095cc96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2d5c40095cc96) -
  [ux] Internal changes to typography, minor visual change to table header letter spacing.

## 9.10.2

### Patch Changes

- [#116025](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116025)
  [`cd506a937e44f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd506a937e44f) -
  Internal change to how typography is applied. There should be no visual change.

## 9.10.1

### Patch Changes

- Updated dependencies

## 9.10.0

### Minor Changes

- [#111016](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111016)
  [`d131599730792`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d131599730792) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 9.9.0

### Minor Changes

- [#99184](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99184)
  [`3755cda305d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3755cda305d7) -
  Add support for React 18 in non-strict mode.

### Patch Changes

- Updated dependencies

## 9.8.0

### Minor Changes

- [#87326](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87326)
  [`a79d6ea51b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a79d6ea51b5a) -
  Introducing props `label` and `referencedLabel` to provide/reference accessible name for
  TableTree.

## 9.7.1

### Patch Changes

- [#83297](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83297)
  [`6b1707c169e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b1707c169e0) -
  The internal composition of this component has changed. There is no expected change in behaviour.

## 9.7.0

### Minor Changes

- [#81902](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81902)
  [`c11b685c99fa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c11b685c99fa) -
  This release includes bug fixes that slightly change behaviour of multi-line content in table
  cells:

  - Fixed bug where 'expand' chevron was incorrectly placed when the header cell was smaller than
    other cells in the row.
  - Fixed bug where long words in cells would not wrap to the next line.

## 9.6.13

### Patch Changes

- [#72130](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72130)
  [`b037e5451037`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b037e5451037) -
  Update new button text color fallback for default theme (non-token) to match that of old button
  current text color
- Updated dependencies

## 9.6.12

### Patch Changes

- [#65882](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65882)
  [`9629b57b6108`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9629b57b6108) -
  [ux] Updated buttons in table-tree to consume new icon buttons.

## 9.6.11

### Patch Changes

- [#63677](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63677)
  [`f320c8ce5039`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f320c8ce5039) -
  This package has been added to the Jira push model.

## 9.6.10

### Patch Changes

- [#62386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62386)
  [`ac40d033cc90`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ac40d033cc90) -
  [ux] Remove aria-busy and add more table grid semantics

## 9.6.9

### Patch Changes

- Updated dependencies

## 9.6.8

### Patch Changes

- Updated dependencies

## 9.6.7

### Patch Changes

- Updated dependencies

## 9.6.6

### Patch Changes

- [#42271](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42271)
  [`a2f554b0828`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2f554b0828) - Remove
  circular dependency and use type imports

## 9.6.5

### Patch Changes

- [#40650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40650)
  [`07aa588c8a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07aa588c8a4) - Reverts
  the fix to text descender cut-off, due to incompatibilities with Firefox and Safari.

## 9.6.4

### Patch Changes

- [#40838](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40838)
  [`ba9a249a153`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba9a249a153) - Add type
  any and remove null assignment to fix TS error in CFE

## 9.6.3

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 9.6.2

### Patch Changes

- [#38209](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38209)
  [`56b444b56a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56b444b56a8) - Fix a
  bug where text descenders were cut off at high zoom levels on Windows

## 9.6.1

### Patch Changes

- [#37624](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37624)
  [`fbce2074415`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fbce2074415) - Fix
  issues with inappropriate roles and `aria-controls` application.

## 9.6.0

### Minor Changes

- [#35975](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35975)
  [`60b048eae5d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/60b048eae5d) - Replaced
  legacy context with useContext for handling column widths

## 9.5.0

### Minor Changes

- [#33849](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33849)
  [`6e5546981a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e5546981a3) -
  Accessibility: Fix the chevron button label. Add a new prop `mainColumnForExpandCollapseLabel`
  that allows you to show a chevron label with row contents instead of a row index.

## 9.4.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 9.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 9.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 9.3.2

### Patch Changes

- [#32211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32211)
  [`4ba10567310`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ba10567310) - Internal
  changes.

## 9.3.1

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 9.3.0

### Minor Changes

- [#31891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31891)
  [`6d99522bfa2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d99522bfa2) - [ux]
  Adds `shouldExpandOnClick` prop for both TableTree and Row. This allows expansion of expandable
  rows when a user clicks anywhere on the row, along with the chevron at the head of the row.

## 9.2.11

### Patch Changes

- [#31206](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31206)
  [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades
  component types to support React 18.
- Updated dependencies

## 9.2.10

### Patch Changes

- Updated dependencies

## 9.2.9

### Patch Changes

- Updated dependencies

## 9.2.8

### Patch Changes

- [#29227](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29227)
  [`4ee60bafc6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee60bafc6d) -
  ED-16603: Remove tooltips from VR tests and make them opt in. To opt-in, add `allowedSideEffects`
  when loading the page.

## 9.2.7

### Patch Changes

- Updated dependencies

## 9.2.6

### Patch Changes

- Updated dependencies

## 9.2.5

### Patch Changes

- [#28029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28029)
  [`25348ec8a74`](https://bitbucket.org/atlassian/atlassian-frontend/commits/25348ec8a74) - Updated
  to use spacing and typography tokens. With spacing tokens enabled, padding inside cells has
  changed slightly from 10px vertical to 8px vertical, and from 25px inline to 24px inline. No
  visual changes without tokens enabled.

## 9.2.4

### Patch Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`cb8f8e76d25`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb8f8e76d25) - Update
  types for react-select and @atlaskit/select upgrade Update commerce-ui entrypoints that caused a
  pipeline issue.
- Updated dependencies

## 9.2.3

### Patch Changes

- Updated dependencies

## 9.2.2

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 9.2.1

### Patch Changes

- [#24924](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24924)
  [`d0e187cc5bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0e187cc5bd) - Fixed a
  babel issue causing `styled-components` to get injected, which broke our styling.

## 9.2.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`181c4b6cc3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/181c4b6cc3a) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 9.1.10

### Patch Changes

- [#23749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23749)
  [`70c2c0e00ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70c2c0e00ea) - Updates
  `@emotion/core` v10 to `@emotion/react` v11. No expected behaviour change.

## 9.1.9

### Patch Changes

- [#21545](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21545)
  [`efa50ac72ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efa50ac72ba) - Adjusts
  jsdoc strings to improve prop documentation

## 9.1.8

### Patch Changes

- Updated dependencies

## 9.1.7

### Patch Changes

- Updated dependencies

## 9.1.6

### Patch Changes

- Updated dependencies

## 9.1.5

### Patch Changes

- [#19646](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19646)
  [`ae03dc85756`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae03dc85756) - Moved
  homepage to atlassian.design.

## 9.1.4

### Patch Changes

- Updated dependencies

## 9.1.3

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`58884c2f6c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58884c2f6c1) - Internal
  code change turning on a new linting rule.

## 9.1.2

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- Updated dependencies

## 9.1.1

### Patch Changes

- Updated dependencies

## 9.1.0

### Minor Changes

- [#17576](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17576)
  [`4dd20cb2110`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4dd20cb2110) -
  **Note**: It is a re-release of the wrongly `patched` version `21.9.2` that should have been a
  `minor` release.

  Package has been migrated from `styled-components` to `@emotion/core`.

  Other internal changes:

  - Package has been migrated to typescript
  - Components now have partial type support.
  - Package internally supports `@atlaskit/tokens` colors.

### Patch Changes

- Updated dependencies

## 9.0.15

### Patch Changes

- [#17475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17475)
  [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch
  VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 9.0.14

### Patch Changes

- [#17256](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17256)
  [`ca37d9b9707`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca37d9b9707) - Hotfix
  to resolve an issue introduced in 9.0.12 which meant the indent of rows was not being applied
  correctly.

## 9.0.13

### Minor Changes

_WRONG RELEASE TYPE - DON'T USE_

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`3fe03999326`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fe03999326) - Package
  has been migrated from `styled-components` to `@emotion/core`.

  Other internal changes:

  - Package has been migrated to typescript
  - Components now have partial type support.
  - Package internally supports `@atlaskit/tokens` colors.

### Patch Changes

- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 9.0.12

### Patch Changes

- Updated dependencies

## 9.0.11

### Patch Changes

- Updated dependencies

## 9.0.10

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 9.0.9

### Patch Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569)
  [`25e6994ab97`](https://bitbucket.org/atlassian/atlassian-frontend/commits/25e6994ab97) - Update
  internal component usage

## 9.0.8

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use
  injected package name and version for analytics instead of version.json.
- Updated dependencies

## 9.0.7

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 9.0.6

### Patch Changes

- Updated dependencies

## 9.0.5

### Patch Changes

- Updated dependencies

## 9.0.4

### Patch Changes

- [#4573](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4573)
  [`30853172ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30853172ff) - Reset
  babel config back to ie11 to prevent runtime issues in Jira and to unbreak the Confluence
  es5-check

## 9.0.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 9.0.2

### Patch Changes

- [#4393](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4393)
  [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump
  required because of conflicts on wadmal release

## 9.0.1

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the
  'lodash' package instead of single-function 'lodash.\*' packages

## 9.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 8.0.8

### Patch Changes

- [#2763](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2763)
  [`e80d58698b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e80d58698b) - Fixed
  alignment of Cell items

## 8.0.7

### Patch Changes

- [#3229](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3229)
  [`eac08411a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eac08411a3) - Updated
  react-redux dependency to 5.1.0

## 8.0.6

### Patch Changes

- Updated dependencies

## 8.0.5

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 8.0.4

### Patch Changes

- Updated dependencies

## 8.0.3

### Patch Changes

- [patch][91e6b95599](https://bitbucket.org/atlassian/atlassian-frontend/commits/91e6b95599):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [f4374a322a](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4374a322a):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/empty-state@6.0.9

## 8.0.2

### Patch Changes

- [patch][eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):

  Follow-up on AFP-1401 when removing types to component. Some left over types and small issues-
  Updated dependencies
  [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/button@13.3.9
  - @atlaskit/section-message@4.1.7
  - @atlaskit/select@11.0.9
  - @atlaskit/spinner@12.1.6

## 8.0.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/empty-state@6.0.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/section-message@4.1.5
  - @atlaskit/select@11.0.7
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1

## 8.0.0

### Major Changes

- [major][c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):

  BREAKING CHANGE: As part of AFP-1404, we are dropping flow support. It means that those packages
  are not typed. Consumer will need to manually add their types to the component.Background ticket:
  https://product-fabric.atlassian.net/browse/AFP-1397Plan:
  https://product-fabric.atlassian.net/wiki/spaces/AFP/pages/1052870901/Drop+Flow+Support+Plan

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/select@11.0.6

## 7.1.3

- Updated dependencies
  [30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):
  - @atlaskit/select@11.0.0
  - @atlaskit/button@13.3.4

## 7.1.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 7.1.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 7.1.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 7.0.14

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 7.0.13

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 7.0.12

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 7.0.11

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 7.0.10

- Updated dependencies
  [926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):
  - @atlaskit/select@10.0.3
  - @atlaskit/analytics-next@6.0.0
  - @atlaskit/button@13.1.2

## 7.0.9

- Updated dependencies
  [433311c16a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/433311c16a):
  - @atlaskit/empty-state@6.0.0

## 7.0.8

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 7.0.7

- Updated dependencies
  [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/select@10.0.0

## 7.0.6

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/section-message@4.0.5
  - @atlaskit/select@9.1.8
  - @atlaskit/icon@19.0.0

## 7.0.5

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 7.0.4

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/section-message@4.0.2
  - @atlaskit/select@9.1.5
  - @atlaskit/icon@18.0.0

## 7.0.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 7.0.2

- Updated dependencies
  [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
  - @atlaskit/button@13.0.4
  - @atlaskit/empty-state@5.0.1
  - @atlaskit/select@9.1.2
  - @atlaskit/spinner@12.0.0

## 7.0.1

- Updated dependencies
  [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 7.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 6.0.4

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/empty-state@4.0.4
  - @atlaskit/icon@16.0.9
  - @atlaskit/section-message@2.0.3
  - @atlaskit/select@8.1.1
  - @atlaskit/spinner@10.0.7
  - @atlaskit/theme@8.1.7

## 6.0.3

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/empty-state@4.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/section-message@2.0.2
  - @atlaskit/select@8.0.5
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 6.0.2

- [patch][59eb35b62f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59eb35b62f):

  - Quick change to TableTree is now compatible with SSR. This required moving setState to
    componentDidMount().

## 6.0.1

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/empty-state@4.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/section-message@2.0.1
  - @atlaskit/select@8.0.3
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 6.0.0

- [major][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only
  distribute esm. This means all distributed code will be transpiled, but will still contain
  `import` and `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder,
  we have to worry about how consumers might be using things that aren't _actually_ supposed to be
  used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of
  packages bundling all of theme, just to use a single color, especially in situations where tree
  shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have
  multiple distributions as they would need to have very different imports from of their own
  internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node
  environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but
  we see this as a pretty sane path forward which should lead to some major bundle size decreases,
  saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in
  [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for
  external) if you have any questions or queries about this.

## 5.0.7

- Updated dependencies
  [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/select@7.0.0

## 5.0.6

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/section-message@1.0.16
  - @atlaskit/select@6.1.19
  - @atlaskit/icon@16.0.0

## 5.0.5

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/empty-state@3.1.4
  - @atlaskit/icon@15.0.2
  - @atlaskit/section-message@1.0.14
  - @atlaskit/select@6.1.13
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 5.0.4

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/empty-state@3.1.3
  - @atlaskit/icon@15.0.1
  - @atlaskit/section-message@1.0.13
  - @atlaskit/select@6.1.10
  - @atlaskit/spinner@9.0.12
  - @atlaskit/theme@7.0.0

## 5.0.3

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/section-message@1.0.12
  - @atlaskit/select@6.1.9
  - @atlaskit/icon@15.0.0

## 5.0.2

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/empty-state@3.1.2
  - @atlaskit/icon@14.6.1
  - @atlaskit/section-message@1.0.11
  - @atlaskit/select@6.1.8
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 5.0.1

- [patch][a637f5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a637f5e):

  - Refine and fix some flow type errors found by fixing @atlaskit/analytics-next HOCs to allow flow
    to type check properly

## 5.0.0

- [major][90109e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90109e9" d):

  - added isDefaultExpanded flag to control default expansion state
  - Row component now takes in isExpanded prop to control the expansion state

## 4.1.11

- [patch] Fixing blank state for datetime-picker in Firefox.
  [0e6d838](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e6d838)

## 4.1.10

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 4.1.9

- [patch] add an example which renders a custom component
  [371a771](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/371a771)

## 4.1.8

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/section-message@1.0.8
  - @atlaskit/select@6.0.2
  - @atlaskit/icon@14.0.0

## 4.1.7

- [patch] Updated dependencies
  [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/select@6.0.0

## 4.1.6

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 4.1.4

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/spinner@9.0.6
  - @atlaskit/select@5.0.9
  - @atlaskit/section-message@1.0.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 4.1.3

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/select@5.0.8
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/section-message@1.0.4
  - @atlaskit/icon@13.2.4

## 4.1.2

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/select@5.0.7
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2

## 4.1.1

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/select@5.0.6
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3
  - @atlaskit/icon@13.2.1

## 4.1.0

- [minor] Added a new helper method appendItem in tableTreeHelper class
  [f520c93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f520c93)

## 4.0.1

- [patch] Move analytics tests and replace elements to core
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/select@5.0.2
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1

## 4.0.0

- [major] Provides analytics for common component interations. See the
  [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for
  more details. If you are using enzyme for testing you will have to use
  [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme).
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/select@5.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/select@5.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 3.1.3

- [patch] Updated dependencies
  [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/button@8.2.3

## 3.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/select@4.2.3
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/spinner@7.0.2
  - @atlaskit/icon@12.1.2

## 3.1.1

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/spinner@7.0.1
  - @atlaskit/select@4.2.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 3.1.0

- [patch] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/select@4.2.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 3.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/select@4.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/spinner@6.0.1
  - @atlaskit/docs@4.0.1

## 3.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/select@4.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0

## 2.0.1

- [patch] Remove line break from changelog to allow it to display properly on the website
  [9e30bb1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e30bb1)

## 2.0.0

- [major] updated the api to capture scenarios where data can be updated on the fly
  [c1720e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1720e8)
- updated the `items` prop in TableTree component to accept Array of table data instead of function
- updated the `items` prop in Rows component to accept Array of table data instead of function
- added an `items` prop in Row component to accept children data Array for particular parent
- a new class is exported that will help manipulation for async loading `TableTreeDataHelper`, this
  is intended to make upgrade from previous API easy in case of async loading.

## 1.1.4

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/select@3.0.2
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/docs@3.0.4

## 1.1.3

- [patch] Updated dependencies
  [d05b9e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d05b9e5)
  - @atlaskit/select@3.0.0

## 1.1.0

- [minor] Improve accessibility. Use AkButton for the Chevrons.
  [8ec5a94](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ec5a94)

## 1.0.1

- [patch] Update deps and examples.
  [b775a12](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b775a12)
- [patch] Add a performance example
  [8eb1472](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eb1472)

## 1.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 0.6.1

- [patch] Makes packages Flow types compatible with version 0.67
  [25daac0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25daac0)

## 0.6.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 0.5.3

- [patch] Fix an indirect race condition vulnerability
  [b75c02a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b75c02a)

## 0.5.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 0.5.1

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 0.5.0

- [minor] Add accessibility features; introduce Row's itemId prop
  [2e0807f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e0807f)

## 0.4.0

- [minor] Update header design to conform to ADG3
  [6170e98](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6170e98)
- [minor] Don't display the loader if data is available quickly
  [93fd2eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93fd2eb)

## 0.3.2

- [patch] Fix: ellipsis was not shown when overflowing text was clipped
  [05034f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05034f7)

## 0.3.1

- [patch] Fix setState being called after unmount
  [4e5ca03](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e5ca03)

## 0.3.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 0.2.2

- [patch] Styling/spacing adjustments
  [0c29170](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c29170)

## 0.2.1

- [patch] Fix Table Tree readme to point to the correct screencast
  [ba4a01f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba4a01f)

## 0.2.0

- [minor] Add the Table Tree component (alpha version)
  [53ec386](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53ec386)
