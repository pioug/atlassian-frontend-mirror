# @atlaskit/media-file-preview

## 0.9.4

### Patch Changes

- [#165609](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165609)
  [`b29c0cc4fef46`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b29c0cc4fef46) -
  Cleaned up media card perf observer feature flag

## 0.9.3

### Patch Changes

- Updated dependencies

## 0.9.2

### Patch Changes

- [#158851](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158851)
  [`f5c5983855cae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f5c5983855cae) -
  Used new @atlaskit/media-client-react functions for verifying MediaFileStateError type and
  extracting error reason
- Updated dependencies

## 0.9.1

### Patch Changes

- Updated dependencies

## 0.9.0

### Minor Changes

- [#140915](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140915)
  [`36b5acc412af5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/36b5acc412af5) -
  Design system typography uplift

### Patch Changes

- Updated dependencies

## 0.8.4

### Patch Changes

- Updated dependencies

## 0.8.3

### Patch Changes

- [`eaacfc7b03414`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eaacfc7b03414) -
  Changed the feature flag used for analytics publishing to prevent spamming due to cached clients
  using bugged versions of Card

## 0.8.2

### Patch Changes

- [#132917](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132917)
  [`c940f8ae45182`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c940f8ae45182) -
  Removed the additional `ssr` parameter to the image endpoint

## 0.8.1

### Patch Changes

- [#132551](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132551)
  [`19eb1d802c7f9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19eb1d802c7f9) -
  Fixed the dual fetching of image when medaiBlobUrlAttributes change

## 0.8.0

### Minor Changes

- [#130787](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130787)
  [`64a680780dc57`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/64a680780dc57) -
  Add performance observer metrics for Media Card to assist investigation into hot-110955

### Patch Changes

- [#131947](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131947)
  [`871136a343690`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/871136a343690) -
  Fixed issue with images being refetched if the items responded before upfront preview resolved
- Updated dependencies

## 0.7.0

### Minor Changes

- [#130406](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130406)
  [`2132e67c92d0f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2132e67c92d0f) -
  Updates media-file-preview to support React 18

## 0.6.0

### Minor Changes

- [#118216](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118216)
  [`b2f8064faf92d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b2f8064faf92d) -
  Added new export for verifying MediaFilePreviewError type

## 0.5.2

### Patch Changes

- Updated dependencies

## 0.5.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 0.5.0

### Minor Changes

- [#73279](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73279)
  [`cdad00f21119`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cdad00f21119) -
  Create useMediaImage hook

## 0.4.2

### Patch Changes

- [#71793](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71793)
  [`26115be71855`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/26115be71855) -
  Added support for Error File State

## 0.4.1

### Patch Changes

- [#71409](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71409)
  [`5c76dfba92dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c76dfba92dd) -
  Pass trace context to global scope error

## 0.4.0

### Minor Changes

- [#70446](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70446)
  [`48eae199c6fa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/48eae199c6fa) -
  Breaking: return ref object ssrReliabilityRef is replaced by object ssrReliability

### Patch Changes

- [#70446](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70446)
  [`0ff07ca94009`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0ff07ca94009) -
  Better support for onImageError callback

## 0.3.1

### Patch Changes

- [#70361](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70361)
  [`6bcee8c57dac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6bcee8c57dac) -
  Support for files failed to process

## 0.3.0

### Minor Changes

- [#70034](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70034)
  [`0cf829b2ca1f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0cf829b2ca1f) -
  Breaking: renamed return value from getScriptProps to getSsrScriptProps

## 0.2.1

### Patch Changes

- [#69372](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69372)
  [`d719e8e81e2c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d719e8e81e2c) -
  Fixed status for processed files with no preview

## 0.2.0

### Minor Changes

- [#65817](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65817)
  [`de45ff7a33a9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de45ff7a33a9) -
  Breaking: removed previewDidRender property

## 0.1.0

### Minor Changes

- [#65749](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65749)
  [`cf9674e67f0c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cf9674e67f0c) -
  Breaking: updated prop types
