# @atlaskit/media-client-react

## 2.0.3

### Patch Changes

-   Updated dependencies

## 2.0.2

### Patch Changes

-   [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
    [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
    Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.0.1

### Patch Changes

-   Updated dependencies

## 2.0.0

### Major Changes

-   [#57027](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57027)
    [`9412be3e0467`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9412be3e0467) -
    breaking change: MockedMediaClientProvider now accepts an instance of Media Store as prop
    instead of a store initializer

### Patch Changes

-   [#57027](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57027)
    [`4659c1089fe6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4659c1089fe6) -
    useFileState hook skips backend subscription if there is already a file state in the Media Store

## 1.4.0

### Minor Changes

-   [#43014](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43014)
    [`f021d31543e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f021d31543e) - create
    useFileState hook versions of header and itemviewer, create list-v2, refactor
    MediaFileStateError to media-client-react

## 1.3.1

### Patch Changes

-   Updated dependencies

## 1.3.0

### Minor Changes

-   [#41932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41932)
    [`756dd90f1a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/756dd90f1a3) - 1.
    Deprecate withMediaClient HOC in media-client and migrated it to media-client-react 2. clean up
    deprecated imports from media-client

## 1.2.0

### Minor Changes

-   [#41643](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41643)
    [`6eb37f85acb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb37f85acb) -
    Utility MockedMediaClientProvider for testing. Import through entrypoint /test-helpers

## 1.1.0

### Minor Changes

-   [#41439](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41439)
    [`74843593765`](https://bitbucket.org/atlassian/atlassian-frontend/commits/74843593765) - add
    optional skipRemote option to useFileState hook

## 1.0.1

### Patch Changes

-   [#40717](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40717)
    [`ff2ad188bb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff2ad188bb2) -
    Context Provider handles undefined config property
