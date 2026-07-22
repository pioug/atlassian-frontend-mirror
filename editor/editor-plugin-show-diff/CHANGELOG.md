# @atlaskit/editor-plugin-show-diff

## 10.5.3

### Patch Changes

- [`154b76531a593`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/154b76531a593) -
  Fix table diff cell overlays to use rounded corners for inserting row diffs when
  platform_editor_table_diff_rounded_corners is enabled

## 10.5.2

### Patch Changes

- [`75c7e6a9aa4ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/75c7e6a9aa4ec) -
  [ux] Improve showing diff for attribute changes for inline nodes.
- Updated dependencies

## 10.5.1

### Patch Changes

- [`ded72f3ee293f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ded72f3ee293f) -
  Fix table diff cell overlays to use rounded corners for delete row diffs when
  platform_editor_table_diff_rounded_corners is enabled
- [`11b7096b9b80c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/11b7096b9b80c) -
  CCI-17981: Fix diff indicator misalignment on page resize by observing measured DOM elements for
  size changes
- Updated dependencies

## 10.5.0

### Minor Changes

- [`2cfc0f295c39a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2cfc0f295c39a) -
  [ux] FG cleanup - Removes `confluence_frontend_content_wrapper` from platform (treated as
  permanently launched / implicitly true).

  ## Breaking change

  The `confluence_frontend_content_wrapper` gate previously guarded a scroll-gutter tweak in
  `basePluginOptions` that only read the `base` builder's `__livePage` field. With the gate
  launched, that field is no longer read, so the now-dead `base` option was removed rather than left
  as vestigial API.

  For `@atlaskit/editor-presets` (published):
  - The `base` option was removed from the public preset plugin options type
    (`AllPublicPluginOptions.base` is now `never`).
  - `basePluginOptions()` no longer takes an argument (was `basePluginOptions({ options })`).

  This is a **type-level** breaking change only. At runtime it is a no-op: the `base` option (and
  the `__livePage` value passed through it) was already unused once the gate was on, so removing it
  does not change editor behaviour. It is scored `major` for `@atlaskit/editor-presets` because that
  package is published and the type contract change will break the builds of external TypeScript
  consumers that still pass `base`. `@atlassian/confluence-presets` is `private` (not published) and
  receives the same code change, so it is scored `minor`.

  ## Migration

  Stop passing the `base` option to the preset, and call `basePluginOptions()` with no arguments:

  ```diff
   fullPagePreset({
     intl,
     pluginOptions: {
  -    base: { __livePage },
       // ...other plugin options unchanged
     },
   });
  ```

  ```diff
  - basePluginOptions({ options: { __livePage } });
  + basePluginOptions();
  ```

  Note: `__livePage` itself is not removed — it remains a valid, live field on the other plugin
  option builders (e.g. `selection`, `selectionMarker`, `collabEdit`, `card`). Only the unused
  `base.__livePage` passthrough is gone. All in-repo consumers have been migrated as part of this
  PR.

### Patch Changes

- Updated dependencies

## 10.4.9

### Patch Changes

- Updated dependencies

## 10.4.8

### Patch Changes

- Updated dependencies

## 10.4.7

### Patch Changes

- Updated dependencies

## 10.4.6

### Patch Changes

- [`89de40d80a7ce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/89de40d80a7ce) -
  [ux] Add toggle to show/hide deleted diffs on the AI suggestion card. An eye icon button is added
  inline with the Accept and Discard buttons, allowing users to hide all greyed-out deleted content
  while keeping purple highlighted additions visible. The toggle resets to the default "show
  deletions" state when navigating between suggestions.
- Updated dependencies

## 10.4.5

### Patch Changes

- Updated dependencies

## 10.4.4

### Patch Changes

- Updated dependencies

## 10.4.3

### Patch Changes

- Updated dependencies

## 10.4.2

### Patch Changes

- [`a41c9b243974d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a41c9b243974d) -
  Fix smart diff fabricating a phantom whole-block deletion when a new block is inserted at a
  top-level boundary (e.g. a paragraph added immediately before a bulletList). topLevelBlocksInRange
  now treats a zero-width insertion anchor sitting exactly on a top-level block boundary as touching
  no block, so a pure insertion is no longer mis-paired with the following block and converted into
  a whole-block replacement. This also lets pure whole-block deletions surface under smart diff.
- Updated dependencies

## 10.4.1

### Patch Changes

- [`81ce4d8f5cd8a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81ce4d8f5cd8a) -
  Show blue indicators for new added paragraphs and headings
- Updated dependencies

## 10.4.0

### Minor Changes

- [`0f27159a9087b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f27159a9087b) -
  Add `hideAddedDiffsUnderline` option to the `showDiff` command to disable the dark-purple
  underline on added/updated diff content while keeping the purple highlight. Only affects the
  extended/`smart` inserted styles, is gated behind the `platform_editor_ai_smart_diff` feature
  gate, and defaults to `false`.

  ```ts
  editorApi.showDiff.commands.showDiff({
  	steps,
  	originalDoc,
  	hideAddedDiffsUnderline: true,
  });
  ```

## 10.3.0

### Minor Changes

- [`21147179a56ea`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21147179a56ea) -
  [CCI-17809] Overhaul Post Stream Review segmenting.

  `@atlaskit/editor-plugin-show-diff`: add a generic `computeDiffChanges` utility (new
  `@atlaskit/editor-plugin-show-diff/calculate-diff` entry point) that returns the classified
  `Change[]` and reconstructed new document for a given `originalDoc` + `steps`, without rendering
  decorations. It reuses the same classifier the diff overlay renders from (default
  `diffType: 'smart'`), so consumers can derive their own reviewable segments that line up with what
  the overlay would draw. Exposes the `ComputeDiffChangesParams` type.

  `@atlassian/editor-plugin-ai`: support two segmenting strategies in the Post Stream Review
  step-through, selected by the new `platform_editor_ai_diff_based_segmenting` gate. Gate ON =
  diff-based (`smart`) segmenting (via the show-diff `computeDiffChanges` utility, shaped into
  reviewable segments in the AI plugin); gate OFF (default) = top-level-node segmenting, which no
  longer splits a list into individual list items. Fine segments are now stored in plugin state and
  remapped on every doc change, so per-segment undo/redo and view-changes stay correct after an
  undo. Aggregate ("all changes") mode is unchanged.

### Patch Changes

- Updated dependencies

## 10.2.0

### Minor Changes

- [`eb1f11daf16c8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eb1f11daf16c8) -
  Add a new `smart` `DiffType` that classifies changes by density at the sentence, paragraph and
  node level and renders the most readable granularity for each change. Introduces the exported
  `SmartDiffThresholds` type and a `smartThresholds` option on the `showDiff` params for configuring
  the sentence/paragraph/node promotion thresholds.

  Also adds a new exported `DeletedDiffPlacement` type (`'top' | 'bottom'`) and a
  `deletedDiffPlacement` param on `PMDiffParams` that controls whether node/paragraph-level deleted
  content is rendered above (`'top'`, the default) or below (`'bottom'`) the new content.

  Usage:

  ```ts
  import type {
  	DeletedDiffPlacement,
  	SmartDiffThresholds,
  } from '@atlaskit/editor-plugin-show-diff/show-diff-plugin-type';

  editorApi.showDiff.commands.showDiff({
  	originalDoc,
  	steps,
  	diffType: 'smart',
  	// Optional; controls where deleted content is rendered. Defaults to 'top'.
  	deletedDiffPlacement: 'bottom' satisfies DeletedDiffPlacement,
  	// All fields optional; defaults applied internally.
  	smartThresholds: {
  		sentence: { minChanged: 2, ratio: 0.4 },
  		paragraph: { minChanged: 2, ratio: 0.4 },
  		node: { ratio: 0.6, textBearingRatio: 0.6 },
  	} satisfies SmartDiffThresholds,
  });
  ```

## 10.1.23

### Patch Changes

- Updated dependencies

## 10.1.22

### Patch Changes

- Updated dependencies

## 10.1.21

### Patch Changes

- Updated dependencies

## 10.1.20

### Patch Changes

- [`afd15695098bb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/afd15695098bb) -
  EDItOR-7711: Show block changed diff indicators.
- Updated dependencies

## 10.1.19

### Patch Changes

- Updated dependencies

## 10.1.18

### Patch Changes

- Updated dependencies

## 10.1.17

### Patch Changes

- Updated dependencies

## 10.1.16

### Patch Changes

- Updated dependencies

## 10.1.15

### Patch Changes

- Updated dependencies

## 10.1.14

### Patch Changes

- Updated dependencies

## 10.1.13

### Patch Changes

- Updated dependencies

## 10.1.12

### Patch Changes

- [`3d9bf2e6f248a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d9bf2e6f248a) -
  Fix nested image in panel shifting left when showing suggestion diff
- Updated dependencies

## 10.1.11

### Patch Changes

- [`0096393101f67`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0096393101f67) -
  Render inverted granular step diffs as a hybrid (based on threshold): granular changed inline plus
  a 'reference' block crossed out underneath
- Updated dependencies

## 10.1.10

### Patch Changes

- [`346f91cfe1997`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/346f91cfe1997) -
  Clean up prefer static regex violations
- Updated dependencies

## 10.1.9

### Patch Changes

- [`86eb94526dc1d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/86eb94526dc1d) -
  [EDITOR-7841] Fix bug where diff widgets missing margin when the diff is the first node of the
  document
- Updated dependencies

## 10.1.8

### Patch Changes

- Updated dependencies

## 10.1.7

### Patch Changes

- Updated dependencies

## 10.1.6

### Patch Changes

- Updated dependencies

## 10.1.5

### Patch Changes

- Updated dependencies

## 10.1.4

### Patch Changes

- Updated dependencies

## 10.1.3

### Patch Changes

- Updated dependencies

## 10.1.2

### Patch Changes

- Updated dependencies

## 10.1.1

### Patch Changes

- Updated dependencies

## 10.1.0

### Minor Changes

- [`96a8a99060dfc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/96a8a99060dfc) -
  EDITOR-7523: Add diff indicators to the left doc margin

## 10.0.3

### Patch Changes

- Updated dependencies

## 10.0.2

### Patch Changes

- Updated dependencies

## 10.0.1

### Patch Changes

- Updated dependencies

## 10.0.0

### Major Changes

- [`f2dc9097319f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2dc9097319f0) - ###
  Dropped support for _legacy_ Typescript 4 types. **Typescript 5 is now the new minimum**.

  Removes the `typesVersions` property and `dist/types-ts4.5` directory from the dist.

  Types are now exclusively via the `"types": "dist/types/index.d.ts"` property.

  ```diff
  - "typesVersions": {
  -    ">=4.5 <4.9": {
  -        "*": [
  -            "dist/types-ts4.5/*",
  -            "dist/types-ts4.5/index.d.ts"
  -        ]
  -    }
  - },
  ```

### Minor Changes

- [`4759c2ac86196`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4759c2ac86196) -
  EDITOR-7523: Add diff descriptors with new diff ids and types.

### Patch Changes

- Updated dependencies

## 9.1.2

### Patch Changes

- Updated dependencies

## 9.1.1

### Patch Changes

- [`3cd3edf123888`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3cd3edf123888) -
  Remove purple underline from block widget containers when diffs are inverted with extended
  experiment enabled
- Updated dependencies

## 9.1.0

### Minor Changes

- [`a3a227e567efe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a3a227e567efe) -
  [ux] [EDITOR-7662] disabled block controls when viewing diffs

### Patch Changes

- [`281cf98f35fe5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/281cf98f35fe5) -
  Minor refactor to use a decoration key builder so that it can be extended upon in upcoming work.
- Updated dependencies

## 9.0.17

### Patch Changes

- Updated dependencies

## 9.0.16

### Patch Changes

- [`3effa9ec1b6b3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3effa9ec1b6b3) -
  Add borderBottom and padding to removed inline diffs to match the height of added inline diffs
- Updated dependencies

## 9.0.15

### Patch Changes

- Updated dependencies

## 9.0.14

### Patch Changes

- Updated dependencies

## 9.0.13

### Patch Changes

- Updated dependencies

## 9.0.12

### Patch Changes

- Updated dependencies

## 9.0.11

### Patch Changes

- Updated dependencies

## 9.0.10

### Patch Changes

- Updated dependencies

## 9.0.9

### Patch Changes

- Updated dependencies

## 9.0.8

### Patch Changes

- Updated dependencies

## 9.0.7

### Patch Changes

- Updated dependencies

## 9.0.6

### Patch Changes

- [`ca2189db06329`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ca2189db06329) -
  Update diff style
- Updated dependencies

## 9.0.5

### Patch Changes

- [`4c2645b77929d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4c2645b77929d) -
  [ux] EDITOR-7346 add ai and diff plugin support for panel_c1
- Updated dependencies

## 9.0.4

### Patch Changes

- Updated dependencies

## 9.0.3

### Patch Changes

- [`9301f162e76d2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9301f162e76d2) -
  EDITOR-7470: Fix mid-word punctuation in diffs splitting word boundaries.
- Updated dependencies

## 9.0.2

### Patch Changes

- [`b3d1adf5a46c7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b3d1adf5a46c7) -
  Fix word-boundary diff cutoff when a granular textblock diff runs inside a paragraph that contains
  non-text inline nodes (hardBreak, mention, emoji, date, etc.). Previously the expansion logic
  indexed into `parent.textContent`, which strips those nodes, so doc positions in the body could
  land mid-word and pull untouched neighbouring words into the diff range.

## 9.0.1

### Patch Changes

- Updated dependencies

## 9.0.0

### Patch Changes

- Updated dependencies

## 8.4.10

### Patch Changes

- Updated dependencies

## 8.4.9

### Patch Changes

- Updated dependencies

## 8.4.8

### Patch Changes

- Updated dependencies

## 8.4.7

### Patch Changes

- [`8132cf74d023d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8132cf74d023d) -
  EDITOR-7377: Fix granular diffs to show diffs at word boundaries (non-whitespace characters)
- Updated dependencies

## 8.4.6

### Patch Changes

- [`5e34be0ba10b6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5e34be0ba10b6) -
  Cleanup show diff experiments
- Updated dependencies

## 8.4.5

### Patch Changes

- Updated dependencies

## 8.4.4

### Patch Changes

- Updated dependencies

## 8.4.3

### Patch Changes

- Updated dependencies

## 8.4.2

### Patch Changes

- [`5789b1638025b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5789b1638025b) -
  EDITOR-6631: If only marks has changed, don't use granular diffing as that won't show any diffs.
- Updated dependencies

## 8.4.1

### Patch Changes

- [`8a9f26c6c71bc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8a9f26c6c71bc) -
  [ux] Improve diff logic for some nodes and edge cases where marks are causing the diff to fail
- Updated dependencies

## 8.4.0

### Minor Changes

- [`ebab8f80bfc40`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ebab8f80bfc40) -
  Autofix: add explicit package exports (barrel removal)

### Patch Changes

- Updated dependencies

## 8.3.10

### Patch Changes

- Updated dependencies

## 8.3.9

### Patch Changes

- Updated dependencies

## 8.3.8

### Patch Changes

- [`932b1625cbf60`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/932b1625cbf60) -
  EDITOR-6621: Add a grey background on deleted text in standard diff theme.
- Updated dependencies

## 8.3.7

### Patch Changes

- [`c07f198dda226`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c07f198dda226) -
  NO-ISSUE: Always scroll diff into view even if it's in viewport already
- Updated dependencies

## 8.3.6

### Patch Changes

- Updated dependencies

## 8.3.5

### Patch Changes

- [`d672ff18b0e43`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d672ff18b0e43) -
  Use post-step doc to simplify changes.

## 8.3.4

### Patch Changes

- Updated dependencies

## 8.3.3

### Patch Changes

- Updated dependencies

## 8.3.2

### Patch Changes

- Updated dependencies

## 8.3.1

### Patch Changes

- Updated dependencies

## 8.3.0

### Minor Changes

- [`1b208e1f7d8f7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1b208e1f7d8f7) -
  [ux] Adds the entry point for ai image generation to the media insert picker plugin as a new tab.
  This feature is fully behind an experiment gate.

### Patch Changes

- Updated dependencies

## 8.2.0

### Minor Changes

- [`439f373a73aa2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/439f373a73aa2) -
  EDITOR-6620: Add an option to scroll the diff into view.

## 8.1.13

### Patch Changes

- Updated dependencies

## 8.1.12

### Patch Changes

- Updated dependencies

## 8.1.11

### Patch Changes

- Updated dependencies

## 8.1.10

### Patch Changes

- Updated dependencies

## 8.1.9

### Patch Changes

- Updated dependencies

## 8.1.8

### Patch Changes

- Updated dependencies

## 8.1.7

### Patch Changes

- Updated dependencies

## 8.1.6

### Patch Changes

- Updated dependencies

## 8.1.5

### Patch Changes

- Updated dependencies

## 8.1.4

### Patch Changes

- Updated dependencies

## 8.1.3

### Patch Changes

- [`76faad1c8c7b5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/76faad1c8c7b5) -
  Removed `react-intl-next` alias and replaced all usages with `react-intl` directly.

  What changed: The `react-intl-next` devDependency alias (which resolved to `react-intl@^5`) has
  been renamed to `react-intl`. This is a development-only change with no impact on consumers.

## 8.1.2

### Patch Changes

- Updated dependencies

## 8.1.1

### Patch Changes

- [`b26874dcf4a79`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b26874dcf4a79) -
  Show granular inline diffs when the replace step is for a paragraph.
- Updated dependencies

## 8.1.0

### Minor Changes

- [`c50b6810de5a3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c50b6810de5a3) -
  Open expand nodes before scrolling to diff changes within them using `toggleExpandRange` from the
  expand plugin. This is gated behind the `platform_editor_show_diff_open_expands_on_scroll` feature
  flag.

### Patch Changes

- Updated dependencies

## 8.0.0

### Patch Changes

- Updated dependencies

## 7.0.0

### Patch Changes

- Updated dependencies

## 6.4.1

### Patch Changes

- [`d1d3089a12aff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d1d3089a12aff) -
  EDITOR-6431: Improve diff styles to support text-like diffs better when inverted.
- Updated dependencies

## 6.4.0

### Minor Changes

- [`7739efec523bc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7739efec523bc) -
  EDITOR-6371: Add toggle for showing / hiding deleted changes in the diff.

### Patch Changes

- Updated dependencies

## 6.3.2

### Patch Changes

- Updated dependencies

## 6.3.1

### Patch Changes

- Updated dependencies

## 6.3.0

### Minor Changes

- [`5d32941f15d07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d32941f15d07) -
  EDITOR-5949: Change diffing logic to support closest block diffs + preliminary support for row
  diffs.

### Patch Changes

- Updated dependencies

## 6.2.19

### Patch Changes

- Updated dependencies

## 6.2.18

### Patch Changes

- [`fa146e17e08d6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fa146e17e08d6) -
  Update README.md and 0-intro.tsx

## 6.2.17

### Patch Changes

- [`38f6b2fea945a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/38f6b2fea945a) -
  Remove dragAndDropEnabled from test fixtures and audit false usages - prop is being deprecated

## 6.2.16

### Patch Changes

- [`7b7c52dff5d7d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b7c52dff5d7d) -
  Fix eslint violations for type import syntax
- Updated dependencies

## 6.2.15

### Patch Changes

- Updated dependencies

## 6.2.14

### Patch Changes

- Updated dependencies

## 6.2.13

### Patch Changes

- Updated dependencies

## 6.2.12

### Patch Changes

- Updated dependencies

## 6.2.11

### Patch Changes

- Updated dependencies

## 6.2.10

### Patch Changes

- Updated dependencies

## 6.2.9

### Patch Changes

- Updated dependencies

## 6.2.8

### Patch Changes

- Updated dependencies

## 6.2.7

### Patch Changes

- Updated dependencies

## 6.2.6

### Patch Changes

- [`164eae4f672d5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/164eae4f672d5) -
  Fix a number of issues with the diff flipper
- Updated dependencies

## 6.2.5

### Patch Changes

- Updated dependencies

## 6.2.4

### Patch Changes

- Updated dependencies

## 6.2.3

### Patch Changes

- [`c2b3bd8f1e4cb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c2b3bd8f1e4cb) -
  Enforce custom step registers for show diff plugin for consistency.

## 6.2.2

### Patch Changes

- Updated dependencies

## 6.2.1

### Patch Changes

- Updated dependencies

## 6.2.0

### Minor Changes

- [`255e764f80182`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255e764f80182) -
  EDITOR-5830: Add support for showing inline vs. block diff types.

### Patch Changes

- Updated dependencies

## 6.1.10

### Patch Changes

- Updated dependencies

## 6.1.9

### Patch Changes

- [`0f4a08b633f6e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f4a08b633f6e) -
  Internal changes to remove unnecessary token fallbacks and imports from `@atlaskit/theme`
- Updated dependencies

## 6.1.8

### Patch Changes

- Updated dependencies

## 6.1.7

### Patch Changes

- Updated dependencies

## 6.1.6

### Patch Changes

- Updated dependencies

## 6.1.5

### Patch Changes

- Updated dependencies

## 6.1.4

### Patch Changes

- [`9df4b10b5f0f8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9df4b10b5f0f8) -
  Improve edge cases when showing diff by using a looser equality structure for steps.
- Updated dependencies

## 6.1.3

### Patch Changes

- [`8c860e8e9e774`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c860e8e9e774) -
  Make active decorations more distinct

## 6.1.2

### Patch Changes

- Updated dependencies

## 6.1.1

### Patch Changes

- Updated dependencies

## 6.1.0

### Minor Changes

- [`40c53e0b66a8a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/40c53e0b66a8a) -
  EDITOR-5829: Allow showing inverse of diffs

### Patch Changes

- Updated dependencies

## 6.0.2

### Patch Changes

- Updated dependencies

## 6.0.1

### Patch Changes

- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.10

### Patch Changes

- [`8acefc80a7a89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8acefc80a7a89) -
  Fixed initial activeIndex to be undefined instead of 0, preventing auto-selection on diff
  initialization. Also update tests accordingly

## 5.0.9

### Patch Changes

- [`db37927f35395`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/db37927f35395) -
  Cleanup platform_editor_ai_aifc_patch_ga_blockers flag.

## 5.0.8

### Patch Changes

- [`e7825d1698274`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e7825d1698274) -
  Improve areNodesEqualIgnoreAttrs by adding option ignoreMarkOrder which ensures the order of the
  marks does not result in a "false" which can break some cases of diffs.
- Updated dependencies

## 5.0.7

### Patch Changes

- [`1fd2b267eb592`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1fd2b267eb592) -
  Cleanup `platform_editor_ai_aifc_patch_ga` flag
- Updated dependencies

## 5.0.6

### Patch Changes

- [`2e27b70a136ed`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2e27b70a136ed) -
  EDITOR-5632: Further refactors to block / row handling - mainly renaming + param change to object
  param to make it more extensible for future work.
- Updated dependencies

## 5.0.5

### Patch Changes

- [`8865b5e8a708a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8865b5e8a708a) -
  EDITOR-5632: Refactor diff plugin to make functions more generic.
- Updated dependencies

## 5.0.4

### Patch Changes

- Updated dependencies

## 5.0.3

### Patch Changes

- [`8bddf4c001143`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8bddf4c001143) -
  Improve scrolling to diffs on the page by focusing before scroll
- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

### Major Changes

- [`b5af20d6e019c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b5af20d6e019c) -
  EDITOR-5632: Change colourScheme param to colorScheme for standardisation.

### Patch Changes

- Updated dependencies

## 4.1.4

### Patch Changes

- [`4031146a0af6d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4031146a0af6d) -
  Updating the PR to calculate the correct number of decorations for display.
- Updated dependencies

## 4.1.3

### Patch Changes

- [`ea378cb5c7a31`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ea378cb5c7a31) -
  EDITOR-5632: no-op refactors to simplify code
- Updated dependencies

## 4.1.2

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [`ec61e21a60034`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ec61e21a60034) -
  Adds new commands to scroll to each diff change in the UI.

### Patch Changes

- Updated dependencies

## 4.0.15

### Patch Changes

- Updated dependencies

## 4.0.14

### Patch Changes

- Updated dependencies

## 4.0.13

### Patch Changes

- Updated dependencies

## 4.0.12

### Patch Changes

- Updated dependencies

## 4.0.11

### Patch Changes

- Updated dependencies

## 4.0.10

### Patch Changes

- Updated dependencies

## 4.0.9

### Patch Changes

- Updated dependencies

## 4.0.8

### Patch Changes

- Updated dependencies

## 4.0.7

### Patch Changes

- [`6911179854bdb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6911179854bdb) -
  Remove diff highlighting if there are overlapping mark steps (ie. add and then remove)
- Updated dependencies

## 4.0.6

### Patch Changes

- Updated dependencies

## 4.0.5

### Patch Changes

- Updated dependencies

## 4.0.4

### Patch Changes

- [`bdd272290540a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bdd272290540a) -
  Migrate platform_editor_jan_a11y_fixes flag to platform_editor_enghealth_a11y_jan_fixes
  experiment.
- Updated dependencies

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- [`917bb70243d23`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/917bb70243d23) -
  [ux] [ENGHEALTH-43911] increase visual contrast for deleted text when viewing changes

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.3.3

### Patch Changes

- Updated dependencies

## 3.3.2

### Patch Changes

- [`5c35083992b75`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5c35083992b75) -
  [EDITOR-3498] Redo + view changes makes browser freeze, fixed bug.

## 3.3.1

### Patch Changes

- [`be40850b186a8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/be40850b186a8) -
  Rolled up editor AIFC beta gates into the parent streaming gate. Also decoupled the placholder
  from the main AIFC FG by utilising the withEmptyParagraph plugin option, since this prop is only
  set when AIFC is enabled. This means we don't need refs to this gate in the plugin because it's
  already controlled by a prop.
- Updated dependencies

## 3.3.0

### Minor Changes

- [`a36ac8c9961b1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a36ac8c9961b1) -
  [ux] [EDITOR-2608] updated show diff deleted block nodes design

### Patch Changes

- Updated dependencies

## 3.2.8

### Patch Changes

- [`e3779b75fdeca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3779b75fdeca) -
  EDITOR-1643 Promote syncBlock and bodiedSyncBlock to full schema
- Updated dependencies

## 3.2.7

### Patch Changes

- [`bc52c059565f2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bc52c059565f2) -
  Fix issue with simplify changes being too aggressive and dropping steps causing diffs to fail.

## 3.2.6

### Patch Changes

- [`05ee61c6ace09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/05ee61c6ace09) -
  Improve performance of show diff by increasing merge of steps
- Updated dependencies

## 3.2.5

### Patch Changes

- [`a05464ea42678`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a05464ea42678) -
  EDITOR-2791 bump adf-schema
- [`657693883946f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/657693883946f) -
  Fix diffs for extension nodes
- Updated dependencies

## 3.2.4

### Patch Changes

- [`0b00861d972cd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0b00861d972cd) -
  [EDITOR-2668] refactored deleted mediaSingle decorations to maintain alignment/wrap on diff view
- Updated dependencies

## 3.2.3

### Patch Changes

- Updated dependencies

## 3.2.2

### Patch Changes

- [`1c0d87f570c52`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1c0d87f570c52) -
  [ux] Update attributes to ignore attr steps that do not affect the document

## 3.2.1

### Patch Changes

- [`da2782d8dc1e7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/da2782d8dc1e7) -
  Support table row diff displaying in the editor

## 3.2.0

### Minor Changes

- [`68caaf98e8f89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/68caaf98e8f89) -
  [ux] [EDITOR-1628] Added "Removed" Lozenge and gray border decorations to deleted block nodes in
  show diff view

### Patch Changes

- Updated dependencies

## 3.1.5

### Patch Changes

- [`7c8492867be97`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7c8492867be97) -
  [ux] Add support for media attribute changes in the diff

## 3.1.4

### Patch Changes

- [`21fe79119fe74`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21fe79119fe74) -
  EDITOR-2447 Bump adf-schema to 51.3.2
- Updated dependencies

## 3.1.3

### Patch Changes

- [`c28cd65d12c24`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c28cd65d12c24) -
  EDITOR-2447 Bump adf-schema to 51.3.1
- Updated dependencies

## 3.1.2

### Patch Changes

- [`63e63c69cd679`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/63e63c69cd679) -
  Add styling for bullet point markers on diff

## 3.1.1

### Patch Changes

- [`174d939cfd1ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/174d939cfd1ba) -
  Use valid positioning for deleted diff content to avoid invalid nesting diffs

## 3.1.0

### Minor Changes

- [`5167552fe1a93`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5167552fe1a93) -
  [EDITOR-2339] Bump @atlaskit/adf-schema to 51.3.0

### Patch Changes

- [`38fb1054b8b7a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/38fb1054b8b7a) -
  Recover from invalid deletion decorations
- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [`16d89ac68ca47`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/16d89ac68ca47) -
  Improve how large number of small steps are grouped together in the diff.
- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- [`b8555904ec1cc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b8555904ec1cc) -
  Add new util for comparing nodes ignoring attributes.
- Updated dependencies

## 2.1.2

### Patch Changes

- [`7bd504ca6f5a1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7bd504ca6f5a1) -
  Export PMDiffParams type for editor diff plugin for use

## 2.1.1

### Patch Changes

- [`c6b6ef91296ca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c6b6ef91296ca) -
  [ux] Better support for block nodes for deleted diffs.
- Updated dependencies

## 2.1.0

### Minor Changes

- [`5eadb7f870272`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5eadb7f870272) -
  [ux] Adds a new plugin configuration to adjust the styling scheme for diffs. By default it will
  use standard, but traditional (for green + red) is also available.

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [`4144b576f0bf8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4144b576f0bf8) -
  Ignore attribute changes when ensuring the steps match the final document
- Updated dependencies

## 1.0.0

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- [`f7c9ea51bb613`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f7c9ea51bb613) -
  [EDITOR-1395] dnd interferes with diff
- Updated dependencies

## 0.2.0

### Minor Changes

- [`3df4a57528050`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3df4a57528050) -
  Update editor showDiffPlugin to take in params for preset use in Confluence version history.

## 0.1.7

### Patch Changes

- [`06722cb00f629`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/06722cb00f629) -
  [EDITOR-1358] Remove extra parameters parased in and refactored initialisation for show-diff
  editorView

## 0.1.6

### Patch Changes

- [`3d9a6a0aae8c5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d9a6a0aae8c5) -
  Fix show diff not loading inline node diffs on load
- Updated dependencies

## 0.1.5

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs

## 0.1.4

### Patch Changes

- [`1fc9ea612c6ef`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1fc9ea612c6ef) -
  [EDITOR-1358] Fix nit + minor local bug

## 0.1.3

### Patch Changes

- [`8700ce859da07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8700ce859da07) -
  [EDITOR-1249] Added inline node support for show diff

## 0.1.2

### Patch Changes

- [`7fe4c9e51271d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7fe4c9e51271d) -
  Fix initial show diff after performance fix.
- [`b2d53a70dbaa5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d53a70dbaa5) -
  Improve show diff performance by storing decorations in state.
- Updated dependencies

## 0.1.1

### Patch Changes

- [`941fdc429d140`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/941fdc429d140) -
  Show formatting changes in the diff
- Updated dependencies

## 0.1.0

### Minor Changes

- [`81ec1e909620a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81ec1e909620a) -
  [EDITOR-1206] Have `editor-plugin-show-diff` expose if the plugin is displaying the diff.
  Deprecate the state in `editor-plugin-track-changes` as it depends on `editor-plugin-show-diff`
  and it's better to have the state in the plugin that actually shows the diff

## 0.0.3

### Patch Changes

- [`3c2fe6ae106d8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3c2fe6ae106d8) -
  Focus the editor after track changes is turned off.
- Updated dependencies

## 0.0.2

### Patch Changes

- [`9464a4f29a876`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9464a4f29a876) -
  [EDITOR-1194] Bugfix show diff new line if deleted half way
- Updated dependencies

## 0.0.1

### Patch Changes

- Updated dependencies
