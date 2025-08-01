# @atlaskit/width-detector

## 5.0.4

### Patch Changes

- [#193214](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193214)
  [`c661806a65543`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c661806a65543) -
  Internal changes to how border radius and border width values are applied. No visual change.

## 5.0.3

### Patch Changes

- [#178302](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178302)
  [`7c0f40bae3ff0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7c0f40bae3ff0) -
  Migrated examples to Compiled, removed Emotion from dev dependencies.

## 5.0.2

### Patch Changes

- [#148201](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148201)
  [`8e811f1840de7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e811f1840de7) -
  Either actively or pre-emptively fixes a bug with keyframe animations in CJS and ESM distribution
  targets for packages using Compiled CSS-in-JS. This may not affect this package, but the change
  was made so a future migration does not accidentally break it.

## 5.0.1

### Patch Changes

- [#128453](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128453)
  [`e7c07f35165f2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e7c07f35165f2) -
  Update dependencies and refactor internals.
- [#128442](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128442)
  [`e01d9e5a20367`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e01d9e5a20367) -
  Update dependencies.

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

## 4.4.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

## 4.3.2

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 4.3.1

### Patch Changes

- [#166026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166026)
  [`962b5e77810fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962b5e77810fb) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 4.3.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

## 4.2.0

### Minor Changes

- [#97643](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97643)
  [`2163064f95d3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2163064f95d3) -
  Add support for React 18 in non-strict mode.

## 4.1.10

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 4.1.9

### Patch Changes

- [#81900](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81900)
  [`4de6e56a074b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4de6e56a074b) -
  Explicitly coerce value in `useInView` to improve compatibility with TypeScript 5

## 4.1.8

### Patch Changes

- [#65956](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65956)
  [`8184b1c5ea61`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8184b1c5ea61) -
  Migrate @atlaskit/width-detector to use declarative entry points

## 4.1.7

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 4.1.6

### Patch Changes

- [#57118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57118)
  [`b9bd80957181`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9bd80957181) -
  Upgrade Emotion v10 (@emotion/core) to Emotion v11 (@emotion/react). No behaviour change expected.

## 4.1.5

### Patch Changes

- [#41729](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41729)
  [`04235acacd6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04235acacd6) - Enrol
  package to push model in Jira

## 4.1.4

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 4.1.3

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925)
  [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use
  injected env vars instead of version.json

## 4.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 4.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 4.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

## 4.0.3

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 4.0.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 4.0.1

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 4.0.0

### Major Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`e78e261ac6f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e78e261ac6f) - [ux]
  ED-14487: Removed IE11/Edge18 support in @atlaskit/width-detector. No longer exporting
  IframeWidthObserverFallbackWrapper and IframeWrapperConsumer.

  - Fixed example pages
  - Updated docs/comments
  - Removed tests

## 3.0.8

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Bump
  raf-schd to latest (4.0.3), including better TS typings.

## 3.0.7

### Patch Changes

- [#17475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17475)
  [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch
  VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 3.0.6

### Patch Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`47484fe6492`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47484fe6492) - Remove
  styled-components from the list of peer dependencies.

## 3.0.5

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 3.0.4

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 3.0.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 3.0.2

### Patch Changes

- [#4393](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4393)
  [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump
  required because of conflicts on wadmal release

## 3.0.1

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the
  'lodash' package instead of single-function 'lodash.\*' packages

## 3.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 2.2.0

### Minor Changes

- [#2763](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2763)
  [`82053beb2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/82053beb2d) - ED-8944
  fix: propagete width updates after scrolling

## 2.1.1

### Patch Changes

- [#2093](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2093)
  [`359575566a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/359575566a) - [NO-ISSUE]
  Move the WidthDetector deprecated warning to the constructor avoid unnecessary logs everywhere.-
  Updated dependencies

## 2.1.0

### Minor Changes

- [minor][67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):

  Move WidthObserver from editor-common to width-detector

  WidthObserver is a more performant version of WidthDetector and should be used going forward.

  ```js
  import { WidthObserver } from '@atlaskit/width-detector';

  <WidthObserver setWidth={(width) => console.log(`width has changed to ${width}`)} />;
  ```

### Patch Changes

- [patch][109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):

  Deletes internal package @atlaskit/type-helpers and removes all usages. @atlaskit/type-helpers has
  been superseded by native typescript helper utilities.- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

  - @atlaskit/docs@8.5.1

## 2.0.10

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/type-helpers@4.2.3

## 2.0.9

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 2.0.8

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 2.0.7

### Patch Changes

- [patch][5b65eefdec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b65eefdec):

  Removes duplicate export from the main entrypoint file

## 2.0.6

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 2.0.5

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 2.0.4

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 2.0.3

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 2.0.2

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

## 2.0.1

### Patch Changes

- [patch][29a1f158c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29a1f158c1):

  Use default react import in typescript files.

## 2.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 1.0.0

- [major][87f0209201](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87f0209201):

  - This major release indicates that this package is no longer under dev preview but is ready for
    use

## 0.3.5

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 0.3.4

- [patch][83b920afd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83b920afd3):

  - Fix bug when content changes size between mount and object onload

## 0.3.3

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next
    supplied from itself.

## 0.3.2

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 0.3.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 0.3.0

- [minor][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 0.2.2

- [patch][5b226754b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b226754b8):

  - ED-5939: Replace SizeDetector with WidthDetector in all editor components

## 0.2.1

- Updated dependencies
  [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/docs@7.0.0

## 0.2.0

- [minor][6cc3a8fea4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cc3a8fea4):

  - Initial version of the WidthDetector component, modeled on the SizeDetector component.
