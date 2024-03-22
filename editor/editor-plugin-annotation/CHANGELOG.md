# @atlaskit/editor-plugin-annotation

## 1.5.1

### Patch Changes

- [#83942](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83942) [`210a84148721`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/210a84148721) - [ED-22547] Publish draft comment for media node when saving

## 1.5.0

### Minor Changes

- [#82581](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82581) [`c1be75ae15b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1be75ae15b6) - ED-22606 add toggle inline comment action

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777) [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) - Bump adf-schema to 35.7.0

## 1.4.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116) [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) - Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.4.0

### Minor Changes

- [#81394](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81394) [`2798f5546fb7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2798f5546fb7) - [ux] ED-22118 implemented annotation style for block node (media)

## 1.3.2

### Patch Changes

- [#79543](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79543) [`8b578f7427a2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b578f7427a2) - ED-22502: updated range selection check to exempt inline card, to allow them to have annotation marks
- [#80883](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80883) [`5ecfa883d4ba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ecfa883d4ba) - React 18 types for alignment, annotation, avatar-group and blocktype plugins.

## 1.3.1

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679) [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) - ED-22553 Updating adf-schema version to 35.6.0

## 1.3.0

### Minor Changes

- [#80123](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80123) [`8bb18b4d686c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8bb18b4d686c) - [ux] - Add decoration to media node when there is active draft comment associated, update plugin state mapping so that create view component is removed when there's node changes invalidating the decoration

  - Save featureFlags plugin state as one of the annotation plugin state

## 1.2.2

### Patch Changes

- [#79658](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79658) [`4b195011d7c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4b195011d7c1) - ED-22112 support remove annotation from supported nodes

## 1.2.1

### Patch Changes

- [#78577](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78577) [`207fbd3685dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/207fbd3685dc) - ED-22111 add supported nodes option to annotation plugin

## 1.2.0

### Minor Changes

- [#78508](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78508) [`1d2b9d7a0542`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1d2b9d7a0542) - Expose setInlineCommentDraftState as one of the annotation plugin actions, extend the action with the ability to apply comment highlight to node, and add optional plugin dependency, FeatureFlagsPlugin

## 1.1.0

### Minor Changes

- [#78363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78363) [`3a8e207fbf7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3a8e207fbf7c) - EDF-27 Cleaned up platform.editor.annotation.decouple-inline-comment-closed_flmox FF. This decouples selected annotation logic from logic to close the inline comment view by default. This fixed a bug where the inline comment view can be unexpectedly opened from doc changes (through remote editors or non-selection altering changes such as expanding / collapsing expand blocks)

## 1.0.2

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224) [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) - ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386) [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) - This changeset exists to bump all editor plugins that currently don't have a major version. This is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.3.5

### Patch Changes

- [#69825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69825) [`e2363da4f6a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e2363da4f6a1) - [No Issue] Replace View Mode API for annotations
- [#69825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69825) [`e2363da4f6a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e2363da4f6a1) - [No Issue] Replace View Mode API for annotations
- [#69825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69825) [`e2363da4f6a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e2363da4f6a1) - [No Issue] Replace View Mode API for annotations

## 0.3.4

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572) [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) - Upgrading @atlaskit/editor-prosemirror dependency

## 0.3.3

### Patch Changes

- [#65713](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65713) [`7a7d83f8e361`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7a7d83f8e361) - Analytics for create inline comment button in highlight actions menu

## 0.3.2

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152) [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) - Updating adf-schema version to 35.5.1

## 0.3.1

### Patch Changes

- [#70084](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70084) [`4d651eb93ab5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4d651eb93ab5) - Add editor-plugin-annotation pr and create shared utils for it in editor-test-helpers
- Updated dependencies

## 0.3.0

### Minor Changes

- [#69617](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69617) [`93f297b73c6f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93f297b73c6f) - [ux] When in editor view mode, creating new comment with annotations plugin will send step to NCS provider

## 0.2.0

### Minor Changes

- [#68790](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68790) [`c6d8affc52d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d8affc52d1) - Support maybeAdd plugins in usePreset. Add typing support for universal preset.

  Now when using the editor API with the universal preset

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802) [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) - Ensure all editor plugins are marked as singletons

## 0.1.1

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031) [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) - ED-21609 Update adf-schema to 35.3.0
- Updated dependencies
