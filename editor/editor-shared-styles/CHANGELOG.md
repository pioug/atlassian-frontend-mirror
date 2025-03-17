# @atlaskit/editor-shared-styles

## 3.4.2

### Patch Changes

- Updated dependencies

## 3.4.1

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 3.4.0

### Minor Changes

- [#117777](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/117777)
  [`6d31e7761757c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d31e7761757c) -
  [ux] ED-26722 Update header area spacing to avoid layout shift when hiding top toolbar

## 3.3.1

### Patch Changes

- Updated dependencies

## 3.3.0

### Minor Changes

- [#114486](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114486)
  [`bd89d7bfae0c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bd89d7bfae0c1) -
  @atlaskit/editor-shared-styles adds an export `akEditorSelectedBoldBoxShadow` recently, which
  should be minor change and causes trouble for Jira and Atlas/townsquare when bumping editor-core.
  This PR triggers a minor bump for @atlaskit/editor-shared-styles

## 3.2.4

### Patch Changes

- Updated dependencies

## 3.2.3

### Patch Changes

- Updated dependencies

## 3.2.2

### Patch Changes

- [#181108](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/181108)
  [`53b2e808822aa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53b2e808822aa) -
  ED-26039 Update status lozenge styles with white bortder and greater boxshadow

## 3.2.1

### Patch Changes

- [#163855](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163855)
  [`893dd8380fd30`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/893dd8380fd30) -
  [ux] Cleaned up FF platform.confluence.frontend.narrow-full-page-editor-toolbar

## 3.2.0

### Minor Changes

- [#159546](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159546)
  [`e2dc2f10636c6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e2dc2f10636c6) -
  [ux] Layout responsiveness in renderer

## 3.1.2

### Patch Changes

- [#156102](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156102)
  [`05bfe209f2801`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/05bfe209f2801) -
  Replace platform.editor.core.increase-full-page-guttering with new FG

## 3.1.1

### Patch Changes

- [#156360](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156360)
  [`482dbb03dbf68`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/482dbb03dbf68) -
  Add akEditorWrappedNodeZIndex constant

## 3.1.0

### Minor Changes

- [#155573](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155573)
  [`92ca0dc09c6ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/92ca0dc09c6ac) -
  Create new participantColors constant to be used in future updates to avatar badges and
  telepointers

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#145684](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145684)
  [`8faa0ce1c97d3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8faa0ce1c97d3) -
  [ux] Removed unused consts and updated colours to use tokens instead of the theme package

## 2.13.5

### Patch Changes

- [#143733](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143733)
  [`db2f2648fd208`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db2f2648fd208) -
  [ux] Removing token fallbacks for styling. For apps supporting tokens this has no difference, for
  those not there may be slight variations in colors to align with tokens.

## 2.13.4

### Patch Changes

- [#137474](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137474)
  [`7ca1c34ebf2d5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7ca1c34ebf2d5) -
  make breakout to use css to fix SSR issue on live edit page

## 2.13.3

### Patch Changes

- [#131374](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131374)
  [`9ef24a0e887b2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9ef24a0e887b2) -
  Fix type definitions for `any` type in editor-core.

## 2.13.2

### Patch Changes

- Updated dependencies

## 2.13.1

### Patch Changes

- [#121871](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121871)
  [`3d286b2a5bdcb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d286b2a5bdcb) -
  ED-24090 increase guideline z index

## 2.13.0

### Minor Changes

- [#118748](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118748)
  [`10bb9e2def098`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10bb9e2def098) -
  [ux] Reduce media single max width padding for all editors except full page

## 2.12.1

### Patch Changes

- Updated dependencies

## 2.12.0

### Minor Changes

- [#106586](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106586)
  [`82b425248ffe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/82b425248ffe) -
  Make akEditorGutterPadding a function so it can read
  platform.editor.core.increase-full-page-guttering ff to change values

## 2.11.0

### Minor Changes

- [#98803](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98803)
  [`b9d6c4c4f418`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9d6c4c4f418) -
  Added new FULL_PAGE_EDITOR_TOOLBAR_HEIGHT constant to editor-shared-styles.

## 2.10.0

### Minor Changes

- [#86433](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86433)
  [`88ca3b199a49`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/88ca3b199a49) -
  [ux] EDF-412 Collaborators avatars and telepointer colors are tokenised.

## 2.9.3

### Patch Changes

- [#88247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88247)
  [`634a42ea0ca8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/634a42ea0ca8) -
  [ux] Fix webkit scrollbar style so header image can be full width

## 2.9.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.9.1

### Patch Changes

- [#73177](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73177)
  [`22452599ed8f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/22452599ed8f) -
  Move styling for certain packages to tokens.

## 2.9.0

### Minor Changes

- [#64679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64679)
  [`0d0b1219b1b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0d0b1219b1b9) -
  Fix insert column button and line above toolbar popups

## 2.8.3

### Patch Changes

- [#63606](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63606)
  [`196f99e732d6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/196f99e732d6) -
  [ux] Add support for drag handle for sticky header in table

## 2.8.2

### Patch Changes

- [#59829](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59829)
  [`3120b36a9f2c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3120b36a9f2c) -
  Converted spacing values to the corresponding space tokens

## 2.8.1

### Patch Changes

- [#41274](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41274)
  [`17ba12fb12b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17ba12fb12b) - fix
  unnecessarily high z-index so that the vertical scrollbar in Safari does not overlay other layer
  components with z-index below 9999

## 2.8.0

### Minor Changes

- [#39366](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39366)
  [`3aaff60be08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3aaff60be08) - ED-18988
  Adds classnames and constants for table sticky scrollbar

## 2.7.0

### Minor Changes

- [#40236](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40236)
  [`0b1f816e4fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b1f816e4fa) - [ux]
  Added akEditorTableHeaderCellBackground to store fallback.

## 2.6.1

### Patch Changes

- [#39154](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39154)
  [`113fcc02759`](https://bitbucket.org/atlassian/atlassian-frontend/commits/113fcc02759) - ED-19433
  Extract Emoji Plugin to its own package

## 2.6.0

### Minor Changes

- [#38223](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38223)
  [`79dc812733f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79dc812733f) -
  [ED-19293] Exposes a new constant value for table guidelines to align with nodes that are using
  wide layout

## 2.5.0

### Minor Changes

- [#37456](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37456)
  [`638784fa9d5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/638784fa9d5) - force
  dependency bump
- [#37270](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37270)
  [`df488d9b806`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df488d9b806) - [ux]
  Adds a new constant with a zIndex that is used for table sticky header and table cells that are in
  the sticky header

## 2.4.4

### Patch Changes

- [#36845](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36845)
  [`e64541c6fda`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e64541c6fda) - [ux]
  [ED-18759] Updated table border, handlebar controls, blanket, icon, icon background and table cell
  options button colour tokens on light and dark theme for table selection and table deletion.
  Borders for Table Floating Contextual Button & Floating toolbar color palette button on dark &
  light theme are also updated.

## 2.4.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 2.4.2

### Patch Changes

- [#33771](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33771)
  [`9369cc38a68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9369cc38a68) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 2.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 2.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 2.3.2

### Patch Changes

- [#27634](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27634)
  [`0d93211414e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d93211414e) - Updates
  usage of removed design token `utilities.UNSAFE_util.transparent` in favour of its replacement
  `utilities.UNSAFE.transparent`.
- Updated dependencies

## 2.3.1

### Patch Changes

- [#28324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28324)
  [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving performance.

## 2.3.0

### Minor Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`4fbaeb2a1fd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4fbaeb2a1fd) - DSP-4118
  Updated tokens used to render overflow shadows in code blocks.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  beta). These changes are intended to be interoperable with the legacy theme implementation. Legacy
  dark mode users should expect no visual or breaking changes.

  `overflowShadow` now optionally supports customizing the size of the "covers" that appear over
  shadows when at the edge of content, via `leftCoverWidth` and `rightCoverWidth`, and the shadow
  width via the `width` prop.

## 2.2.5

### Patch Changes

- Updated dependencies

## 2.2.4

### Patch Changes

- Updated dependencies

## 2.2.3

### Patch Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`977ac74443c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/977ac74443c) -
  DSP-7235: Fixes issue with overflow shadows on code blocks due to layered transparent colors.

## 2.2.2

### Patch Changes

- Updated dependencies

## 2.2.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 2.2.0

### Minor Changes

- [#24607](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24607)
  [`73d9a2fa116`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73d9a2fa116) - ED-15568
  Restore table's FloatingContextualMenu, extract utils/UI components

## 2.1.5

### Patch Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`a6df7e823d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a6df7e823d8) - [ux]
  Fixed trello card overflow issue in table cells & fixed merged table cells selection / hover state
- Updated dependencies

## 2.1.4

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 2.1.3

### Patch Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`450a17a332a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/450a17a332a) - [ux]
  ED-14654: Lower z-index values on editor elements so they do not stick out of the editor and
  interfere with consuming products
- [`30c74c32783`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30c74c32783) - [ux]
  ED-15234: reverts ED-14654 because causing header zindex issues

## 2.1.2

### Patch Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`17480b66f3e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17480b66f3e) -
  [ux][ed-9943] Fix to have the TypeAhead component appear above the main editor toolbar.
- [`d8b3bc73330`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8b3bc73330) -
  [ED-14507] Deprecate the allowDynamicTextSizing editor prop and remove all code related to it.
  This feature has been unused since 2020.

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#20721](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20721)
  [`02bfb564e45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02bfb564e45) - [ux]
  Instrumented `@atlaskit/editor-shared-styles` and partial `@atlaskit/editor-core` with the new
  theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

- [`5ab00fca118`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ab00fca118) -
  Instrumented `@atlaskit/editor-shared-styles` with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

## 2.0.1

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 2.0.0

### Major Changes

- [#19019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19019)
  [`e22509504e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e22509504e8) - ED-14255
  migrate editor-shared-style to emotion

### Patch Changes

- [`9712e78abb0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9712e78abb0) - ED-14255
  moved some usages of editor-shared-styles to emotion

## 1.6.0

### Minor Changes

- [#14319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14319)
  [`1a07c1caf61`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a07c1caf61) -
  CETI-93 - Fixed custom panel icon sizing and alignment when icon render as image

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#10316](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10316)
  [`c2c0160f566`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2c0160f566) - Bump
  editor-shared-styles to pick up relativeFontSizeToBase16

## 1.4.1

### Patch Changes

- [#9756](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9756)
  [`5c835144ef0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c835144ef0) -
  [ME-741][me-743] Remove PX references in editor packages and modify code block font size.
- Updated dependencies

## 1.4.0

### Minor Changes

- [#9281](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9281)
  [`e2fb7440936`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2fb7440936) -
  ED-12430: Fix issue with Editor showing double scrollbar when context panel is visible.Update
  context panel to have same height as editor content area when using position absolute styles

## 1.3.0

### Minor Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`511a91ad376`](https://bitbucket.org/atlassian/atlassian-frontend/commits/511a91ad376) - [ux]
  ED-12128: Update Context Panel to use set width of 320px and remove 'width' prop. Remove 'width'
  prop from the Context Panel component as we no longer allow dynamic panel width to enforce
  consistency.

  All references to this component can safely remove the 'wdith' prop as it is no longer part of the
  component props.

- [`007103b93e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/007103b93e6) - [ux]
  ED-11993 Change behaviour of context panel so it will not push content if there is enough space to
  slide out without overlapping. Config panel will keep existing behaviour to push content if there
  isn't enough space to show without overlapping content. Also add width css transition to context
  panel content to mimic "slide in" animation.

  Add new shared const of `akEditorFullWidthLayoutLineLength` which indicates the line length of a
  full-width editor

## 1.2.1

### Patch Changes

- [#7762](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7762)
  [`7d24194b639`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d24194b639) -
  EDM-1717: Fix Safari danger styles for inline smart links

## 1.2.0

### Minor Changes

- [#7170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7170)
  [`0615a2be97`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0615a2be97) - ED-10441:
  share overflow-shadow helper

## 1.1.7

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 1.1.6

### Patch Changes

- [#6228](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6228)
  [`d6c23f1886`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6c23f1886) - Added dark
  mode support to table cell background colors

## 1.1.5

### Patch Changes

- [#5516](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5516)
  [`7895bfa4f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7895bfa4f3) - [ux]
  ED-10562 Update selection styles for unsupported content

  Use background colour instead of blanket styling Fix an issue on Safari where text inside
  unsupported content appeared selected when node was selected

## 1.1.4

### Patch Changes

- [#5762](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5762)
  [`34674fa4cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34674fa4cd) - [ux]
  ED-10780 removed the threshold that enabled responsive changes

## 1.1.3

### Patch Changes

- [#5720](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5720)
  [`a2634b5390`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2634b5390) - [ux]
  ED-10780 reduced the threshold for responcive toolbar oayout;fixed problem with italic button not
  working when it is in collapse menu.

## 1.1.2

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`fbc358206c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fbc358206c) - ED-9125
  ED-8837 Export values for selected border and selected box shadow, and util to disable browser
  text selection
- [`4f217f1d92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f217f1d92) - ED-10168
  Add new package @atlaskit/editor-shared-styles

### Patch Changes

- [`b9812b8b35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9812b8b35) - ED-10004
  improved editor toolbar responsiveness
