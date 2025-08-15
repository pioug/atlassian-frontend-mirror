# @atlaskit/prosemirror-collab

## 0.17.10

### Patch Changes

- Updated dependencies

## 0.17.9

### Patch Changes

- [#195649](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195649)
  [`231bb33e06dfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/231bb33e06dfe) -
  EDITOR-1131 Bump adf-schema version to 50.2.0

## 0.17.8

### Patch Changes

- [#191913](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191913)
  [`6d1e56695e91d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d1e56695e91d) -
  EDITOR-1131 Bump adf-schema package to 50.0.0

## 0.17.7

### Patch Changes

- [#187144](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187144)
  [`a16147d8fbdfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a16147d8fbdfe) -
  Bump @atlaskit/adf-schema to v49.0.5

## 0.17.6

### Patch Changes

- Updated dependencies

## 0.17.5

### Patch Changes

- Updated dependencies

## 0.17.4

### Patch Changes

- [#173357](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173357)
  [`f17a667b25b42`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f17a667b25b42) -
  enable merging of prosemirror steps for single player sessions
- Updated dependencies

## 0.17.3

### Patch Changes

- [#171009](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/171009)
  [`dd8a3eaf0efe6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dd8a3eaf0efe6) -
  ED-28229: Preserve selection in syncFromAnotherSource when original selection was within document
  range. This is to avoid the selection going to the end of the document every time due to the whole
  document being replaced in this function.

## 0.17.2

### Patch Changes

- Updated dependencies

## 0.17.1

### Patch Changes

- [#167366](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167366)
  [`838a75dd75ffd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/838a75dd75ffd) -
  Mitigate edge case in moved content which can cause a crash.
- Updated dependencies

## 0.17.0

### Minor Changes

- [#154562](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154562)
  [`9a3495cb72638`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9a3495cb72638) -
  Support AnalyticsStep filtering for collab

### Patch Changes

- Updated dependencies

## 0.16.4

### Patch Changes

- Updated dependencies

## 0.16.3

### Patch Changes

- [#144227](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144227)
  [`6da190d8e3a24`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6da190d8e3a24) -
  Add ability to rebase drag and drop content
- Updated dependencies

## 0.16.2

### Patch Changes

- [#140813](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140813)
  [`c4756a5c1a4ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c4756a5c1a4ae) -
  Migrating offline editing feature gates to a new experiment "platform_editor_offline_editing_web"
- Updated dependencies

## 0.16.1

### Patch Changes

- [#140816](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140816)
  [`09580d6d7c275`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/09580d6d7c275) -
  EDITOR-608 Clean up platform_editor_collab_text_selection_override

## 0.16.0

### Minor Changes

- [#131596](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131596)
  [`7482e321a16a7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7482e321a16a7) -
  ED-25490 added platform_editor_collab_text_selection_override. When the feature flag (FG) is
  enabled, we create a new TextSelection in packages/editor/prosemirror-collab/src/index.ts during
  the mapping of text selections. This change ensures that selections don’t collapse unexpectedly in
  collaborative editing scenarios. The current implementation attempts to resolve selections to a
  valid inline content position, but we intentionally allow selections to start at the first
  position in the document (position 0), which corresponds to the doc node and isn’t inline content.
  This adjustment accommodates collaborative users by preserving their selections even at the
  document’s start.

## 0.15.0

### Minor Changes

- [#120472](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120472)
  [`73c800ab5f2fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73c800ab5f2fc) -
  ED-26766 update adf-schema from 47.2.1 to 47.6.0 and adf-schema-json from 1.27.0 to 1.31.0

## 0.14.0

### Minor Changes

- [#115482](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115482)
  [`5c3199f49f3c7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c3199f49f3c7) -
  Added analytics tracking for rebased steps

## 0.13.0

### Minor Changes

- [#108583](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108583)
  [`2fce949f7105c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2fce949f7105c) -
  Add getDocBeforeUnconfirmedSteps and syncFromAnotherSource functions to
  @atlaskit/prosemirror-collab. Add updatePluginState action to historyPlugin.

## 0.12.1

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 0.12.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

## 0.11.1

### Patch Changes

- Updated dependencies

## 0.11.0

### Minor Changes

- [#97210](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97210)
  [`b55d2f8aafea1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b55d2f8aafea1) -
  Introduces new option `transformUnconfirmed` on collab prosemirror plugin which can be used to run
  a transform on unconfirmed steps.

## 0.10.4

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0

## 0.10.3

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 0.10.2

### Patch Changes

- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1

## 0.10.1

### Patch Changes

- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1

## 0.10.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

## 0.9.5

### Patch Changes

- [#143146](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143146)
  [`5df86b2c5407e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5df86b2c5407e) -
  Retire getVersion using getCollabState from prosemirror-collab, and adding error events on
  checking undefined collab state in all collab-provider usages

## 0.9.4

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 0.9.3

### Patch Changes

- [#137366](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137366)
  [`44c333f52bfa6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/44c333f52bfa6) -
  Avoid left undefined clientId in collab-provider

## 0.9.2

### Patch Changes

- [#136261](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136261)
  [`132b8da724995`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/132b8da724995) -
  Generate clientId when it is undefined

## 0.9.1

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 0.9.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

## 0.8.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

## 0.7.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

## 0.6.1

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version

## 0.6.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

## 0.5.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

## 0.4.2

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1

## 0.4.1

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 0.4.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

## 0.3.5

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 0.3.4

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 0.3.3

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 0.3.2

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1

## 0.3.1

### Patch Changes

- [#93689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93689)
  [`5ba5d2b4a9ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ba5d2b4a9ac) -
  Updating adf-schema version to 35.10.0

## 0.3.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

## 0.2.25

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options

## 0.2.24

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0

## 0.2.23

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 0.2.22

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

## 0.2.21

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0

## 0.2.20

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2

## 0.2.19

### Patch Changes

- [#71133](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71133)
  [`22d7f6ed1f02`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/22d7f6ed1f02) -
  revert prosemirror-collab unfork

## 0.2.18

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 0.2.17

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808)
  [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) -
  ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 0.2.16

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246)
  [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) -
  ED-21371 Update adf-schema to 35.1.0

## 0.2.15

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 0.2.14

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763)
  [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) -
  update ADF schema

## 0.2.13

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790)
  [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) -
  ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 0.2.12

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417)
  [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971
  Upgrade adf-schema package to ^34.0.0

## 0.2.11

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379)
  [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763
  Upgrade ADF schema version to 33.2.3 for MBE nodes.

## 0.2.10

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749)
  [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect
  yarn changeset to packages, upgrade adf-schema

## 1.3.0 (2022-05-30)

## 0.2.9

### Patch Changes

- [#39481](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39481)
  [`aeb5c9a01e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aeb5c9a01e8) - Delete
  adf-schema from AFE and rely on npm package for adf-schema
- [`4b4dcfe0bba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b4dcfe0bba) - Delete
  adf-schema, use published version

## 0.2.8

### Patch Changes

- [#38976](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38976)
  [`33cb07de05f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33cb07de05f) - change
  adf-schema to fixed versioning

## 0.2.7

### Patch Changes

- Updated dependencies

## 0.2.6

### Patch Changes

- [#37785](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37785)
  [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) -
  [ED-19233] Import prosemirror libraries from internal facade package

## 0.2.5

### Patch Changes

- [#36241](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36241)
  [`5f5ba16de66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5ba16de66) -
  [ED-13910] Fix prosemirror types

## 0.2.4

### Patch Changes

- [#35782](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35782)
  [`73b5128036b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73b5128036b) -
  [ED-17082] Mark package as a singleton one

## 0.2.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 0.2.2

### Patch Changes

- [#33771](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33771)
  [`a142ba1aa28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a142ba1aa28) -
  [ED17172] Bump prosemirror-model to 1.16.0 and prosemirror-view to 1.23.7 and removed work-arounds
  for fixed issues

## 0.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 0.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

## 0.1.4

### Patch Changes

- [#33004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33004)
  [`0ffb55018c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ffb55018c9) - Revert
  "[ED-17172] Bumped prosemirror-view from 1.23.2 to 1.23.7 and removed work-around for fixed
  issues"

## 0.1.3

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 0.1.2

### Patch Changes

- [#29470](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29470)
  [`96a7517a28f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96a7517a28f) - Reverted
  filtering out analytics steps as they would break undo behaviour

## 0.1.1

### Patch Changes

- [#28932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28932)
  [`59e998e408f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/59e998e408f) -
  [ESS-2914] Switch to the forked prosemirror-collab library (based on version 1.3.0) to filter out
  analytics steps

## 0.1.0

### Minor Changes

- [#28374](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28374)
  [`883590cbe7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/883590cbe7d) -
  [ESS-2914] Forked the prosemirror-collab library to create a version that filters out analytics
  steps

### Patch Changes

- Updated dependencies

### New features

Include TypeScript type declarations.

## 1.2.2 (2019-11-20)

### Bug fixes

Rename ES module files to use a .js extension, since Webpack gets confused by .mjs

## 1.2.1 (2019-11-19)

### Bug fixes

The file referred to in the package's `module` field now is compiled down to ES5.

## 1.2.0 (2019-11-08)

### New features

Add a `module` field to package json file.

## 1.1.2 (2019-05-29)

### Bug fixes

Fix an issue where in `mapSelectionBackward` mode, the plugin flipped the head and anchor of the
selection, leading to selection glitches during collaborative editing.

## 1.1.1 (2018-10-09)

### Bug fixes

Fix issue where `mapSelectionBackward` didn't work because of a typo.

## 1.1.0 (2018-08-21)

### New features

[`receiveTransaction`](https://prosemirror.net/docs/ref/#collab.receiveTransaction) now supports a
`mapSelectionBackward` option that makes it so that text selections are mapped to stay in place when
remote changes insert content at their position.

## 0.19.0 (2017-03-16)

### New features

You can now use strings (as well as numbers) as client IDs (this already worked, but now the
documentation reflects this).

## 0.18.0 (2017-02-24)

### New features

[`sendableSteps`](https://prosemirror.net/docs/ref/version/0.18.0.html#collab.sendableSteps) now
also returns information about the original transactions that produced the steps.

## 0.11.0 (2016-09-21)

### Breaking changes

Moved into a separate module.

Interface [adjusted](https://prosemirror.net/docs/ref/version/0.11.0.html#collab) to work with the
new [plugin](https://prosemirror.net/docs/ref/version/0.11.0.html#state.Plugin) system.

### New features

When receiving changes, the module now
[generates](https://prosemirror.net/docs/ref/version/0.11.0.html#collab.receiveAction) a regular
[transform action](https://prosemirror.net/docs/ref/version/0.11.0.html#state.TransformAction)
instead of hard-setting the editor's document. This solves problematic corner cases for code keeping
track of the document by listening to transform actions.
