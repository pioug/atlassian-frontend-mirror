# @atlaskit/editor-plugin-table

## 2.7.1

### Patch Changes

- [`39099193642`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39099193642) - Cleanup breakout styling when table has fragment mark ff

## 2.7.0

### Minor Changes

- [`960a2b478c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/960a2b478c8) - [ux] [ED-19167] Add blue shadow to resizer handle on hover

### Patch Changes

- Updated dependencies

## 2.6.13

### Patch Changes

- [`8fe864e4f7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8fe864e4f7a) - [ux] ED-19336: Fixed insert column button not visible when sticky header is enabled."

## 2.6.12

### Patch Changes

- [`08bae0f0926`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08bae0f0926) - [ux] When there's only one row in a table the top & bottom sentinels become inverted. This creates some nasty visiblity
  toggling side-effects because the intersection observers gets confused and ends up toggling the sticky header on when it should
  be off and vice-versa.

  This is due to their positioning using css relative top & bottom respectively. A row is only ~44px height and the bottom sentinel is
  positioned ~67px off the bottom, and the top sentinel is ~25px off the top (which aligns to the top of the row).
  So when only 1 row exist the bottom sentinel ends up being ~23px above the top sentinel. Which means the logic for
  toggling becomes inverted and when the sentinels are scrolled off the screen the top on is now last and ends up displaying the
  sticky header, where previously the bottom sentinel would hide it.

- Updated dependencies

## 2.6.11

### Patch Changes

- Updated dependencies

## 2.6.10

### Patch Changes

- [`79dc812733f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79dc812733f) - [ux] [ED-19293] Updates table's guideline used for wide layout. The value is aligned with other nodes that use breakouts and are set to wide.
- Updated dependencies

## 2.6.9

### Patch Changes

- Updated dependencies

## 2.6.8

### Patch Changes

- [`d432ad14798`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d432ad14798) - [ux] Added standard page guidelines when custom table width enabled and is resizing table.

## 2.6.7

### Patch Changes

- [`56f4b88f7c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56f4b88f7c2) - [ux] ED-19317: fix numbered column shifted up issue when sticky header

## 2.6.6

### Patch Changes

- [`fb2597b2dc3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb2597b2dc3) - Check analytic plugin exists before accessing attach function

## 2.6.5

### Patch Changes

- [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) - [ED-19233] Import prosemirror libraries from internal facade package
- Updated dependencies

## 2.6.4

### Patch Changes

- [`467515ad237`](https://bitbucket.org/atlassian/atlassian-frontend/commits/467515ad237) - [ux] ED-17628 Maximum table width is calculated using table node to make adding columns behabiour similar to current behaviuor when custom table widths is enabled.

## 2.6.3

### Patch Changes

- [`b0277c41c33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0277c41c33) - ED-19064: Fixed border issue when selecting and deleting header column, and fixed border issue of the column control decoration."

## 2.6.2

### Patch Changes

- [`bc9f806f84a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc9f806f84a) - Toggle handle visibility of resizer if current table is selected
- Updated dependencies

## 2.6.1

### Patch Changes

- [`84516fbd72d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84516fbd72d) - [ux] ED-19068: fix numbered columns scroll bar issue

## 2.6.0

### Minor Changes

- [`0ae6f70038a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae6f70038a) - [ED-17635] Add analytics event for table width resizing

### Patch Changes

- Updated dependencies

## 2.5.5

### Patch Changes

- [`d55db921de3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d55db921de3) - improve performance when adding a new column in table

## 2.5.4

### Patch Changes

- [`b6758f1ecff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6758f1ecff) - [ux] Fixes positioning of popups inside table cell
- Updated dependencies

## 2.5.3

### Patch Changes

- [`e8885f55db6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8885f55db6) - Fixed type issue

## 2.5.2

### Patch Changes

- [`8b77d484c89`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b77d484c89) - Change snap gap for tables guideline to 9px

## 2.5.1

### Patch Changes

- [`e64541c6fda`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e64541c6fda) - [ux] [ED-18759] Updated table border, handlebar controls, blanket, icon, icon background and table cell options button colour tokens on light and dark theme for table selection and table deletion. Borders for Table Floating Contextual Button & Floating toolbar color palette button on dark & light theme are also updated.

## 2.5.0

### Minor Changes

- [`22a59977bb3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22a59977bb3) - [ux] Updated ResizerNext to allow handle style overrides. Updated the table resizer to space and align the resizer handle according the the design specifications

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [`e7ed90bad7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ed90bad7c) - Remove platform feature flag calls to editor-core and pass through a new option instead for custom table widths project, allowing for simpler clean up and reference

## 2.3.1

### Patch Changes

- [`a9c98fc8503`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a9c98fc8503) - [ED-19028] Remove less-padding class when using table width resizer

## 2.3.0

### Minor Changes

- [`464c9736dff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/464c9736dff) - [ux] [ED-17626] Remove table controls during table width resizing

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [`464745a92e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/464745a92e6) - [ux] Updated the Editor Table plugin to use the new guidelines plugin when custom-table-widths FF is enabled

### Patch Changes

- Updated dependencies

## 2.1.7

### Patch Changes

- [`018b27d3392`](https://bitbucket.org/atlassian/atlassian-frontend/commits/018b27d3392) - [ux] Makes new table resize handle sticky and of variable height based on the table height.

## 2.1.6

### Patch Changes

- [`32ca42e82c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/32ca42e82c3) - Extracted internal editor card plugin to new package `editor-plugin-card`.

## 2.1.5

### Patch Changes

- [`c133c710360`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c133c710360) - Fix typing errors

## 2.1.4

### Patch Changes

- [`8b891bf3590`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b891bf3590) - This change introduces `editor-plugin-hyperlink` which separates the hyperlink plugin from `editor-core`. In order to enable this change there are now new entry points on `editor-common` (such as `/link`, `/quick-insert`) in order to separate common code. Further `prosemirror-input-rules` now has new exports of `createPlugin` and `createRule` which are used in many plugins in `editor-core`.
- Updated dependencies

## 2.1.3

### Patch Changes

- [`caa8dc8e5f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/caa8dc8e5f5) - ED-18758:Making the box-shadow used in table with sticky headers consistent in light theme to original

## 2.1.2

### Patch Changes

- [`b8d84a1ffcd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8d84a1ffcd) - [ux] ED-17632 disable table resizer when nested

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [`48ebe1fa732`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48ebe1fa732) - [ED-18895] Moved table integration tests to dedicated editor plugin test package to avoid circular dependencies

## 2.0.1

### Patch Changes

- [`802453ec412`](https://bitbucket.org/atlassian/atlassian-frontend/commits/802453ec412) - [ux] update how table respond to external width changes under `platform.editor.custom-table-width` feature flag
- Updated dependencies

## 2.0.0

### Major Changes

- [`bdb840c6eaa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdb840c6eaa) - Remove EditorAnalyticsAPI parameter from tables plugin as it now gets this from `editor-plugin-analytics`. This parameter is unused and the action is just to remove it.

  Fix issue where internal analytics plugin was not being called correctly.

## 1.7.3

### Patch Changes

- [`5f5ba16de66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5ba16de66) - [ED-13910] Fix prosemirror types
- Updated dependencies

## 1.7.2

### Patch Changes

- Updated dependencies

## 1.7.1

### Patch Changes

- [`7a720ec3e8e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a720ec3e8e) - ED-18796 Use setAttrsStep to update colwidth attribute when scaling the table

## 1.7.0

### Minor Changes

- [`cb69e6847ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb69e6847ec) - [ux] The table colgroup will always set the width to the min width when the custom-table-width flag is enabled

### Patch Changes

- Updated dependencies

## 1.6.9

### Patch Changes

- [`6e54d9fbeea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e54d9fbeea) - Added tableAddWidthPlugin

## 1.6.8

### Patch Changes

- [`a9350cf3831`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a9350cf3831) - Check existence of window and document variable for confluence SSR to work

## 1.6.7

### Patch Changes

- [`18344c31ea3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18344c31ea3) - [ED-13910] Fix EditorView getPos type

## 1.6.6

### Patch Changes

- [`73b5128036b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73b5128036b) - [ED-17082] Mark package as a singleton one
- Updated dependencies

## 1.6.5

### Patch Changes

- [`dcb378acc03`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dcb378acc03) - [ux] ED-17625: add restriction of resizing table

## 1.6.4

### Patch Changes

- [`5e01082b600`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e01082b600) - Extracting SelectionBasedNodeView to editor-common.
- Updated dependencies

## 1.6.3

### Patch Changes

- [`1202f6f0a82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1202f6f0a82) - ED-16692: add logic to position FloatingContextualButton correctly when sticky and scrolling

## 1.6.2

### Patch Changes

- Updated dependencies

## 1.6.1

### Patch Changes

- [`b48d0a5f88f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b48d0a5f88f) - Create new placeholder for the floating toolbar plugin and use a new action to replace the forceFocusSelector action.

## 1.6.0

### Minor Changes

- [`89989e06f43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89989e06f43) - [ux] Adding initial Resizer to table plugin behind a platform feature flag, allowing tables to resize to a custom width. This change also includes the following refactors:- change calcTableWidth function to return number instead of px- allowing tables to use breakout values when allowColumnResize is disabled

### Patch Changes

- Updated dependencies

## 1.5.5

### Patch Changes

- Updated dependencies

## 1.5.4

### Patch Changes

- [`00d7488cf36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00d7488cf36) - [ux] The table shadow sentinels when rendered out of view would sometimes return a 0 root bounds object in the intersection observer. This became an issue because we ignore intersection entities with 0 root bounds. This fixes the right shadow not appear on tablessimply by removing the root bounds check from the observer

## 1.5.3

### Patch Changes

- [`b38a0fcd924`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b38a0fcd924) - Use NextEditorPlugin API for width plugin in tables.

## 1.5.2

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- [`26d9c8cb4b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26d9c8cb4b1) - Extract decorations plugin from editor-core to its own package.
- [`077e086c53f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/077e086c53f) - [ux] ED-17971 Changes the color token used for table borders and background of table controls and numbered column.
- [`8f98e952174`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f98e952174) - [ED-17881] Fix performance issue when table has not been resized and distribute columns feature is turned on
- [`741b3acd455`](https://bitbucket.org/atlassian/atlassian-frontend/commits/741b3acd455) - This major change includes:

  - `EditorMigrationComponent` being renamed to `Editor`. This includes making component methods which should never be used private (which should never be used in normal operation and have been deprecated for several releases).
  - `EditorMigrationComponent` is now removed
  - Removing `useEditorNext` feature flag

  This change was made as part of our strategy to move to a new architecture with `EditorMigrationComponent`, now that the component has served its purpose it is no longer required.

  Any references to this component can be updated like so:

  Before:

  ```ts
  import { EditorMigrationComponent } from '@atlaskit/editor-core';
  ```

  After:

  ```ts
  import { Editor } from '@atlaskit/editor-core';
  ```

- Updated dependencies

## 1.5.0

### Minor Changes

- [`20809d41658`](https://bitbucket.org/atlassian/atlassian-frontend/commits/20809d41658) - Added feature flag `platform.editor.custom-table-width` which toggles the new table experience

### Patch Changes

- [`1549c2e6dda`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1549c2e6dda) - Extract width plugin from `editor-core` to separate `editor-plugin-width` package.
- Updated dependencies

## 1.4.1

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8
- Updated dependencies

## 1.4.0

### Minor Changes

- [`8a391616ecc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a391616ecc) - Moving insert node API to a new editor plugin to allow it to be more extensible. Also exposing a new editor plugin action for tables to allow for consistent insertion.

### Patch Changes

- [`5cc449dac8d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5cc449dac8d) - Decouple card plugin so that it uses new NextEditorPlugin for any injected dependencies.
- [`b804d3ad561`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b804d3ad561) - Remove unused code related to GASv2 table analytics from editor-plugin table, editor-core and editor-common
- [`6550d08f5af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6550d08f5af) - [ux] Color picker button should not be focused after selecting color.
- [`f621ae6490a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f621ae6490a) - Adding type dependency on analytics plugin to tables plugin.
- [`a142ba1aa28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a142ba1aa28) - [ED17172] Bump prosemirror-model to 1.16.0 and prosemirror-view to 1.23.7 and removed work-arounds for fixed issues
- Updated dependencies

## 1.3.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`
- Updated dependencies

## 1.3.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 1.2.7

### Patch Changes

- [`55b4a026119`](https://bitbucket.org/atlassian/atlassian-frontend/commits/55b4a026119) - [ux] ED-17710 Cellbackground button in context menu is tokenised.

## 1.2.6

### Patch Changes

- [`0ffb55018c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ffb55018c9) - Revert "[ED-17172] Bumped prosemirror-view from 1.23.2 to 1.23.7 and removed work-around for fixed issues"
- [`888cd482b98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/888cd482b98) - Fix logic of generated new duplicated localIds when pasting a copied node above the copied node
- Updated dependencies

## 1.2.5

### Patch Changes

- [`115a119a42c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/115a119a42c) - [ux] ED-17710 Color palette in table context menu is tokenised.

## 1.2.4

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils
- [`d9a8fe191f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9a8fe191f2) - [ED-17295] Update feature flag usage for media plugin
- Updated dependencies

## 1.2.3

### Patch Changes

- [`9f9b4b1cf60`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f9b4b1cf60) - [ux] [HOT-103036] Fix table width styling when broken out with fragment mark

## 1.2.2

### Patch Changes

- [`ef830fdabfa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef830fdabfa) - [ED-17294] Enable type checking for Preset plugins on unit tests
- [`b7f9b82ecd8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7f9b82ecd8) - [ED-16109] Fix deleting rows with row above and below having merged cells
- [`7946da1848a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7946da1848a) - [ux] [ED-16668] Update table shadow intersection table to observe new shadow sentinels instead of first and last cell
- Updated dependencies

## 1.2.1

### Patch Changes

- [`f07824eeccc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f07824eeccc) - ED-15647 fix undo when pasting table with resized column in expand
- [`924e8493f96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/924e8493f96) - [ux] [ED-16418] Fixed issue where on resize the topPosEditorElement top position which determines the height of the sticky header would not update on window resize or other actions that may affect its height
- [`2f7fff7239d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f7fff7239d) - [ux] [ED-17271] Sticky headers now listen for width changes in the parent scroll container
- [`2367ba14aa0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2367ba14aa0) - [ux] ED-16758 Added support for theme tokens in table cell background color.
- [`1f10173bdad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f10173bdad) - [ux] [ED-15686] Added sticky to floating contextual menu dropdown
- [`a5d7c8d0f1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5d7c8d0f1e) - [ux] Fix of the regression caused due to https://product-fabric.atlassian.net/browse/DTR-1313
- [`deef98920f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/deef98920f4) - [ux] ED-16718 Table scroll troll - refactor nested expand logic back into editor-common
- [`1720ddc8076`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1720ddc8076) - [ux] ED-16725 Added support for semantic tooltip names for background color palette.
- [`454e652b2ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/454e652b2ed) - [ux] This change (TSLA-488) addresses a bug that occurs when changing the browser window size causes the
  table margin to not be immediately updated for tables with active sticky headers. This change adds an
  event listener for window resizing that updates the table margins.
- Updated dependencies

## 1.2.0

### Minor Changes

- [`1d11b24f17e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d11b24f17e) - [ux] ED-15549 Implemented keyboard navigation in color palette

### Patch Changes

- [`a3b5b5b28d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a3b5b5b28d4) - [ux] Fixed issue where first row control dot was off by 10px when on narrow screens, the issue was caused by updated padding on smaller screens which adjusted the "total width" of the element, which then offset the control dot
- [`ac424e40c77`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac424e40c77) - [ED-16817] Removed isObserved flag from table sentinels after intersection observer has been disconnected
- [`6a031b9b2da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a031b9b2da) - [ED-16334] Merge NextEditorPlugin interface with NextEditorPluginWithDependencies
- [`e907b6924cc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e907b6924cc) - [ux] ED-16505 Update confirmation dialog message shown when data source element is about to removed
- [`19c1c5e554a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19c1c5e554a) - [ux] TSLA-487 Fixes horizontal scroll shadow and places the scroll bar on the last row instead of below the table. See expected behavior on TSLA-27
- Updated dependencies

## 1.1.5

### Patch Changes

- [`2cde23fc462`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cde23fc462) - This changeset exists because a PR touches these packages in a way that doesn't require a release

## 1.1.4

### Patch Changes

- [`3efca940231`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3efca940231) - [ux] ED-16417 fix cell background menu item becomes blue when clicking on color palette from table contextual menu
- Updated dependencies

## 1.1.3

### Patch Changes

- [`2fe7d1a47ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2fe7d1a47ab) - [ux] ED-16512: Table should not scroll on large screens after column resizing
- [`20f8e0400ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/20f8e0400ae) - [ux] ED-16251: Added logic to respect minimum column width when adding columns to table.
- [`3820895a26d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3820895a26d) - [ux] Fix column resizing when single column is selected
- [`a2d2aedc1c6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2d2aedc1c6) - [ux] ED-16212: Fix 1px table overflow issue
- [`06f78e978d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/06f78e978d3) - [ux] ED-15640: Added layoutChanged check before setting scaleTable meta data to true in scaleTable function.
- [`3c3e9524f33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c3e9524f33) - [ux] ED-16213: Prevented scroll bar when column is resized and new column is inserted in tables
- [`ad2df7a6b46`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad2df7a6b46) - [ux] ED-16214: fix issue where last table column cannot be resized to remove scroll when inside and expand

## 1.1.2

### Patch Changes

- Updated dependencies

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
