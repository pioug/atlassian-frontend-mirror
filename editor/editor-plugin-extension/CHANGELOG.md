# @atlaskit/editor-plugin-extension

## 3.1.4

### Patch Changes

- Updated dependencies

## 3.1.3

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

- [#105571](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105571)
  [`1b70990bb34c2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1b70990bb34c2) -
  migrate config panel's close button icon

## 3.0.6

### Patch Changes

- [#105671](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105671)
  [`9b856dd6141f4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9b856dd6141f4) -
  Update file path to fix issue on notification storybook
- Updated dependencies

## 3.0.5

### Patch Changes

- [#104767](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104767)
  [`c90f6b5560f3f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c90f6b5560f3f) -
  ED-25971 LCM - Alter logic inside floating toolbar position calculation to use attribute from
  extension node rather than traversing up the ancestors to find a CSS class.

## 3.0.4

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- [#101406](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101406)
  [`4748404f1aa3d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4748404f1aa3d) -
  ED-26111 Add condition that properly positions the floating toolbar for extensions inside the
  legacy content macro
- [#100525](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100525)
  [`c37f69a90637b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c37f69a90637b) -
  ED-26114: Remove logic for legacy content macro that handled selection changes when entering and
  exiting the extension. Now handled in the extension code in conlfuence.

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [#98618](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98618)
  [`6eccf45581ff1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6eccf45581ff1) -
  ED-25934 fix config panel user select's onFieldChange to dirty only if there are changes
- Updated dependencies

## 3.0.0

### Major Changes

- [#182298](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/182298)
  [`2f0dfff283d2e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f0dfff283d2e) -
  Clean up extension button experiment which determines whether or not to show the new button label

### Patch Changes

- Updated dependencies

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#181279](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/181279)
  [`2b71646184e76`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2b71646184e76) -
  [ux] Sends in new parameter from Confluence to editor to hide default border around 1P bodied
  extensions in live pages if the parameter is true

### Patch Changes

- Updated dependencies

## 2.0.9

### Patch Changes

- [#179199](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/179199)
  [`cceabd041774c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cceabd041774c) -
  ED-25810: refactor extension plugin to editor standards

## 2.0.8

### Patch Changes

- Updated dependencies

## 2.0.7

### Patch Changes

- [#178297](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178297)
  [`7abc8162b32ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7abc8162b32ab) -
  Internal changes to typography styles. There may be some minor visual changes to align with
  modernized typography styles.

## 2.0.6

### Patch Changes

- [#178053](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178053)
  [`cb318c8c28c26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb318c8c28c26) -
  Internal changes to typography.
- Updated dependencies

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- [#175651](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175651)
  [`26349f1048cb4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/26349f1048cb4) -
  ED-25982 - Revert selection click handler slightly so non-LCM extension nodes are selectable
  again.
- Updated dependencies

## 2.0.2

### Patch Changes

- [#169955](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169955)
  [`3c2ffc27c518e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c2ffc27c518e) -
  ED-25863 add logic to stop the LCM inner editor losing focus. Tweak blur logic for extension to
  fully remove current selection when clicking into the LCM.

## 2.0.1

### Patch Changes

- [#173426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173426)
  [`2ce125017f62d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2ce125017f62d) -
  cleanup platform_editor_react18_phase2_loadable
- Updated dependencies

## 2.0.0

### Major Changes

- [#166906](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166906)
  [`aac76c4a54baf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aac76c4a54baf) -
  added **rendererExtensionOptions option to pass renderer extension handlers to extensions in
  editor to allow displaying of renderer view for bodiedExtensions—optional not required. To use for
  extension plugin, pass **rendererExtensionOptions to universal preset via its
  initialPluginConfiguration prop. To use for referentialityPlugin, use \_\_rendererExtensionOptions
  option. In a future release, changes will be added to use this new option. Note: option is not
  fully supported currently and is intended for use for confluence live pages

### Patch Changes

- Updated dependencies

## 1.18.6

### Patch Changes

- Updated dependencies

## 1.18.5

### Patch Changes

- Updated dependencies

## 1.18.4

### Patch Changes

- Updated dependencies

## 1.18.3

### Patch Changes

- [#170141](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170141)
  [`ffd83c94a6a9d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ffd83c94a6a9d) -
  Wrap handleDrop logic added as part of the legacy content macro on the extension in a feature
  gate.

## 1.18.2

### Patch Changes

- [#168661](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168661)
  [`2061425d2a648`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2061425d2a648) -
  ED-25724 - Legacy Content Macro: Add logic that deselects the extension node when the user clicks
  into the LCM editable area.

## 1.18.1

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0
- Updated dependencies

## 1.18.0

### Minor Changes

- [#161325](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161325)
  [`69312480d1ccc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/69312480d1ccc) -
  [ux] [ED-25381] add drag and drop disabling and skipValidation options to editor to enable nested
  legacy content editor

### Patch Changes

- Updated dependencies

## 1.17.3

### Patch Changes

- Updated dependencies

## 1.17.2

### Patch Changes

- Updated dependencies

## 1.17.1

### Patch Changes

- Updated dependencies

## 1.17.0

### Minor Changes

- [#162388](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162388)
  [`20e29525ca817`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/20e29525ca817) -
  refactor: use React.lazy instead of react-loadable for config-panel header icon

### Patch Changes

- Updated dependencies

## 1.16.0

### Minor Changes

- [#159018](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159018)
  [`14d5e189df870`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14d5e189df870) -
  [ux] ED-25367-remove-copy-button-from-view-mode-when-its-the-only-item

### Patch Changes

- Updated dependencies

## 1.15.9

### Patch Changes

- [#160771](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160771)
  [`52c92c480a7df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52c92c480a7df) -
  Passes bodied macro feature gate and live page info from Confluence to extension nodes
- Updated dependencies

## 1.15.8

### Patch Changes

- [`0b274edd1ef5e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0b274edd1ef5e) -
  Init new calendar button functionality in ConfigPanel date pickers

## 1.15.7

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0
- Updated dependencies

## 1.15.6

### Patch Changes

- Updated dependencies

## 1.15.5

### Patch Changes

- [#155693](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155693)
  [`172485595104b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/172485595104b) -
  [ED-24685] Removing feature flag that gated multi bodied extensions being available in the editor
- Updated dependencies

## 1.15.4

### Patch Changes

- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1
- Updated dependencies

## 1.15.3

### Patch Changes

- Updated dependencies

## 1.15.2

### Patch Changes

- [#153024](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153024)
  [`f2ca7201459b1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f2ca7201459b1) -
  Fix issue where the label for id did not target the input
- [#153024](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153024)
  [`f2ca7201459b1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f2ca7201459b1) -
  Fix tests where id targeting need to be updated
- Updated dependencies

## 1.15.1

### Patch Changes

- [#152399](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152399)
  [`fbd7217f0cb51`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fbd7217f0cb51) -
  [ux] ED-25092: Migrated table toolbar icons
- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1
- Updated dependencies

## 1.15.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 1.14.18

### Patch Changes

- [#149558](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149558)
  [`5e8619ac0f6e4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e8619ac0f6e4) -
  [ux] [ED-25085] Migrate typography \

  editor-plugin-media:

  - replace caption placeholder span with button
  - replace x between width and height pixel entry with symbol × \

  tmp-editor-statsig:

  - Add experiment `platform_editor_typography_migration_ugc`

- Updated dependencies

## 1.14.17

### Patch Changes

- [#143559](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143559)
  [`56dfbfe361f96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56dfbfe361f96) -
  Upgrade react-select from 5.4 to 5.8 and replace it with internal atlaskit/react-select
- [#143559](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143559)
  [`56dfbfe361f96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56dfbfe361f96) -
  Upgrade react-select from 5.4 to 5.8 and replace it with internal atlaskit/react-select
- Updated dependencies

## 1.14.16

### Patch Changes

- Updated dependencies

## 1.14.15

### Patch Changes

- Updated dependencies

## 1.14.14

### Patch Changes

- Updated dependencies

## 1.14.13

### Patch Changes

- Updated dependencies

## 1.14.12

### Patch Changes

- Updated dependencies

## 1.14.11

### Patch Changes

- Updated dependencies

## 1.14.10

### Patch Changes

- Updated dependencies

## 1.14.9

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.14.8

### Patch Changes

- Updated dependencies

## 1.14.7

### Patch Changes

- [#139034](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139034)
  [`517cdc0f7ea1a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/517cdc0f7ea1a) -
  Used experiment for lazy node view

## 1.14.6

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 1.14.5

### Patch Changes

- Updated dependencies

## 1.14.4

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 1.14.3

### Patch Changes

- Updated dependencies

## 1.14.2

### Patch Changes

- Updated dependencies

## 1.14.1

### Patch Changes

- Updated dependencies

## 1.14.0

### Minor Changes

- [#129411](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129411)
  [`175fc1454a8a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/175fc1454a8a4) -
  [ux] Migrate typography with new ADS token and primitive and remove feature gate

### Patch Changes

- Updated dependencies

## 1.13.1

### Patch Changes

- Updated dependencies

## 1.13.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

### Patch Changes

- Updated dependencies

## 1.12.4

### Patch Changes

- [#127640](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127640)
  [`ccefb817c754a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ccefb817c754a) -
  [ux] Migrate typography with new ADS token and primitive

## 1.12.3

### Patch Changes

- [#127699](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127699)
  [`3c14790d31686`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c14790d31686) -
  [ux] Wrap extension in lazy node view. Align bodied extension with fallback.
- Updated dependencies

## 1.12.2

### Patch Changes

- Updated dependencies

## 1.12.1

### Patch Changes

- Updated dependencies

## 1.12.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.11.1

### Patch Changes

- [#123920](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123920)
  [`dc459fb7e6e6b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dc459fb7e6e6b) -
  Add event listener for updates to Forge app config schema and force re-render of the config panel.
  Async functions in Forge apps lead to a race condition that causes the panel to render stale
  schemas unless the panel is re-rendered.

## 1.11.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

### Patch Changes

- Updated dependencies

## 1.10.2

### Patch Changes

- Updated dependencies

## 1.10.1

### Patch Changes

- Updated dependencies

## 1.10.0

### Minor Changes

- [#119966](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119966)
  [`596ad24e38929`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/596ad24e38929) -
  Clean up typescript references to LegacyPortalProviderAPI

### Patch Changes

- Updated dependencies

## 1.9.4

### Patch Changes

- Updated dependencies

## 1.9.3

### Patch Changes

- Updated dependencies

## 1.9.2

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
- [#116062](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116062)
  [`1c26d1ee6fb25`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c26d1ee6fb25) -
  Migrated to new atlaskit Buttons.
- Updated dependencies

## 1.9.1

### Patch Changes

- Updated dependencies

## 1.9.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

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

- [#114683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114683)
  [`ff0815316ab38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff0815316ab38) -
  Removes usage of custom theme button in places where its API is not being used and the default
  button is able to be used instead. This should give a slight performance (runtime) improvement.

## 1.8.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 1.7.1

### Patch Changes

- Updated dependencies

## 1.7.0

### Minor Changes

- [#112575](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112575)
  [`63dcaae87255b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/63dcaae87255b) -
  Passes new FF for new experiment to macro code and updates type to be object from boolean to
  account for multiple FFs

### Patch Changes

- Updated dependencies

## 1.6.1

### Patch Changes

- Updated dependencies

## 1.6.0

### Minor Changes

- [#108272](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108272)
  [`a2eeda76039fd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a2eeda76039fd) -
  [EDF-465] Move convertExtensionType action to extensions plugin to decouple the ai plugin with the
  extensions plug

### Patch Changes

- Updated dependencies

## 1.5.4

### Patch Changes

- Updated dependencies

## 1.5.3

### Patch Changes

- Updated dependencies

## 1.5.2

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.5.1

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 1.5.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 1.4.7

### Patch Changes

- Updated dependencies

## 1.4.6

### Patch Changes

- [#98080](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98080)
  [`23c03580e38c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/23c03580e38c) -
  [ux] [ED-23247] Allow floating toolbar copy buttons in live pages view mode.

## 1.4.5

### Patch Changes

- Updated dependencies

## 1.4.4

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 1.4.3

### Patch Changes

- [#97158](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97158)
  [`5568b03ef792`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5568b03ef792) -
  [ux] EDF-661: Fix AI Panels Undo behaviour during insert flows (revert extension insertion) and
  regenerate flows (revert content changes)
- Updated dependencies

## 1.4.2

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5
- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#95168](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95168)
  [`2091e194a817`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2091e194a817) -
  Introduced new PortalProviderAPI behind a FF

### Patch Changes

- Updated dependencies

## 1.3.5

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 1.3.4

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1

## 1.3.3

### Patch Changes

- Updated dependencies

## 1.3.2

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component
- Updated dependencies

## 1.3.1

### Patch Changes

- [#93689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93689)
  [`5ba5d2b4a9ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ba5d2b4a9ac) -
  Updating adf-schema version to 35.10.0

## 1.3.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#91586](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91586)
  [`b3135ab49e16`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b3135ab49e16) -
  Updated `@atlaskit/tabs` dependency which removed baked-in horizontal padding. There may be some
  very slight difference in padding after this change.

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options
- Updated dependencies

## 1.1.8

### Patch Changes

- [#87119](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87119)
  [`0cea7cb799c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0cea7cb799c3) -
  [EDF-462] Add analytics for AI Blocks
- Updated dependencies

## 1.1.7

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 1.1.6

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 1.1.5

### Patch Changes

- [#83188](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83188)
  [`cd5d06cd3329`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd5d06cd3329) -
  Minor adjustments to improve compatibility with React 18
- Updated dependencies

## 1.1.4

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

## 1.1.3

### Patch Changes

- [#83044](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83044)
  [`cdab77009f9e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cdab77009f9e) -
  Fix leftover react 18 type issues in editor-core, editor-plugin-extension and date
- Updated dependencies

## 1.1.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#79555](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79555)
  [`7f38cd921e3d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7f38cd921e3d) -
  ED-22229: Removed allowAutoSave option from ConfigPanel to default to true always

## 1.0.10

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0

## 1.0.9

### Patch Changes

- [#80986](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80986)
  [`809b47ce5ce4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/809b47ce5ce4) -
  React 18 Types for editor-plugin-extensions

## 1.0.8

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

## 1.0.7

### Patch Changes

- Updated dependencies

## 1.0.6

### Patch Changes

- [#75087](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75087)
  [`ede66b0fc1d5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ede66b0fc1d5) -
  [ux] ED-22045 Removing custom logic for MBE floating toolbar.

## 1.0.5

### Patch Changes

- [#75436](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75436)
  [`bfcf32bb4fa3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bfcf32bb4fa3) -
  [ux] ED-21941 Disable resize/layout options for table, media and extension when added to MBE.
  Table rendering fixed for Confluence editor

## 1.0.4

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- [#74716](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74716)
  [`e4dcc12c4f8d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e4dcc12c4f8d) -
  ED-22048 Disable MBE partial selection to fix unwanted extensionFrame deletion.
- Updated dependencies

## 1.0.2

### Patch Changes

- [#72671](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72671)
  [`c446a8ca183b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c446a8ca183b) -
  ED-21912 Adding support for left arrow navigation from within MBE tabs.
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

## 0.7.4

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency
- [#70460](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70460)
  [`2f37600156ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f37600156ae) -
  The internal composition of a component in this package has changed. There is no expected change
  in behaviour.

## 0.7.3

### Patch Changes

- [#71136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71136)
  [`c803fea1e6a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c803fea1e6a4) -
  Move all plugin translations to editor-common
- Updated dependencies

## 0.7.2

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 0.7.1

### Patch Changes

- [#70741](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70741)
  [`7c1487568202`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7c1487568202) -
  ED-21973: Fix for MBE side panel config params update

## 0.7.0

### Minor Changes

- [#68640](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68640)
  [`e173cb423c75`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e173cb423c75) -
  Migrate extension plugin to useSharedPluginState from WithPluginState. Adds new dependency on
  BasePlugin.

### Patch Changes

- Updated dependencies

## 0.6.3

### Patch Changes

- [#68264](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68264)
  [`daa71f6aa162`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/daa71f6aa162) -
  [ux] ED-21883: Updated MultiBodied Extension related CSS and selections
- Updated dependencies

## 0.6.2

### Patch Changes

- [#68501](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68501)
  [`c813e900fdde`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c813e900fdde) -
  ED-21735: Added extension config panel support for MBE

## 0.6.1

### Patch Changes

- Updated dependencies

## 0.6.0

### Minor Changes

- [#67100](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67100)
  [`55cdf07c41cb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/55cdf07c41cb) -
  Allow create label formatting for custom fields from extension

### Patch Changes

- Updated dependencies

## 0.5.2

### Patch Changes

- [#66759](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66759)
  [`906578f1ea5d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/906578f1ea5d) -
  [ux] ED-21787: Migrating few CSS entries to space and color tokens

## 0.5.1

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.5.0

### Minor Changes

- [#65712](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65712)
  [`963b53c64eee`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/963b53c64eee) -
  Extract code for extension plugin from editor-core to @atlaskit/editor-plugin-extension

### Patch Changes

- Updated dependencies

## 0.4.2

### Patch Changes

- Updated dependencies

## 0.4.1

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

## 0.4.0

### Minor Changes

- [#43164](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43164)
  [`3aeedf55e29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3aeedf55e29) -
  [ED-20068] Move editSelectedExtension to ExtensionPluginActions

## 0.3.0

### Minor Changes

- [#43042](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43042)
  [`fd547efa4e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd547efa4e5) - Remove
  `macro` editor plugin and migrate functionality into extension plugin.

## 0.2.5

### Patch Changes

- [#42995](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42995)
  [`a527682dee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a527682dee6) - add in
  missing dependencies for imported types

## 0.2.4

### Patch Changes

- [#42929](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42929)
  [`096057c8169`](https://bitbucket.org/atlassian/atlassian-frontend/commits/096057c8169) - add
  dependency to editor-plugin-analytics

## 0.2.3

### Patch Changes

- [#42869](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42869)
  [`e49e90d2093`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e49e90d2093) -
  Decoupling internal analytics plugin from extensions and macro plugins.

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#39743](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39743)
  [`da629b62ef9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da629b62ef9) - ED-19617
  Refactor actions to remove createExtenstionAPI and call it instead during initialisation
