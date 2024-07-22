# @atlaskit/editor-plugin-selection-toolbar

## 1.1.15

### Patch Changes

- [#122243](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122243)
  [`b1d7c5ade9b3a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b1d7c5ade9b3a) -
  [ux] EDF-91 Removed platform.editor.enable-selection-toolbar_ucdwd feature flag and enabled
  bydefault.

## 1.1.14

### Patch Changes

- Updated dependencies

## 1.1.13

### Patch Changes

- Updated dependencies

## 1.1.12

### Patch Changes

- Updated dependencies

## 1.1.11

### Patch Changes

- Updated dependencies

## 1.1.10

### Patch Changes

- Updated dependencies

## 1.1.9

### Patch Changes

- [#108898](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108898)
  [`eeaaf0ea11d9a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eeaaf0ea11d9a) -
  [ED-23455] Fix the issue where selection floating toolbar does not appear when clicking drag
  handle

## 1.1.8

### Patch Changes

- Updated dependencies

## 1.1.7

### Patch Changes

- Updated dependencies

## 1.1.6

### Patch Changes

- Updated dependencies

## 1.1.5

### Patch Changes

- [#99563](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99563)
  [`3d4ddbef36b8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d4ddbef36b8) -
  [ux] [EDF-629] Revert floating toolbar click handler changes

## 1.1.4

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.1.3

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- [#96198](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96198)
  [`b69d14268915`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b69d14268915) -
  [ux] EDF-629 fixed floating toolbar elements stealing selection from editor

## 1.1.1

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 1.1.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

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

## 0.2.1

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.2.0

### Minor Changes

- [#68277](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68277)
  [`fe0abf4abc01`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fe0abf4abc01) -
  Enable the selection toolbar to work with live pages view mode

## 0.1.5

### Patch Changes

- Updated dependencies

## 0.1.4

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802)
  [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) -
  Ensure all editor plugins are marked as singletons

## 0.1.3

### Patch Changes

- [#43081](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43081)
  [`efe83787c45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efe83787c45) - [ux]
  ED-20762 Remove blur dom event handler to prevent the toolbar disappearing when using the keyboard
  to access it.

## 0.1.2

### Patch Changes

- [#42935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42935)
  [`d9e2cafc03e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9e2cafc03e) - [ux]
  ED-20664 Fix position of floating toolbar on non full-page editors when using
  editor-plugin-selection-toolbar
- [#42935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42935)
  [`31e453b325e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31e453b325e) - [ux]
  ED-20807 Prevents the selection toolbar from extending outside of the Editor.
- [#42935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42935)
  [`bc3880e7c3c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc3880e7c3c) - [ux]
  ED-20806 Prevents the selection toolbar from overriding the table floating toolbar by preventing
  rendering on anything that's not a text selection.

## 0.1.1

### Patch Changes

- [#42201](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42201)
  [`36241a43553`](https://bitbucket.org/atlassian/atlassian-frontend/commits/36241a43553) - ED-20653
  Removes the selection toolbar when the view loses focus.
