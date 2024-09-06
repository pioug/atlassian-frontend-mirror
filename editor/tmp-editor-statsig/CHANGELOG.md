# @atlaskit/editor-statsig-tmp

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
