# @atlaskit/editor-plugin-card

## 11.2.2

### Patch Changes

- [`6b08c3a8cde08`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6b08c3a8cde08) -
  Construct confluence url from smart card embed preview href when smart card url is short
  confluence url, in the form "{host}/wiki/x/{hash}"
- Updated dependencies

## 11.2.1

### Patch Changes

- Updated dependencies

## 11.2.0

### Minor Changes

- [`3dfc071fcc15b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3dfc071fcc15b) -
  [ux] Repositions the preview panel button inside the floating toolbar so that it is next to the
  open in new tab button

## 11.1.1

### Patch Changes

- Updated dependencies

## 11.1.0

### Minor Changes

- [`1288c1bfb6ef4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1288c1bfb6ef4) -
  [https://product-fabric.atlassian.net/browse/ED-29443](ED-29443) - render SmartCard instead of
  CardSSR if no smart card SSR data available

### Patch Changes

- Updated dependencies

## 11.0.2

### Patch Changes

- [`76ffc91d514f3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/76ffc91d514f3) -
  Changed packages over to using the generic AIFC FG rather then an experiment
- Updated dependencies

## 11.0.1

### Patch Changes

- [`49444f7239178`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/49444f7239178) -
  Added analytics events to preview panel hover overlays and toolbar button
- Updated dependencies

## 11.0.0

### Patch Changes

- Updated dependencies

## 10.2.0

### Minor Changes

- [`687c1b8fa7801`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/687c1b8fa7801) -
  EDITOR-1566 bump adf-schema + update validator

### Patch Changes

- Updated dependencies

## 10.1.6

### Patch Changes

- [`bb4166f191a3f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bb4166f191a3f) -
  [ux] EDITOR-1520 - addToHistory false and not scrollIntoView for smart card to link tr
- Updated dependencies

## 10.1.5

### Patch Changes

- [`6b6eca9cee16d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6b6eca9cee16d) -
  Switch to use editorExperiment to use productKey for responsive preview panel changes.
- Updated dependencies

## 10.1.4

### Patch Changes

- Updated dependencies

## 10.1.3

### Patch Changes

- [`1c474ad18f3ac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1c474ad18f3ac) -
  [ED-28566] Clean up platform_editor_controls_patch_15
- Updated dependencies

## 10.1.2

### Patch Changes

- [`13e707b0d5324`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/13e707b0d5324) -
  Hydration fixes for card plugin ContentComponent
- Updated dependencies

## 10.1.1

### Patch Changes

- [`910ca893a9910`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/910ca893a9910) -
  ED-29307: experiment config clean up
- Updated dependencies

## 10.1.0

### Minor Changes

- [`b367661ba720e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b367661ba720e) -
  EDITOR-1562 bump adf-schema for afm

### Patch Changes

- Updated dependencies

## 10.0.0

### Patch Changes

- Updated dependencies

## 9.1.0

### Minor Changes

- [`64ec65231b4cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/64ec65231b4cf) -
  EDITOR-1568 bump adf-schema for afm

### Patch Changes

- Updated dependencies

## 9.0.1

### Patch Changes

- Updated dependencies

## 9.0.0

### Patch Changes

- [`0d0fe7a300841`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0d0fe7a300841) -
  Cleanup platform_editor_usesharedpluginstatewithselector experiment

  - BREAKING CHANGE: sharedPluginStateHookMigratorFactory is deleted from @atlaskit/editor-common

- Updated dependencies

## 8.1.0

### Minor Changes

- [`c0113eeccb2df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c0113eeccb2df) -
  [ux] ED-29120 add a new config option for default editor preset
  (`toolbar.enableNewToolbarExperience`) which allows the new toolbar to be disabled. This is needed
  for editors that can't be excluded at the experiment level.

### Patch Changes

- Updated dependencies

## 8.0.1

### Patch Changes

- [`e5001e144b74e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e5001e144b74e) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 8.0.0

### Patch Changes

- Updated dependencies

## 7.7.3

### Patch Changes

- [`05bf548de34be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/05bf548de34be) -
  PR to cleanup platform_editor_usesharedpluginstatewithselector for card
- Updated dependencies

## 7.7.2

### Patch Changes

- Updated dependencies

## 7.7.1

### Patch Changes

- [`bfec478c9e91b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bfec478c9e91b) -
  Splits platform_editor_preview_panel_linking_exp into one for Jira and one for Confluence and
  switches to editorExperiment util.
- Updated dependencies

## 7.7.0

### Minor Changes

- [`f1c44645de4a1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1c44645de4a1) -
  [https://product-fabric.atlassian.net/browse/ED-29133](ED-29133) - editor smart cards hydration
  was improved

### Patch Changes

- Updated dependencies

## 7.6.0

### Minor Changes

- [`5763f85b421a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5763f85b421a2) - -
  The new method `getCacheStatusForNode` is added to `NodeDataProvider` class to get the cache
  status for a given node.
  - The `CardSSR` component will start supporting `hideIconLoadingSkeleton` property for any type of
    smart card.

### Patch Changes

- [`a2cd8c46a3e94`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a2cd8c46a3e94) -
  EDITOR-1442 Bump adf-schema
- Updated dependencies

## 7.5.1

### Patch Changes

- Updated dependencies

## 7.5.0

### Minor Changes

- [`22e6e9fdea37a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22e6e9fdea37a) -
  Debounced embed card

### Patch Changes

- Updated dependencies

## 7.4.9

### Patch Changes

- [`ffc3ef708967c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ffc3ef708967c) -
  [ux] Adds an optional disablePreviewPanel prop on a smartcard to allow consumers opt out of
  opening Preview Panel by default when a smartlink is clicked.
- Updated dependencies

## 7.4.8

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 7.4.7

### Patch Changes

- Updated dependencies

## 7.4.6

### Patch Changes

- [`57b19274b9fdd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57b19274b9fdd) -
  EDITOR-1373 Bump adf-schema version
- Updated dependencies

## 7.4.5

### Patch Changes

- [`13c698778e3c6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/13c698778e3c6) -
  [ux] Atlaspack version bump
- Updated dependencies

## 7.4.4

### Patch Changes

- [`20d3223b57972`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/20d3223b57972) -
  Opted out of debounced portal provider
- [`0412437292a6d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0412437292a6d) -
  Switches linking changes for Preview Panel from FG to an experiment.
- Updated dependencies

## 7.4.3

### Patch Changes

- Updated dependencies

## 7.4.2

### Patch Changes

- Updated dependencies

## 7.4.1

### Patch Changes

- [`598cea2432fa9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/598cea2432fa9) -
  [ux] UI and behaviour updates of the HoverLinkOverlay for the Preview Panels.
- Updated dependencies

## 7.4.0

### Minor Changes

- [`bd14b2c6330ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bd14b2c6330ba) -
  [https://product-fabric.atlassian.net/browse/ED-28981](ED-28981) - use `CardSSR` component for
  smart card SSR

### Patch Changes

- Updated dependencies

## 7.3.1

### Patch Changes

- [`a32e07a545f72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a32e07a545f72) -
  [ux] Adds 'Open preview panel' button to the smartlink toolbar when the panel is supported.
- Updated dependencies

## 7.3.0

### Minor Changes

- [#198611](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/198611)
  [`a608f23cb3d4e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a608f23cb3d4e) -
  [https://product-fabric.atlassian.net/browse/ED-28628](ED-28628) - add SSR support for smart cards

### Patch Changes

- Updated dependencies

## 7.2.7

### Patch Changes

- [#196532](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/196532)
  [`7c7986b4858da`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7c7986b4858da) -
  Cleanup FG platform_ssr_smartlinks_editor
- Updated dependencies

## 7.2.6

### Patch Changes

- [#195649](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195649)
  [`231bb33e06dfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/231bb33e06dfe) -
  EDITOR-1131 Bump adf-schema version to 50.2.0
- Updated dependencies

## 7.2.5

### Patch Changes

- Updated dependencies

## 7.2.4

### Patch Changes

- [#191913](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191913)
  [`6d1e56695e91d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d1e56695e91d) -
  EDITOR-1131 Bump adf-schema package to 50.0.0
- Updated dependencies

## 7.2.3

### Patch Changes

- [#190588](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190588)
  [`b22e308cfd320`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b22e308cfd320) -
  Replace experiment key platform_editor_useSharedPluginStateSelector with
  platform_editor_useSharedPluginStateWithSelector
- Updated dependencies

## 7.2.2

### Patch Changes

- [#191381](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191381)
  [`efd66bb003bb4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/efd66bb003bb4) -
  [ux] Show warning on embed option in smart link card appearance dropdown
- Updated dependencies

## 7.2.1

### Patch Changes

- [#185241](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185241)
  [`0d1bffce3fedd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0d1bffce3fedd) -
  [ux] View embed as block card when page width smaller or equal to 600px
- Updated dependencies

## 7.2.0

### Minor Changes

- [#189119](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189119)
  [`3422f57cf2b75`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3422f57cf2b75) -
  Removing linking_platform_smart_links_in_live_pages FF

### Patch Changes

- [#187274](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187274)
  [`06b83ebb34346`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/06b83ebb34346) -
  [ux] ED-28390 platformise open hover button
- [#187671](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187671)
  [`f0b9b62ce032f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0b9b62ce032f) -
  [ux] ED-28547: Added hover card when hover smartlinks
- Updated dependencies

## 7.1.0

### Minor Changes

- [#189314](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189314)
  [`22c6251496010`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22c6251496010) -
  Exported missing types that were already being inferred from existing exports

### Patch Changes

- Updated dependencies

## 7.0.10

### Patch Changes

- [#188597](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188597)
  [`4de5a96f3e24c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4de5a96f3e24c) -
  [ED-28523] Enable new editor element toolbars UI for Jira
- Updated dependencies

## 7.0.9

### Patch Changes

- [#185723](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185723)
  [`751aeb4580469`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/751aeb4580469) -
  ED-28315 clean up fg platform_editor_controls_patch_13
- Updated dependencies

## 7.0.8

### Patch Changes

- Updated dependencies

## 7.0.7

### Patch Changes

- [#183772](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/183772)
  [`8b2280a6cd32a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8b2280a6cd32a) -
  [ux] ED-28391: Added panel hover button for jira in edit mode"
- Updated dependencies

## 7.0.6

### Patch Changes

- [#187144](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187144)
  [`a16147d8fbdfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a16147d8fbdfe) -
  Bump @atlaskit/adf-schema to v49.0.5
- Updated dependencies

## 7.0.5

### Patch Changes

- Updated dependencies

## 7.0.4

### Patch Changes

- [#184895](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/184895)
  [`facd697d9125e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/facd697d9125e) -
  Cleanup feature gate to remove card from state on destroy.
- Updated dependencies

## 7.0.3

### Patch Changes

- Updated dependencies

## 7.0.2

### Patch Changes

- [#182839](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/182839)
  [`81f1c3383bdab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81f1c3383bdab) -
  refactor: use useSharedPluginStateWithSelector instead of useSharedPluginStateSelector
- Updated dependencies

## 7.0.1

### Patch Changes

- Updated dependencies

## 7.0.0

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

## 6.8.0

### Minor Changes

- [#180491](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/180491)
  [`33c19072599ca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/33c19072599ca) -
  Tidied up smart card overlay experiment

### Patch Changes

- Updated dependencies

## 6.7.1

### Patch Changes

- [#179868](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/179868)
  [`87856dbd47c93`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/87856dbd47c93) -
  [ux] [ED-27899] Fix separators and order for plain links
- Updated dependencies

## 6.7.0

### Minor Changes

- [#177020](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/177020)
  [`206ae7b37b4af`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/206ae7b37b4af) -
  [ux] Add Competitor Prompt for Embed Smart Link

### Patch Changes

- Updated dependencies

## 6.6.15

### Patch Changes

- [#177081](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/177081)
  [`5eaa21607233e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5eaa21607233e) -
  [ux] [ED-28011] Add separator before 'Open link in new tab' button in card toolbar
- Updated dependencies

## 6.6.14

### Patch Changes

- [#175339](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175339)
  [`d4115e4055a0a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d4115e4055a0a) -
  ED-28314 Cleanup platform_editor_controls_patch_12
- Updated dependencies

## 6.6.13

### Patch Changes

- Updated dependencies

## 6.6.12

### Patch Changes

- [#174371](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/174371)
  [`05fc53f9168ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/05fc53f9168ae) -
  Merge visitCardLink and visitCardLinkAnalyticsOnly functions

## 6.6.11

### Patch Changes

- [#174579](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/174579)
  [`523619ae64bbd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/523619ae64bbd) -
  [ux] Clean up feature gate smart_link_editor_update_toolbar_open_link
- Updated dependencies

## 6.6.10

### Patch Changes

- [#174513](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/174513)
  [`9190f78c5c704`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9190f78c5c704) -
  Remove platform_editor_exp_disable_lnv experiment key.
- Updated dependencies

## 6.6.9

### Patch Changes

- [#173379](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173379)
  [`99e2b882f5cf0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/99e2b882f5cf0) -
  Clean up platform_editor_controls_patch_3
- Updated dependencies

## 6.6.8

### Patch Changes

- [#172583](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/172583)
  [`40f387a0c0962`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/40f387a0c0962) -
  Clean up platform_editor_controls_patch_2
- Updated dependencies

## 6.6.7

### Patch Changes

- Updated dependencies

## 6.6.6

### Patch Changes

- Updated dependencies

## 6.6.5

### Patch Changes

- Updated dependencies

## 6.6.4

### Patch Changes

- [#169870](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169870)
  [`07d290a3b8ee1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/07d290a3b8ee1) -
  [ED-28198] Add tooltip for edit link toolbar icon button
- Updated dependencies

## 6.6.3

### Patch Changes

- [#166368](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166368)
  [`5f46eb74d8fa5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5f46eb74d8fa5) -
  [ux] ED-27810: Added the link preference button when control is on

## 6.6.2

### Patch Changes

- Updated dependencies

## 6.6.1

### Patch Changes

- [#165113](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165113)
  [`867bcb05452bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/867bcb05452bf) -
  Cleaned up platform_editor_controls_patch_analytics and platform_editor_controls_patch_analytics_2
- Updated dependencies

## 6.6.0

### Minor Changes

- [#166813](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166813)
  [`31f2603b81531`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31f2603b81531) -
  [ux] Adjust optional CompetitorPrompt component type

### Patch Changes

- Updated dependencies

## 6.5.4

### Patch Changes

- [#166381](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166381)
  [`e7b0081a1b221`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e7b0081a1b221) -
  EDM-12154 cleaning up hardcoded embed only on new line feature flag
- Updated dependencies

## 6.5.3

### Patch Changes

- Updated dependencies

## 6.5.2

### Patch Changes

- Updated dependencies

## 6.5.1

### Patch Changes

- [#165822](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165822)
  [`abe794a9fdd4f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/abe794a9fdd4f) -
  ED-28147 fix exposure and gating for smart link cmd or ctrl click

## 6.5.0

### Minor Changes

- [#161907](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161907)
  [`0f083a35b280f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f083a35b280f) -
  [ux] Add optional CompetitorPrompt component to display for Smart Link card for experiment

### Patch Changes

- Updated dependencies

## 6.4.5

### Patch Changes

- [#163546](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163546)
  [`d3faab1b963ad`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d3faab1b963ad) -
  [ux] ED-28147 smart link support for cmd/ctrl click to open in new tab
- Updated dependencies

## 6.4.4

### Patch Changes

- Updated dependencies

## 6.4.3

### Patch Changes

- Updated dependencies

## 6.4.2

### Patch Changes

- [#163183](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163183)
  [`90c987607095d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/90c987607095d) -
  Disable lazy node view behind an experiment
- Updated dependencies

## 6.4.1

### Patch Changes

- [#161870](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161870)
  [`f2008aed97498`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2008aed97498) -
  Set default value of open text to null
- Updated dependencies

## 6.4.0

### Minor Changes

- [#161266](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161266)
  [`3eb1f4c974f21`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3eb1f4c974f21) -
  Improved load performance by moving recalculate logic on interaction

### Patch Changes

- Updated dependencies

## 6.3.3

### Patch Changes

- [#159655](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159655)
  [`24f8c627d50f2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/24f8c627d50f2) - ##
  WHAT? Remove experimental graceful edit mode from view mode plugin and associated props.

  ## WHY?

  This experiment is being cleaned up and we are no longer proceeding in this direction.

  ## HOW to adjust?

  This experiment was only enabled for Confluence and should not have been enabled in other places.
  If for some reason any of the following props/state/methdos were used please remove them:

  - isConsumption
  - contentMode
  - initialContentMode
  - updateContentMode

- Updated dependencies

## 6.3.2

### Patch Changes

- [#159351](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159351)
  [`8932459025c73`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8932459025c73) -
  Move card removal to unmounting of component.
- Updated dependencies

## 6.3.1

### Patch Changes

- Updated dependencies

## 6.3.0

### Minor Changes

- [#157092](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157092)
  [`87491e7b53b65`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/87491e7b53b65) -
  We are testing the migration to the ADS Link component behind a feature flag. If this fix is
  successful it will be available in a later release.

### Patch Changes

- Updated dependencies

## 6.2.0

### Minor Changes

- [#158037](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158037)
  [`f217faa73de90`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f217faa73de90) -
  [ux] ENGHEALTH-30614 updating legacy icon imports for iconography uplift migration linking
  platform

### Patch Changes

- Updated dependencies

## 6.1.3

### Patch Changes

- [#150558](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150558)
  [`2b8be3c33b348`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2b8be3c33b348) -
  ED-27612: prevent infinite loop on card delete
- Updated dependencies

## 6.1.2

### Patch Changes

- Updated dependencies

## 6.1.1

### Patch Changes

- Updated dependencies

## 6.1.0

### Minor Changes

- [#151988](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/151988)
  [`40cc12e3c4d9a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/40cc12e3c4d9a) -
  [ux] Add optional CompetitorPrompt component for experiment

### Patch Changes

- Updated dependencies

## 6.0.2

### Patch Changes

- [#154277](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154277)
  [`84e1566863396`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/84e1566863396) -
  [ux] ED-27809 Update edit button for datasource link toolbars so users can update search query
- Updated dependencies

## 6.0.1

### Patch Changes

- [#147070](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/147070)
  [`9fec1cb4ec861`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9fec1cb4ec861) -
  Migrate Card plugin to use useSharedPluginStateSelector
- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.4.31

### Patch Changes

- [#153459](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153459)
  [`56a72b77265db`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/56a72b77265db) -
  [ux] Show smart link open button overlay in chromeless editor
- Updated dependencies

## 5.4.30

### Patch Changes

- [#153256](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153256)
  [`3644fbe36073d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3644fbe36073d) -
  [ux] When ViewAll dropdown closes via ESC key press or submenus close via ESC or Enter, the focus
  is set on ViewAll button.
- Updated dependencies

## 5.4.29

### Patch Changes

- Updated dependencies

## 5.4.28

### Patch Changes

- Updated dependencies

## 5.4.27

### Patch Changes

- [#150983](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150983)
  [`a363af43f9cd6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a363af43f9cd6) -
  [ux] Adds i18n title for Open button that is shown on hovering a smartlink.
- Updated dependencies

## 5.4.26

### Patch Changes

- [#149482](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149482)
  [`1f1f73876c3c8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1f1f73876c3c8) -
  ED-27860 Add analytics for copy and delete button in floating toolbars
- Updated dependencies

## 5.4.25

### Patch Changes

- [#149184](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149184)
  [`2df75499ccc98`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2df75499ccc98) -
  Cleanup feature gate to fix plugin state on card plugin.
- [#149530](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149530)
  [`a432884180253`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a432884180253) -
  Sends SmartLink Visited event with additional input methods depending on the way the link was
  opened.
- Updated dependencies

## 5.4.24

### Patch Changes

- [#148769](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148769)
  [`4d875576ce223`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4d875576ce223) -
  [ux] Update link button to be an anchor
- Updated dependencies

## 5.4.23

### Patch Changes

- Updated dependencies

## 5.4.22

### Patch Changes

- Updated dependencies

## 5.4.21

### Patch Changes

- [#146194](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146194)
  [`dc301c3dad7a8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dc301c3dad7a8) -
  [ux] Feature gate cleanup: platform-editor-plugin-card-icon-migration
- Updated dependencies

## 5.4.20

### Patch Changes

- [#145382](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145382)
  [`09a75a68f9d26`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/09a75a68f9d26) -
  Clean up FG linking-platform-contenteditable-false-live-view
- Updated dependencies

## 5.4.19

### Patch Changes

- [#145180](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145180)
  [`46856892862ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/46856892862ec) -
  Clean up FG platform_linking_enable_transaction_filtering
- Updated dependencies

## 5.4.18

### Patch Changes

- [#144194](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144194)
  [`542b82e03416e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/542b82e03416e) -
  [ux] Remove separators within group in Editor floating toolbar
- Updated dependencies

## 5.4.17

### Patch Changes

- [#144829](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144829)
  [`14b488c2295de`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/14b488c2295de) -
  [ux] ED27537 Update alignment dropdown in media and embed card floating toolbar
- Updated dependencies

## 5.4.16

### Patch Changes

- [#142352](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142352)
  [`05903fde6d94d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/05903fde6d94d) -
  Internal change to use Compiled variant of `@atlaskit/primitives`.
- Updated dependencies

## 5.4.15

### Patch Changes

- Updated dependencies

## 5.4.14

### Patch Changes

- [#143317](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/143317)
  [`9af7f0abb556d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9af7f0abb556d) -
  Add placeholder replace for SSRed element to ignore recalculation on TTVC
- Updated dependencies

## 5.4.13

### Patch Changes

- [#141796](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141796)
  [`79a03eeb47e72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/79a03eeb47e72) -
  [ux] Fix truncate issue for open button text when hover on smart link
- Updated dependencies

## 5.4.12

### Patch Changes

- [#139216](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139216)
  [`e8f596d2b1910`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e8f596d2b1910) -
  [ux] Cleaned up platform_editor_controls_patch_1 FG
- Updated dependencies

## 5.4.11

### Patch Changes

- Updated dependencies

## 5.4.10

### Patch Changes

- [#135796](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135796)
  [`6cec67e75af40`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6cec67e75af40) -
  [ux] Fix open button text not display consistantly
- Updated dependencies

## 5.4.9

### Patch Changes

- Updated dependencies

## 5.4.8

### Patch Changes

- [#134468](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134468)
  [`e312ec529d05a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e312ec529d05a) -
  [ux] Apply hover decoration when hovering on copy/delete button on overflow menu
- Updated dependencies

## 5.4.7

### Patch Changes

- [#132269](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132269)
  [`f6984f0b31c02`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f6984f0b31c02) -
  [ux] Fixed alignment of the icon in OpenButtonOverlay on header link.
- Updated dependencies

## 5.4.6

### Patch Changes

- [#133060](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133060)
  [`4e22e38db002e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4e22e38db002e) -
  [ux] Fix for Editor Controls. When link appearance options are not available, we do not render
  these options in the floating toolbar.

## 5.4.5

### Patch Changes

- Updated dependencies

## 5.4.4

### Patch Changes

- [#132051](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132051)
  [`d4b3a24694bb8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d4b3a24694bb8) -
  [ux] [ED-27252] Hide open link overlay in editor view mode

## 5.4.3

### Patch Changes

- [#131428](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131428)
  [`3aa1f96909918`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3aa1f96909918) -
  [ux] Update OpenButtonOverlay to fix styles.

## 5.4.2

### Patch Changes

- [#129138](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129138)
  [`9f003b1dbcdb5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9f003b1dbcdb5) -
  Render ssred smartlink for editor under feature gate 'platform_ssr_smartlinks_editor'

## 5.4.1

### Patch Changes

- [#130882](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130882)
  [`df1c29f476539`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/df1c29f476539) -
  [ux] Adds a new i18n message and updates icons and tooltips on links, media and extensions.
- Updated dependencies

## 5.4.0

### Minor Changes

- [#129544](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129544)
  [`2c661f18440df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2c661f18440df) -
  [ux] Rebranded the term Issue to Work item as part of issue terminology refresh

### Patch Changes

- Updated dependencies

## 5.3.6

### Patch Changes

- [#129581](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129581)
  [`28d3a33252273`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/28d3a33252273) -
  [ux] Update open button on short link
- Updated dependencies

## 5.3.5

### Patch Changes

- [#128122](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128122)
  [`552a7081e75d7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/552a7081e75d7) -
  [ux] ED-27167 Move copy and delete button to overflow menu for datasource floating toolbar
- Updated dependencies

## 5.3.4

### Patch Changes

- Updated dependencies

## 5.3.3

### Patch Changes

- [#127355](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127355)
  [`f4e608fc7d405`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f4e608fc7d405) -
  Clean up feature gate platform_fix_embedded_card_re-rendering
- Updated dependencies

## 5.3.2

### Patch Changes

- [#127208](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127208)
  [`c2951b65d3aac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c2951b65d3aac) -
  [ux] ED-26896 Move list option to link dropdown
- Updated dependencies

## 5.3.1

### Patch Changes

- Updated dependencies

## 5.3.0

### Minor Changes

- [#124727](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124727)
  [`453158fbcf813`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/453158fbcf813) -
  Removed lazy node view experiment from toDOM fix

## 5.2.4

### Patch Changes

- Updated dependencies

## 5.2.3

### Patch Changes

- Updated dependencies

## 5.2.2

### Patch Changes

- [#123042](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123042)
  [`c21eaf81cd674`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c21eaf81cd674) -
  Fix card state on embed card which was never removed if the card was deleted or changed.

## 5.2.1

### Patch Changes

- Updated dependencies

## 5.2.0

### Minor Changes

- [#121851](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121851)
  [`71823ac860883`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/71823ac860883) -
  Add 'state' as an optional param to GetStartingToolbarItems type, display new appearance dropdown
  for url nodes

### Patch Changes

- [#122152](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122152)
  [`c3187eef09138`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c3187eef09138) -
  [ux] Update editor floating toolbar icons
- Updated dependencies

## 5.1.1

### Patch Changes

- Updated dependencies

## 5.1.0

### Minor Changes

- [#120472](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120472)
  [`73c800ab5f2fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73c800ab5f2fc) -
  ED-26766 update adf-schema from 47.2.1 to 47.6.0 and adf-schema-json from 1.27.0 to 1.31.0

### Patch Changes

- [#121533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121533)
  [`9efef36af09aa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9efef36af09aa) -
  Wire up the copy functionality in floating toolbar overflow menu
- [#121044](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121044)
  [`048ca2b813e3a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/048ca2b813e3a) -
  Add new dropdown menu to change link appearance and visit settings preferences, under
  platform_editor_controls
- Updated dependencies

## 5.0.7

### Patch Changes

- [#121092](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121092)
  [`8cd08b738070d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8cd08b738070d) -
  [ux] Implemented full height separator as per design for media and card

## 5.0.6

### Patch Changes

- [#120575](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120575)
  [`0da64a47689b5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0da64a47689b5) -
  [ux] Add overflow menu on editor floating toolbar for media and card plugin

## 5.0.5

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 5.0.4

### Patch Changes

- Updated dependencies

## 5.0.3

### Patch Changes

- [#118829](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118829)
  [`7c89303bd91d3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7c89303bd91d3) -
  [ux] Migrate to new ADS icon
- [#118799](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118799)
  [`11c8209cb910d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/11c8209cb910d) -
  Fixes missing dependency declarations in package.json
- Updated dependencies

## 5.0.2

### Patch Changes

- [#117485](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/117485)
  [`e9a8d9ba26963`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e9a8d9ba26963) -
  Reorder icons, and remove some based on new editor controls. Changes under
  `editor_plugin_controls` experiment.
- Updated dependencies

## 5.0.1

### Patch Changes

- [#117971](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117971)
  [`d63604c31bb17`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d63604c31bb17) -
  [ux] Editor controls - Link consumption friendliness with open link on hover
- Updated dependencies

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

## 4.6.5

### Patch Changes

- Updated dependencies

## 4.6.4

### Patch Changes

- Updated dependencies

## 4.6.3

### Patch Changes

- [#114033](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114033)
  [`bd8a7551ac410`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bd8a7551ac410) -
  EDM-11641 Check SL tokens editor & renderer, fix icon
- [#114033](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114033)
  [`6ca32524df553`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6ca32524df553) -
  EDM-11641 Smart links token migration smart card toolbarwq

## 4.6.2

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 4.6.1

### Patch Changes

- Updated dependencies

## 4.6.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 4.5.19

### Patch Changes

- Updated dependencies

## 4.5.18

### Patch Changes

- Updated dependencies

## 4.5.17

### Patch Changes

- Updated dependencies

## 4.5.16

### Patch Changes

- [#103370](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103370)
  [`c121c95a0cf37`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c121c95a0cf37) -
  Cleanup feature flag enable_datasource_react_sweet_state to always use react sweet state for
  powering datasources
- Updated dependencies

## 4.5.15

### Patch Changes

- [#104847](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104847)
  [`b55fc11242d17`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b55fc11242d17) -
  Consolidate duplicate import statements

## 4.5.14

### Patch Changes

- [#102068](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102068)
  [`d90fc9b7d48bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d90fc9b7d48bf) -
  [ux] Disable datasource items while offline
- [#97984](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97984)
  [`8ffeab9aaf1ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ffeab9aaf1ab) -
  [ux] [ED-23573] Added new actions (resolveMarks and registerMarks) to basePlugin. Callbacks added
  to mentions, card, emoji and base plugins to handle conversion to inline code. Deprecated code
  removed from editor-common.
- Updated dependencies

## 4.5.13

### Patch Changes

- Updated dependencies

## 4.5.12

### Patch Changes

- [#100134](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100134)
  [`d79324a9356bb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d79324a9356bb) -
  ED-26133: disables smart link comments when browser offline

## 4.5.11

### Patch Changes

- Updated dependencies

## 4.5.10

### Patch Changes

- Updated dependencies

## 4.5.9

### Patch Changes

- Updated dependencies

## 4.5.8

### Patch Changes

- Updated dependencies

## 4.5.7

### Patch Changes

- [#179137](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/179137)
  [`163478624d145`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/163478624d145) -
  Update embedCard component to avoid rerenderings when editor gets disabled
- Updated dependencies

## 4.5.6

### Patch Changes

- Updated dependencies

## 4.5.5

### Patch Changes

- [#175841](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175841)
  [`f21aa44e58c1b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f21aa44e58c1b) -
  removing platform-datasources-enable-two-way-sync FF

## 4.5.4

### Patch Changes

- [#176427](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176427)
  [`9c2bd03adeebd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9c2bd03adeebd) -
  [ED-25999] adding analytic events for inline node of emoji,status and inlineCard
- Updated dependencies

## 4.5.3

### Patch Changes

- [#176983](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176983)
  [`b62801c154a5b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b62801c154a5b) -
  Migrated smart-card proxied exports (linking-common, link-provider, json-ld-types) to import from
  modules directly

## 4.5.2

### Patch Changes

- [#175587](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175587)
  [`92d72762ca509`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/92d72762ca509) -
  ED-25113: refactors card plugin to meet folder standards
- Updated dependencies

## 4.5.1

### Patch Changes

- [#176132](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176132)
  [`738d9aeecf5e1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/738d9aeecf5e1) -
  [ED-24119] Replace Legacy React Context with proper React Context

## 4.5.0

### Minor Changes

- [#175540](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175540)
  [`fa908f67c5dba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fa908f67c5dba) -
  [ux] ED-25903 support comment on smart links floating toolbar

### Patch Changes

- Updated dependencies

## 4.4.13

### Patch Changes

- Updated dependencies

## 4.4.12

### Patch Changes

- Updated dependencies

## 4.4.11

### Patch Changes

- Updated dependencies

## 4.4.10

### Patch Changes

- Updated dependencies

## 4.4.9

### Patch Changes

- Updated dependencies

## 4.4.8

### Patch Changes

- Updated dependencies

## 4.4.7

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0
- Updated dependencies

## 4.4.6

### Patch Changes

- Updated dependencies

## 4.4.5

### Patch Changes

- Updated dependencies

## 4.4.4

### Patch Changes

- Updated dependencies

## 4.4.3

### Patch Changes

- Updated dependencies

## 4.4.2

### Patch Changes

- [#163012](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163012)
  [`3b6b07774a436`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3b6b07774a436) -
  Removes window.open call within link preferences button on click handler in toolbar to prevent
  duplicate opening of link
- Updated dependencies

## 4.4.1

### Patch Changes

- [#161054](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161054)
  [`20f069140338e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/20f069140338e) -
  Remove enable_datasource_nourl_edit_dropdown_datafetch FF

## 4.4.0

### Minor Changes

- [#159018](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159018)
  [`14d5e189df870`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14d5e189df870) -
  [ux] ED-25367-remove-copy-button-from-view-mode-when-its-the-only-item

### Patch Changes

- Updated dependencies

## 4.3.11

### Patch Changes

- [#159791](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159791)
  [`ce28bda7a3e2a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ce28bda7a3e2a) -
  Removing usages of `linking-platform-migrate-deprecated-data-prop` FF so we can remove deprecated
  props from `@atlaskit/smart-card`
- Updated dependencies

## 4.3.10

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 4.3.9

### Patch Changes

- Updated dependencies

## 4.3.8

### Patch Changes

- [#156301](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156301)
  [`da531da92568b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da531da92568b) -
  Migrating tests to use url prop from @atlaskit/smart-card instead of deprecated data prop
- Updated dependencies

## 4.3.7

### Patch Changes

- [#155058](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155058)
  [`789a3e0517247`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/789a3e0517247) -
  [ux] Removing platform.linking-platform.enable-datasource-edit-dropdown-toolbar feature flag
- Updated dependencies

## 4.3.6

### Patch Changes

- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1
- Updated dependencies

## 4.3.5

### Patch Changes

- Updated dependencies

## 4.3.4

### Patch Changes

- [#152823](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152823)
  [`0ec705650807f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0ec705650807f) -
  [ux] ED-25090: ED-25090: Migrated link toolbar and panel toolbar to use the new icons

## 4.3.3

### Patch Changes

- Updated dependencies

## 4.3.2

### Patch Changes

- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1
- [#152197](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152197)
  [`dddd3eca66a62`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dddd3eca66a62) -
  Optimise the re-renders for floating toolbar in live edit mode.
- Updated dependencies

## 4.3.1

### Patch Changes

- Updated dependencies

## 4.3.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 4.2.1

### Patch Changes

- Updated dependencies

## 4.2.0

### Minor Changes

- [#150201](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150201)
  [`850f81903fc73`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/850f81903fc73) -
  Remove usage of UNSAFE lifecycles from card

### Patch Changes

- [#147618](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147618)
  [`e187b02ef8540`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e187b02ef8540) -
  Clean up feature flag platform.linking-platform.datasource-word_wrap. This enables the
  line-wrapping toggle in datasource tables for all customers.
- Updated dependencies

## 4.1.0

### Minor Changes

- [#150349](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150349)
  [`3930014486c26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3930014486c26) -
  Clean up FF that disables inline smart-card overlay in view mode

## 4.0.0

### Major Changes

- [#149599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149599)
  [`9c110fa4b038c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9c110fa4b038c) -
  The hyperlink floating toolbar no longer includes a settings button by default, now requires card
  plugin to be provided to include the settings button in the hyperlink floating toolbar (via ff
  cleanup platform.editor.card.inject-settings-button).

  Upgrade requires only checking compatible versions of `@atlaskit/editor-plugin-card` and
  `@atlaskit/editor-plugin-hyperlink` as both packages are affected by feature flag change.

### Patch Changes

- Updated dependencies

## 3.4.5

### Patch Changes

- Updated dependencies

## 3.4.4

### Patch Changes

- [#147230](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147230)
  [`9221804a29ac8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9221804a29ac8) -
  [ux] Remove FF platform.linking-platform.datasource-enable-toolbar-buttons-for-all-datasources
- Updated dependencies

## 3.4.3

### Patch Changes

- Updated dependencies

## 3.4.2

### Patch Changes

- [#147708](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147708)
  [`82148eb4038af`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/82148eb4038af) -
  add lazy node view for inline card
- Updated dependencies

## 3.4.1

### Patch Changes

- [#146891](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146891)
  [`17f2c59f06b04`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/17f2c59f06b04) -
  Migrate smart links in live pages feature flag to Statsig
- Updated dependencies

## 3.4.0

### Minor Changes

- [#147220](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147220)
  [`07a9416026f88`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/07a9416026f88) -
  Remove showActions and showServerActions from smart-card

### Patch Changes

- Updated dependencies

## 3.3.0

### Minor Changes

- [#146630](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146630)
  [`eaf8a37e7f139`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eaf8a37e7f139) -
  [ux] Fix configure overlay appearing in live view editor contexts

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

- [#145026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145026)
  [`98399b2cfafdc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/98399b2cfafdc) -
  Remove references to showActions and showServerActions

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#142414](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142414)
  [`4d4914bf56307`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4d4914bf56307) -
  Remove card provider feature flag and rename autoformatting provider feature flag, Improve
  performance of setting card provider, Feature Gate the autoformatting Provider being passed to
  ComposableEditor in Confluence

## 3.0.7

### Patch Changes

- Updated dependencies

## 3.0.6

### Patch Changes

- [#143055](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143055)
  [`1580619590f3e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1580619590f3e) -
  [ux] Adds a filterTransaction to the editor-card plugin to ignore bug-causing click transaction
  when inline editing is active and user clicks on scroll gutter of the editor, ignoring the
  transaction coming from editor-core click-area-helper in this edge case.

## 3.0.5

### Patch Changes

- Updated dependencies

## 3.0.4

### Patch Changes

- [#142271](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142271)
  [`b6147e8a87a2d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6147e8a87a2d) -
  Add try/catch around localStorage usages

## 3.0.3

### Patch Changes

- [#142202](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142202)
  [`bd97acf1388d4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bd97acf1388d4) -
  Fix edit datasource option not available on links with empty result or invalid jql

## 3.0.2

### Patch Changes

- [#139456](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139456)
  [`a788f5ceac7a2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a788f5ceac7a2) -
  [ux] When FF hardcoded-embeds-only-on-new-line is true pasting of some urls (like youtube or jira
  dashboard or conny whiteboards) will only become embed right away if pasted on a new line in a
  root of the document
- Updated dependencies

## 3.0.1

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.
- Updated dependencies

## 3.0.0

### Major Changes

- [#139052](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139052)
  [`6e5c1f6bbf028`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6e5c1f6bbf028) -
  Removed mobile specific support from card plugin, as the Editor no longer supports this appearance

### Patch Changes

- Updated dependencies

## 2.15.3

### Patch Changes

- [#139034](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139034)
  [`517cdc0f7ea1a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/517cdc0f7ea1a) -
  Used experiment for lazy node view

## 2.15.2

### Patch Changes

- [`1269ffa635367`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1269ffa635367) -
  Cleanup FF platform_editor_get_card_provider_from_config

## 2.15.1

### Patch Changes

- Updated dependencies

## 2.15.0

### Minor Changes

- [#137404](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137404)
  [`e7ce490e04b4f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e7ce490e04b4f) -
  [ux] Adds button to Smart Link toolbar to switch to Smart Link List View for supporting links (by
  cleanup of platform.linking-platform.enable-datasource-appearance-toolbar).
- [#137156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137156)
  [`058afdc0d3145`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/058afdc0d3145) -
  [ux] Introduces Confluence Smart Link List View as a valid list view modal by removing feature
  flag platform.linking-platform.datasource.enable-confluence-search-modal

### Patch Changes

- Updated dependencies

## 2.14.1

### Patch Changes

- [#136348](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136348)
  [`fb4fb56f1da7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fb4fb56f1da7c) -
  Use optimised entry-points on editor-common for browser.
- Updated dependencies

## 2.14.0

### Minor Changes

- [`c4d2eb3f9f965`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c4d2eb3f9f965) -
  [ux] Fix issue with card provider not updating asynchronously

### Patch Changes

- Updated dependencies

## 2.13.5

### Patch Changes

- [#134243](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134243)
  [`f80ad43fc6eea`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f80ad43fc6eea) -
  Fix text selection inside datasource table input

## 2.13.4

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 2.13.3

### Patch Changes

- [`638f18de80136`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/638f18de80136) -
  Remove unused exports

## 2.13.2

### Patch Changes

- [#132782](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132782)
  [`1b37050a2f07e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1b37050a2f07e) -
  Fix inline edit inside datasource table replace entire node
- Updated dependencies

## 2.13.1

### Patch Changes

- Updated dependencies

## 2.13.0

### Minor Changes

- [#129411](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129411)
  [`175fc1454a8a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/175fc1454a8a4) -
  [ux] Migrate typography with new ADS token and primitive and remove feature gate

### Patch Changes

- Updated dependencies

## 2.12.1

### Patch Changes

- Updated dependencies

## 2.12.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 2.11.0

### Minor Changes

- [#128578](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128578)
  [`cafc6755fb65a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cafc6755fb65a) -
  Add React 18 compatability

## 2.10.1

### Patch Changes

- Updated dependencies

## 2.10.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

### Patch Changes

- Updated dependencies

## 2.9.6

### Patch Changes

- [#127640](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127640)
  [`ccefb817c754a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ccefb817c754a) -
  [ux] Migrate typography with new ADS token and primitive

## 2.9.5

### Patch Changes

- Updated dependencies

## 2.9.4

### Patch Changes

- Updated dependencies

## 2.9.3

### Patch Changes

- [#125862](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125862)
  [`6c72c192b5df6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6c72c192b5df6) -
  [ux] Improve embed card fallback for lazy node view such that it matches the embed card loading
  state.
- Updated dependencies

## 2.9.2

### Patch Changes

- [#125851](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125851)
  [`4ffe0a8ea7929`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4ffe0a8ea7929) -
  Refactor node views.
- Updated dependencies

## 2.9.1

### Patch Changes

- Updated dependencies

## 2.9.0

### Minor Changes

- [`aef5432662b58`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aef5432662b58) -
  [ux] EDM-10363 Implement opening links via configure overlay dropdown open link button

### Patch Changes

- Updated dependencies

## 2.8.2

### Patch Changes

- [#112464](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112464)
  [`e26f188519478`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e26f188519478) -
  Remove feature flag that is fully rolled out

## 2.8.1

### Patch Changes

- Updated dependencies

## 2.8.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 2.7.1

### Patch Changes

- [`338c00056aa27`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/338c00056aa27) -
  Cleans up internal refactor (platform.linking-platform.editor-datasource-typeguards). No expected
  functional changes.

## 2.7.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

### Patch Changes

- Updated dependencies

## 2.6.5

### Patch Changes

- [#122612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122612)
  [`01a85ce0a88ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/01a85ce0a88ec) -
  [ux] ED-23705 Add logic to handle annotations on inline nodes when they are inserted or pasted.
  Covers the following inline nodes: emoji, status, mention, date, inlineCard
- Updated dependencies

## 2.6.4

### Patch Changes

- [#122063](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122063)
  [`c136e556d086d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c136e556d086d) -
  [ux] Apply live page and check for live view in card and hyperlink plugin

## 2.6.3

### Patch Changes

- [#121784](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121784)
  [`a6117088af0ad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a6117088af0ad) -
  The edit toolbar button is retrieving metadata from /data endpoint for analytics metadata.

## 2.6.2

### Patch Changes

- [#120605](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120605)
  [`b2b0cfe2fb0c4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b2b0cfe2fb0c4) -
  Removed unused code in leftIconOverlay
- [#121395](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121395)
  [`caceefb824256`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/caceefb824256) -
  Removing contenteditable and CCFE workaround for smart links in live pages
- Updated dependencies

## 2.6.1

### Patch Changes

- Updated dependencies

## 2.6.0

### Minor Changes

- [#119966](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119966)
  [`596ad24e38929`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/596ad24e38929) -
  Clean up typescript references to LegacyPortalProviderAPI

### Patch Changes

- Updated dependencies

## 2.5.2

### Patch Changes

- [#119704](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119704)
  [`2308f93f42b1a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2308f93f42b1a) -
  EDM-10361 Show highlighted border on hover of inline card configure overlay
- Updated dependencies

## 2.5.1

### Patch Changes

- [#119163](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119163)
  [`45ae1b9a97c16`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/45ae1b9a97c16) -
  [ux] Added onDropdownChange prop to overlay in editor-common. Used this prop to keep link
  configure overlay open when dropdown is open, and hide overlay when dropdown is hidden.
- Updated dependencies

## 2.5.0

### Minor Changes

- [#119135](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119135)
  [`a4a41c5e54071`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a4a41c5e54071) -
  Allow smart links to navigate in live pages edit view

### Patch Changes

- Updated dependencies

## 2.4.4

### Patch Changes

- Updated dependencies

## 2.4.3

### Patch Changes

- Updated dependencies

## 2.4.2

### Patch Changes

- [#117973](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117973)
  [`6e37bac62083f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6e37bac62083f) -
  moved one const, added new entry point for other and deprecated
- Updated dependencies

## 2.4.1

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#117451](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117451)
  [`0ecc0082a92e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0ecc0082a92e6) -
  [ux] Enable hover cards for inline links in live pages behind ff

### Patch Changes

- Updated dependencies

## 2.3.8

### Patch Changes

- [#117409](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117409)
  [`bf7f33f08064a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bf7f33f08064a) -
  Use the card provider passed directly to the card plugin to decouple it from editor-core.

## 2.3.7

### Patch Changes

- Updated dependencies

## 2.3.6

### Patch Changes

- [#117151](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117151)
  [`94ee9b09a23a0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/94ee9b09a23a0) -
  Fix import statement to @atlaskit/editor-common to use entrypoint

## 2.3.5

### Patch Changes

- [#117005](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117005)
  [`74f438b3abcff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/74f438b3abcff) -
  [ux] Fix for import statement in plugins.tsx
- Updated dependencies

## 2.3.4

### Patch Changes

- [#116819](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116819)
  [`d80c008d6a32e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d80c008d6a32e) -
  [ux] Seperate live page overlay logic from discoverability overlay and assosciated code refactor

## 2.3.3

### Patch Changes

- [#116712](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116712)
  [`1e3e81166600e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1e3e81166600e) -
  [ux] Bump for the previous fix of the import statement

## 2.3.2

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
- Updated dependencies

## 2.3.1

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#114832](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114832)
  [`a38ae4ff11746`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a38ae4ff11746) -
  [ux] Add new configure overlay button to inline cards behind a feature flag.

## 2.2.2

### Patch Changes

- [#114993](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114993)
  [`06ddfaec64a7d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/06ddfaec64a7d) -
  Fix import - export ConfigModalProps between link-datasource and editor-plugin-card
- Updated dependencies

## 2.2.1

### Patch Changes

- [#115837](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115837)
  [`370c68df9de67`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/370c68df9de67) -
  [ux] EmbedCard - resize handles will be hidden on view mode in live pages
- Updated dependencies

## 2.2.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

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

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 2.0.11

### Patch Changes

- Updated dependencies

## 2.0.10

### Patch Changes

- [#112182](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112182)
  [`474de215aa66e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/474de215aa66e) -
  Moving fix for using select all shortcut inside a database or other embed card into the card
  itself to fix selection issues with embed card.
- Updated dependencies

## 2.0.9

### Patch Changes

- Updated dependencies

## 2.0.8

### Patch Changes

- Updated dependencies

## 2.0.7

### Patch Changes

- [#111799](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111799)
  [`8da4e04d627d5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8da4e04d627d5) -
  Adds analytic events for toolbar edit dropdown for datasources

## 2.0.6

### Patch Changes

- Updated dependencies

## 2.0.5

### Patch Changes

- [#110890](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110890)
  [`a0ec52861fce2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a0ec52861fce2) -
  [ux] Fixed a duplicate separator showing in the floating toolbar.
- [#110903](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110903)
  [`7fafce0ccd594`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7fafce0ccd594) -
  [ux] Clicking edit link or edit datasource while in SLLV view will no longer trigger scrolling.
- Updated dependencies

## 2.0.4

### Patch Changes

- [#108600](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108600)
  [`ab0ef9cd9d368`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ab0ef9cd9d368) -
  [ux] Fixed the toolbar edit button in the new dropdown button for assets.
- Updated dependencies

## 2.0.3

### Patch Changes

- [#108480](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108480)
  [`8552b1dc7f80d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8552b1dc7f80d) -
  Creating new dropdown component for configuring links

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [#106543](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106543)
  [`2141b277161c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2141b277161c) -
  Added API actions to retrieve toolbar items and removed `mountHyperlink` used to inject behavior
  into hyperlink.

### Patch Changes

- Updated dependencies

## 1.15.1

### Patch Changes

- Updated dependencies

## 1.15.0

### Minor Changes

- [#106501](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106501)
  [`e6be41c844bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e6be41c844bf) -
  [ux] Update datasource toolbar edit functionality with the new Edit Dropdown UI

### Patch Changes

- Updated dependencies

## 1.14.5

### Patch Changes

- [#102324](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102324)
  [`e9618cb8df77`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e9618cb8df77) -
  make columnCustomSizes passed down to config modal to be empty object instead of undefined

## 1.14.4

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.14.3

### Patch Changes

- [#102406](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102406)
  [`4e5db5fc8294`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4e5db5fc8294) -
  Minor refactors to improve type-safety. No expected functional changes.

## 1.14.2

### Patch Changes

- [#99680](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99680)
  [`538e71f42af4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/538e71f42af4) -
  Add code behind an FF to control what events are sent to prose mirror based on classnames, in
  orderto control toolbar and selection behaviour for smart links in live pages.
- Updated dependencies

## 1.14.1

### Patch Changes

- [#101042](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101042)
  [`7775bd23868c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7775bd23868c) -
  [ux] Change default layout of all datasources to be wide
- Updated dependencies

## 1.14.0

### Minor Changes

- [#100627](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100627)
  [`619f85adfe8b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/619f85adfe8b) -
  EDM-9852 Add initial inline link overlay for live pages support

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 1.13.0

### Minor Changes

- [#98528](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98528)
  [`12181f0bfaed`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/12181f0bfaed) -
  EDM-9252 Removal of platform.linking-platform.smart-card.inline-switcher

## 1.12.1

### Patch Changes

- [#99590](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99590)
  [`b0670c3f10e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b0670c3f10e6) -
  Remove the displayedColumnCount key-value pair from attributes object entirely if it doesn't exist
  for analytics
- Updated dependencies

## 1.12.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 1.11.4

### Patch Changes

- Updated dependencies

## 1.11.3

### Patch Changes

- [#98080](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98080)
  [`23c03580e38c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/23c03580e38c) -
  [ux] [ED-23247] Allow floating toolbar copy buttons in live pages view mode.

## 1.11.2

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 1.11.1

### Patch Changes

- [#97537](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97537)
  [`7d76404fde3f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7d76404fde3f) -
  Fix a bug where the confluence search config modal may appear to be empty when opening an existing
  inline link.
- Updated dependencies

## 1.11.0

### Minor Changes

- [#97997](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97997)
  [`ee970964e1f2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ee970964e1f2) -
  [ux] Replaces the Datasources Toolbar TableIcon with a new custom Icon

## 1.10.3

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5
- Updated dependencies

## 1.10.2

### Patch Changes

- Updated dependencies

## 1.10.1

### Patch Changes

- [#93932](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93932)
  [`2d7ead0569b2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2d7ead0569b2) -
  Adopt new view mode "table" and "inlin" for Jira SLLV config modal
- Updated dependencies

## 1.10.0

### Minor Changes

- [#95168](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95168)
  [`2091e194a817`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2091e194a817) -
  Introduced new PortalProviderAPI behind a FF

### Patch Changes

- Updated dependencies

## 1.9.3

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 1.9.2

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1

## 1.9.1

### Patch Changes

- [#93689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93689)
  [`5ba5d2b4a9ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ba5d2b4a9ac) -
  Updating adf-schema version to 35.10.0

## 1.9.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.8.2

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options
- Updated dependencies

## 1.8.1

### Patch Changes

- [#92530](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92530)
  [`4f0d59f56914`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4f0d59f56914) -
  The changes here fixes a bug where the toolbar shows smartlink icons when the node does not have a
  url.

## 1.8.0

### Minor Changes

- [#89840](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89840)
  [`9f256dde75e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f256dde75e9) -
  [ux] Implement onClickCallback plugin option to editor-plugin-card, allowing a callback to be
  executed when a smartlink is clicked, used by CCFE for live view to open smartlinks on-click

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 1.7.0

### Minor Changes

- [#89386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89386)
  [`91d0fdc31828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/91d0fdc31828) -
  Updates card plugin to leverage hyperlink plugins addToolbarItems action in order to inject link
  preferences button into the hyperlink floating toolbar. Also adds support to configure the link
  via card plugin options (smart links). Requires platform feature flag
  `platform.editor.card.inject-settings-button`.

  Example usage:

  ```tsx
  <Editor linking={{ smartLinks: { userPreferencesLink: 'https://example.com' } }} {...restProps} />
  ```

### Patch Changes

- Updated dependencies

## 1.6.2

### Patch Changes

- [#89921](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89921)
  [`411822b4d808`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/411822b4d808) -
  The changes here updates the datasource toolbar to display smart-link icons for config and
  non-config based datasources.

## 1.6.1

### Patch Changes

- [#88724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88724)
  [`df44cd13bfac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/df44cd13bfac) -
  Fix datasources breakout layout button to refresh node reference when making a layout change
  transaction

## 1.6.0

### Minor Changes

- [#88000](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88000)
  [`61b44e565851`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/61b44e565851) -
  [ux] FF clean up platform.editor.show-embed-card-frame-renderer

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#87262](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87262)
  [`a30a91a62f03`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a30a91a62f03) -
  Add slash command for confluence search datasource creation

### Patch Changes

- Updated dependencies

## 1.4.4

### Patch Changes

- [#88295](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88295)
  [`6b703183b847`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b703183b847) -
  [ux] Remove (Beta) from the /Assets and + Assets elements description for GA
- [#88531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88531)
  [`2362c633e4e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2362c633e4e9) -
  Adds confluence-search modal integration
- Updated dependencies

## 1.4.3

### Patch Changes

- [#87517](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87517)
  [`cb501b6ea6e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb501b6ea6e0) -
  Link preferences button for datasources toolbar is now in full effect (feature flag removed).

## 1.4.2

### Patch Changes

- [#87585](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87585)
  [`b9e0cbd0958b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9e0cbd0958b) -
  [ux] Fix hyperlink toolbar to render list view icon only when datasources is explicitly set to
  true by parent property
- Updated dependencies

## 1.4.1

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0
- Updated dependencies

## 1.4.0

### Minor Changes

- [#84733](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/84733)
  [`de779b2d9543`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de779b2d9543) -
  Modify link-preferences to factor in CLOUD_ENV environment varaible when fetching preferences link

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#83578](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83578)
  [`e9dff7ea4ece`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e9dff7ea4ece) -
  EDF-468 Added disableFloatingToolbar plugin option to disable showing floating toolbar when smart
  link is clicked.

## 1.2.5

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0
- Updated dependencies

## 1.2.4

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.2.3

### Patch Changes

- [#79684](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79684)
  [`f8ed04300b5c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f8ed04300b5c) -
  [ux] Updating hardcoded spacing variables in smart-card to use design tokens
- [#82639](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82639)
  [`46e1301accc1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/46e1301accc1) -
  React 18 types for editor-plugin-card

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- [#76893](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76893)
  [`8d781cb52f84`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d781cb52f84) -
  [ux] Add support for datasource column wrapping controls
- Updated dependencies

## 1.2.0

### Minor Changes

- [#77720](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77720)
  [`5b0f2fbdda16`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5b0f2fbdda16) -
  [ux] Added link preferences button to datasources (feature-flagged)

### Patch Changes

- Updated dependencies

## 1.1.5

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0
- Updated dependencies

## 1.1.4

### Patch Changes

- [#79373](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79373)
  [`8527099fbddf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8527099fbddf) -
  Fixed so that "creationMethod" is populated when clicking on a toolbar.
- Updated dependencies

## 1.1.3

### Patch Changes

- [#78367](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78367)
  [`bc524e57ea86`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc524e57ea86) -
  [ux] Fixes an issue where doing a select all inside an input field in an embed card would select
  the node.

## 1.1.2

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

## 1.1.1

### Patch Changes

- [#76864](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76864)
  [`7ef524e422c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7ef524e422c3) -
  Fixes switching card view from inline to Datasources
- Updated dependencies

## 1.1.0

### Minor Changes

- [#76379](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76379)
  [`1550bb6f5bde`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1550bb6f5bde) -
  Updating links for link-preferences to be dependent on staging environment

### Patch Changes

- Updated dependencies

## 1.0.6

### Patch Changes

- [#75568](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75568)
  [`cf557c64b311`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cf557c64b311) -
  Updated DatasourceErrorBoundary to pass error, datasourceId and datasourceModalType to
  LazyLoadedDatasourceRenderFailedAnalyticsWrapper

## 1.0.5

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- [#75549](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75549)
  [`cdb2d5721cce`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cdb2d5721cce) -
  Fix an issue where view switching from toolbar was causing js error.
- Updated dependencies

## 1.0.3

### Patch Changes

- [#72875](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72875)
  [`0d1e8b03af0b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0d1e8b03af0b) -
  Adding datasource stash to save datasource views when switching to inline/block and then back to
  datasource view

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [#71504](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71504)
  [`8beedb8b48db`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8beedb8b48db) -
  [ux] Enable switch view from Datasource to back smart links behind ff
  platform.linking-platform.enable-datasource-appearance-toolbar
- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386)
  [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) -
  This changeset exists to bump all editor plugins that currently don't have a major version. This
  is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.16.11

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency
- Updated dependencies

## 0.16.10

### Patch Changes

- [#71056](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71056)
  [`eb723312de15`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eb723312de15) -
  Remove `platform.linking-platform.datasource-jira_issues` feature flag from editor.

## 0.16.9

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1
- Updated dependencies

## 0.16.8

### Patch Changes

- [#70612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70612)
  [`87457cd97d6b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87457cd97d6b) -
  Added a "datasource appearance" button to the toolbar and renamed an internal export.
- Updated dependencies

## 0.16.7

### Patch Changes

- Updated dependencies

## 0.16.6

### Patch Changes

- [#68535](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68535)
  [`9d9c89e4ff0c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9d9c89e4ff0c) -
  Implement smart-card actionOptions prop within editor and expose prop to editor and renderer
- Updated dependencies

## 0.16.5

### Patch Changes

- Updated dependencies

## 0.16.4

### Patch Changes

- [#67576](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67576)
  [`c03238aac8d2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c03238aac8d2) -
  Export some plugin types to allow fix the build type
- Updated dependencies

## 0.16.3

### Patch Changes

- [#66961](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66961)
  [`2e4913393f85`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2e4913393f85) -
  Add logic to prevent showing datasource edit button in toolbar if datasource does not support
  editing.
- Updated dependencies

## 0.16.2

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.16.1

### Patch Changes

- [#66364](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66364)
  [`212c782cb7a6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/212c782cb7a6) -
  No longer require `cardOptions` to be passed to the hyperlink plugin configuration, it exposes a
  new optional way to skip analytics via the prependToolbarButtons action.
- Updated dependencies

## 0.16.0

### Minor Changes

- [#65019](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65019)
  [`7290a6f8d435`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7290a6f8d435) -
  Adding lpLinkPicker param to card and hyperlink plugins instead of using feature flag

### Patch Changes

- Updated dependencies

## 0.15.3

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.15.2

### Patch Changes

- [#65152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65152)
  [`7b55d001d263`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7b55d001d263) -
  remove unused css and small refactor

## 0.15.1

### Patch Changes

- [#64861](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64861)
  [`87c2c502ea93`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87c2c502ea93) -
  [UX] scale icon size based on font size in discoverability overlay
- [#64817](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64817)
  [`afa680b9f6bb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/afa680b9f6bb) -
  change background color for active state of discoverability overlay to match color of smart link
  active state
- Updated dependencies

## 0.15.0

### Minor Changes

- [#64107](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64107)
  [`0372daafc639`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0372daafc639) -
  [ux] Refresh the inline card discoverability overlay design:

  - changed color, text size, font, padding, overlay behaviour

### Patch Changes

- Updated dependencies

## 0.14.25

### Patch Changes

- [#63612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63612)
  [`30f0f85d5af6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30f0f85d5af6) -
  Disable datasource table resize button when the component is nested inside another component.
- Updated dependencies

## 0.14.24

### Patch Changes

- [#63549](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63549)
  [`c2147cd56a94`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c2147cd56a94) -
  Fix inconsistency of discoverability pulse
- Updated dependencies

## 0.14.23

### Patch Changes

- [#63354](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63354)
  [`0b49755d1170`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0b49755d1170) -
  [ux] Include embed card frame as part of its width when frameStyle is set to "show" and show embed
  frame by default in renderer

## 0.14.22

### Patch Changes

- [#61458](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61458)
  [`f69cbc65f2ea`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f69cbc65f2ea) -
  Avoid mutating state directly

## 0.14.21

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update
- [#62149](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62149)
  [`f1c2b0309389`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f1c2b0309389) -
  Fix to bump up Jira Issues priority in the quick action menu list.
- Updated dependencies

## 0.14.20

### Patch Changes

- [#61628](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61628)
  [`c1b054119172`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1b054119172) -
  Fixed an issue where link deleteMethod attribute was set as unknown when changing a link to
  datasource table.

## 0.14.19

### Patch Changes

- [#60660](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60660)
  [`102ad9375609`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/102ad9375609) -
  Fixed an issue where link creationMethod attribute was set as unknown when inserting via
  datasource config modal.

## 0.14.18

### Patch Changes

- [#60441](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60441)
  [`13892b95e918`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/13892b95e918) -
  [ux] Refactoring of the inline card with awareness solution (behind a FF)

## 0.14.17

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808)
  [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) -
  ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE
- Updated dependencies

## 0.14.16

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246)
  [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) -
  ED-21371 Update adf-schema to 35.1.0
- Updated dependencies

## 0.14.15

### Patch Changes

- [#58798](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58798)
  [`8e489065dff2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8e489065dff2) -
  Workaround for inline overlay showing incorrectly on undo.

## 0.14.14

### Patch Changes

- Updated dependencies

## 0.14.13

### Patch Changes

- [#57192](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57192)
  [`cb7776f514cb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb7776f514cb) -
  Fix issue like table and assets editor plugin card not translated issue

## 0.14.12

### Patch Changes

- [#58979](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58979)
  [`e1db19a2208c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e1db19a2208c) -
  [ux] Passing isHovering prop to the SmartCard when user hovers on the "Change view" overlay
- Updated dependencies

## 0.14.11

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).
- [#58969](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58969)
  [`297598de20d6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/297598de20d6) -
  ED-20809: removes web driver project reference
- Updated dependencies

## 0.14.10

### Patch Changes

- [#58193](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58193)
  [`4bf69e3255f8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4bf69e3255f8) -
  NO-ISSUE Added the capability to override the default card type of inline when inserting links, so
  we can have Loom links convert to embed cards
- Updated dependencies

## 0.14.9

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763)
  [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) -
  update ADF schema
- Updated dependencies

## 0.14.8

### Patch Changes

- [#58076](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58076)
  [`e22c68b4b316`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e22c68b4b316) -
  Fix an overlay causing wrapped inline card to jump

## 0.14.7

### Patch Changes

- [#56898](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/56898)
  [`32d7fcd969d5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32d7fcd969d5) -
  Analytics even 'pulse viewed' is added to inline card with awareness (behind a FF)

## 0.14.6

### Patch Changes

- [#57368](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57368)
  [`d69503f13a52`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d69503f13a52) -
  [ux] Changed the datasource layout resize button will show only when editor is in "full-page" mode
- Updated dependencies

## 0.14.5

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790)
  [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) -
  ED-21266: Updated @atlaskit/adf-schema to 34.0.1
- Updated dependencies

## 0.14.4

### Patch Changes

- [#56625](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56625)
  [`1df300977e9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1df300977e9a) - [ux]
  Always show link icon when showing 'change view' overlay in editor. Do not show if the overlay
  will cover the whole link including the icon.

## 0.14.3

### Patch Changes

- [#43494](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43494)
  [`7c59a134595`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c59a134595) - [ux]
  Show inline card upgrade discoverability overlay on insertion. The functionality behind the inline
  switcher feature flag

## 0.14.2

### Patch Changes

- [#42839](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42839)
  [`7324375d4fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7324375d4fa) - [ux]
  Cleansup feature flag `prevent-popup-overflow` so that it is permanently enabled when
  `lp-link-picker` flag is enabled, improving the positioning of the link picker.

## 0.14.1

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

- Updated dependencies

## 0.14.0

### Minor Changes

- [#43139](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43139)
  [`633ac70ce16`](https://bitbucket.org/atlassian/atlassian-frontend/commits/633ac70ce16) - Removed
  floatingToolbarLinkSettingsButton feature flag

### Patch Changes

- Updated dependencies

## 0.13.6

### Patch Changes

- [#43035](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43035)
  [`705854f13b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/705854f13b3) - [ux]
  Show inline card overlay on selected (behind feature flag)
- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417)
  [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971
  Upgrade adf-schema package to ^34.0.0
- [#43496](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43496)
  [`290e75ca7f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/290e75ca7f2) - Fixes
  uncaught error when using arrow keys to move selection into inline card.
- Updated dependencies

## 0.13.5

### Patch Changes

- Updated dependencies

## 0.13.4

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379)
  [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763
  Upgrade ADF schema version to 33.2.3 for MBE nodes.
- [#43352](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43352)
  [`087515ab3ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/087515ab3ea) - [ux]
  Added on selection behaviour for inline link
- Updated dependencies

## 0.13.3

### Patch Changes

- [#43175](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43175)
  [`a72cac2bc28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a72cac2bc28) - [ux]
  Added a check for showLinkOverlay for hover/unhover scenarios

## 0.13.2

### Patch Changes

- [#42933](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42933)
  [`6a7848b6400`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a7848b6400) - Cleansup
  feature flag. Floating toolbar now always fires a viewed event when activated for links when the
  card plugin is enabled.
- Updated dependencies

## 0.13.1

### Patch Changes

- [#43078](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43078)
  [`088d6edebd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/088d6edebd4) - [ux]
  Passing the value of showUpgradeDiscoverability prop to toolbar component

## 0.13.0

### Minor Changes

- [#42692](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42692)
  [`755bedc2db1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/755bedc2db1) - [ux]
  Added functionality for Inline Card pulse that should surface only on the first inserted link of
  the day.

### Patch Changes

- Updated dependencies

## 0.12.2

### Patch Changes

- [#43004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43004)
  [`534feb3059b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/534feb3059b) - [ux]
  Update text for /assets slash command to add "(Beta)" suffix, and change Assets slash command icon
  slightly

## 0.12.1

### Patch Changes

- [#42995](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42995)
  [`a527682dee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a527682dee6) - add in
  missing dependencies for imported types

## 0.12.0

### Minor Changes

- [#42821](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42821)
  [`9ae7cc56578`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ae7cc56578) - [ux]
  Adds datasource edit button to blue links that can resolve into datasources

## 0.11.1

### Patch Changes

- [#42248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42248)
  [`c3ce5d9263f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3ce5d9263f) - Add
  inline card overlay component
- [#42848](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42848)
  [`f2f8428f703`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2f8428f703) - Abandons
  feature flag lp-link-picker-focus-trap as it was not successfully rolled out. Will re-introduce as
  platform feature flag as/when necessary.
- Updated dependencies

## 0.11.0

### Minor Changes

- [#42755](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42755)
  [`97f9fcba5a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/97f9fcba5a5) - [ux] Add
  a discovery pulse to smart link view switcher under certain conditions and behind a feature flag

### Patch Changes

- Updated dependencies

## 0.10.10

### Patch Changes

- [#42151](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42151)
  [`192b62f6d36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/192b62f6d36) - Cleans
  up editor feature flag 'lp-analytics-events-next'. Card plugin will now always dispatch link
  tracking events.

## 0.10.9

### Patch Changes

- [#42607](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42607)
  [`87e6390f290`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87e6390f290) - [ux]
  Added a DiscoveryPulse component that can be used for feature discovery based on local storage
  keys
- Updated dependencies

## 0.10.8

### Patch Changes

- [#42586](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42586)
  [`ed2a549e705`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed2a549e705) - ED-20177
  Use updated transaction when closing modal

## 0.10.7

### Patch Changes

- [#38725](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38725)
  [`0f145c04dbf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f145c04dbf) - [ux]
  Datasource columns now can be resizied
- [#38725](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38725)
  [`0f145c04dbf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f145c04dbf) - [ux]
  Datasource columns now can be resizied
- Updated dependencies

## 0.10.6

### Patch Changes

- [#42350](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42350)
  [`5c905e458da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c905e458da) - [ux]
  Fixed an issue where a blinking cursor would appear before a selected datasource node.

## 0.10.5

### Patch Changes

- [#42367](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42367)
  [`4f70009532a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f70009532a) - [ux]
  Refactored the inline card to be a functional component behind a FF

## 0.10.4

### Patch Changes

- Updated dependencies

## 0.10.3

### Patch Changes

- [#41985](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41985)
  [`75de7b64b6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/75de7b64b6d) -
  DatasourceEvents getDisplayedColumnCount now returns null instead of 0 if no properties exist
- Updated dependencies

## 0.10.2

### Patch Changes

- Updated dependencies

## 0.10.1

### Patch Changes

- [#41921](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41921)
  [`12d685a4b30`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12d685a4b30) - Removed
  chromeCursorHandlerFixedVersion feature flag

## 0.10.0

### Minor Changes

- [#41407](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41407)
  [`10708446bd2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10708446bd2) - [ux]
  Added support for passing of new optional url prop to JiraConfigModal

### Patch Changes

- Updated dependencies

## 0.9.2

### Patch Changes

- [#41405](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41405)
  [`6619f042a24`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6619f042a24) - [ux] Fix
  issue where any inline/block/embeds don't open up datasource modal with proper info

## 0.9.1

### Patch Changes

- [#40745](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40745)
  [`bba067a4049`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bba067a4049) -
  Datasource modal dialog now wrapped with datasource render failed analytics component
- Updated dependencies

## 0.9.0

### Minor Changes

- [#40876](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40876)
  [`c43a6a9cbd2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c43a6a9cbd2) - [ux]
  Adds copy button to datasource toolbar

## 0.8.7

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749)
  [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect
  yarn changeset to packages, upgrade adf-schema
- Updated dependencies

## 0.8.6

### Patch Changes

- Updated dependencies

## 0.8.5

### Patch Changes

- [#40786](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40786)
  [`898ac16a850`](https://bitbucket.org/atlassian/atlassian-frontend/commits/898ac16a850) - Add
  platform.linking-platform.datasource.show-jlol-basic-filters feature flag reference for usage in
  editor examples

## 0.8.4

### Patch Changes

- Updated dependencies

## 0.8.3

### Patch Changes

- Updated dependencies

## 0.8.2

### Patch Changes

- [#40614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40614)
  [`4e7058a65f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e7058a65f4) - Add
  eslint rule to ban React.FC and React.FunctionalComponent in editor. In most packages this is
  still a warning.
- [#40478](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40478)
  [`08c899663fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08c899663fa) - Add
  datasource failed analytic events to datasourceErrorBoundary
- Updated dependencies

## 0.8.1

### Patch Changes

- [#40539](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40539)
  [`ae7c1132c88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae7c1132c88) - Added
  analytics fix for undo/redo scenarious of link upgrade to a datasource
- [#40199](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40199)
  [`553b34b5fd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/553b34b5fd4) - Small
  analytics bug fixes relating to auto-linking on enter, legacy link picker, and unresolvable links.

## 0.8.0

### Minor Changes

- [#40408](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40408)
  [`e4721cc5a3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4721cc5a3f) - Make
  issue count clickable

### Patch Changes

- Updated dependencies

## 0.7.3

### Patch Changes

- Updated dependencies

## 0.7.2

### Patch Changes

- Updated dependencies

## 0.7.1

### Patch Changes

- [#40187](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40187)
  [`bab3ac9e64e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bab3ac9e64e) - Passing
  analytic events with attributes from link-datasource modal to editor.
- Updated dependencies

## 0.7.0

### Minor Changes

- [#39171](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39171)
  [`50b3bf73ed3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50b3bf73ed3) - [ux] Add
  edit datasource button to toolbar for cards which can resolve into datasources

### Patch Changes

- Updated dependencies

## 0.6.0

### Minor Changes

- [#39265](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39265)
  [`8b8a309cb62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b8a309cb62) - Added
  datasource analytic CRUD events

### Patch Changes

- Updated dependencies

## 0.5.11

### Patch Changes

- [#39984](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39984)
  [`37c62369dae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37c62369dae) - NO-ISSUE
  Import doc builder types from editor-common

## 0.5.10

### Patch Changes

- Updated dependencies

## 0.5.9

### Patch Changes

- [#39481](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39481)
  [`aeb5c9a01e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aeb5c9a01e8) - Delete
  adf-schema from AFE and rely on npm package for adf-schema
- [`4b4dcfe0bba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b4dcfe0bba) - Delete
  adf-schema, use published version

## 0.5.8

### Patch Changes

- [#39781](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39781)
  [`94ae084e345`](https://bitbucket.org/atlassian/atlassian-frontend/commits/94ae084e345) - Add
  `EditorAnalyticsContext` for editor datasource component

## 0.5.7

### Patch Changes

- [#39797](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39797)
  [`43bb8818f18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43bb8818f18) - Pasting
  a datasource now only requires a single undo to revert
- Updated dependencies

## 0.5.6

### Patch Changes

- [#39614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39614)
  [`d5c28c4c0df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d5c28c4c0df) - Updated
  jira issues quick insert menu description.
- Updated dependencies

## 0.5.5

### Patch Changes

- [#39647](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39647)
  [`7ff427bb457`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ff427bb457) - Add
  datasources to macro menu categories

## 0.5.4

### Patch Changes

- [#39612](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39612)
  [`dfb663969a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfb663969a0) -
  ED-19820: Fix for table scroll when insert media node when extended-resize-experience is off

## 0.5.3

### Patch Changes

- [#39460](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39460)
  [`882e4e88358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/882e4e88358) - Add
  playwright tests and add test ids to find elements

## 0.5.2

### Patch Changes

- [#39327](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39327)
  [`386b8378aeb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/386b8378aeb) -
  Datasource ADF no longer included when feature flag call from canRenderDatasource returns false

## 0.5.1

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- [#39325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39325)
  [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) - Updating
  all plugins with minor version to correct issue with semver.

### Patch Changes

- Updated dependencies

## 0.4.9

### Patch Changes

- [#39010](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39010)
  [`8467bdcdf4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8467bdcdf4f) - Removing
  `dependencies` prop from PluginInjectionAPI and changing signature of `NextEditorPlugin`.

  Previously a `NextEditorPlugin` would be consumed as so:

  ```ts
  const plugin: NextEditorPlugin< ... > = (config, api) => {
    // Can use api like so:
    api.dependencies.core.actions.execute( ... )
    return { ... }
  }
  ```

  Now these have become named parameters like so and the `pluginInjectionAPI` is used without the
  `dependencies` prop:

  ```ts
  const plugin: NextEditorPlugin< ... > = ({ config, api }) => {
    // Can use api like so:
    api.core.actions.execute( ... )
    return { ... }
  }
  ```

- Updated dependencies

## 0.4.8

### Patch Changes

- [#39177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39177)
  [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added
  atlaskit docs to all existing plugins.

## 0.4.7

### Patch Changes

- [#39036](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39036)
  [`9c86163d326`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c86163d326) - [ux]
  Adds ability to edit Assets datasource modal from inserted table

## 0.4.6

### Patch Changes

- [#38976](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38976)
  [`33cb07de05f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33cb07de05f) - change
  adf-schema to fixed versioning

## 0.4.5

### Patch Changes

- Updated dependencies

## 0.4.4

### Patch Changes

- Updated dependencies

## 0.4.3

### Patch Changes

- [#37887](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37887)
  [`bdb69158e0a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdb69158e0a) -
  [ED-13910] Bump ProseMirror libraries to match prosemirror-view@1.31.6 dependencies
- Updated dependencies

## 0.4.2

### Patch Changes

- Updated dependencies

## 0.4.1

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [#37644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37644)
  [`b9a083dc04d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9a083dc04d) - [ux]
  Adds error boundaries specific to datasource in editor and renderer. Fallback to unsupported block
  if no url or inline if url

## 0.3.9

### Patch Changes

- Updated dependencies

## 0.3.8

### Patch Changes

- Updated dependencies

## 0.3.7

### Patch Changes

- [#37702](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37702)
  [`31405891e32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31405891e32) - Extract
  editor disabled plugin as separate package.
- Updated dependencies

## 0.3.6

### Patch Changes

- [#37984](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37984)
  [`fd24b65bb62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd24b65bb62) - Fix
  table width bug when layout is undefined for datasource.

## 0.3.5

### Patch Changes

- [#37027](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37027)
  [`f9cdc991f20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9cdc991f20) - Updates
  analytics to better support datasources
- Updated dependencies

## 0.3.4

### Patch Changes

- Updated dependencies

## 0.3.3

### Patch Changes

- [#37505](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37505)
  [`02d1ab1d57d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02d1ab1d57d) - Improve
  DnD Experience in Datasource Table view

## 0.3.2

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- [#37785](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37785)
  [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) -
  [ED-19233] Import prosemirror libraries from internal facade package

## 0.3.0

### Minor Changes

- [#36823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36823)
  [`632edbf1930`](https://bitbucket.org/atlassian/atlassian-frontend/commits/632edbf1930) - Updates
  card plugin floating toolbar to fire an analytic event when viewed.

## 0.2.5

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- [#37357](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37357)
  [`6255c2ad1c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6255c2ad1c9) - [ux]
  Adds ability to open Assets datasource dialog using the slash command in the editor, behind a
  feature flag

## 0.2.3

### Patch Changes

- [#36875](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36875)
  [`e86c43db633`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e86c43db633) - Updates
  card plugin to skip finding changed links for analytics for transactions with TableSortStep

## 0.2.2

### Patch Changes

- [#37340](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37340)
  [`b9355830504`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9355830504) - Opt out
  of peer dependency enforcement

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#36750](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36750)
  [`6bacee18c2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6bacee18c2d) - [ux] Add
  new allowDatasource prop for enabling datasource in editor and add inlineCard fallback render for
  blockCard with datasource

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- [#36757](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36757)
  [`3fb20c4aeba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb20c4aeba) - Add
  postinstall check to enforce internal peer dependencies

## 0.1.1

### Patch Changes

- Updated dependencies
