# @atlaskit/editor-plugin-code-block

## 3.5.5

### Patch Changes

- Updated dependencies

## 3.5.4

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 3.5.3

### Patch Changes

- [#154664](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154664)
  [`365f9b8ae8789`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/365f9b8ae8789) -
  [ux] [ED-23241] Reverted
  [previous bugfix](https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/95492/overview)
  for codeblock -> paragraph behaviour as it is handled by the Prosemirror schema now, using the
  linebreakReplacement setting
- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1
- Updated dependencies

## 3.5.2

### Patch Changes

- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1
- Updated dependencies

## 3.5.1

### Patch Changes

- [#151850](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151850)
  [`730e4417d9ad8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/730e4417d9ad8) -
  [ux] ED-25091: migrated code snippet to use new ADS icons
- Updated dependencies

## 3.5.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 3.4.4

### Patch Changes

- [#149910](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149910)
  [`bfb321d2bd9fd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bfb321d2bd9fd) -
  ED-25141 - state.doc.nodesBetween was being called and could go beyond the range of the document
  and therefore throw an error. Occured when entering an inline code snippet with the back quote
  shortcut. See HOT-112305 for more details.

## 3.4.3

### Patch Changes

- [#149087](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149087)
  [`8b2dcb618ccf8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2dcb618ccf8) -
  ED-25141: Code block wrapping performance improvement. Only update the line number decorators on a
  given code block when a line has been added or removed. Previously was updating line number
  decorators on every update for all code blocks.

## 3.4.2

### Patch Changes

- Updated dependencies

## 3.4.1

### Patch Changes

- Updated dependencies

## 3.4.0

### Minor Changes

- [#146025](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146025)
  [`03eae90c614d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/03eae90c614d1) -
  Remove platform.editor.live-view.disable-editing-in-view-mode_fi1rx feature flag

## 3.3.19

### Patch Changes

- Updated dependencies

## 3.3.18

### Patch Changes

- Updated dependencies

## 3.3.17

### Patch Changes

- [#141594](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141594)
  [`3f6b2eb7bd493`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f6b2eb7bd493) -
  [ux] [ED-24867] This change moves nesting codeblocks and media in blockquotes via insertion
  methods behind an experiment gate.

## 3.3.16

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 3.3.15

### Patch Changes

- Updated dependencies

## 3.3.14

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 3.3.13

### Patch Changes

- [#136871](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136871)
  [`87a30d5cb3ffb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87a30d5cb3ffb) -
  ED-24814 - Addressing a bug where changing the language on a wrapped code block caused the wrapped
  decorator to disappear. Required changing the sequence in which we update the keys on the wrapped
  states WeakMap. Due to the amount of changes, it has all be placed behind a bug fix feature gate
  (editor_code_block_wrapping_language_change_bug) and the original feature gate
  (editor_support_code_block_wrapping).

## 3.3.12

### Patch Changes

- [#136348](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136348)
  [`fb4fb56f1da7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fb4fb56f1da7c) -
  Use optimised entry-points on editor-common for browser.
- Updated dependencies

## 3.3.11

### Patch Changes

- [#136266](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136266)
  [`cb41a82ab6813`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb41a82ab6813) -
  ED-24752 Add new plugin to code block that strips auto inserted fullstops from mac on code blocks
- Updated dependencies

## 3.3.10

### Patch Changes

- [`cbe3b04ebb0b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cbe3b04ebb0b6) -
  ED-24730 - Address bug where word wrap decorator broke on drag and drop. Required some refactoring
  of decoration functions for code block. Moved all of them to decorators.ts and added unit tests.

## 3.3.9

### Patch Changes

- [#134918](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134918)
  [`89e5820ef3ed5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/89e5820ef3ed5) -
  [ux] ED-24678 adding a11y support for code block

## 3.3.8

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 3.3.7

### Patch Changes

- [`193f8c85e1a39`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/193f8c85e1a39) -
  [ux] [ED-24635]

  - Disable Turn into dropdown options when wrapping is not supported
  - Update expand icon so that it can show disabled status
  - Update Turn into icon to show active status when dropdown is open

- Updated dependencies

## 3.3.6

### Patch Changes

- Updated dependencies

## 3.3.5

### Patch Changes

- [#130377](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130377)
  [`3dad41b881f45`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3dad41b881f45) -
  [ux] ED-24613 add support for decorator mapping on new transactions and live view button enable
- Updated dependencies

## 3.3.4

### Patch Changes

- [#128388](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128388)
  [`0ea0f81d30dcc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0ea0f81d30dcc) -
  ED-24501 Add a CSS var to maintain a dynamic line number gutter size on the code block based on
  the max number length. ED-24573 update handleClickOn in the code block plugin to work with new
  line number gutter.

## 3.3.3

### Patch Changes

- [`0f58d3a82867c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0f58d3a82867c) -
  ED-24500 Add decorators on init of code block and on document updates

## 3.3.2

### Patch Changes

- [#128111](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128111)
  [`9863ffeb3e73e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9863ffeb3e73e) -
  remove codeblock preserve newlines ff
- [#129049](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129049)
  [`6b1533d389c9d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b1533d389c9d) -
  [ux] ED-24511 - Convert code block line numbers inline decorations to widget decorations. The line
  number gutter on editor code blocks should now reflect the number of lines of code, including when
  the code block has word wrap enabled. Minor for editor-common as new analytics attribute added.
- Updated dependencies

## 3.3.1

### Patch Changes

- [#127940](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127940)
  [`7f340ec35b8a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7f340ec35b8a4) -
  [ux] ED-24320 Hook up decorators for toggled on and toggled off wrapping states in floating
  toolbar

## 3.3.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

### Patch Changes

- Updated dependencies

## 3.2.5

### Patch Changes

- [#127369](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127369)
  [`95ff22b16d347`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/95ff22b16d347) -
  [ux] ED-24374 Add support for dynamic line number positions on code block nodeview

## 3.2.4

### Patch Changes

- [#126818](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126818)
  [`197b047fbe6e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/197b047fbe6e6) -
  ED-24245 - Adding analytics TRACK event that is triggered when the user clicks the toggle word
  wrap button on the code block floating toolbar.

## 3.2.3

### Patch Changes

- [#125133](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125133)
  [`d804e5dd3216b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d804e5dd3216b) -
  ED-24226 - Add state to manage the toggle word wrap state of code blocks. New WeakMap added in
  editor-common/src/code-block, as word wrap state is shared throughout the editor. Covers regular
  changes to code block by the user via the node view update function. Covers breakout of code block
  node. Does not cover drag&drop & cut&paste edge cases.

## 3.2.2

### Patch Changes

- [#124302](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124302)
  [`45dc9b6543007`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/45dc9b6543007) -
  [ux] ED-24228 adding wrap content functionality with feature gate

## 3.2.1

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- [#122977](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122977)
  [`41748db2c12de`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/41748db2c12de) -
  [ux]ED-24225 add wrap button inside editor-plugin-block
- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#117111](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117111)
  [`6f06e433f9724`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6f06e433f9724) -
  Remove option for "appearance" from `editor-plugin-code-block`. This configuration is completely
  unused and has no effect. It is safe to remove if you are currently using this prop for
  configuration.

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [`d9b562bd66f8e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d9b562bd66f8e) -
  [ux] [ED-23947] restoring the original order of the typeahead menu so that actions, media,
  mentions and emojis are above the fold (in the top 5 results). this change is a major because it
  removes the `getEditorFeatureFlags prop` for plugins. if any consumers who have adopted these
  changes to the public API, they should remove them on their side too.

### Patch Changes

- Updated dependencies

## 1.5.2

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
- Updated dependencies

## 1.5.1

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 1.3.4

### Patch Changes

- [#110390](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110390)
  [`bead123202369`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bead123202369) -
  [ux] [ED-23642] Reordering the typeahead so that date, status, code block & info panel are above
  the fold (in the top 5 results)
- Updated dependencies

## 1.3.3

### Patch Changes

- Updated dependencies

## 1.3.2

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.3.1

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 1.3.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 1.2.8

### Patch Changes

- Updated dependencies

## 1.2.7

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 1.2.6

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.2.5

### Patch Changes

- Updated dependencies

## 1.2.4

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 1.2.3

### Patch Changes

- [#95492](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95492)
  [`c88ed307708a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c88ed307708a) -
  [ux] [ED-22897] Replace newlines with hard breaks when codeblock is converted to a paragraph when
  the user presses backspace at the start of the paragraph. (only applies if codeblock is the first
  Node of the document or first node of a list item) Enabled with feature flag
  "platform.editor.codeblock-preserve-newlines_54r3m"

## 1.2.2

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1

## 1.2.1

### Patch Changes

- [#93689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93689)
  [`5ba5d2b4a9ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ba5d2b4a9ac) -
  Updating adf-schema version to 35.10.0

## 1.2.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.1.11

### Patch Changes

- [#91461](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91461)
  [`1b353cb06cc8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1b353cb06cc8) -
  [ED-23042] Disable editing in code blocks and expand nodes when editorDisabled state is true

## 1.1.10

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options

## 1.1.9

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 1.1.8

### Patch Changes

- [#91080](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91080)
  [`ef9f3c4ad482`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ef9f3c4ad482) -
  Revert change for disable code block in live view
- Updated dependencies

## 1.1.7

### Patch Changes

- [#89138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89138)
  [`f70dc8331119`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f70dc8331119) -
  Disable code block content editing in live view mode
- Updated dependencies

## 1.1.6

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 1.1.5

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

## 1.1.4

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.1.3

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0

## 1.1.2

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

## 1.1.1

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

## 1.1.0

### Minor Changes

- [#75114](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75114)
  [`393ee487af1e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/393ee487af1e) -
  Plugin configuration for code-block plugin is now optional.

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [#73044](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73044)
  [`0fff4efc0417`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fff4efc0417) -
  [ux] ED-22131 Fixed selection placement when codeblock inserted through quick-insert inside panel
- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386)
  [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) -
  This changeset exists to bump all editor plugins that currently don't have a major version. This
  is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.1.20

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.1.19

### Patch Changes

- [#71136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71136)
  [`c803fea1e6a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c803fea1e6a4) -
  Move all plugin translations to editor-common
- Updated dependencies

## 0.1.18

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 0.1.17

### Patch Changes

- Updated dependencies

## 0.1.16

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.1.15

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802)
  [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) -
  Ensure all editor plugins are marked as singletons

## 0.1.14

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.1.13

### Patch Changes

- [#62880](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62880)
  [`a23ec26652ea`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a23ec26652ea) -
  Extracting breakout plugin from editor-core into new package @atlaskit/editor-plugin-breakout

## 0.1.12

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

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

- Updated dependencies

## 0.1.1

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379)
  [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763
  Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies
