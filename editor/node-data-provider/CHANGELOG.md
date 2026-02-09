# @atlaskit/node-data-provider

## 8.3.0

### Minor Changes

- [`506d872ef2503`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/506d872ef2503) -
  Add smartlink response caching to browser storage to reduce layoutshift on transition and page
  load

## 8.2.0

### Minor Changes

- [`c9e2a2b390abf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c9e2a2b390abf) -
  Batch retrieve should batch retrieve block calls in renderer

## 8.1.0

### Minor Changes

- [`cfea9d4edb5f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cfea9d4edb5f0) -
  EDITOR-2849 refactor to use unify cache

### Patch Changes

- Updated dependencies

## 8.0.0

### Patch Changes

- Updated dependencies

## 7.5.2

### Patch Changes

- [`e3779b75fdeca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3779b75fdeca) -
  EDITOR-1643 Promote syncBlock and bodiedSyncBlock to full schema
- Updated dependencies

## 7.5.1

### Patch Changes

- [`a05464ea42678`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a05464ea42678) -
  EDITOR-2791 bump adf-schema
- Updated dependencies

## 7.5.0

### Minor Changes

- [`e3f45edd75547`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3f45edd75547) -
  [https://product-fabric.atlassian.net/browse/ED-29647](ED-29647) - OTP will not use network data
  if preloaded data is unavailable during SSR rendering

## 7.4.0

### Minor Changes

- [`fdba2e94783b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fdba2e94783b7) -
  [https://product-fabric.atlassian.net/browse/ED-29638](ED-29638) - fix editor NodeDataProvider
  network requests deduplication

### Patch Changes

- Updated dependencies

## 7.3.0

### Minor Changes

- [`5319dac3f8740`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5319dac3f8740) -
  Do not re-fetch emoji on a client after successful ssr

### Patch Changes

- Updated dependencies

## 7.2.2

### Patch Changes

- [`21fe79119fe74`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21fe79119fe74) -
  EDITOR-2447 Bump adf-schema to 51.3.2
- Updated dependencies

## 7.2.1

### Patch Changes

- [`c28cd65d12c24`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c28cd65d12c24) -
  EDITOR-2447 Bump adf-schema to 51.3.1
- Updated dependencies

## 7.2.0

### Minor Changes

- [`5167552fe1a93`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5167552fe1a93) -
  [EDITOR-2339] Bump @atlaskit/adf-schema to 51.3.0

### Patch Changes

- Updated dependencies

## 7.1.0

### Minor Changes

- [`be97f10bf8de4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/be97f10bf8de4) -
  [https://product-fabric.atlassian.net/browse/ED-29464](ED-29464) - change findNodesToPrefetch
  algorithm to DFS

### Patch Changes

- Updated dependencies

## 7.0.0

### Patch Changes

- Updated dependencies

## 6.4.0

### Minor Changes

- [`687c1b8fa7801`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/687c1b8fa7801) -
  EDITOR-1566 bump adf-schema + update validator

### Patch Changes

- Updated dependencies

## 6.3.1

### Patch Changes

- [`57fe2d0a5cd09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57fe2d0a5cd09) -
  [https://product-fabric.atlassian.net/browse/ED-29399](ED-29399) - add early exit from
  `prefetchNodeDataProvidersData` if timeout is 0

## 6.3.0

### Minor Changes

- [`b367661ba720e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b367661ba720e) -
  EDITOR-1562 bump adf-schema for afm

### Patch Changes

- Updated dependencies

## 6.2.0

### Minor Changes

- [`42c3b1237eb32`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/42c3b1237eb32) -
  [https://product-fabric.atlassian.net/browse/ED-29263](ED-29263) - export `findNodesToPrefetch`
  function from the @atlaskit/node-data-provider package

### Patch Changes

- Updated dependencies

## 6.1.0

### Minor Changes

- [`64ec65231b4cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/64ec65231b4cf) -
  EDITOR-1568 bump adf-schema for afm

### Patch Changes

- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.6.0

### Minor Changes

- [`5763f85b421a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5763f85b421a2) - -
  The new method `getCacheStatusForNode` is added to `NodeDataProvider` class to get the cache
  status for a given node.
  - The `CardSSR` component will start supporting `hideIconLoadingSkeleton` property for any type of
    smart card.

### Patch Changes

- [`a2cd8c46a3e94`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a2cd8c46a3e94) -
  EDITOR-1442 Bump adf-schema
- Updated dependencies

## 4.5.3

### Patch Changes

- [`0fdcb6f2f96fd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fdcb6f2f96fd) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 4.5.2

### Patch Changes

- [`57b19274b9fdd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57b19274b9fdd) -
  EDITOR-1373 Bump adf-schema version
- Updated dependencies

## 4.5.1

### Patch Changes

- [#195649](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195649)
  [`231bb33e06dfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/231bb33e06dfe) -
  EDITOR-1131 Bump adf-schema version to 50.2.0
- Updated dependencies

## 4.5.0

### Minor Changes

- [#193382](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193382)
  [`5c827a7e9ac42`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5c827a7e9ac42) -
  [https://product-fabric.atlassian.net/browse/ED-28627](ED-28627) - add `duration` and `success` to
  `prefetchNodeDataProvidersData` result

## 4.4.0

### Minor Changes

- [#191942](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191942)
  [`6b5ec599e6dfd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6b5ec599e6dfd) -
  [https://product-fabric.atlassian.net/browse/ED-28596](ED-28596) - extend EditorCardProvider from
  NodeDataProvider

### Patch Changes

- [#191913](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191913)
  [`6d1e56695e91d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d1e56695e91d) -
  EDITOR-1131 Bump adf-schema package to 50.0.0
- Updated dependencies

## 4.3.0

### Minor Changes

- [#191314](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191314)
  [`ff7de5572e25d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ff7de5572e25d) -
  [https://product-fabric.atlassian.net/browse/ED-28587](ED-28587) - implement NodeDataProvider and
  prefetchNodeDataProvidersData for One Tick Provider project

### Patch Changes

- Updated dependencies

## 4.2.0

### Minor Changes

- [#188356](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188356)
  [`5a2110350abd3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5a2110350abd3) -
  [https://product-fabric.atlassian.net/browse/ED-28554](ED-28554) - clean up EmojiNodeDataProvider
  spike

## 4.1.2

### Patch Changes

- [#187144](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187144)
  [`a16147d8fbdfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a16147d8fbdfe) -
  Bump @atlaskit/adf-schema to v49.0.5
- Updated dependencies

## 4.1.1

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [#120472](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120472)
  [`73c800ab5f2fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73c800ab5f2fc) -
  ED-26766 update adf-schema from 47.2.1 to 47.6.0 and adf-schema-json from 1.27.0 to 1.31.0

### Patch Changes

- Updated dependencies

## 4.0.0

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

## 3.1.1

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 3.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0

## 3.0.0

### Major Changes

- [#168498](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168498)
  [`b618d5eba05a9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b618d5eba05a9) -
  Removed private exported type `__doNotUseThisType`. This was only used for docs locally, and was
  not meant to be exported

## 2.1.3

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 2.1.2

### Patch Changes

- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1

## 2.1.1

### Patch Changes

- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1

## 2.1.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18

## 2.0.1

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 2.0.0

### Major Changes

- [#130776](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130776)
  [`78ef8af3a4eb6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/78ef8af3a4eb6) -
  ED-23237 rename to node data provider

### Minor Changes

- [#130350](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130350)
  [`ec22c30b952b8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ec22c30b952b8) -
  [ED-23237] Implement logic to avoid overlapping resolves for the same node, and introduce
  consumption apis.

## 1.2.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`af3041afea66f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/af3041afea66f) -
  ED-23237 iniital nodeview data provider functionality
