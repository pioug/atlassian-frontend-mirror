# @atlaskit/editor-statsig-tmp

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
