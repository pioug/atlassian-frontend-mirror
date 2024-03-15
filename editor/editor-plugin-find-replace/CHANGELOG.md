# @atlaskit/editor-plugin-find-replace

## 1.1.5

### Patch Changes

- [#81374](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81374) [`3e7990b6d1a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3e7990b6d1a3) - React 18 types for editor-plugin-find-replace

## 1.1.4

### Patch Changes

- [#78913](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78913) [`b244d468a298`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b244d468a298) - fix incorrect usage of a platform ff in find and replace plugin

## 1.1.3

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- [#73177](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73177) [`22452599ed8f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/22452599ed8f) - Move styling for certain packages to tokens.

## 1.1.0

### Minor Changes

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

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#72125](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72125) [`9b19a14df053`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9b19a14df053) - Migrated buttons in find and replace popup to new atlaskit buttons with a feature flag `platform.design-system-team.editor-new-button_jjjdo`.

## 1.0.1

### Patch Changes

- [#72710](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72710) [`3a884530c4d2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3a884530c4d2) - Move translation strings for find-replace to ICU format.

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386) [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) - This changeset exists to bump all editor plugins that currently don't have a major version. This is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.3.2

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572) [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) - Upgrading @atlaskit/editor-prosemirror dependency

## 0.3.1

### Patch Changes

- [#71136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71136) [`c803fea1e6a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c803fea1e6a4) - Move all plugin translations to editor-common
- Updated dependencies

## 0.3.0

### Minor Changes

- [#67595](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67595) [`3bb66071a333`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3bb66071a333) - [ux] ECA11Y-75: Updated UX/UI for "Find and Replace" modal window, added Focus trap to Find and Replace popup, added return focus to the search button when pressing ESC, update selected match and all matches highlighted colors, added Screan Reader announcements for repeated button clicks ( subtickets: ECA11Y-144, ECA11Y-145, ECA11Y-146, ECA11Y-147, ECA11Y-148, ECA11Y-149 )

## 0.2.0

### Minor Changes

- [#68790](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68790) [`c6d8affc52d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d8affc52d1) - Support maybeAdd plugins in usePreset. Add typing support for universal preset.

  Now when using the editor API with the universal preset

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238) [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) - [ED-21835] Change EditorAPI type to always union with undefined

## 0.1.0

### Minor Changes

- [#66388](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66388) [`1698d83da05f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1698d83da05f) - ED-21743: Extract find replace plugin from editor-core

### Patch Changes

- Updated dependencies
