# @atlaskit/editor-plugin-quick-insert

## 3.0.6

### Patch Changes

- Updated dependencies

## 3.0.5

### Patch Changes

- Updated dependencies

## 3.0.4

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- [#186309](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/186309)
  [`286ffe3c6aa33`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/286ffe3c6aa33) -
  [ED-28522] Fix a regression where view more button in quick insert in comment editor is shown,
  which it should not

## 3.0.2

### Patch Changes

- [#183158](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/183158)
  [`d6096ec5c8ad9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d6096ec5c8ad9) -
  Migrate to useSharedPluginStateWithSelector
- Updated dependencies

## 3.0.1

### Patch Changes

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

## 2.6.4

### Patch Changes

- [#175339](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175339)
  [`d4115e4055a0a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d4115e4055a0a) -
  ED-28314 Cleanup platform_editor_controls_patch_12
- Updated dependencies

## 2.6.3

### Patch Changes

- Updated dependencies

## 2.6.2

### Patch Changes

- Updated dependencies

## 2.6.1

### Patch Changes

- Updated dependencies

## 2.6.0

### Minor Changes

- [#166543](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166543)
  [`e817523123ea3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e817523123ea3) -
  Trim end whitespace from quick insert queries

## 2.5.7

### Patch Changes

- Updated dependencies

## 2.5.6

### Patch Changes

- Updated dependencies

## 2.5.5

### Patch Changes

- [#164625](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164625)
  [`aac10c2d4c08d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aac10c2d4c08d) -
  [ED-26900] Add a new config, getMoreOptionsButtonConfig, to TypeAheadHandler so that it can
  support adding a more option button to typeahead list
- Updated dependencies

## 2.5.4

### Patch Changes

- Updated dependencies

## 2.5.3

### Patch Changes

- Updated dependencies

## 2.5.2

### Patch Changes

- Updated dependencies

## 2.5.1

### Patch Changes

- Updated dependencies

## 2.5.0

### Minor Changes

- [#150874](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150874)
  [`447821a1397a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/447821a1397a2) -
  Used plugin selector conditionally behind feature flag

## 2.4.2

### Patch Changes

- Updated dependencies

## 2.4.1

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#139089](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139089)
  [`69dcdc0c4a543`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/69dcdc0c4a543) -
  ED-26588 Start activity session and persist active session when type ahead and element broswer is
  open

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#139139](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139139)
  [`7f6b665d778dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7f6b665d778dd) -
  [https://product-fabric.atlassian.net/browse/ED-27499](ED-27499) - the new
  `@atlassian/confluence-presets` package with Confluence `full-page` preset is created

### Patch Changes

- Updated dependencies

## 2.2.4

### Patch Changes

- Updated dependencies

## 2.2.3

### Patch Changes

- Updated dependencies

## 2.2.2

### Patch Changes

- Updated dependencies

## 2.2.1

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#130262](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130262)
  [`236c73af67c7b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/236c73af67c7b) -
  [ED-24873] This change is cleaning up code from the element templates experiment
  `platform_editor_element_level_templates`.

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- Updated dependencies

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#122563](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122563)
  [`ee7df79353727`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee7df79353727) -
  Changes dedupe logic to check title and description instead of just title

## 2.0.6

### Patch Changes

- Updated dependencies

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- [#121073](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121073)
  [`9c197731fcbf8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9c197731fcbf8) -
  [ux] [ED-26824] When platform_editor_controls is enabled, add 'View more' button to quick
  insertpopup to open element browser modal
- Updated dependencies

## 2.0.2

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 2.0.1

### Patch Changes

- [#120426](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120426)
  [`1fc7b1519dbcf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1fc7b1519dbcf) -
  Uses a separate FF for the new QuickInsert and Right rail to split them from the other Editor
  Controls features.
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

## 1.10.2

### Patch Changes

- Updated dependencies

## 1.10.1

### Patch Changes

- [#112096](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112096)
  [`5d95afdd358ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d95afdd358ac) -
  [ux] Creates a package for new QuickInsert and Right Rail UI and adds it under a FF
- Updated dependencies

## 1.10.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.9.1

### Patch Changes

- Updated dependencies

## 1.9.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.8.3

### Patch Changes

- Updated dependencies

## 1.8.2

### Patch Changes

- Updated dependencies

## 1.8.1

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#173737](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173737)
  [`965f739a481f5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/965f739a481f5) -
  [ux] Items are disabled in the plus menu while offline. This affects arrow navigation in the plus
  menu and element browser

## 1.7.3

### Patch Changes

- Updated dependencies

## 1.7.2

### Patch Changes

- Updated dependencies

## 1.7.1

### Patch Changes

- Updated dependencies

## 1.7.0

### Minor Changes

- [`e9f1406d9e6fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e9f1406d9e6fb) -
  Use getSuggestions from quickInsert plugin so the search behavior is consistent amongst surface
  areas

## 1.6.1

### Patch Changes

- [#159777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159777)
  [`e708d0a9e4b36`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e708d0a9e4b36) -
  Refactoring plugins to meet folder standards.
- Updated dependencies

## 1.6.0

### Minor Changes

- [#157845](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157845)
  [`036086b523133`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/036086b523133) -
  Removed onInsert from quickInsert plugin actions, as the behavior is now encapsulated within
  insertItem

## 1.5.1

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18
- Updated dependencies

## 1.5.0

### Minor Changes

- [#154398](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154398)
  [`ca1591355d790`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ca1591355d790) -
  [ux] Allows for passing functions to the quickInsert plugin that allow for capturing element
  insertion metrics and then using that data to change the element sort order

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

- Updated dependencies

## 1.4.2

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#141244](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141244)
  [`972ec7421443c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/972ec7421443c) -
  [ED-24939] Add addQuickInsertItem command to support adding new quick insert items

## 1.3.4

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.3.3

### Patch Changes

- Updated dependencies

## 1.3.2

### Patch Changes

- [#138136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138136)
  [`35938ecf46ba7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35938ecf46ba7) -
  [ED-24755] Implement insert functionality of element templates and fire document inserted event
  with template IDs
- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#130825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130825)
  [`d8a00de5637ff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d8a00de5637ff) -
  ENGHEALTH-9890: Bumps React peer dependency for Lego editor plugins

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

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

- Updated dependencies

## 1.1.8

### Patch Changes

- [#114683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114683)
  [`ff0815316ab38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff0815316ab38) -
  Removes usage of custom theme button in places where its API is not being used and the default
  button is able to be used instead. This should give a slight performance (runtime) improvement.

## 1.1.7

### Patch Changes

- Updated dependencies

## 1.1.6

### Patch Changes

- Updated dependencies

## 1.1.5

### Patch Changes

- [#103091](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103091)
  [`736512792df6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/736512792df6) -
  Fix analytics inputMethod bug for inserting a macro

## 1.1.4

### Patch Changes

- Updated dependencies

## 1.1.3

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- [#89247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89247)
  [`a65b4a0870d8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a65b4a0870d8) -
  The internal composition of this package has changed. There is no expected change in behavior.

## 1.0.3

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.2

### Patch Changes

- [#74886](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74886)
  [`5b79ded33f58`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5b79ded33f58) -
  [EDF-324] Element Browser now has a separate categories for ai config items

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

## 0.2.13

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.2.12

### Patch Changes

- [#71136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71136)
  [`c803fea1e6a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c803fea1e6a4) -
  Move all plugin translations to editor-common
- Updated dependencies

## 0.2.11

### Patch Changes

- Updated dependencies

## 0.2.10

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.2.9

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802)
  [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) -
  Ensure all editor plugins are marked as singletons

## 0.2.8

### Patch Changes

- Updated dependencies

## 0.2.7

### Patch Changes

- [#61923](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61923)
  [`04e38cfe9e90`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/04e38cfe9e90) -
  Remove legacy theming logic from all Editor plugin packages. Theming is still available via the
  @atlaskit/tokens package.

## 0.2.6

### Patch Changes

- Updated dependencies

## 0.2.5

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- [#43164](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43164)
  [`3aeedf55e29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3aeedf55e29) -
  [ED-20068] Move editSelectedExtension to ExtensionPluginActions

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#41143](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41143)
  [`7d6dfe2befa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d6dfe2befa) -
  [ED-20003] Replace TyepAhead API for Editor Plugin Injection API

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- [#39425](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39425)
  [`4c27d14af2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c27d14af2e) -
  [ED-19408] Fix issue where FocusTrap returnFocus was causing the cursor to end up at the beginning
  of the document when inserting elements using the element browser modal.
- Updated dependencies

## 0.1.1

### Patch Changes

- Updated dependencies
