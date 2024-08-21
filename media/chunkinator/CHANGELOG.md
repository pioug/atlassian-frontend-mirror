# Changelog

## 6.1.0

### Minor Changes

- [#132147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132147)
  [`580c0e6f55a69`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/580c0e6f55a69) -
  Updates to support React 18

## 6.0.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 6.0.0

### Major Changes

- [#70414](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70414)
  [`2125e318f970`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2125e318f970) -
  Adding the option to use SHA256 for file uploads to ensure Media is FedRAMP compliant. If not
  specified the system will default to SHA1 to preserve backwards compatibiilty.

## 5.0.0

### Major Changes

- [#60352](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60352)
  [`ff9488b450dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff9488b450dd) -
  WHAT: Media has removed the ability to probe for existing file chunks.  
  WHY: This is to support the work to deprecate SHA1 usage and make the Media Platform comply with
  FedRAMP moderate controls. HOW: Remove any calls you have directly to probing, instead upload all
  files directly. If you upload files via MediaPicker no changes are required.

## 4.2.4

### Patch Changes

- [#39782](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39782)
  [`5e6b83662b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e6b83662b2) -
  reverting a change that wrongly updated chunkinator to use SHA2 before the Media Platform API
  supports it

## 4.2.3

### Patch Changes

- [#39255](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39255)
  [`ede6ee7aaab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ede6ee7aaab) - Updated
  tests, examples and moving towards /test-helper export in packages to prevent circular
  dependancies

## 4.2.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 4.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 4.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

## 4.1.3

### Patch Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`a8eeb045e3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8eeb045e3a) - adding
  media only callouts to docs

## 4.1.2

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 4.1.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 4.1.0

### Minor Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`c07a8176ddf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c07a8176ddf) - New
  BlobType SlicedBlob that includes partnumber introduced and used for uploading chunks
- [`bd3245ea9e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bd3245ea9e3) - remove
  rxjs-async-map package

### Patch Changes

- [`6cadf4e4d75`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6cadf4e4d75) - Removed
  un-used dev dependency - 'styled-components'

## 4.0.0

### Major Changes

- [#20721](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20721)
  [`bde94d1a336`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bde94d1a336) - When
  chunkinator has multiple processing batches of chunks, file will only be finalised uploading for
  once.

## 3.1.2

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`a424e62b264`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a424e62b264) - Changes
  to support Node 16 Typescript definitions from `@types/node`.

## 3.1.1

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 3.1.0

### Minor Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`f862d5ae7aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f862d5ae7aa) - remove
  RxJs peer dependency

## 3.0.2

### Patch Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`3cd9ee2d15b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cd9ee2d15b) - Added
  RxJS compatiblity notice in Media docs

## 3.0.1

### Patch Changes

- [#9083](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9083)
  [`ae0d7c24739`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae0d7c24739) - Updated
  Chunkinator@3 documentation

## 3.0.0

### Major Changes

- [#8178](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8178)
  [`dfc79cafa6c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfc79cafa6c) - Breaking
  change: Chunkinator is now returning an Observable to consumers. You can control cancellation of
  chunks upload by unsubscribing this Observable.

## 2.1.2

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 2.1.1

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 2.1.0

### Minor Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated
  to declarative entry points

## 2.0.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 2.0.2

### Patch Changes

- [#4393](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4393)
  [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump
  required because of conflicts on wadmal release

## 2.0.1

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing
  unused code to be published

## 2.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 1.1.1

### Patch Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`054e719497`](https://bitbucket.org/atlassian/atlassian-frontend/commits/054e719497) - Replace
  deprecated Media URLs with latest

## 1.1.0

### Minor Changes

- [minor][12112907b5](https://bitbucket.org/atlassian/atlassian-frontend/commits/12112907b5):

  Move Chunkinator to Atlassian frontend

### Patch Changes

- Updated dependencies
  [6a6a991904](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a6a991904):
- Updated dependencies
  [84f82f7015](https://bitbucket.org/atlassian/atlassian-frontend/commits/84f82f7015):
- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies
  [b2402fc3a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2402fc3a2):
- Updated dependencies
  [7e363d5aba](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e363d5aba):
  - @atlaskit/media-test-helpers@27.2.0
  - @atlaskit/docs@8.5.1

## 2.0.3

### Changed

- Changed `rxjs-async-map` to version `^0.1.2` instead of
  `soswow/rxjs-async-map#1112bd1c1e2a6b608308758df4fdc8f59efbf943` to resolve issue MSW-721

## 1.0.0

### Added

- `processinator` component added to be able to process batches of uploaded chunks.
- `processingFunction` option is added to supply an optional callback that processes batches of
  uploaded chunks.
- `processingBatchSize` option is added to control how many sequential chunks are supplied to
  `processingFunction`.

### Changed

- `onProgress` callback called on each uploaded chunk and no longer supplies list of chunks as a
  second argument.
- `onProgress` callback is optional now.
- `hashingFunction` is now optional function that is defaults to `SHA-1`.
- `progressBatchSize` option is removed.
