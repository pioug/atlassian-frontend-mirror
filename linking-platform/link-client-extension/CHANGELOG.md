# @atlaskit/link-client-extension

## 5.0.3

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- [#132126](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132126)
  [`5d45dce9796da`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d45dce9796da) -
  Updated dependency json-ld-types to @atlaskit/json-ld-types
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

## 3.1.2

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#168956](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168956)
  [`311ab96847a83`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/311ab96847a83) -
  Remove related link urls experiment

## 2.4.2

### Patch Changes

- Updated dependencies

## 2.4.1

### Patch Changes

- [#151132](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151132)
  [`3da1333fcf30d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3da1333fcf30d) -
  Adds the 'origin-timezone' header to all cached requests by removing feature flag
  platform.linking-platform.datasource.add-timezone-header

## 2.4.0

### Minor Changes

- [#141472](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141472)
  [`fa7d87963ed8a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fa7d87963ed8a) -
  Export new mock `mockDatasourceDataNoActionsResponse` for DS without actions

## 2.3.0

### Minor Changes

- [#134332](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134332)
  [`ba2a672c564ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ba2a672c564ec) -
  Expose new method removeDataCacheWithAri to clear cache conditionally

## 2.2.0

### Minor Changes

- [#130811](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130811)
  [`3e95e200fd9e8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3e95e200fd9e8) -
  Exports `mockActionsDiscoveryResponse` for testing

## 2.1.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [#128149](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128149)
  [`a57b769f35fdc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a57b769f35fdc) -
  Adds `entityType` to `ActionsDiscoveryRequest`

### Patch Changes

- Updated dependencies

## 1.13.0

### Minor Changes

- [#127351](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127351)
  [`e87b54903058e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e87b54903058e) -
  Add React 18 compatability

### Patch Changes

- Updated dependencies

## 1.12.0

### Minor Changes

- [#127170](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127170)
  [`48d23d3dfb9a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/48d23d3dfb9a1) -
  Exposes a new `mockActionsDiscoveryEmptyResponse` mock for datasource action discovery

## 1.11.0

### Minor Changes

- [#122437](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122437)
  [`a5e13bc24add8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a5e13bc24add8) -
  Adds the executeAtomicAction function to forward a request to actions service and execute it in
  useDatasourceClientExtension

## 1.10.0

### Minor Changes

- [#123151](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123151)
  [`15b8082f63c21`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15b8082f63c21) -
  Adds the getDatasourceActionsAndPermissions function to fetch actions and permissions in
  useDatasourceClientExtension

### Patch Changes

- Updated dependencies

## 1.9.2

### Patch Changes

- Updated dependencies

## 1.9.1

### Patch Changes

- Updated dependencies

## 1.9.0

### Minor Changes

- [#109647](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109647)
  [`17d330a232539`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/17d330a232539) -
  The changes here adds a "origin-timezone" header to datasource /data and /details requests.

## 1.8.4

### Patch Changes

- [#86596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86596)
  [`37621cb1f1b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/37621cb1f1b9) -
  Update dependency json-ld-types

## 1.8.3

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.8.2

### Patch Changes

- [#68194](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68194)
  [`c1d4a8fecc4e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1d4a8fecc4e) -
  bump json-ld-types to version 3.11.0

## 1.8.1

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#42199](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42199)
  [`896e6300360`](https://bitbucket.org/atlassian/atlassian-frontend/commits/896e6300360) - Add api
  to make GET request to related-urls endpoint

## 1.7.3

### Patch Changes

- [#41377](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41377)
  [`6191c789222`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6191c789222) - Fix bug
  where on next page load sorts the column in alphabetical order.

## 1.7.2

### Patch Changes

- [#40491](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40491)
  [`1fedffbd64b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fedffbd64b) - Update
  json-ld-types dependencies to be compatible with version

## 1.7.1

### Patch Changes

- [#40127](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40127)
  [`2cd7af71b63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cd7af71b63) - Bump
  json-ld-types 3.8.0 -> 3.9.1

## 1.7.0

### Minor Changes

- [#39265](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39265)
  [`8b8a309cb62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b8a309cb62) - Added a
  `DEFAULT_GET_DATA_PAGE_SIZE` constant for default page size on data calls.

### Patch Changes

- Updated dependencies

## 1.6.1

### Patch Changes

- [#39465](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39465)
  [`a21cffb7b23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a21cffb7b23) - Extended
  mock response returned for datasources

## 1.6.0

### Minor Changes

- [#38189](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38189)
  [`5bc0af1de85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bc0af1de85) -
  Introduce caching layer for both `getDatasourceDetails` and `getDatasourceData` calls. Export new
  member - `mockDatasourceDetailsResponse` that has same value as previously exported
  `mockDatasourceResponse`
- [`b3b6782c3a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3b6782c3a0) - Add new
  member `mockDatasourceDetailsResponse` that has same value as existing `mockDatasourceResponse`;
  Add third optional boolean argument to `getDatasourceDetails` and `getDatasourceData` from
  `useDatasourceClientExtension` hook called `force` — when it is false (Default) cached version of
  response promise will be returned (in case request with same parameters has been made), when true
  new request will be made regardless of cache state.

## 1.5.4

### Patch Changes

- [#37720](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37720)
  [`e74ae7f06d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e74ae7f06d4) - Update
  dependency json-ld-types@3.8.0

## 1.5.3

### Patch Changes

- [#37340](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37340)
  [`b9355830504`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9355830504) - Opt out
  of peer dependency enforcement

## 1.5.2

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- [#36757](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36757)
  [`3fb20c4aeba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb20c4aeba) - Add
  postinstall check to enforce internal peer dependencies

## 1.5.0

### Minor Changes

- [#36138](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36138)
  [`12411d70076`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12411d70076) - export
  more datasource types in the linking-type index and remove the defaultProperties in the
  datasourceDataResponse

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#35032](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35032)
  [`04295e9d5bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04295e9d5bc) - [ux]
  Updating ORS response to include datasources and facilitating pasting JQL links turning into
  datasource tables

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#35861](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35861)
  [`f427908df3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f427908df3d) - change
  the datasource response type to include the meta data section and the data response will wrap in
  the data section

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#34180](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34180)
  [`b508cc26473`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b508cc26473) - Updated
  getDatasourceDetails request body to be `DatasourceDetailsRequest` type

## 1.1.7

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies
- Updated dependencies

## 1.1.6

### Patch Changes

- Updated dependencies

## 1.1.5

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- [#34035](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34035)
  [`43ad059dcc5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43ad059dcc5) - Updated
  mock response to the new `DatasourceDataResponseItem` format
- Updated dependencies

## 1.1.3

### Patch Changes

- [#33917](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33917)
  [`e9ad7ee17bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9ad7ee17bb) - Updated
  mock response to the new `DatasourceType` value format
- Updated dependencies

## 1.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8
- Updated dependencies

## 1.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`
- Updated dependencies

## 1.1.0

### Minor Changes

- [#33177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33177)
  [`670454dc4a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/670454dc4a0) - Add
  totalIssues to mock/types

### Patch Changes

- Updated dependencies

## 1.0.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- [#32751](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32751)
  [`5f0b51cb0e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f0b51cb0e9) - Updated
  `useDatasourceClientExtension` hook to use `useSmartLinkContext` for creating smart-card client

### Patch Changes

- Updated dependencies

## 0.4.3

### Patch Changes

- [#32589](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32589)
  [`f1b712482b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f1b712482b1) - Fixed
  error handling inside of invoke function
- Updated dependencies

## 0.4.2

### Patch Changes

- Updated dependencies

## 0.4.1

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 0.4.0

### Minor Changes

- [#32368](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32368)
  [`d19a6e77d60`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d19a6e77d60) - Adds new
  hook useDatasourceClientExtension to fetch data for link datasources

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [#31900](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31900)
  [`7297fb71759`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7297fb71759) - Update
  response type for useSmartLinkClientExtension

## 0.2.0

### Minor Changes

- [#31905](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31905)
  [`f32cef73d0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f32cef73d0f) - use new
  types from smart link types

### Patch Changes

- Updated dependencies
