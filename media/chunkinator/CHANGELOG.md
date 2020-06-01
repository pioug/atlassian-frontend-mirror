# Changelog

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
