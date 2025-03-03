# @atlaskit/quiz-widget

## 3.0.1

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 3.0.0

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

## 2.3.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 2.2.9

### Patch Changes

- Updated dependencies

## 2.2.8

### Patch Changes

- Updated dependencies

## 2.2.7

### Patch Changes

- [#181817](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/181817)
  [`c75a0ced77056`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c75a0ced77056) -
  Internal changes to typography.

## 2.2.6

### Patch Changes

- [#178053](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178053)
  [`cb318c8c28c26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb318c8c28c26) -
  Internal changes to typography.

## 2.2.5

### Patch Changes

- Updated dependencies

## 2.2.4

### Patch Changes

- Updated dependencies

## 2.2.3

### Patch Changes

- Updated dependencies

## 2.2.2

### Patch Changes

- Updated dependencies

## 2.2.1

### Patch Changes

- [#144706](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144706)
  [`8b74177bff7a7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b74177bff7a7) -
  Updated to React 18

## 2.2.0

### Minor Changes

- [#144303](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144303)
  [`de9cfac4c3629`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de9cfac4c3629) -
  [ux] Enable new icons behind a feature flag.

## 2.1.13

### Patch Changes

- Updated dependencies

## 2.1.12

### Patch Changes

- Updated dependencies

## 2.1.11

### Patch Changes

- Updated dependencies

## 2.1.10

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component

## 2.1.9

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.1.8

### Patch Changes

- [#80509](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80509)
  [`fcf7481f594f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fcf7481f594f) -
  Upgrade dependency of `@emotion/styled` to version 11

## 2.1.7

### Patch Changes

- [#61323](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61323)
  [`e9e3532437e8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e9e3532437e8) -
  Converted spacing values to corresponding space tokens

## 2.1.6

### Patch Changes

- Updated dependencies

## 2.1.5

### Patch Changes

- Updated dependencies

## 2.1.4

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 2.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 2.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 2.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 2.0.6

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 2.0.5

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 2.0.4

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 2.0.1

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 2.0.0

### Major Changes

- [#5392](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5392)
  [`8298fd2ed1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8298fd2ed1) - Create new
  react element for passing quizzes
