# @atlaskit/editor-plugin-insert-block

## 1.3.6

### Patch Changes

- Updated dependencies

## 1.3.5

### Patch Changes

- Updated dependencies

## 1.3.4

### Patch Changes

- [#107314](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107314)
  [`799512a15da6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/799512a15da6) -
  [ED-23568] Rerendering the primary toolbar component caused the insert block toggle to stop
  working, fixed the lifecycle methods on that component to be able to deal with a rerender

## 1.3.3

### Patch Changes

- [#103091](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103091)
  [`736512792df6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/736512792df6) -
  Fix analytics inputMethod bug for inserting a macro

## 1.3.2

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#98283](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98283)
  [`291c762e17a0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/291c762e17a0) -
  [ED-22802] Introduce insertBlock.actions.toggleAdditionalMenu API

### Patch Changes

- Updated dependencies

## 1.2.5

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5
- Updated dependencies

## 1.2.4

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- [#92968](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92968)
  [`f33e18f5cfa8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f33e18f5cfa8) -
  [ux] [ED-22585] - Made sure that table buttons do not render if they are not visible
- Updated dependencies

## 1.2.1

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 1.2.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.1.9

### Patch Changes

- [#85055](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/85055)
  [`0eb5901fd1e7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0eb5901fd1e7) -
  Fix the editor not focusing after inserting an emoji from the toolbar.

## 1.1.8

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.1.7

### Patch Changes

- Updated dependencies

## 1.1.6

### Patch Changes

- [#81852](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81852)
  [`c784155d4ad6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c784155d4ad6) -
  React 18 types for editor-plugin-insert-block

## 1.1.5

### Patch Changes

- [#80518](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80518)
  [`e0d5e8fd9495`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e0d5e8fd9495) -
  Migrates some style calls to a slightly different object syntax and other minor cleanup around
  eslint rules.

## 1.1.4

### Patch Changes

- [#76323](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76323)
  [`5beb55a40496`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5beb55a40496) -
  updated EXTRA_SPACE_EXCLUDING_ELEMENTLIST to fix single item scroll issue
- Updated dependencies

## 1.1.3

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- [#77599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77599)
  [`a7b1a6b762eb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a7b1a6b762eb) -
  [ux] Table picker popup displays text using column x rows pattern and table picker button uses
  label column by row.

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#72122](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72122)
  [`c3186450404a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3186450404a) -
  Breaking change:

  ## WHAT?:

  Removing feature flags:

  - singleLayout
  - newInsertionBehaviour
  - interactiveExpand
  - findReplace
  - findReplaceMatchCase
  - extendFloatingToolbar

  ## WHY?:

  Because the flags and props are unused/by default active. Removing them will reduce our
  maintenance burden

  ## HOW to update your code:

  - If you were using the feature flag - the behaviour is now default and you can remove the flags
  - If you were not using the feature flag - the behaviour is now default.
  - If you have opted out of using the feature flag - we have been careful to ensure no-one has
    opted out of the behaviours. If you do have an issue please reach out to #help-editor.

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [#72440](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72440)
  [`eee41a9f4bda`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eee41a9f4bda) -
  [ux] Ensures that when a table is inserted via popup, the table has a blinking cursor.

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386)
  [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) -
  This changeset exists to bump all editor plugins that currently don't have a major version. This
  is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.3.6

### Patch Changes

- [#72081](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72081)
  [`4487160917d2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4487160917d2) -
  [ux] ED-22052: adds button type attribute to non atlaskit button instances

## 0.3.5

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.3.4

### Patch Changes

- [#71128](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71128)
  [`d8b202a941c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d8b202a941c9) -
  [ux] When the Right Arrow is pressed and the selection reaches the last row of the default popup,
  the grid should expand
- Updated dependencies

## 0.3.3

### Patch Changes

- [#70300](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70300)
  [`9622d585a805`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9622d585a805) -
  [ux] decreased popup size when wrapping selection with arrowRight

## 0.3.2

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- [#68670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68670)
  [`801899ef02f2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/801899ef02f2) -
  [ux] Added accessibility via keyboard for arrows left, right, up and down
- Updated dependencies

## 0.3.0

### Minor Changes

- [#68790](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68790)
  [`c6d8affc52d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d8affc52d1) -
  Support maybeAdd plugins in usePreset. Add typing support for universal preset.

  Now when using the editor API with the universal preset

### Patch Changes

- Updated dependencies

## 0.2.27

### Patch Changes

- Updated dependencies

## 0.2.26

### Patch Changes

- [#63634](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63634)
  [`669b7038b354`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/669b7038b354) -
  chenged aria-label text

## 0.2.25

### Patch Changes

- [#67703](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67703)
  [`d5303cb0f0cb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d5303cb0f0cb) -
  When a table is inserted via the table selector popup, an analytics event should be sent with the
  totalRowCount and totalColumnCount and the input method picker. Removed ASCII and TYPEAHEAD
  inputMethod from table selector command.
- Updated dependencies

## 0.2.24

### Patch Changes

- Updated dependencies

## 0.2.23

### Patch Changes

- Updated dependencies

## 0.2.22

### Patch Changes

- Updated dependencies

## 0.2.21

### Patch Changes

- [#67051](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67051)
  [`08b5bd90a149`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/08b5bd90a149) -
  [ux] The table selector popup should gradually expand to 10 x 10 rows when hovered
- Updated dependencies

## 0.2.20

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.2.19

### Patch Changes

- [#65874](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65874)
  [`282862992d2a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/282862992d2a) -
  [ux] added popup to table selector button using mouse movement

## 0.2.18

### Patch Changes

- Updated dependencies

## 0.2.17

### Patch Changes

- Updated dependencies

## 0.2.16

### Patch Changes

- Updated dependencies

## 0.2.15

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802)
  [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) -
  Ensure all editor plugins are marked as singletons

## 0.2.14

### Patch Changes

- Updated dependencies

## 0.2.13

### Patch Changes

- Updated dependencies

## 0.2.12

### Patch Changes

- [#64152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64152)
  [`4bc51e1731ba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4bc51e1731ba) -
  [ux] Added a table selector button to the full page toolbar and button styles
- Updated dependencies

## 0.2.11

### Patch Changes

- Updated dependencies

## 0.2.10

### Patch Changes

- Updated dependencies

## 0.2.9

### Patch Changes

- Updated dependencies

## 0.2.8

### Patch Changes

- Updated dependencies

## 0.2.7

### Patch Changes

- Updated dependencies

## 0.2.6

### Patch Changes

- [#61337](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61337)
  [`2d827c1d6c40`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2d827c1d6c40) -
  Remove emojiProvider property from the sharedState of the emoji plugin. This avoids a performance
  degradation if the provider is not memoised. It can still be retrieved via the provider factory if
  required internally.
- Updated dependencies

## 0.2.5

### Patch Changes

- [#60612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60612)
  [`7edc766361a2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7edc766361a2) -
  Created an EditorCommad on table plugin to insert a table of custom size

## 0.2.4

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#43507](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43507)
  [`a9695768de6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a9695768de6) -
  Extracted insert block plugin code from editor-core to @atlaskit/editor-plugin-insert-block

## 0.1.1

### Patch Changes

- [#43646](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43646)
  [`d43f8e9402f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d43f8e9402f) - Make
  feature flags plugin optional in all plugins including:

  - analytics
  - base
  - card
  - code-block
  - expand
  - extension
  - floating-toolbar
  - hyperlink
  - insert-block
  - layout
  - layout
  - list
  - media
  - paste
  - rule
  - table
  - tasks-and-decisions

  We already treat it as optional in the plugins, so this is just ensuring that the plugin is not
  mandatory to be added to the preset.
