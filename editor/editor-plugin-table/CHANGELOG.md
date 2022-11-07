# @atlaskit/editor-plugin-table

## 0.1.0

### Minor Changes

- [`90c44a68da2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/90c44a68da2) - Removed editor-core table plugin and replaced with new `editor-plugin-table` package. This change required adding copying new table changes from editor-core to the new table package, moving IconTable to shared package, and creating new entry-points from editor-plugin-table. `getPluginState` from `packages/editor/editor-plugin-table/src/plugins/table/pm-plugins/table-resizing` was also exported.

  [ED-15674][ed15739] [ED-15633]

- [`1e1ac6d1d15`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e1ac6d1d15) - [ED-15501] Removal of coupled table-resizing code in `editor-core` media and card plugin. This makes entry-point `/table-resizing` from `editor-plugin-table` unused so removed the entry-point.

### Patch Changes

- [`29d7f84c649`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29d7f84c649) - Removed styled-components peerDependency
- [`30e8425f7d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30e8425f7d6) - [ux] ED-15706 Reenable copy button on editor-plugin-table. Added property copyButton to floatingToolbarConfig.
- [`e9168851af4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9168851af4) - This changes addresses a bug that occurs when a user is resizing tables and receives a TypeError (found on Sentry). This change adds a null check on columns existing in the growColumn and shrinkColumn functions so that we do not try to access a column that doesn't exist.
- [`ac8b10d645e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac8b10d645e) - This change addresses a RangeError on `getRelativeDomCellWidths` found on Sentry. It sets the check for `colspan` to be strict equals to one as the value comes from the first table row's colspan DOM attribute and cannot be negative.

  Reference: https://sentry.io/organizations/atlassian-2y/issues/3434914334/?project=5988900

- [`46703fdde00`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46703fdde00) - This change addresses a bug that occurs when a user is clicking into an element inside the table and receives a RangeError (found on Sentry). This change adds bounds, NaN, and type checks when reading a cellIndex from tableMap so that we don't pass NaN or undefined to the call to nodeAt.
- [`edb93baa953`](https://bitbucket.org/atlassian/atlassian-frontend/commits/edb93baa953) - Moved sendLogs to editor-common. Re-exported in editor-core and import sendLogs from editor-common in editor-plugin-table package.
- Updated dependencies

## 0.0.10

### Patch Changes

- [`b519be31909`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b519be31909) - Improve FloatingDeleteButton accessibility and update tests

## 0.0.9

### Patch Changes

- [`30d47a9f80d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30d47a9f80d) - This change adds data-testid to the top and bottom sticky sentinels in TableComponent and updates tests to access the sentinels by the testId.

## 0.0.8

### Patch Changes

- [`e5b0deecf68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5b0deecf68) - Add ability to localize for nodeview and add aria labels to RowControl and CornerControl

## 0.0.7

### Patch Changes

- [`3b93848ef7e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b93848ef7e) - This changes addresses a bug that occurs when a user is resizing tables and receives a TypeError (found on Sentry). This change adds a null check on columns existing in the growColumn and shrinkColumn functions so that we do not try to access a column that doesn't exist.
- [`a1b80e72418`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1b80e72418) - This change addresses a RangeError on `getRelativeDomCellWidths` found on Sentry. It sets the check for `colspan` to be strict equals to one as the value comes from the first table row's colspan DOM attribute and cannot be negative.

  Reference: https://sentry.io/organizations/atlassian-2y/issues/3434914334/?project=5988900

- [`b63aa34e1fe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b63aa34e1fe) - This change addresses a bug that occurs when a user is clicking into an element inside the table and receives a RangeError (found on Sentry). This change adds bounds, NaN, and type checks when reading a cellIndex from tableMap so that we don't pass NaN or undefined to the call to nodeAt.

## 0.0.6

### Patch Changes

- Updated dependencies

## 0.0.5

### Patch Changes

- [`75afc133d94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/75afc133d94) - [ED-15625] Fix media full screen on table

## 0.0.4

### Patch Changes

- [`06ae7af103f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/06ae7af103f) - [ux][ed-15739] Bring back the table icon to the typeahead menu by moving IconTable component to shared package
- Updated dependencies

## 0.0.3

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 0.0.2

### Patch Changes

- [`b18bb5420cb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b18bb5420cb) - [ED-15731] Replace the GetEditorContainerWidth API with a workaround to grab with plugin state data

## 0.0.1

### Patch Changes

- [`e2fa17aaee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2fa17aaee6) - [ED-15587] Fix types added when the copy was made
- [`36b3ba5a140`](https://bitbucket.org/atlassian/atlassian-frontend/commits/36b3ba5a140) - [ED-15618] Remove dead code with cross-reference to list plugin
- [`d459e83ce52`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d459e83ce52) - [ED-15616] Replace the unnecessary cross-reference feature editorDisabledPluginKey to use the native editor way
- [`7487d066e92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7487d066e92) - [ED-15551] Copy ReactNodeView and dependencies into editor-common
- [`5b156047608`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b156047608) - empty
- [`a4a59914b7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4a59914b7c) - [ED-15634] Upgrade table package with last table core styles
- [`949bba4aaf4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/949bba4aaf4) - [ED-15556] Initial Editor Analytic API for Table extraction
- [`d43ae395cb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d43ae395cb1) - [ED-15619] Remove cross-reference with inline card plugin
- [`7d7d541b5b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d7d541b5b4) - [ED-15553] Remove copy button stub from next editor table
- [`1691708e13b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1691708e13b) - [ED-15555] Export getParentNodeWidth to editor-common
- Updated dependencies
