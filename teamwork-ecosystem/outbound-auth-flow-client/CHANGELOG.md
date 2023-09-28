# @atlaskit/outbound-auth-flow-client

## 3.4.4

### Patch Changes

- [#39492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39492) [`3b1e84fa050`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b1e84fa050) - Enrol components on push-model consumpion in Jira Frontend.

## 3.4.3

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162) [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete version.json

## 3.4.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 3.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 3.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

## 3.3.3

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 3.3.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 3.3.1

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650) [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 3.3.0

### Minor Changes

- [#16441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16441) [`65cad419e85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65cad419e85) - Add 'AuthClientOAuth2.AuthError' error type

## 3.2.1

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857) [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 3.2.0

### Minor Changes

- [#6150](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6150) [`ea1bb06612`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea1bb06612) - Added abilitiy to pass window features when calling auth

## 3.1.2

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497) [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 3.1.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885) [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 3.1.0

### Minor Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428) [`4c8eb0ba4a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c8eb0ba4a) - Add custom AuthError and AuthErrorType

## 3.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335) [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 2.0.11

### Patch Changes

- [#2731](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2731) [`a5815adf37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5815adf37) - Fixed es2019 distributable missing a version.json file

## 2.0.10

### Patch Changes

- [#2099](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2099) [`131cee6d7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/131cee6d7a) - Add missing tslib dependency

## 2.0.9

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2

## 2.0.8

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 2.0.7

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 2.0.6

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 2.0.5

### Patch Changes

- [patch][dd9ca0710e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd9ca0710e):

  Removed incorrect jsnext:main field from package.json

## 2.0.4

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 2.0.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 2.0.2

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/docs@8.0.0

## 2.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 2.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 1.0.4

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/docs@7.0.0

## 1.0.3

- [patch][63acecf699](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/63acecf699):

  - Fix output module target for @atlaskit/outbound-auth-flow-client

## 1.0.2

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/docs@6.0.0

## 1.0.1

- [patch] Fix dist/ folder [20a099f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/20a099f)

## 1.0.0

- [major] Add @atlaskit/outbound-auth-flow-client [2ebc128](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2ebc128)
