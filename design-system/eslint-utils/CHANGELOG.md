# @atlaskit/eslint-utils

## 1.4.0

### Minor Changes

-   [#99639](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99639)
    [`d00798e9a2a9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d00798e9a2a9) -
    Added `importSources` shared schema definition to new `/schema` entrypoint.

## 1.3.2

### Patch Changes

-   [#93427](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93427)
    [`a696371675b4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a696371675b4) -
    Fix a bug in `hasStyleObjectArguments` that was causing it to ignore `styled` expressions of the
    form `styled(BaseComponent)({ ... })`

## 1.3.1

### Patch Changes

-   [#92963](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92963)
    [`1bb8557fb0b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1bb8557fb0b6) -
    Added no-exported-styles eslint rule to disallow exports of css, cssMap, keyframes, styled and
    xcss styling

## 1.3.0

### Minor Changes

-   [#87213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87213)
    [`466850a02a17`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/466850a02a17) -
    Introduced the following entrypoints:

    -   `allowed-function-calls`
    -   `find-identifier-node`
    -   `find-variable`

## 1.2.0

### Minor Changes

-   [#91840](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91840)
    [`8f3a2e3995aa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f3a2e3995aa) -
    Add `hasStyleObjectArguments` util to `is-supported-import` entrypoint. This util simplifies
    checking if a `CallExpression` should have style declaration linting applied to its arguments.

## 1.1.0

### Minor Changes

-   [#87476](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87476)
    [`defa5a6cb0de`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/defa5a6cb0de) -
    Add `getCreateLintRule` and other types/utils for creating lint rules

## 1.0.0

### Major Changes

-   [#86638](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86638)
    [`3f6379a57fae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f6379a57fae) -
    Initial release
