# @atlaskit/editor-plugin-panel

## 4.1.0

### Minor Changes

- [#119765](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119765)
  [`5a27b842be965`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5a27b842be965) -
  Add deprecated label to `forceStaticToolbar` in floating toolbar property and remove its usage
  across plugins

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- [#117485](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/117485)
  [`e9a8d9ba26963`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e9a8d9ba26963) -
  Reorder icons, and remove some based on new editor controls. Changes under
  `editor_plugin_controls` experiment.

## 4.0.0

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

## 3.3.3

### Patch Changes

- [#115259](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115259)
  [`a3150808f308a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3150808f308a) -
  Add new forceStaticToolbar config option to floating toolbar and add it to panel and table. Add
  new contextual toolbar plugin which controls expand and collapse logic for toolbar options.
- Updated dependencies

## 3.3.2

### Patch Changes

- Updated dependencies

## 3.3.1

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 3.3.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 3.2.6

### Patch Changes

- Updated dependencies

## 3.2.5

### Patch Changes

- Updated dependencies

## 3.2.4

### Patch Changes

- Updated dependencies

## 3.2.3

### Patch Changes

- Updated dependencies

## 3.2.2

### Patch Changes

- Updated dependencies

## 3.2.1

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [#178674](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178674)
  [`112c90f42dcbc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/112c90f42dcbc) -
  Refactored folder structure to confirm to new editor standards

### Patch Changes

- Updated dependencies

## 3.1.6

### Patch Changes

- Updated dependencies

## 3.1.5

### Patch Changes

- Updated dependencies

## 3.1.4

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0
- Updated dependencies

## 3.1.3

### Patch Changes

- Updated dependencies

## 3.1.2

### Patch Changes

- [#163321](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163321)
  [`9cbf3468984dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9cbf3468984dc) -
  ED-25609: migrates expand plugin ReactDOM references to portalprovider
- Updated dependencies

## 3.1.1

### Patch Changes

- [#160699](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160699)
  [`3f6d3eca921ed`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f6d3eca921ed) -
  ED-25575: migrate panel plugin node rendering to portals

## 3.1.0

### Minor Changes

- [#159018](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159018)
  [`14d5e189df870`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14d5e189df870) -
  [ux] ED-25367-remove-copy-button-from-view-mode-when-its-the-only-item

## 3.0.1

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 3.0.0

### Major Changes

- [#156509](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156509)
  [`c58ae26b37318`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c58ae26b37318) -
  Fix versions for tmp-editor-statsig (major used to force dependers to release new versions)

## 2.6.6

### Patch Changes

- Updated dependencies

## 2.6.5

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18
- Updated dependencies

## 2.6.4

### Patch Changes

- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1
- Updated dependencies

## 2.6.3

### Patch Changes

- Updated dependencies

## 2.6.2

### Patch Changes

- [#152823](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152823)
  [`0ec705650807f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0ec705650807f) -
  [ux] ED-25090: ED-25090: Migrated link toolbar and panel toolbar to use the new icons

## 2.6.1

### Patch Changes

- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1
- Updated dependencies

## 2.6.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 2.5.8

### Patch Changes

- Updated dependencies

## 2.5.7

### Patch Changes

- Updated dependencies

## 2.5.6

### Patch Changes

- Updated dependencies

## 2.5.5

### Patch Changes

- Updated dependencies

## 2.5.4

### Patch Changes

- [#144925](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144925)
  [`9faf9ff89ad37`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9faf9ff89ad37) -
  ED-24822 - Add padding to panels with no icon and unhide drag handle in first bodied node

## 2.5.3

### Patch Changes

- Updated dependencies

## 2.5.2

### Patch Changes

- [#143310](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143310)
  [`f55df006dcd59`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f55df006dcd59) -
  ED-24822 - Add padding to panels with no icon and unhide drag handle in first bodied node
- Updated dependencies

## 2.5.1

### Patch Changes

- Updated dependencies

## 2.5.0

### Minor Changes

- [#141652](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141652)
  [`1cbce9d217a8e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1cbce9d217a8e) -
  [ux] EDF-1549 AI button added in floating toolbar of panel, table, layout and expand behind
  experiment.

## 2.4.0

### Minor Changes

- [#140949](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140949)
  [`f0496e4dd21b2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f0496e4dd21b2) -
  Make Panel Plugin use Emoji component from editor-plugin-emoji

### Patch Changes

- Updated dependencies

## 2.3.7

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 2.3.6

### Patch Changes

- Updated dependencies

## 2.3.5

### Patch Changes

- [#139335](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139335)
  [`ac5e66fc71394`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ac5e66fc71394) -
  ED-24798 bug-fix: pressing Backspace before media that is nested in a quote should move your
  selection to the media

## 2.3.4

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 2.3.3

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 2.3.2

### Patch Changes

- Updated dependencies

## 2.3.1

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

### Patch Changes

- Updated dependencies

## 2.2.1

### Patch Changes

- [#124134](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124134)
  [`66625e5ffed2f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/66625e5ffed2f) -
  Removed FF platform.editor.allow-custom-cut-for-panel
- Updated dependencies

## 2.2.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [`d9b562bd66f8e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d9b562bd66f8e) -
  [ux] [ED-23947] restoring the original order of the typeahead menu so that actions, media,
  mentions and emojis are above the fold (in the top 5 results). this change is a major because it
  removes the `getEditorFeatureFlags prop` for plugins. if any consumers who have adopted these
  changes to the public API, they should remove them on their side too.

### Patch Changes

- Updated dependencies

## 1.4.3

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
- Updated dependencies

## 1.4.2

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- [#115817](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115817)
  [`d647eedc6ddd4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d647eedc6ddd4) -
  [ux] [ED-23275] Feature flag cleanup for allow-extended-panel
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

## 1.2.5

### Patch Changes

- [#110390](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110390)
  [`bead123202369`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bead123202369) -
  [ux] [ED-23642] Reordering the typeahead so that date, status, code block & info panel are above
  the fold (in the top 5 results)
- Updated dependencies

## 1.2.4

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.2.2

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 1.2.1

### Patch Changes

- [#99825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99825)
  [`f48158a56833`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f48158a56833) -
  ECA11Y-195 Add missing aria-label for panels group in the floating toolbar

## 1.2.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 1.1.11

### Patch Changes

- Updated dependencies

## 1.1.10

### Patch Changes

- [#98080](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98080)
  [`23c03580e38c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/23c03580e38c) -
  [ux] [ED-23247] Allow floating toolbar copy buttons in live pages view mode.

## 1.1.9

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 1.1.8

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.1.7

### Patch Changes

- Updated dependencies

## 1.1.6

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 1.1.5

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1

## 1.1.3

### Patch Changes

- [#94717](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94717)
  [`40f38eb0a512`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40f38eb0a512) -
  Cleaning up feature flag for inserting nodes in ordered list.

  Fix bugs for incorrect ordered list order with action & improve selection behaviour on insert

- Updated dependencies

## 1.1.2

### Patch Changes

- [#93748](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93748)
  [`16e695c28843`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/16e695c28843) -
  ED-22891: Fixed selection weirdness when panel has no icon

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

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 1.0.8

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

## 1.0.7

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`
- Updated dependencies

## 1.0.6

### Patch Changes

- [#81827](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81827)
  [`7ed7ae4b5cb8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7ed7ae4b5cb8) -
  migrated to react18 compatiable types
- Updated dependencies

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

- [#75775](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75775)
  [`d0cee3285a1a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0cee3285a1a) -
  ED-22287: Adding 16px right padding to panel for all elements. Also using 12px for the no-icon
  usecase.
- Updated dependencies

## 1.0.2

### Patch Changes

- [#70470](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70470)
  [`7d1629af0072`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7d1629af0072) -
  ED-21607 Fix issue with cutting nodes leading to panel deletion

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

## 0.3.2

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.3.1

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 0.3.0

### Minor Changes

- [#68790](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68790)
  [`c6d8affc52d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d8affc52d1) -
  Support maybeAdd plugins in usePreset. Add typing support for universal preset.

  Now when using the editor API with the universal preset

### Patch Changes

- Updated dependencies

## 0.2.7

### Patch Changes

- [#67948](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67948)
  [`28fcdf6793a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/28fcdf6793a4) -
  Expand/collapse for panel and table color pickers

## 0.2.6

### Patch Changes

- Updated dependencies

## 0.2.5

### Patch Changes

- [#66826](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66826)
  [`5e9f6778a15a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e9f6778a15a) -
  [ux] resolved a bug where the cursor mispalced after pasting the media into the panel
- Updated dependencies

## 0.2.4

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.2.3

### Patch Changes

- [#65603](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65603)
  [`ac8d4b09e18e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ac8d4b09e18e) -
  ED-21609 Node nesting: Use the new nodespec for list and panel when respective FF's are enabled

## 0.2.2

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802)
  [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) -
  Ensure all editor plugins are marked as singletons

## 0.2.1

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.2.0

### Minor Changes

- [#64335](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64335)
  [`efc8826c907f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/efc8826c907f) -
  [ux] [ED-16509] Restart numbered list inserting nodes via QUICK INSERT, nodes including : panels,
  expands, decisions, tables, layout, quotes, actions, dividers, headings. Changes are being guarded
  behind feature flag platform.editor.ordered-list-inserting-nodes_bh0vo

### Patch Changes

- Updated dependencies

## 0.1.14

### Patch Changes

- [#63930](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63930)
  [`ab09a2d6f8f4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ab09a2d6f8f4) -
  ED-21649 Fixed issue with media content getting lost on backspace
- Updated dependencies

## 0.1.13

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 0.1.12

### Patch Changes

- [#61697](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61697)
  [`1a46191a332f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1a46191a332f) -
  ED-20963 Fixed issue with panel keymap - unable to delete ordered list within a quote

## 0.1.11

### Patch Changes

- [#60802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60802)
  [`3ef8131264ff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3ef8131264ff) -
  ED-20963 Allow normal backspace behaviour for lists inside quote
- Updated dependencies

## 0.1.10

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808)
  [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) -
  ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 0.1.9

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246)
  [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) -
  ED-21371 Update adf-schema to 35.1.0

## 0.1.8

### Patch Changes

- Updated dependencies

## 0.1.7

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 0.1.6

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763)
  [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) -
  update ADF schema

## 0.1.5

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790)
  [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) -
  ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 0.1.4

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417)
  [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971
  Upgrade adf-schema package to ^34.0.0

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379)
  [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763
  Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 0.1.1

### Patch Changes

- [#42995](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42995)
  [`a527682dee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a527682dee6) - add in
  missing dependencies for imported types
- Updated dependencies
