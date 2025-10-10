# @atlaskit/editor-plugin-selection-toolbar

## 7.0.11

### Patch Changes

- [`14b9e966da4dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/14b9e966da4dd) -
  [ux] ED-29517 Toolbar and offline banner is overlapping
- [`ef001bf65d48f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ef001bf65d48f) -
  Remove usage of `platform_editor_toolbar_aifc` inside editor packages - instead rely on checking
  for new toolbar plugin option, make `enableNewToolbarExperience` mandatory for consumers to opt in
  to new toolbar experience
- Updated dependencies

## 7.0.10

### Patch Changes

- [`0b4cd77e72217`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0b4cd77e72217) -
  clean up references to platform_editor_controls_performance_fixes
- Updated dependencies

## 7.0.9

### Patch Changes

- Updated dependencies

## 7.0.8

### Patch Changes

- [`c04bcabb31f7c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c04bcabb31f7c) -
  [ux] ED-29513 Force showing pinning toolbar for LCM using user preferences plugin
- Updated dependencies

## 7.0.7

### Patch Changes

- Updated dependencies

## 7.0.6

### Patch Changes

- Updated dependencies

## 7.0.5

### Patch Changes

- Updated dependencies

## 7.0.4

### Patch Changes

- Updated dependencies

## 7.0.3

### Patch Changes

- Updated dependencies

## 7.0.2

### Patch Changes

- [`76ffc91d514f3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/76ffc91d514f3) -
  Changed packages over to using the generic AIFC FG rather then an experiment
- Updated dependencies

## 7.0.1

### Patch Changes

- Updated dependencies

## 7.0.0

### Patch Changes

- Updated dependencies

## 6.1.2

### Patch Changes

- Updated dependencies

## 6.1.1

### Patch Changes

- [`7e4750e649998`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7e4750e649998) -
  Hide Menu section for loom and pinning when in view mode
- Updated dependencies

## 6.1.0

### Minor Changes

- [`4edb2aee0da9c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4edb2aee0da9c) -
  Add conditionalHooksFactory and migrate usage of useSharedPluginStateSelector to useEditorToolbar
  and useSharedPluginStateWithSelector

### Patch Changes

- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.7

### Patch Changes

- [`c0113eeccb2df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c0113eeccb2df) -
  [ux] ED-29120 add a new config option for default editor preset
  (`toolbar.enableNewToolbarExperience`) which allows the new toolbar to be disabled. This is needed
  for editors that can't be excluded at the experiment level.
- Updated dependencies

## 5.0.6

### Patch Changes

- [`0812ff5bd7bd1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0812ff5bd7bd1) -
  Dont render menu sections in live view
- Updated dependencies

## 5.0.5

### Patch Changes

- Updated dependencies

## 5.0.4

### Patch Changes

- [`555ac8f256674`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/555ac8f256674) -
  Update menu item icon size to small, tweak paddings and font styles
- Updated dependencies

## 5.0.3

### Patch Changes

- [`db97eb262cc5a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/db97eb262cc5a) -
  replace platform_editor_toolbar_aifc with separate experiements for jira and confluence
- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.3.13

### Patch Changes

- Updated dependencies

## 4.3.12

### Patch Changes

- Updated dependencies

## 4.3.11

### Patch Changes

- Updated dependencies

## 4.3.10

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 4.3.9

### Patch Changes

- [`b27824f2875be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b27824f2875be) -
  [ux] [ED-28821] Add pin button to full page primary toolbar
- Updated dependencies

## 4.3.8

### Patch Changes

- [`1dc35286ebb8a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1dc35286ebb8a) -
  [ux] [EDITOR-1064] Added rovo menu on current selection toolbar
- Updated dependencies

## 4.3.7

### Patch Changes

- Updated dependencies

## 4.3.6

### Patch Changes

- Updated dependencies

## 4.3.5

### Patch Changes

- Updated dependencies

## 4.3.4

### Patch Changes

- Updated dependencies

## 4.3.3

### Patch Changes

- Updated dependencies

## 4.3.2

### Patch Changes

- [#199957](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199957)
  [`5c4cd82cd1ea3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5c4cd82cd1ea3) -
  Add unpinned version of menu item and hook up, add UiToolbarContext to primary toolbar components
- Updated dependencies

## 4.3.1

### Patch Changes

- Updated dependencies

## 4.3.0

### Minor Changes

- [#196043](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/196043)
  [`c6cb0ed855827`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c6cb0ed855827) -
  Add new ShowMoreHorizontal Icon, add new ranks to support overflow menu, add pin as a menu item

### Patch Changes

- Updated dependencies

## 4.2.2

### Patch Changes

- Updated dependencies

## 4.2.1

### Patch Changes

- [#192090](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192090)
  [`d1a5fb90b8bfd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d1a5fb90b8bfd) -
  Add editor-plugin-toolbar package, which stores toolbar components and provides an api to register
  them, using editor-toolbar-model libary as state manager. This plugin also renders a new selection
  toolbar based on the new components.

## 4.2.0

### Minor Changes

- [#189314](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189314)
  [`22c6251496010`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22c6251496010) -
  Exported missing types that were already being inferred from existing exports

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [#185617](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185617)
  [`c766e636b2d44`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c766e636b2d44) -
  ED-28220 clean up exp platform_editor_controls_toolbar_pinning_exp

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

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

## 3.8.0

### Minor Changes

- [#177157](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/177157)
  [`6bcf8912217df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6bcf8912217df) -
  ED-27284 additional integration with user preference plugin

### Patch Changes

- Updated dependencies

## 3.7.6

### Patch Changes

- Updated dependencies

## 3.7.5

### Patch Changes

- Updated dependencies

## 3.7.4

### Patch Changes

- [#172583](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/172583)
  [`40f387a0c0962`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/40f387a0c0962) -
  Clean up platform_editor_controls_patch_2
- Updated dependencies

## 3.7.3

### Patch Changes

- Updated dependencies

## 3.7.2

### Patch Changes

- Updated dependencies

## 3.7.1

### Patch Changes

- Updated dependencies

## 3.7.0

### Minor Changes

- [#158546](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158546)
  [`b7fe4e6f226f3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b7fe4e6f226f3) -
  ED-27284 use user preferences plugin in editor preset.

### Patch Changes

- Updated dependencies

## 3.6.14

### Patch Changes

- Updated dependencies

## 3.6.13

### Patch Changes

- Updated dependencies

## 3.6.12

### Patch Changes

- Updated dependencies

## 3.6.11

### Patch Changes

- [#163573](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163573)
  [`21e93839ec382`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21e93839ec382) -
  Convert platform_editor_controls_toolbar_pinning fg to
  platform_editor_controls_toolbar_pinning_exp experiment
- Updated dependencies

## 3.6.10

### Patch Changes

- [#162560](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/162560)
  [`2f1b203a00ccf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2f1b203a00ccf) -
  [ux] Removes docking options from the overflow menu and converts them into pin/unpin button.
- Updated dependencies

## 3.6.9

### Patch Changes

- [#161893](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161893)
  [`432e1c30874a0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/432e1c30874a0) -
  controls performance gating switch to experiment
- Updated dependencies

## 3.6.8

### Patch Changes

- Updated dependencies

## 3.6.7

### Patch Changes

- Updated dependencies

## 3.6.6

### Patch Changes

- [#159043](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159043)
  [`686cfbea13d47`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/686cfbea13d47) -
  ED-28050 [Performance] Disable unnecessary docking preference request on PageVisibilityWatcher
- Updated dependencies

## 3.6.5

### Patch Changes

- Updated dependencies

## 3.6.4

### Patch Changes

- Updated dependencies

## 3.6.3

### Patch Changes

- Updated dependencies

## 3.6.2

### Patch Changes

- [#153256](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153256)
  [`3644fbe36073d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3644fbe36073d) -
  [ux] When ViewAll dropdown closes via ESC key press or submenus close via ESC or Enter, the focus
  is set on ViewAll button.
- Updated dependencies

## 3.6.1

### Patch Changes

- Updated dependencies

## 3.6.0

### Minor Changes

- [#151276](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/151276)
  [`e483670a03fa3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e483670a03fa3) -
  [ux] [EDITOR-670] Adds a new action to selectionToolbar `forceToolbarDockingWithoutAnalytics`
  which performs similarly to `setToolbarDocking` with a couple of differences. 1) It does not fire
  any analytics. 2) It does not make any changes to the selection. This was required due to issues
  with the Confluence Legacy Content Extension which needs to manipulate the scrollbar position when
  editor controls are enabled but relies on the selection remaining stable.

### Patch Changes

- Updated dependencies

## 3.5.7

### Patch Changes

- Updated dependencies

## 3.5.6

### Patch Changes

- Updated dependencies

## 3.5.5

### Patch Changes

- Updated dependencies

## 3.5.4

### Patch Changes

- [#146885](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146885)
  [`0e54e7556bae4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0e54e7556bae4) -
  [ux] Fix issue with toolbar initial docking preference not updating correctly when navigating
  between live docs and classic pages
- Updated dependencies

## 3.5.3

### Patch Changes

- [#144882](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144882)
  [`0f6d28302bae7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f6d28302bae7) -
  ED-27414 update user pref feature gate to unify frontend and ssr changes.

## 3.5.2

### Patch Changes

- [#144194](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144194)
  [`542b82e03416e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/542b82e03416e) -
  [ux] Remove separators within group in Editor floating toolbar
- Updated dependencies

## 3.5.1

### Patch Changes

- [#141455](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141455)
  [`8a8bd624345b5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8a8bd624345b5) -
  [ED-27542] Clean up platform_editor_controls_patch_2 used for floating toolbar scroll left/right
  buttons
- Updated dependencies

## 3.5.0

### Minor Changes

- [#141267](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141267)
  [`105e8bc4d7bd5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/105e8bc4d7bd5) -
  ED-27501 apply user preference across tabs without a refresh

### Patch Changes

- Updated dependencies

## 3.4.1

### Patch Changes

- [#139189](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139189)
  [`33e0a9b6291ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/33e0a9b6291ae) -
  [ux] When table is selected via drag handle, we show Table floating controls toolbar. If the table
  selected via other means, we show the Text Formatting toolbar.
- Updated dependencies

## 3.4.0

### Minor Changes

- [#139139](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139139)
  [`7f6b665d778dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7f6b665d778dd) -
  [https://product-fabric.atlassian.net/browse/ED-27499](ED-27499) - the new
  `@atlassian/confluence-presets` package with Confluence `full-page` preset is created

### Patch Changes

- Updated dependencies

## 3.3.0

### Minor Changes

- [#138841](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138841)
  [`d71cc65fae381`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d71cc65fae381) -
  ED-27489 fix toolbar docking pref

## 3.2.0

### Minor Changes

- [#138170](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138170)
  [`160cf374f7ac1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/160cf374f7ac1) -
  ED-27441 update docking preference with analytics

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#135115](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135115)
  [`599ab2e1d386c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/599ab2e1d386c) -
  ED-27314 add user preferece analytics for toolbar docking

### Patch Changes

- [#135586](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135586)
  [`3aeba66081612`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3aeba66081612) -
  ED-26593 Add missing i18n for editor control
- Updated dependencies

## 3.0.1

### Patch Changes

- [#134885](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134885)
  [`0d61709802162`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0d61709802162) -
  [ux] [ED-27312] Implement new scroll left/right buttons for scrollable floating toolbars

## 3.0.0

### Major Changes

- [#132776](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132776)
  [`555c2073facfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/555c2073facfe) -
  Upgrade to used compile css and remove dependency on emotion

## 2.3.1

### Patch Changes

- [#131384](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131384)
  [`e3a1b4a5535aa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3a1b4a5535aa) -
  [ux] ED-26882 remove mock extension toolbar items

## 2.3.0

### Minor Changes

- [#128813](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128813)
  [`6ced71640a4ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6ced71640a4ba) -
  ED-26877 selection toolbar plugin refreshes with user preferences

## 2.2.0

### Minor Changes

- [#130044](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130044)
  [`cad348d512cdf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cad348d512cdf) -
  [ux] ED-26802 contextual formatting configuration

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- [#126837](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126837)
  [`3f513ff6dac97`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f513ff6dac97) -
  [ux] Displays Text Formatting toolbar on CellSelection.
- Updated dependencies

## 2.1.2

### Patch Changes

- [#128803](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128803)
  [`bee199a74385f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bee199a74385f) -
  [ux] Keeps docking options in the overlow menu even when the toolbar is docked to top.

## 2.1.1

### Patch Changes

- [#127441](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127441)
  [`f2f4b5971e0b2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2f4b5971e0b2) -
  [ux] Updates Text Formatting toolbar separators, active option style and removes range selection
  when the toolbar is docked to top.
- Updated dependencies

## 2.1.0

### Minor Changes

- [#126588](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126588)
  [`d4160d5f8b246`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d4160d5f8b246) -
  ED-26876 implement editor api for user preference

### Patch Changes

- [#126588](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126588)
  [`d4160d5f8b246`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d4160d5f8b246) -
  ED-26876 add tests for selectionToolbarPlugin
- Updated dependencies

## 2.0.9

### Patch Changes

- Updated dependencies

## 2.0.8

### Patch Changes

- [#126126](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126126)
  [`468f52001a847`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/468f52001a847) -
  Tidy up contextual formatting toolbar experiment and switch to `platform_editor_controls` flag

## 2.0.7

### Patch Changes

- Updated dependencies

## 2.0.6

### Patch Changes

- Updated dependencies

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- [#121249](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121249)
  [`d14ccaecc153a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d14ccaecc153a) -
  ED-26862 contextual toolbar minor updates

## 2.0.3

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 2.0.2

### Patch Changes

- [#118799](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118799)
  [`11c8209cb910d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/11c8209cb910d) -
  Fixes missing dependency declarations in package.json
- Updated dependencies

## 2.0.1

### Patch Changes

- [#118657](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118657)
  [`849aa409da86d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/849aa409da86d) -
  [ux] ED-26673 Toolbar overflow menu shows active docking preference

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

## 1.10.0

### Minor Changes

- [#117435](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117435)
  [`2526289f60537`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2526289f60537) -
  [ux] ED-26675 Docked primary toolbar overflow menu

### Patch Changes

- Updated dependencies

## 1.9.0

### Minor Changes

- [#116013](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116013)
  [`18e022766bfd3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/18e022766bfd3) -
  [ux] ED-26464 Hiding primary toolbar and docking contextual toolbar items to top

## 1.8.1

### Patch Changes

- [#115259](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115259)
  [`a3150808f308a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3150808f308a) -
  Add new forceStaticToolbar config option to floating toolbar and add it to panel and table. Add
  new contextual toolbar plugin which controls expand and collapse logic for toolbar options.
- Updated dependencies

## 1.8.0

### Minor Changes

- [#113466](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113466)
  [`756bb7e35a24d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/756bb7e35a24d) -
  Add new FloatingToolbarOverflowDropdown item to floating toolbar config to support new editor
  controls, add config in selection-toolbar plugin to add new button to text selection

### Patch Changes

- Updated dependencies

## 1.7.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.6.1

### Patch Changes

- Updated dependencies

## 1.6.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.5.6

### Patch Changes

- [#107473](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107473)
  [`962b3297548df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962b3297548df) -
  [ux] Implement variation 2 for editor contextual toolbar formatting experiment

## 1.5.5

### Patch Changes

- [#105009](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105009)
  [`a4039ebf7ed11`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a4039ebf7ed11) -
  [ux] Implement variant 2 cohorts experience for platform_editor_contextual_formatting_toolbar_v2
  experiment
- [#104136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104136)
  [`4eb4cb77cc4f4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4eb4cb77cc4f4) -
  EDF-1999 Cleaned up platform_editor_ai_definitions_live_page_view_mode to default to true.
- Updated dependencies

## 1.5.4

### Patch Changes

- Updated dependencies

## 1.5.3

### Patch Changes

- Updated dependencies

## 1.5.2

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- [#171440](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171440)
  [`835f7bbff3122`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/835f7bbff3122) -
  ED-25816: refactors plugins to meet folder standards
- Updated dependencies

## 1.5.0

### Minor Changes

- [#173684](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173684)
  [`e022c83d84bd3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e022c83d84bd3) -
  Fix errors caused by not checking for undefined annotation toolbar

## 1.4.0

### Minor Changes

- [#172933](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/172933)
  [`8323af2381d00`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8323af2381d00) -
  Adds optional pluginName to the Selection group

### Patch Changes

- Updated dependencies

## 1.3.3

### Patch Changes

- Updated dependencies

## 1.3.2

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- [#165866](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165866)
  [`e1ea80ff13502`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e1ea80ff13502) -
  EDF-1949 - Switch experiment platform_editor_live_pages_ai_definitions to FG
  platform_editor_ai_definitions_live_page_view_mode
- Updated dependencies

## 1.3.0

### Minor Changes

- [#159557](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159557)
  [`e4def56b93caa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e4def56b93caa) -
  [ux] 'EDF-1733: Hide selection toolbar on Define modal render, expose selection toolbar action
  utilities, add AI definitions integration coverage'

### Patch Changes

- Updated dependencies

## 1.2.11

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18

## 1.2.10

### Patch Changes

- Updated dependencies

## 1.2.9

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

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.2.4

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
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
