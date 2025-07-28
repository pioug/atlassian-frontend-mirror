# @atlaskit/editor-plugin-breakout

## 3.1.1

### Patch Changes

- [#190588](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190588)
  [`b22e308cfd320`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b22e308cfd320) -
  Replace experiment key platform_editor_useSharedPluginStateSelector with
  platform_editor_useSharedPluginStateWithSelector
- Updated dependencies

## 3.1.0

### Minor Changes

- [#189314](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189314)
  [`22c6251496010`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22c6251496010) -
  Exported missing types that were already being inferred from existing exports

### Patch Changes

- Updated dependencies

## 3.0.6

### Patch Changes

- [#188277](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188277)
  [`9e6d67b625ac9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9e6d67b625ac9) -
  [ux] Hides drag controls for all nodes and resize handles on expands and layouts on narrow
  screens.
- Updated dependencies

## 3.0.5

### Patch Changes

- [#185940](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185940)
  [`456bee393c4d3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/456bee393c4d3) -
  [ux] When editor-area is less than 768px wide, we reduce editor gutters to 24px in Full-page
  editor.
- Updated dependencies

## 3.0.4

### Patch Changes

- [#187144](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187144)
  [`a16147d8fbdfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a16147d8fbdfe) -
  Bump @atlaskit/adf-schema to v49.0.5
- Updated dependencies

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [#183109](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/183109)
  [`3fd4ff5c71ef7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3fd4ff5c71ef7) -
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

## 2.9.2

### Patch Changes

- [#176058](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/176058)
  [`38c6611bdd480`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/38c6611bdd480) -
  ED-28085 Clean up platform_editor_hide_expand_selection_states

## 2.9.1

### Patch Changes

- Updated dependencies

## 2.9.0

### Minor Changes

- [#170867](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/170867)
  [`5ef91045141dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5ef91045141dd) -
  Add new fallback css widths for breakout resizing plugin, to fix issues in full width page

## 2.8.3

### Patch Changes

- [#174482](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/174482)
  [`6947eb8ffc2bc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6947eb8ffc2bc) -
  Add new FG to fix issue with migration logic for full width pages
- Updated dependencies

## 2.8.2

### Patch Changes

- Updated dependencies

## 2.8.1

### Patch Changes

- Updated dependencies

## 2.8.0

### Minor Changes

- [#173259](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173259)
  [`8c7a6909826be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c7a6909826be) -
  Add new Changed Breakout Mode event and hook it up to breakout button

### Patch Changes

- [#173297](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173297)
  [`c1d3dba68babc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c1d3dba68babc) -
  [ux] When single player expand FG is disabled, the opened expand should keep expanded state after
  resize.
- [#173239](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173239)
  [`75dd671d5fcf6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/75dd671d5fcf6) -
  Retain an exand nodes expanded state when applying breakout node
- Updated dependencies

## 2.7.6

### Patch Changes

- Updated dependencies

## 2.7.5

### Patch Changes

- [#170955](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/170955)
  [`de48855e17dbe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/de48855e17dbe) -
  [ux] ED-28260 disable resize handles in live page view mode
- Updated dependencies

## 2.7.4

### Patch Changes

- Updated dependencies

## 2.7.3

### Patch Changes

- [#169885](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169885)
  [`b0f7d84248010`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b0f7d84248010) -
  Add label popup to contentComponent which renders when a guideline is active. Add
  activeGuidelineKey to breakout plugin state to use with the label.
- Updated dependencies

## 2.7.2

### Patch Changes

- [#168573](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168573)
  [`8c337a8701dfb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c337a8701dfb) -
  Adds resized analytics for nodes that support breakout mark.
- [#169278](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169278)
  [`3ff87a0248416`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3ff87a0248416) -
  [ux] ED-28232 fix guidelines location on full width pages for new resizing experience behind
  platform_editor_breakout_resizing
- Updated dependencies

## 2.7.1

### Patch Changes

- [#168578](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168578)
  [`41261a6eeacb3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/41261a6eeacb3) -
  ED-28219 fix new resizing experience on full width pages
- Updated dependencies

## 2.7.0

### Minor Changes

- [#166997](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166997)
  [`826de0a17dc7e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/826de0a17dc7e) -
  Introduce new breakout oprational event in editor-common, export the type and use in
  editor-plugin-breakout. Add performance measurement for FPS for resizing

### Patch Changes

- Updated dependencies

## 2.6.1

### Patch Changes

- [#166490](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166490)
  [`9f140155c14be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9f140155c14be) -
  [ux] Shows tooltip on the resize handle when it is hovered.
- Updated dependencies

## 2.6.0

### Minor Changes

- [#166502](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166502)
  [`ea1ed63fc9615`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ea1ed63fc9615) -
  ED-28032 add keyboard shortcuts for new resizing experience behind
  platform_editor_breakout_resizing

## 2.5.3

### Patch Changes

- [#167303](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167303)
  [`da9bf8f3d80a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/da9bf8f3d80a2) -
  [ux] Prevents scroll after node was resized.
- Updated dependencies

## 2.5.2

### Patch Changes

- [#164895](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164895)
  [`e8158addf8fda`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e8158addf8fda) -
  Add platform_editor_breakout_resizing_hello_release fg - add snapping logic for pragmatic resizer
- Updated dependencies

## 2.5.1

### Patch Changes

- [#164129](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164129)
  [`ef34428363521`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ef34428363521) -
  [ux] ED-28058 fix left drag handle experience for new resizing under
  platform_editor_breakout_resizing
- Updated dependencies

## 2.5.0

### Minor Changes

- [#163976](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163976)
  [`668e81e097994`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/668e81e097994) -
  [ux] [ED-28113] this change saves the width as 1800 when resizing to the fullWidth guideline under
  the new resizing experience behind platform_editor_breakout_resizing

### Patch Changes

- Updated dependencies

## 2.4.3

### Patch Changes

- [#163965](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163965)
  [`c08b8e623a378`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c08b8e623a378) -
  [ED-28046] Reduce the number of times the layout button re-renders
- [#164762](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164762)
  [`e716071496267`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e716071496267) -
  [ux] Fix for expands and codeblocks so they keep their settings after resize.
- Updated dependencies

## 2.4.2

### Patch Changes

- Updated dependencies

## 2.4.1

### Patch Changes

- [#163125](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163125)
  [`d0ae2ab52765d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d0ae2ab52765d) -
  [ux] ED-28034 fix block controls positioning for new resizing experience behind
  platform_editor_breakout_resizing
- Updated dependencies

## 2.4.0

### Minor Changes

- [#159900](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159900)
  [`d70a10b069ade`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d70a10b069ade) -
  [ux] [ED-28027] add guidelines while resizing under the new experience behind the
  platform_editor_breakout_resizing experiment

### Patch Changes

- Updated dependencies

## 2.3.3

### Patch Changes

- Updated dependencies

## 2.3.2

### Patch Changes

- [#159070](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159070)
  [`9857b771c1da1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9857b771c1da1) -
  [ux] [ED-27778] Fix selection state hiding for tables, breakout buttons and layout
- Updated dependencies

## 2.3.1

### Patch Changes

- [#160619](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160619)
  [`6e034b31d6c9c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e034b31d6c9c) -
  ED-28096 fix nested nodes getting breakout mark
- Updated dependencies

## 2.3.0

### Minor Changes

- [#158239](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158239)
  [`c2caa0af876e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c2caa0af876e0) -
  [ux] ED-28028 add breakout mark to expands, codeblocks and layouts for new resizing experience
  behind the platform_editor_breakout_resizing experiment

### Patch Changes

- [#159213](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159213)
  [`75e3b93e94f8c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/75e3b93e94f8c) -
  [ED-28069] this change is retaining the breakout mode when setting the breakout width when using
  the new resizing experience behind the platform_editor_breakout_resizing experiment.
- Updated dependencies

## 2.2.6

### Patch Changes

- [#157540](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157540)
  [`16b7448512972`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/16b7448512972) -
  [ux] [ED-28038] this change adds the drag callbacks to the new resizing experience behind the
  platform_editor_breakout_resizing experiment.
- Updated dependencies

## 2.2.5

### Patch Changes

- [#156743](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156743)
  [`170609348890d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/170609348890d) -
  Add new breakout resizing experience under experiment platform_editor_breakout_resizing
- Updated dependencies

## 2.2.4

### Patch Changes

- Updated dependencies

## 2.2.3

### Patch Changes

- Updated dependencies

## 2.2.2

### Patch Changes

- [#150308](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150308)
  [`a8c419124f349`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a8c419124f349) -
  Migrate breakoutPlugin to useSharedPluginStateSelector
- Updated dependencies

## 2.2.1

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#147450](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/147450)
  [`38f270ecf0ed0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/38f270ecf0ed0) -
  Revert optimisation made to breakout

### Patch Changes

- Updated dependencies

## 2.1.8

### Patch Changes

- [#144898](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144898)
  [`b9a10d6716ef4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b9a10d6716ef4) -
  Enable useSharedPluginStateSelector in block-controls, block-type and breakout plugins
- Updated dependencies

## 2.1.7

### Patch Changes

- [#137211](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137211)
  [`d00cb55d6fa4b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d00cb55d6fa4b) -
  [ux] ED27118 Increase pull page editor gutter to allow more space for new floating insert button -
  https://hello.atlassian.net/wiki/spaces/EDITOR/pages/5120694962/Editor+DACI+New+insert+button+and+full-width+screens+2.0
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

## 1.11.2

### Patch Changes

- Updated dependencies

## 1.11.1

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 1.11.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.10.3

### Patch Changes

- Updated dependencies

## 1.10.2

### Patch Changes

- Updated dependencies

## 1.10.1

### Patch Changes

- [#108797](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108797)
  [`9a3f165bc940b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a3f165bc940b) -
  tidy up feature flag confluence_frontend_editor_custom_presets
- Updated dependencies

## 1.10.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.9.15

### Patch Changes

- Updated dependencies

## 1.9.14

### Patch Changes

- [#98963](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98963)
  [`3638dcf79b6c7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3638dcf79b6c7) -
  ED-26126 Cleanup code wrapping language bug fg

## 1.9.13

### Patch Changes

- Updated dependencies

## 1.9.12

### Patch Changes

- Updated dependencies

## 1.9.11

### Patch Changes

- Updated dependencies

## 1.9.10

### Patch Changes

- [#176596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176596)
  [`86e9b63cc47f0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/86e9b63cc47f0) -
  Remove internal re-exports
- Updated dependencies

## 1.9.9

### Patch Changes

- Updated dependencies

## 1.9.8

### Patch Changes

- Updated dependencies

## 1.9.7

### Patch Changes

- [#171014](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171014)
  [`6163248356c63`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6163248356c63) -
  [ED-25833] Replace the following FGs with experiment `platform_editor_advanced_layouts`

  - platform_editor_advanced_layouts_breakout_resizing
  - platform_editor_advanced_layouts_pre_release_1
  - platform_editor_advanced_layouts_pre_release_2

## 1.9.6

### Patch Changes

- [#169341](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169341)
  [`b8cceed0c0786`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b8cceed0c0786) -
  ED-25806: migrates file structure to editor engineering standards

## 1.9.5

### Patch Changes

- [#169284](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169284)
  [`6e121d2945aae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6e121d2945aae) -
  ED-25760 draop hints are not triggered for unchanged layout

## 1.9.4

### Patch Changes

- [#167313](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167313)
  [`40d491ee58258`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40d491ee58258) -
  ED-24230 Remove code wrapping for editor FG

## 1.9.3

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0
- Updated dependencies

## 1.9.2

### Patch Changes

- Updated dependencies

## 1.9.1

### Patch Changes

- [#158057](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158057)
  [`1051d541ab905`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1051d541ab905) -
  migrate breakout button icons
- Updated dependencies

## 1.9.0

### Minor Changes

- [#159777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159777)
  [`64dae465493a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/64dae465493a4) -
  Add Breakout Resizing component to editor-common, add support in Layout plugin

### Patch Changes

- [#158291](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158291)
  [`f485597c02e9a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f485597c02e9a) -
  Refactoring the core editor component to remove unsafe methods for React 18.
- Updated dependencies

## 1.8.7

### Patch Changes

- [#159308](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159308)
  [`14ef6f05d711c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14ef6f05d711c) -
  [ED-24690] Replace LD FF with Statsig platform-editor-single-player-expand
- Updated dependencies

## 1.8.6

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 1.8.5

### Patch Changes

- [#156102](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156102)
  [`05bfe209f2801`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/05bfe209f2801) -
  Replace platform.editor.core.increase-full-page-guttering with new FG

## 1.8.4

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18
- Updated dependencies

## 1.8.3

### Patch Changes

- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1
- Updated dependencies

## 1.8.2

### Patch Changes

- Updated dependencies

## 1.8.1

### Patch Changes

- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1
- Updated dependencies

## 1.8.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 1.7.13

### Patch Changes

- Updated dependencies

## 1.7.12

### Patch Changes

- Updated dependencies

## 1.7.11

### Patch Changes

- Updated dependencies

## 1.7.10

### Patch Changes

- Updated dependencies

## 1.7.9

### Patch Changes

- Updated dependencies

## 1.7.8

### Patch Changes

- Updated dependencies

## 1.7.7

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.
- [#137474](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137474)
  [`7ca1c34ebf2d5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7ca1c34ebf2d5) -
  make breakout to use css to fix SSR issue on live edit page

## 1.7.6

### Patch Changes

- Updated dependencies

## 1.7.5

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 1.7.4

### Patch Changes

- [#136871](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136871)
  [`87a30d5cb3ffb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87a30d5cb3ffb) -
  ED-24814 - Addressing a bug where changing the language on a wrapped code block caused the wrapped
  decorator to disappear. Required changing the sequence in which we update the keys on the wrapped
  states WeakMap. Due to the amount of changes, it has all be placed behind a bug fix feature gate
  (editor_code_block_wrapping_language_change_bug) and the original feature gate
  (editor_support_code_block_wrapping).

## 1.7.3

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 1.7.2

### Patch Changes

- Updated dependencies

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

## 1.6.2

### Patch Changes

- [#125133](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125133)
  [`d804e5dd3216b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d804e5dd3216b) -
  ED-24226 - Add state to manage the toggle word wrap state of code blocks. New WeakMap added in
  editor-common/src/code-block, as word wrap state is shared throughout the editor. Covers regular
  changes to code block by the user via the node view update function. Covers breakout of code block
  node. Does not cover drag&drop & cut&paste edge cases.

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

- Updated dependencies

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

## 1.2.4

### Patch Changes

- [#107785](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107785)
  [`7304a7cd937f9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7304a7cd937f9) -
  [ux] [ED-23522] Single player expands on behind `platform.editor.single-player-expand` for all
  editors, single player expands on without `platform.editor.single-player-expand` feature flag for
  live page editors
- Updated dependencies

## 1.2.3

### Patch Changes

- [#106586](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106586)
  [`a61ec7d27da8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a61ec7d27da8) -
  Use editor padding changes in breakout mark
- Updated dependencies

## 1.2.2

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.2.1

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 1.2.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 1.1.7

### Patch Changes

- Updated dependencies

## 1.1.6

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 1.1.5

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.1.4

### Patch Changes

- Updated dependencies

## 1.1.3

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 1.1.2

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1
- [#94398](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94398)
  [`4df808e35fda`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4df808e35fda) -
  [ux] [ED-23108] Solve bug where single player expands would lose their expanded state when adding
  breakout marks. Single player expands are only used when `platform.editor.single-player-expand` FF
  AND live page are both enabled.

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

## 1.0.9

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options

## 1.0.8

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 1.0.7

### Patch Changes

- [#88938](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88938)
  [`db547827ee45`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db547827ee45) -
  [ux] Don't render LayoutButton when editor in 'view' mode
- Updated dependencies

## 1.0.6

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 1.0.5

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

## 1.0.4

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.3

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0

## 1.0.2

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

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

## 0.2.2

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.2.1

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 0.2.0

### Minor Changes

- [#68790](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68790)
  [`c6d8affc52d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d8affc52d1) -
  Support maybeAdd plugins in usePreset. Add typing support for universal preset.

  Now when using the editor API with the universal preset

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.1.1

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies
