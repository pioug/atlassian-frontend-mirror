# @atlaskit/editor-plugin-expand

## 3.2.3

### Patch Changes

- [#134373](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134373)
  [`2260b25ebfbe9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2260b25ebfbe9) -
  A11Y-10088 fixing aria-label for expand
- Updated dependencies

## 3.2.2

### Patch Changes

- Updated dependencies

## 3.2.1

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [#128788](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128788)
  [`83a4d1ba203b0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/83a4d1ba203b0) -
  [ux] update icons

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

- [#120472](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120472)
  [`4758d7dd443dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4758d7dd443dd) -
  [ux] ED-26766 update adf-schema from 47.2.1 to 47.6.0 and adf-schema-json from 1.27.0 to 1.31.0
  and feature gated the usage of new prosemirror nodes in blockTypePlugin, expandPlugin, listPlugin
  and panelPlugin as the new defaults of these nodes support nesting of extensions
- [#120472](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120472)
  [`73c800ab5f2fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73c800ab5f2fc) -
  ED-26766 update adf-schema from 47.2.1 to 47.6.0 and adf-schema-json from 1.27.0 to 1.31.0

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 3.0.0

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

## 2.12.1

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 2.12.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 2.11.1

### Patch Changes

- Updated dependencies

## 2.11.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 2.10.14

### Patch Changes

- Updated dependencies

## 2.10.13

### Patch Changes

- [#100788](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100788)
  [`661d3aefc2866`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/661d3aefc2866) -
  ED-26070 remove feature flag for platform_editor_nest_nested_expand_drag_fix

## 2.10.12

### Patch Changes

- Updated dependencies

## 2.10.11

### Patch Changes

- [#182077](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/182077)
  [`efe589f6d9ed0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/efe589f6d9ed0) -
  (internal) Minor code changes; updated tests to be compatible with SWC transpilation

## 2.10.10

### Patch Changes

- Updated dependencies

## 2.10.9

### Patch Changes

- [#180080](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180080)
  [`2c21ba8914848`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2c21ba8914848) -
  [ux] ED-26013 fix expand on auto scoll for long node

## 2.10.8

### Patch Changes

- [#178005](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178005)
  [`3a71ff9cf31d4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3a71ff9cf31d4) -
  ED-25723 removing feature flag and use exisiting implementation for handleScrollToSelection for
  singlePlayerExapnd

## 2.10.7

### Patch Changes

- Updated dependencies

## 2.10.6

### Patch Changes

- Updated dependencies

## 2.10.5

### Patch Changes

- Updated dependencies

## 2.10.4

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0
- Updated dependencies

## 2.10.3

### Patch Changes

- Updated dependencies

## 2.10.2

### Patch Changes

- [#163321](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163321)
  [`9cbf3468984dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9cbf3468984dc) -
  ED-25609: migrates expand plugin ReactDOM references to portalprovider
- Updated dependencies

## 2.10.1

### Patch Changes

- [#162141](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162141)
  [`e292090371d60`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e292090371d60) -
  migrate expand chevron to new icon

## 2.10.0

### Minor Changes

- [#159018](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159018)
  [`14d5e189df870`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14d5e189df870) -
  [ux] ED-25367-remove-copy-button-from-view-mode-when-its-the-only-item

### Patch Changes

- Updated dependencies

## 2.9.5

### Patch Changes

- [#159926](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159926)
  [`f60e3e772ea72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f60e3e772ea72) -
  Add null check to fix crash in legacy toolbar while swapping ebetween view and edit mode in love
  pages
- Updated dependencies

## 2.9.4

### Patch Changes

- [#159855](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159855)
  [`f91ace0ef7fbe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f91ace0ef7fbe) -
  [ux] ED-25534 Fix Long Content Expand auto scroll issue
- [#159308](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159308)
  [`14ef6f05d711c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14ef6f05d711c) -
  [ED-24690] Replace LD FF with Statsig platform-editor-single-player-expand
- Updated dependencies

## 2.9.3

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 2.9.2

### Patch Changes

- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1
- Updated dependencies

## 2.9.1

### Patch Changes

- [#152399](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152399)
  [`fbd7217f0cb51`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fbd7217f0cb51) -
  [ux] ED-25092: Migrated table toolbar icons
- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1
- Updated dependencies

## 2.9.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 2.8.3

### Patch Changes

- [#149525](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149525)
  [`cf44ad9250b31`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cf44ad9250b31) -
  fix expand icon issue
- Updated dependencies

## 2.8.2

### Patch Changes

- Updated dependencies

## 2.8.1

### Patch Changes

- Updated dependencies

## 2.8.0

### Minor Changes

- [#146025](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146025)
  [`03eae90c614d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/03eae90c614d1) -
  Remove platform.editor.live-view.disable-editing-in-view-mode_fi1rx feature flag

## 2.7.7

### Patch Changes

- Updated dependencies

## 2.7.6

### Patch Changes

- [#144606](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144606)
  [`20ab1284d9880`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/20ab1284d9880) -
  ED-24990 - Bugfix: cursor was going outside of parent expand and table cell when nested expand was
  deleted.

## 2.7.5

### Patch Changes

- [#143199](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143199)
  [`2c7282d335256`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2c7282d335256) -
  [ux] [ED-24799] This change allows users to navigate using Tab when there are multiple expands on
  the page. Previously, users could only navigate around the 1st expand on the page with Tab.
- Updated dependencies

## 2.7.4

### Patch Changes

- [#142470](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142470)
  [`3f2dc4e949e05`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f2dc4e949e05) -
  ED-25000 - Add logic to handle when nested expand dragged into another nested expand.
- Updated dependencies

## 2.7.3

### Patch Changes

- Updated dependencies

## 2.7.2

### Patch Changes

- [#141778](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141778)
  [`1c6f578277694`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c6f578277694) -
  ED-24870 & ED-24864 - Add the logic to gate the nested media in quotes functionality behind the
  nest-media-and-codeblock-in-quote experiment. Also adjust the logic so the nested expands are now
  behind the nested-expand-in-expand experiment.

## 2.7.1

### Patch Changes

- [#142108](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142108)
  [`a1776d86877fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a1776d86877fe) -
  ED-24864 ED-24931 Add logic to handle dragging expands inside and outside of eachother, converting
  them to and from nested expands when required. Also add experiment gating for nested-dnd.

## 2.7.0

### Minor Changes

- [#141652](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141652)
  [`1cbce9d217a8e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1cbce9d217a8e) -
  [ux] EDF-1549 AI button added in floating toolbar of panel, table, layout and expand behind
  experiment.

## 2.6.5

### Patch Changes

- [#140869](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140869)
  [`e69985951ade3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e69985951ade3) -
  ED-24557: Cleaned up platform_editor_single_player_expand_ed_24536

## 2.6.4

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 2.6.3

### Patch Changes

- [#139631](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139631)
  [`0c5d47f791446`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c5d47f791446) -
  ED-24839 - Added logic to handleDrop for the expand plugin so nested expands are converted to
  expand nodes when dragged outside of an expand. Prosemirror was automatically wrapping them in an
  empty parent expand.

## 2.6.2

### Patch Changes

- [#139052](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139052)
  [`6e5c1f6bbf028`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6e5c1f6bbf028) -
  removed 'platform' from cardPlugin configs
- Updated dependencies

## 2.6.1

### Patch Changes

- [#138299](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138299)
  [`7bab5c1cce65c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7bab5c1cce65c) -
  [ED-24860] Split out ADF schema change for nesting nestedExpand in expand
- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 2.6.0

### Minor Changes

- [#134731](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134731)
  [`07dc34f5168a0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/07dc34f5168a0) -
  [ux] ED-23190 This change allows users to navigate using Tab when there are multiple expands on
  the page. Previously, users could only navigate around the 1st expand on the page with Tab.

## 2.5.4

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 2.5.3

### Patch Changes

- [#133153](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133153)
  [`8b4916b8bcdd1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b4916b8bcdd1) -
  [ux] [ED-24442] Fix logic on what expand node floating toolbar anchors on by checking for nested
  expand before expand in findParentExpandNode function

## 2.5.2

### Patch Changes

- Updated dependencies

## 2.5.1

### Patch Changes

- [#129932](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129932)
  [`d6a093f919beb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d6a093f919beb) -
  [ED-24588] When inserting an expand with an existing expand selected, insert expand below the
  expand

## 2.5.0

### Minor Changes

- [#130725](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130725)
  [`87a6f9ef9fecf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87a6f9ef9fecf) -
  [ED-24279] Add Jira feature flag for the nesting nestedExpand in Expand change

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#129865](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129865)
  [`dcf004629249a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf004629249a) -
  [ED-24280] Added the capability to nest nestedExpands in expands

### Patch Changes

- Updated dependencies

## 2.3.1

### Patch Changes

- [#128418](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128418)
  [`8f46a682011a7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f46a682011a7) -
  [ux][ED-24536] Fix: when a single player expand is inserted via main toolbar while selection is
  not empty, it is inserted in closed state

## 2.3.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change
- [#128333](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128333)
  [`4ad86751ab1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4ad86751ab1d7) -
  [ED-24505] Implement onClick handler for Turn into dropdown options and update relevant insertion
  analytics with inputMethod: floatingToolbar when an element is inserted via the dropdown

### Patch Changes

- Updated dependencies

## 2.2.1

### Patch Changes

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

## 2.0.3

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

## 1.9.2

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
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

## 1.8.1

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 1.7.7

### Patch Changes

- Updated dependencies

## 1.7.6

### Patch Changes

- [#107785](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107785)
  [`7304a7cd937f9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7304a7cd937f9) -
  [ux] [ED-23522] Single player expands on behind `platform.editor.single-player-expand` for all
  editors, single player expands on without `platform.editor.single-player-expand` feature flag for
  live page editors

## 1.7.5

### Patch Changes

- [#111395](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111395)
  [`982ae51e945a5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/982ae51e945a5) -
  [ux] ED-23658 A user on a live page in view mode is not able to edit the contents of an expand.
- Updated dependencies

## 1.7.4

### Patch Changes

- [#110390](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110390)
  [`bead123202369`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bead123202369) -
  [ux] [ED-23642] Reordering the typeahead so that date, status, code block & info panel are above
  the fold (in the top 5 results)
- Updated dependencies

## 1.7.3

### Patch Changes

- Updated dependencies

## 1.7.2

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.7.1

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 1.7.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 1.6.12

### Patch Changes

- Updated dependencies

## 1.6.11

### Patch Changes

- [#98080](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98080)
  [`23c03580e38c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/23c03580e38c) -
  [ux] [ED-23247] Allow floating toolbar copy buttons in live pages view mode.

## 1.6.10

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 1.6.9

### Patch Changes

- [#97592](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97592)
  [`97342ab324ba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/97342ab324ba) -
  [ux] [ED-23114] Add functionality for undo and redo behaviour using ProseMirror while inside the
  title of an expand. Previously, this was being handled by the browser default behaviour.

## 1.6.8

### Patch Changes

- [#97116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97116)
  [`7f699439f92f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7f699439f92f) -
  [ED-22282] Clean up `allow-extended-nested-expand` feature flag.
- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.6.7

### Patch Changes

- Updated dependencies

## 1.6.6

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 1.6.5

### Patch Changes

- [#95610](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95610)
  [`1520db696653`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1520db696653) -
  [ED-23108] Follow up to refactor the logic in the single player expands update function. Single
  player expands are only used when `platform.editor.single-player-expand` FF AND live page are both
  enabled.
- Updated dependencies

## 1.6.4

### Patch Changes

- [#94988](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94988)
  [`8e5daa7c846d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8e5daa7c846d) -
  [ux] [ED-22983] disable editing in singlePlayer expand nodes when editorDisabled state is true.
  these changes are only applied when the
  platform.editor.live-view.disable-editing-in-view-mode_fi1rx FF is on, and the singlePlayer expand
  is used when live view is enabled and the platform.editor.single-player-expand FF is enabled.

## 1.6.3

### Patch Changes

- [#95226](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95226)
  [`35450b170a19`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35450b170a19) -
  [ux] [ED-23152] Expands no longer change state (open/closed) when the page width is toggled by a
  user (live pages/ single player expands)
- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1
- [#94398](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94398)
  [`4df808e35fda`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4df808e35fda) -
  [ux] [ED-23108] Solve bug where single player expands would lose their expanded state when adding
  breakout marks. Single player expands are only used when `platform.editor.single-player-expand` FF
  AND live page are both enabled.

## 1.6.2

### Patch Changes

- [#93962](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93962)
  [`797e12a40048`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/797e12a40048) -
  [ED-23107] fix functionality for moving down from the title of an expand with the arrow key down -
  you can be anywhere inside the single player expand title and move down now. the single player
  expand is only used when live view is enabled and the platform.editor.single-player-expand FF is
  enabled.

## 1.6.1

### Patch Changes

- [#93689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93689)
  [`5ba5d2b4a9ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ba5d2b4a9ac) -
  Updating adf-schema version to 35.10.0

## 1.6.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.5.2

### Patch Changes

- [#91461](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91461)
  [`1b353cb06cc8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1b353cb06cc8) -
  [ED-23042] Disable editing in code blocks and expand nodes when editorDisabled state is true

## 1.5.1

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options
- Updated dependencies

## 1.5.0

### Minor Changes

- [#92831](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92831)
  [`c8652f78a9ce`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c8652f78a9ce) -
  [ED-22991] add functionality for moving left and moving right with the single player expands. the
  single player expand is only used when live view is enabled and the
  platform.editor.single-player-expand FF is enabled.

### Patch Changes

- [#92956](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92956)
  [`33ba4a1b556d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/33ba4a1b556d) -
  [ux] [ED-23085] Fix contenteditable being not set to false when expand closed for single player
  expand. This single player expand is only used when live view is enabled and the
  platform.editor.single-player-expand FF is enabled.

## 1.4.3

### Patch Changes

- [#92468](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92468)
  [`515df766c29c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/515df766c29c) -
  [ux] [ED-23066] Re-render expand toggle icon when the class name is updated so that the
  aria-expanded attribute gets updated to match.

## 1.4.2

### Patch Changes

- [#91886](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91886)
  [`5c0443e007d9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c0443e007d9) -
  [ux] Fix bug where selection marker shows when focussing on the expand title with the keyboard.

## 1.4.1

### Patch Changes

- [#90897](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90897)
  [`6a1d609df65e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a1d609df65e) -
  [ux] [ED-22841] Implement new state management for the single player expand and handle the
  expanding behaviour based on this. Single player expand will only be used if
  `platform.editor.single-player-expand` is true and livePage is enabled.

## 1.4.0

### Minor Changes

- [#90925](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90925)
  [`431c0d17e3e3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/431c0d17e3e3) -
  [ux] Improve the selection marker by hiding it when in an expand and improving styling by making
  it more subtle.

## 1.3.5

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 1.3.4

### Patch Changes

- [#91146](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91146)
  [`c982f92adfee`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c982f92adfee) -
  [ux] Revert changes from ED-22666 as expand is not editable when not selected initially
- Updated dependencies

## 1.3.3

### Patch Changes

- [#90914](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90914)
  [`a4a9d317e5b8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a4a9d317e5b8) -
  [ux] [ED-23013] Fix bug in single player expand where backspace in the title would delete entire
  expand even if the title had content.

## 1.3.2

### Patch Changes

- [#89345](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89345)
  [`80a9a5da9ce4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/80a9a5da9ce4) -
  [ED-22840] Build the base functionality of the new single player expand which will be used for
  live view pages. Single player expand will only be used if `platform.editor.single-player-expand`
  is true and livePage is enabled.

## 1.3.1

### Patch Changes

- [#89499](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89499)
  [`1a3ac47ce689`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1a3ac47ce689) -
  ED-22666 Disable editing when editor in view mode or edtable is false

## 1.3.0

### Minor Changes

- [#87870](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87870)
  [`76711a3e7edd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/76711a3e7edd) -
  [ED-22839] Refactor expand plugin to use either legacy (current) expand or single player expand
  (coming soon). Single player expand will only be used if `platform.editor.single-player-expand` is
  true and livePage is enabled.

## 1.2.6

### Patch Changes

- [#88038](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88038)
  [`19ac4de34153`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19ac4de34153) -
  update 'w3c-keyname' dependency to 2.1.8
- Updated dependencies

## 1.2.5

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 1.2.4

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

## 1.2.3

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.2.2

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0

## 1.2.1

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

## 1.2.0

### Minor Changes

- [#76115](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76115)
  [`3e3eb7cf04e1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3e3eb7cf04e1) -
  ED-21718 Transform slice to remove nestedExpand from slice before pasting

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#75042](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75042)
  [`ce823f018248`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ce823f018248) -
  [ux] ED-21987 Diverge expands in live pages so that they are not multiplayer, and are closed by
  default.

### Patch Changes

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

## 0.4.8

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.4.7

### Patch Changes

- [#71186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71186)
  [`d76c62a2d98a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d76c62a2d98a) -
  [ux] ED-22029 Use extendedNestedExpand node when 'platform.editor.allow-extended-nested-panel' FF
  is enabled

## 0.4.6

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 0.4.5

### Patch Changes

- Updated dependencies

## 0.4.4

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.4.3

### Patch Changes

- Updated dependencies

## 0.4.2

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802)
  [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) -
  Ensure all editor plugins are marked as singletons

## 0.4.1

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.4.0

### Minor Changes

- [#64335](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64335)
  [`efc8826c907f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/efc8826c907f) -
  [ux] [ED-16509] Restart numbered list inserting nodes via QUICK INSERT, nodes including : panels,
  expands, decisions, tables, layout, quotes, actions, dividers, headings. Changes are being guarded
  behind feature flag platform.editor.ordered-list-inserting-nodes_bh0vo

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [#62737](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62737)
  [`2a6280e4e570`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2a6280e4e570) -
  Add new configuration option to expand plugin (`allowInteractiveExpand`) to configure the plugin.
  Previously the consumer would have to set the `interactiveExpand` feature flag in the expand
  plugin to configure this behaviour. It is also now set by default.

## 0.2.1

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 0.2.0

### Minor Changes

- [#61501](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61501)
  [`943c6cbeb965`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/943c6cbeb965) -
  Aria-expanded attribute for Expand/Collapse button.

## 0.1.12

### Patch Changes

- Updated dependencies

## 0.1.11

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808)
  [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) -
  ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 0.1.10

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246)
  [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) -
  ED-21371 Update adf-schema to 35.1.0

## 0.1.9

### Patch Changes

- Updated dependencies

## 0.1.8

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 0.1.7

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763)
  [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) -
  update ADF schema

## 0.1.6

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790)
  [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) -
  ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 0.1.5

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

- Updated dependencies
