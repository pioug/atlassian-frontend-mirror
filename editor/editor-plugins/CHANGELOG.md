# @atlaskit/editor-plugins

## 1.4.9

### Patch Changes

- Updated dependencies

## 1.4.8

### Patch Changes

- Updated dependencies

## 1.4.7

### Patch Changes

- Updated dependencies

## 1.4.6

### Patch Changes

- Updated dependencies

## 1.4.5

### Patch Changes

- Updated dependencies

## 1.4.4

### Patch Changes

- Updated dependencies

## 1.4.3

### Patch Changes

- [#73765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73765) [`0914ec0459bb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0914ec0459bb) - Update plugin dependencies.
- [#70116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70116) [`31f1fa8d4ba3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/31f1fa8d4ba3) - Removed Feature Flag for platform.editor.table.alternative-sticky-header-logic
- Updated dependencies

## 1.4.2

### Patch Changes

- [#73177](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73177) [`22452599ed8f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/22452599ed8f) - Move styling for certain packages to tokens.

## 1.4.1

### Patch Changes

- [#72122](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72122) [`c3186450404a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3186450404a) - Breaking change:

  ## WHAT?:

  Removing feature flags:

  - singleLayout
  - newInsertionBehaviour
  - interactiveExpand
  - findReplace
  - findReplaceMatchCase
  - extendFloatingToolbar

  ## WHY?:

  Because the flags and props are unused/by default active. Removing them will reduce our maintenance burden

  ## HOW to update your code:

  - If you were using the feature flag - the behaviour is now default and you can remove the flags
  - If you were not using the feature flag - the behaviour is now default.
  - If you have opted out of using the feature flag - we have been careful to ensure no-one has opted out of the behaviours. If you do have an issue please reach out to #help-editor.

- Updated dependencies

## 1.4.0

### Minor Changes

- [#72258](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72258) [`31cecb8f314b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/31cecb8f314b) - ECA11Y-78: removed feature flag

### Patch Changes

- Updated dependencies

## 1.3.6

### Patch Changes

- [#70261](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70261) [`a92879d672c6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a92879d672c6) - [ux] ED-21620: Corrected the selection functions for atom nodes that are triggered on pressing the right and left arrow keys.

## 1.3.5

### Patch Changes

- Updated dependencies

## 1.3.4

### Patch Changes

- [#69911](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69911) [`6a460aa972a2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a460aa972a2) - New export from editor plugin tables

## 1.3.3

### Patch Changes

- [#70371](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70371) [`0106d367dd4b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0106d367dd4b) - Update dependencies.

## 1.3.2

### Patch Changes

- [#71056](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71056) [`eb723312de15`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eb723312de15) - Remove `platform.linking-platform.datasource-jira_issues` feature flag from editor.

## 1.3.1

### Patch Changes

- [#69228](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69228) [`8f5f90d297d2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f5f90d297d2) - Move 99-testing into editor-test-helpers

## 1.3.0

### Minor Changes

- [#70702](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70702) [`de0d7031a536`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de0d7031a536) - remove drag and drop nodesize limit

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- [#70465](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70465) [`d9fff4535f37`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d9fff4535f37) - Update update-editor-plugins script

## 1.2.0

### Minor Changes

- [#68640](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68640) [`6a3ea210641a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a3ea210641a) - Create new context identifier plugin which contains the provider.

### Patch Changes

- [#70054](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70054) [`2ffd3ea71605`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2ffd3ea71605) - Updating editor-plugin deps
- Updated dependencies

## 1.1.0

### Minor Changes

- [#69000](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69000) [`792d51f0651e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/792d51f0651e) - Removing editor-plugin-\* deps from editor-core, using editor-plugins facade package instead

### Patch Changes

- [#69226](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69226) [`eb9cd91f1bdb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eb9cd91f1bdb) - ED-21807: Replace Dnd LD feature flag with Statsig experiment
- Updated dependencies

## 1.0.6

### Patch Changes

- Updated dependencies

## 1.0.5

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies
