# @atlaskit/editor-plugin-table

## 1.1.1

### Patch Changes

- [`4ee60bafc6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee60bafc6d) - ED-16603: Remove tooltips from VR tests and make them opt in. To opt-in, add `allowedSideEffects` when loading the page.

## 1.1.0

### Minor Changes

- [`a0a35fe7fb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a0a35fe7fb1) - Renaming contentComponent event subject to contentComponentv2. Move errorStack attribute to nonPrivacySafeAttributes

### Patch Changes

- [`cb6dc027c6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb6dc027c6d) - [ux] Disable content editable on a table number column to prevent selection on the number column.
- Updated dependencies

## 1.0.3

### Patch Changes

- [`20117f2de5a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/20117f2de5a) - [ux] ED-16204 Fix table cell options floating toolbar context menu closes after clicking on disabled options
- [`c6c0cab10e0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6c0cab10e0) - [ux] ED-16205 - Fix missing yellow highlight on merged table cells when hover sort column options on table floating toolbar
- [`e3b699e5069`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3b699e5069) - ED-15794 - Fix merged cells in table not highlighting on delete hover when in bottom right corner
- [`746d7339a88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/746d7339a88) - [ux] ED-15823 - Table cells on the second column would change their color upon unchecking "Header Column" table option when the selection cursor was placed in the 3rd column. This was caused by a view update not identifying the cells to update correctly. This was causing table data cells to be changed to table header cells.
- Updated dependencies

## 1.0.2

### Patch Changes

- [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving performance.

## 1.0.1

### Patch Changes

- [`04f178ea323`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04f178ea323) - [ux] ED-15823 - Table cells on the second column would change their color upon unchecking "Header Column" table option when the selection cursor was placed in the 3rd column. This was caused by a view update not identifying the cells to update correctly. This was causing table data cells to be changed to table header cells.

## 1.0.0

### Major Changes

- [`5d317ed8aa3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d317ed8aa3) - [ux] ED-15882: Implement custom starting numbers for orderedList nodes in adf-schema, editor, renderer, transformers behind restartNumberedLists feature flag. Users will be able to set a custom starting number when typing to create a numbered list in the Editor and this will be persisted across Renderer and other format transformations.

  Note: restartNumberedLists will be off by default. To enable it, consumers will need to set <Editor featureFlags={{ restartNumberedLists: true }}> or <Renderer featureFlags={{ restartNumberedLists: true }}>

### Minor Changes

- [`8820442c2b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8820442c2b2) - [ux] ED-15709: add feature for delete element if it is `isReferencedSource` is `true`

  - add checkbox confirmation dialog when then config have `isReferentiality.`
  - add referentiality helper functions.
  - update confirmDialog config to a handler to reduce traverse times.
  - user can now tick checkbox to delete descendent nodes or only selected node when user click the delete icon in floating toolbar.

### Patch Changes

- [`f0901dad354`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0901dad354) - ED-16218 - Patch to fix editor.table.colorPicker id
- [`bd809217772`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bd809217772) - [ux] Table plugin will now re-read the selection or re-parse the range around the mutation for 'selection' mutations
- [`ed617ce197c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed617ce197c) - [ux] DSP-4451 - Adds design tokens to table overflow shadows. Fixes visual bug with table overflow shadow size and placement.
- [`38a9332eed9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38a9332eed9) - [ux] Fixed sticky header related table render issues when header row is toggled
- [`7a123e47141`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a123e47141) - [ux] Make sure sticky header is only applied to first row
- [`233e03b2d92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/233e03b2d92) - ED-16007 To highlight the table rows and columns when the 'Delete Row' and 'Delete Column' options are highlighted in the 'cell options' menu of floating toolbar
- [`f788287d932`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f788287d932) - [ux] Fix table sticky header becoming unsticky when cursor moves below table
- [`60068f7fcbe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/60068f7fcbe) - [ED-16007] Changes made to enable the keyboard accessibility to the table's floating toolbar

  1. Use Alt+F10 to access the table's floating toolbar
  2. Use 'Esc' to return to table
  3. If any of the options accessed in dropdown of floating toolbar the focus should be retained on editor's current selection.

- Updated dependencies

## 0.2.6

### Patch Changes

- Updated dependencies

## 0.2.5

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- [`49588ece345`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49588ece345) - Fixed regression where resize line would not show up for selected cell

## 0.2.3

### Patch Changes

- [`c472a1eed2f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c472a1eed2f) - DSP-3443 Updates tokens used for floating buttons; updated appearances only visible in applications configured to use the new Tokens API (currently in alpha).
- [`47f1f76cb80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47f1f76cb80) - Fix table delete button hover bug
- [`8a11811caca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a11811caca) - ED-15298 clean up table cell optimisation
- [`2c992c530da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c992c530da) - DSP-5929 - Adds design tokens to table column and row button background color. Updated appearances only visible in applications configured to use the new Tokens API (currently in alpha).
- [`dc699dd58ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc699dd58ce) - DSP-4461 - Updates the selected, hover and danger state colors for table row and column buttons to subtler color versions. Updated appearances only visible in applications configured to use the new Tokens API (currently in alpha).
- [`0a781873466`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a781873466) - ED-15702: Add check on distribute columns option when table resizing
- [`7bf4281949a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7bf4281949a) - ED-15704 - Fix missing hover inducators on Delete column and Delete row under table floating toolbar context menu
- [`de571f84591`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de571f84591) - [ux] ED-15705: added tooltip for sorting back in when table contains merged cell
- [`28e25520771`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28e25520771) - [ED-16264] changes made to fix a regression caused in ED-15483 and ED-15497 , The arrow key navigation in 'Edit Link' 'Alt Text' popup and 'cell options' popup of table is hijacked incorrectly. post this fix the arrow key navigation behaviour should be deafult in these two popups
- [`359c6e79403`](https://bitbucket.org/atlassian/atlassian-frontend/commits/359c6e79403) - [ux] Fixed regression where last column of a table was unable to be resized to recover from an overflow state.
- [`47dfcc04652`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47dfcc04652) - ED-15703 - Minor change on floating toolbar to allow z-index value to be passed as parameter
- [`92547defc70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92547defc70) - [ux] ED-15795 Fixed an issue where table cells would retain table header design after a split operation. This occurs when tableCellOptimization and stickyHeaders are enabled on for tables
- [`66783618ce5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/66783618ce5) - DSP-7200 - Adds design tokens to background color for non-custom color cell. Updated appearances only visible in applications configured to use the new Tokens API (currently in alpha).
- [`95c94af3911`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95c94af3911) - [ux] Fix table danger styles persisting when table in not in selection
- Updated dependencies

## 0.2.2

### Patch Changes

- [`b68f5ae3b64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b68f5ae3b64) - [ED-16384] Add sideEffects false

## 0.2.1

### Patch Changes

- [`9ae762b0920`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ae762b0920) - removing unused prop 'stickToolbarToBottom'
- [`f240c3eb761`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f240c3eb761) - [ux] Prevent cursor selection from being reset when delete button is clicked

  The fix ensures that when removing a row or column via the delete button, the cursor will stay within the table.

  Reference https://discuss.prosemirror.net/t/setting-selection-to-newly-inserted-text-node/3615/6

- [`0708f3901cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0708f3901cd) - [ux] This change fixes a bug where the shadows at the bottom left and right of the table extend too far when horizontal scroll and sticky header are active.
- [`aa502f7cc6f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa502f7cc6f) - [ux] Fix misalignment between active sticky header and the rest of the table when user has scrolled horizontally
- [`3c75d643fb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c75d643fb2) - [ux] This change addresses a bug that occurs when the sticky header is active and there is misalignment between the row height for the leftmost grey column and the rest of the table. This change contains CSS changes that change the top margin of the table when sticky header is active, the white space of the table, and the top border of the table.

## 0.2.0

### Minor Changes

- [`efac742b6c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efac742b6c3) - Removed extra column resize handlers

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [`2ce5df13885`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ce5df13885) - [ux] Prevent cursor selection from being reset when delete button is clicked
  The fix ensures that when removing a row or column via the delete button, the cursor will stay within the table.
  Reference https://discuss.prosemirror.net/t/setting-selection-to-newly-inserted-text-node/3615/6

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
