# @atlaskit/editor-plugin-type-ahead

## 3.1.5

### Patch Changes

- Updated dependencies

## 3.1.4

### Patch Changes

- [#199353](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199353)
  [`f2d4ca35574b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2d4ca35574b8) -
  Internal changes to how border radius values are applied. No visual change.
- Updated dependencies

## 3.1.3

### Patch Changes

- [#195649](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195649)
  [`231bb33e06dfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/231bb33e06dfe) -
  EDITOR-1131 Bump adf-schema version to 50.2.0
- Updated dependencies

## 3.1.2

### Patch Changes

- [`f62a413f74677`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f62a413f74677) -
  ENGHEALTH-32249 A11y violation detected for rule "aria-valid-attr-value" for
  "@atlaskit/editor-core" from "Editor"
- Updated dependencies

## 3.1.1

### Patch Changes

- [#191913](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191913)
  [`6d1e56695e91d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d1e56695e91d) -
  EDITOR-1131 Bump adf-schema package to 50.0.0
- Updated dependencies

## 3.1.0

### Minor Changes

- [#189314](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189314)
  [`22c6251496010`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22c6251496010) -
  Exported missing types that were already being inferred from existing exports

### Patch Changes

- Updated dependencies

## 3.0.5

### Patch Changes

- [#185723](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185723)
  [`751aeb4580469`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/751aeb4580469) -
  ED-28315 clean up fg platform_editor_controls_patch_13
- Updated dependencies

## 3.0.4

### Patch Changes

- [#187144](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187144)
  [`a16147d8fbdfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a16147d8fbdfe) -
  Bump @atlaskit/adf-schema to v49.0.5
- Updated dependencies

## 3.0.3

### Patch Changes

- [#183158](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/183158)
  [`d6096ec5c8ad9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d6096ec5c8ad9) -
  Migrate to useSharedPluginStateWithSelector
- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [#181781](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/181781)
  [`e0060cc2c2eb7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e0060cc2c2eb7) -
  ED-28417 Offline Editing: Update the type ahead error to clear on new requests, and make error
  more generic.
- Updated dependencies

## 3.0.0

### Major Changes

- [#181024](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/181024)
  [`8e80c487ca307`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e80c487ca307) - ##
  Make `@atlaskit/editor-common` a peer dependency

  **WHAT:** `@atlaskit/editor-common` has been moved from `dependencies` to `peerDependencies` in
  all editor plugin packages.

  **WHY:** This change ensures that only a single version of `@atlaskit/editor-common` is used in
  consuming applications, preventing issues caused by multiple versions of singleton libraries (such
  as context mismatches or duplicated state). This is especially important for packages that rely on
  shared context or singletons.

  **HOW TO ADJUST:**

  - Consumers must now explicitly install `@atlaskit/editor-common` in their own project if they use
    any of these editor plugins.
  - Ensure the version you install matches the version required by the plugins.
  - You can use the
    [`check-peer-dependencies`](https://www.npmjs.com/package/check-peer-dependencies) package to
    verify that all required peer dependencies are installed and compatible.
  - Example install command:
    ```
    npm install @atlaskit/editor-common
    ```
    or
    ```
    yarn add @atlaskit/editor-common
    ```

  **Note:** This is a breaking change. If `@atlaskit/editor-common` is not installed at the
  application level, you may see errors or unexpected behavior.

### Patch Changes

- Updated dependencies

## 2.7.20

### Patch Changes

- [#175339](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175339)
  [`d4115e4055a0a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d4115e4055a0a) -
  ED-28314 Cleanup platform_editor_controls_patch_12
- Updated dependencies

## 2.7.19

### Patch Changes

- Updated dependencies

## 2.7.18

### Patch Changes

- [#172583](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/172583)
  [`40f387a0c0962`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/40f387a0c0962) -
  Clean up platform_editor_controls_patch_2
- Updated dependencies

## 2.7.17

### Patch Changes

- Updated dependencies

## 2.7.16

### Patch Changes

- Updated dependencies

## 2.7.15

### Patch Changes

- Updated dependencies

## 2.7.14

### Patch Changes

- [#169326](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169326)
  [`f93af5ddb6981`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f93af5ddb6981) -
  [ED-28214] Fix a bug where in quick insert, editor loses focus and query disappears after pressing
  space when there's no matching result

## 2.7.13

### Patch Changes

- Updated dependencies

## 2.7.12

### Patch Changes

- [#165113](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165113)
  [`867bcb05452bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/867bcb05452bf) -
  Cleaned up platform_editor_controls_patch_analytics and platform_editor_controls_patch_analytics_2
- Updated dependencies

## 2.7.11

### Patch Changes

- [#164625](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164625)
  [`aac10c2d4c08d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aac10c2d4c08d) -
  [ED-26900] Add a new config, getMoreOptionsButtonConfig, to TypeAheadHandler so that it can
  support adding a more option button to typeahead list
- Updated dependencies

## 2.7.10

### Patch Changes

- Updated dependencies

## 2.7.9

### Patch Changes

- Updated dependencies

## 2.7.8

### Patch Changes

- [#161707](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161707)
  [`e43a999ba12ab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e43a999ba12ab) -
  [ED-28087] Fix typeahead pre-emptively selecting from menu when pressing space
- Updated dependencies

## 2.7.7

### Patch Changes

- Updated dependencies

## 2.7.6

### Patch Changes

- Updated dependencies

## 2.7.5

### Patch Changes

- [#154311](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154311)
  [`a9aff3b749e22`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a9aff3b749e22) -
  [ux] EDITOR-730 Fix bug with typeaheads and legacy content extension that resulted in typeahead
  text remaining in the inserted element
- Updated dependencies

## 2.7.4

### Patch Changes

- Updated dependencies

## 2.7.3

### Patch Changes

- Updated dependencies

## 2.7.2

### Patch Changes

- [#154149](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154149)
  [`4b955e247c793`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4b955e247c793) -
  [ED-27560] Migrate to useSharedPluginStateSelector for text color, toolbar lists indentation,
  type-ahead, undo-redo plugins

## 2.7.1

### Patch Changes

- [#153608](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153608)
  [`3fd5ce348dc5c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3fd5ce348dc5c) -
  EDITOR-740 - cleanup FG platform_editor_update_type_ahead_locale
- Updated dependencies

## 2.7.0

### Minor Changes

- [#149096](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149096)
  [`831e11ae4484e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/831e11ae4484e) -
  ED-27855 remove duplicate typeahead invoked events

### Patch Changes

- Updated dependencies

## 2.6.4

### Patch Changes

- Updated dependencies

## 2.6.3

### Patch Changes

- Updated dependencies

## 2.6.2

### Patch Changes

- [#151451](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/151451)
  [`5d06214eacce9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d06214eacce9) -
  [ux] Bring ounline back when ViewMore button is focused via keyboard.
- Updated dependencies

## 2.6.1

### Patch Changes

- Updated dependencies

## 2.6.0

### Minor Changes

- [#149207](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149207)
  [`41c4599b89f3c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/41c4599b89f3c) -
  ED-27854 Add invocationMethod to typeahead closed event

### Patch Changes

- Updated dependencies

## 2.5.4

### Patch Changes

- Updated dependencies

## 2.5.3

### Patch Changes

- Updated dependencies

## 2.5.2

### Patch Changes

- [#142191](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142191)
  [`8a39e59bec14f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8a39e59bec14f) -
  A11Y-9980: Update view more button aria label to be more descriptive.
- Updated dependencies

## 2.5.1

### Patch Changes

- [#142352](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142352)
  [`05903fde6d94d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/05903fde6d94d) -
  Internal change to use Compiled variant of `@atlaskit/primitives`.
- Updated dependencies

## 2.5.0

### Minor Changes

- [#139089](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139089)
  [`69dcdc0c4a543`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/69dcdc0c4a543) -
  ED-26588 Start activity session and persist active session when type ahead and element broswer is
  open

### Patch Changes

- Updated dependencies

## 2.4.2

### Patch Changes

- [#142098](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142098)
  [`e84b542ba2d44`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e84b542ba2d44) -
  [ED-27614] Put quick insert placeholder behind a separate
  FGplatform_editor_quick_insert_placeholder
- Updated dependencies

## 2.4.1

### Patch Changes

- [#140813](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140813)
  [`c4756a5c1a4ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c4756a5c1a4ae) -
  Migrating offline editing feature gates to a new experiment "platform_editor_offline_editing_web"
- Updated dependencies

## 2.4.0

### Minor Changes

- [#139256](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139256)
  [`0fea9bc4da71a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fea9bc4da71a) -
  ED-27447 add typeahead close analytics event

### Patch Changes

- Updated dependencies

## 2.3.4

### Patch Changes

- [#139216](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139216)
  [`e8f596d2b1910`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e8f596d2b1910) -
  [ux] Cleaned up platform_editor_controls_patch_1 FG
- Updated dependencies

## 2.3.3

### Patch Changes

- [#135872](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135872)
  [`d50ea6acabdb3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d50ea6acabdb3) -
  [ux] [ED-27142] Enable quick insert input placeholder
- Updated dependencies

## 2.3.2

### Patch Changes

- Updated dependencies

## 2.3.1

### Patch Changes

- [#135114](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135114)
  [`10c7a0e5424f9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/10c7a0e5424f9) -
  Remove the typeahead trigger when a users actions closes the panel, under
  `platform_editor_controls` experiment and `platform_editor_controls_patch_1` feature gate

## 2.3.0

### Minor Changes

- [#135301](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135301)
  [`282513a152fa2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/282513a152fa2) -
  [A11Y-9960] Extract the AssistiveText component from the typeahead plugin for reuse in other
  editor plugins

### Patch Changes

- Updated dependencies

## 2.2.4

### Patch Changes

- [#133624](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133624)
  [`0054ad6978c1b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0054ad6978c1b) -
  Fixed issue when search term is added to document when opening view more from Quickinsert
- Updated dependencies

## 2.2.3

### Patch Changes

- [#132892](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132892)
  [`6db8f28318224`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6db8f28318224) -
  update type ahead locale, add key to ai preview react list child
- Updated dependencies

## 2.2.2

### Patch Changes

- [#132152](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132152)
  [`4d3f5ccdc005c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4d3f5ccdc005c) -
  [https://product-fabric.atlassian.net/browse/ED-26645](ED-26645) - fix typeahead height issue
- Updated dependencies

## 2.2.1

### Patch Changes

- [#130684](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130684)
  [`0656a8915e18f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0656a8915e18f) -
  updated existing fix for focusOut typeahead trigger duplication to also include IE/Edge

## 2.2.0

### Minor Changes

- [#130262](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130262)
  [`236c73af67c7b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/236c73af67c7b) -
  [ED-24873] This change is cleaning up code from the element templates experiment
  `platform_editor_element_level_templates`.

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

- [#122662](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122662)
  [`4b5cbb4f25f54`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4b5cbb4f25f54) -
  FD-80149: cleans up platform_editor_react18_phase2_v2 in typeahead
- Updated dependencies

## 2.1.4

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- [#122304](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122304)
  [`55aeeb7141654`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55aeeb7141654) -
  [HOT-115591] Fix emoji popup close when scrolling
- [#122337](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122337)
  [`2775fb4a3b7d6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2775fb4a3b7d6) -
  [ux] [ED-26824] Add keyboard support (up/down to navigate, enter to insert) to view more button
- Updated dependencies

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#120472](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120472)
  [`73c800ab5f2fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73c800ab5f2fc) -
  ED-26766 update adf-schema from 47.2.1 to 47.6.0 and adf-schema-json from 1.27.0 to 1.31.0

### Patch Changes

- [#121073](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121073)
  [`9c197731fcbf8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9c197731fcbf8) -
  [ux] [ED-26824] When platform_editor_controls is enabled, add 'View more' button to quick
  insertpopup to open element browser modal
- Updated dependencies

## 2.0.5

### Patch Changes

- [#121049](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121049)
  [`0c8ca53dace33`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0c8ca53dace33) -
  [ux] Uses ViewAllButtonItem from the editor-element-browser package instead of custom Pressable
  button

## 2.0.4

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 2.0.3

### Patch Changes

- [#120431](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120431)
  [`17173ce340cdc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/17173ce340cdc) -
  [ED-26763] Support inserting selected item by Enter

## 2.0.2

### Patch Changes

- [#120426](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120426)
  [`1fc7b1519dbcf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1fc7b1519dbcf) -
  Uses a separate FF for the new QuickInsert and Right rail to split them from the other Editor
  Controls features.
- Updated dependencies

## 2.0.1

### Patch Changes

- [#118492](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118492)
  [`cf0944583828b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cf0944583828b) -
  [ED-26542] Fix typeahead popup doesn't close when clicking outside
- [#119058](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119058)
  [`4f8ad7d7497be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4f8ad7d7497be) -
  [ux] [ED-26575] Add placeholder to quick insert input field
- Updated dependencies

## 2.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

### Patch Changes

- Updated dependencies

## 1.13.7

### Patch Changes

- Updated dependencies

## 1.13.6

### Patch Changes

- Updated dependencies

## 1.13.5

### Patch Changes

- Updated dependencies

## 1.13.4

### Patch Changes

- [#115416](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115416)
  [`7be1394d86a9c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7be1394d86a9c) -
  Fixes undeclared dependency on @atlaskit/icon in package.json dependencies from version 1.13.3.

## 1.13.3

### Patch Changes

- [#114119](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114119)
  [`32771ea219498`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32771ea219498) -
  [ux] Opens right rail from the QuickInsert menu via context panel plugin's action
- Updated dependencies

## 1.13.2

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 1.13.1

### Patch Changes

- [#112096](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112096)
  [`5d95afdd358ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d95afdd358ac) -
  [ux] Creates a package for new QuickInsert and Right Rail UI and adds it under a FF
- Updated dependencies

## 1.13.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.12.2

### Patch Changes

- Updated dependencies

## 1.12.1

### Patch Changes

- Updated dependencies

## 1.12.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.11.5

### Patch Changes

- Updated dependencies

## 1.11.4

### Patch Changes

- [#101866](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101866)
  [`f22dfbe75b007`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f22dfbe75b007) -
  [ux] Fix first typeahead item inserting in an inconsistent manner while offline

## 1.11.3

### Patch Changes

- Updated dependencies

## 1.11.2

### Patch Changes

- Updated dependencies

## 1.11.1

### Patch Changes

- Updated dependencies

## 1.11.0

### Minor Changes

- [#171350](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171350)
  [`436dfb28a4833`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/436dfb28a4833) -
  [ux] Support disabled type-ahead items while user is offline for media, emoji, and mentions.

### Patch Changes

- Updated dependencies

## 1.10.8

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0
- Updated dependencies

## 1.10.7

### Patch Changes

- Updated dependencies

## 1.10.6

### Patch Changes

- [#164952](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/164952)
  [`0faf43580a9d8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0faf43580a9d8) -
  ED-25612: moves typeahead from reactdom render to portalprovider
- Updated dependencies

## 1.10.5

### Patch Changes

- [#159777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159777)
  [`e708d0a9e4b36`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e708d0a9e4b36) -
  Refactoring plugins to meet folder standards.
- Updated dependencies

## 1.10.4

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 1.10.3

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18

## 1.10.2

### Patch Changes

- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1
- Updated dependencies

## 1.10.1

### Patch Changes

- Updated dependencies

## 1.10.0

### Minor Changes

- [#152480](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152480)
  [`a3b60fc1e1aef`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3b60fc1e1aef) -
  Refactored typeahead assistiveText component to functional component and added tests.

### Patch Changes

- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1
- Updated dependencies

## 1.9.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 1.8.13

### Patch Changes

- Updated dependencies

## 1.8.12

### Patch Changes

- Updated dependencies

## 1.8.11

### Patch Changes

- Updated dependencies

## 1.8.10

### Patch Changes

- Updated dependencies

## 1.8.9

### Patch Changes

- Updated dependencies

## 1.8.8

### Patch Changes

- Updated dependencies

## 1.8.7

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.8.6

### Patch Changes

- Updated dependencies

## 1.8.5

### Patch Changes

- [#138136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138136)
  [`35938ecf46ba7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35938ecf46ba7) -
  [ED-24755] Implement insert functionality of element templates and fire document inserted event
  with template IDs
- Updated dependencies

## 1.8.4

### Patch Changes

- [#137234](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137234)
  [`e80c81de138e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e80c81de138e9) -
  [ux] [ED-24803] Experiment for editor block controls which adds a button to insert quickInsert
  elements
- Updated dependencies

## 1.8.3

### Patch Changes

- [#136348](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136348)
  [`fb4fb56f1da7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fb4fb56f1da7c) -
  Use optimised entry-points on editor-common for browser.
- Updated dependencies

## 1.8.2

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 1.8.1

### Patch Changes

- [#132619](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132619)
  [`492710c431738`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/492710c431738) -
  [ux] [EO2024-22] Fix typeahead interaction when node or table selection
- Updated dependencies

## 1.8.0

### Minor Changes

- [#130825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130825)
  [`d8a00de5637ff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d8a00de5637ff) -
  ENGHEALTH-9890: Bumps React peer dependency for Lego editor plugins

## 1.7.1

### Patch Changes

- Updated dependencies

## 1.7.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

### Patch Changes

- Updated dependencies

## 1.6.3

### Patch Changes

- [#125980](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125980)
  [`93070430085a6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93070430085a6) -
  fix editor popup overflow issue
- Updated dependencies

## 1.6.2

### Patch Changes

- [#124534](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124534)
  [`febd01f800a8f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/febd01f800a8f) -
  [ED-24356] Update spacing and popup height of typeahead to fit more elements in view under the
  experiment `platform_editor_more_elements_in_quick_insert_view`

## 1.6.1

### Patch Changes

- Updated dependencies

## 1.6.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`a2c733eaa3214`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a2c733eaa3214) -
  [ED-24348] Change icon size for quick insert tyeahead to 32x32 when
  platform_editor_more_elements_in_quick_insert_view is on
- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

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

- Updated dependencies

## 1.4.2

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
- Updated dependencies

## 1.4.1

### Patch Changes

- [#116224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116224)
  [`ff938650963d9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff938650963d9) -
  ED-23775 This change prevents duplicated analytic events from firing when inserting mentions and
  emojis via the quickInsert typeAhead menu.

## 1.4.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 1.2.5

### Patch Changes

- Updated dependencies

## 1.2.4

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.2.3

### Patch Changes

- [#99848](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99848)
  [`add0947043d4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/add0947043d4) -
  ECA11Y-18: Remove inappropriate aria-labels from Typeahead dropdown

## 1.2.2

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 1.2.1

### Patch Changes

- [#99635](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99635)
  [`647b9c0a5da8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/647b9c0a5da8) -
  [ED-23193] Fix typeahead analytics that were not firing to now use EditorAPI to fire events.
- Updated dependencies

## 1.2.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 1.1.9

### Patch Changes

- Updated dependencies

## 1.1.8

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 1.1.7

### Patch Changes

- [#98137](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98137)
  [`b1ddc8df2070`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b1ddc8df2070) -
  [ED-23195] Refactor React components to use useRef inside functional components
- Updated dependencies

## 1.1.6

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.1.5

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 1.1.3

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1

## 1.1.2

### Patch Changes

- [#94717](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94717)
  [`40f38eb0a512`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40f38eb0a512) -
  Cleaning up feature flag for inserting nodes in ordered list.

  Fix bugs for incorrect ordered list order with action & improve selection behaviour on insert

- Updated dependencies

## 1.1.1

### Patch Changes

- [#93689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93689)
  [`5ba5d2b4a9ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ba5d2b4a9ac) -
  Updating adf-schema version to 35.10.0

## 1.1.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.0.11

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options

## 1.0.10

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 1.0.9

### Patch Changes

- [#88038](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88038)
  [`19ac4de34153`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19ac4de34153) -
  update 'w3c-keyname' dependency to 2.1.8

## 1.0.8

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 1.0.7

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

## 1.0.6

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.5

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0

## 1.0.4

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

## 1.0.3

### Patch Changes

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

- Updated dependencies

## 1.0.2

### Patch Changes

- [#73177](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73177)
  [`22452599ed8f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/22452599ed8f) -
  Move styling for certain packages to tokens.

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

## 0.9.6

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.9.5

### Patch Changes

- [#71136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71136)
  [`c803fea1e6a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c803fea1e6a4) -
  Move all plugin translations to editor-common
- Updated dependencies

## 0.9.4

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 0.9.3

### Patch Changes

- Updated dependencies

## 0.9.2

### Patch Changes

- [#67189](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67189)
  [`93cbf53ca0e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93cbf53ca0e0) -
  Removing instances of WithPluginState from mentions and type-ahead plugins.

## 0.9.1

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.9.0

### Minor Changes

- [#64335](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64335)
  [`efc8826c907f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/efc8826c907f) -
  [ux] [ED-16509] Restart numbered list inserting nodes via QUICK INSERT, nodes including : panels,
  expands, decisions, tables, layout, quotes, actions, dividers, headings. Changes are being guarded
  behind feature flag platform.editor.ordered-list-inserting-nodes_bh0vo

### Patch Changes

- Updated dependencies

## 0.8.6

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 0.8.5

### Patch Changes

- [#61655](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61655)
  [`6fec14da1838`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6fec14da1838) -
  ED-21403 Fixed accessiblity issue with TypeAheadItems read by VoiceOver

## 0.8.4

### Patch Changes

- [#61465](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61465)
  [`fc0f13b8bc95`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fc0f13b8bc95) -
  Prefix `componentWillMount`, `componentWillUnmount` and `componentWillReceiveProps` with `UNSAFE_`
  in the `AssistiveText` component

## 0.8.3

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808)
  [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) -
  ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 0.8.2

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246)
  [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) -
  ED-21371 Update adf-schema to 35.1.0

## 0.8.1

### Patch Changes

- Updated dependencies

## 0.8.0

### Minor Changes

- [#59258](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59258)
  [`8776707df7cd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8776707df7cd) -
  ECA11Y-48 Updated assistive text

## 0.7.8

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 0.7.7

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763)
  [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) -
  update ADF schema

## 0.7.6

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790)
  [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) -
  ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 0.7.5

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417)
  [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971
  Upgrade adf-schema package to ^34.0.0

## 0.7.4

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379)
  [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763
  Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 0.7.3

### Patch Changes

- [#42995](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42995)
  [`a527682dee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a527682dee6) - add in
  missing dependencies for imported types

## 0.7.2

### Patch Changes

- Updated dependencies

## 0.7.1

### Patch Changes

- [#41802](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41802)
  [`d20ecc5a9db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d20ecc5a9db) - Apply
  improved linting to type-ahead plugin.

## 0.7.0

### Minor Changes

- [#41047](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41047)
  [`8f0b00d165f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f0b00d165f) -
  [ED-20003] Extract TypeAhead from editor-core to its own package
  @atlaskit/editor-plugin-type-ahead

## 0.6.0

### Minor Changes

- [#41459](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41459)
  [`9874d0f70b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9874d0f70b0) -
  [ED-20003] TypeAhead extraction: Replace the mobile view-subscription with proper API

## 0.5.0

### Minor Changes

- [#41143](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41143)
  [`7d6dfe2befa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d6dfe2befa) -
  [ED-20003] Replace TyepAhead API for Editor Plugin Injection API

## 0.4.0

### Minor Changes

- [#40955](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40955)
  [`30dc2b1e6c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30dc2b1e6c9) -
  [ED-19746] Decoupling mentions plugin from Editor-core libraries

## 0.3.2

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [#39575](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39575)
  [`ef0c2a89c72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef0c2a89c72) - Add
  isTypeAheadOpen action to type-ahead plugin. Decouple placeholder plugin from editor-core.

## 0.2.0

### Minor Changes

- [#39325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39325)
  [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) - Updating
  all plugins with minor version to correct issue with semver.

## 0.1.1

### Patch Changes

- [#39177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39177)
  [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added
  atlaskit docs to all existing plugins.
