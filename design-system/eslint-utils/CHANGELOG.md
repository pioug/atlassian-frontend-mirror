# @atlaskit/eslint-utils

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

## 1.10.0

### Minor Changes

- [#113173](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113173)
  [`46aad36c62f2f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/46aad36c62f2f) -
  Cuts a new changeset to land ESLint v9 changes to NPM fully (shipped internally Feb 5th:
  https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/109855)

## 1.9.1

### Patch Changes

- [#112918](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112918)
  [`1815ac282f76e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1815ac282f76e) -
  Added utils to allow forward compatibility with ESLint v9 and backwards comaptibility with ESLint
  v8 for context/sourceCode API changes

## 1.9.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

## 1.8.1

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 1.8.0

### Minor Changes

- [#182142](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/182142)
  [`214a8d94f1757`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/214a8d94f1757) -
  add new isAtlaskitCSS function for determinning supported imports

## 1.7.1

### Patch Changes

- [#150749](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150749)
  [`5cc7799e532da`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5cc7799e532da) -
  Added @types/eslint-scope as dev dependency

## 1.7.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

## 1.6.3

### Patch Changes

- [#128926](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128926)
  [`5df26d24db3c7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5df26d24db3c7) -
  Modify types to allow for complete removal of a rule from a preset configuration. Modify export
  lookups to handle an endless recursion scenario.

## 1.6.2

### Patch Changes

- [#110284](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110284)
  [`34021a2db424f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/34021a2db424f) -
  Internal refactoring to improve backwards compatibility with ESLint versions lower than 8

## 1.6.1

### Patch Changes

- [#110975](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110975)
  [`47a912f14bb6f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/47a912f14bb6f) -
  Fixed a bug in `walkStyleProperties` that could result in `styled(BaseComponent)({})` styles to
  not be linted.

## 1.6.0

### Minor Changes

- [#109195](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109195)
  [`8a1d9c31e3ea5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8a1d9c31e3ea5) -
  Add support for React 18 in non-strict mode.

## 1.5.0

### Minor Changes

- [#100969](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100969)
  [`0add7464f510`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0add7464f510) -
  Added `walkStyleProperties` util to `/walk-style-properties` entrypoint.

## 1.4.0

### Minor Changes

- [#99639](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99639)
  [`d00798e9a2a9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d00798e9a2a9) -
  Added `importSources` shared schema definition to new `/schema` entrypoint.

## 1.3.2

### Patch Changes

- [#93427](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93427)
  [`a696371675b4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a696371675b4) -
  Fix a bug in `hasStyleObjectArguments` that was causing it to ignore `styled` expressions of the
  form `styled(BaseComponent)({ ... })`

## 1.3.1

### Patch Changes

- [#92963](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92963)
  [`1bb8557fb0b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1bb8557fb0b6) -
  Added no-exported-styles eslint rule to disallow exports of css, cssMap, keyframes, styled and
  xcss styling

## 1.3.0

### Minor Changes

- [#87213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87213)
  [`466850a02a17`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/466850a02a17) -
  Introduced the following entrypoints:

  - `allowed-function-calls`
  - `find-identifier-node`
  - `find-variable`

## 1.2.0

### Minor Changes

- [#91840](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91840)
  [`8f3a2e3995aa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f3a2e3995aa) -
  Add `hasStyleObjectArguments` util to `is-supported-import` entrypoint. This util simplifies
  checking if a `CallExpression` should have style declaration linting applied to its arguments.

## 1.1.0

### Minor Changes

- [#87476](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87476)
  [`defa5a6cb0de`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/defa5a6cb0de) -
  Add `getCreateLintRule` and other types/utils for creating lint rules

## 1.0.0

### Major Changes

- [#86638](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86638)
  [`3f6379a57fae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f6379a57fae) -
  Initial release
