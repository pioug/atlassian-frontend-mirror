# @atlaskit/link-client-extension

## 1.8.4

### Patch Changes

- [#86596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86596) [`37621cb1f1b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/37621cb1f1b9) - Update dependency json-ld-types

## 1.8.3

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116) [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) - Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.8.2

### Patch Changes

- [#68194](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68194) [`c1d4a8fecc4e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1d4a8fecc4e) - bump json-ld-types to version 3.11.0

## 1.8.1

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#42199](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42199) [`896e6300360`](https://bitbucket.org/atlassian/atlassian-frontend/commits/896e6300360) - Add api to make GET request to related-urls endpoint

## 1.7.3

### Patch Changes

- [#41377](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41377) [`6191c789222`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6191c789222) - Fix bug where on next page load sorts the column in alphabetical order.

## 1.7.2

### Patch Changes

- [#40491](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40491) [`1fedffbd64b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fedffbd64b) - Update json-ld-types dependencies to be compatible with version

## 1.7.1

### Patch Changes

- [#40127](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40127) [`2cd7af71b63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cd7af71b63) - Bump json-ld-types 3.8.0 -> 3.9.1

## 1.7.0

### Minor Changes

- [#39265](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39265) [`8b8a309cb62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b8a309cb62) - Added a `DEFAULT_GET_DATA_PAGE_SIZE` constant for default page size on data calls.

### Patch Changes

- Updated dependencies

## 1.6.1

### Patch Changes

- [#39465](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39465) [`a21cffb7b23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a21cffb7b23) - Extended mock response returned for datasources

## 1.6.0

### Minor Changes

- [#38189](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38189) [`5bc0af1de85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bc0af1de85) - Introduce caching layer for both `getDatasourceDetails` and `getDatasourceData` calls. Export new member - `mockDatasourceDetailsResponse` that has same value as previously exported `mockDatasourceResponse`
- [`b3b6782c3a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3b6782c3a0) - Add new member `mockDatasourceDetailsResponse` that has same value as existing `mockDatasourceResponse`; Add third optional boolean argument to `getDatasourceDetails` and `getDatasourceData` from `useDatasourceClientExtension` hook called `force` — when it is false (Default) cached version of response promise will be returned (in case request with same parameters has been made), when true new request will be made regardless of cache state.

## 1.5.4

### Patch Changes

- [#37720](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37720) [`e74ae7f06d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e74ae7f06d4) - Update dependency json-ld-types@3.8.0

## 1.5.3

### Patch Changes

- [#37340](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37340) [`b9355830504`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9355830504) - Opt out of peer dependency enforcement

## 1.5.2

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- [#36757](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36757) [`3fb20c4aeba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb20c4aeba) - Add postinstall check to enforce internal peer dependencies

## 1.5.0

### Minor Changes

- [#36138](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36138) [`12411d70076`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12411d70076) - export more datasource types in the linking-type index and remove the defaultProperties in the datasourceDataResponse

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#35032](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35032) [`04295e9d5bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04295e9d5bc) - [ux] Updating ORS response to include datasources and facilitating pasting JQL links turning into datasource tables

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#35861](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35861) [`f427908df3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f427908df3d) - change the datasource response type to include the meta data section and the data response will wrap in the data section

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

- [#34180](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34180) [`b508cc26473`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b508cc26473) - Updated getDatasourceDetails request body to be `DatasourceDetailsRequest` type

## 1.1.7

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443) [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies
- Updated dependencies

## 1.1.6

### Patch Changes

- Updated dependencies

## 1.1.5

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- [#34035](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34035) [`43ad059dcc5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43ad059dcc5) - Updated mock response to the new `DatasourceDataResponseItem` format
- Updated dependencies

## 1.1.3

### Patch Changes

- [#33917](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33917) [`e9ad7ee17bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9ad7ee17bb) - Updated mock response to the new `DatasourceType` value format
- Updated dependencies

## 1.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8
- Updated dependencies

## 1.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`
- Updated dependencies

## 1.1.0

### Minor Changes

- [#33177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33177) [`670454dc4a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/670454dc4a0) - Add totalIssues to mock/types

### Patch Changes

- Updated dependencies

## 1.0.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- [#32751](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32751) [`5f0b51cb0e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f0b51cb0e9) - Updated `useDatasourceClientExtension` hook to use `useSmartLinkContext` for creating smart-card client

### Patch Changes

- Updated dependencies

## 0.4.3

### Patch Changes

- [#32589](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32589) [`f1b712482b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f1b712482b1) - Fixed error handling inside of invoke function
- Updated dependencies

## 0.4.2

### Patch Changes

- Updated dependencies

## 0.4.1

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424) [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 0.4.0

### Minor Changes

- [#32368](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32368) [`d19a6e77d60`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d19a6e77d60) - Adds new hook useDatasourceClientExtension to fetch data for link datasources

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [#31900](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31900) [`7297fb71759`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7297fb71759) - Update response type for useSmartLinkClientExtension

## 0.2.0

### Minor Changes

- [#31905](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31905) [`f32cef73d0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f32cef73d0f) - use new types from smart link types

### Patch Changes

- Updated dependencies
