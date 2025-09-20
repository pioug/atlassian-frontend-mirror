# @atlaskit/portal

## 5.1.8

### Patch Changes

- [`042005250a589`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/042005250a589) -
  Typescript fixes

## 5.1.7

### Patch Changes

- [`248faa32d4835`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/248faa32d4835) -
  Internal changes to how borders are applied.

## 5.1.6

### Patch Changes

- Updated dependencies

## 5.1.5

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.

## 5.1.4

### Patch Changes

- Updated dependencies

## 5.1.3

### Patch Changes

- [#188581](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188581)
  [`cd147bef0fd60`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cd147bef0fd60) -
  Internal refactoring of tests.

## 5.1.2

### Patch Changes

- Updated dependencies

## 5.1.1

### Patch Changes

- [#175845](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175845)
  [`e553e0b7cb828`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e553e0b7cb828) -
  Updated dev dependencies

## 5.1.0

### Minor Changes

- [#124073](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124073)
  [`97804593b5afb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/97804593b5afb) -
  Adds a React.Suspense boundary around Portal children to avoid bugs in React 18 concurrency (after
  validating through internal feature gates)

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- [#119013](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119013)
  [`57ff25f1ba1ff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57ff25f1ba1ff) -
  Remove unused internal export and update dependencies.

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

## 4.11.3

### Patch Changes

- Updated dependencies

## 4.11.2

### Patch Changes

- Updated dependencies

## 4.11.1

### Patch Changes

- Updated dependencies

## 4.11.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 4.10.0

### Minor Changes

- [`0e8e931171299`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0e8e931171299) -
  Testing behind a feature gate, adds a Suspense boundary to all created React 18 portals (also
  behind a feature gate)

## 4.9.4

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 4.9.3

### Patch Changes

- Updated dependencies

## 4.9.2

### Patch Changes

- [#146891](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146891)
  [`1946e3bf8c6c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1946e3bf8c6c9) -
  Internal change only: update feature flag names.

## 4.9.1

### Patch Changes

- Updated dependencies

## 4.9.0

### Minor Changes

- [#129038](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129038)
  [`7524331eed2c5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7524331eed2c5) -
  New Portal logic for React 18 concurrent renderer behind a feature flag

## 4.8.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 4.7.0

### Minor Changes

- [`8b8090800a35d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b8090800a35d) -
  Bump peer dependency for react-dom to include version 17 and 18.

## 4.6.1

### Patch Changes

- [#113286](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113286)
  [`5e96c34106b2e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e96c34106b2e) -
  DSP-19412 Add optional chaining to document.body function call to resolve type errors

## 4.6.0

### Minor Changes

- [#110836](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110836)
  [`a8bd419fd70b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a8bd419fd70b9) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 4.5.0

### Minor Changes

- [#96695](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96695)
  [`6374f444b3e4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6374f444b3e4) -
  Add support for React 18 in non-strict mode.

## 4.4.2

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 4.4.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 4.4.0

### Minor Changes

- [#41817](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41817)
  [`76888385b72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76888385b72) - Add
  MountStrategy prop to specify mount strategy

## 4.3.6

### Patch Changes

- [#39442](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39442)
  [`f78ae454863`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f78ae454863) - Update
  tooltip z-index to 9999
- Updated dependencies

## 4.3.5

### Patch Changes

- [#38731](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38731)
  [`9af31f3c1ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9af31f3c1ae) - Delete
  version.json

## 4.3.4

### Patch Changes

- [#34445](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34445)
  [`33f10b7eb36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33f10b7eb36) - Removing
  unused dependencies and dev dependencies

## 4.3.3

### Patch Changes

- [#34124](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34124)
  [`77766ad157d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/77766ad157d) - Enrol
  packages to push-model consumption in Jira.

## 4.3.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 4.3.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 4.3.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 4.2.13

### Patch Changes

- [#32211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32211)
  [`4ba10567310`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ba10567310) - Internal
  changes.

## 4.2.12

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 4.2.11

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 4.2.10

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 4.2.9

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`d5f0b466415`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d5f0b466415) - Internal
  code change turning on new linting rules.

## 4.2.8

### Patch Changes

- [#22614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22614)
  [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) -
  Upgrading internal dependency (bind-event-listener) for improved internal types

## 4.2.7

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 4.2.6

### Patch Changes

- [#20033](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20033)
  [`b3e5a62a9e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3e5a62a9e3) - Adds
  `static` techstack to package, enforcing stricter style linting. In this case the package already
  satisfied this requirement so there have been no changes to styles.

## 4.2.5

### Patch Changes

- [#14319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14319)
  [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Retains
  the portal wrapper in the DOM after the last portal is unmounted. This drastically reduces the
  style recalculations and improves performance for portalled elements.
- Updated dependencies

## 4.2.4

### Patch Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`cd34d8ca8ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd34d8ca8ea) - Internal
  wiring up to the tokens techstack, no code changes.

## 4.2.3

### Patch Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`ea086afdc2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea086afdc2d) - Fix bug
  where Portal was attached to the body after the children were rendered. Now Portal is attached
  before it's children are rendered.
- Updated dependencies

## 4.2.2

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 4.2.1

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167)
  [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates
  to development dependency `storybook-addon-performance`

## 4.2.0

### Minor Changes

- [#12170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12170)
  [`f6b951a51f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6b951a51f2) - Removes
  usage of styled-components in favour of standardising on emotion

## 4.1.2

### Patch Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569)
  [`28f40bac160`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f40bac160) - Updates
  targets for modal dialog in VR tests.

## 4.1.1

### Patch Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`8b360a4ac06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b360a4ac06) - NO-ISSUE
  Update modal dialog selector for VR & integration tests
- Updated dependencies

## 4.1.0

### Minor Changes

- [#9083](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9083)
  [`d4f0c36ac36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d4f0c36ac36) -
  Converted class based portal component to functional component and dropped unused ie11 specific
  code

### Patch Changes

- [`9e94c1beb76`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e94c1beb76) - Removed
  deprecated auto entry points and added new entry points in Portal
- [`e87c4a5ae8b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e87c4a5ae8b) -
  Optimisation of z-index to layer name by removing dependency on atlaskit theme package

## 4.0.5

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 4.0.4

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 4.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`3414523d6f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3414523d6f) - Rearange
  buttons order to align with design guidelines
- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 4.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 3.1.9

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 3.1.8

### Patch Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868)
  [`4069606178`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4069606178) - Change
  imports to comply with Atlassian conventions- Updated dependencies

## 3.1.7

### Patch Changes

- [patch][603413f530](https://bitbucket.org/atlassian/atlassian-frontend/commits/603413f530):

  Remove 'export \*' for improved tree shaking- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies
  [f5b654c328](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5b654c328):
- Updated dependencies
  [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies
  [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies
  [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies
  [0389a42cc5](https://bitbucket.org/atlassian/atlassian-frontend/commits/0389a42cc5):
- Updated dependencies
  [89bf723567](https://bitbucket.org/atlassian/atlassian-frontend/commits/89bf723567):
  - @atlaskit/docs@8.5.1
  - @atlaskit/modal-dialog@10.5.6
  - @atlaskit/theme@9.5.3
  - @atlaskit/button@13.3.10
  - @atlaskit/onboarding@9.1.5

## 3.1.6

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/flag@12.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/inline-dialog@12.1.9
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/onboarding@9.0.9
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3

## 3.1.5

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/flag@12.3.6
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/inline-dialog@12.1.8
  - @atlaskit/onboarding@9.0.8
  - @atlaskit/tooltip@15.2.2

## 3.1.4

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
  - @atlaskit/flag@12.3.5
  - @atlaskit/inline-dialog@12.1.7
  - @atlaskit/tooltip@15.2.1

## 3.1.3

### Patch Changes

- [patch][f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):

  Corrects the type exports for typography, colors, elevation and layers. If you were doing any
  dynamic code it may break you. Refer to the
  [upgrade guide](/packages/core/theme/docs/upgrade-guide) for help upgrading.- Updated dependencies
  [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):

- Updated dependencies
  [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies
  [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
  - @atlaskit/icon@19.0.11
  - @atlaskit/theme@9.3.0

## 3.1.2

### Patch Changes

- [patch][adc048de7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/adc048de7e):

  Fixing ie11 bug caused by using Event constructor

## 3.1.1

**Warning: Do not use this version. It has been deprecated**

It is broken for ie11 if you are not polyfilling the `new Event` constructor

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 3.1.0

**Warning: Do not use this version. It has been deprecated**

It is broken for ie11 if you are not polyfilling the `new Event` constructor

### Minor Changes

- [minor][bf8796cffa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bf8796cffa):

  Add mount and unmount events to @atlaskit/portal

## 3.0.13

- Updated dependencies
  [a75dfaad67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a75dfaad67):
  - @atlaskit/onboarding@9.0.0

## 3.0.12

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 3.0.11

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 3.0.10

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 3.0.9

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 3.0.8

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

## 3.0.7

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/flag@12.0.10
  - @atlaskit/inline-dialog@12.0.3
  - @atlaskit/modal-dialog@10.0.7
  - @atlaskit/onboarding@8.0.6
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 3.0.6

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 3.0.5

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 3.0.4

- Updated dependencies
  [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/icon@18.0.1
  - @atlaskit/tooltip@15.0.0

## 3.0.3

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/flag@12.0.4
  - @atlaskit/inline-dialog@12.0.1
  - @atlaskit/modal-dialog@10.0.4
  - @atlaskit/onboarding@8.0.4
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/icon@18.0.0

## 3.0.2

- Updated dependencies
  [181209d135](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/181209d135):
  - @atlaskit/modal-dialog@10.0.3
  - @atlaskit/inline-dialog@12.0.0

## 3.0.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 3.0.0

- [major][dacfb81ca1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dacfb81ca1):

  - @atlaskit/portal has been converted to Typescript. Typescript consumers will now get static type
    safety. Flow types are no longer provided. No API or behavioural changes.

- Updated dependencies
  [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
  - @atlaskit/icon@17.1.2
  - @atlaskit/onboarding@8.0.2
  - @atlaskit/modal-dialog@10.0.0

## 2.0.1

- Updated dependencies
  [238b65171f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/238b65171f):
  - @atlaskit/flag@12.0.0

## 2.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 1.0.0

- [major][5b6b4d6a0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b6b4d6a0f):

  - This major release indicates that this package is no longer under dev preview but is ready for
    use

## 0.3.1

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/flag@10.0.5
  - @atlaskit/icon@16.0.8
  - @atlaskit/inline-dialog@10.0.3
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/onboarding@7.0.3
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/button@12.0.0

## 0.3.0

- [minor][ce4e1b4780](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce4e1b4780):

  - zIndex prop now accepts string and number values. Portal consumers can now use css values like
    "unset" if needed.

## 0.2.2

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 0.2.1

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/flag@10.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/inline-dialog@10.0.1
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/onboarding@7.0.1
  - @atlaskit/tooltip@13.0.1
  - @atlaskit/button@11.0.0

## 0.2.0

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

## 0.1.0

- [minor][27cacd44ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27cacd44ab):

  - Components inside Portal render after portal container element is attached to the DOM

## 0.0.18

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/flag@9.1.9
  - @atlaskit/inline-dialog@9.0.14
  - @atlaskit/modal-dialog@7.2.1
  - @atlaskit/onboarding@6.1.16
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/icon@16.0.0

## 0.0.17

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/flag@9.1.8
  - @atlaskit/icon@15.0.2
  - @atlaskit/inline-dialog@9.0.13
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/onboarding@6.1.14
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 0.0.16

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/flag@9.1.6
  - @atlaskit/inline-dialog@9.0.11
  - @atlaskit/modal-dialog@7.0.13
  - @atlaskit/onboarding@6.1.11
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/icon@15.0.0

## 0.0.15

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/flag@9.1.5
  - @atlaskit/icon@14.6.1
  - @atlaskit/inline-dialog@9.0.10
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/onboarding@6.1.10
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/button@10.0.0

## 0.0.14

- [patch][1fb2c2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1fb2c2a):

  - Fixed issue where tooltips and modals would initially render in the wrong location

## 0.0.13

- [patch][3f5a4dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f5a4dd):

  - Replaces our own check for dom in ssr with exenv package

## 0.0.12

- [patch] fixes problem with the DOM container for portal not creating a new stacking context
  [aaab348](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aaab348)

## 0.0.11

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 0.0.10

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/flag@9.0.11
  - @atlaskit/inline-dialog@9.0.6
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/onboarding@6.0.2
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 0.0.9

- [patch] Updated dependencies
  [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/onboarding@6.0.1
  - @atlaskit/flag@9.0.10
  - @atlaskit/tooltip@12.0.14
  - @atlaskit/modal-dialog@7.0.0

## 0.0.8

- [patch] Updated dependencies
  [d9d2f0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9d2f0d)
- [none] Updated dependencies
  [89be4f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89be4f1)
  - @atlaskit/flag@9.0.9
  - @atlaskit/tooltip@12.0.13
  - @atlaskit/onboarding@6.0.0

## 0.0.7

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 0.0.6

- [patch] Updated dependencies
  [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
  - @atlaskit/inline-dialog@9.0.0
  - @atlaskit/tooltip@12.0.8
  - @atlaskit/modal-dialog@6.0.8
- [none] Updated dependencies
  [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
  - @atlaskit/inline-dialog@9.0.0
  - @atlaskit/tooltip@12.0.8
  - @atlaskit/modal-dialog@6.0.8
- [none] Updated dependencies
  [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
  - @atlaskit/inline-dialog@9.0.0
  - @atlaskit/tooltip@12.0.8
  - @atlaskit/modal-dialog@6.0.8
- [none] Updated dependencies
  [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
  - @atlaskit/inline-dialog@9.0.0
  - @atlaskit/tooltip@12.0.8
  - @atlaskit/modal-dialog@6.0.8

## 0.0.5

- [patch] Adds missing dependency on babel-runtime
  [e41e465](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e41e465)
- [none] Updated dependencies
  [e41e465](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e41e465)
  - @atlaskit/tooltip@12.0.7

## 0.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/inline-dialog@8.0.4
  - @atlaskit/modal-dialog@6.0.6
  - @atlaskit/onboarding@5.1.4
  - @atlaskit/flag@9.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/icon@13.2.4

## 0.0.3

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/inline-dialog@8.0.3
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/onboarding@5.1.3
  - @atlaskit/flag@9.0.3
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/docs@5.0.2
  - @atlaskit/modal-dialog@6.0.5

## 0.0.2

- [patch] Initial dev release of portal package
  [6d5c8c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d5c8c0)
