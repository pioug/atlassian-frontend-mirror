# @atlaskit/editor-plugin-block-type

## 5.1.5

### Patch Changes

- [#126339](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126339)
  [`d41ba7595dcd2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d41ba7595dcd2) -
  [ux] Updates the look of Text Formatting Contextual toolbar dropdowns.

## 5.1.4

### Patch Changes

- Updated dependencies

## 5.1.3

### Patch Changes

- Updated dependencies

## 5.1.2

### Patch Changes

- Updated dependencies

## 5.1.1

### Patch Changes

- Updated dependencies

## 5.1.0

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

- [#120007](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120007)
  [`e87df0a8c73c6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e87df0a8c73c6) -
  [ux] Do not add headings, lists, layouts, panels in the new QuickInsert menu
- Updated dependencies

## 5.0.2

### Patch Changes

- [#120931](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120931)
  [`624b97c021fea`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/624b97c021fea) -
  [ux] ED-26676 revert to existing primary toolbar components

## 5.0.1

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 5.0.0

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

## 4.5.0

### Minor Changes

- [#116949](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116949)
  [`9154f7b89e3d2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9154f7b89e3d2) -
  [ux] ED-26674 Hiding contextual toolbar menu items when the menu is docked to top

### Patch Changes

- Updated dependencies

## 4.4.0

### Minor Changes

- [#116013](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116013)
  [`18e022766bfd3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/18e022766bfd3) -
  [ux] ED-26464 Hiding primary toolbar and docking contextual toolbar items to top

### Patch Changes

- Updated dependencies

## 4.3.2

### Patch Changes

- Updated dependencies

## 4.3.1

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 4.3.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 4.2.3

### Patch Changes

- Updated dependencies

## 4.2.2

### Patch Changes

- [#107782](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107782)
  [`bc422d0adbbb5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc422d0adbbb5) -
  [ux] ED-26378 remove editor_nest_media_and_codeblock_in_quotes_jira
- [#107782](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107782)
  [`cccc7a8347929`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cccc7a8347929) -
  [ux] ED-26378 Remove editor_nest_media_and_codeblock_in_quotes_jira and
  nestMediaAndCodeblockInQuote
- Updated dependencies

## 4.2.1

### Patch Changes

- Updated dependencies

## 4.2.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 4.1.6

### Patch Changes

- [#107473](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107473)
  [`962b3297548df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962b3297548df) -
  [ux] Implement variation 2 for editor contextual toolbar formatting experiment

## 4.1.5

### Patch Changes

- [#107139](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107139)
  [`3721ee9d53429`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3721ee9d53429) -
  [ux] ED-26378 Editor Implementation - Clean up previous project FF in blockQuote

## 4.1.4

### Patch Changes

- [#105009](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105009)
  [`a4039ebf7ed11`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a4039ebf7ed11) -
  [ux] Implement variant 2 cohorts experience for platform_editor_contextual_formatting_toolbar_v2
  experiment
- Updated dependencies

## 4.1.3

### Patch Changes

- Updated dependencies

## 4.1.2

### Patch Changes

- [#99274](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99274)
  [`b4dd134e0caaa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b4dd134e0caaa) -
  ED-25961 Add analytics for clear formatting and adding blockquote from text styles menu

## 4.1.1

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [#96424](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96424)
  [`e14834ad65277`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e14834ad65277) -
  [ux] Add clear formatting option to text styling menu

## 4.0.14

### Patch Changes

- [#99053](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99053)
  [`a850374dfb10a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a850374dfb10a) -
  [ux] ED-26049 Disable text styles menu button if lists are nested inside blockquot

## 4.0.13

### Patch Changes

- Updated dependencies

## 4.0.12

### Patch Changes

- [#180067](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180067)
  [`fdee6c449ca83`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fdee6c449ca83) -
  [ux] Adding block quote as an option to the text formatting menu for full page editors
- Updated dependencies

## 4.0.11

### Patch Changes

- [#176596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176596)
  [`86e9b63cc47f0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/86e9b63cc47f0) -
  Remove internal re-exports
- Updated dependencies

## 4.0.10

### Patch Changes

- [#176005](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176005)
  [`d4348ed45eed7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d4348ed45eed7) -
  [ux] When text selection is inside media caption or decision nodes, Main and Floating toolbars
  should have Lists and Text styles options disabled.

## 4.0.9

### Patch Changes

- [#172933](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/172933)
  [`8323af2381d00`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8323af2381d00) -
  [ux] Arranges items in the Selection toolbar under the Contextual toolbar experiment flag
- Updated dependencies

## 4.0.8

### Patch Changes

- Updated dependencies

## 4.0.7

### Patch Changes

- Updated dependencies

## 4.0.6

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0
- Updated dependencies

## 4.0.5

### Patch Changes

- Updated dependencies

## 4.0.4

### Patch Changes

- [#165097](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165097)
  [`0bca145c96b65`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0bca145c96b65) -
  [ux] Adds test styles options to the Selection toolbar under Contextual toolbar experiment
- Updated dependencies

## 4.0.3

### Patch Changes

- [#159777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159777)
  [`e708d0a9e4b36`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e708d0a9e4b36) -
  Refactoring plugins to meet folder standards.
- Updated dependencies

## 4.0.2

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

### Major Changes

- [#156509](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156509)
  [`c58ae26b37318`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c58ae26b37318) -
  Fix versions for tmp-editor-statsig (major used to force dependers to release new versions)

## 3.16.5

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18
- Updated dependencies

## 3.16.4

### Patch Changes

- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1
- Updated dependencies

## 3.16.3

### Patch Changes

- Updated dependencies

## 3.16.2

### Patch Changes

- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1
- Updated dependencies

## 3.16.1

### Patch Changes

- [#152019](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152019)
  [`5f7f23dd0c612`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5f7f23dd0c612) -
  [ux] ED-25082: Added editor custom font tokens and use them for normal texts and paragraph texts"
- Updated dependencies

## 3.16.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 3.15.9

### Patch Changes

- [#150384](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150384)
  [`6d48c5b6ce65e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d48c5b6ce65e) -
  [ED-25083] Typograpghy migration

## 3.15.8

### Patch Changes

- Updated dependencies

## 3.15.7

### Patch Changes

- Updated dependencies

## 3.15.6

### Patch Changes

- [#147080](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147080)
  [`3c9bbcfd3436f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c9bbcfd3436f) -
  [ux] [ED-24900] This change fixes a bug when deleting media groups from empty panels and
  blockquotes with Backspace.

## 3.15.5

### Patch Changes

- [#146455](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146455)
  [`b692485729f1c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b692485729f1c) -
  improve comment editor toolbar responsiveness
- Updated dependencies

## 3.15.4

### Patch Changes

- [#145991](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145991)
  [`07586b8ad11ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/07586b8ad11ec) -
  [ux] [ED-24900] This change handles deleting nested media groups inside blockquotes via the
  backspace key.

## 3.15.3

### Patch Changes

- Updated dependencies

## 3.15.2

### Patch Changes

- Updated dependencies

## 3.15.1

### Patch Changes

- Updated dependencies

## 3.15.0

### Minor Changes

- [#142806](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142806)
  [`f73667130fb7d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f73667130fb7d) -
  [ux] Update styles for nested dnd to only apply to full page editor. Removed
  blockquoteSharedStylesNew export.

### Patch Changes

- Updated dependencies

## 3.14.9

### Patch Changes

- [#141778](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141778)
  [`1c6f578277694`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c6f578277694) -
  ED-24870 & ED-24864 - Add the logic to gate the nested media in quotes functionality behind the
  nest-media-and-codeblock-in-quote experiment. Also adjust the logic so the nested expands are now
  behind the nested-expand-in-expand experiment.

## 3.14.8

### Patch Changes

- [#140915](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140915)
  [`eaccad51157d6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eaccad51157d6) -
  [ux] Migrate new icons including color, highlight and task on Editor primary toolbar
- [#141594](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141594)
  [`3f6b2eb7bd493`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f6b2eb7bd493) -
  [ux] [ED-24867] This change moves nesting codeblocks and media in blockquotes via insertion
  methods behind an experiment gate.

## 3.14.7

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 3.14.6

### Patch Changes

- [#139784](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139784)
  [`47d08e6f06b2e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/47d08e6f06b2e) -
  [ux] [ED-24861] Toggle between ProseMirror node based on feature gate instead of existing
  experiment for node nesting media and codeblocks in blockquotes.

## 3.14.5

### Patch Changes

- Updated dependencies

## 3.14.4

### Patch Changes

- [#136367](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136367)
  [`4d9450a7e1283`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4d9450a7e1283) -
  [ux] Update new icons (text color, highlight, text style) with design change
- [#136348](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136348)
  [`fb4fb56f1da7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fb4fb56f1da7c) -
  Use optimised entry-points on editor-common for browser.
- Updated dependencies

## 3.14.3

### Patch Changes

- [#136078](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136078)
  [`09414d7233497`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/09414d7233497) -
  ED-24507 Switch nested dnd FG to experiment and include padding changes"

## 3.14.2

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 3.14.1

### Patch Changes

- [#133711](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133711)
  [`41612f682764d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/41612f682764d) -
  [ED-24400] Added feature gate and experiment for nesting media & codeblock in quotes
- Updated dependencies

## 3.14.0

### Minor Changes

- [#133191](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133191)
  [`78a1927084934`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/78a1927084934) -
  [ux] Remove icon migration feature gate and migrate new icons on primary toolbar

### Patch Changes

- Updated dependencies

## 3.13.1

### Patch Changes

- Updated dependencies

## 3.13.0

### Minor Changes

- [#130825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130825)
  [`d8a00de5637ff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d8a00de5637ff) -
  ENGHEALTH-9890: Bumps React peer dependency for Lego editor plugins

## 3.12.2

### Patch Changes

- [#130260](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130260)
  [`d338ce6e4ff6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d338ce6e4ff6e) -
  Use blockquoteSharedStylesNew when feature gate for increase padding is enabled
- Updated dependencies

## 3.12.1

### Patch Changes

- Updated dependencies

## 3.12.0

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

## 3.11.0

### Minor Changes

- [#126478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126478)
  [`ca1665ebbfe4d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ca1665ebbfe4d) -
  [ED-23435] Store primary toolbar component registry in a plugin variable instead of in plugin
  state to avoid having to add effects to all plugins and enable SSR for the toolbar. [Breaking
  change] Converted registerComponent from the primary toolbar plugin into an action.

### Patch Changes

- Updated dependencies

## 3.10.2

### Patch Changes

- [#125353](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125353)
  [`77847728bf617`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77847728bf617) -
  Migrate icons in Editor primary toolbar
- Updated dependencies

## 3.10.1

### Patch Changes

- [#124134](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124134)
  [`60d66d9621cca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/60d66d9621cca) -
  Removed FF platform.editor.allow-list-in-blockquote
- Updated dependencies

## 3.10.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 3.9.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

### Patch Changes

- Updated dependencies

## 3.8.5

### Patch Changes

- Updated dependencies

## 3.8.4

### Patch Changes

- Updated dependencies

## 3.8.3

### Patch Changes

- Updated dependencies

## 3.8.2

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
- Updated dependencies

## 3.8.1

### Patch Changes

- Updated dependencies

## 3.8.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

### Patch Changes

- Updated dependencies

## 3.7.1

### Patch Changes

- Updated dependencies

## 3.7.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 3.6.1

### Patch Changes

- [#111357](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111357)
  [`cf6122614ec5f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cf6122614ec5f) -
  [ux] Adjusted the shortcut displayed for block quote on quick insert dropdown.

## 3.6.0

### Minor Changes

- [#110262](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110262)
  [`5a9ede4b76193`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5a9ede4b76193) -
  Added paragraph and heading NodeSpecs flag back

### Patch Changes

- Updated dependencies

## 3.5.0

### Minor Changes

- [#105253](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105253)
  [`a5f3cd26fbd6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a5f3cd26fbd6) -
  Clean up platform.editor.enable-localid-for-paragraph-in-stage-0_cby7g FF

### Patch Changes

- [#104809](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104809)
  [`955319e2b6b1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/955319e2b6b1) -
  [ux] [ECA11Y-50] Changed color contrast for the Text styles shortcuts in the Dropdown menu
- [#108295](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108295)
  [`c28cd3716fc2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c28cd3716fc2) -
  NO-ISSUE Avoid rendering double separators when positioned in a quote
- Updated dependencies

## 3.4.0

### Minor Changes

- [#101406](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101406)
  [`6daffd65aec4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6daffd65aec4) -
  [ED-23298] Extract primary toolbar components to editor plugin to allow for custom ordering

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 3.3.0

### Minor Changes

- [#102243](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102243)
  [`cfc95dac3d82`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cfc95dac3d82) -
  Use new paragraph and heading NodeSpecs

## 3.2.2

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 3.2.1

### Patch Changes

- [#95938](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95938)
  [`f1309fe9e31b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f1309fe9e31b) -
  ECA11Y-224: Missing list markup for 'Text styles' dropdown in the main toolbar

## 3.2.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 3.1.9

### Patch Changes

- Updated dependencies

## 3.1.8

### Patch Changes

- [#99242](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99242)
  [`854acdf04f29`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/854acdf04f29) -
  Adjust tooltip text for editor toolbar buttons
- Updated dependencies

## 3.1.7

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 3.1.6

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 3.1.5

### Patch Changes

- [#93784](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93784)
  [`de2e52677025`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de2e52677025) -
  ECA11Y-217 Improve editor toolbar screen reader text for text styles and color
- Updated dependencies

## 3.1.4

### Patch Changes

- Updated dependencies

## 3.1.3

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 3.1.2

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1

## 3.1.1

### Patch Changes

- [#93689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93689)
  [`5ba5d2b4a9ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ba5d2b4a9ac) -
  Updating adf-schema version to 35.10.0

## 3.1.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 3.0.35

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options

## 3.0.34

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 3.0.33

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 3.0.32

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

## 3.0.31

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 3.0.30

### Patch Changes

- [#80883](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80883)
  [`5ecfa883d4ba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ecfa883d4ba) -
  React 18 types for alignment, annotation, avatar-group and blocktype plugins.

## 3.0.29

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0

## 3.0.28

### Patch Changes

- [#80518](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80518)
  [`e0d5e8fd9495`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e0d5e8fd9495) -
  Migrates some style calls to a slightly different object syntax and other minor cleanup around
  eslint rules.

## 3.0.27

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

## 3.0.26

### Patch Changes

- [#76093](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76093)
  [`fc113e0c416f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fc113e0c416f) -
  ED-22243 handling of backspace for mediaGroup node nested in panel
- Updated dependencies

## 3.0.25

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

## 3.0.24

### Patch Changes

- Updated dependencies

## 3.0.23

### Patch Changes

- Updated dependencies

## 3.0.22

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 3.0.21

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 3.0.20

### Patch Changes

- [#68217](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68217)
  [`bfd8d2ded4aa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bfd8d2ded4aa) -
  [ux] correctly delete the decision list inside panel having only one decision item.

## 3.0.19

### Patch Changes

- Updated dependencies

## 3.0.18

### Patch Changes

- [#67857](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67857)
  [`9f1035441959`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f1035441959) -
  [ED-21835] Change EditorAPI type to always union with undefined
- Updated dependencies

## 3.0.17

### Patch Changes

- [#67557](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67557)
  [`124d0c6d5286`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/124d0c6d5286) -
  Migrating block-type, text-color, and text-formatting to use useSharedPluginState rather than
  WithPluginState. Removing unused option on default preset. Adding formattingIsPresent prop to
  TextFormattingState.
- Updated dependencies

## 3.0.16

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 3.0.15

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802)
  [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) -
  Ensure all editor plugins are marked as singletons

## 3.0.14

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 3.0.13

### Patch Changes

- [#61923](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61923)
  [`04e38cfe9e90`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/04e38cfe9e90) -
  Remove legacy theming logic from all Editor plugin packages. Theming is still available via the
  @atlaskit/tokens package.

## 3.0.12

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 3.0.11

### Patch Changes

- [#60534](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60534)
  [`191a38f1ea23`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/191a38f1ea23) -
  ED-20966 Use blockQuoteWithList PMNode when 'allow-list-in-blockquote' FF is enabled
- Updated dependencies

## 3.0.10

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808)
  [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) -
  ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 3.0.9

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246)
  [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) -
  ED-21371 Update adf-schema to 35.1.0

## 3.0.8

### Patch Changes

- Updated dependencies

## 3.0.7

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 3.0.6

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763)
  [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) -
  update ADF schema

## 3.0.5

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790)
  [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) -
  ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 3.0.4

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417)
  [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971
  Upgrade adf-schema package to ^34.0.0

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379)
  [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763
  Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#42090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42090)
  [`dfea93d39c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfea93d39c9) -
  Replacing setBlockType action on `editor-plugin-block-type` with setTextLevel command.

  WHAT/WHY?: setBlockType is only for headings/text so the naming is not clear, it is also an action
  which makes it difficult to use by external consumers.

  This replacement can be easily used by external consumers (ie. for custom toolbars) and also has
  more type safety (for setBlockType the name parameter is any string but setTextLevel only accepts
  valid values including "normal", "heading1", "heading2" etc.)

  HOW?: This API at this stage should be unused by consumers to the best of our knowledge. However
  if you are using it you should change as so:

  Before:

  ```ts
  api?.blockType.actions.setBlockType(blockType, inputMethod)(state, dispatch);
  ```

  ```ts
  api?.core.actions.execute(api?.blockType.commands.setTextLevel(blockType, inputMethod));
  ```

## 2.0.0

### Major Changes

- [#40850](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40850)
  [`e7cead0f099`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7cead0f099) - Move
  shared messages to editor-common

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749)
  [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect
  yarn changeset to packages, upgrade adf-schema

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies
