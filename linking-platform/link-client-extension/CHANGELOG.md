# @atlaskit/link-client-extension

## 1.7.1

### Patch Changes

- [`2cd7af71b63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cd7af71b63) - Bump json-ld-types 3.8.0 -> 3.9.1

## 1.7.0

### Minor Changes

- [`8b8a309cb62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b8a309cb62) - Added a `DEFAULT_GET_DATA_PAGE_SIZE` constant for default page size on data calls.

### Patch Changes

- Updated dependencies

## 1.6.1

### Patch Changes

- [`a21cffb7b23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a21cffb7b23) - Extended mock response returned for datasources

## 1.6.0

### Minor Changes

- [`5bc0af1de85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bc0af1de85) - Introduce caching layer for both `getDatasourceDetails` and `getDatasourceData` calls. Export new member - `mockDatasourceDetailsResponse` that has same value as previously exported `mockDatasourceResponse`
- [`b3b6782c3a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3b6782c3a0) - Add new member `mockDatasourceDetailsResponse` that has same value as existing `mockDatasourceResponse`; Add third optional boolean argument to `getDatasourceDetails` and `getDatasourceData` from `useDatasourceClientExtension` hook called `force` — when it is false (Default) cached version of response promise will be returned (in case request with same parameters has been made), when true new request will be made regardless of cache state.

## 1.5.4

### Patch Changes

- [`e74ae7f06d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e74ae7f06d4) - Update dependency json-ld-types@3.8.0

## 1.5.3

### Patch Changes

- [`b9355830504`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9355830504) - Opt out of peer dependency enforcement

## 1.5.2

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- [`3fb20c4aeba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb20c4aeba) - Add postinstall check to enforce internal peer dependencies

## 1.5.0

### Minor Changes

- [`12411d70076`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12411d70076) - export more datasource types in the linking-type index and remove the defaultProperties in the datasourceDataResponse

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [`04295e9d5bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04295e9d5bc) - [ux] Updating ORS response to include datasources and facilitating pasting JQL links turning into datasource tables

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [`f427908df3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f427908df3d) - change the datasource response type to include the meta data section and the data response will wrap in the data section

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

- [`b508cc26473`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b508cc26473) - Updated getDatasourceDetails request body to be `DatasourceDetailsRequest` type

## 1.1.7

### Patch Changes

- [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies
- Updated dependencies

## 1.1.6

### Patch Changes

- Updated dependencies

## 1.1.5

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- [`43ad059dcc5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43ad059dcc5) - Updated mock response to the new `DatasourceDataResponseItem` format
- Updated dependencies

## 1.1.3

### Patch Changes

- [`e9ad7ee17bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9ad7ee17bb) - Updated mock response to the new `DatasourceType` value format
- Updated dependencies

## 1.1.2

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8
- Updated dependencies

## 1.1.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`
- Updated dependencies

## 1.1.0

### Minor Changes

- [`670454dc4a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/670454dc4a0) - Add totalIssues to mock/types

### Patch Changes

- Updated dependencies

## 1.0.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- [`5f0b51cb0e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f0b51cb0e9) - Updated `useDatasourceClientExtension` hook to use `useSmartLinkContext` for creating smart-card client

### Patch Changes

- Updated dependencies

## 0.4.3

### Patch Changes

- [`f1b712482b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f1b712482b1) - Fixed error handling inside of invoke function
- Updated dependencies

## 0.4.2

### Patch Changes

- Updated dependencies

## 0.4.1

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 0.4.0

### Minor Changes

- [`d19a6e77d60`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d19a6e77d60) - Adds new hook useDatasourceClientExtension to fetch data for link datasources

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [`7297fb71759`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7297fb71759) - Update response type for useSmartLinkClientExtension

## 0.2.0

### Minor Changes

- [`f32cef73d0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f32cef73d0f) - use new types from smart link types

### Patch Changes

- Updated dependencies
