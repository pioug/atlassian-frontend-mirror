# @atlaskit/media-state

## 2.0.0

### Major Changes

- [`bc6f294d90d3f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bc6f294d90d3f) -
  Upgrade immer dependency to 11.1.4 (COMMIT-24745). Addresses dependency debt and version conflicts
  for downstream consumers. Uses immer via zustand middleware, compatible across v8–v11.

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#185135](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185135)
  [`3d2527a53b492`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d2527a53b492) -
  Add media metadata fields to relevant types/mappings

## 1.7.0

### Minor Changes

- [#177475](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/177475)
  [`716cb697e500b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/716cb697e500b) -
  Exported new type MediaUserArtifactCaptionKey

## 1.6.0

### Minor Changes

- [#152511](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152511)
  [`b0d33c6c86122`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b0d33c6c86122) -
  Extended type definition of MediaFileArtifacts. It no longer defines preset keys.
  MediaFileArtifact now takes two different shapes: MediaSystemArtifact (system generated) and
  MediaUserArtifact (user uploaded)

## 1.5.1

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#102527](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102527)
  [`a90d34cd14faf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a90d34cd14faf) -
  Updated MediaFileArtifact type definition

## 1.4.0

### Minor Changes

- [#103451](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103451)
  [`c45fe9fe50a79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c45fe9fe50a79) -
  Extended Abuse Classification Confidence values

## 1.3.0

### Minor Changes

- [#97492](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97492)
  [`5195c4fd974a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5195c4fd974a3) -
  Extended FileState type def with optional AbuseClassification attribute

## 1.2.0

### Minor Changes

- [#170821](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170821)
  [`52532d238c0b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52532d238c0b6) -
  Enabled the deduplication of files in media-filmstrip by passing includeHashForDuplicateFiles flag
  to /items

## 1.1.0

### Minor Changes

- [#103718](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103718)
  [`5bdb1cb0f2b7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5bdb1cb0f2b7) -
  CXP-3328 Integrate CDN delivery to media-client

## 1.0.4

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.3

### Patch Changes

- [#43817](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43817)
  [`048aca70499`](https://bitbucket.org/atlassian/atlassian-frontend/commits/048aca70499) - Updated
  Internal File Artifact Definitions

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#38532](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38532)
  [`7b6a2c6671b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b6a2c6671b) -
  Introducing 'media-state' for handling media internal file state. Introducing 'media-client-react'
  to provide hooks for seamless media-client integration with React. Introducing 'MediaCardV2' with
  a feature flag to replace rxjs based fileState subscription with 'useFileState' hook. Removed
  unused feature flags APIs from 'media-client' and its helper functions from 'media-common'.

### Patch Changes

- Updated dependencies
