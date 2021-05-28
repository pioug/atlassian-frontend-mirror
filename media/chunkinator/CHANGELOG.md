# Changelog

## 3.0.2

### Patch Changes

- [`3cd9ee2d15b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cd9ee2d15b) - Added RxJS compatiblity notice in Media docs

## 3.0.1

### Patch Changes

- [`ae0d7c24739`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae0d7c24739) - Updated Chunkinator@3 documentation

## 3.0.0

### Major Changes

- [`dfc79cafa6c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfc79cafa6c) - Breaking change: Chunkinator is now returning an Observable to consumers. You can control cancellation of chunks upload by unsubscribing this Observable.

## 2.1.2

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 2.1.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 2.1.0

### Minor Changes

- [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated to declarative entry points

## 2.0.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 2.0.2

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 2.0.1

### Patch Changes

- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing unused code to be published

## 2.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 1.1.1

### Patch Changes

- [`054e719497`](https://bitbucket.org/atlassian/atlassian-frontend/commits/054e719497) - Replace deprecated Media URLs with latest

## 1.1.0

### Minor Changes

- [minor][12112907b5](https://bitbucket.org/atlassian/atlassian-frontend/commits/12112907b5):

  Move Chunkinator to Atlassian frontend

### Patch Changes

- Updated dependencies [6a6a991904](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a6a991904):
- Updated dependencies [84f82f7015](https://bitbucket.org/atlassian/atlassian-frontend/commits/84f82f7015):
- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [b2402fc3a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2402fc3a2):
- Updated dependencies [7e363d5aba](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e363d5aba):
  - @atlaskit/media-test-helpers@27.2.0
  - @atlaskit/docs@8.5.1

## 2.0.3

### Changed

- Changed `rxjs-async-map` to version `^0.1.2` instead of `soswow/rxjs-async-map#1112bd1c1e2a6b608308758df4fdc8f59efbf943` to resolve issue MSW-721

## 1.0.0

### Added

- `processinator` component added to be able to process batches of uploaded chunks.
- `processingFunction` option is added to supply an optional callback that processes batches of uploaded chunks.
- `processingBatchSize` option is added to control how many sequential chunks are supplied to `processingFunction`.

### Changed

- `onProgress` callback called on each uploaded chunk and no longer supplies list of chunks as a second argument.
- `onProgress` callback is optional now.
- `hashingFunction` is now optional function that is defaults to `SHA-1`.
- `progressBatchSize` option is removed.
