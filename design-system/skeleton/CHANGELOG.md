# @atlaskit/skeleton

## 2.1.4

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- [`f0662cd7a143e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0662cd7a143e) -
  Internal changes to how borders are applied.
- Updated dependencies

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#192775](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192775)
  [`3774afb555e41`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3774afb555e41) -
  Reduces the default `borderRadius` from `100px` to `4px`.

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.

## 2.0.1

### Patch Changes

- [#124565](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124565)
  [`7e97766ff3529`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7e97766ff3529) -
  Update dependencies.

## 2.0.0

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

## 1.2.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

## 1.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 1.0.0

### Major Changes

- [#164612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/164612)
  [`8bac6a32c3cbf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8bac6a32c3cbf) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/skeleton`, you will need to ensure that
  your bundler is configured to handle `.css` imports correctly. Most bundlers come with built-in
  support for `.css` imports, so you may not need to do anything. If you are using a different
  bundler, please refer to the documentation for that bundler to understand how to handle `.css`
  imports.

  For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

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
