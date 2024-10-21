# @atlaskit/skeleton

## 0.5.3

### Patch Changes

- Updated dependencies

## 0.5.2

### Patch Changes

- [#142024](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142024)
  [`a25bee9de4d3c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a25bee9de4d3c) -
  Support to override color and shimmering color in keyframes

## 0.5.1

### Patch Changes

- [#129411](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129411)
  [`300b0a472d9ce`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/300b0a472d9ce) -
  Removes deprecated usage of ak/theme mixin functions and replaces them with their direct outputs
- Updated dependencies

## 0.5.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [#110836](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110836)
  [`a8bd419fd70b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a8bd419fd70b9) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 0.3.0

### Minor Changes

- [#94408](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94408)
  [`12457b76f836`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/12457b76f836) -
  Add support for React 18 in non-strict mode.

## 0.2.4

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 0.2.3

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 0.2.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 0.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 0.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 0.1.0

### Minor Changes

- [#28534](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28534)
  [`bc3550c9773`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc3550c9773) - Added
  new Skeleton component for displaying a placeholder whilst loading.
