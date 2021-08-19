# @atlaskit/editor-tables

## 2.0.1

### Patch Changes

- [`96c6146eef1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96c6146eef1) - ED-13187: localId optional & empty values filtered

## 2.0.0

### Major Changes

- [`71318e96b5d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71318e96b5d) - NO-ISSUE Force bump editor-tables

## 1.1.5

### Patch Changes

- [`5089bd2544d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5089bd2544d) - ED-11919: generate localId for tables
- [`58b170725be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58b170725be) - Renamed @atlaskit/editor-test-helpers/schema-builder to @atlaskit/editor-test-helpers/doc-builder

## 1.1.4

### Patch Changes

- [`d2e70ebaaa9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2e70ebaaa9) - NO-ISSUE: updated editor tests to use 'doc: DocBuilder' instead of 'doc: any'
- [`fe1c96a3d28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe1c96a3d28) - added DocBuilder type to @atlaskit/editor-test-helpers, replaced duplicate definitions and DocumentType

## 1.1.3

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 1.1.2

### Patch Changes

- [`703752d487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/703752d487) - ED-10647 Remove caret from prosemirror-model, prosemirror-keymap, prosemirror-state, prosemirror-transform to lock them down to an explicit version

## 1.1.1

### Patch Changes

- [`e4abda244e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4abda244e) - ED-9912: replace prosemirror-tables with editor-tables
- [`d39fa49905`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d39fa49905) - ED-10420: remove utils copied from prosemirror-utils

## 1.1.0

### Minor Changes

- [`111eac563c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/111eac563c) - ED-9915: added table utils from prosemirror-utils
- [`9a39500244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a39500244) - Bump ProseMirror packages

  Read more: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1671956531/2020-08

### Patch Changes

- [`2d4bbe5e2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d4bbe5e2e) - [ED-10503] Fix prosemirror-view version at 1.15.4 without carret
- [`9bf037e4e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9bf037e4e6) - ED-10252: tests for moveColumn
- [`b5e04ea3f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5e04ea3f6) - ED-10052: added the original MIT license to the package's source code
- [`93be5de4de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93be5de4de) - Move table_moveRow tests from prosemirror-utils to editor-tables
- [`aa65a361a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa65a361a1) - Added some util functions
- Updated dependencies

## 1.0.2

### Patch Changes

- [`e485167c47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e485167c47) - ED-10018: bump prosemirror-tables to fix copy-pasting merged rows
- [`7325aff6d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7325aff6d3) - ED-9626: added unit tests for CellSelection and tableEditing plugin to editor-tables
- Updated dependencies

## 1.0.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 1.0.0

### Major Changes

- [`b00bfbe3f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b00bfbe3f3) - ED-9627 Added new @atlaskit/editor-tables package to include common editor tables related code. Included TableMap class from prosemirror-tables package with it.
