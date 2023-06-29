# @atlaskit/link-datasource

## 0.25.1

### Patch Changes

- [`64bdd3a389b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64bdd3a389b) - Style changes and translation updates. Also remove IntlProvider from prode code.

## 0.25.0

### Minor Changes

- [`f427908df3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f427908df3d) - change the datasource response type to include the meta data section and the data response will wrap in the data section

### Patch Changes

- Updated dependencies

## 0.24.4

### Patch Changes

- [`b75c571b91b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b75c571b91b) - Fix up problem where we don't set react's "key" for list of content we show in each cell (like tags)
- Updated dependencies

## 0.24.3

### Patch Changes

- Updated dependencies

## 0.24.2

### Patch Changes

- Updated dependencies

## 0.24.1

### Patch Changes

- [`2d2b6b23bec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d2b6b23bec) - Updated dependencies

## 0.24.0

### Minor Changes

- [`108aa0ad121`](https://bitbucket.org/atlassian/atlassian-frontend/commits/108aa0ad121) - [ux] Fix some table bugs such as inconsistency between issue count for modal/table and fix case where user can deselect all fields in the column picker

## 0.23.0

### Minor Changes

- [`62465d6399f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62465d6399f) - [ux] Adding loading spinner to search button and fixed initial search loading state in table

## 0.22.0

### Minor Changes

- [`d0680816ada`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0680816ada) - [ux] Added empty and error states to jira modal and datasourceTable

## 0.21.2

### Patch Changes

- [`105f0c7291b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/105f0c7291b) - [ux] Various bug fixes to jira issue modal
- Updated dependencies

## 0.21.1

### Patch Changes

- Updated dependencies

## 0.21.0

### Minor Changes

- [`0b68480a270`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b68480a270) - Update logic to call `/details` only when full schema is required and added field list, includeSchema flag to `/data` call

### Patch Changes

- Updated dependencies

## 0.20.0

### Minor Changes

- [`0407e628d5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0407e628d5b) - [ux] Fix some table bugs

## 0.19.1

### Patch Changes

- [`f5d34a140ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5d34a140ad) - Move both exported components to be behind lazy loading

## 0.19.0

### Minor Changes

- [`5ffc8529049`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ffc8529049) - - Export `DatasourceAdf`, `DatasourceAdfView`, `DatasourceAdfTableView`
  - Modify DatasourceAdf table view type

### Patch Changes

- Updated dependencies

## 0.18.1

### Patch Changes

- [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 0.18.0

### Minor Changes

- [`8ddcd8088a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ddcd8088a9) - - Removing `onUpdateParameters` and `onVisibleColumnKeysChange` props from JiraIssuesConfigModal
  - make datasourceAdf type option of onInsert callback more jira concrete (JiraIssuesDatasourceAdf)
  - Export `JiraIssuesDatasourceAdf` type

## 0.17.6

### Patch Changes

- Updated dependencies

## 0.17.5

### Patch Changes

- [`d417c0728a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d417c0728a8) - Added logic to show selected options at the top of the column picker

## 0.17.4

### Patch Changes

- Updated dependencies

## 0.17.3

### Patch Changes

- Updated dependencies

## 0.17.2

### Patch Changes

- [`b23bb695309`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b23bb695309) - Remove hard-coded column from modal

## 0.17.1

### Patch Changes

- [`4c56014f328`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c56014f328) - Updated components to use the new `DatasourceDataResponseItem` format
- Updated dependencies

## 0.17.0

### Minor Changes

- [`85866be02b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85866be02b9) - Add new exported member `JIRA_LIST_OF_LINKS_DATASOURCE_ID`; Also fix bug where next cursor is not reset when new search query starts and fix up format of the body that we send to /details endpoint

## 0.16.1

### Patch Changes

- [`d9be88498a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9be88498a8) - Updated components to use the new `DatasourceType` value format
- Updated dependencies

## 0.16.0

### Minor Changes

- [`a68bac355b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a68bac355b0) - Renaming `JiraIssuesTableView` into `DatasourceTableView` and changing its `parameters` property to be an `object`

## 0.15.1

### Patch Changes

- [`3d4e152483b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d4e152483b) - Move all the mocking outside into link-test-helpers and use it.

## 0.15.0

### Minor Changes

- [`9b52f1c40fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b52f1c40fa) - Added a default column width to specific fields and types

## 0.14.4

### Patch Changes

- [`e63f4d2d305`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e63f4d2d305) - Changed the package scope to public @atlaskit and made `onVisibleColumnKeysChange` optional to allow read only tables.

## 0.14.3

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8
- Updated dependencies

## 0.14.2

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`
- Updated dependencies

## 0.14.1

### Patch Changes

- [`07020547a93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07020547a93) - Safe direct migraiton to design token API. This change is not visible for those who aren't using design tokens
- Updated dependencies

## 0.14.0

### Minor Changes

- [`5968b8a8210`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5968b8a8210) - [ux] added view mode toggle to config modal

## 0.13.3

### Patch Changes

- Updated dependencies

## 0.13.2

### Patch Changes

- [`1540a29f7f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1540a29f7f4) - [ux] change logic in footer to show total issues fetched and not current number of issues in table
- Updated dependencies

## 0.13.1

### Patch Changes

- [`aa7eb05066d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa7eb05066d) - Internal dependency of `@atlaskit/drag-and-drop*` has been renamed to `@atlaskit/pragmatic-drag-and-drop*`
- Updated dependencies

## 0.13.0

### Minor Changes

- [`cd179e6f433`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd179e6f433) - Added logic to render as `SmartCard` when result has only one row

## 0.12.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 0.11.0

### Minor Changes

- [`ab383434b1c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab383434b1c) - Ability to generate Datasource ADF on insertion

### Patch Changes

- Updated dependencies

## 0.10.1

### Patch Changes

- Updated dependencies

## 0.10.0

### Minor Changes

- [`1a044d5345a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a044d5345a) - [ux] Adds issue count and refresh button component

## 0.9.1

### Patch Changes

- [`a003bc719cb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a003bc719cb) - Refactoring mode-switcher

## 0.9.0

### Minor Changes

- [`5abf8a31abb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5abf8a31abb) - Refactor IssueLikeTable. Move it's state outside into hook useDatasourceTableState

### Patch Changes

- Updated dependencies

## 0.8.0

### Minor Changes

- [`afd7233d088`](https://bitbucket.org/atlassian/atlassian-frontend/commits/afd7233d088) - [ux] added basic search and search mode toggle

## 0.7.1

### Patch Changes

- [`0624df1ffe1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0624df1ffe1) - Bump json-ld-types dependency
- Updated dependencies

## 0.7.0

### Minor Changes

- [`428c7270422`](https://bitbucket.org/atlassian/atlassian-frontend/commits/428c7270422) - Updated `Date` render type to `DateTime` render type to support date, time and datetime

### Patch Changes

- Updated dependencies

## 0.6.0

### Minor Changes

- [`127d16e0933`](https://bitbucket.org/atlassian/atlassian-frontend/commits/127d16e0933) - Add generic render type components for each data source types

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- [`52a64257016`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52a64257016) - [ux] added jql editor input to config modal

## 0.4.3

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 0.4.2

### Patch Changes

- Updated dependencies

## 0.4.1

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [`9a83e52fd54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a83e52fd54) - added jira site selector to list of links config modal

## 0.3.4

### Patch Changes

- [`a66fd9d6f9d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a66fd9d6f9d) - Introduce column picker into issue like table component

## 0.3.3

### Patch Changes

- Updated dependencies

## 0.3.2

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [`c6017ad803e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6017ad803e) - [ux] add empty table state for datasources

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- [`e066b00c060`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e066b00c060) - Add ability to drag and drop columns to reorder them to `IssueLikeDataTableView`

## 0.2.0

### Minor Changes

- [`82ce247716c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/82ce247716c) - Adds a new link datasource component `JiraIssuesTableView` (still under development) is added

### Patch Changes

- Updated dependencies
