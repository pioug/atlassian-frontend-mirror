# @atlaskit/notification-log-service

## 6.1.6

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116) [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) - Upgrade Typescript from `4.9.5` to `5.4.2`

## 6.1.5

### Patch Changes

- [#39338](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39338) [`b954b88b600`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b954b88b600) - Enrol packages to push model

## 6.1.4

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162) [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete version.json

## 6.1.3

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925) [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use injected env vars instead of version.json

## 6.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 6.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 6.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 6.0.3

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 6.0.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 6.0.1

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650) [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 6.0.0

### Major Changes

- [#17459](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17459) [`8be1ff8ac9b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8be1ff8ac9b) - Removed V3 Notifications Api feature flag. By default, V3 Notifications Api will be used.

## 5.2.0

### Minor Changes

- [#16208](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16208) [`0308a114d5c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0308a114d5c) - Changing endpoints to use V3 Notifications API

## 5.1.0

### Minor Changes

- [#10662](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10662) [`72b2c53156e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/72b2c53156e) - Changing cloudId input parameter to be nullable

## 5.0.4

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857) [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 5.0.3

### Patch Changes

- [#6039](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6039) [`952f126a12`](https://bitbucket.org/atlassian/atlassian-frontend/commits/952f126a12) - Explicit declaration of default entrypoint

## 5.0.2

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497) [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 5.0.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885) [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 5.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335) [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 4.0.11

### Patch Changes

- [#2489](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2489) [`5771f5a134`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5771f5a134) - Updated export \* to explict exports for @atlaskit/notification-log-client types

## 4.0.10

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/util-service-support@5.0.1
  - @atlaskit/notification-indicator@7.0.11

## 4.0.9

- Updated dependencies [42a92cad4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a92cad4e):
  - @atlaskit/util-service-support@5.0.0

## 4.0.8

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 4.0.7

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 4.0.6

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 4.0.5

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 4.0.4

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/util-service-support@4.0.3
  - @atlaskit/docs@8.0.0
  - @atlaskit/notification-indicator@7.0.0

## 4.0.3

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 4.0.2

- Updated dependencies [987ab01f30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/987ab01f30):
  - @atlaskit/notification-indicator@6.0.0

## 4.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 4.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 3.1.2

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/util-service-support@3.1.1
  - @atlaskit/notification-indicator@4.1.3
  - @atlaskit/docs@7.0.0

## 3.1.1

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/util-service-support@3.0.5
  - @atlaskit/notification-indicator@4.0.6
  - @atlaskit/docs@6.0.0

## 3.1.0

- [minor] use new V2 notification API, add app-version header, add source query param [1583aea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1583aea)

## 3.0.2

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/notification-indicator@4.0.3

## 3.0.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/notification-indicator@4.0.1
  - @atlaskit/docs@5.0.2
  - @atlaskit/util-service-support@3.0.1

## 3.0.0

- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/notification-indicator@4.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/notification-indicator@4.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0

## 2.0.8

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/notification-indicator@3.0.5

## 2.0.7

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/notification-indicator@3.0.4
  - @atlaskit/util-service-support@2.0.11
  - @atlaskit/docs@4.1.1

## 2.0.6

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0
  - @atlaskit/notification-indicator@3.0.3
  - @atlaskit/util-service-support@2.0.10

## 2.0.5

- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/notification-indicator@3.0.2
  - @atlaskit/docs@4.0.0
  - @atlaskit/util-service-support@2.0.8

## 2.0.4

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/notification-indicator@3.0.1
  - @atlaskit/docs@3.0.4
  - @atlaskit/util-service-support@2.0.7

## 2.0.3

## 2.0.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 2.0.1

- [patch] notification-indicator and notification-log-client now compile into es5 compliant code for both es5 and es2015 packages to maintain compatibility with old toolings [1783e37](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1783e37)

## 2.0.0

- [major] Added notification-log-client and notification-indicator into Atlaskit. Please refer to docs and examples for their usages. [ac98216](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac98216)
