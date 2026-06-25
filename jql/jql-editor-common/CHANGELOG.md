# @atlaskit/jql-editor-common

## 4.1.0

### Minor Changes

- [`bd45351c2a76b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bd45351c2a76b) -
  Add optional autocomplete groupTitle for grouped suggestions and functionArgument option type for
  JQL function argument autocomplete

### Patch Changes

- [`ee28cf33718b0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee28cf33718b0) -
  Add @atlaskit/react-compiler-gating as a runtime dependency to enable React Compiler platform
  gating.
- Updated dependencies

## 4.0.0

### Major Changes

- [`f2dc9097319f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2dc9097319f0) - ###
  Dropped support for _legacy_ Typescript 4 types. **Typescript 5 is now the new minimum**.

  Removes the `typesVersions` property and `dist/types-ts4.5` directory from the dist.

  Types are now exclusively via the `"types": "dist/types/index.d.ts"` property.

  ```diff
  - "typesVersions": {
  -    ">=4.5 <4.9": {
  -        "*": [
  -            "dist/types-ts4.5/*",
  -            "dist/types-ts4.5/index.d.ts"
  -        ]
  -    }
  - },
  ```

### Patch Changes

- Updated dependencies

## 3.4.0

### Minor Changes

- [`506238c0247fd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/506238c0247fd) -
  PTC-16709: Added changes to show autocomplete for membersOf function to fetch Teams

### Patch Changes

- Updated dependencies

## 3.3.0

### Minor Changes

- [`ebab8f80bfc40`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ebab8f80bfc40) -
  Autofix: add explicit package exports (barrel removal)

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [`2f2e1ff7d48a0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2f2e1ff7d48a0) -
  [ux] Add goal lozenge and use it on JQL editor

## 3.1.1

### Patch Changes

- [`85a5e662048f6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/85a5e662048f6) -
  Enrol jql packages into the React Compiler with platform gating via isReactCompilerActivePlatform

## 3.1.0

### Minor Changes

- [`daf5c2659939b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/daf5c2659939b) -
  [ux] Added Project (Atlas) node to the JQL Editor

## 3.0.2

### Patch Changes

- [`6cf4b64a5d781`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6cf4b64a5d781) -
  Update team JQl to show rich text node (and hydrate)

## 3.0.1

### Patch Changes

- [`92b1368d9607d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/92b1368d9607d) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

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
