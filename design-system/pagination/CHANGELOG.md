# @atlaskit/pagination

## 16.1.18

### Patch Changes

- Updated dependencies

## 16.1.17

### Patch Changes

- Updated dependencies

## 16.1.16

### Patch Changes

- Updated dependencies

## 16.1.15

### Patch Changes

- Updated dependencies

## 16.1.14

### Patch Changes

- Updated dependencies

## 16.1.13

### Patch Changes

- Updated dependencies

## 16.1.12

### Patch Changes

- Updated dependencies

## 16.1.11

### Patch Changes

- Updated dependencies

## 16.1.10

### Patch Changes

- Updated dependencies

## 16.1.9

### Patch Changes

- Updated dependencies

## 16.1.8

### Patch Changes

- Updated dependencies

## 16.1.7

### Patch Changes

- [#188454](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188454)
  [`94461a8439c5c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/94461a8439c5c) -
  Internal refactoring of visual regression tests.
- Updated dependencies

## 16.1.6

### Patch Changes

- Updated dependencies

## 16.1.5

### Patch Changes

- Updated dependencies

## 16.1.4

### Patch Changes

- Updated dependencies

## 16.1.3

### Patch Changes

- Updated dependencies

## 16.1.2

### Patch Changes

- [#164146](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164146)
  [`cb9fe0058ed87`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cb9fe0058ed87) -
  Updates package.json direct dependencies to align with actual usage.

## 16.1.1

### Patch Changes

- Updated dependencies

## 16.1.0

### Minor Changes

- [#135819](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135819)
  [`e50ee190f35f1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e50ee190f35f1) -
  Set explicit font family on Pagination using tokens to ensure it does not inherit font family.

### Patch Changes

- Updated dependencies

## 16.0.5

### Patch Changes

- Updated dependencies

## 16.0.4

### Patch Changes

- Updated dependencies

## 16.0.3

### Patch Changes

- Updated dependencies

## 16.0.2

### Patch Changes

- Updated dependencies

## 16.0.1

### Patch Changes

- [#119674](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119674)
  [`796d5838394c2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/796d5838394c2) -
  revert the changes for pagination page navigator markup

## 16.0.0

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

## 15.2.2

### Patch Changes

- [#116445](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116445)
  [`1f4d9ed8a1be8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1f4d9ed8a1be8) -
  Remove unused internal exports and old codemods, update dependencies.

## 15.2.1

### Patch Changes

- Updated dependencies

## 15.2.0

### Minor Changes

- [#114505](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114505)
  [`7d1407c18c85c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7d1407c18c85c) -
  We are testing the pagination behind a feature flag. Moving the page navigator buttons in to the
  list. If this fix is successful it will be available in a later release.

### Patch Changes

- Updated dependencies

## 15.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 15.0.2

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 15.0.1

### Patch Changes

- Updated dependencies

## 15.0.0

### Major Changes

- [#174375](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174375)
  [`4a3e12575f8ef`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4a3e12575f8ef) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/pagination`, you will need to ensure that
  your bundler is configured to handle `.css` imports correctly. Most bundlers come with built-in
  support for `.css` imports, so you may not need to do anything. If you are using a different
  bundler, please refer to the documentation for that bundler to understand how to handle `.css`
  imports.

  For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 14.10.1

### Patch Changes

- Updated dependencies

## 14.10.0

### Minor Changes

- [#168892](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168892)
  [`402c295d9e059`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/402c295d9e059) -
  Updated types to improve compatibility with React 18.

## 14.9.5

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 14.9.4

### Patch Changes

- Updated dependencies

## 14.9.3

### Patch Changes

- Updated dependencies

## 14.9.2

### Patch Changes

- [#147416](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147416)
  [`a820e507f83f7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a820e507f83f7) -
  [ux] [EDF-1566] Made the rovo agents equal heights
- Updated dependencies

## 14.9.1

### Patch Changes

- Updated dependencies

## 14.9.0

### Minor Changes

- [#144888](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144888)
  [`36d431fde8b6f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/36d431fde8b6f) -
  Enable new icons behind a feature flag.

## 14.8.1

### Patch Changes

- Updated dependencies

## 14.8.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 14.7.11

### Patch Changes

- Updated dependencies

## 14.7.10

### Patch Changes

- Updated dependencies

## 14.7.9

### Patch Changes

- Updated dependencies

## 14.7.8

### Patch Changes

- [#119565](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119565)
  [`16045b926e115`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/16045b926e115) -
  Refactor export of pagination component for better Typescript typing recognition.

## 14.7.7

### Patch Changes

- Updated dependencies

## 14.7.6

### Patch Changes

- Updated dependencies

## 14.7.5

### Patch Changes

- Updated dependencies

## 14.7.4

### Patch Changes

- Updated dependencies

## 14.7.3

### Patch Changes

- Updated dependencies

## 14.7.2

### Patch Changes

- Updated dependencies

## 14.7.1

### Patch Changes

- [#98707](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98707)
  [`7cce9cbf2f08`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7cce9cbf2f08) -
  Internal changes to how text is rendered. There is no expected visual change.

## 14.7.0

### Minor Changes

- [#96694](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96694)
  [`336e03a3c58a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/336e03a3c58a) -
  Add support for React 18 in non-strict mode.

## 14.6.6

### Patch Changes

- Updated dependencies

## 14.6.5

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component
- Updated dependencies

## 14.6.4

### Patch Changes

- [#83188](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83188)
  [`cd5d06cd3329`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd5d06cd3329) -
  Minor adjustments to improve compatibility with React 18

## 14.6.3

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 14.6.2

### Patch Changes

- Updated dependencies

## 14.6.1

### Patch Changes

- [#80972](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80972)
  [`6ff808b4cb86`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6ff808b4cb86) -
  Remove unused "pages" prop from Navigator buttons and replace usage of spread operator with
  individual props.

## 14.6.0

### Minor Changes

- [#72645](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72645)
  [`10cdc9cadb00`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10cdc9cadb00) -
  Accessibility fix. Fixed semantics for pagination buttons.

## 14.5.3

### Patch Changes

- Updated dependencies

## 14.5.2

### Patch Changes

- Updated dependencies

## 14.5.1

### Patch Changes

- Updated dependencies

## 14.5.0

### Minor Changes

- [#68812](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68812)
  [`91d4a48c1430`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/91d4a48c1430) -
  Support better loading state for assistive tech

## 14.4.17

### Patch Changes

- Updated dependencies

## 14.4.16

### Patch Changes

- Updated dependencies

## 14.4.15

### Patch Changes

- [#42577](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42577)
  [`d51b45b02fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d51b45b02fb) - Add
  component to push model consumption in JFE

## 14.4.14

### Patch Changes

- Updated dependencies

## 14.4.13

### Patch Changes

- [#38747](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38747)
  [`5891eff1980`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5891eff1980) - The
  internal composition of this component has changed. There is no expected change in behavior.

## 14.4.12

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 14.4.11

### Patch Changes

- [#37533](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37533)
  [`1ed303de3e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ed303de3e8) - Updated
  dependencies

## 14.4.10

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 14.4.9

### Patch Changes

- Updated dependencies

## 14.4.8

### Patch Changes

- Updated dependencies

## 14.4.7

### Patch Changes

- Updated dependencies

## 14.4.6

### Patch Changes

- [#35681](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35681)
  [`2ed5220efcc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ed5220efcc) -
  DSP-10691: added jest-axe and created accessibility unit tests to ensure basic a11y issues are
  tested

## 14.4.5

### Patch Changes

- Updated dependencies

## 14.4.4

### Patch Changes

- Updated dependencies

## 14.4.3

### Patch Changes

- Updated dependencies

## 14.4.2

### Patch Changes

- Updated dependencies

## 14.4.1

### Patch Changes

- Updated dependencies

## 14.4.0

### Minor Changes

- [#34947](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34947)
  [`12d9c63d4c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12d9c63d4c1) - [ux]
  pass pageLabel to dynamic-table component and updat prev label in examples, add description in the
  types file, update example files

## 14.3.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 14.3.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 14.3.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 14.2.15

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 14.2.14

### Patch Changes

- Updated dependencies

## 14.2.13

### Patch Changes

- Updated dependencies

## 14.2.12

### Patch Changes

- Updated dependencies

## 14.2.11

### Patch Changes

- Updated dependencies

## 14.2.10

### Patch Changes

- Updated dependencies

## 14.2.9

### Patch Changes

- [#31242](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31242)
  [`cfe48bb7ece`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfe48bb7ece) - Internal
  change only. Replace usages of Inline/Stack with stable version from `@atlaskit/primitives`.

## 14.2.8

### Patch Changes

- Updated dependencies

## 14.2.7

### Patch Changes

- [#27891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27891)
  [`eadbf13d8c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eadbf13d8c0) - Updated
  usages of `Text`, `Box`, `Stack`, and `Inline` primitives to reflect their updated APIs. There are
  no visual or behaviour changes.
- Updated dependencies

## 14.2.6

### Patch Changes

- [#28159](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28159)
  [`716af1d3387`](https://bitbucket.org/atlassian/atlassian-frontend/commits/716af1d3387) - Bump
  @atlaskit/heading from 1.0.0 to 1.0.1 to avoid resolving to poison dependency version

## 14.2.5

### Patch Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`207726a4cb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/207726a4cb2) - [ux]
  Replace ellipsis made with three periods (...) with ellipsis character (…)

## 14.2.4

### Patch Changes

- [#27209](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27209)
  [`87991a69644`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87991a69644) - - Remove
  @atlaskit/tokens as a dependency.
  - Remove @emotion/react as a dependency.
  - Remove padding on navigator button in favor of default button sizing.

## 14.2.3

### Patch Changes

- Updated dependencies

## 14.2.2

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 14.2.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 14.2.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`2afcf534bad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2afcf534bad) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 14.1.10

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 14.1.9

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`ac051e856a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac051e856a6) - Internal
  code change turning on new linting rules.
- Updated dependencies

## 14.1.8

### Patch Changes

- Updated dependencies

## 14.1.7

### Patch Changes

- [#21545](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21545)
  [`efa50ac72ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efa50ac72ba) - Adjusts
  jsdoc strings to improve prop documentation

## 14.1.6

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 14.1.5

### Patch Changes

- Updated dependencies

## 14.1.4

### Patch Changes

- [#18526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18526)
  [`f8678250d08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8678250d08) - Styles
  have been rewritten to prepare for migration to compiled.
- Updated dependencies

## 14.1.3

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Bump
  dependency tiny-invariant to latest"

## 14.1.2

### Patch Changes

- [#15694](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15694)
  [`b85e7ce12cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85e7ce12cd) - Internal
  upgrade of memoize-one to 6.0.0

## 14.1.1

### Patch Changes

- Updated dependencies

## 14.1.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`f7f36b1ea80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7f36b1ea80) - Test IDs
  are now applied to sub-components, including the page items and left/right navigation controls

### Patch Changes

- [`cd34d8ca8ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd34d8ca8ea) - Internal
  wiring up to the tokens techstack, no code changes.
- Updated dependencies

## 14.0.4

### Patch Changes

- Updated dependencies

## 14.0.3

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 14.0.2

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167)
  [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates
  to development dependency `storybook-addon-performance`

## 14.0.1

### Patch Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`01918d5d885`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01918d5d885) - Reduce
  bundle size by replacing custom theme buttons to standard buttons in pagination component.
- Updated dependencies

## 14.0.0

### Major Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569)
  [`517850f6451`](https://bitbucket.org/atlassian/atlassian-frontend/commits/517850f6451) - In this
  version we made pagination dramatically faster and lighter 🤩
  - General performance improvements.
  - Accesbility improvemnts (Change Pagination wrapper tag from div to nav).
  - Changed to on demand dyanmic generation of page components for better performance.

  - **BREAKING** Renamed `innerStyles` -> `style` prop & `PaginationPropTypes` -> `PaginationProps`.
    Removed `i18n` prop and flattened its child props `prev`, `next` as standalone props
    `nextLabel`and `prevLabel`. Added `label` prop for adding aria-label on pagination wrapper.
    Removed `collapseRange` props beacause of its limited use & achieving better performance.

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest version installed**

  ```bash
  yarn upgrade @atlaskit/pagination@^14.0.0
  ```

  Once upgraded, use `@atlaskit/codemod-cli`:

  ```bash
  npx @atlaskit/codemod-cli --parser babel --extensions ts,tsx,js [relativePath]
  ```

  The CLI will show a list of components and versions so select `@atlaskit/pagination@^14.0.0` and
  you will automatically be upgraded. If your usage of pagination cannot be upgraded, a comment will
  be left that a manual change is required.

  Run `npx @atlaskit/codemod-cli -h` for more details on usage. For Atlassians, refer to the
  [documentation](https://hello.atlassian.net/wiki/spaces/AF/pages/2627171992/Codemods) for more
  details on the codemod CLI.

### Patch Changes

- [`200ebeada19`](https://bitbucket.org/atlassian/atlassian-frontend/commits/200ebeada19) - Updated
  codemods to handle edge cases
- Updated dependencies

## 13.2.0

### Minor Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`0c29d48ebf8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c29d48ebf8) - Convert
  class to functional components & analytics HOC to hooks

### Patch Changes

- [`6cba681e2d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6cba681e2d7) - Fixed
  ellipsis button incorrectly showing when it could show the actual button instead.
- [`a44cece0063`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a44cece0063) - Removed
  deprecated auto entry points and added new entry points in Pagination package
- [`e30a953977b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e30a953977b) - Convert
  pagination from styled to emotion CSS"
- Updated dependencies

## 13.1.0

### Minor Changes

- [#9510](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9510)
  [`07dc98acc92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07dc98acc92) - Added
  testId prop to pagination

## 13.0.10

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use
  injected package name and version for analytics instead of version.json.
- Updated dependencies

## 13.0.9

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 13.0.8

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 13.0.7

### Patch Changes

- Updated dependencies

## 13.0.6

### Patch Changes

- [#5164](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5164)
  [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo
  analytics-next file restructure to allow external ts definitions to continue working

## 13.0.5

### Patch Changes

- Updated dependencies

## 13.0.4

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 13.0.3

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`7c7ec3b7ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c7ec3b7ab) - Earlier
  user was unable to see next page once he goes to page 5, While using Pagination component. Now it
  works fine for page 5 and other page as well.

## 13.0.2

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293)
  [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme
  and package information has been updated to point to the new design system website.

## 13.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 13.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 12.0.21

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 12.0.20

### Patch Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868)
  [`83dad3770b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83dad3770b) - Change
  imports to comply with Atlassian conventions- Updated dependencies

## 12.0.19

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/dynamic-table@13.6.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/section-message@4.1.5
  - @atlaskit/theme@9.5.1

## 12.0.18

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6

## 12.0.17

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result-
  Updated dependencies
  [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies
  [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies
  [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/dynamic-table@13.6.1
  - @atlaskit/section-message@4.1.3

## 12.0.16

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 12.0.15

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 12.0.14

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 12.0.13

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 12.0.12

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 12.0.11

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 12.0.10

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type
  safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**
  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**
  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide
    props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide
    props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source
    code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match
    source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match
    source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 12.0.9

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 12.0.8

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 12.0.7

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:
  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root Please see this
    [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this
    [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points)
    for further details

## 12.0.6

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props
  as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps
  of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 12.0.5

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/section-message@4.0.5
  - @atlaskit/icon@19.0.0

## 12.0.4

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 12.0.3

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 12.0.2

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/section-message@4.0.2
  - @atlaskit/icon@18.0.0

## 12.0.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):
  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 12.0.0

- [major][8c65f23d32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c65f23d32):
  - @atlaskit/pagination has been converted to Typescript. Typescript consumers will now get static
    type safety. Flow types are no longer provided. No API or behavioural changes.

## 11.0.2

- Updated dependencies
  [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 11.0.1

- Updated dependencies
  [3d95467c4b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d95467c4b):
  - @atlaskit/icon@17.0.1
  - @atlaskit/dynamic-table@13.0.0

## 11.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 10.0.4

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/dynamic-table@11.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/section-message@2.0.3
  - @atlaskit/theme@8.1.7

## 10.0.3

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/dynamic-table@11.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/section-message@2.0.2
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 10.0.2

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):
  - Removes duplicate babel-runtime dependency

## 10.0.1

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/dynamic-table@11.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/section-message@2.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 10.0.0

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

## 9.0.2

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/section-message@1.0.16
  - @atlaskit/icon@16.0.0

## 9.0.1

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/icon@15.0.2
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 9.0.0

- [major][1a09599](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a09599):

  New features in this release of @atlaskit/pagination
  - Ability to extend the pagination UI with custom components
  - Control the maximum number of pages to be displayed
  - Ability to customise the logic to collapse the pagination affordance
  - Pass in extra styling to the pagination container component so you can omit the use of style
    wrappers

## 8.0.8

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/icon@15.0.1
  - @atlaskit/theme@7.0.0

## 8.0.7

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/icon@15.0.0

## 8.0.6

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 8.0.5

- [patch] Fix for pagination in IE
  [bd9046e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd9046e)

## 8.0.4

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 8.0.3

- [patch] Fix styling of button rendering icon in IE
  [b4c5b87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4c5b87)

## 8.0.2

- [patch] Fix styling in IE and maintain it in other browsers
  [0d67e69](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d67e69)

## 8.0.1

- [patch] Bump to add icon [8010540](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8010540)

## 8.0.0

- [major] updated the pagination component as per ADG spec
  [8276156](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8276156)

## 7.0.6

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 7.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5

## 7.0.3

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/button@9.0.4
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2

## 7.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3

## 7.0.1

- [patch] Move analytics tests and replace elements to core
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1

## 7.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/docs@5.0.0

## 6.0.6

- [patch] Fix \$FlowFixMe and release packages
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/button@8.2.2

## 6.0.5

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2

## 6.0.4

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 6.0.3

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0
  - @atlaskit/button@8.1.0

## 6.0.2

- [patch] moved atlaskit from dependencies to dev dependency
  [5e14f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e14f44)

## 6.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/button@8.0.1
  - @atlaskit/docs@4.0.1

## 6.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/button@8.0.0
  - @atlaskit/docs@4.0.0

## 5.0.1

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/button@7.2.5
  - @atlaskit/docs@3.0.4

## 5.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 4.0.0

- [major] Combines stateless and stateful components into one. Deletes stateless export. Renames
  pagination props. [a4b6c86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4b6c86)

## 3.7.1

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 3.7.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 3.6.4

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 3.6.3

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 3.6.2

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website,
  \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 3.6.1

- [patch] Updated inline-edit test type, migrated item, updated pagination imports to account for
  removed root index file [b48c074](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b48c074)

## 3.6.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 3.5.8

- [patch] Bumping dependency on docs
  [a2462c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2462c4)
- [patch] Update pagination number proptypes to be more permissive
  [e7cca21](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7cca21)

## 3.5.7 (2017-11-17)

- bug fix; bumping internal dependencies to latest version
  ([6d8d9b1](https://bitbucket.org/atlassian/atlaskit/commits/6d8d9b1))

## 3.5.6 (2017-10-26)

- bug fix; fix to rebuild stories
  ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 3.5.5 (2017-10-22)

- bug fix; update styled-components dep and react peerDep
  ([6a67bf8](https://bitbucket.org/atlassian/atlaskit/commits/6a67bf8))

## 3.5.4 (2017-10-15)

- bug fix; update dependencies for react 16 compatibility
  ([fc47c94](https://bitbucket.org/atlassian/atlaskit/commits/fc47c94))

## 3.5.3 (2017-08-11)

- bug fix; fix the theme-dependency
  ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))

## 3.5.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily
  ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.5.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.2.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts
  ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 3.2.0 (2017-07-17)

- feature; added ES module builds to dist and add jsnext:main to most ADG packages
  ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.1.0 (2017-07-10)

- fix; add prop-types as a dependency to avoid React 15.x warnings
  ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- feature; adds rendering of ellipsis in pagination component when there are lots of pages
  ([9befc79](https://bitbucket.org/atlassian/atlaskit/commits/9befc79))

## 2.0.0 (2017-05-24)

- conversion pass on pagination in styled-components conversion
  ([b2036a6](https://bitbucket.org/atlassian/atlaskit/commits/b2036a6))
- breaking; Named export Pagination renamed to PaginationStateless for consistency and clarity.
- ISSUES CLOSED: #AK-2394

## 1.1.5 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG
  license.([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.1.4 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and
  ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.1.3 (2017-03-23)

- fix; Empty commit to release the component
  ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.1.1 (2017-03-21)

- fix; maintainers for all the packages were added
  ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.1.0 (2017-03-08)

- feature; use createError helper function from util-common package
  ([3466262](https://bitbucket.org/atlassian/atlaskit/commits/3466262))

## 1.0.4 (2017-02-28)

- fix; dummy commit to release stories
  ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.0.1 (2017-02-28)

- fix; dummy commit to fix broken stories and missing registry pages
  ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))
- changed import path for pagination in examples
  ([0f6a7a6](https://bitbucket.org/atlassian/atlaskit/commits/0f6a7a6))

## 1.0.1 (2017-02-28)

- fix; dummy commit to release stories for components
  ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))
