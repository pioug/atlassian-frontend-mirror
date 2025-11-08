# @atlaskit/progress-bar

## 4.0.14

### Patch Changes

- Updated dependencies

## 4.0.13

### Patch Changes

- Updated dependencies

## 4.0.12

### Patch Changes

- Updated dependencies

## 4.0.11

### Patch Changes

- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 4.0.10

### Patch Changes

- Updated dependencies

## 4.0.9

### Patch Changes

- Updated dependencies

## 4.0.8

### Patch Changes

- Updated dependencies

## 4.0.7

### Patch Changes

- Updated dependencies

## 4.0.6

### Patch Changes

- [#155802](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155802)
  [`08019848e3eab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08019848e3eab) -
  Refreshed "issue" terminology.
- Updated dependencies

## 4.0.5

### Patch Changes

- [#148201](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148201)
  [`8e811f1840de7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e811f1840de7) -
  Either actively or pre-emptively fixes a bug with keyframe animations in CJS and ESM distribution
  targets for packages using Compiled CSS-in-JS. This may not affect this package, but the change
  was made so a future migration does not accidentally break it.

## 4.0.4

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- [#115959](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/115959)
  [`411d12fff3a21`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/411d12fff3a21) -
  [ux] Remove tabindex from Progress Bar container to reduce unecessary tab stops.

## 4.0.1

### Patch Changes

- [#119549](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119549)
  [`5064e4be0bc02`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5064e4be0bc02) -
  Update dependencies.

## 4.0.0

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

## 3.2.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

## 3.1.2

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 3.0.0

### Major Changes

- [#165802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165802)
  [`6d9f786733aed`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d9f786733aed) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/image`, you will need to ensure that your
  bundler is configured to handle `.css` imports correctly. Most bundlers come with built-in support
  for `.css` imports, so you may not need to do anything. If you are using a different bundler,
  please refer to the documentation for that bundler to understand how to handle `.css` imports.

  For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 2.3.3

### Patch Changes

- Updated dependencies

## 2.3.2

### Patch Changes

- Updated dependencies

## 2.3.1

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#110836](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110836)
  [`a8bd419fd70b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a8bd419fd70b9) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 2.1.0

### Minor Changes

- [#93762](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93762)
  [`9a9edcac07f8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a9edcac07f8) -
  Add support for React 18 in non-strict mode.

## 2.0.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.0.1

### Patch Changes

- [#69022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69022)
  [`395c74147990`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/395c74147990) -
  Migrate packages to use declarative entry points

## 2.0.0

### Major Changes

- [#52318](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/52318)
  [`71ad9704d42f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/71ad9704d42f) -
  Removed all remaining legacy theming logic from the ProgressBar component.

## 1.0.2

### Patch Changes

- [#41729](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41729)
  [`04235acacd6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04235acacd6) - Enrol
  package to push model in Jira

## 1.0.1

### Patch Changes

- [#41141](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41141)
  [`91b814bddb4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/91b814bddb4) - Add
  default for env variable to fix typechecking errors

## 1.0.0

### Major Changes

- [#38972](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38972)
  [`b175ec37c65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b175ec37c65) - Cuts the
  first major release of this package. It is now considered stable and ready for general adoption.
  This version contains no code changes.

## 0.6.4

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 0.6.3

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441)
  [`599bfe90ee3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/599bfe90ee3) - Internal
  change to use shape tokens. There is no expected visual change.

## 0.6.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 0.6.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 0.6.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 0.5.16

### Patch Changes

- Updated dependencies

## 0.5.15

### Patch Changes

- Updated dependencies

## 0.5.14

### Patch Changes

- Updated dependencies

## 0.5.13

### Patch Changes

- Updated dependencies

## 0.5.12

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 0.5.11

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 0.5.10

### Patch Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`8eb92195540`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8eb92195540) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.
- Updated dependencies

## 0.5.9

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 0.5.8

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`7d4fbb433e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d4fbb433e7) - Internal
  styles refactor after turning on the static styles tech stack.
- [`247bf9bb0e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/247bf9bb0e4) -
  Introduces `testId` prop for use for automated tests.
- [`54deac49754`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54deac49754) - [ux]
  Appearance prop now available for default, success, and inverse appearances.
- [`c960c028450`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c960c028450) - Adds
  jsdoc descriptions to exported components.
- Updated dependencies

## 0.5.7

### Patch Changes

- Updated dependencies

## 0.5.6

### Patch Changes

- Updated dependencies

## 0.5.5

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 0.5.4

### Patch Changes

- Updated dependencies

## 0.5.3

### Patch Changes

- [#20065](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20065)
  [`e928aca1693`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e928aca1693) - Using
  latest color.background.inverse.subtle token

## 0.5.2

### Patch Changes

- Updated dependencies

## 0.5.1

### Patch Changes

- [#19395](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19395)
  [`cc9f9e1d294`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc9f9e1d294) - Adds
  warning in developer console for `theme` prop, which is going to be deprecated after 13 May 2022.

## 0.5.0

### Minor Changes

- [#19019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19019)
  [`53060e14621`](https://bitbucket.org/atlassian/atlassian-frontend/commits/53060e14621) - [ux]
  Instrumented `progress-bar` with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [#18526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18526)
  [`9d0e0a31638`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d0e0a31638) - Adds
  ariaLabel prop to progress bar for accessibility

## 0.3.9

### Patch Changes

- Updated dependencies

## 0.3.8

### Patch Changes

- [#13728](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13728)
  [`c5785203506`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5785203506) - Updated
  homepage in package.json

## 0.3.7

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 0.3.6

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 0.3.5

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 0.3.4

### Patch Changes

- Updated dependencies

## 0.3.3

### Patch Changes

- [#4649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4649)
  [`b284fba3d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b284fba3d1) - Components
  that had missing names are now fixed - this helps when looking for them using the React Dev Tools.

## 0.3.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 0.3.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 0.3.0

### Minor Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.2.9

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 0.2.8

### Patch Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868)
  [`974d594a23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/974d594a23) - Change
  imports to comply with Atlassian conventions

## 0.2.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/theme@9.5.1

## 0.2.6

### Patch Changes

- [patch][557a8e2451](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a8e2451):

  Rebuilds package to fix typescript typing error.

## 0.2.5

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 0.2.4

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 0.2.3

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 0.2.2

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

## 0.2.1

### Patch Changes

- [patch][7fd8d40029](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fd8d40029):

  Fix invalid "module" field. The package should expose _.js file instead of _.ts

## 0.2.0

- [minor][06e6dd5731](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06e6dd5731):
  - Initial release of Progress Bar component.

## 0.1.0

- [minor][b2eb85b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b2eb85b):
  - Initial release of Progress Bar component.
