# @atlaskit/jql-editor-common

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

## 2.2.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#136871](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136871)
  [`c663f9f8a9171`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c663f9f8a9171) -
  Add support for React 18

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.0.0

### Major Changes

- [#39978](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39978)
  [`978cfcda881`](https://bitbucket.org/atlassian/atlassian-frontend/commits/978cfcda881) - Migrate
  `jql-editor-common` package to the `@atlaskit` namespace. Any consumers should update their
  imports to `@atlaskit/jql-editor-common`.

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- [#38896](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38896)
  [`ef15cb77a2a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef15cb77a2a) - Migrate
  `jql-autocomplete` package to the `@atlaskit` namespace. Any consumers should update their imports
  to `@atlaskit/jql-autocomplete`.
- Updated dependencies

## 1.0.2

### Patch Changes

- [#37802](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37802)
  [`6081642ebe0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6081642ebe0) - Allow
  Forge/Connect JQL functions to correctly autocomplete for single value and list operators.

## 1.0.1

[![Labs version](https://img.shields.io/badge/labs-1.0.0-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-editor-common)

### Patch Changes

- [#36600](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36600)
  [`f04004ec277`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f04004ec277) - Extract
  common JQL editor types, constants and utilities to separate package.
