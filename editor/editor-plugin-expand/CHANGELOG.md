# @atlaskit/editor-plugin-expand

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
