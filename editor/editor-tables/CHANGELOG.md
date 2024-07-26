# @atlaskit/editor-tables

## 2.8.0

### Minor Changes

- [#124190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124190)
  [`9ab9c4ca2b9df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9ab9c4ca2b9df) -
  Clean-up platform.editor.refactor-highlight-toolbar_mo0pj feature flag
- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

## 2.7.5

### Patch Changes

- [`3b20c735bc9ee`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3b20c735bc9ee) -
  [ux] Insert full-width table in comment editor when table resizing is enabled.

## 2.7.4

### Patch Changes

- [#102210](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102210)
  [`fe0d7aa7668a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fe0d7aa7668a) -
  Set layout attribute for tables to align-left when inserted in full width editor

## 2.7.3

### Patch Changes

- [#94829](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94829)
  [`815fda434fe7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/815fda434fe7) -
  [ED-22849] Align add column and row behaviour behind
  platform_editor_table_duplicate_cell_colouring flag so that adding a column will copy cell
  background from the left and adding a row will copy background colour from row above

## 2.7.2

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 2.7.1

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component

## 2.7.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

## 2.6.3

### Patch Changes

- [#86368](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86368)
  [`8499e6f0fef4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8499e6f0fef4) -
  Remove custom-table-width feature flag

## 2.6.2

### Patch Changes

- [#88717](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88717)
  [`d92770eae702`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d92770eae702) -
  Adding internal eslint opt outs for a new rule
  `@atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop`.

## 2.6.1

### Patch Changes

- [#86621](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86621)
  [`819e262c9b0b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/819e262c9b0b) -
  remove table-shift-click-selection-backward feature flag

## 2.6.0

### Minor Changes

- [#83612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83612)
  [`25b32cbfbb7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/25b32cbfbb7e) -
  [ux] Added new clone row/column behaviour to tables drag N drop. When the user holds the alt
  modifier during the operation the row/column will be duplicated rather then moved.

## 2.5.8

### Patch Changes

- [#80612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80612)
  [`b3a6ffbe9e15`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b3a6ffbe9e15) -
  [ux] Fix Firefox table drag handle shift click selection

## 2.5.7

### Patch Changes

- [#77796](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77796)
  [`eab996d08513`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eab996d08513) -
  Add new statsig experiement for preserve table width, add support for passing through width to
  create table. Allow tables to be inserted at full width

## 2.5.6

### Patch Changes

- [#77516](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77516)
  [`d6e79c5637c7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d6e79c5637c7) -
  [ux] fix expand current selection by shift click

## 2.5.5

### Patch Changes

- [#72037](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72037)
  [`e59f0b7a9115`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e59f0b7a9115) -
  [ux] add flexiable to make merged cells detection allow to detect edge merged cells

## 2.5.4

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 2.5.3

### Patch Changes

- [#70718](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70718)
  [`e5d2832002bb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e5d2832002bb) -
  Patched a bug in the table paste logic which was throwing an error during the selection phase of
  the paste event when the pasted data contained a table row ending with a merged cell. The error
  from the selection is causing the table data to be injected as plain text inline.

## 2.5.2

### Patch Changes

- [#69650](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69650)
  [`91a5b96796cb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/91a5b96796cb) -
  Migrate @atlaskit/editor-tables to use declarative entry points

## 2.5.1

### Patch Changes

- [#69625](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69625)
  [`67d7971c6ddf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/67d7971c6ddf) -
  [ux] Tables DnD now supports dragging multiple rows/columns in a single drag using multi-select

## 2.5.0

### Minor Changes

- [#69232](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69232)
  [`93c8f231aa82`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93c8f231aa82) -
  Optimized the table move column logic to perform individual insert/deletes per row

## 2.4.0

### Minor Changes

- [#67400](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67400)
  [`191436e36f93`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/191436e36f93) -
  Optimised the table move row logic to perform insert/delete steps rather than an entire table
  replacement

## 2.3.18

### Patch Changes

- [#60278](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60278)
  [`bc2785a02329`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc2785a02329) -
  Selection of multiple rows / column should remain when clicking the drag handle

## 2.3.17

### Patch Changes

- [#59009](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59009)
  [`f7e9d874ff37`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f7e9d874ff37) -
  Fix table expand selection when `platform.editor.table-shift-click-selection-backward` FF is
  enabled

## 2.3.16

### Patch Changes

- [#58433](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58433)
  [`4d8e164d7760`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4d8e164d7760) -
  fix shift + click to expand column / row selection bug when `platform.editor.table.drag-and-drop`
  is enabled

## 2.3.15

### Patch Changes

- [#43255](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43255)
  [`6c1b3270538`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c1b3270538) - Remove
  setSelection from move commands as it's unnecessary

## 2.3.14

### Patch Changes

- [#42754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42754)
  [`b2396966987`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2396966987) - use 'as'
  type assertion rather than angle brackets

## 2.3.13

### Patch Changes

- [#42109](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42109)
  [`d25ae495fed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d25ae495fed) - [ux]
  Adds a fix to keep selection on a dropped row or column.

## 2.3.12

### Patch Changes

- [#41991](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41991)
  [`28a7171e7e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28a7171e7e3) - [ux] add
  shift click select backward feature to expand selection

## 2.3.11

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749)
  [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect
  yarn changeset to packages, upgrade adf-schema

## 2.3.10

### Patch Changes

- [#39984](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39984)
  [`37c62369dae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37c62369dae) - NO-ISSUE
  Import doc builder types from editor-common

## 2.3.9

### Patch Changes

- [#39381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39381)
  [`35242fb367a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35242fb367a) - Add
  custom-table-width feature flag and add width to table node when inserted

## 2.3.8

### Patch Changes

- Updated dependencies

## 2.3.7

### Patch Changes

- [#37785](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37785)
  [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) -
  [ED-19233] Import prosemirror libraries from internal facade package

## 2.3.6

### Patch Changes

- [#36241](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36241)
  [`5f5ba16de66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5ba16de66) -
  [ED-13910] Fix prosemirror types

## 2.3.5

### Patch Changes

- [#35782](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35782)
  [`73b5128036b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73b5128036b) -
  [ED-17082] Mark package as a singleton one

## 2.3.4

### Patch Changes

- [#35533](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35533)
  [`fa1f53e0ae7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa1f53e0ae7) -
  [ED-18167] Remove dependency of editor-tables on adf schema library to avoid a circular dependency

## 2.3.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 2.3.2

### Patch Changes

- [#33771](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33771)
  [`a142ba1aa28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a142ba1aa28) -
  [ED17172] Bump prosemirror-model to 1.16.0 and prosemirror-view to 1.23.7 and removed work-arounds
  for fixed issues

## 2.3.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 2.3.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

## 2.2.6

### Patch Changes

- [#33004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33004)
  [`0ffb55018c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ffb55018c9) - Revert
  "[ED-17172] Bumped prosemirror-view from 1.23.2 to 1.23.7 and removed work-around for fixed
  issues"

## 2.2.5

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 2.2.4

### Patch Changes

- [#28932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28932)
  [`4080eb013ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4080eb013ef) - [ux] Fix
  bug where pasting inside a table did not respect the table's headers. Pasted cells are formatted
  based on the table they are being pasted into.
- [`4f6a895f1d5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f6a895f1d5) - Set
  selectable property for selectable nodes
- [`4f6a895f1d5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f6a895f1d5) - Fix
  arrow shift selection coming from outside of the table

## 2.2.3

### Patch Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`dbef481f7df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dbef481f7df) - [ux]
  ED-15724: fix the merged row(2nd row or later) cannot been recongnized as row selection and cannot
  be deleted.

## 2.2.2

### Patch Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`47f1f76cb80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47f1f76cb80) - Add
  selectTableClosestToPos function
- [`755d7bf5c2a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/755d7bf5c2a) - [ux]
  ED-12527 Prevents editor-tables handleMouseDown() from creating a cell selection when right
  clicking in a table cell.

## 2.2.1

### Patch Changes

- [#27511](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27511)
  [`403e0d2d291`](https://bitbucket.org/atlassian/atlassian-frontend/commits/403e0d2d291) - ED-16246
  fix prevent @types/prosemirror-commands @types/prosemirror-keymap updating to incompatible
  version.

## 2.2.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`d8acf7254db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8acf7254db) - ED-8567
  added tracking for fixTables()

## 2.1.6

### Patch Changes

- [#24607](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24607)
  [`95f007063cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95f007063cf) -
  Decoupling paste plugin and table plugin, copied `replaceSelectedTable` and `getSelectedTableInfo`
  utils to editor-tables utils package and analytics dependency shifted to paste plugin.

## 2.1.5

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`e6f25536fe3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6f25536fe3) -
  [ux][ed-15168] Fixes a bug where a width-less column was created when pasting table cells into a
  table that had columns with set widths.

## 2.1.4

### Patch Changes

- [#20033](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20033)
  [`b29ce16dad8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b29ce16dad8) -
  [ED-14606] Move bitbucket schema, confluence schema, jira schema, and default schema from
  @atlaskit/adf-schema to their own entry points. These new entry points are as follows

  @atlaskit/adf-schema/schema-bitbucket for:

  - bitbucketSchema

  @atlaskit/adf-schema/schema-confluence for:

  - confluenceSchema
  - confluenceSchemaWithMediaSingle

  @atlaskit/adf-schema/schema-jira for:

  - default as createJIRASchema
  - isSchemaWithLists
  - isSchemaWithMentions
  - isSchemaWithEmojis
  - isSchemaWithLinks
  - isSchemaWithAdvancedTextFormattingMarks
  - isSchemaWithCodeBlock
  - isSchemaWithBlockQuotes
  - isSchemaWithMedia
  - isSchemaWithSubSupMark
  - isSchemaWithTextColor
  - isSchemaWithTables

  @atlaskit/adf-schema/schema-default for:

  - defaultSchema
  - getSchemaBasedOnStage
  - defaultSchemaConfig

  This change also includes codemods in @atlaskit/adf-schema to update these entry points. It also
  introduces a new util function "changeImportEntryPoint" to @atlaskit/codemod-utils to handle this
  scenario.

## 2.1.3

### Patch Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`cbfbaab61bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cbfbaab61bb) -
  [ux][ed-14300] Remove column width from table cells being pasted into another table as it should
  take the formatting of the destination table.

## 2.1.2

### Patch Changes

- [#18526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18526)
  [`4e6fbaf5898`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6fbaf5898) - ED-14117
  Change EditorState.apply type to receive readonly transaction

  Transactions should not be mutated after being dispatched as it can lead to unexpected behaviour.
  This change patches the relevant types declared in prosemirror-state as a compile-time safeguard.

## 2.1.1

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - ED-13025
  Bump prosemirror-view 1.23.1 -> 1.23.2

## 2.1.0

### Minor Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`b230f366971`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b230f366971) -
  [ED-14008] Bump prosemirror-view from 1.20.2 to 1.23.1

### Patch Changes

- [`c6feed82071`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6feed82071) -
  ED-11632: Bump prosemirror packages;

  - prosmirror-commands 1.1.4 -> 1.1.11,
  - prosemirror-model 1.11.0 -> 1.14.3,
  - prosemirror-state 1.3.3 -> 1.3.4,
  - prosemirror-transform 1.2.8 -> 1.3.2,
  - prosemirror-view 1.15.4 + 1.18.8 -> 1.20.2.

## 2.0.1

### Patch Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`96c6146eef1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96c6146eef1) -
  ED-13187: localId optional & empty values filtered

## 2.0.0

### Major Changes

- [#9847](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9847)
  [`71318e96b5d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71318e96b5d) - NO-ISSUE
  Force bump editor-tables

## 1.1.5

### Patch Changes

- [#9510](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9510)
  [`5089bd2544d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5089bd2544d) -
  ED-11919: generate localId for tables
- [`58b170725be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58b170725be) - Renamed
  @atlaskit/editor-test-helpers/schema-builder to @atlaskit/editor-test-helpers/doc-builder

## 1.1.4

### Patch Changes

- [#9083](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9083)
  [`d2e70ebaaa9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2e70ebaaa9) -
  NO-ISSUE: updated editor tests to use 'doc: DocBuilder' instead of 'doc: any'
- [`fe1c96a3d28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe1c96a3d28) - added
  DocBuilder type to @atlaskit/editor-test-helpers, replaced duplicate definitions and DocumentType

## 1.1.3

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 1.1.2

### Patch Changes

- [#5860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5860)
  [`703752d487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/703752d487) - ED-10647
  Remove caret from prosemirror-model, prosemirror-keymap, prosemirror-state, prosemirror-transform
  to lock them down to an explicit version

## 1.1.1

### Patch Changes

- [#5516](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5516)
  [`e4abda244e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4abda244e) - ED-9912:
  replace prosemirror-tables with editor-tables
- [`d39fa49905`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d39fa49905) - ED-10420:
  remove utils copied from prosemirror-utils

## 1.1.0

### Minor Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`111eac563c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/111eac563c) - ED-9915:
  added table utils from prosemirror-utils
- [`9a39500244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a39500244) - Bump
  ProseMirror packages

  Read more: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1671956531/2020-08

### Patch Changes

- [`2d4bbe5e2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d4bbe5e2e) - [ED-10503]
  Fix prosemirror-view version at 1.15.4 without carret
- [`9bf037e4e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9bf037e4e6) - ED-10252:
  tests for moveColumn
- [`b5e04ea3f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5e04ea3f6) - ED-10052:
  added the original MIT license to the package's source code
- [`93be5de4de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93be5de4de) - Move
  table_moveRow tests from prosemirror-utils to editor-tables
- [`aa65a361a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa65a361a1) - Added some
  util functions
- Updated dependencies

## 1.0.2

### Patch Changes

- [#4424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4424)
  [`e485167c47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e485167c47) - ED-10018:
  bump prosemirror-tables to fix copy-pasting merged rows
- [`7325aff6d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7325aff6d3) - ED-9626:
  added unit tests for CellSelection and tableEditing plugin to editor-tables
- Updated dependencies

## 1.0.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 1.0.0

### Major Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`b00bfbe3f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b00bfbe3f3) - ED-9627
  Added new @atlaskit/editor-tables package to include common editor tables related code. Included
  TableMap class from prosemirror-tables package with it.
