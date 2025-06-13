# @atlaskit/editor-statsig-tmp

## 7.0.0

### Major Changes

- [#170188](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/170188)
  [`c762dff80948d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c762dff80948d) -
  [EDITOR-787] Removed retry experiment related code

## 6.2.0

### Minor Changes

- [#166327](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166327)
  [`56ba43df67f02`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/56ba43df67f02) -
  ED-28157 implment reduced drop target logic
- [#168590](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168590)
  [`e9250f202882e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e9250f202882e) -
  Added experiment to defer shadow calculations until node is visible

## 6.1.0

### Minor Changes

- [#168742](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168742)
  [`43b55fe50be89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/43b55fe50be89) -
  Add experiment to show no cursor on initial edit page

## 6.0.0

### Major Changes

- [#166402](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166402)
  [`86b124543d340`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/86b124543d340) -
  NO-ISSUE: Convert from experiment (editor_ai_in_editor_streaming) to feature gate
  (platform_editor_ai_in_editor_streaming)

### Minor Changes

- [#167123](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167123)
  [`8baa50249f460`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8baa50249f460) -
  fix: stable class name for EditorView.dom

## 5.14.1

### Patch Changes

- [#167332](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167332)
  [`5d312dcfaa21a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d312dcfaa21a) -
  Fix expValEquals should work when FeatureGate client is not initialised

## 5.14.0

### Minor Changes

- [#167295](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167295)
  [`6c94765105520`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6c94765105520) -
  [https://product-fabric.atlassian.net/browse/ED-28212](ED-28212) - the `validNode()` function from
  @atlaskit/editor-core package will use memoization

## 5.13.0

### Minor Changes

- [#161626](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161626)
  [`a614421730437`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a614421730437) -
  [ux] EDITOR-769: Implement first phase of new AI Palette redesigns for Preview modal behind fg
  platform_editor_new_ai_palette

## 5.12.0

### Minor Changes

- [#165835](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165835)
  [`b7143f7822214`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b7143f7822214) -
  Deprecate editorExperiments in favour of expValEquals

## 5.11.1

### Patch Changes

- [#165694](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165694)
  [`2e1b7ff8a2e49`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2e1b7ff8a2e49) -
  refactor: align expValEquals and expValEqualsNoExposure to jira and confluence APIs

## 5.11.0

### Minor Changes

- [#165562](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165562)
  [`59af663a32c9a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/59af663a32c9a) -
  Reduce block control re-renders under experiment

## 5.10.0

### Minor Changes

- [#163546](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163546)
  [`d3faab1b963ad`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d3faab1b963ad) -
  [ux] ED-28147 smart link support for cmd/ctrl click to open in new tab

## 5.9.0

### Minor Changes

- [#164680](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164680)
  [`6e5063967bda1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e5063967bda1) -
  EDITOR-759 Put improve writing on full page using ADF streaming behind experiment.

## 5.8.0

### Minor Changes

- [#163510](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163510)
  [`82ae25a1f9aaa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/82ae25a1f9aaa) -
  Adds expValEquals and expValEqualsNoExposure methods

## 5.7.0

### Minor Changes

- [#163573](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163573)
  [`21e93839ec382`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21e93839ec382) -
  Convert platform_editor_controls_toolbar_pinning fg to
  platform_editor_controls_toolbar_pinning_exp experiment

## 5.6.0

### Minor Changes

- [#163183](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163183)
  [`90c987607095d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/90c987607095d) -
  Disable lazy node view behind an experiment

## 5.5.0

### Minor Changes

- [#154562](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154562)
  [`9a3495cb72638`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9a3495cb72638) -
  Support AnalyticsStep filtering for collab

## 5.4.0

### Minor Changes

- [#161893](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161893)
  [`432e1c30874a0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/432e1c30874a0) -
  controls performance gating switch to experiment

## 5.3.0

### Minor Changes

- [#161914](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161914)
  [`b1a7ef0ae8d44`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b1a7ef0ae8d44) -
  Switches text formatting options optimisation from FG to Experiment flag

## 5.2.0

### Minor Changes

- [#161266](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161266)
  [`6d9c690526ff6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d9c690526ff6) -
  Added experiment for smart links open button

## 5.1.0

### Minor Changes

- [#159894](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159894)
  [`98f3c43ca93c5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/98f3c43ca93c5) -
  Avoid unnecessary reflows in the width plugin.

## 5.0.0

### Major Changes

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

### Minor Changes

- [#160575](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160575)
  [`c340cf0e2d6c2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c340cf0e2d6c2) -
  Expose emoji provider promise to initialise in the toolbar earlier.
- [#156919](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156919)
  [`379f5c27f4939`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/379f5c27f4939) -
  delay table sticky headers until table is in viewport

## 4.25.0

### Minor Changes

- [#159149](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159149)
  [`ba8a35f91cb65`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ba8a35f91cb65) -
  [ux] EDITOR-717: Implement MVP of in-editor AI response streaming. This is behind the
  editor_ai_in_editor_streaming Statsig experiment.

## 4.24.0

### Minor Changes

- [#158351](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158351)
  [`33c33e91149a1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/33c33e91149a1) -
  Cleaned up platform_editor_controls_shadow

## 4.23.0

### Minor Changes

- [#151439](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/151439)
  [`a5631e9713381`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a5631e9713381) -
  [EDITOR-724] Editor ai experiment set up + spike feature for quickstart command
- [#156743](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156743)
  [`1aa78352ee4a9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1aa78352ee4a9) -
  Add platform_editor_breakout_resizing experiment

## 4.22.0

### Minor Changes

- [#154858](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154858)
  [`bf96267428ccd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bf96267428ccd) -
  Adds experiment to not render children of expand element until it gets expanded

## 4.21.1

### Patch Changes

- [#153577](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153577)
  [`2d3375a7a48b1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2d3375a7a48b1) -
  [EDF-2259] Update usage of next media plugin behind fg 'platform_editor_ai_next_media_plugin'
  instead of experiment 'platform_editor_markdown_next_media_plugin_exp'

## 4.21.0

### Minor Changes

- [#153704](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153704)
  [`edb0da26267e6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/edb0da26267e6) -
  EDITOR-736 Put agent powered free generate in comment behind experiment.

## 4.20.0

### Minor Changes

- [#153675](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153675)
  [`8e3fe74a1e3ed`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e3fe74a1e3ed) -
  [ux] [EDITOR-723] Editor AI users use Rovo General Knowledge for free generate

## 4.19.0

### Minor Changes

- [#150067](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150067)
  [`f625a2dfb3214`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f625a2dfb3214) -
  NO-ISSUE: Pass in values into multivariate configs so that it can be picked up by the experiment
  picker in Statlas

## 4.18.0

### Minor Changes

- [#149914](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149914)
  [`069cd0cee4bdd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/069cd0cee4bdd) -
  migrate editor core styles under new experiment to prepare optimization

## 4.17.0

### Minor Changes

- [#150957](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150957)
  [`ae21450efe2f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ae21450efe2f0) -
  [ux] [EDITOR-697] Add remove retry experiment, update tests and cleanup eslint rules as found

## 4.16.0

### Minor Changes

- [#149327](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149327)
  [`f1ba918778e20`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1ba918778e20) -
  EDITOR-676: Add editor_ai_contextual_selection_toolbar_button experiment.

### Patch Changes

- [#148798](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148798)
  [`8112e98809756`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8112e98809756) -
  [No Issue] Clean up virtualization feature flag

## 4.15.0

### Minor Changes

- [#147400](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/147400)
  [`800ff50276ed7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/800ff50276ed7) -
  Clean up experiment platform_editor_nested_non_bodied_macros

## 4.14.1

### Patch Changes

- [#145233](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145233)
  [`bc70a53def230`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bc70a53def230) -
  Revert nullability checks on experiments package.

## 4.14.0

### Minor Changes

- [#145086](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145086)
  [`974da2c11753a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/974da2c11753a) -
  Reduced dependency list of analytics callback in renderer

## 4.13.0

### Minor Changes

- [#142156](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142156)
  [`9e2d56551d2cc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9e2d56551d2cc) -
  Remove WithPluginState from Table via platform_editor_usesharedpluginstateselector

## 4.12.0

### Minor Changes

- [#142955](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142955)
  [`4eda8a13e23ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4eda8a13e23ba) -
  [https://product-fabric.atlassian.net/browse/ED-27627](ED-27627) - implement editor
  `featureFlagsPlugin` options creation inside `@atlassian/confluence-presets` package

### Patch Changes

- [#139698](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139698)
  [`cf8ea53ed0264`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cf8ea53ed0264) -
  Clean-up nested expand feature gate
- Updated dependencies

## 4.11.0

### Minor Changes

- [#142717](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142717)
  [`d9c2b4afdc497`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d9c2b4afdc497) -
  Add a null check for experiment config default value

## 4.10.0

### Minor Changes

- [#141495](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141495)
  [`b336d6ee33b41`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b336d6ee33b41) -
  [EDFITOR-306] Cleaned up old inline suggestion experiment, prepping for experiment v2

## 4.9.0

### Minor Changes

- [#141582](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141582)
  [`60370566f23be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/60370566f23be) -
  [ux] EDITOR-604 Introduce alternative confidence score for nudges. Allow to configure various
  cutoff values.

## 4.8.0

### Minor Changes

- [#140813](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140813)
  [`c4756a5c1a4ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c4756a5c1a4ae) -
  Migrating offline editing feature gates to a new experiment "platform_editor_offline_editing_web"

## 4.7.0

### Minor Changes

- [#140996](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140996)
  [`f24f59a665aaf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f24f59a665aaf) -
  Added a temporary experiment to aid editor controls experiment set up

## 4.6.3

### Patch Changes

- [#133479](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133479)
  [`57fe747245f32`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57fe747245f32) -
  Clean up experiment

## 4.6.2

### Patch Changes

- [#133802](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133802)
  [`f523489c8b68a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f523489c8b68a) -
  [ux] ED-27217 Clean up experiment platform_editor_element_drag_and_drop_nested

## 4.6.1

### Patch Changes

- [#134378](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134378)
  [`210a48c778086`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/210a48c778086) -
  EDITOR-546 Cleaned up platform_editor_cmd_a_progressively_select_nodes to revert to control
  behaviour.

## 4.6.0

### Minor Changes

- [#134562](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134562)
  [`f008c541bb06b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f008c541bb06b) -
  [ux] EDF-2645 Introduce an experiment to cut off low-quality nudges.

## 4.5.0

### Minor Changes

- [#127912](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127912)
  [`d3364031ea983`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d3364031ea983) -
  [NO-ISSUE] Cleaning up remaining pass experiments + follow ups

## 4.4.3

### Patch Changes

- [#132261](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132261)
  [`a8fe96525eb2c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a8fe96525eb2c) -
  ED-24801 Clean up platform_editor_insert_menu_in_right_rail

## 4.4.2

### Patch Changes

- [#133358](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133358)
  [`d2fa1a1a5d369`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d2fa1a1a5d369) -
  [ED-24873] clean up platform_editor_element_level_templates

## 4.4.1

### Patch Changes

- [#132166](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132166)
  [`e1c6dcf47a8a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e1c6dcf47a8a2) -
  ED-24538 Clean up platform_editor_basic_text_transformations

## 4.4.0

### Minor Changes

- [#131059](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131059)
  [`dce67fd9ee5e2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dce67fd9ee5e2) -
  [ux] ED-26802 tidying contextual formatting experiment

### Patch Changes

- [#131375](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131375)
  [`31ca9bdace9ea`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31ca9bdace9ea) -
  Add null check in the case that an experiment is not correctly defined

## 4.3.0

### Minor Changes

- [#128664](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128664)
  [`abca3266336d9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/abca3266336d9) -
  [ED-23250] Remove form element from MediaFromUrl and consolidate experiments and feature flags in
  prepartion for jira release

## 4.2.0

### Minor Changes

- [#130262](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130262)
  [`236c73af67c7b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/236c73af67c7b) -
  [ED-24873] This change is cleaning up code from the element templates experiment
  `platform_editor_element_level_templates`.

## 4.1.2

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- [#127516](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127516)
  [`f4f3e822fcbd8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f4f3e822fcbd8) -
  updated default value in config for editor virt experiment

## 4.1.0

### Minor Changes

- [#125372](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/125372)
  [`333d2a5c64229`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/333d2a5c64229) -
  [EDF-2225] Cleanup platform_editor_ai_advanced_prompts Statsig experiment

### Patch Changes

- [#115815](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/115815)
  [`ad7c517ed3b47`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ad7c517ed3b47) -
  ED-26661 added experiement enables single column layout

## 4.0.0

### Major Changes

- [#126060](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126060)
  [`fe137e1387076`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fe137e1387076) -
  Clean up Action Items experiment in Editor. Overriding the Quick Insert Action description and
  Task Item placeholder will now always take effect.

## 3.6.1

### Patch Changes

- [#123036](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123036)
  [`08a3386cf1088`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08a3386cf1088) -
  Editor virtualization experiment adjustment, fixes

## 3.6.0

### Minor Changes

- [#125840](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/125840)
  [`070cc7406b298`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/070cc7406b298) -
  EDF-2577: Register editor_text_highlight_orange_to_yellow experiment in tmp-editor-statsig
  experiments config

## 3.5.0

### Minor Changes

- [#124688](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124688)
  [`9b1137bda6f87`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9b1137bda6f87) -
  [ux] ED-25486 Updates cmd+a behaviour to progressively select nodes behind
  platform_editor_cmd_a_progressively_select_nodes experiment.

## 3.4.0

### Minor Changes

- [#119706](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119706)
  [`42fd258ba482e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/42fd258ba482e) -
  ED-26704: enables editor node virtualization experiment

## 3.3.0

### Minor Changes

- [#120426](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120426)
  [`1fc7b1519dbcf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1fc7b1519dbcf) -
  Uses a separate FF for the new QuickInsert and Right rail to split them from the other Editor
  Controls features.

## 3.2.0

### Minor Changes

- [#118114](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118114)
  [`21440675d09b2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21440675d09b2) -
  [EDF=2455] Added experiment and got rid of feature gate

## 3.1.0

### Minor Changes

- [#116752](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116752)
  [`7e889798e0963`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7e889798e0963) -
  EDF-2276 Clean up jira context experiment

### Patch Changes

- Updated dependencies

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

## 2.47.0

### Minor Changes

- [#115595](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115595)
  [`8eafb76f48873`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8eafb76f48873) -
  set up nested non-bodied macros experiment

## 2.46.0

### Minor Changes

- [#111692](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111692)
  [`e656e48ee1932`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e656e48ee1932) -
  ED-26473 Adding new experiment for platform_editor_node_nesting_expansion_non_macros

## 2.45.0

### Minor Changes

- [#112096](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112096)
  [`5d95afdd358ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d95afdd358ac) -
  [ux] Creates a package for new QuickInsert and Right Rail UI and adds it under a FF

## 2.44.0

### Minor Changes

- [#111240](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111240)
  [`de6e6869aa62d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de6e6869aa62d) -
  [ux] EDF-2393: Cleanup platform_editor_ai_1p_smart_link_unfurl_in_prompt experiment code
  references and autoformatting plugin integration in confluence

## 2.43.0

### Minor Changes

- [#110672](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110672)
  [`29afa832aa7c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/29afa832aa7c9) -
  Remove a stale experiment

## 2.42.1

### Patch Changes

- [#111057](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111057)
  [`a87f76f559c65`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a87f76f559c65) -
  EDF-2382 Cleaned up platform_editor_ai_change_tone_floating_toolbar, defaulted to control
  behaviour.

## 2.42.0

### Minor Changes

- [#107782](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107782)
  [`cccc7a8347929`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cccc7a8347929) -
  [ux] ED-26378 Remove editor_nest_media_and_codeblock_in_quotes_jira and
  nestMediaAndCodeblockInQuote

## 2.41.0

### Minor Changes

- [#105835](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105835)
  [`e36d012fbbce1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e36d012fbbce1) -
  [ux] EDF-2053 Clean up mentions experiment

## 2.40.1

### Patch Changes

- [#105419](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105419)
  [`d9cef763b7140`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d9cef763b7140) -
  EDF-2255 Configure statsig for content read

## 2.40.0

### Minor Changes

- [#104916](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104916)
  [`372f52e24283d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/372f52e24283d) -
  [ux] EDF-2238 Implemented basic edit response capability in Preview screen.

## 2.39.0

### Minor Changes

- [#105009](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105009)
  [`a4039ebf7ed11`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a4039ebf7ed11) -
  [ux] Implement variant 2 cohorts experience for platform_editor_contextual_formatting_toolbar_v2
  experiment

## 2.38.0

### Minor Changes

- [#103433](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103433)
  [`2ea2995145fa4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2ea2995145fa4) -
  [ux] [https://product-fabric.atlassian.net/browse/EDF-2219] - add Advanced Prompt option into the
  Editor AI Command Palette

## 2.37.0

### Minor Changes

- [#103091](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103091)
  [`eeb701b917e68`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eeb701b917e68) -
  EDF-1645: Clean up Draft with AI prefill prompts

## 2.36.0

### Minor Changes

- [#103042](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103042)
  [`a3bcf71666e0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3bcf71666e0d) -
  Replace platform_editor_table_use_shared_state_hook with FG and fix remaining selection bugs
  caused by lack of re-renders

## 2.35.0

### Minor Changes

- [#102564](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102564)
  [`ddd5f55e9bef4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ddd5f55e9bef4) -
  Add multi-select experiment

## 2.34.0

### Minor Changes

- [#100411](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100411)
  [`14499ab145534`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14499ab145534) -
  [ux] Introduces advanced code block as per:
  https://hello.atlassian.net/wiki/spaces/EDITOR/pages/4632293323/Editor+RFC+063+Advanced+code+blocks.
  This can be added to an existing editor preset to enrich the code block experience with syntax
  highlighting and can be extended for other features via CodeMirror extensions (ie. autocompletion,
  code folding etc.).
- [#102045](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102045)
  [`44f96aff22dd9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/44f96aff22dd9) -
  [ED-26179] clean up platform_editor_elements_dnd_nested_table

## 2.33.1

### Patch Changes

- [#102069](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102069)
  [`3d4c9e1a85d9c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d4c9e1a85d9c) -
  Clean up platform_editor_dnd_input_performance_optimisation experiment

## 2.33.0

### Minor Changes

- [#101369](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101369)
  [`afb7fc78b78c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/afb7fc78b78c0) -
  Cleaning all related proactive ai spelling and grammar fetaure gates and experiments

## 2.32.1

### Patch Changes

- [#100459](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100459)
  [`105137587329b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/105137587329b) -
  EDF-1803 Cleaned up platform_editor_ai_refine_response_button

## 2.32.0

### Minor Changes

- [#100022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100022)
  [`0010534ce6037`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0010534ce6037) -
  [https://product-fabric.atlassian.net/browse/EDF-2058](EDF-2058) - cleanup
  platform_editor_ai_knowledge_from_current_page Statsig experiment

## 2.31.0

### Minor Changes

- [#99209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99209)
  [`8785c6901d958`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8785c6901d958) -
  [https://product-fabric.atlassian.net/browse/EDF-1802](EDF-1802) - remove
  platform_editor_ai_response_history Statsig experiment

## 2.30.0

### Minor Changes

- [#97986](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97986)
  [`7bb3014dc6f64`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7bb3014dc6f64) -
  [https://product-fabric.atlassian.net/browse/EDF-1801](EDF-1801) - cleanup
  platform_editor_ai_prompt_link_picker Statsig experiment

## 2.29.0

### Minor Changes

- [#180231](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180231)
  [`4dbcc3d03b632`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4dbcc3d03b632) -
  [https://product-fabric.atlassian.net/browse/EDF-1844](EDF-1844) - cleanup
  platform_editor_ai_facepile Statsig experiment

## 2.28.0

### Minor Changes

- [#180067](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180067)
  [`fdee6c449ca83`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fdee6c449ca83) -
  [ux] Adding block quote as an option to the text formatting menu for full page editors

## 2.27.1

### Patch Changes

- [#179266](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/179266)
  [`19a796ab55276`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19a796ab55276) -
  EDF-2116 - Cleanup FG platform_editor_ai_release_additional_prompts and experiment
  platform_editor_ai_additional_editor_prompts

## 2.27.0

### Minor Changes

- [#177496](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177496)
  [`dfb96360f8958`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dfb96360f8958) -
  Remove optimise-apply-dnd experiment

## 2.26.1

### Patch Changes

- [#172505](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/172505)
  [`3816509a67f5c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3816509a67f5c) -
  EDF-2055 Added platform_editor_ai_knowledge_from_current_page experiment

## 2.26.0

### Minor Changes

- [#175572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175572)
  [`40f53d4bf8e1a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40f53d4bf8e1a) -
  [ux] EDF-1636: Remove 1p placeholder hints experiment platform_editor_ai_1p_placeholder_hints
  making control the default experience again

## 2.25.0

### Minor Changes

- [#169428](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169428)
  [`ded743b539788`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ded743b539788) -
  [ux] ED-25865 auto expand selection to include inline node

## 2.24.0

### Minor Changes

- [#176242](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176242)
  [`15cf55160272d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15cf55160272d) -
  [ux] EDF-2088 - Release additional prompts under FG platform_editor_ai_release_additional_prompts,
  release make shorter, rephrase, convert to table and convert to list, don't release add
  introduction and add conclusion

## 2.23.0

### Minor Changes

- [#173124](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173124)
  [`58ca6c04a3498`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/58ca6c04a3498) -
  [https://product-fabric.atlassian.net/browse/EDF-2050](EDF-2050) - add @mention support into the
  Editor AI Command Palette

## 2.22.0

### Minor Changes

- [#170373](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170373)
  [`999f7f7bcd35c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/999f7f7bcd35c) -
  [https://product-fabric.atlassian.net/browse/EDF-1798](EDF-1798) - the Link Picker was added into
  the Editor AI Command Palette prompts

## 2.21.1

### Patch Changes

- [#168879](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168879)
  [`b6dd0c637ded9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6dd0c637ded9) -
  [EDF-1903] Add platform_editor_ai_unsplash_page_header experiment

## 2.21.0

### Minor Changes

- [#166948](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166948)
  [`0ab57e453a9f5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0ab57e453a9f5) -
  EDF-1639: Add prefillable prompts for Confluence pages so that when a user selects such prompt, it
  will prefill their AI input field. This is an experiment under platform_editor_ai_draft_with_ai.

## 2.20.1

### Patch Changes

- [#167651](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167651)
  [`5149d4fb1b488`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5149d4fb1b488) -
  Removed experiment editor*ai*-\_proactive_ai_spelling_and_grammar and defaulted the S+G config to
  on

## 2.20.0

### Minor Changes

- [#168098](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168098)
  [`fb613ef23788c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fb613ef23788c) -
  [https://product-fabric.atlassian.net/browse/EDF-1995](EDF-1995) - clean up
  `platform_editor_ai_command_palette_post_ga` Statsig experiment

## 2.19.0

### Minor Changes

- [#160519](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160519)
  [`9a7add3829ded`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a7add3829ded) -
  [ux] EDF-1866: Add Smart Link unfurling (auto smart link conversion for shorthand ticket
  references like "EDF-123") behind experiment platform_editor_ai_1p_smart_link_unfurl_in_prompt
  into Editor AI prompt field (Prompt Editor)

## 2.18.0

### Minor Changes

- [#165866](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165866)
  [`e1ea80ff13502`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e1ea80ff13502) -
  EDF-1949 - Switch experiment platform_editor_live_pages_ai_definitions to FG
  platform_editor_ai_definitions_live_page_view_mode

## 2.17.0

### Minor Changes

- [#165097](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165097)
  [`0bca145c96b65`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0bca145c96b65) -
  [ux] Adds test styles options to the Selection toolbar under Contextual toolbar experiment

## 2.16.0

### Minor Changes

- [#163468](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163468)
  [`dd36c12324efd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dd36c12324efd) -
  JIV-19284 Allow setting task placeholder and quick insert action description for Editor tasks and
  decisions plugin

## 2.15.0

### Minor Changes

- [#164606](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/164606)
  [`d5fd875cd67f7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d5fd875cd67f7) -
  remove platform_editor_empty_line_prompt experiment

## 2.14.0

### Minor Changes

- [#161296](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161296)
  [`9a6292ab637fa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a6292ab637fa) -
  [ED-25521] Add experiment based gating to the insertion logic for nested tables, so we only allow
  nesting tables one level deep when the experiment is active

## 2.13.1

### Patch Changes

- [#162401](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162401)
  [`da610ad81acb7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da610ad81acb7) -
  EDF-1910 Added platform_editor_ai_response_history

## 2.13.0

### Minor Changes

- [#163217](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163217)
  [`d2d5c286e4e86`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d2d5c286e4e86) -
  [ux] EDF-1845 Remove floating toolbar experiment (platform_editor_ai_floating_toolbar_v2). Change
  the behaviour to use the trailing variant of the experiment.

## 2.12.2

### Patch Changes

- [#162710](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162710)
  [`a661bece58fb8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a661bece58fb8) -
  [ux] EDF-1864 Updates the improve writing button from the floating toolbar to use the change tone
  to professional prompt. Added platform_editor_ai_change_tone_floating_toolbar experiment.

## 2.12.1

### Patch Changes

- [#160594](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160594)
  [`493429610a122`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/493429610a122) -
  Updated the proactive ai visual formatting experiment gate to use a new gate which is scoped to
  the tenantId. This will no longer be controlled via an experiment.

## 2.12.0

### Minor Changes

- [`1e479826df45b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1e479826df45b) -
  [EDF-1804](https://product-fabric.atlassian.net/browse/EDF-1804)
  [EDF-1805](https://product-fabric.atlassian.net/browse/EDF-1805) - add Refine button to the Editor
  AI Command Palette

### Patch Changes

- [#159628](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159628)
  [`38ed9d4438ed0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/38ed9d4438ed0) -
  EDF-1840 Set up statsig experiment

## 2.11.0

### Minor Changes

- [#159227](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159227)
  [`a82a45030b4c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a82a45030b4c3) -
  [EDF-1716] Removed getExperimentCohort from @atlassian/generative-ai-modal/utils/experiments

## 2.10.0

### Minor Changes

- [#157006](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157006)
  [`666884d7c9e24`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/666884d7c9e24) -
  ED-25494 experiment on comment on inline node spotlight
- [#157011](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157011)
  [`dcdfd1e83ce5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcdfd1e83ce5a) -
  change ugc typography experiment to a gate

## 2.9.0

### Minor Changes

- [#154829](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154829)
  [`0646280e9ab18`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0646280e9ab18) -
  [EDF-1176](https://product-fabric.atlassian.net/browse/EDF-1176) - add pulse EP effect to AI
  button in Editor floating toolbar

## 2.8.0

### Minor Changes

- [#155195](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155195)
  [`73c97aeb48ea9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/73c97aeb48ea9) -
  Add platform_editor_support_table_in_comment_jira experiment to control table drag and drop and
  table scaling features to support new table features in jira

## 2.7.0

### Minor Changes

- [#154252](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154252)
  [`00de4abde0cbf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/00de4abde0cbf) -
  EDF-1769 - [Prepare Experiment] Live Pages AI definitions

## 2.6.0

### Minor Changes

- [#153024](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153024)
  [`0200c770ddcb2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0200c770ddcb2) -
  [ux] Add multiple column layout via quick insert

## 2.5.0

### Minor Changes

- [#152407](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152407)
  [`d0365c4e1ce72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0365c4e1ce72) -
  [ux] EDF-1630: Implement 1p prompt placeholder variations experiment behind
  platform_editor_ai_1p_placeholder_hints and prompt input statistic tracking behind
  platform_editor_ai_prompt_input_statistics
- [#152434](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152434)
  [`ab77fcc060a4b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ab77fcc060a4b) -
  [EDF-1583](https://product-fabric.atlassian.net/browse/EDF-1583) - cleanup
  platform_editor_ai_command_palate_improvement Statsig experiment

## 2.4.0

### Minor Changes

- [#152099](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152099)
  [`e7d3d5459e447`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e7d3d5459e447) -
  Add optimised-apply-dnd
- [#151154](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151154)
  [`c10924372260d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c10924372260d) -
  minor bump to ensure previously added experiments are picked up by products

## 2.3.2

### Patch Changes

- [#151153](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151153)
  [`b08ca9cb58898`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b08ca9cb58898) -
  Added a new proactive ai prosemirror plugin to the editor ai plugin. This plugin will be used for
  generating recommendations using AI and providing them to the user for inserting

## 2.3.1

### Patch Changes

- [#150384](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150384)
  [`d3dad252dbe46`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d3dad252dbe46) -
  [EDF-1177](https://product-fabric.atlassian.net/browse/EDF-1177) - add pulse effect support into
  editor floating toolbar

## 2.3.0

### Minor Changes

- [#149558](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149558)
  [`5e8619ac0f6e4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e8619ac0f6e4) -
  [ux] [ED-25085] Migrate typography \

  editor-plugin-media:

  - replace caption placeholder span with button
  - replace x between width and height pixel entry with symbol × \

  tmp-editor-statsig:

  - Add experiment `platform_editor_typography_migration_ugc`

## 2.2.1

### Patch Changes

- [#149419](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149419)
  [`9c2e5e1e4cdc9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9c2e5e1e4cdc9) -
  [ux] Update Floating toolbar to new UX designs

## 2.2.0

### Minor Changes

- [#147660](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147660)
  [`a407a8fbc874b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a407a8fbc874b) -
  ED-24365 Support commenting inside bodied extension content in the Renderer

## 2.1.15

### Patch Changes

- [#147137](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147137)
  [`339de234bcb4c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/339de234bcb4c) -
  [EDF-1508] Initial spike for Multi Prompt experiment

## 2.1.14

### Patch Changes

- [#146417](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146417)
  [`4302239b19be5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4302239b19be5) -
  Migrate table useSharedStateHook FF from LD to Statsig experiment.

## 2.1.13

### Patch Changes

- [#144888](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144888)
  [`ac1408cf343b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ac1408cf343b5) -
  [ux] EDF-1569 Removed Rovo footer from agents screen, behind
  platform_editor_ai_command_palette_post_ga experiment. Added experiment to editor config.

## 2.1.12

### Patch Changes

- [#139038](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139038)
  [`86a6dad9fb62e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/86a6dad9fb62e) -
  [ux] Enables Table sticky scrollbar in Renderer under an experiment FF.
- [#141778](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141778)
  [`1c6f578277694`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c6f578277694) -
  ED-24870 & ED-24864 - Add the logic to gate the nested media in quotes functionality behind the
  nest-media-and-codeblock-in-quote experiment. Also adjust the logic so the nested expands are now
  behind the nested-expand-in-expand experiment.

## 2.1.11

### Patch Changes

- [#140707](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140707)
  [`972fb840acf35`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/972fb840acf35) -
  Switch from fg to experiment for media-from-url

## 2.1.10

### Patch Changes

- [#138791](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138791)
  [`80669e45a30e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/80669e45a30e0) -
  EDF-1548 Added experiment config for AI button for block elements.

## 2.1.9

### Patch Changes

- [#138414](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138414)
  [`7869af9163f3e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7869af9163f3e) -
  Added lazy node experiment to config

## 2.1.8

### Patch Changes

- [#138377](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138377)
  [`82a0bc6a2384e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/82a0bc6a2384e) -
  Added lazy node experiment to config

## 2.1.7

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18

## 2.1.6

### Patch Changes

- [#137404](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137404)
  [`adae1f3dc8fca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/adae1f3dc8fca) -
  Switches Support Table in Comment features to use Statsig experiment instead of a Feature Gate.

## 2.1.5

### Patch Changes

- [#137234](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137234)
  [`e80c81de138e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e80c81de138e9) -
  [ux] [ED-24803] Experiment for editor block controls which adds a button to insert quickInsert
  elements

## 2.1.4

### Patch Changes

- [#136760](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136760)
  [`67e70c0779b86`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/67e70c0779b86) -
  [EDF-1274](https://product-fabric.atlassian.net/browse/EDF-1274) - replace
  platform_editor_ai_command_palate_improvement_fg FG by
  platform_editor_ai_command_palate_improvement Statsig experiment

## 2.1.3

### Patch Changes

- [#137041](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137041)
  [`060aff106c5ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/060aff106c5ac) -
  Add insert-right-rail experiment and reimplement right rail logic
- [#137041](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137041)
  [`060aff106c5ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/060aff106c5ac) -
  Add new experiment for insert menu in right rail, allow right menu to be opened from main toolbar
  '+' button

## 2.1.2

### Patch Changes

- [#136413](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136413)
  [`934839fbec788`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/934839fbec788) -
  Revert ED-24737-enable-right-rail due to HOT-111462

## 2.1.1

### Patch Changes

- [#136410](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136410)
  [`af422227cfb98`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/af422227cfb98) -
  Update eeTest to include experiment overrides
- [#136410](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136410)
  [`52083ca79b5dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52083ca79b5dc) -
  [ux] ED-24603 Disable dragging nested nodes within table behind FF

## 2.1.0

### Minor Changes

- [#136054](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136054)
  [`9887c32fede77`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9887c32fede77) -
  EDF-1449 Fix floating toolbar experiment

## 2.0.1

### Patch Changes

- [#136295](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136295)
  [`0150dad7ca580`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0150dad7ca580) -
  Add new experiment for insert menu in right rail, allow right menu to be opened from main toolbar
  '+' button

## 2.0.0

### Major Changes

- [#136209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136209)
  [`2d0d9036c143a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2d0d9036c143a) -
  [ED-24790] Add support for editor experiments in gemini tests

## 1.4.1

### Patch Changes

- [#136078](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136078)
  [`09414d7233497`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/09414d7233497) -
  ED-24507 Switch nested dnd FG to experiment and include padding changes"

## 1.4.0

### Minor Changes

- [#135110](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135110)
  [`48ef3f98124db`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/48ef3f98124db) -
  [ux] [ED-24754] Add 5 template options to quick insert and element browser when
  `platform_editor_element_level_templates` experiment is enabled

## 1.3.2

### Patch Changes

- [#133128](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133128)
  [`5208be528f4e4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5208be528f4e4) -
  EO-2024-44 Improved types and added export

## 1.3.1

### Patch Changes

- [#133748](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133748)
  [`3d90a431f7ed8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d90a431f7ed8) -
  Add experiment for input latency fix

## 1.3.0

### Minor Changes

- [#134006](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134006)
  [`51179090981ef`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/51179090981ef) -
  EDF-1302 updated condensed dloating toolbar feature flag to use statsig instrumentation

## 1.2.0

### Minor Changes

- [#131878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131878)
  [`705fe39cae267`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/705fe39cae267) -
  [ED-24597] Update to log `platform_editor_basic_text_transformations` exposure event only for
  users meet all of 3 checks:

  - Are enrolled to the experiment
  - Have AI disabled
  - Make top level text selection
