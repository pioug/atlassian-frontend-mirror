# @atlaskit/editor-plugin-avatar-group

## 2.0.4

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 2.0.0

### Major Changes

- [#134135](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134135)
  [`aff992988cf17`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aff992988cf17) -
  Refactor avatar plugin to use editorAPI instead of editorView

## 1.5.3

### Patch Changes

- Updated dependencies

## 1.5.2

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- [#125928](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125928)
  [`bac56c4b39309`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bac56c4b39309) -
  [ED-23425] Avatar group toolbar button should be conditional on the config value showAvatarGroup
- Updated dependencies

## 1.5.0

### Minor Changes

- [#126478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126478)
  [`ca1665ebbfe4d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ca1665ebbfe4d) -
  [ED-23435] Store primary toolbar component registry in a plugin variable instead of in plugin
  state to avoid having to add effects to all plugins and enable SSR for the toolbar. [Breaking
  change] Converted registerComponent from the primary toolbar plugin into an action.

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#120426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120426)
  [`1cb3869ab1a96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1cb3869ab1a96) -
  [ED-23436] Use editor primary toolbar plugin to structure the primary toolbar

### Patch Changes

- Updated dependencies

## 1.2.8

### Patch Changes

- Updated dependencies

## 1.2.7

### Patch Changes

- Updated dependencies

## 1.2.6

### Patch Changes

- Updated dependencies

## 1.2.5

### Patch Changes

- Updated dependencies

## 1.2.4

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#86433](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86433)
  [`88ca3b199a49`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/88ca3b199a49) -
  [ux] EDF-412 Collaborators avatars and telepointer colors are tokenised.

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.0.6

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.5

### Patch Changes

- [#80883](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80883)
  [`5ecfa883d4ba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ecfa883d4ba) -
  React 18 types for alignment, annotation, avatar-group and blocktype plugins.

## 1.0.4

### Patch Changes

- [#80085](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80085)
  [`7febfed958dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7febfed958dd) -
  Update usage of `React.FC` to explicity include `children`

## 1.0.3

### Patch Changes

- [#75947](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75947)
  [`43549c3789b1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/43549c3789b1) -
  Migrate @atlaskit/editor-core to use declarative entry points

## 1.0.2

### Patch Changes

- [#77259](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77259)
  [`9086164a5b62`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9086164a5b62) -
  Use spacing tokens instead of hardcoded values

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386)
  [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) -
  This changeset exists to bump all editor plugins that currently don't have a major version. This
  is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.1.4

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.1.3

### Patch Changes

- [#71136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71136)
  [`c803fea1e6a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c803fea1e6a4) -
  Move all plugin translations to editor-common
- Updated dependencies

## 0.1.2

### Patch Changes

- [#70084](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70084)
  [`4d651eb93ab5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4d651eb93ab5) -
  Add editor-plugin-annotation pr and create shared utils for it in editor-test-helpers
- Updated dependencies

## 0.1.1

### Patch Changes

- Updated dependencies
