# @atlaskit/editor-plugin-mentions

## 2.6.3

### Patch Changes

- Updated dependencies

## 2.6.2

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 2.6.1

### Patch Changes

- Updated dependencies

## 2.6.0

### Minor Changes

- [#138305](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138305)
  [`c79d9c18032b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c79d9c18032b6) -
  Passing task local ID from editor mentions plugin

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 2.5.2

### Patch Changes

- [#136348](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136348)
  [`fb4fb56f1da7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fb4fb56f1da7c) -
  Use optimised entry-points on editor-common for browser.
- Updated dependencies

## 2.5.1

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 2.5.0

### Minor Changes

- [#133315](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133315)
  [`5c94ca338de14`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c94ca338de14) -
  Updating mentions plugin config for handling deleted mentions and refactor

## 2.4.1

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#131937](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131937)
  [`64414d9668409`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/64414d9668409) -
  Adding configuration to mentions plugin from confluence

## 2.3.1

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

### Patch Changes

- Updated dependencies

## 2.2.1

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- [#122612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122612)
  [`01a85ce0a88ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/01a85ce0a88ec) -
  [ux] ED-23705 Add logic to handle annotations on inline nodes when they are inserted or pasted.
  Covers the following inline nodes: emoji, status, mention, date, inlineCard
- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

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

## 1.8.2

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
- Updated dependencies

## 1.8.1

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

### Patch Changes

- Updated dependencies

## 1.7.1

### Patch Changes

- [#111187](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111187)
  [`3fc3b37188f2c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3fc3b37188f2c) -
  [ux] [ED-23788] Make sure that profilecards in the Editor do not autofocus, so that users can
  click on a mention and immediate delete it by pressing `Backspace` or `Delete`
- Updated dependencies

## 1.7.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 1.6.1

### Patch Changes

- [#110390](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110390)
  [`bead123202369`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bead123202369) -
  [ux] [ED-23642] Reordering the typeahead so that date, status, code block & info panel are above
  the fold (in the top 5 results)
- Updated dependencies

## 1.6.0

### Minor Changes

- [#108100](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108100)
  [`c854f5415176c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c854f5415176c) -
  Add localId to mentionTypeahead click event attributes

## 1.5.1

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#103169](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103169)
  [`e9d45fc94064`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e9d45fc94064) -
  [ux] [ED-23248] -

  **@atlaskit/editor-core**: Added optional profilecardProvider to Mention plugin in universal
  composable editor **@atlaskit/editor-plugin-mentions**: Made mentions render with profile cards on
  click if the feature flag: `platform.editor.mentions-in-editor-popup-on-click` is turned on

## 1.4.1

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.4.0

### Minor Changes

- [#103099](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103099)
  [`ab382e121799`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ab382e121799) -
  [ux] [ED-23248] -

  **@atlaskit/editor-core**: REVERT: Added optional profilecardProvider to Mention plugin in
  universal composable editor **@atlaskit/editor-plugin-mentions**: REVERT: Made mentions render
  with profile cards on click if the feature flag:
  `platform.editor.mentions-in-editor-popup-on-click` is turned on

## 1.3.0

### Minor Changes

- [#98647](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98647)
  [`19eb20751225`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19eb20751225) -
  [ux] [ED-23248] -

  **@atlaskit/editor-core**: Added optional profilecardProvider to Mention plugin in universal
  composable editor **@atlaskit/editor-plugin-mentions**: Made mentions render with profile cards on
  click if the feature flag: `platform.editor.mentions-in-editor-popup-on-click` is turned on

## 1.2.1

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 1.2.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 1.1.8

### Patch Changes

- Updated dependencies

## 1.1.7

### Patch Changes

- [#98103](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98103)
  [`14c055a65f67`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14c055a65f67) -
  removed invite from mention experiment check

## 1.1.6

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 1.1.5

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.1.4

### Patch Changes

- Updated dependencies

## 1.1.3

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 1.1.2

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1

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

## 1.0.10

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options

## 1.0.9

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 1.0.8

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 1.0.7

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

## 1.0.6

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.5

### Patch Changes

- [#81852](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81852)
  [`0641eef91f65`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0641eef91f65) -
  React 18 types for editor-plugin-mentions

## 1.0.4

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0

## 1.0.3

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

## 1.0.2

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

## 0.2.3

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.2.2

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 0.2.1

### Patch Changes

- [#68640](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68640)
  [`6a3ea210641a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a3ea210641a) -
  Create new context identifier plugin which contains the provider.
- Updated dependencies

## 0.2.0

### Minor Changes

- [#68790](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68790)
  [`c6d8affc52d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d8affc52d1) -
  Support maybeAdd plugins in usePreset. Add typing support for universal preset.

  Now when using the editor API with the universal preset

### Patch Changes

- Updated dependencies

## 0.1.20

### Patch Changes

- Updated dependencies

## 0.1.19

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.1.18

### Patch Changes

- [#67189](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67189)
  [`93cbf53ca0e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93cbf53ca0e0) -
  Removing instances of WithPluginState from mentions and type-ahead plugins.

## 0.1.17

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802)
  [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) -
  Ensure all editor plugins are marked as singletons

## 0.1.16

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.1.15

### Patch Changes

- Updated dependencies

## 0.1.14

### Patch Changes

- [#64538](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64538)
  [`264115ce5ec4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/264115ce5ec4) -
  DTR-2096: Add taskListId and taskItemId to mention typeAhead clicked and pressed analytic events,
  when inserted within actions or tasks
- Updated dependencies

## 0.1.13

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 0.1.12

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808)
  [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) -
  ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 0.1.11

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246)
  [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) -
  ED-21371 Update adf-schema to 35.1.0

## 0.1.10

### Patch Changes

- Updated dependencies

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

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417)
  [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971
  Upgrade adf-schema package to ^34.0.0

## 0.1.4

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379)
  [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763
  Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 0.1.2

### Patch Changes

- [#42451](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42451)
  [`36764ad64a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/36764ad64a9) -
  [ECA11Y-87] Mentioned name is not communicated to the users of screen reader

## 0.1.1

### Patch Changes

- Updated dependencies
