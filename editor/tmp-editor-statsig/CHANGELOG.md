# @atlaskit/editor-statsig-tmp

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
