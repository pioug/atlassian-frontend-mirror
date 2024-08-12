# @atlaskit/pubsub

## 6.7.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

## 6.6.6

### Patch Changes

- [#103846](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103846)
  [`731c4d8fa98c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/731c4d8fa98c) -
  Remove PubNub protocol support. APS is now the only supported protocol by library.

## 6.6.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 6.6.4

### Patch Changes

- [#68561](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68561)
  [`6a1919bf8400`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a1919bf8400) -
  Migrate packages to use declarative entry points

## 6.6.3

### Patch Changes

- [#40630](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40630)
  [`424a4b8d3ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/424a4b8d3ad) - Enrol
  @atlaskit/pubsub on push-model in JFE.

## 6.6.2

### Patch Changes

- [#39513](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39513)
  [`9888768ec7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9888768ec7a) - Use more
  conservative retry configuration

## 6.6.1

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 6.6.0

### Minor Changes

- [#38442](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38442)
  [`e5b6edb6c82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5b6edb6c82) - Improve
  reconnect mechanisms for both WS and HTTP protocols

## 6.5.4

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925)
  [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use
  injected env vars instead of version.json

## 6.5.3

### Patch Changes

- [#37667](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37667)
  [`72a7210af1c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/72a7210af1c) - Bump the
  version of the PubNub library to the latest one

## 6.5.2

### Patch Changes

- [#36259](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36259)
  [`f835642fab3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f835642fab3) - Fix
  analytics events attributes

## 6.5.1

### Patch Changes

- [#35422](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35422)
  [`6aeadb8078a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6aeadb8078a) - Fix HTTP
  fallback mechanism after introduction of WebSocket connection retries

## 6.5.0

### Minor Changes

- [#35350](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35350)
  [`5a905de1b6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a905de1b6d) - Added
  reconnects for WebSockets and analytics events

## 6.4.3

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 6.4.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 6.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 6.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 6.3.0

### Minor Changes

- [#32708](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32708)
  [`bf1b91e09e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf1b91e09e3) - Add
  support to Http long polling for the APS protocol

## 6.2.2

### Patch Changes

- [#32592](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32592)
  [`fdcca15d9a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdcca15d9a8) - Bump vm2
  dependency because of VULN - again

## 6.2.1

### Patch Changes

- [#32418](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32418)
  [`de0273d83ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de0273d83ea) - Bumped
  version of vm2 due to a vulnerability

## 6.2.0

### Minor Changes

- [#26309](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26309)
  [`fcc2b0f4bf1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fcc2b0f4bf1) - Add
  support for the Atlassian PubSub (APS) protocol

## 6.1.0

### Minor Changes

- [#28287](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28287)
  [`6591533faf6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6591533faf6) -
  VULN-1028179 Force patched version of vm2 to address CVE-2022-25893

## 6.0.9

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 6.0.8

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 6.0.7

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`a424e62b264`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a424e62b264) - Changes
  to support Node 16 Typescript definitions from `@types/node`.

## 6.0.6

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 6.0.5

### Patch Changes

- [#17475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17475)
  [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch
  VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 6.0.4

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 6.0.3

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 6.0.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 6.0.1

### Patch Changes

- [#4128](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4128)
  [`e97b5f6130`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e97b5f6130) - Only
  subscribe to base pubsub events when connected to at least one channel.

## 6.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 5.0.11

### Patch Changes

- [patch][05494f2306](https://bitbucket.org/atlassian/atlassian-frontend/commits/05494f2306):

  Remove 'export \*' for improved tree shaking- Updated dependencies
  [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):

  - @atlaskit/docs@8.5.0

## 5.0.10

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/field-text@10.0.1
  - @atlaskit/lozenge@9.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/util-service-support@5.0.1

## 5.0.9

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/field-text@10.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6

## 5.0.8

### Patch Changes

- [patch][da49b284ed](https://bitbucket.org/atlassian/atlassian-frontend/commits/da49b284ed):

  Bumping to solve the issue in pubsub that is bringing http and https-proxy-agent 1.0.0 that have
  DDOS and memory leak"

## 5.0.7

- Updated dependencies
  [42a92cad4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a92cad4e):
  - @atlaskit/util-service-support@5.0.0

## 5.0.6

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 5.0.5

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 5.0.4

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 5.0.3

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 5.0.2

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

## 5.0.1

- Updated dependencies
  [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/theme@9.0.3
  - @atlaskit/lozenge@9.0.0

## 5.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 4.0.5

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 4.0.4

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/field-text@8.0.3
  - @atlaskit/lozenge@7.0.2
  - @atlaskit/theme@8.1.7

## 4.0.3

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/field-text@8.0.2
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 4.0.2

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 4.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 4.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 3.0.8

- Updated dependencies
  [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/util-service-support@3.1.1
  - @atlaskit/docs@7.0.0
  - @atlaskit/field-text@8.0.0
  - @atlaskit/lozenge@7.0.0
  - @atlaskit/theme@8.0.0

## 3.0.7

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/field-text@7.0.18
  - @atlaskit/lozenge@6.2.4
  - @atlaskit/theme@7.0.1
  - @atlaskit/util-service-support@3.0.5
  - @atlaskit/docs@6.0.0

## 3.0.6

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/field-text@7.0.16
  - @atlaskit/theme@7.0.0
  - @atlaskit/lozenge@6.2.3

## 3.0.5

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/field-text@7.0.15
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 3.0.4

- [patch] FS-2941 Stop using Request object and upgrade fetch-mock
  [dff332a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dff332a)

## 3.0.3

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/lozenge@6.1.5
  - @atlaskit/field-text@7.0.6
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 3.0.2

- [patch] Fix es5 exports of some of the newer modules
  [3f0cd7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f0cd7d)
- [none] Updated dependencies
  [3f0cd7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f0cd7d)
  - @atlaskit/util-service-support@3.0.2

## 3.0.1

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/lozenge@6.1.3
  - @atlaskit/field-text@7.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/util-service-support@3.0.1

## 3.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/field-text@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/field-text@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0

## 2.0.10

- [patch] Move the tests under src and club the tests under unit, integration and visual regression
  [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
- [none] Updated dependencies
  [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
  - @atlaskit/util-service-support@2.0.12

## 2.0.9

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/field-text@6.0.4
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/lozenge@5.0.4

## 2.0.8

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0
  - @atlaskit/util-service-support@2.0.10
  - @atlaskit/theme@4.0.2
  - @atlaskit/lozenge@5.0.2
  - @atlaskit/field-text@6.0.2
  - @atlaskit/button@8.1.0

## 2.0.7

- [patch] FS-797 Allow setting url for pubsub example and fix url-search-params import style
  [1c85e67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c85e67)
- [none] Updated dependencies
  [1c85e67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c85e67)
  - @atlaskit/util-service-support@2.0.9

## 2.0.6

- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/field-text@6.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/util-service-support@2.0.8

## 2.0.5

- [patch][f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)

## 2.0.4

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/field-text@5.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4
  - @atlaskit/util-service-support@2.0.7

## 2.0.2

- [patch] FS-1948 Stop pubsub client from flooding console with 403
  [bb3d588](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb3d588)

## 2.0.0

- [major] Update to React 16.3.
  [8a96fc8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a96fc8)

## 1.1.0

- [minor] FS-1874 Move @atlassian/pubsub to @atlaskit/pubsub
  [92af7f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92af7f7)
