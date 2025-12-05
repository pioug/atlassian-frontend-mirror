# @atlaskit/prosemirror-input-rules

## 3.6.6

### Patch Changes

- [`289a5bde2611b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/289a5bde2611b) -
  [ux] [EDITOR-3750] fix unwanted autoformatting by limiting checks to rules with backwards matches

## 3.6.5

### Patch Changes

- [`55920a92e882a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55920a92e882a) -
  tsignores added for help-center local consumpton removed

## 3.6.4

### Patch Changes

- Updated dependencies

## 3.6.3

### Patch Changes

- [`4f8a0e29aeb69`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4f8a0e29aeb69) -
  [ux] [EDITOR-2762] fix whitespace issue with backwards matching for inline code behind
  platform_editor_lovability_inline_code

## 3.6.2

### Patch Changes

- [`4d676bbdb3ce6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4d676bbdb3ce6) -
  ts-ignore added temporarily to unblock local consumption for help-center, will be removed once
  project refs are setup

## 3.6.1

### Patch Changes

- [`483638368fadb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/483638368fadb) -
  [ux] [EDITOR-2675] add test coverage and prevent range selections after inline formatting
- Updated dependencies

## 3.6.0

### Minor Changes

- [`3c501a06f7c8b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3c501a06f7c8b) -
  [ux] [EDITOR-2460] detect and format backticks that close strings on the LHS

### Patch Changes

- Updated dependencies

## 3.5.0

### Minor Changes

- [`0ac75e0d28c72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0ac75e0d28c72) -
  Migrate @atlaskit/editor-prosemirror/history to @atlaskit/prosemirror-history package

### Patch Changes

- Updated dependencies

## 3.4.2

### Patch Changes

- [`0fdcb6f2f96fd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fdcb6f2f96fd) -
  Sorted type and interface props to improve Atlaskit docs

## 3.4.1

### Patch Changes

- [`098cfbb01dc36`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/098cfbb01dc36) -
  Add missing npmignore files to remove unnecessary files from published package

## 3.4.0

### Minor Changes

- [#196046](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/196046)
  [`b0dad85aa7c35`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b0dad85aa7c35) -
  [ux] [ED-27974] Allow hyperlink plugin to change text to link on blur

## 3.3.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

## 3.2.3

### Patch Changes

- [#164503](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/164503)
  [`9dcc5abdbf880`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9dcc5abdbf880) -
  Removed internal re-exports in input rules

## 3.2.2

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 3.2.1

### Patch Changes

- [#132619](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132619)
  [`492710c431738`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/492710c431738) -
  [ux] [EO2024-22] Fix typeahead interaction when node or table selection

## 3.2.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

## 3.1.1

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 3.1.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

## 3.0.0

### Major Changes

- [#75482](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75482)
  [`18b5a6fb910a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/18b5a6fb910a) - #
  MAJOR CHANGE to `@atlaskit/prosemirror-input-rules` package.

  ## WHY?

  Removing editor-common dependencies from prosemirror-input-rules package.

  This makes it easier for editor updates because it simplifies our dependency graph.

  ## WHAT and HOW?

  These are no longer available via `@atlaskit/prosemirror-input-rules` but are available from
  `@atlaskit/editor-common/types`:
  - InputRuleWrapper
  - InputRuleHandler
  - OnHandlerApply
  - createRule

  These have changed from a `SafePlugin` to a `SafePluginSpec`. In order to update your code you
  need to instantiate a `SafePlugin` (ie. `new SafePlugin(createPlugin( ... ))`).

  `SafePlugin` exists in `@atlaskit/editor-common/safe-plugin`.
  - createPlugin
  - createInputRulePlugin

## 2.4.6

### Patch Changes

- Updated dependencies

## 2.4.5

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 2.4.4

### Patch Changes

- Updated dependencies

## 2.4.3

### Patch Changes

- Updated dependencies

## 2.4.2

### Patch Changes

- Updated dependencies

## 2.4.1

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#37964](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37964)
  [`1944b35b538`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1944b35b538) - move
  common utilities to editor-common, to help with decoupling block-type plugin

### Patch Changes

- Updated dependencies

## 2.3.2

### Patch Changes

- [#37821](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37821)
  [`d2ecb6bf1a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2ecb6bf1a3) -
  [ED-19203] Moved input rule types to editor-common to avoid circular dependencies
- Updated dependencies

## 2.3.1

### Patch Changes

- [#37785](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37785)
  [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) -
  [ED-19233] Import prosemirror libraries from internal facade package

## 2.3.0

### Minor Changes

- [#36631](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36631)
  [`8b891bf3590`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b891bf3590) - This
  change introduces `editor-plugin-hyperlink` which separates the hyperlink plugin from
  `editor-core`. In order to enable this change there are now new entry points on `editor-common`
  (such as `/link`, `/quick-insert`) in order to separate common code. Further
  `prosemirror-input-rules` now has new exports of `createPlugin` and `createRule` which are used in
  many plugins in `editor-core`.

### Patch Changes

- Updated dependencies

## 2.2.5

### Patch Changes

- [#36241](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36241)
  [`5f5ba16de66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5ba16de66) -
  [ED-13910] Fix prosemirror types

## 2.2.4

### Patch Changes

- [#35782](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35782)
  [`73b5128036b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73b5128036b) -
  [ED-17082] Mark package as a singleton one
- Updated dependencies

## 2.2.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 2.2.2

### Patch Changes

- [#33771](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33771)
  [`a142ba1aa28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a142ba1aa28) -
  [ED17172] Bump prosemirror-model to 1.16.0 and prosemirror-view to 1.23.7 and removed work-arounds
  for fixed issues
- Updated dependencies

## 2.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 2.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 2.1.12

### Patch Changes

- [#33004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33004)
  [`0ffb55018c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ffb55018c9) - Revert
  "[ED-17172] Bumped prosemirror-view from 1.23.2 to 1.23.7 and removed work-around for fixed
  issues"
- Updated dependencies

## 2.1.11

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 2.1.10

### Patch Changes

- Updated dependencies

## 2.1.9

### Patch Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`0606572f9b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0606572f9b8) - [ux]
  ED-15348 docs(changeset): ED-15348 Fix a bug preventing typeahead actions to be fired from a gap
  cursor. Typing a typeahead trigger key (/, : or @) should pop-up a typeahead menu. However, if the
  current selection is inside a gap cursor, the trigger character is inserted and the pop-up menu
  doesn't open. This changeset fixes that.
- Updated dependencies

## 2.1.8

### Patch Changes

- Updated dependencies

## 2.1.7

### Patch Changes

- Updated dependencies

## 2.1.6

### Patch Changes

- Updated dependencies

## 2.1.5

### Patch Changes

- Updated dependencies

## 2.1.4

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- [#18526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18526)
  [`4e6fbaf5898`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6fbaf5898) - ED-14117
  Change EditorState.apply type to receive readonly transaction

  Transactions should not be mutated after being dispatched as it can lead to unexpected behaviour.
  This change patches the relevant types declared in prosemirror-state as a compile-time safeguard.

- Updated dependencies

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

- [#10943](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10943)
  [`312a2810b0b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/312a2810b0b) - [ux]
  ED-12931 Fix input rules replacing text outside of matched word in a long paragraph

## 2.0.0

### Major Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`d989a24dd88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d989a24dd88) -
  [ED-11915] New package to manage auto formatting rules without a undoInputRules

### Minor Changes

- [`54ec986ebff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54ec986ebff) -
  [ED-11915] Export editor/input-rules OnHandlerApply type
