# @atlaskit/media-client-react

## 4.2.0

### Minor Changes

- [`c90ccf0c600ee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c90ccf0c600ee) -
  Enable cross product/cross client copy and paste of Media files by including clientId during Copy
  operations.

### Patch Changes

- Updated dependencies

## 4.1.2

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [#152511](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152511)
  [`c01c87a4eecc4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c01c87a4eecc4) -
  Exposes new MediaProvider which replaces MediaClientProvider. It generates a React context
  suplying a MediaClient instance and a MediaParsedSettings object based on MediaSettings property.

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- Updated dependencies

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

## 3.0.1

### Patch Changes

- [#112326](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112326)
  [`3341f6e2a15b4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3341f6e2a15b4) -
  Updated @atlaskit/platform-feature-flags as direct dependency (no longer peer deependency)

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.7.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 2.6.2

### Patch Changes

- Updated dependencies

## 2.6.1

### Patch Changes

- Updated dependencies

## 2.6.0

### Minor Changes

- [#103673](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103673)
  [`cb79b0a6edd96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb79b0a6edd96) -
  Now exporting new "useFileHashes" function to enable users to get all the file hashes. Also fixed
  cross client copy when users copy via context menu

## 2.5.1

### Patch Changes

- [#97492](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97492)
  [`5195c4fd974a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5195c4fd974a3) -
  Updated MockedMediaClientProvider mediaStore handling

## 2.5.0

### Minor Changes

- [#98696](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98696)
  [`375687a7b11d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/375687a7b11d1) -
  Exposing new useCopyIntent hook to easily enable consumers to register copy intent by adding a ref
  to the image / file / proxy node

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#170821](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170821)
  [`52532d238c0b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52532d238c0b6) -
  Enabled the deduplication of files in media-filmstrip by passing includeHashForDuplicateFiles flag
  to /items

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#158851](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158851)
  [`f5c5983855cae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f5c5983855cae) -
  Added new exports for verifying MediaFileStateError type and extracting error reason

## 2.2.3

### Patch Changes

- [#158481](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158481)
  [`a6efbf9ceb2c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a6efbf9ceb2c9) -
  Removed nonMediaErrors due to incorrectly logging serverUnauthorised

## 2.2.2

### Patch Changes

- [#155484](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155484)
  [`958e4ecdf8ab7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/958e4ecdf8ab7) -
  changes to test file due to addition of `nonMediaError` detection in media-client

## 2.2.1

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#134170](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134170)
  [`362bb4c304c27`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/362bb4c304c27) -
  This changeset exists because a PR touches these packages in a way that doesn't require a release

## 2.1.0

### Minor Changes

- [#130435](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130435)
  [`c3ee11ca89274`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3ee11ca89274) -
  add React 18 support

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.0.1

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [#57027](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57027)
  [`9412be3e0467`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9412be3e0467) -
  breaking change: MockedMediaClientProvider now accepts an instance of Media Store as prop instead
  of a store initializer

### Patch Changes

- [#57027](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57027)
  [`4659c1089fe6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4659c1089fe6) -
  useFileState hook skips backend subscription if there is already a file state in the Media Store

## 1.4.0

### Minor Changes

- [#43014](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43014)
  [`f021d31543e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f021d31543e) - create
  useFileState hook versions of header and itemviewer, create list-v2, refactor MediaFileStateError
  to media-client-react

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#41932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41932)
  [`756dd90f1a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/756dd90f1a3) - 1.
  Deprecate withMediaClient HOC in media-client and migrated it to media-client-react 2. clean up
  deprecated imports from media-client

## 1.2.0

### Minor Changes

- [#41643](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41643)
  [`6eb37f85acb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb37f85acb) - Utility
  MockedMediaClientProvider for testing. Import through entrypoint /test-helpers

## 1.1.0

### Minor Changes

- [#41439](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41439)
  [`74843593765`](https://bitbucket.org/atlassian/atlassian-frontend/commits/74843593765) - add
  optional skipRemote option to useFileState hook

## 1.0.1

### Patch Changes

- [#40717](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40717)
  [`ff2ad188bb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff2ad188bb2) - Context
  Provider handles undefined config property
