# @atlaskit/editor-plugin-annotation

## 2.5.0

### Minor Changes

- [#139139](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139139)
  [`7f6b665d778dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7f6b665d778dd) -
  [https://product-fabric.atlassian.net/browse/ED-27499](ED-27499) - the new
  `@atlassian/confluence-presets` package with Confluence `full-page` preset is created

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#137860](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137860)
  [`04e753d1ba0f4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/04e753d1ba0f4) -
  Created a new Annotation manager implementation and interface and updated CCFE to create and share
  this instance around

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#138416](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138416)
  [`8cfce6829f775`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8cfce6829f775) -
  Fix to have focussedCommentId render the standalone inlinecomment

## 2.2.2

### Patch Changes

- [#137627](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137627)
  [`ce160db6fb914`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ce160db6fb914) -
  [ENGHEALTH-28514] Icongraphy uplift for editor-plugin-annotation
- Updated dependencies

## 2.2.1

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#133398](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133398)
  [`fd3381fec1435`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fd3381fec1435) -
  clearing the selectedAnnotations on close of inline comment

## 2.1.10

### Patch Changes

- Updated dependencies

## 2.1.9

### Patch Changes

- [#131690](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131690)
  [`4ef6e6cdd0cec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4ef6e6cdd0cec) -
  Fix deleting inline comment view component if it is moved

## 2.1.8

### Patch Changes

- [#129644](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129644)
  [`f3daef1b37b2f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f3daef1b37b2f) -
  Fix setting the annotation selection after adding a comment if it is no longer in the annotation.
- Updated dependencies

## 2.1.7

### Patch Changes

- [#128761](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128761)
  [`917104463449c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/917104463449c) -
  Ensure the selected annotation state accounts for selections that are in between two annotations.
- Updated dependencies

## 2.1.6

### Patch Changes

- [#127441](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127441)
  [`f2f4b5971e0b2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2f4b5971e0b2) -
  [ux] Updates Text Formatting toolbar separators, active option style and removes range selection
  when the toolbar is docked to top.
- Updated dependencies

## 2.1.5

### Patch Changes

- Updated dependencies

## 2.1.4

### Patch Changes

- [#126126](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126126)
  [`468f52001a847`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/468f52001a847) -
  Tidy up contextual formatting toolbar experiment and switch to `platform_editor_controls` flag

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

## 2.0.2

### Patch Changes

- [#117485](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/117485)
  [`e9a8d9ba26963`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e9a8d9ba26963) -
  Reorder icons, and remove some based on new editor controls. Changes under
  `editor_plugin_controls` experiment.

## 2.0.1

### Patch Changes

- [#117936](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/117936)
  [`f9d438f975b72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f9d438f975b72) -
  Cleanup react 18 annotation nodeview memory leak.
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

## 1.28.1

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 1.28.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.27.1

### Patch Changes

- Updated dependencies

## 1.27.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.26.15

### Patch Changes

- [#107473](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107473)
  [`962b3297548df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962b3297548df) -
  [ux] Implement variation 2 for editor contextual toolbar formatting experiment

## 1.26.14

### Patch Changes

- [#105009](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105009)
  [`a4039ebf7ed11`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a4039ebf7ed11) -
  [ux] Implement variant 2 cohorts experience for platform_editor_contextual_formatting_toolbar_v2
  experiment
- Updated dependencies

## 1.26.13

### Patch Changes

- [#104018](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104018)
  [`80879ff079752`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/80879ff079752) -
  Fix annotation state for new todom node view

## 1.26.12

### Patch Changes

- [#103388](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103388)
  [`ff250d75803dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff250d75803dd) -
  Fix memory leak on react 18 concurrent mode with annotation node view.

## 1.26.11

### Patch Changes

- Updated dependencies

## 1.26.10

### Patch Changes

- [#99608](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99608)
  [`18ad3efa3ef3a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/18ad3efa3ef3a) -
  [ux] Updating the annotation ID list to empty when the page has no annotations

## 1.26.9

### Patch Changes

- Updated dependencies

## 1.26.8

### Patch Changes

- [#98661](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98661)
  [`9a4b50703ea36`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a4b50703ea36) -
  Clean up inline comment spotlight experiment
- Updated dependencies

## 1.26.7

### Patch Changes

- [#181574](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/181574)
  [`8645daab34a55`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8645daab34a55) -
  Add missing dom attributes to annotation mark in AnnotaitonNodeView, hot-114046

## 1.26.6

### Patch Changes

- Updated dependencies

## 1.26.5

### Patch Changes

- [#181212](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/181212)
  [`d9fa5a1d7f832`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d9fa5a1d7f832) -
  Removes type assertion from selectionToolbar in annotation plugin.
- Updated dependencies

## 1.26.4

### Patch Changes

- [#177868](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177868)
  [`431c4ab75f0c5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/431c4ab75f0c5) -
  [ux] Disable the annotation selection toolbar while offline.

## 1.26.3

### Patch Changes

- [#177132](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177132)
  [`089d1f8b617d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/089d1f8b617d7) -
  [ux] Shows title next to comment icon on the Selection toolbar when page is in View only mode and
  Contextual toolbar is enabled

## 1.26.2

### Patch Changes

- [#175810](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175810)
  [`f7a9d71722c78`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f7a9d71722c78) -
  ED-25989 adding analytic event for date inline node

## 1.26.1

### Patch Changes

- [#175552](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175552)
  [`b29361001f720`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b29361001f720) -
  refactor: remediate re-exports in editor-plugin-ai-definitions, editor-plugin-alignment,
  editor-plugin-analytics, editor-plugin-annotation
- Updated dependencies

## 1.26.0

### Minor Changes

- [#173684](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173684)
  [`e022c83d84bd3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e022c83d84bd3) -
  Fix errors caused by not checking for undefined annotation toolbar

## 1.25.7

### Patch Changes

- [#172933](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/172933)
  [`8323af2381d00`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8323af2381d00) -
  [ux] Arranges items in the Selection toolbar under the Contextual toolbar experiment flag
- Updated dependencies

## 1.25.6

### Patch Changes

- Updated dependencies

## 1.25.5

### Patch Changes

- Updated dependencies

## 1.25.4

### Patch Changes

- [#169327](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169327)
  [`d1439013677f3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d1439013677f3) -
  [ED-25834] adding tests for allow comment on inline node selection
- Updated dependencies

## 1.25.3

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0
- Updated dependencies

## 1.25.2

### Patch Changes

- [#168832](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168832)
  [`6a5261e14e959`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a5261e14e959) -
  [ux] ED-25834 allow comment on inline node selection

## 1.25.1

### Patch Changes

- [#167498](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167498)
  [`e275b9ee8b698`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e275b9ee8b698) -
  ED-25805: refactors plugins to meet folder standards
- Updated dependencies

## 1.25.0

### Minor Changes

- [#167231](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167231)
  [`335a373081eaf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/335a373081eaf) -
  [ux] Added hoveredAnnotation for the renderer and the editor to accomodate the newly implemented
  comment's panel

### Patch Changes

- Updated dependencies

## 1.24.1

### Patch Changes

- Updated dependencies

## 1.24.0

### Minor Changes

- [#161814](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161814)
  [`6ff956fe6b784`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6ff956fe6b784) -
  [ux] Add a new property to annotation state to know whether or not we're opening the comment box
  from the media toolbar so we can scroll it into view from Confluence side

## 1.23.3

### Patch Changes

- [#158723](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158723)
  [`8ff5b01b0d37f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ff5b01b0d37f) -
  [ED-24682] Cleanup feature flag for commenting on media in the renderer

  **@atlaskit/editor-plugin-media**: Add optional checks for the api in Comment Badges on media

- Updated dependencies

## 1.23.2

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 1.23.1

### Patch Changes

- Updated dependencies

## 1.23.0

### Minor Changes

- [#152319](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152319)
  [`bfa9c49e1928b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bfa9c49e1928b) -
  [ux] Added a check to handle the case where a single non-breaking space is selected and the user
  attempts to leave a comment on it.

### Patch Changes

- Updated dependencies

## 1.22.0

### Minor Changes

- [#157867](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157867)
  [`8398a1f0013fc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8398a1f0013fc) -
  [ux] ED-25331-add-spotlight-to-inline-comment-button

### Patch Changes

- Updated dependencies

## 1.21.3

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18
- Updated dependencies

## 1.21.2

### Patch Changes

- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1
- Updated dependencies

## 1.21.1

### Patch Changes

- [#152823](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152823)
  [`0ec705650807f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0ec705650807f) -
  [ux] Migrated comment icon from annotation package

## 1.21.0

### Minor Changes

- [#151611](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151611)
  [`ee71cb75c933c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ee71cb75c933c) -
  ED-25294 add new attribute as engagement platform message trigger

### Patch Changes

- [#152308](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152308)
  [`f331ed1265bfc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f331ed1265bfc) -
  ED-24671 Clean up platform_editor_element_drag_and_drop_ed_24638 feature gate
- [#151611](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151611)
  [`ee71cb75c933c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ee71cb75c933c) -
  ED-25294-add-more-attributes-analytics-event
- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1
- Updated dependencies

## 1.20.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 1.19.11

### Patch Changes

- Updated dependencies

## 1.19.10

### Patch Changes

- [#147094](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147094)
  [`9e12a8f47cfef`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9e12a8f47cfef) -
  [ED-24721] Clean up FF `confluence.frontend.fabric.editor.comments-on-media-analytics`
- Updated dependencies

## 1.19.9

### Patch Changes

- [#146981](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146981)
  [`1bb47674cd3df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1bb47674cd3df) -
  [ED-24683] clean up `confluence.frontend.fabric.editor.comments-on-media-media-inline-bug-fix`

## 1.19.8

### Patch Changes

- Updated dependencies

## 1.19.7

### Patch Changes

- Updated dependencies

## 1.19.6

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.19.5

### Patch Changes

- Updated dependencies

## 1.19.4

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 1.19.3

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 1.19.2

### Patch Changes

- Updated dependencies

## 1.19.1

### Patch Changes

- [`5f08e90d0ca00`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5f08e90d0ca00) -
  [ED-24638] Fix: comment button in selection toolbar disappears after dropping

## 1.19.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

### Patch Changes

- Updated dependencies

## 1.18.1

### Patch Changes

- Updated dependencies

## 1.18.0

### Minor Changes

- [#124190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124190)
  [`9ab9c4ca2b9df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9ab9c4ca2b9df) -
  Clean-up platform.editor.refactor-highlight-toolbar_mo0pj feature flag
- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.17.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

### Patch Changes

- Updated dependencies

## 1.16.0

### Minor Changes

- [#123058](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123058)
  [`2f8d14c320506`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f8d14c320506) -
  ED-24314 Adds new analytics event that fires editors inline comment selection dialog comment
  button appears

### Patch Changes

- Updated dependencies

## 1.15.2

### Patch Changes

- [#122243](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122243)
  [`b1d7c5ade9b3a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b1d7c5ade9b3a) -
  [ux] EDF-91 Removed platform.editor.enable-selection-toolbar_ucdwd feature flag and enabled
  bydefault.

## 1.15.1

### Patch Changes

- Updated dependencies

## 1.15.0

### Minor Changes

- [#119966](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119966)
  [`596ad24e38929`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/596ad24e38929) -
  Clean up typescript references to LegacyPortalProviderAPI

### Patch Changes

- Updated dependencies

## 1.14.3

### Patch Changes

- [#118402](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118402)
  [`efc9db93eefe8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/efc9db93eefe8) -
  Cleanup flag to fix comments on media draft bug

## 1.14.2

### Patch Changes

- [#113218](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113218)
  [`d1b428ec29d68`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d1b428ec29d68) -
  [ED-23765] migrate inline node commenting feature flags to statsig feature gate
- Updated dependencies

## 1.14.1

### Patch Changes

- Updated dependencies

## 1.14.0

### Minor Changes

- [#116062](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116062)
  [`2662cb99be36f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2662cb99be36f) -
  [ux] ED-23706 - change disabled comment action text

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
- Updated dependencies

## 1.13.1

### Patch Changes

- Updated dependencies

## 1.13.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

### Patch Changes

- Updated dependencies

## 1.12.1

### Patch Changes

- Updated dependencies

## 1.12.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 1.11.0

### Minor Changes

- [#112275](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112275)
  [`6f3058e0347a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6f3058e0347a3) -
  ED-23734 - add `getInlineNodeTypes` function to `InlineCommentViewComponentProps`

### Patch Changes

- Updated dependencies

## 1.10.4

### Patch Changes

- [#108237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108237)
  [`ea7dd8ebb249e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ea7dd8ebb249e) -
  Split out side-effects from viewmode plugin to seperate plugin to reduce cyclical dependency risk

  # WHAT

  - Remove `createFilterStepsPlugin` from the editorViewMode Plugin and is implemented in
    editorViewModeEffects instead.
  - Remove `appendTransaction` from the editorViewMode plugin and add as a new PMPlugin in
    editorViewModeEffects
  - `applyViewModeStepAt` is moved to editorViewModeEffects. This is currently only used in
    Annotation plugin which now consumes the new plugin instead and has a minor bump.

  # WHY

  ViewMode information is needed for upstream work in the CollabEdit plugin (see ED-23466).
  Currently the viewMode plugin already depends on CollabEdit and as such implementing new work
  causes a cylical dependency problem. ViewMode is likely to be required in an increasing number of
  plugins and ideally should be as pure as possible with no dependencies. A larger rethink of how
  these plugins fit together may be required but that is outside the scope of this change.

  # HOW

  All incompatibilities should be addressed within this changeset, however for the sake of
  completeness:

  - `editor-plugin-editor-viewmode-effects` must be added to any preset that relies on the viewmode
    filter steps plugin for viewmode annotations. Currently this seems to only be the confluence
    editor itself.
  - `applyViewModeStepAt` should now be called from the `editorViewModeEffects` plugin. This will
    need to be added to your plugin types independently (all uses covered by this change)

- Updated dependencies

## 1.10.3

### Patch Changes

- [#110714](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110714)
  [`9e5e71458aec6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9e5e71458aec6) -
  [ED-23281] Explictly opt out scrollIntoView when adding annotation mark as it is handled by
  scrolling comment sidebar into view instead
- Updated dependencies

## 1.10.2

### Patch Changes

- [#111460](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111460)
  [`c7cfc31d4a7b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c7cfc31d4a7b6) -
  ED-23707 fix issue where comment ui was not triggered on commented node selections.
- [#110966](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110966)
  [`31348c335b4b3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/31348c335b4b3) -
  ED-23690 - add inlineNodeTypes property to AnnotationComponentProps
- Updated dependencies

## 1.10.1

### Patch Changes

- [#109969](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109969)
  [`52590a0b562ef`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52590a0b562ef) -
  ED-23690 Adds an attribute to annotation analytic events with the name of nodes inside the
  annotation range
- [#109932](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109932)
  [`a973fd903870a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a973fd903870a) -
  ED-23649 fixes a variety of issues such as inline nodes not being fully interactive, and missing
  selection visuals when inside an annotation.
- Updated dependencies

## 1.10.0

### Minor Changes

- [#108623](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108623)
  [`c01339668ebde`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c01339668ebde) -
  [ux] ED-23617 Add support in editor for comments on status, emoji, date and mention nodes

### Patch Changes

- Updated dependencies

## 1.9.5

### Patch Changes

- Updated dependencies

## 1.9.4

### Patch Changes

- [#103164](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103164)
  [`2ee6f9d11093`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2ee6f9d11093) -
  ED-22554 preserve draft comment when node updated

## 1.9.3

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.9.2

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 1.9.1

### Patch Changes

- [#97803](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97803)
  [`4c1023ffb3d8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4c1023ffb3d8) -
  [ED-23094] Ignore annotations on mediaInline node, including highlight styling,
  event(onMouseEnter, onClick) listeners, update active annotations when the node is selected or the
  cursor is right after the node

## 1.9.0

### Minor Changes

- [#100662](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100662)
  [`3d61cd8f2afe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d61cd8f2afe) -
  [ED-23355] Update annotation viewed event to with attributes nodeType and method to capture usage
  for comments on media

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 1.7.4

### Patch Changes

- Updated dependencies

## 1.7.3

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 1.7.2

### Patch Changes

- [#98086](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98086)
  [`c0151fc09063`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c0151fc09063) -
  [ux] Disabled the scroll into view effect which occurs when an annotation is resolved, due to an
  issue which occurs when a collab user resolves a comment. There's currently (due to how
  annotations are built) no way to detect if the resolve action can from a remote or local user. So
  this is a quick fix to unblock live pages from scrolling when a collab users resolves a comment.
- Updated dependencies

## 1.7.1

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.7.0

### Minor Changes

- [#95168](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95168)
  [`2091e194a817`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2091e194a817) -
  Introduced new PortalProviderAPI behind a FF

### Patch Changes

- Updated dependencies

## 1.6.3

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 1.6.2

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1

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

## 1.5.11

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options

## 1.5.10

### Patch Changes

- [#91909](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91909)
  [`188a4ee3607f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/188a4ee3607f) -
  Add decoration to annotation marks for block elements to help confluence edit mode identify
  comments

## 1.5.9

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 1.5.8

### Patch Changes

- [#88763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88763)
  [`9fcd30347b0c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9fcd30347b0c) -
  [ux] Removed annotation styling for media in editor and renderer
- Updated dependencies

## 1.5.7

### Patch Changes

- [#87596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87596)
  [`e0b95c3a4fba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e0b95c3a4fba) -
  Add new UI badge for media node to trigger comments

## 1.5.6

### Patch Changes

- [#87089](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87089)
  [`5d130cbb8277`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d130cbb8277) -
  Change statsig gates to LD FFs

## 1.5.5

### Patch Changes

- [#87191](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87191)
  [`f24bc58a479e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f24bc58a479e) -
  Exporting getAllAnnotations function to be used outside the package

## 1.5.4

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 1.5.3

### Patch Changes

- [#84432](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/84432)
  [`19324d1894bb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19324d1894bb) -
  [ED-22643] Update showInlineCommentForBlockNode so that it can dispatch action to show comment
  view component when there are no active comments associated with the give node

## 1.5.2

### Patch Changes

- [#84685](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/84685)
  [`8884904b3f36`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8884904b3f36) -
  fix insert annotation analytics to include selectionType and nodeLocation

## 1.5.1

### Patch Changes

- [#83942](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83942)
  [`210a84148721`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/210a84148721) -
  [ED-22547] Publish draft comment for media node when saving

## 1.5.0

### Minor Changes

- [#82581](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82581)
  [`c1be75ae15b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1be75ae15b6) -
  ED-22606 add toggle inline comment action

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

## 1.4.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.4.0

### Minor Changes

- [#81394](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81394)
  [`2798f5546fb7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2798f5546fb7) -
  [ux] ED-22118 implemented annotation style for block node (media)

## 1.3.2

### Patch Changes

- [#79543](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79543)
  [`8b578f7427a2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b578f7427a2) -
  ED-22502: updated range selection check to exempt inline card, to allow them to have annotation
  marks
- [#80883](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80883)
  [`5ecfa883d4ba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ecfa883d4ba) -
  React 18 types for alignment, annotation, avatar-group and blocktype plugins.

## 1.3.1

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0

## 1.3.0

### Minor Changes

- [#80123](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80123)
  [`8bb18b4d686c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8bb18b4d686c) -
  [ux] - Add decoration to media node when there is active draft comment associated, update plugin
  state mapping so that create view component is removed when there's node changes invalidating the
  decoration

  - Save featureFlags plugin state as one of the annotation plugin state

## 1.2.2

### Patch Changes

- [#79658](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79658)
  [`4b195011d7c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4b195011d7c1) -
  ED-22112 support remove annotation from supported nodes

## 1.2.1

### Patch Changes

- [#78577](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78577)
  [`207fbd3685dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/207fbd3685dc) -
  ED-22111 add supported nodes option to annotation plugin

## 1.2.0

### Minor Changes

- [#78508](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78508)
  [`1d2b9d7a0542`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1d2b9d7a0542) -
  Expose setInlineCommentDraftState as one of the annotation plugin actions, extend the action with
  the ability to apply comment highlight to node, and add optional plugin dependency,
  FeatureFlagsPlugin

## 1.1.0

### Minor Changes

- [#78363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78363)
  [`3a8e207fbf7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3a8e207fbf7c) -
  EDF-27 Cleaned up platform.editor.annotation.decouple-inline-comment-closed_flmox FF. This
  decouples selected annotation logic from logic to close the inline comment view by default. This
  fixed a bug where the inline comment view can be unexpectedly opened from doc changes (through
  remote editors or non-selection altering changes such as expanding / collapsing expand blocks)

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

## 0.3.5

### Patch Changes

- [#69825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69825)
  [`e2363da4f6a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e2363da4f6a1) -
  [No Issue] Replace View Mode API for annotations
- [#69825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69825)
  [`e2363da4f6a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e2363da4f6a1) -
  [No Issue] Replace View Mode API for annotations
- [#69825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69825)
  [`e2363da4f6a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e2363da4f6a1) -
  [No Issue] Replace View Mode API for annotations

## 0.3.4

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.3.3

### Patch Changes

- [#65713](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65713)
  [`7a7d83f8e361`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7a7d83f8e361) -
  Analytics for create inline comment button in highlight actions menu

## 0.3.2

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 0.3.1

### Patch Changes

- [#70084](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70084)
  [`4d651eb93ab5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4d651eb93ab5) -
  Add editor-plugin-annotation pr and create shared utils for it in editor-test-helpers
- Updated dependencies

## 0.3.0

### Minor Changes

- [#69617](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69617)
  [`93f297b73c6f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93f297b73c6f) -
  [ux] When in editor view mode, creating new comment with annotations plugin will send step to NCS
  provider

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

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802)
  [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) -
  Ensure all editor plugins are marked as singletons

## 0.1.1

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies
