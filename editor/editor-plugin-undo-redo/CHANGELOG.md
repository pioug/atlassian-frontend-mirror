# @atlaskit/editor-plugin-undo-redo

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.0.5

### Patch Changes

- [`c0113eeccb2df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c0113eeccb2df) -
  [ux] ED-29120 add a new config option for default editor preset
  (`toolbar.enableNewToolbarExperience`) which allows the new toolbar to be disabled. This is needed
  for editors that can't be excluded at the experiment level.
- Updated dependencies

## 4.0.4

### Patch Changes

- [`db97eb262cc5a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/db97eb262cc5a) -
  replace platform_editor_toolbar_aifc with separate experiements for jira and confluence
- Updated dependencies

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- [`4a31ea74ba10f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4a31ea74ba10f) -
  [ux] [ED-29057] create new ranks and groups for track changes section and render undo, redo and
  diff in separate button groups behind platform_editor_toolbar_aifc_patch_2 gate
- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.2.8

### Patch Changes

- Updated dependencies

## 3.2.7

### Patch Changes

- [`fa9e0ec694435`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fa9e0ec694435) -
  ED-29117: cleans up sharedPluginStateHookMigratorFactory in undo redo plugin
- Updated dependencies

## 3.2.6

### Patch Changes

- Updated dependencies

## 3.2.5

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 3.2.4

### Patch Changes

- Updated dependencies

## 3.2.3

### Patch Changes

- [`286abb4d35eba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/286abb4d35eba) -
  [ux] [ED-28960] Finish full page primary toolbar migration

  - Align with design update (separator, gap, height, icon size)
  - Add keyboard shortcut to focus toolbar and arrow key navigation
  - Address accessibility

- Updated dependencies

## 3.2.2

### Patch Changes

- Updated dependencies

## 3.2.1

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [`f78a34afab8d4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f78a34afab8d4) -
  [ux] ED-28961 register undo redo and track changes buttons to new toolbar behind
  platform_editor_toolbar_aifc. adds ai buttons into comment toolbar.

### Patch Changes

- Updated dependencies

## 3.1.2

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#189314](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189314)
  [`22c6251496010`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22c6251496010) -
  Exported missing types that were already being inferred from existing exports

### Patch Changes

- Updated dependencies

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

## 2.0.23

### Patch Changes

- Updated dependencies

## 2.0.22

### Patch Changes

- Updated dependencies

## 2.0.21

### Patch Changes

- Updated dependencies

## 2.0.20

### Patch Changes

- Updated dependencies

## 2.0.19

### Patch Changes

- Updated dependencies

## 2.0.18

### Patch Changes

- [#165113](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165113)
  [`867bcb05452bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/867bcb05452bf) -
  Cleaned up platform_editor_controls_patch_analytics and platform_editor_controls_patch_analytics_2
- Updated dependencies

## 2.0.17

### Patch Changes

- Updated dependencies

## 2.0.16

### Patch Changes

- Updated dependencies

## 2.0.15

### Patch Changes

- [#154149](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154149)
  [`4b955e247c793`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4b955e247c793) -
  [ED-27560] Migrate to useSharedPluginStateSelector for text color, toolbar lists indentation,
  type-ahead, undo-redo plugins
- Updated dependencies

## 2.0.14

### Patch Changes

- Updated dependencies

## 2.0.13

### Patch Changes

- Updated dependencies

## 2.0.12

### Patch Changes

- Updated dependencies

## 2.0.11

### Patch Changes

- [#149778](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149778)
  [`de5587be5f109`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/de5587be5f109) -
  Added undo/redo via shortcut analytics
- Updated dependencies

## 2.0.10

### Patch Changes

- [#149192](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149192)
  [`7dd3315f8b3a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7dd3315f8b3a2) -
  Added undo/redo analytics
- Updated dependencies

## 2.0.9

### Patch Changes

- Updated dependencies

## 2.0.8

### Patch Changes

- [#130818](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130818)
  [`0e42cb4df2b7f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0e42cb4df2b7f) -
  Changed undo/redo commands to use EXTRENAL input type when no inputSource is provided. Ensure type
  ahead is closed before undo/redo and that editor is re-focused after undo/redo.

## 2.0.7

### Patch Changes

- [#130044](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130044)
  [`cad348d512cdf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cad348d512cdf) -
  [ux] ED-26802 contextual formatting configuration
- Updated dependencies

## 2.0.6

### Patch Changes

- [#127269](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127269)
  [`a8235a7de7cd0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a8235a7de7cd0) -
  Added undo & redo actions to undoRedoPlugin
- Updated dependencies

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- [#122140](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122140)
  [`3f7b2bc0c6ef0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f7b2bc0c6ef0) -
  Add missing dependencies to the package.json file
- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

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

## 1.8.0

### Minor Changes

- [#116013](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116013)
  [`18e022766bfd3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/18e022766bfd3) -
  [ux] ED-26464 Hiding primary toolbar and docking contextual toolbar items to top

### Patch Changes

- Updated dependencies

## 1.7.1

### Patch Changes

- Updated dependencies

## 1.7.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.6.17

### Patch Changes

- Updated dependencies

## 1.6.16

### Patch Changes

- Updated dependencies

## 1.6.15

### Patch Changes

- [#100162](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100162)
  [`e80e57fc37719`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e80e57fc37719) -
  [ux] ED-26089: Add 4px gap to main nav bar items

## 1.6.14

### Patch Changes

- Updated dependencies

## 1.6.13

### Patch Changes

- Updated dependencies

## 1.6.12

### Patch Changes

- [#171551](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171551)
  [`702c918817e78`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/702c918817e78) -
  ED-25817: refactors plugins to meet folder standards

## 1.6.11

### Patch Changes

- Updated dependencies

## 1.6.10

### Patch Changes

- Updated dependencies

## 1.6.9

### Patch Changes

- Updated dependencies

## 1.6.8

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18
- Updated dependencies

## 1.6.7

### Patch Changes

- Updated dependencies

## 1.6.6

### Patch Changes

- Updated dependencies

## 1.6.5

### Patch Changes

- Updated dependencies

## 1.6.4

### Patch Changes

- Updated dependencies

## 1.6.3

### Patch Changes

- Updated dependencies

## 1.6.2

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.6.1

### Patch Changes

- Updated dependencies

## 1.6.0

### Minor Changes

- [#133191](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133191)
  [`78a1927084934`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/78a1927084934) -
  [ux] Remove icon migration feature gate and migrate new icons on primary toolbar

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#130825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130825)
  [`d8a00de5637ff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d8a00de5637ff) -
  ENGHEALTH-9890: Bumps React peer dependency for Lego editor plugins

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#126478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126478)
  [`ca1665ebbfe4d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ca1665ebbfe4d) -
  [ED-23435] Store primary toolbar component registry in a plugin variable instead of in plugin
  state to avoid having to add effects to all plugins and enable SSR for the toolbar. [Breaking
  change] Converted registerComponent from the primary toolbar plugin into an action.

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

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

- Updated dependencies

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#101406](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101406)
  [`6daffd65aec4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6daffd65aec4) -
  [ED-23298] Extract primary toolbar components to editor plugin to allow for custom ordering

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

## 0.1.3

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- Updated dependencies
