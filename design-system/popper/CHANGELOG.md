# @atlaskit/popper

## 7.1.6

### Patch Changes

- [`16194129e5cdf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/16194129e5cdf) -
  Refactor to use `noop` helper function over noop functions.

## 7.1.5

### Patch Changes

- [`248faa32d4835`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/248faa32d4835) -
  Internal changes to how borders are applied.

## 7.1.4

### Patch Changes

- [`f0662cd7a143e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0662cd7a143e) -
  Internal changes to how borders are applied.

## 7.1.3

### Patch Changes

- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.

## 7.1.2

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.

## 7.1.1

### Patch Changes

- [`31c57f650ba07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31c57f650ba07) -
  Improving tests for server side rendering and hydration

## 7.1.0

### Minor Changes

- [#172887](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/172887)
  [`b706bb8733796`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b706bb8733796) -
  Exported CustomPopperProps for the choreographer version of Popper so that it can use the correct
  typing in parity with the atlaskit version of Popper

## 7.0.2

### Patch Changes

- [#132096](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132096)
  [`6763869be8bd0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6763869be8bd0) -
  [ux] Moved example code and package.json to compiled/react from emotion/react

## 7.0.1

### Patch Changes

- [#117686](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/117686)
  [`6b9372e48276d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6b9372e48276d) -
  Remove old codemod and update dependencies.

## 7.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

## 6.4.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

## 6.3.2

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 6.3.1

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 6.3.0

### Minor Changes

- [#138688](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138688)
  [`961d97994618c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/961d97994618c) -
  Adds `shouldFitViewport` prop which will apply `max-width` and `max-height` to contain the
  popper/popup within the viewport.

## 6.2.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

## 6.1.0

### Minor Changes

- [#110836](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110836)
  [`a8bd419fd70b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a8bd419fd70b9) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 6.0.0

### Major Changes

- [#102675](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102675)
  [`5a358ae041de`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5a358ae041de) -
  Removing @atlaskit/in-product-testing and its usages. Entry point removals require a major bump.

## 5.6.0

### Minor Changes

- [#99248](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99248)
  [`ffd6f7e683e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ffd6f7e683e0) -
  Add support for React 18 in non-strict mode.

## 5.5.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 5.5.4

### Patch Changes

- [#38731](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38731)
  [`9af31f3c1ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9af31f3c1ae) - Delete
  version.json

## 5.5.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 5.5.2

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 5.5.1

### Patch Changes

- [#32945](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32945)
  [`f859e9ccda4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f859e9ccda4) - Migrates
  unit tests from enzyme to RTL.

## 5.5.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 5.4.11

### Patch Changes

- [#29327](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29327)
  [`d84f56e6e50`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d84f56e6e50) - Remove
  the unused feature flag

## 5.4.10

### Patch Changes

- Updated dependencies

## 5.4.9

### Patch Changes

- Updated dependencies

## 5.4.8

### Patch Changes

- Updated dependencies

## 5.4.7

### Patch Changes

- Updated dependencies

## 5.4.6

### Patch Changes

- [#28158](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28158)
  [`7888ba61c3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7888ba61c3b) - Add
  platform feature flag registration and dynamic type generation for platform feature flag client
- Updated dependencies

## 5.4.5

### Patch Changes

- [#28303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28303)
  [`85dc0230439`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85dc0230439) - Add
  eslint rule to allow for platform feature flag usage

## 5.4.4

### Patch Changes

- Updated dependencies

## 5.4.3

### Patch Changes

- Updated dependencies

## 5.4.2

### Patch Changes

- [#27890](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27890)
  [`03a51e8100d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/03a51e8100d) -
  Introduces a hidden, dummy html element to validate that our new deployment pipeline is working
  end-to-end.

## 5.4.1

### Patch Changes

- [#27756](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27756)
  [`211c04b1c96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/211c04b1c96) - Fixes
  in-product testing typos causing assert errors

## 5.4.0

### Minor Changes

- [#27549](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27549)
  [`cd2800156bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd2800156bd) - Updates
  to in-product testing interface. The change switches popperRendersWithPositionFixedTestCase to
  popperRendersTestCase.

## 5.3.0

### Minor Changes

- [#27258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27258)
  [`6d5881c30a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d5881c30a4) -
  Introducing in-product testing entrypoints to popper.

## 5.2.11

### Patch Changes

- [#27294](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27294)
  [`dc53dc3201b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc53dc3201b) - Add
  'productPushConsumption' as a new optional field in package.json.

  _Note_: We want to track the information if the package was moved from the pull into the push
  model in the product. Hence, we extended the `package.json` file by adding a new field e.g.:
  "atlassian.productPushConsumption": ["jira"] This field is optional.

## 5.2.10

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 5.2.9

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 5.2.8

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 5.2.7

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`ff5655480e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff5655480e6) - Internal
  code change turning on new linting rules.

## 5.2.6

### Patch Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`45ebe7af434`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45ebe7af434) - Moved to
  using declarative entrypoints internally. Public API is unchanged.

## 5.2.5

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 5.2.4

### Patch Changes

- [#20033](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20033)
  [`b3e5a62a9e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3e5a62a9e3) - Adds
  `static` techstack to package, enforcing stricter style linting. In this case the package already
  satisfied this requirement so there have been no changes to styles.

## 5.2.3

### Patch Changes

- [#19678](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19678)
  [`10d1f4d4a4b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10d1f4d4a4b) - Export
  placement options

## 5.2.2

### Patch Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`cd34d8ca8ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd34d8ca8ea) - Internal
  wiring up to the tokens techstack, no code changes.

## 5.2.1

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 5.2.0

### Minor Changes

- [#12170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12170)
  [`f6b951a51f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6b951a51f2) - Removes
  usage of styled-components in favour of standardising on emotion

## 5.1.0

### Minor Changes

- [#8388](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8388)
  [`81f4f9f7562`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81f4f9f7562) - Update
  core `@popperjs/core` dependency to `^2.9.1`, fixing some positioning bugs, such as in parents
  with `will-change` CSS properties set. For more information on the specific changes, see the
  popper docs.

## 5.0.4

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 5.0.3

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 5.0.2

### Patch Changes

- [#4346](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4346)
  [`fc8f6e61f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc8f6e61f3) - Fix
  codemod utilities being exposed through the codemod cli

## 5.0.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 5.0.0

### Major Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`044869b067`](https://bitbucket.org/atlassian/atlassian-frontend/commits/044869b067) - This major
  release of Popper upgrades from react-popper v.1.3.6 to 2.2.3, which includes version 2 of Popper
  JS (@popperjs/core). This is a complete re-write of popper.js which comes with bundle-size and
  performance improvements, as well as a number of bug fixes and longer-term support.

  There are a number of major changes for consumers are listed below; ⚙️ indicates the change has
  codemod support:
  - **Component Props**:
    - ⚙️ `offset` is no longer a string, but an array of two integers (i.e. '0px 8px' is now [0, 8])
  - **Render Props**:
    - ⚙️ `outOfBoundaries` has been replaced with `isReferenceHidden`, and is now true when the
      popper is hidden (i.e. by a scroll container)
    - ⚙️ `scheduleUpdate`, for async updates, has been renamed to `update`, and now returns a
      Promise.
    - **✨new** `hasPopperEscaped` tracks when the reference element is fully clipped or hidden
    - **✨new** `forceUpdate` is exposed to perform synchronous updates
  - **Types**:
    - @atlaskit/popper now exports a number of useful types from both `@popperjs/core` (`Placement`)
      and `react-popper` (`ManagerProps`, `ReferenceProps`, `PopperProps`, `PopperArrowProps`,
      `PopperChildrenProps`, `StrictModifier`, `Modifier`).
    - Custom modifiers are now more strongly typed; to improve the specificity of the types, pass a
      generic type with the modifier names you plan to use.
  - **Custom modifiers**: This only affects users applying custom modifiers via the `modifiers`
    prop:
  - the `modifiers` prop has been significantly updated:
  - The format is now an array of objects, each labelled via a `name` key:value pair. Previously the
    prop was an object where each property was the modifier name.
  - Prop options are grouped together in an `options` object
  - default boundary paddings have been removed from `preventOverflow` and `flip`; to restore
    original padding, set `padding: 5`
  - modifiers that supported a `boundariesElement` option now have two options in its place:
    - `boundary`, which takes `clippingParents` (similar to `scrollParent`)
    - `rootBoundary` which takes `viewport` or `document` (replacing `viewport` and
      `window`respectively)

  Each modifier has more internal changes not listed here: see
  [the Popper JS docs](https://popper.js.org/docs/v2/modifiers/) for more information, as well as
  the [Popper migration guide](https://popper.js.org/docs/v2/migration-guide/) for an example of the
  new list structure.

  Due to the highly specific nature of these modifiers, codemod support is not provided for this
  change

  Note: due to a bug in `react-popper`, a console.error message relating to React `act()` may be
  raised on some tests. It should not cause test failures. This issue has been raised in
  [the React Popper issue tracker](https://github.com/popperjs/react-popper/issues/368)

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest version of popper installed before you can
  run the codemod**

  `yarn upgrade @atlaskit/popper@^5.0.0`

  Once upgraded, use the Atlaskit codemod-cli;

  `npx @atlaskit/codemod-cli --parser [PARSER] --extensions [FILE_EXTENSIONS] [TARGET_PATH]`

  Or run `npx @atlaskit/codemod-cli -h` for more details on usage. For Atlassians, refer to
  [this doc](https://hello.atlassian.net/wiki/spaces/AF/pages/2627171992/Codemods) for more details
  on the codemod CLI.

## 4.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 4.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 3.1.13

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 3.1.12

### Patch Changes

- [patch][cf8577f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf8577f5d6):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
  - @atlaskit/button@13.3.11

## 3.1.11

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/theme@9.5.1

## 3.1.10

### Patch Changes

- [patch][671de2d063](https://bitbucket.org/atlassian/atlassian-frontend/commits/671de2d063):

  Updates `offset` prop description.

## 3.1.9

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result-
  Updated dependencies
  [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

- Updated dependencies
  [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5

## 3.1.8

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Updates react-popper dependency to a safe version.

## 3.1.7

### Patch Changes

- [patch][542080be8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/542080be8a):

  Bumped react-popper and resolved infinite looping refs issue, and fixed close-on-outside-click for
  @atlaskit/popup

## 3.1.6

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 3.1.5

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 3.1.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 3.1.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 3.1.2

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full
  typescript support so it is recommended that typescript consumers use it also.

## 3.1.1

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 3.1.0

### Minor Changes

- [minor][0a3116e217](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a3116e217):

  Add ability to overwrite and adjust modifiers in popper

## 3.0.1

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 3.0.0

### Major Changes

- [major][ebfeb03eb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfeb03eb7):

  popper has been converted to Typescript. Typescript consumers will now get static type safety.
  Flow types are no longer provided. No API or behavioral changes.

## 2.0.1

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 2.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 1.0.0

- [major][8b5f052003](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b5f052003):
  - This major release indicates that this package is no longer under dev preview but is ready for
    use

## 0.4.3

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/theme@8.1.7

## 0.4.2

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 0.4.1

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 0.4.0

- [minor][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
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

## 0.3.7

- [patch][efc35d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/efc35d1):
  - Internal changes: - Adding react-dom and build utils as dev dependencies - Adding unit test for
    server side rendering use-case - Adding unit test to cover Popper component

## 0.3.6

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 0.3.5

- [patch][82fc5f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82fc5f5):
  - Pinning react-popper to 1.0.2 to avoid recursive bug

## 0.3.4

- [patch][0a297ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a297ba):
  - Packages should not be shown in the navigation, search and overview

## 0.3.3

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/theme@7.0.0

## 0.3.2

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 0.3.1

- [patch] Fix referenceElement overriding ref from Reference component
  [874d5bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/874d5bd)

## 0.3.0

- [minor] Adds replacementElement prop to enable onboarding use-case. See prop documentation
  [here](https://github.com/FezVrasta/react-popper#usage-without-a-reference-htmlelement)
  [1a752e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a752e6)

## 0.2.5

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 0.2.4

- [patch] Fixed popper placement offset to not fire deprecation warning.
  [4fcff1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4fcff1c)

## 0.2.3

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 0.2.2

- [patch] Using the latest popper to avoid recursive setState calls.
  [9dceca9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9dceca9)

## 0.2.1

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 0.2.0

- [minor] Bumped react-popper version to get bug fixes, also added offset prop
  [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
- [none] Updated dependencies
  [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
- [none] Updated dependencies
  [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
- [none] Updated dependencies
  [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
- [none] Updated dependencies
  [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)

## 0.1.2

- [patch] Replace @atlaskit/layer in date time picker with @atlaskit/popper, changed configuration
  of flipbehavior modifier to use viewport as the element boundary rather than the window.
  [4286672](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4286672)
- [patch] Updated datetime-picker to use @atlaskit/popper internally instead of @atlaskit/layer.
  Minor fix to @atlaskit/popper, boundariesElement for flipbehavior is now viewport and not window.
  [f2159f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2159f4)
- [none] Updated dependencies
  [4286672](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4286672)
- [none] Updated dependencies
  [f2159f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2159f4)

## 0.1.1

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/docs@5.0.2

## 0.1.0

- [minor] Dev release for popper
  [e987222](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e987222)
