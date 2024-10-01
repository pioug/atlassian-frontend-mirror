# @atlaskit/editor-plugin-paste

## 1.12.7

### Patch Changes

- Updated dependencies

## 1.12.6

### Patch Changes

- [`037ce68784704`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/037ce68784704) -
  ED-25123 Update document moved to fire for all cases
- Updated dependencies

## 1.12.5

### Patch Changes

- [#143700](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143700)
  [`9ef9b7e3bc1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9ef9b7e3bc1d7) -
  [ux] [ED-24868] Paste gating for codeblock and media in quotes.
- Updated dependencies

## 1.12.4

### Patch Changes

- [#142433](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142433)
  [`896303d4b4390`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/896303d4b4390) -
  ED-24552 Update document moved event to fire when nested nodes are cut/paste into nodes and add
  nodeDepth attributes
- Updated dependencies

## 1.12.3

### Patch Changes

- Updated dependencies

## 1.12.2

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.12.1

### Patch Changes

- Updated dependencies

## 1.12.0

### Minor Changes

- [#138305](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138305)
  [`c79d9c18032b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c79d9c18032b6) -
  Passing task local ID from editor mentions plugin

### Patch Changes

- Updated dependencies

## 1.11.4

### Patch Changes

- [#137736](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137736)
  [`2a88fdd213838`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2a88fdd213838) -
  Introducing new smaller refined entry-points for editor-common to reduce bundle size.
- Updated dependencies

## 1.11.3

### Patch Changes

- [#135903](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135903)
  [`42636c7a806fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/42636c7a806fb) -
  [ux] [ED-24525] Fix paste for media nested in blockquotes from external editor. Before it was
  missing quote on paste, now it includes the quote.
- Updated dependencies

## 1.11.2

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 1.11.1

### Patch Changes

- [#130811](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130811)
  [`541a703405a7d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/541a703405a7d) -
  [ux] [ED-24431] Ability to paste an expand into another expand
- Updated dependencies

## 1.11.0

### Minor Changes

- [#133315](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133315)
  [`5c94ca338de14`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c94ca338de14) -
  Updating mentions plugin config for handling deleted mentions and refactor

### Patch Changes

- Updated dependencies

## 1.10.1

### Patch Changes

- Updated dependencies

## 1.10.0

### Minor Changes

- [#131937](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131937)
  [`64414d9668409`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/64414d9668409) -
  Adding configuration to mentions plugin from confluence

### Patch Changes

- Updated dependencies

## 1.9.1

### Patch Changes

- [#131711](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131711)
  [`00a61b846f2a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/00a61b846f2a1) -
  Cleanup FF platform.editor.media.fix-copy-paste-excel_62g4s

## 1.9.0

### Minor Changes

- [#130825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130825)
  [`d8a00de5637ff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d8a00de5637ff) -
  ENGHEALTH-9890: Bumps React peer dependency for Lego editor plugins

### Patch Changes

- Updated dependencies

## 1.8.2

### Patch Changes

- [#130724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130724)
  [`a54f1d5c8a0eb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a54f1d5c8a0eb) -
  remove preserve whitespace clipboard text serialization ff
- Updated dependencies

## 1.8.1

### Patch Changes

- [#129252](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129252)
  [`d4ea158a91fde`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d4ea158a91fde) -
  Cleaned up FF platform.editor.allow-action-in-list

## 1.8.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

### Patch Changes

- Updated dependencies

## 1.7.3

### Patch Changes

- [#126553](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126553)
  [`c7d63e493e698`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c7d63e493e698) -
  Removed FF platform.editor.place-cursor-inside-text-block

## 1.7.2

### Patch Changes

- [#124517](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124517)
  [`d7e6d3d76a05d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d7e6d3d76a05d) -
  Removed FF platform.editor.handle-paste-for-action-in-panel

## 1.7.1

### Patch Changes

- Updated dependencies

## 1.7.0

### Minor Changes

- [#124190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124190)
  [`9ab9c4ca2b9df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9ab9c4ca2b9df) -
  Clean-up platform.editor.refactor-highlight-toolbar_mo0pj feature flag
- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.6.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

### Patch Changes

- Updated dependencies

## 1.5.7

### Patch Changes

- [#122612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122612)
  [`01a85ce0a88ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/01a85ce0a88ec) -
  [ux] ED-23705 Add logic to handle annotations on inline nodes when they are inserted or pasted.
  Covers the following inline nodes: emoji, status, mention, date, inlineCard

## 1.5.6

### Patch Changes

- [#121483](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121483)
  [`b73c87fcb17dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b73c87fcb17dd) -
  [ED-22946] Cleanup feature flag extractListFromParagraphV2

## 1.5.5

### Patch Changes

- Updated dependencies

## 1.5.4

### Patch Changes

- Updated dependencies

## 1.5.3

### Patch Changes

- [#118497](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118497)
  [`5b4bfa8be2106`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5b4bfa8be2106) -
  Cleanup FF that improves paste behaviour of markdown tables in tables.
- Updated dependencies

## 1.5.2

### Patch Changes

- [#117897](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117897)
  [`0856aa2920fe2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0856aa2920fe2) -
  Remove feature flag for bug fix: Copying table content in a multi bodied extension and then
  pasting creates a new table

## 1.5.1

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [`0d2247352e10e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0d2247352e10e) -
  Adds mentionLocalIds to the pasted analytics event.

## 1.4.3

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
- Updated dependencies

## 1.4.2

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- [#115817](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115817)
  [`d647eedc6ddd4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d647eedc6ddd4) -
  [ux] [ED-23275] Feature flag cleanup for allow-extended-panel
- Updated dependencies

## 1.4.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

### Patch Changes

- Updated dependencies

## 1.3.2

### Patch Changes

- [#115170](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115170)
  [`84489f16bb385`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/84489f16bb385) -
  Adds a pm-plugin to register contentMoved event as an alternative to DnD feature.

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 1.2.4

### Patch Changes

- [#112281](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112281)
  [`2e2ef0bbefc4b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2e2ef0bbefc4b) -
  Null check mention node so we don't crash if the mention plugin hasn't been added.

## 1.2.3

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.2.1

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation
- Updated dependencies

## 1.2.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 1.1.10

### Patch Changes

- Updated dependencies

## 1.1.9

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 1.1.8

### Patch Changes

- [#98593](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98593)
  [`1180c4cbf39b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1180c4cbf39b) -
  ED-23263: Fixed pasting lose texts aligment

## 1.1.7

### Patch Changes

- Updated dependencies

## 1.1.6

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.1.5

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 1.1.3

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1

## 1.1.2

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component

## 1.1.1

### Patch Changes

- [#93689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93689)
  [`5ba5d2b4a9ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ba5d2b4a9ac) -
  Updating adf-schema version to 35.10.0

## 1.1.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.0.18

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options

## 1.0.17

### Patch Changes

- [#92373](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92373)
  [`6a480276c9b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a480276c9b0) -
  [ux] [ED-23043] Plain text content leading and trailing whitespace is now preserved on paste
  behind FF (`platform.editor.preserve-whitespace-clipboard-text-serialization`)

## 1.0.16

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 1.0.15

### Patch Changes

- [#89978](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89978)
  [`6e7143622425`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6e7143622425) -
  fix paste markdown table into a table issue

## 1.0.14

### Patch Changes

- [#87898](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87898)
  [`6d4009f72e36`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d4009f72e36) -
  [ux] [ED-22591] Fix pasting logic for lines with number and dot (but is not a list item) to retain
  formatting and correct list conversion.
- Updated dependencies

## 1.0.13

### Patch Changes

- [#86222](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86222)
  [`0e1dc019f1cd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0e1dc019f1cd) -
  Fix a table content paste issue when copy content from a table cell inside bodied extension
- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 1.0.12

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0
- Updated dependencies

## 1.0.11

### Patch Changes

- [#82819](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82819)
  [`4d110826a9d6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4d110826a9d6) -
  [ED-22608] Adds mentionIds to the pasted analytics event.

## 1.0.10

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.9

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0

## 1.0.8

### Patch Changes

- [#78591](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78591)
  [`578ff696d240`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/578ff696d240) -
  ED-22330 Adapted paste logic for empty panels in MBE.
- Updated dependencies

## 1.0.7

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2
- [#76560](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76560)
  [`ecab0d093882`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ecab0d093882) -
  Fixed misplaced cursor positon when code block is pasted into extended nested expand
- [#78176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78176)
  [`7482f69bb25f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7482f69bb25f) -
  ED-21833: Stop showing paste options toolbar for smart links
- Updated dependencies

## 1.0.6

### Patch Changes

- [#75436](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75436)
  [`bfcf32bb4fa3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bfcf32bb4fa3) -
  [ux] ED-21941 Disable resize/layout options for table, media and extension when added to MBE.
  Table rendering fixed for Confluence editor

## 1.0.5

### Patch Changes

- [#75378](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75378)
  [`caf4a7eff92d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/caf4a7eff92d) -
  ED-22246 Fix pasting text into action/decision inside panel

## 1.0.4

### Patch Changes

- [#74662](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74662)
  [`03889d5b1256`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/03889d5b1256) -
  ED-22244 Allow copy paste of action within a panel into a panel
- Updated dependencies

## 1.0.3

### Patch Changes

- [#75368](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75368)
  [`0a0d45e03ecf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0a0d45e03ecf) -
  ED-22245: Fixing the bug to paste links inside nested codeblock

## 1.0.2

### Patch Changes

- [#74284](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74284)
  [`c88cf104546f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c88cf104546f) -
  fix copy paste issue in excel and numbers that paste table results in screenshot of table pasted
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

## 0.2.19

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.2.18

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 0.2.17

### Patch Changes

- [#70164](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70164)
  [`a6438ad5ed9d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a6438ad5ed9d) -
  ED-21974 Pasting node into panel should replace the selected text

## 0.2.16

### Patch Changes

- [#69736](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69736)
  [`febb7827b916`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/febb7827b916) -
  ED-21619 Set correct cursor position on pasting a rule inside panel
- Updated dependencies

## 0.2.15

### Patch Changes

- Updated dependencies

## 0.2.14

### Patch Changes

- [#68219](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68219)
  [`39c60998e4d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/39c60998e4d7) -
  ED-21894 Allow partial taskLists to be copied and pasted into a listItem

## 0.2.13

### Patch Changes

- Updated dependencies

## 0.2.12

### Patch Changes

- [#68721](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68721)
  [`0c420c1e6b96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c420c1e6b96) -
  ED-21618 Replace selected decision in panel on pasting another decision

## 0.2.11

### Patch Changes

- Updated dependencies

## 0.2.10

### Patch Changes

- [#67922](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67922)
  [`cd95401d8cde`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd95401d8cde) -
  ED-21865 Set correct cursor position when decision is pasted inside panel

## 0.2.9

### Patch Changes

- [#66826](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66826)
  [`5e9f6778a15a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e9f6778a15a) -
  [ux] resolved a bug where the cursor mispalced after pasting the media into the panel
- [#67283](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67283)
  [`4f10a52c6e39`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4f10a52c6e39) -
  ED-21613 handle incorrect cursor position - when task is copied into a list
- Updated dependencies

## 0.2.8

### Patch Changes

- [#66495](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66495)
  [`8d310bc51505`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d310bc51505) -
  ED-21623: Fixing paste behaviour for nested codeblock in panel

## 0.2.7

### Patch Changes

- [#64972](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64972)
  [`a72ac4c06038`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a72ac4c06038) -
  ED-21627 Fixed issue with parsing of task as string - when pasting into an existing task

## 0.2.6

### Patch Changes

- Updated dependencies

## 0.2.5

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802)
  [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) -
  Ensure all editor plugins are marked as singletons

## 0.2.3

### Patch Changes

- [#64592](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64592)
  [`21e21d79ce84`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/21e21d79ce84) -
  fix copy pasting content from expands inside a table so only selected content is pasted
- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.2.2

### Patch Changes

- [#64216](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64216)
  [`582a3eef15ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/582a3eef15ae) -
  ED-20824 Fix copy paste issues with multi-level list inside blockquote
- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#63830](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63830)
  [`a21d2c99bd13`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a21d2c99bd13) -
  Move code for editor paste plugin from editor-core to @atlaskit/editor-plugin-paste

## 0.1.22

### Patch Changes

- [#63348](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63348)
  [`2d6eebf2ed74`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2d6eebf2ed74) -
  Extract annotation plugin from editor-core to @atlaskit/editor-plugin-annotation.
- Updated dependencies

## 0.1.21

### Patch Changes

- Updated dependencies

## 0.1.20

### Patch Changes

- Updated dependencies

## 0.1.19

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 0.1.18

### Patch Changes

- Updated dependencies

## 0.1.17

### Patch Changes

- Updated dependencies

## 0.1.16

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808)
  [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) -
  ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 0.1.15

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246)
  [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) -
  ED-21371 Update adf-schema to 35.1.0

## 0.1.14

### Patch Changes

- Updated dependencies

## 0.1.13

### Patch Changes

- Updated dependencies

## 0.1.12

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).
- Updated dependencies

## 0.1.11

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763)
  [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) -
  update ADF schema

## 0.1.10

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790)
  [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) -
  ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 0.1.9

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

## 0.1.8

### Patch Changes

- Updated dependencies

## 0.1.7

### Patch Changes

- Updated dependencies

## 0.1.6

### Patch Changes

- Updated dependencies

## 0.1.5

### Patch Changes

- [#43042](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43042)
  [`fd547efa4e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd547efa4e5) - Remove
  `macro` editor plugin and migrate functionality into extension plugin.

## 0.1.4

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- [#42907](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42907)
  [`0493f1968e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0493f1968e6) - add
  editor-plugin-list as a dependency

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [#41895](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41895)
  [`96066a06792`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96066a06792) -
  ED-20524: Adding shared state for paste plugin which will be used by new paste options toolbar
  plugin

## 0.0.1

### Patch Changes

- [#41862](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41862)
  [`668cb3bcd3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/668cb3bcd3a) -
  [ED-20519] Extract Paste Plugin: Moving the plugin type to a new package
