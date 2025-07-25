# @atlaskit/editor-wikimarkup-transformer

## 11.15.3

### Patch Changes

- [#187144](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187144)
  [`a16147d8fbdfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a16147d8fbdfe) -
  Bump @atlaskit/adf-schema to v49.0.5
- Updated dependencies

## 11.15.2

### Patch Changes

- Updated dependencies

## 11.15.1

### Patch Changes

- Updated dependencies

## 11.15.0

### Minor Changes

- [#120472](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120472)
  [`73c800ab5f2fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73c800ab5f2fc) -
  ED-26766 update adf-schema from 47.2.1 to 47.6.0 and adf-schema-json from 1.27.0 to 1.31.0

### Patch Changes

- Updated dependencies

## 11.14.3

### Patch Changes

- Updated dependencies

## 11.14.2

### Patch Changes

- Updated dependencies

## 11.14.1

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 11.14.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 11.13.1

### Patch Changes

- Updated dependencies

## 11.13.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 11.12.6

### Patch Changes

- [#165765](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165765)
  [`3f441f30e6507`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f441f30e6507) -
  Bump adf-schema to 46.0.0

## 11.12.5

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`8f1d77592a9dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f1d77592a9dc) -
  Bump adf-schema to 44.2.0

## 11.12.4

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18

## 11.12.3

### Patch Changes

- [#154186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154186)
  [`5c316170d29dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c316170d29dd) -
  Bump @atlaskit/adf-schema to 42.3.1

## 11.12.2

### Patch Changes

- Updated dependencies

## 11.12.1

### Patch Changes

- [#152510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152510)
  [`dcf9edde7ac7b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcf9edde7ac7b) -
  bump adf-schema to 42.0.1

## 11.12.0

### Minor Changes

- [#151190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151190)
  [`a3723b1cdede2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3723b1cdede2) -
  [ux] [ED-25037] this change bumps @atlaskit/adf-schema from 40.9.0 to 40.9.4 which makes the
  blockquote selectable, adds missing marks to the PM node spec and fixes a bug that converted
  pasted external images to media groups.

### Patch Changes

- Updated dependencies

## 11.11.2

### Patch Changes

- [#146378](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146378)
  [`134a849673ebd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/134a849673ebd) -
  This change removes the following public API from the @atlaskit/editor-core entry-point.

  ### WHY?

  We are making the editor-core package smaller to reduce bundle size and make it easier to scale as
  its functionality grows.

  The long term goal is that the core editor is lightweight and its feature set is enriched by the
  powerful plugin system developed (and used via the `ComposableEditor`).

  This change is made to reduce how the core editor is coupled to its functionality by removing
  exports that can be imported from other packages and cleanup up props that are unused internally.

  ### WHAT/HOW?

  The following lists the exports removed as well as where they can now be found if required.

  Exports removed:

  - ToolbarFeedback (removed)
  - EmojiResource (moved to -> @atlaskit/emoji/resource)
  - MentionResource (moved to -> @atlaskit/mention/resource)
  - MentionProvider (moved to -> @atlaskit/mention/resource)
  - PresenceProvider (moved to -> @atlaskit/mention/resource)
  - TeamMentionProvider (moved to -> @atlaskit/mention/team-resource)
  - AnnotationUpdateEmitter (moved to -> @atlaskit/editor-common/annotation)
  - UpdateEvent (moved to -> @atlaskit/editor-common/annotation)
  - AnnotationProviders (moved to -> @atlaskit/editor-plugins/annotation)
  - InlineCommentAnnotationProvider (moved to -> @atlaskit/editor-plugins/annotation)
  - InlineCommentCreateComponentProps (moved to -> @atlaskit/editor-plugins/annotation)
  - InlineCommentViewComponentProps (moved to -> @atlaskit/editor-plugins/annotation)
  - AnnotationInfo (moved to -> @atlaskit/editor-plugins/annotation)
  - AnnotationState (moved to -> @atlaskit/editor-plugins/annotation)
  - AnnotationTypeProvider (moved to -> @atlaskit/editor-plugins/annotation)
  - InlineCommentState (moved to -> @atlaskit/editor-plugins/annotation)
  - TypeAheadItem (moved to -> @atlaskit/editor-common/provider-factory)
  - INPUT_METHOD (moved to -> @atlaskit/editor-common/analytics)
  - ACTION (moved to -> @atlaskit/editor-common/analytics)
  - ACTION_SUBJECT (moved to -> @atlaskit/editor-common/analytics)
  - ACTION_SUBJECT_ID (moved to -> @atlaskit/editor-common/analytics)
  - EVENT_TYPE (moved to -> @atlaskit/editor-common/analytics)
  - MacroProvider (moved to -> @atlaskit/editor-common/provider-factory) (except proforma-dc)
  - MacroAttributes (moved to -> @atlaskit/editor-common/provider-factory) (except proforma-dc)
  - ExtensionType (moved to -> @atlaskit/editor-common/provider-factory)
  - CardProvider (moved to -> @atlaskit/editor-common/provider-factory)
  - MediaProvider (moved to -> @atlaskit/editor-common/provider-factory)
  - MediaOptions (moved to -> @atlaskit/editor-plugins/media/types)
  - QuickInsertItem (moved to -> @atlaskit/editor-common/provider-factory)
  - QuickInsertProvider (moved to -> @atlaskit/editor-common/provider-factory)

  The following lists the editor props removed. Generally these are not used by the editor at all
  and can be safely removed without any change in functionality

  EditorProps removed:

  - trackValidTransactions (unused internally, please remove)
  - hideAvatarGroup (unused internally, please remove)
  - placeholder (unused internally for `ComposableEditor` - please pass to the `placeholderPlugin`
    options)
  - placeholderBracketHint (unused internally for `ComposableEditor` - please pass to the
    `placeholderPlugin` options)
  - allowJiraIssue (unused internally, please remove)
  - allowNewInsertionBehaviour (unused internally, please remove)
  - UNSAFE_allowBorderMark (use `allowBorderMark` instead)

## 11.11.1

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 11.11.0

### Minor Changes

- [#134932](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134932)
  [`e3993d306949f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e3993d306949f) -
  [ED-24520] Added support for nesting codeblock and media inside quotes to transformers
  (WikiMarkup, Markdown)

## 11.10.1

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`93bd7032842ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/93bd7032842ec) -
  [ux] [ED-24636] Bump ADF Schema package

## 11.10.0

### Minor Changes

- [#130284](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130284)
  [`0d9df059ffdf5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0d9df059ffdf5) -
  Switched WikiMarkup logic to convert nestedExpands at the root to expands instead of tables

## 11.9.1

### Patch Changes

- Updated dependencies

## 11.9.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

### Patch Changes

- Updated dependencies

## 11.8.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 11.7.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

### Patch Changes

- Updated dependencies

## 11.6.1

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version

## 11.6.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

### Patch Changes

- Updated dependencies

## 11.5.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 11.4.2

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1

## 11.4.1

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 11.4.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 11.3.5

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 11.3.4

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 11.3.3

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2

## 11.3.2

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1

## 11.3.1

### Patch Changes

- [#93689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93689)
  [`5ba5d2b4a9ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ba5d2b4a9ac) -
  Updating adf-schema version to 35.10.0

## 11.3.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 11.2.49

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options

## 11.2.48

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0

## 11.2.47

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0

## 11.2.46

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0

## 11.2.45

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 11.2.44

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0

## 11.2.43

### Patch Changes

- [#75947](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75947)
  [`43549c3789b1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/43549c3789b1) -
  Migrate @atlaskit/editor-core to use declarative entry points

## 11.2.42

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2

## 11.2.41

### Patch Changes

- [#77984](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77984)
  [`eb7139b3ec21`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eb7139b3ec21) -
  Replace hardcoded values with spacing tokens

## 11.2.40

### Patch Changes

- [#73858](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73858)
  [`925ea89ab300`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/925ea89ab300) -
  ED-21501 Add support for lists in blockquote in wiki->adf conversion

## 11.2.39

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 11.2.38

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 11.2.37

### Patch Changes

- [#70084](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70084)
  [`4d651eb93ab5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4d651eb93ab5) -
  Add editor-plugin-annotation pr and create shared utils for it in editor-test-helpers

## 11.2.36

### Patch Changes

- [#70027](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70027)
  [`995c21770b0e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/995c21770b0e) -
  Allow link key to be parsed inside colour macro.

## 11.2.35

### Patch Changes

- [#70481](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70481)
  [`7d54a51fcc1b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7d54a51fcc1b) -
  Revert node-nesting changes in wiki-transformer

## 11.2.34

### Patch Changes

- [#65965](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65965)
  [`ac054cbef9cd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ac054cbef9cd) -
  Migrate @atlaskit/editor-wikimarkup-transformer to use declarative entry points

## 11.2.33

### Patch Changes

- [#66546](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66546)
  [`6c0462257e75`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6c0462257e75) -
  ED-21612 Add support for rendering taskList inside bullet/ordered lists

## 11.2.32

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0

## 11.2.31

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 11.2.30

### Patch Changes

- [#60841](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60841)
  [`6312e96b9b70`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6312e96b9b70) -
  ED-21501 Add support for lists in blockquote in wiki->adf conversion

## 11.2.29

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808)
  [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) -
  ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 11.2.28

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246)
  [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) -
  ED-21371 Update adf-schema to 35.1.0

## 11.2.27

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 11.2.26

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763)
  [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) -
  update ADF schema

## 11.2.25

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790)
  [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) -
  ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 11.2.24

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417)
  [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971
  Upgrade adf-schema package to ^34.0.0

## 11.2.23

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379)
  [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763
  Upgrade ADF schema version to 33.2.3 for MBE nodes.

## 11.2.22

### Patch Changes

- [#42761](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42761)
  [`5d1881c7ed0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d1881c7ed0) - Adds
  @ak/tokens as a dependency

## 11.2.21

### Patch Changes

- [#42963](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42963)
  [`b82377fa7ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b82377fa7ae) - Changed
  brace-wrapped formatting marks to be considered valid even if preceded/followed by alphanumeric
  characters

## 11.2.20

### Patch Changes

- [#41321](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41321)
  [`fa05c912164`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa05c912164) - avoid
  adding marks to text in code blocks

## 11.2.19

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749)
  [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect
  yarn changeset to packages, upgrade adf-schema

## 11.2.18

### Patch Changes

- [#39320](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39320)
  [`ec4867e1376`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec4867e1376) - Removed
  captions flag and replaced with a new media prop `allowCaptions`. `allowCaptions` is set to
  `false` by default and products will need to opt in to be able to use captions from now on.

## 11.2.17

### Patch Changes

- [#39481](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39481)
  [`aeb5c9a01e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aeb5c9a01e8) - Delete
  adf-schema from AFE and rely on npm package for adf-schema
- [`4b4dcfe0bba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b4dcfe0bba) - Delete
  adf-schema, use published version

## 11.2.16

### Patch Changes

- [#39744](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39744)
  [`15aeec90e88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/15aeec90e88) - Fixed
  text of atlassian-info emoji

## 11.2.15

### Patch Changes

- [#39237](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39237)
  [`0e484b0dfde`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e484b0dfde) - Improved
  behaviour of formatting marks around macros

## 11.2.14

### Patch Changes

- [#38976](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38976)
  [`33cb07de05f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33cb07de05f) - change
  adf-schema to fixed versioning

## 11.2.13

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 11.2.12

### Patch Changes

- [#38603](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38603)
  [`03022b35109`](https://bitbucket.org/atlassian/atlassian-frontend/commits/03022b35109) - Fix
  codeblock bug by reverting changes from ADFEXP-371. Strike througth fix will come in future patch

## 11.2.11

### Patch Changes

- Updated dependencies

## 11.2.10

### Patch Changes

- Updated dependencies

## 11.2.9

### Patch Changes

- Updated dependencies

## 11.2.8

### Patch Changes

- [#37785](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37785)
  [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) -
  [ED-19233] Import prosemirror libraries from internal facade package

## 11.2.7

### Patch Changes

- [#36798](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36798)
  [`93f5f1a9839`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93f5f1a9839) -
  [ED-18161] Move transformer tests to their dedicated transformers packages to avoid circular
  dependencies

## 11.2.6

### Patch Changes

- [#36241](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36241)
  [`5f5ba16de66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5ba16de66) -
  [ED-13910] Fix prosemirror types

## 11.2.5

### Patch Changes

- Updated dependencies

## 11.2.4

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 11.2.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 11.2.2

### Patch Changes

- [#33771](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33771)
  [`a142ba1aa28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a142ba1aa28) -
  [ED17172] Bump prosemirror-model to 1.16.0 and prosemirror-view to 1.23.7 and removed work-arounds
  for fixed issues

## 11.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 11.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 11.1.17

### Patch Changes

- [#33004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33004)
  [`0ffb55018c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ffb55018c9) - Revert
  "[ED-17172] Bumped prosemirror-view from 1.23.2 to 1.23.7 and removed work-around for fixed
  issues"

## 11.1.16

### Patch Changes

- [#33037](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33037)
  [`5ae242b554c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ae242b554c) - updated
  logic to handle multiple linebreaks inside a macro within a list

## 11.1.15

### Patch Changes

- [#32638](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32638)
  [`7c57f6550f7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c57f6550f7) - Updated
  metacharacter escaping logic in encoder

## 11.1.14

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 11.1.13

### Patch Changes

- [#28490](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28490)
  [`d907868ec78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d907868ec78) -
  ADFEXP-227 Wrap nestedExpand only at root level

## 11.1.12

### Patch Changes

- [#28438](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28438)
  [`e5c1d82be63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5c1d82be63) -
  ADFEXP-227 Wrap nestedExpand inside table

## 11.1.11

### Patch Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`5d317ed8aa3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d317ed8aa3) -
  ED-15882: Make editor-wikimarkup-transformer example page work, update tests for
  restartNumberedLists feature (custom start numbers for ordered lists)
- [`224a2482244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/224a2482244) -
  [ED-16166] Changes the renderer prop document type from any to DocNode

  BREAKING for `@atlaskit/renderer`: Previously the `document` prop for the renderer component had
  the type of `any`. This has now been changed to `DocNode` which comes from `@atlaskit/adf-schema`.

  Documents being passed into the renderer component will need to be updated to use this type.

  Example Usage:

  ```tsx
  import { DocNode } from '@atlaskit/adf-schema';

  const emptyDoc: DocNode = {
  	type: 'doc',
  	version: 1,
  	content: [],
  };
  ```

- [`3a35da6c331`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a35da6c331) - DTR-825
  ED-9775: added jamfselfservice:// to whitelistedURLPatterns
- Updated dependencies

## 11.1.10

### Patch Changes

- [#27498](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27498)
  [`6eb39a91ca0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb39a91ca0) - Fixed
  ADF parsing issue related to codeblock inside table header

## 11.1.9

### Patch Changes

- [#26721](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26721)
  [`13721843343`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13721843343) - Added
  support for multiple hardbreaks inside a table

## 11.1.8

### Patch Changes

- [#26277](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26277)
  [`0cc27eb485f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0cc27eb485f) - Added
  support for issue-key followed by punctuation marks

## 11.1.7

### Patch Changes

- [#25822](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25822)
  [`12399f5aaa1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12399f5aaa1) - Adding
  custom regex for escaping of media, link and mention.

## 11.1.6

### Patch Changes

- [#25506](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25506)
  [`ea34f8260e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea34f8260e3) - Wiki to
  adf: Tables headings to be strong by default

## 11.1.5

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 11.1.4

### Patch Changes

- [#25411](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25411)
  [`49280fb073e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49280fb073e) - Removing
  Array.at usage to support older browsers.

## 11.1.3

### Patch Changes

- [#24889](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24889)
  [`916af279b4d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/916af279b4d) - added
  validation to handle strong mark under list

## 11.1.2

### Patch Changes

- Updated dependencies

## 11.1.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 11.1.0

### Minor Changes

- [#23593](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23593)
  [`635a121bf58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/635a121bf58) - Add
  option to suppress default image width and height in wikimarkup transformer

## 11.0.16

### Patch Changes

- [#23396](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23396)
  [`2760fbd2066`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2760fbd2066) -
  ESS-2569: fixed backslash issue in roundtrip wiki to adf

## 11.0.15

### Patch Changes

- [#23390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23390)
  [`273a8696f10`](https://bitbucket.org/atlassian/atlassian-frontend/commits/273a8696f10) - ESS-2539
  Handle token with empty nodes

## 11.0.14

### Patch Changes

- [#23215](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23215)
  [`21684885de9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21684885de9) - ESS-2539
  Insert hardbreaks between text properly

## 11.0.13

### Patch Changes

- [#23177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23177)
  [`82576043a8a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/82576043a8a) - ESS-2539
  Added new test cases for line-breaks

## 11.0.12

### Patch Changes

- [#23092](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23092)
  [`6a6291137de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a6291137de) - Handle
  hardbreaks and force-line-breaks differently

## 11.0.11

### Patch Changes

- [#22935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22935)
  [`31ea1d0b1f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31ea1d0b1f8) - Escape
  opening braces for only macro keywords

## 11.0.10

### Patch Changes

- [#22112](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22112)
  [`c0315117480`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0315117480) - ESS-2375
  Text effects should support surrounding curly braces

## 11.0.9

### Patch Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`daa1dac9961`](https://bitbucket.org/atlassian/atlassian-frontend/commits/daa1dac9961) - Update
  the @atlaskit/editor-wikimarkup-transformer to use emotion instead of styled and also updated the
  dependencies
- Updated dependencies

## 11.0.8

### Patch Changes

- [#21951](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21951)
  [`ca8996c6153`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca8996c6153) - ESS-2439
  Remove bad characters from end of regex match

## 11.0.7

### Patch Changes

- [#21923](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21923)
  [`21ae957a8fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21ae957a8fb) - ESS-2440
  Render consecutive emojis correctly

## 11.0.6

### Patch Changes

- [#21834](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21834)
  [`c85e50ef2ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c85e50ef2ad) -
  ESS-2439: Ignore closing parenthesis as part of url

## 11.0.5

### Patch Changes

- [#21447](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21447)
  [`34d3354b80e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34d3354b80e) -
  ESS-1402: bug fix to parse the non-breaking space wikimarkup to adf.

## 11.0.4

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 11.0.3

### Patch Changes

- [#20033](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20033)
  [`b29ce16dad8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b29ce16dad8) -
  [ED-14606] Move bitbucket schema, confluence schema, jira schema, and default schema from
  @atlaskit/adf-schema to their own entry points. These new entry points are as follows

  @atlaskit/adf-schema/schema-bitbucket for:

  - bitbucketSchema

  @atlaskit/adf-schema/schema-confluence for:

  - confluenceSchema
  - confluenceSchemaWithMediaSingle

  @atlaskit/adf-schema/schema-jira for:

  - default as createJIRASchema
  - isSchemaWithLists
  - isSchemaWithMentions
  - isSchemaWithEmojis
  - isSchemaWithLinks
  - isSchemaWithAdvancedTextFormattingMarks
  - isSchemaWithCodeBlock
  - isSchemaWithBlockQuotes
  - isSchemaWithMedia
  - isSchemaWithSubSupMark
  - isSchemaWithTextColor
  - isSchemaWithTables

  @atlaskit/adf-schema/schema-default for:

  - defaultSchema
  - getSchemaBasedOnStage
  - defaultSchemaConfig

  This change also includes codemods in @atlaskit/adf-schema to update these entry points. It also
  introduces a new util function "changeImportEntryPoint" to @atlaskit/codemod-utils to handle this
  scenario.

- Updated dependencies

## 11.0.2

### Patch Changes

- Updated dependencies

## 11.0.1

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - ED-13753
  Updated editor-common import entries.
- Updated dependencies

## 11.0.0

### Major Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`8f0577e0eb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f0577e0eb1) - [ux]
  Promoted captions to full schema and better support of wikimarkup, email and slack renderer

### Patch Changes

- [`c6feed82071`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6feed82071) -
  ED-11632: Bump prosemirror packages;

  - prosmirror-commands 1.1.4 -> 1.1.11,
  - prosemirror-model 1.11.0 -> 1.14.3,
  - prosemirror-state 1.3.3 -> 1.3.4,
  - prosemirror-transform 1.2.8 -> 1.3.2,
  - prosemirror-view 1.15.4 + 1.18.8 -> 1.20.2.

- Updated dependencies

## 10.0.0

### Major Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`ad7872a08ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad7872a08ed) - Add
  media inline component to wikimarkup, slack markdown, email renderer transformers

### Patch Changes

- Updated dependencies

## 9.5.3

### Patch Changes

- Updated dependencies

## 9.5.2

### Patch Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`aa6f29f8c3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa6f29f8c3d) - Setting
  up empty string value for alt attribute (images) by default
- Updated dependencies

## 9.5.1

### Patch Changes

- [#13035](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13035)
  [`cdfde784f56`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cdfde784f56) - [ux]
  When converting from wikimarkup to ADF, if there is a parse error in an adf macro, put it in a
  code block with an error message instead of crashing (ADFS-719)

## 9.5.0

### Minor Changes

- [#12769](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12769)
  [`d3945f52eeb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3945f52eeb) - Remove
  nulls when parsing and encoding wiki

## 9.4.0

### Minor Changes

- [#12261](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12261)
  [`99ad5d22649`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99ad5d22649) - Scope
  control characters inside of invalid links

## 9.3.3

### Patch Changes

- [#12175](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12175)
  [`7cb32dce7eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7cb32dce7eb) - ADFS-700
  trailing whitespaces don't open a new table cell

## 9.3.2

### Patch Changes

- [#11898](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11898)
  [`b7375e1a3fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7375e1a3fc) - ADFS-670
  Performance improvement by replacing string buffer with array buffer

## 9.3.1

### Patch Changes

- Updated dependencies

## 9.3.0

### Minor Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`2fd50f55028`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2fd50f55028) - Updating
  documentation to inform users that soon picker popup will no longer be available and also getting
  rid of picker popup references in examples and all the associated dependencies

### Patch Changes

- Updated dependencies

## 9.2.4

### Patch Changes

- Updated dependencies

## 9.2.3

### Patch Changes

- [#9913](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9913)
  [`2c8bafbcca0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c8bafbcca0) - ADFS-453
  wiki transformer - Nested lists have size limit

## 9.2.2

### Patch Changes

- [#9510](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9510)
  [`58b170725be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58b170725be) - Renamed
  @atlaskit/editor-test-helpers/schema-builder to @atlaskit/editor-test-helpers/doc-builder
- Updated dependencies

## 9.2.1

### Patch Changes

- Updated dependencies

## 9.2.0

### Minor Changes

- [#9362](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9362)
  [`e00e0159214`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e00e0159214) -
  ADFS-456: Add support for image links in wikimarkup converter

## 9.1.0

### Minor Changes

- [#9147](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9147)
  [`a882576542d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a882576542d) - Adjust
  status node colors - ADFS-40

## 9.0.1

### Patch Changes

- Updated dependencies

## 9.0.0

### Major Changes

- [#7170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7170)
  [`9242f60d20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9242f60d20) - Support
  anchor link starting with #

### Patch Changes

- Updated dependencies

## 8.4.0

### Minor Changes

- [#6571](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6571)
  [`21de2f736a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21de2f736a) - fix:
  normalizeHexColor behaves normally when passed 'default'

### Patch Changes

- Updated dependencies

## 8.3.5

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 8.3.4

### Patch Changes

- [#6228](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6228)
  [`0175a00afc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0175a00afc) - [ED-10670]
  Update prosemirror-model type to use posAtIndex methods
- Updated dependencies

## 8.3.3

### Patch Changes

- [#5860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5860)
  [`703752d487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/703752d487) - ED-10647
  Remove caret from prosemirror-model, prosemirror-keymap, prosemirror-state, prosemirror-transform
  to lock them down to an explicit version
- Updated dependencies

## 8.3.2

### Patch Changes

- [#6010](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6010)
  [`cc8bfdf7a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc8bfdf7a7) - ADFS-255
  bugfix: wiki transformer correctly passes through context object

## 8.3.1

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 8.3.0

### Minor Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`9a39500244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a39500244) - Bump
  ProseMirror packages

  Read more: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1671956531/2020-08

### Patch Changes

- Updated dependencies

## 8.2.0

### Minor Changes

- [#5100](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5100)
  [`183473232a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/183473232a) - CS-3136
  bugfix: media single after media group no longer disappears

## 8.1.0

### Minor Changes

- [#5087](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5087)
  [`e6001d9b35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6001d9b35) - CS-3139
  Rewrote query string parser to not escape sensitive characters (querystring parser was used
  previously)

## 8.0.0

### Major Changes

- [#4901](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4901)
  [`b809a4501a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b809a4501a) - CS-3128
  context object for wiki media files is extended with `embed` property to properly round trip
  non-embeddable media

## 7.2.0

### Minor Changes

- [#4570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4570)
  [`cd32d3a1f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd32d3a1f4) - CS-3048
  Embed cards now round trip in wiki<->adf conversions

## 7.1.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 7.1.0

### Minor Changes

- [#3724](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3724)
  [`5b4f43d395`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b4f43d395) - CS-2987
  basic emojis now behave the same way as in wiki renderer

## 7.0.0

### Major Changes

- [#3424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3424)
  [`35ca66b0ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35ca66b0ac) - CS-2956
  Limit lists to max nesting level

## 6.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 5.7.1

### Patch Changes

- Updated dependencies

## 5.7.0

### Minor Changes

- [#2847](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2847)
  [`4feba15469`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4feba15469) - CS-2801
  querystring replaced with querystring-es3 for browser compatibility

## 5.6.0

### Minor Changes

- [#2803](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2803)
  [`41efaca0e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41efaca0e1) - Allow
  setting of individual cellstyles in wikimarkup

## 5.5.0

### Minor Changes

- [#2733](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2733)
  [`6aa26e54a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6aa26e54a5) - CS-2800
  mediaGroup and mediaSingle next to each other now works
- [#2735](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2735)
  [`a050c2ff0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a050c2ff0c) - CS-2200
  wiki transformer doesn't break table with empty new line

## 5.4.1

### Patch Changes

- Updated dependencies

## 5.4.0

### Minor Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868)
  [`d0051d49a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0051d49a6) - Conversion
  mapping has been made case insensitive

### Patch Changes

- Updated dependencies

## 5.3.2

### Patch Changes

- Updated dependencies
  [7e4d4a7ed4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e4d4a7ed4):
- Updated dependencies
  [999fbf849e](https://bitbucket.org/atlassian/atlassian-frontend/commits/999fbf849e):
- Updated dependencies
  [b202858f6c](https://bitbucket.org/atlassian/atlassian-frontend/commits/b202858f6c):
- Updated dependencies
  [9cee2b03e8](https://bitbucket.org/atlassian/atlassian-frontend/commits/9cee2b03e8):
- Updated dependencies
  [26de083801](https://bitbucket.org/atlassian/atlassian-frontend/commits/26de083801):
- Updated dependencies
  [d3cc97a424](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3cc97a424):
- Updated dependencies
  [00f64f4eb8](https://bitbucket.org/atlassian/atlassian-frontend/commits/00f64f4eb8):
- Updated dependencies
  [4f70380793](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f70380793):
- Updated dependencies
  [92d04b5c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/92d04b5c28):
- Updated dependencies
  [5b301bcdf6](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b301bcdf6):
- Updated dependencies
  [729a4e4960](https://bitbucket.org/atlassian/atlassian-frontend/commits/729a4e4960):
- Updated dependencies
  [22704db5a3](https://bitbucket.org/atlassian/atlassian-frontend/commits/22704db5a3):
- Updated dependencies
  [5f075c4fd2](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f075c4fd2):
- Updated dependencies
  [c8d0ce5b94](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8d0ce5b94):
- Updated dependencies
  [384791fb2b](https://bitbucket.org/atlassian/atlassian-frontend/commits/384791fb2b):
- Updated dependencies
  [c6b145978b](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6b145978b):
- Updated dependencies
  [736507f8e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/736507f8e0):
- Updated dependencies
  [cf41823165](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf41823165):
- Updated dependencies
  [9e3646b59e](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e3646b59e):
- Updated dependencies
  [aec7fbadcc](https://bitbucket.org/atlassian/atlassian-frontend/commits/aec7fbadcc):
- Updated dependencies
  [e477132440](https://bitbucket.org/atlassian/atlassian-frontend/commits/e477132440):
  - @atlaskit/editor-core@122.0.0
  - @atlaskit/editor-common@45.1.0
  - @atlaskit/adf-schema@9.0.1
  - @atlaskit/renderer@58.0.0
  - @atlaskit/editor-json-transformer@7.0.11
  - @atlaskit/editor-test-helpers@11.1.1

## 5.3.1

### Patch Changes

- [patch][a681101c2b](https://bitbucket.org/atlassian/atlassian-frontend/commits/a681101c2b):

  CS-2084 Media width clamps between 0-100%- Updated dependencies
  [2a87a3bbc5](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a87a3bbc5):

- Updated dependencies
  [04e54bf405](https://bitbucket.org/atlassian/atlassian-frontend/commits/04e54bf405):
- Updated dependencies
  [cf7a2d7506](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf7a2d7506):
- Updated dependencies
  [759f0a5ca7](https://bitbucket.org/atlassian/atlassian-frontend/commits/759f0a5ca7):
- Updated dependencies
  [9f43b9f0ca](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f43b9f0ca):
- Updated dependencies
  [c74cc954d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74cc954d8):
- Updated dependencies
  [b4326a7eba](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4326a7eba):
- Updated dependencies
  [e4076915c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4076915c8):
- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies
  [bdb4da1fc0](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdb4da1fc0):
- Updated dependencies
  [c51f0b4c70](https://bitbucket.org/atlassian/atlassian-frontend/commits/c51f0b4c70):
- Updated dependencies
  [16c193eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/16c193eb3e):
- Updated dependencies
  [7ec160c0e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ec160c0e2):
- Updated dependencies
  [5d430f7d37](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d430f7d37):
- Updated dependencies
  [7e26fba915](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e26fba915):
- Updated dependencies
  [5167f09a83](https://bitbucket.org/atlassian/atlassian-frontend/commits/5167f09a83):
- Updated dependencies
  [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies
  [91ff8d36f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/91ff8d36f0):
- Updated dependencies
  [05539b052e](https://bitbucket.org/atlassian/atlassian-frontend/commits/05539b052e):
- Updated dependencies
  [a1ee397cbc](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1ee397cbc):
- Updated dependencies
  [dc84dfa3bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc84dfa3bc):
- Updated dependencies
  [318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):
- Updated dependencies
  [550c4b5018](https://bitbucket.org/atlassian/atlassian-frontend/commits/550c4b5018):
- Updated dependencies
  [03a83cb954](https://bitbucket.org/atlassian/atlassian-frontend/commits/03a83cb954):
- Updated dependencies
  [e21800fd1c](https://bitbucket.org/atlassian/atlassian-frontend/commits/e21800fd1c):
- Updated dependencies
  [258a36b51f](https://bitbucket.org/atlassian/atlassian-frontend/commits/258a36b51f):
- Updated dependencies
  [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies
  [205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):
- Updated dependencies
  [1a48183584](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a48183584):
- Updated dependencies
  [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies
  [823d80f31c](https://bitbucket.org/atlassian/atlassian-frontend/commits/823d80f31c):
- Updated dependencies
  [41917f4c16](https://bitbucket.org/atlassian/atlassian-frontend/commits/41917f4c16):
- Updated dependencies
  [de6548dae5](https://bitbucket.org/atlassian/atlassian-frontend/commits/de6548dae5):
- Updated dependencies
  [9dd4b9088b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd4b9088b):
- Updated dependencies
  [0b22d3b9ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b22d3b9ea):
- Updated dependencies
  [91304da441](https://bitbucket.org/atlassian/atlassian-frontend/commits/91304da441):
- Updated dependencies
  [b4ef7fe214](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ef7fe214):
- Updated dependencies
  [3644fc1afe](https://bitbucket.org/atlassian/atlassian-frontend/commits/3644fc1afe):
- Updated dependencies
  [971df84f45](https://bitbucket.org/atlassian/atlassian-frontend/commits/971df84f45):
- Updated dependencies
  [17a46dd016](https://bitbucket.org/atlassian/atlassian-frontend/commits/17a46dd016):
- Updated dependencies
  [0ab75c545b](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ab75c545b):
- Updated dependencies
  [62f1f218d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/62f1f218d9):
- Updated dependencies
  [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies
  [6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):
- Updated dependencies
  [5f75dd27c9](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f75dd27c9):
- Updated dependencies
  [f3587bae11](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3587bae11):
- Updated dependencies
  [287be84065](https://bitbucket.org/atlassian/atlassian-frontend/commits/287be84065):
- Updated dependencies
  [fb8725beac](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb8725beac):
  - @atlaskit/editor-core@121.0.0
  - @atlaskit/adf-schema@9.0.0
  - @atlaskit/editor-common@45.0.0
  - @atlaskit/renderer@57.0.0
  - @atlaskit/docs@8.5.1
  - @atlaskit/editor-test-helpers@11.1.0
  - @atlaskit/theme@9.5.3
  - @atlaskit/editor-json-transformer@7.0.10

## 5.3.0

### Minor Changes

- [minor][b84165f140](https://bitbucket.org/atlassian/atlassian-frontend/commits/b84165f140):

  Degrade status node from adf to wiki-
  [minor][2441d47f61](https://bitbucket.org/atlassian/atlassian-frontend/commits/2441d47f61):

  CS-1878 Wiki media with in percent is now accepted-
  [minor][eb17c8c9c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb17c8c9c8):

  CS-1881 adf-wiki degrade custom emojis-
  [minor][06f238c8ff](https://bitbucket.org/atlassian/atlassian-frontend/commits/06f238c8ff):

  CS-1879 Wiki converter preserves alt text-
  [minor][61521009b2](https://bitbucket.org/atlassian/atlassian-frontend/commits/61521009b2):

  CS-1876 adf-wiki conversion drops adf-only table formatting-
  [minor][f4e4cfe635](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4e4cfe635):

  CS-1800-degrade-decision-task-node-
  [minor][ef15388b82](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef15388b82):

  CS-1882-degrade-date-node-
  [minor][e9a39ce39d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9a39ce39d):

  CS-1883 Wiki convertor - degrade native expand

### Patch Changes

- Updated dependencies
  [9fd8ba7707](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fd8ba7707):
- Updated dependencies
  [bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):
- Updated dependencies
  [7d80e44c09](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d80e44c09):
- Updated dependencies
  [4c691c3b5f](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c691c3b5f):
- Updated dependencies
  [d63513575b](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63513575b):
- Updated dependencies
  [1386afaecc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1386afaecc):
- Updated dependencies
  [48f0ecf23e](https://bitbucket.org/atlassian/atlassian-frontend/commits/48f0ecf23e):
- Updated dependencies
  [130b83ccba](https://bitbucket.org/atlassian/atlassian-frontend/commits/130b83ccba):
- Updated dependencies
  [5180a51c0d](https://bitbucket.org/atlassian/atlassian-frontend/commits/5180a51c0d):
- Updated dependencies
  [584279e2ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/584279e2ae):
- Updated dependencies
  [067febb0a7](https://bitbucket.org/atlassian/atlassian-frontend/commits/067febb0a7):
- Updated dependencies
  [66cf61863f](https://bitbucket.org/atlassian/atlassian-frontend/commits/66cf61863f):
- Updated dependencies
  [f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):
- Updated dependencies
  [22d9c96ed2](https://bitbucket.org/atlassian/atlassian-frontend/commits/22d9c96ed2):
- Updated dependencies
  [a9e9604c8e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a9e9604c8e):
- Updated dependencies
  [8126e7648c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8126e7648c):
- Updated dependencies
  [b41beace3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/b41beace3f):
- Updated dependencies
  [02425bf2d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/02425bf2d7):
- Updated dependencies
  [6b4fe5d0e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b4fe5d0e0):
- Updated dependencies
  [953cfadbe3](https://bitbucket.org/atlassian/atlassian-frontend/commits/953cfadbe3):
- Updated dependencies
  [29b0315dcb](https://bitbucket.org/atlassian/atlassian-frontend/commits/29b0315dcb):
- Updated dependencies
  [53ebcdb974](https://bitbucket.org/atlassian/atlassian-frontend/commits/53ebcdb974):
- Updated dependencies
  [4bec09aa74](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bec09aa74):
- Updated dependencies
  [aa4dc7f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa4dc7f5d6):
- Updated dependencies
  [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies
  [13a0e50f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/13a0e50f38):
- Updated dependencies
  [0a0a54cb47](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a0a54cb47):
- Updated dependencies
  [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
- Updated dependencies
  [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies
  [bdf25b1c4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf25b1c4c):
- Updated dependencies
  [6242ec17a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/6242ec17a2):
- Updated dependencies
  [6b65ae4f04](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b65ae4f04):
- Updated dependencies
  [645918eda6](https://bitbucket.org/atlassian/atlassian-frontend/commits/645918eda6):
- Updated dependencies
  [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
- Updated dependencies
  [715572f9e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/715572f9e5):
- Updated dependencies
  [cc54ca2490](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc54ca2490):
  - @atlaskit/editor-core@120.0.0
  - @atlaskit/adf-schema@8.0.0
  - @atlaskit/editor-common@44.1.0
  - @atlaskit/renderer@56.0.0
  - @atlaskit/mention@18.18.0
  - @atlaskit/editor-test-helpers@11.0.0
  - @atlaskit/docs@8.5.0
  - @atlaskit/editor-json-transformer@7.0.9

## 5.2.3

### Patch Changes

- [patch][43d0b6fede](https://bitbucket.org/atlassian/atlassian-frontend/commits/43d0b6fede):

  CS-1911-fix-issue-in-exclaimation-mark- Updated dependencies
  [bc380c30ce](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc380c30ce):

- Updated dependencies
  [cc0d9f6ede](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc0d9f6ede):
- Updated dependencies
  [6384746272](https://bitbucket.org/atlassian/atlassian-frontend/commits/6384746272):
- Updated dependencies
  [7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):
- Updated dependencies
  [956a70b918](https://bitbucket.org/atlassian/atlassian-frontend/commits/956a70b918):
- Updated dependencies
  [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies
  [3494940acd](https://bitbucket.org/atlassian/atlassian-frontend/commits/3494940acd):
- Updated dependencies
  [5bb23adac3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bb23adac3):
- Updated dependencies
  [ebee5c7429](https://bitbucket.org/atlassian/atlassian-frontend/commits/ebee5c7429):
- Updated dependencies
  [680a61dc5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/680a61dc5a):
- Updated dependencies
  [57096fc043](https://bitbucket.org/atlassian/atlassian-frontend/commits/57096fc043):
- Updated dependencies
  [b17120e768](https://bitbucket.org/atlassian/atlassian-frontend/commits/b17120e768):
- Updated dependencies
  [92e0b393f5](https://bitbucket.org/atlassian/atlassian-frontend/commits/92e0b393f5):
- Updated dependencies
  [ac8639dfd8](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac8639dfd8):
- Updated dependencies
  [2f0df19890](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f0df19890):
- Updated dependencies
  [2475d1c9d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/2475d1c9d8):
- Updated dependencies
  [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies
  [113d075684](https://bitbucket.org/atlassian/atlassian-frontend/commits/113d075684):
- Updated dependencies
  [af8a3763dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/af8a3763dd):
- Updated dependencies
  [21a1faf014](https://bitbucket.org/atlassian/atlassian-frontend/commits/21a1faf014):
- Updated dependencies
  [c171660346](https://bitbucket.org/atlassian/atlassian-frontend/commits/c171660346):
- Updated dependencies
  [94116c6018](https://bitbucket.org/atlassian/atlassian-frontend/commits/94116c6018):
- Updated dependencies
  [9fadef064b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fadef064b):
- Updated dependencies
  [27fde59914](https://bitbucket.org/atlassian/atlassian-frontend/commits/27fde59914):
- Updated dependencies
  [f8ffc8320f](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8ffc8320f):
- Updated dependencies
  [b18fc8a1b6](https://bitbucket.org/atlassian/atlassian-frontend/commits/b18fc8a1b6):
- Updated dependencies
  [469e9a2302](https://bitbucket.org/atlassian/atlassian-frontend/commits/469e9a2302):
- Updated dependencies
  [9957801602](https://bitbucket.org/atlassian/atlassian-frontend/commits/9957801602):
- Updated dependencies
  [a41d2345eb](https://bitbucket.org/atlassian/atlassian-frontend/commits/a41d2345eb):
- Updated dependencies
  [4ef23b6a15](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ef23b6a15):
- Updated dependencies
  [7baff84f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/7baff84f38):
- Updated dependencies
  [8cc5cc0603](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc5cc0603):
- Updated dependencies
  [5d8a0d4f5f](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d8a0d4f5f):
- Updated dependencies
  [faa96cee2a](https://bitbucket.org/atlassian/atlassian-frontend/commits/faa96cee2a):
- Updated dependencies
  [535286e8c4](https://bitbucket.org/atlassian/atlassian-frontend/commits/535286e8c4):
- Updated dependencies
  [c7b205c83f](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7b205c83f):
- Updated dependencies
  [703b72cdba](https://bitbucket.org/atlassian/atlassian-frontend/commits/703b72cdba):
- Updated dependencies
  [025842de1a](https://bitbucket.org/atlassian/atlassian-frontend/commits/025842de1a):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies
  [cd662c7e4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd662c7e4c):
- Updated dependencies
  [de64f9373c](https://bitbucket.org/atlassian/atlassian-frontend/commits/de64f9373c):
- Updated dependencies
  [93ac94a762](https://bitbucket.org/atlassian/atlassian-frontend/commits/93ac94a762):
- Updated dependencies
  [172a864d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/172a864d19):
- Updated dependencies
  [a5d0019a5e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5d0019a5e):
- Updated dependencies
  [6a417f2e52](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a417f2e52):
- Updated dependencies
  [e981669ba5](https://bitbucket.org/atlassian/atlassian-frontend/commits/e981669ba5):
- Updated dependencies
  [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
- Updated dependencies
  [fdf6c939e8](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdf6c939e8):
- Updated dependencies
  [395739b5ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/395739b5ef):
  - @atlaskit/editor-common@44.0.2
  - @atlaskit/editor-core@119.0.0
  - @atlaskit/adf-schema@7.0.0
  - @atlaskit/docs@8.4.0
  - @atlaskit/renderer@55.0.0
  - @atlaskit/mention@18.17.0
  - @atlaskit/util-data-test@13.1.2
  - @atlaskit/profilecard@12.4.0
  - @atlaskit/editor-test-helpers@10.6.1
  - @atlaskit/editor-json-transformer@7.0.8

## 5.2.2

### Patch Changes

- [patch][8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):

  Remove Karma tests - based on AFP-960- Updated dependencies
  [6403a54812](https://bitbucket.org/atlassian/atlassian-frontend/commits/6403a54812):

- Updated dependencies
  [9e90cb4336](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e90cb4336):
- Updated dependencies
  [e8a31c2714](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8a31c2714):
- Updated dependencies
  [f46330c0ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/f46330c0ab):
- Updated dependencies
  [d6f207a598](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f207a598):
- Updated dependencies
  [40359da294](https://bitbucket.org/atlassian/atlassian-frontend/commits/40359da294):
- Updated dependencies
  [151240fce9](https://bitbucket.org/atlassian/atlassian-frontend/commits/151240fce9):
- Updated dependencies
  [8d09cd0408](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d09cd0408):
- Updated dependencies
  [088f4f7d1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/088f4f7d1e):
- Updated dependencies
  [9d6b02c04f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d6b02c04f):
- Updated dependencies
  [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
- Updated dependencies
  [7aad7888b4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7aad7888b4):
- Updated dependencies
  [a1bc1e6637](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1bc1e6637):
- Updated dependencies
  [a5c3717d0b](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5c3717d0b):
- Updated dependencies
  [b924951169](https://bitbucket.org/atlassian/atlassian-frontend/commits/b924951169):
- Updated dependencies
  [37a79cb1bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/37a79cb1bc):
- Updated dependencies
  [47d7b34f75](https://bitbucket.org/atlassian/atlassian-frontend/commits/47d7b34f75):
- Updated dependencies
  [79cabaee0c](https://bitbucket.org/atlassian/atlassian-frontend/commits/79cabaee0c):
- Updated dependencies
  [5a0167db78](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a0167db78):
- Updated dependencies
  [ded54f7b9f](https://bitbucket.org/atlassian/atlassian-frontend/commits/ded54f7b9f):
- Updated dependencies
  [b3b2f413c1](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3b2f413c1):
- Updated dependencies
  [8f41931365](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f41931365):
- Updated dependencies
  [a4ddcbf7e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4ddcbf7e2):
- Updated dependencies
  [d59113061a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d59113061a):
- Updated dependencies
  [cedfb7766c](https://bitbucket.org/atlassian/atlassian-frontend/commits/cedfb7766c):
- Updated dependencies
  [2361b8d044](https://bitbucket.org/atlassian/atlassian-frontend/commits/2361b8d044):
- Updated dependencies
  [1028ab4db3](https://bitbucket.org/atlassian/atlassian-frontend/commits/1028ab4db3):
- Updated dependencies
  [57ea6ea77a](https://bitbucket.org/atlassian/atlassian-frontend/commits/57ea6ea77a):
- Updated dependencies
  [ff6e928368](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff6e928368):
- Updated dependencies
  [4b3ced1d9f](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b3ced1d9f):
- Updated dependencies
  [fdc0861682](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdc0861682):
- Updated dependencies
  [00ddcd52df](https://bitbucket.org/atlassian/atlassian-frontend/commits/00ddcd52df):
- Updated dependencies
  [e3a8052151](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3a8052151):
- Updated dependencies
  [198639cd06](https://bitbucket.org/atlassian/atlassian-frontend/commits/198639cd06):
- Updated dependencies
  [13f0bbc125](https://bitbucket.org/atlassian/atlassian-frontend/commits/13f0bbc125):
- Updated dependencies
  [d7749cb6ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7749cb6ab):
- Updated dependencies
  [c9842c9ada](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9842c9ada):
- Updated dependencies
  [02b2a2079c](https://bitbucket.org/atlassian/atlassian-frontend/commits/02b2a2079c):
  - @atlaskit/editor-core@118.0.0
  - @atlaskit/editor-common@44.0.0
  - @atlaskit/adf-schema@6.2.0
  - @atlaskit/renderer@54.0.0
  - @atlaskit/editor-test-helpers@10.6.0
  - @atlaskit/editor-json-transformer@7.0.7

## 5.2.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/theme@9.5.1
  - @atlaskit/adf-schema@6.1.1
  - @atlaskit/editor-common@43.4.1
  - @atlaskit/editor-core@117.0.2
  - @atlaskit/editor-json-transformer@7.0.6
  - @atlaskit/editor-test-helpers@10.5.1
  - @atlaskit/renderer@53.2.7
  - @atlaskit/mention@18.16.2
  - @atlaskit/util-data-test@13.1.1
  - @atlaskit/profilecard@12.3.7

## 5.2.0

### Minor Changes

- [minor][29b795981f](https://bitbucket.org/atlassian/atlassian-frontend/commits/29b795981f):

  CS-1901 macros in monospace convert into valid ADF

### Patch Changes

- [patch][f0a2a22ddb](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0a2a22ddb):

  CS-1896 - Empty mentions in wikimarkup should be converted to plaintext instead of empty adf
  mention nodes- Updated dependencies
  [06cd97123e](https://bitbucket.org/atlassian/atlassian-frontend/commits/06cd97123e):

- Updated dependencies
  [07b5311cb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/07b5311cb9):
- Updated dependencies
  [a4ded5368c](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4ded5368c):
- Updated dependencies
  [3b19e30129](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b19e30129):
- Updated dependencies
  [6f16f46632](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f16f46632):
- Updated dependencies
  [a1f50e6a54](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1f50e6a54):
- Updated dependencies
  [31558e1872](https://bitbucket.org/atlassian/atlassian-frontend/commits/31558e1872):
- Updated dependencies
  [6ca6aaa1d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ca6aaa1d7):
- Updated dependencies
  [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies
  [43e03f1c58](https://bitbucket.org/atlassian/atlassian-frontend/commits/43e03f1c58):
- Updated dependencies
  [63fe41d5c2](https://bitbucket.org/atlassian/atlassian-frontend/commits/63fe41d5c2):
- Updated dependencies
  [b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):
- Updated dependencies
  [d085ab4419](https://bitbucket.org/atlassian/atlassian-frontend/commits/d085ab4419):
- Updated dependencies
  [64752f2827](https://bitbucket.org/atlassian/atlassian-frontend/commits/64752f2827):
- Updated dependencies
  [f67dc5ae22](https://bitbucket.org/atlassian/atlassian-frontend/commits/f67dc5ae22):
- Updated dependencies
  [e40acffdfc](https://bitbucket.org/atlassian/atlassian-frontend/commits/e40acffdfc):
- Updated dependencies
  [0709d95a8a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0709d95a8a):
- Updated dependencies
  [28dcebde63](https://bitbucket.org/atlassian/atlassian-frontend/commits/28dcebde63):
- Updated dependencies
  [710897f340](https://bitbucket.org/atlassian/atlassian-frontend/commits/710897f340):
- Updated dependencies
  [b8da779506](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8da779506):
- Updated dependencies
  [bbbe360b71](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbbe360b71):
- Updated dependencies
  [3b37ec4c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b37ec4c28):
- Updated dependencies
  [655599414e](https://bitbucket.org/atlassian/atlassian-frontend/commits/655599414e):
  - @atlaskit/editor-core@117.0.0
  - @atlaskit/editor-test-helpers@10.5.0
  - @atlaskit/editor-common@43.4.0
  - @atlaskit/adf-schema@6.1.0
  - @atlaskit/renderer@53.2.6
  - @atlaskit/editor-json-transformer@7.0.5
  - @atlaskit/docs@8.3.1
  - @atlaskit/mention@18.16.1
  - @atlaskit/profilecard@12.3.6

## 5.1.1

### Patch Changes

- Updated dependencies
  [06f4f74d88](https://bitbucket.org/atlassian/atlassian-frontend/commits/06f4f74d88):
- Updated dependencies
  [80c1eaa275](https://bitbucket.org/atlassian/atlassian-frontend/commits/80c1eaa275):
- Updated dependencies
  [2b4ebaf2ed](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b4ebaf2ed):
- Updated dependencies
  [c64c471564](https://bitbucket.org/atlassian/atlassian-frontend/commits/c64c471564):
- Updated dependencies
  [5b8daf1843](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b8daf1843):
- Updated dependencies
  [c55f8e0284](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55f8e0284):
- Updated dependencies
  [b4ad0a502a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ad0a502a):
- Updated dependencies
  [7d2c702223](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d2c702223):
- Updated dependencies
  [6421a97672](https://bitbucket.org/atlassian/atlassian-frontend/commits/6421a97672):
- Updated dependencies
  [0eb8c5ff5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0eb8c5ff5a):
- Updated dependencies
  [3e87f5596a](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e87f5596a):
- Updated dependencies
  [3160e15523](https://bitbucket.org/atlassian/atlassian-frontend/commits/3160e15523):
- Updated dependencies
  [3f1d129a79](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f1d129a79):
- Updated dependencies
  [baa887053d](https://bitbucket.org/atlassian/atlassian-frontend/commits/baa887053d):
- Updated dependencies
  [2108ee74db](https://bitbucket.org/atlassian/atlassian-frontend/commits/2108ee74db):
- Updated dependencies
  [f3727d3830](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3727d3830):
- Updated dependencies
  [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies
  [dc48763970](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc48763970):
- Updated dependencies
  [909676b9de](https://bitbucket.org/atlassian/atlassian-frontend/commits/909676b9de):
- Updated dependencies
  [312feb4a6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/312feb4a6a):
- Updated dependencies
  [cf9858fa09](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf9858fa09):
- Updated dependencies
  [26dbe7be6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/26dbe7be6d):
- Updated dependencies
  [cfcd27b2e4](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfcd27b2e4):
- Updated dependencies
  [ec929ab10e](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec929ab10e):
  - @atlaskit/editor-core@116.2.0
  - @atlaskit/adf-schema@6.0.0
  - @atlaskit/editor-common@43.3.1
  - @atlaskit/renderer@53.2.5
  - @atlaskit/docs@8.3.0
  - @atlaskit/editor-test-helpers@10.4.3
  - @atlaskit/editor-json-transformer@7.0.4

## 5.1.0

### Minor Changes

- [minor][3cfee30115](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cfee30115):

  CS-1830 mentions are now prefixed with accountid:-
  [minor][dc94f578e9](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc94f578e9):

  CS-1798 Table newlines now accept CRLF (Windows) format as well

### Patch Changes

- [patch][7527bd9054](https://bitbucket.org/atlassian/atlassian-frontend/commits/7527bd9054):

  fixed a bug where formatted pipes would incorrectly be converted to tables when going from wiki to
  adf- Updated dependencies
  [761dcd6d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/761dcd6d19):

- Updated dependencies
  [5816cb91e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/5816cb91e0):
- Updated dependencies
  [faccb537d0](https://bitbucket.org/atlassian/atlassian-frontend/commits/faccb537d0):
- Updated dependencies
  [642b2f93ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/642b2f93ea):
- Updated dependencies
  [4898d64f46](https://bitbucket.org/atlassian/atlassian-frontend/commits/4898d64f46):
- Updated dependencies
  [8cf20f37ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cf20f37ae):
- Updated dependencies
  [a23aa4e4a8](https://bitbucket.org/atlassian/atlassian-frontend/commits/a23aa4e4a8):
- Updated dependencies
  [a753b0d6da](https://bitbucket.org/atlassian/atlassian-frontend/commits/a753b0d6da):
- Updated dependencies
  [b1ce12dffb](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1ce12dffb):
- Updated dependencies
  [4c4ae93de7](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c4ae93de7):
- Updated dependencies
  [edc4a4a7ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/edc4a4a7ae):
- Updated dependencies
  [e4f0ab434f](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4f0ab434f):
- Updated dependencies
  [3da54e6146](https://bitbucket.org/atlassian/atlassian-frontend/commits/3da54e6146):
- Updated dependencies
  [94ea01d1d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/94ea01d1d6):
- Updated dependencies
  [01dc5ed14b](https://bitbucket.org/atlassian/atlassian-frontend/commits/01dc5ed14b):
- Updated dependencies
  [fdaac966f4](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdaac966f4):
- Updated dependencies
  [54a499fb7b](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a499fb7b):
  - @atlaskit/adf-schema@5.0.0
  - @atlaskit/editor-core@116.1.0
  - @atlaskit/editor-common@43.3.0
  - @atlaskit/editor-test-helpers@10.4.1
  - @atlaskit/editor-json-transformer@7.0.3
  - @atlaskit/renderer@53.2.4

## 5.0.0

### Major Changes

- [major][97441f6abf](https://bitbucket.org/atlassian/atlassian-frontend/commits/97441f6abf):

  break down context object into hydration and conversion

### Minor Changes

- [minor][c58df17d72](https://bitbucket.org/atlassian/atlassian-frontend/commits/c58df17d72):

  EX-870 wiki transformer now accepts context for mapping media and mentions

### Patch Changes

- Updated dependencies
  [6042417190](https://bitbucket.org/atlassian/atlassian-frontend/commits/6042417190):
- Updated dependencies
  [26942487d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/26942487d1):
- Updated dependencies
  [d1055e0e50](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1055e0e50):
- Updated dependencies
  [8db35852ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/8db35852ab):
- Updated dependencies
  [98a904dd02](https://bitbucket.org/atlassian/atlassian-frontend/commits/98a904dd02):
- Updated dependencies
  [2ffdeb5a48](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ffdeb5a48):
- Updated dependencies
  [97d1245875](https://bitbucket.org/atlassian/atlassian-frontend/commits/97d1245875):
- Updated dependencies
  [4eefd368a8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4eefd368a8):
- Updated dependencies
  [9219b332cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/9219b332cb):
- Updated dependencies
  [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies
  [29643d4593](https://bitbucket.org/atlassian/atlassian-frontend/commits/29643d4593):
- Updated dependencies
  [99fc6250f9](https://bitbucket.org/atlassian/atlassian-frontend/commits/99fc6250f9):
- Updated dependencies
  [46e6693eb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/46e6693eb3):
- Updated dependencies
  [4cd37dd052](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cd37dd052):
- Updated dependencies
  [1f84cf7583](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f84cf7583):
- Updated dependencies
  [218fe01736](https://bitbucket.org/atlassian/atlassian-frontend/commits/218fe01736):
- Updated dependencies
  [dfb3b76a4b](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfb3b76a4b):
- Updated dependencies
  [985db883ac](https://bitbucket.org/atlassian/atlassian-frontend/commits/985db883ac):
- Updated dependencies
  [bed9c11960](https://bitbucket.org/atlassian/atlassian-frontend/commits/bed9c11960):
- Updated dependencies
  [a30fe6c66e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a30fe6c66e):
- Updated dependencies
  [fdf30da2db](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdf30da2db):
- Updated dependencies
  [83300f0b6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/83300f0b6d):
- Updated dependencies
  [d1c470507c](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1c470507c):
- Updated dependencies
  [fc1678c70d](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc1678c70d):
- Updated dependencies
  [2edd170a68](https://bitbucket.org/atlassian/atlassian-frontend/commits/2edd170a68):
- Updated dependencies
  [e5dd37f7a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5dd37f7a4):
- Updated dependencies
  [5abcab3f7e](https://bitbucket.org/atlassian/atlassian-frontend/commits/5abcab3f7e):
- Updated dependencies
  [5d13d33a60](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d13d33a60):
- Updated dependencies
  [81897eb2e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/81897eb2e6):
- Updated dependencies
  [1d421446bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d421446bc):
  - @atlaskit/editor-core@116.0.0
  - @atlaskit/editor-common@43.2.0
  - @atlaskit/renderer@53.2.3
  - @atlaskit/adf-schema@4.4.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/editor-test-helpers@10.4.0
  - @atlaskit/util-data-test@13.1.0
  - @atlaskit/editor-json-transformer@7.0.2

## 4.6.4

### Patch Changes

- [patch][004a2ac22c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/004a2ac22c):

  Fix linebreak on non-empty cell contents closing cell

- Updated dependencies
  [271945fd08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/271945fd08):
- Updated dependencies
  [a6663b9325](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6663b9325):
- Updated dependencies
  [5e4d1feec3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e4d1feec3):
- Updated dependencies
  [0f8d5df4cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f8d5df4cf):
- Updated dependencies
  [161a30be16](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/161a30be16):
- Updated dependencies
  [ecfbe83dfb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecfbe83dfb):
- Updated dependencies
  [ea0e619cc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea0e619cc7):
- Updated dependencies
  [93b445dcdc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93b445dcdc):
- Updated dependencies
  [49fbe3d3bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49fbe3d3bf):
- Updated dependencies
  [ded174361e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ded174361e):
- Updated dependencies
  [80eb127904](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80eb127904):
- Updated dependencies
  [ef2ba36d5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef2ba36d5c):
- Updated dependencies
  [8c84ed470e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c84ed470e):
- Updated dependencies
  [6e4b678428](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e4b678428):
- Updated dependencies
  [bb164fbd1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb164fbd1e):
- Updated dependencies
  [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies
  [b3fd0964f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3fd0964f2):
- Updated dependencies
  [40bec82851](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bec82851):
- Updated dependencies
  [8b652147a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b652147a5):
- Updated dependencies
  [b4fda095ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4fda095ef):
- Updated dependencies
  [0603c2fbf7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0603c2fbf7):
- Updated dependencies
  [72d4c3298d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d4c3298d):
- Updated dependencies
  [10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):
- Updated dependencies
  [5ef337766c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ef337766c):
- Updated dependencies
  [dc0999afc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc0999afc2):
- Updated dependencies
  [6764e83801](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6764e83801):
- Updated dependencies
  [553915553f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/553915553f):
- Updated dependencies
  [4700477bbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4700477bbe):
- Updated dependencies
  [7f8de51c36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f8de51c36):
- Updated dependencies
  [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
- Updated dependencies
  [9a261337b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a261337b5):
- Updated dependencies
  [3a7c0bfa32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a7c0bfa32):
- Updated dependencies
  [5455e35bc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5455e35bc0):
- Updated dependencies
  [cc1b89d310](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc1b89d310):
- Updated dependencies
  [2bb3af2382](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2bb3af2382):
- Updated dependencies
  [611dbe68ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/611dbe68ff):
- Updated dependencies
  [0ea0587ac5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ea0587ac5):
- Updated dependencies
  [938f1c2902](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/938f1c2902):
- Updated dependencies
  [926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):
  - @atlaskit/editor-common@43.0.0
  - @atlaskit/editor-core@115.0.0
  - @atlaskit/adf-schema@4.3.1
  - @atlaskit/mention@18.16.0
  - @atlaskit/renderer@53.2.0
  - @atlaskit/theme@9.3.0
  - @atlaskit/editor-test-helpers@10.3.0
  - @atlaskit/profilecard@12.3.5
  - @atlaskit/editor-json-transformer@7.0.1

## 4.6.3

### Patch Changes

- [patch][0ec8f5f9ce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ec8f5f9ce):

  wikimarkup auto-linkify text should include tilde, hat and exclamation marks

## 4.6.2

### Patch Changes

- [patch][d396ae22c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d396ae22c2):

  Rename wiki representation of blockCard from block-link to smart-card

## 4.6.1

### Patch Changes

- [patch][4aac2fe2d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aac2fe2d5):

  fix up the url encoding/decoding of commas in text links

## 4.6.0

### Minor Changes

- [minor][f7a20e9f3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7a20e9f3a):

  Add transformation of adf blockcard to wikimarkup compatible smart-link Add logic for converting
  inlinecard to blockcard when it is on its own line

## 4.5.9

- Updated dependencies
  [6d9c8a9073](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d9c8a9073):
- Updated dependencies
  [70e1055b8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70e1055b8f):
  - @atlaskit/adf-schema@4.3.0
  - @atlaskit/editor-common@42.0.0
  - @atlaskit/editor-core@114.1.0
  - @atlaskit/renderer@53.1.0
  - @atlaskit/editor-json-transformer@7.0.0
  - @atlaskit/editor-test-helpers@10.2.0

## 4.5.8

- Updated dependencies
  [f28c191f4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f28c191f4a):
- Updated dependencies
  [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/editor-json-transformer@6.3.5
  - @atlaskit/editor-test-helpers@10.1.3
  - @atlaskit/editor-core@114.0.0
  - @atlaskit/renderer@53.0.0
  - @atlaskit/editor-common@41.2.1

## 4.5.7

### Patch Changes

- [patch][650b9bd18d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/650b9bd18d):

  fix up issue in wikimarkup parser where a url with url-encoded values are double encoded when
  converted into ADF

## 4.5.6

### Patch Changes

- [patch][24165e116f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24165e116f):

  fix bug where bullet points and rulers inside monospace causes parse error

## 4.5.5

### Patch Changes

- [patch][ca7488595c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca7488595c):

  fix bug in the mediaGroup normalization logic where mediaGroup nodes are not merged together
  properly when there are more than one newline

## 4.5.4

### Patch Changes

- [patch][0a67332a0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a67332a0f):

  Fix bug where monospace wikimarkup fails to convert to ADF when it contains an attachment link

## 4.5.3

### Patch Changes

- [patch][cc28419139](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc28419139):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.-
  [patch][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

**FABDODGEM-13 Editor Damask Release** - [Internal post](http://go.atlassian.com/damask-release)

**BREAKING CHANGES**

- **Media:** Removed deprecated "context" property from media components in favor of
  "mediaClientConfig". This affects all public media UI components.
  - https://product-fabric.atlassian.net/browse/MS-2038
- **Tasks & Decisions:** Removed containerAri for task-decisions components.
  - https://product-fabric.atlassian.net/browse/ED-7631
- **Renderer:** Adapts to task-decision changes.
- **Editor Mobile Bridge:** Adapts to task-decision changes.
- **Util Data Test:** Adapts to task-decision changes.

---

**Affected Editor Components:**

tables, media, mobile, emoji, tasks & decisions, analytics

**Editor**

- Support nested actions in stage-0 schema; Change DOM representation of actions
  - https://product-fabric.atlassian.net/browse/ED-7674
- Updated i18n translations
  - https://product-fabric.atlassian.net/browse/ED-7750
- Improved analytics & crash reporting (via a new error boundary)
  - https://product-fabric.atlassian.net/browse/ED-7766
  - https://product-fabric.atlassian.net/browse/ED-7806
- Improvements to heading anchor links.
  - https://product-fabric.atlassian.net/browse/ED-7849
  - https://product-fabric.atlassian.net/browse/ED-7860
- Copy/Paste improvements
  - https://product-fabric.atlassian.net/browse/ED-7840
  - https://product-fabric.atlassian.net/browse/ED-7849
- Fixes for the selection state of Smart links.
  - https://product-fabric.atlassian.net/browse/ED-7602?src=confmacro
- Improvements for table resizing & column creation.
  - https://product-fabric.atlassian.net/browse/ED-7698
  - https://product-fabric.atlassian.net/browse/ED-7319
  - https://product-fabric.atlassian.net/browse/ED-7799

**Mobile**

- GASv3 Analytics Events are now relayed from the web to the native context, ready for dispatching.
  - https://product-fabric.atlassian.net/browse/FM-2502
- Hybrid Renderer Recycler view now handles invalid ADF nodes gracefully.
  - https://product-fabric.atlassian.net/browse/FM-2370

**Media**

- Improved analytics
  - https://product-fabric.atlassian.net/browse/MS-2036
  - https://product-fabric.atlassian.net/browse/MS-2145
  - https://product-fabric.atlassian.net/browse/MS-2416
  - https://product-fabric.atlassian.net/browse/MS-2487
- Added shouldOpenMediaViewer property to renderer
  - https://product-fabric.atlassian.net/browse/MS-2393
- Implemented analytics for file copy
  - https://product-fabric.atlassian.net/browse/MS-2036
- New `media-viewed` event dispatched when media is interacted with via the media card or viewer.
  - https://product-fabric.atlassian.net/browse/MS-2284
- Support for `alt` text attribute on media image elements.
  - https://product-fabric.atlassian.net/browse/ED-7776

**i18n-tools**

Bumped dependencies.

- [patch][c64e893ef8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c64e893ef8):

  merge multiple media groups with single child media node into one media group with multiple
  children media nodes

- Updated dependencies
  [4585681e3d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4585681e3d):
- Updated dependencies
  [bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):
  - @atlaskit/renderer@52.0.0
  - @atlaskit/editor-core@113.2.0
  - @atlaskit/editor-common@41.2.0
  - @atlaskit/editor-json-transformer@6.3.4
  - @atlaskit/profilecard@12.3.3
  - @atlaskit/util-data-test@13.0.0

## 4.5.2

### Patch Changes

- [patch][e95f75250d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e95f75250d):

  a bug where a | character at the start of a monospace would cause the parser to crash was fixed,
  but adding table token type to the ignorelist of the monospace parser.

## 4.5.1

- Updated dependencies
  [1194ad5eb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1194ad5eb3):
- Updated dependencies
  [166eb02474](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/166eb02474):
- Updated dependencies
  [40ead387ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40ead387ef):
- Updated dependencies
  [80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):
  - @atlaskit/editor-common@41.0.0
  - @atlaskit/editor-core@113.0.0
  - @atlaskit/editor-json-transformer@6.3.3
  - @atlaskit/editor-test-helpers@10.0.0
  - @atlaskit/renderer@51.0.0
  - @atlaskit/adf-schema@4.0.0

## 4.5.0

### Minor Changes

- [minor][7b58498bbf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7b58498bbf):

  CS-916 ADF->wiki conversion renders empty cells

## 4.4.9

- Updated dependencies
  [08ec269915](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08ec269915):
  - @atlaskit/editor-core@112.44.2
  - @atlaskit/editor-json-transformer@6.3.2
  - @atlaskit/editor-test-helpers@9.11.13
  - @atlaskit/editor-common@40.0.0
  - @atlaskit/renderer@50.0.0

## 4.4.8

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 4.4.7

- Updated dependencies
  [6164bc2629](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6164bc2629):
  - @atlaskit/editor-core@112.39.5
  - @atlaskit/editor-json-transformer@6.2.3
  - @atlaskit/editor-test-helpers@9.11.3
  - @atlaskit/adf-schema@3.0.0
  - @atlaskit/editor-common@39.17.0
  - @atlaskit/renderer@49.7.5

## 4.4.6

### Patch Changes

- [patch][d77e23ae9b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d77e23ae9b):

  Respect empty column

## 4.4.5

### Patch Changes

- [patch][5d9be88694](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d9be88694):

  fix the issuer where color macro is broken down to multiple paragraph

## 4.4.4

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 4.4.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root Please see this
    [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this
    [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points)
    for further details

## 4.4.2

### Patch Changes

- [patch][f7921c3d54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7921c3d54):

  Specail case for hanlding emoji in table

## 4.4.1

- Updated dependencies
  [2b333a4c6d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b333a4c6d):
  - @atlaskit/editor-common@39.8.7
  - @atlaskit/renderer@49.1.2
  - @atlaskit/profilecard@12.0.0

## 4.4.0

### Minor Changes

- [minor][10b8678029](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10b8678029):

  Fix es5 build

## 4.3.0

### Minor Changes

- [minor][f05bb0df52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f05bb0df52):

  Improve emoji parsing

## 4.2.5

- Updated dependencies
  [ff85c1c706](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff85c1c706):
  - @atlaskit/editor-core@112.13.9
  - @atlaskit/renderer@49.0.0

## 4.2.4

- Updated dependencies
  [a40f54404e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a40f54404e):
  - @atlaskit/editor-common@39.8.2
  - @atlaskit/renderer@48.8.2
  - @atlaskit/profilecard@11.0.0

## 4.2.3

- [patch][e794ba2c53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e794ba2c53):

  - Release for es5

## 4.2.2

- [patch][3e9995b40d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e9995b40d):

  - remove unnessary dependencies and bring back es5 to wikimarkup

## 4.2.1

- [patch][78f6d092be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/78f6d092be):

  - Allow issue links to be surrounded by ()

## 4.2.0

- [minor][79f0ef0601](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79f0ef0601):

  - Use strict tsconfig to compile editor packages

## 4.1.2

- Updated dependencies
  [5e4ff01e4c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e4ff01e4c):
  - @atlaskit/editor-json-transformer@6.0.2
  - @atlaskit/editor-test-helpers@9.1.4
  - @atlaskit/editor-core@112.0.0

## 4.1.1

- Updated dependencies
  [154372926b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/154372926b):
  - @atlaskit/editor-json-transformer@6.0.1
  - @atlaskit/editor-test-helpers@9.1.2
  - @atlaskit/editor-core@111.0.0

## 4.1.0

- [minor][5a49043dac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a49043dac):

  - Enable strictPropertyInitialization in tsconfig.base

## 4.0.9

- Updated dependencies
  [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/adf-schema@2.5.5
  - @atlaskit/editor-common@39.0.0
  - @atlaskit/editor-core@110.0.0
  - @atlaskit/renderer@48.0.0
  - @atlaskit/docs@8.0.0
  - @atlaskit/theme@9.0.0
  - @atlaskit/editor-json-transformer@6.0.0
  - @atlaskit/editor-test-helpers@9.0.0
  - @atlaskit/util-data-test@12.0.0
  - @atlaskit/profilecard@10.0.0

## 4.0.8

- Updated dependencies
  [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/editor-common@38.0.0
  - @atlaskit/editor-core@109.0.0
  - @atlaskit/renderer@47.0.0
  - @atlaskit/editor-json-transformer@5.0.4
  - @atlaskit/editor-test-helpers@8.0.8
  - @atlaskit/util-data-test@11.1.9

## 4.0.7

- Updated dependencies
  [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/editor-common@37.0.0
  - @atlaskit/editor-core@108.0.0
  - @atlaskit/renderer@46.0.0
  - @atlaskit/editor-json-transformer@5.0.3
  - @atlaskit/editor-test-helpers@8.0.7
  - @atlaskit/util-data-test@11.1.8

## 4.0.6

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/editor-common@36.1.12
  - @atlaskit/editor-core@107.13.4
  - @atlaskit/renderer@45.6.1
  - @atlaskit/profilecard@9.0.2
  - @atlaskit/theme@8.1.7

## 4.0.5

- [patch][97e555c168](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97e555c168):

  - Revert "[ED-5259 - ED-6200] adds defaultMarks on tableNode (pull request #5259)"

## 4.0.4

- [patch][b425ea772b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b425ea772b):

  - Revert "ED-5505 add strong as default mark to table header (pull request #5291)"

## 4.0.3

- Updated dependencies
  [bfca144ea5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfca144ea5):
  - @atlaskit/editor-common@36.1.1
  - @atlaskit/renderer@45.2.2
  - @atlaskit/profilecard@9.0.0

## 4.0.2

- Updated dependencies
  [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/editor-common@36.0.0
  - @atlaskit/editor-core@107.0.0
  - @atlaskit/renderer@45.0.0
  - @atlaskit/editor-json-transformer@5.0.2
  - @atlaskit/editor-test-helpers@8.0.3
  - @atlaskit/util-data-test@11.1.5

## 4.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 4.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 3.5.6

- Updated dependencies
  [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/editor-common@34.0.0
  - @atlaskit/editor-core@105.0.0
  - @atlaskit/editor-test-helpers@7.0.6
  - @atlaskit/renderer@43.0.0
  - @atlaskit/editor-json-transformer@4.3.5
  - @atlaskit/util-data-test@10.2.5

## 3.5.5

- Updated dependencies
  [4d17df92f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d17df92f8):
  - @atlaskit/editor-json-transformer@4.3.4
  - @atlaskit/editor-test-helpers@7.0.5
  - @atlaskit/editor-core@104.0.0
  - @atlaskit/renderer@42.0.0

## 3.5.4

- Updated dependencies
  [dbff4fdcf9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dbff4fdcf9):
  - @atlaskit/editor-common@33.0.4
  - @atlaskit/renderer@41.3.1
  - @atlaskit/profilecard@8.0.0

## 3.5.3

- Updated dependencies
  [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/editor-core@103.0.3
  - @atlaskit/editor-json-transformer@4.3.3
  - @atlaskit/renderer@41.2.1
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/editor-common@33.0.3
  - @atlaskit/docs@7.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/profilecard@7.0.0

## 3.5.2

- Updated dependencies
  [60f0ad9a7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60f0ad9a7e):
  - @atlaskit/editor-json-transformer@4.3.2
  - @atlaskit/editor-core@103.0.0
  - @atlaskit/editor-test-helpers@7.0.4

## 3.5.1

- Updated dependencies
  [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/editor-common@33.0.0
  - @atlaskit/editor-core@102.0.0
  - @atlaskit/renderer@41.0.0
  - @atlaskit/editor-json-transformer@4.3.1
  - @atlaskit/editor-test-helpers@7.0.2
  - @atlaskit/util-data-test@10.2.2

## 3.5.0

- [minor][9bb0ecb48a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9bb0ecb48a):

  - Support wiki to smart link

## 3.4.0

- [minor][1eb20bca95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1eb20bca95):

  - ED-6368: No implicit any for editor-\*-transformer packages

## 3.3.0

- [minor][6b23c22b7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6b23c22b7d):

  - Advanced table fallback

## 3.2.0

- [minor][06532fe23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06532fe23e):

  - Adds mediaSingle support for list

## 3.1.0

- [minor][8709be280f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8709be280f):

  - Add issue key token to convert into inline cards (Jira Smart Cards)

## 3.0.3

- Updated dependencies
  [4a84fc40e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a84fc40e0):
  - @atlaskit/editor-json-transformer@4.1.12
  - @atlaskit/editor-test-helpers@7.0.1
  - @atlaskit/editor-core@101.0.0
  - @atlaskit/renderer@40.0.0

## 3.0.2

- Updated dependencies
  [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/editor-json-transformer@4.1.11
  - @atlaskit/adf-schema@1.5.4
  - @atlaskit/editor-common@32.0.2
  - @atlaskit/renderer@39.0.2
  - @atlaskit/editor-core@100.0.0
  - @atlaskit/editor-test-helpers@7.0.0

## 3.0.1

- Updated dependencies
  [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
  - @atlaskit/editor-common@32.0.0
  - @atlaskit/editor-core@99.0.0
  - @atlaskit/renderer@39.0.0
  - @atlaskit/editor-json-transformer@4.1.10
  - @atlaskit/editor-test-helpers@6.3.22
  - @atlaskit/util-data-test@10.2.1

## 3.0.0

- [major][be24d8040f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be24d8040f):

  - Change parse function to accept context parameter

## 2.10.3

- [patch][279b08b325](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/279b08b325):

  - Refactor internal TokenParser interface to receive an object and add immutable shared Context
    internally

## 2.10.2

- [patch][557a2b5734](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a2b5734):

  - ED-5788: bump prosemirror-view and prosemirror-model

## 2.10.1

- Updated dependencies
  [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/editor-common@31.0.0
  - @atlaskit/editor-core@98.0.0
  - @atlaskit/editor-test-helpers@6.3.17
  - @atlaskit/renderer@38.0.0
  - @atlaskit/editor-json-transformer@4.1.8
  - @atlaskit/util-data-test@10.0.36

## 2.10.0

- [minor][f56a86f8ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f56a86f8ff):

  - Adds in smart card conversion

## 2.9.11

- Updated dependencies
  [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/editor-common@30.0.0
  - @atlaskit/editor-core@97.0.0
  - @atlaskit/renderer@37.0.0
  - @atlaskit/editor-json-transformer@4.1.7
  - @atlaskit/editor-test-helpers@6.3.12
  - @atlaskit/util-data-test@10.0.34

## 2.9.10

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
  - @atlaskit/editor-common@29.0.0
  - @atlaskit/editor-core@96.0.0
  - @atlaskit/renderer@36.0.0
  - @atlaskit/editor-json-transformer@4.1.6
  - @atlaskit/editor-test-helpers@6.3.11
  - @atlaskit/util-data-test@10.0.33

## 2.9.9

- Updated dependencies [0c116d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c116d6):
  - @atlaskit/editor-json-transformer@4.1.5
  - @atlaskit/editor-test-helpers@6.3.8
  - @atlaskit/editor-common@28.0.2
  - @atlaskit/renderer@35.0.1
  - @atlaskit/util-data-test@10.0.32
  - @atlaskit/editor-core@95.0.0

## 2.9.8

- [patch][74bf476](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74bf476):

  - support codeblock in list

## 2.9.7

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/editor-common@28.0.0
  - @atlaskit/editor-core@94.0.0
  - @atlaskit/editor-test-helpers@6.3.7
  - @atlaskit/renderer@35.0.0
  - @atlaskit/editor-json-transformer@4.1.4
  - @atlaskit/util-data-test@10.0.31

## 2.9.6

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/editor-common@27.0.0
  - @atlaskit/editor-core@93.0.0
  - @atlaskit/editor-test-helpers@6.3.6
  - @atlaskit/renderer@34.0.0
  - @atlaskit/editor-json-transformer@4.1.3
  - @atlaskit/util-data-test@10.0.30

## 2.9.5

- Updated dependencies [e858305](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e858305):
  - @atlaskit/editor-json-transformer@4.1.2
  - @atlaskit/editor-test-helpers@6.3.5
  - @atlaskit/renderer@33.0.4
  - @atlaskit/editor-common@26.0.0
  - @atlaskit/editor-core@92.0.19

## 2.9.4

- [patch][aca2425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aca2425):

  - Escaping in common formatter

## 2.9.3

- [patch][df74239](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df74239):

  - Parse mailto text

## 2.9.2

- [patch][1d9228c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9228c):

  - trim escape in link href

## 2.9.1

- [patch][75046da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75046da):

  - macros keyword can be case insensitive

## 2.9.0

- [minor][a4b49b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4b49b2):

  - Parse macros inside table cells

## 2.8.2

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/editor-common@25.0.0
  - @atlaskit/editor-core@92.0.0
  - @atlaskit/renderer@33.0.0
  - @atlaskit/editor-json-transformer@4.1.1
  - @atlaskit/editor-test-helpers@6.3.4
  - @atlaskit/util-data-test@10.0.28

## 2.8.1

- [patch][0a28c41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a28c41):

  - bq. doesn't need a following space

## 2.8.0

- [minor][1205725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1205725):

  - Move schema to its own package

## 2.7.6

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/editor-common@23.0.0
  - @atlaskit/editor-core@91.0.0
  - @atlaskit/renderer@32.0.0
  - @atlaskit/editor-json-transformer@4.0.25
  - @atlaskit/editor-test-helpers@6.3.2
  - @atlaskit/util-data-test@10.0.26

## 2.7.5

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/theme@7.0.1
  - @atlaskit/editor-core@90.3.15
  - @atlaskit/editor-json-transformer@4.0.24
  - @atlaskit/renderer@31.1.3
  - @atlaskit/util-data-test@10.0.25
  - @atlaskit/profilecard@6.1.2
  - @atlaskit/docs@6.0.0

## 2.7.4

- [patch][77df0db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/77df0db):

  - use em dash for citation

## 2.7.3

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/editor-common@22.2.3
  - @atlaskit/editor-core@90.2.1
  - @atlaskit/renderer@31.0.7
  - @atlaskit/profilecard@6.1.1
  - @atlaskit/theme@7.0.0

## 2.7.2

- Updated dependencies [3a7224a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a7224a):
  - @atlaskit/editor-json-transformer@4.0.23
  - @atlaskit/editor-test-helpers@6.2.23
  - @atlaskit/editor-core@90.0.0

## 2.7.1

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/editor-common@22.0.0
  - @atlaskit/editor-core@89.0.0
  - @atlaskit/renderer@31.0.0
  - @atlaskit/editor-json-transformer@4.0.22
  - @atlaskit/editor-test-helpers@6.2.19
  - @atlaskit/util-data-test@10.0.21

## 2.7.0

- [minor][37eaced](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37eaced):

  - Fix media items inside table cells

## 2.6.2

- [patch][352fbc9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/352fbc9):

  - Should not ignore double and triple dashes in list item

## 2.6.1

- [patch][f11c6e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f11c6e2):

  - Escape properly

## 2.6.0

- [minor][8451c11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8451c11):

  - Fly over links inside table cells

## 2.5.2

- [patch][c93eb36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c93eb36):

  - Do not jump over the link if invalid

## 2.5.1

- [patch][fce377d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fce377d):

  - fix issue with mentions in list

## 2.5.0

- [minor][6fb9918](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6fb9918):

  - Fix strong bug when ending line finishes with two strong symbols

## 2.4.6

- Updated dependencies [9c0844d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0844d):
  - @atlaskit/editor-common@21.2.2
  - @atlaskit/renderer@30.2.1
  - @atlaskit/profilecard@6.0.0

## 2.4.5

- [patch][3148c95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3148c95):

  - add error and success color

## 2.4.4

- [patch][01a92e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/01a92e1):

  - Title for panel and noformat changes

## 2.4.3

- [patch][131e012](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/131e012):

  - Port from Jira regex for dashes

## 2.4.2

- [patch][171443f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/171443f):

  - Re-wrtie table parser

## 2.4.1

- [patch][930ca26](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/930ca26):

  - Fixed issue with library importing from a path within the editor common package

## 2.4.0

- [minor][8681fc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8681fc0):

  - Improve wikimarkup link handling with formatting and titles

## 2.3.6

- [patch][56007b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56007b3):

  - Allow {color} in formatter

## 2.3.5

- [patch][d76aa5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d76aa5a):

  - Adds in support for multiple -

## 2.3.4

- [patch][7b8efea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7b8efea):

  - Heading doesn't need a following space

## 2.3.3

- [patch][5f2efe0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f2efe0):

  - Change triple dash symbol and update parser rules

## 2.3.2

- [patch][904b74c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/904b74c):

  - Fix the behaivor of \\ for line break

## 2.3.1

- [patch][5b4474f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b4474f):

  - Improve handling of 'rules' in lists and at end of content

## 2.3.0

- [minor][640e01f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/640e01f):

  - Ignore double dash symbol when sticked with alphanumerical, unicode without space, or
    parenthesis

## 2.2.0

- [minor][fd35bec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fd35bec):

  - Refactor tokenizer to accpt the whole input and its position

## 2.1.27

- [patch][fd0ed3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fd0ed3a):

  - Changed parser to only start a list if it is led with a single dash

## 2.1.26

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/editor-common@21.0.0
  - @atlaskit/editor-core@88.0.0
  - @atlaskit/renderer@30.0.0
  - @atlaskit/editor-json-transformer@4.0.21
  - @atlaskit/editor-test-helpers@6.2.16
  - @atlaskit/util-data-test@10.0.20

## 2.1.25

- [patch][b64fc55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b64fc55):

  - Adds roundtrip for external image

## 2.1.24

- Updated dependencies [a6dd6e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6dd6e3):
  - @atlaskit/editor-common@20.3.1
  - @atlaskit/renderer@29.3.1
  - @atlaskit/profilecard@5.0.0

## 2.1.23

- [patch][7ca5551](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ca5551):

  - allow list to jump over empty lines in macro successfully

## 2.1.22

- [patch][674b3d9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/674b3d9):

  - convert unknow macros to plain text

## 2.1.21

- [patch][c6763e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6763e2" d):

  - new pattern for mention

## 2.1.20

- [patch] Make common-formatter more generic for citation and monospace
  [c727890](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c727890)

## 2.1.19

- [patch] Fix link format with | in url
  [d4a84b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4a84b3)

## 2.1.18

- [patch] space in list item content doesn't matter
  [d56abbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d56abbd)

## 2.1.17

- [patch] List item symbol followed by line break is not valid
  [df6c74a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df6c74a)

## 2.1.16

- [patch] Fix common-formater ending symbol behavior and use external media for links in media
  [b1926a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1926a8)

## 2.1.15

- [patch] Updated dependencies
  [052ce89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/052ce89)
  - @atlaskit/editor-json-transformer@4.0.19
  - @atlaskit/editor-test-helpers@6.2.8
  - @atlaskit/editor-core@87.0.0
  - @atlaskit/editor-common@20.1.2

## 2.1.14

- [patch] Ignore heading text when fails
  [d2ac796](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2ac796)

## 2.1.13

- [patch] common formater can be valid if surrounded by non alphanumeric characters
  [5576cc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5576cc2)

## 2.1.12

- [patch] list items should allow leading spaces
  [2aad896](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2aad896)

## 2.1.11

- [patch] Adds escape for macro, mention and media
  [8a89d20](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a89d20)

## 2.1.10

- [patch] Updated dependencies
  [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/editor-common@20.0.0
  - @atlaskit/editor-core@86.0.0
  - @atlaskit/renderer@29.0.0
  - @atlaskit/editor-json-transformer@4.0.18
  - @atlaskit/editor-test-helpers@6.2.7
  - @atlaskit/util-data-test@10.0.16

## 2.1.9

- [patch] Updated dependencies
  [6e510d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e510d8)
  - @atlaskit/editor-core@85.5.1
  - @atlaskit/editor-common@19.3.2
  - @atlaskit/renderer@28.0.0

## 2.1.8

- [patch] Updated dependencies
  [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/editor-common@19.0.0
  - @atlaskit/editor-core@85.0.0
  - @atlaskit/renderer@27.0.0
  - @atlaskit/editor-json-transformer@4.0.17
  - @atlaskit/editor-test-helpers@6.2.6
  - @atlaskit/util-data-test@10.0.14

## 2.1.7

- [patch] Updated dependencies
  [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Updated dependencies
  [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/editor-common@18.0.0
  - @atlaskit/editor-core@84.0.0
  - @atlaskit/renderer@26.0.0
  - @atlaskit/editor-json-transformer@4.0.16
  - @atlaskit/editor-test-helpers@6.2.5
  - @atlaskit/util-data-test@10.0.12

## 2.1.6

- [patch] Updated dependencies
  [23c7eca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23c7eca)
  - @atlaskit/editor-json-transformer@4.0.15
  - @atlaskit/editor-test-helpers@6.2.4
  - @atlaskit/util-data-test@10.0.11
  - @atlaskit/editor-core@83.0.0
  - @atlaskit/renderer@25.0.0

## 2.1.5

- [patch] change grey to gray to keep consistent across editor pkgs
  [1b2a0b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b2a0b3)

## 2.1.4

- [patch] Ignore link text in link format
  [dc46cae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc46cae)

## 2.1.3

- [patch] Updated dependencies
  [ef76f1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef76f1f)
  - @atlaskit/editor-json-transformer@4.0.13
  - @atlaskit/editor-common@17.0.1
  - @atlaskit/editor-core@82.0.0
  - @atlaskit/editor-test-helpers@6.1.3

## 2.1.2

- [patch] Updated dependencies
  [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/editor-common@17.0.0
  - @atlaskit/editor-core@81.0.0
  - @atlaskit/util-data-test@10.0.10
  - @atlaskit/editor-test-helpers@6.1.2
  - @atlaskit/renderer@24.0.0
  - @atlaskit/editor-json-transformer@4.0.12

## 2.1.1

- [patch] Use proper marks for texts under blockquote
  [7d31a25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d31a25)

## 2.1.0

- [minor] Support an errorCallback for collection fail information
  [86e0d88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86e0d88)

## 2.0.28

- [patch] Updated dependencies
  [2a6410f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a6410f)
  - @atlaskit/editor-common@16.2.0
  - @atlaskit/editor-core@80.5.0
  - @atlaskit/renderer@23.0.0

## 2.0.27

- [patch] link format takes higher priority over common formatters
  [b05205f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b05205f)

## 2.0.26

- [patch] fix link regex to know where to stop
  [ee04ad4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee04ad4)

## 2.0.25

- [patch] Fix encoder for missing closing \!
  [c585e27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c585e27)

## 2.0.24

- [patch] New rules for formatter
  [50edbb0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50edbb0)

## 2.0.23

- [patch] should convert content inside monospace as plain text
  [f5e9f01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f5e9f01)

## 2.0.22

- [patch] Sometimes the leading dashes is not list
  [7cf3406](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cf3406)

## 2.0.21

- [patch] Updated dependencies
  [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/editor-common@16.0.0
  - @atlaskit/editor-core@80.0.0
  - @atlaskit/renderer@22.0.0
  - @atlaskit/editor-json-transformer@4.0.11
  - @atlaskit/editor-test-helpers@6.0.9
  - @atlaskit/util-data-test@10.0.9

## 2.0.20

- [patch] Convert file link to media group
  [d9331e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9331e6)

## 2.0.19

- [patch] Updated transformation of productivity emoji
  [83cdd9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83cdd9f)

## 2.0.18

- [patch] Convert to mediaSingle with width and height
  [5b1d869](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b1d869)

## 2.0.17

- [patch] Convert to same cell types
  [9571a76](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9571a76)

## 2.0.16

- [patch] keep width and height when transform back to wiki attachment
  [4acc88a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4acc88a)

## 2.0.15

- [patch] should parse empty wiki
  [03f0b1b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03f0b1b)

## 2.0.14

- [patch] Fix color error [2b513c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b513c5)

## 2.0.13

- [patch] Keep title of code block
  [95f9654](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95f9654)

## 2.0.12

- [patch] Trailing spaces of a table should not create a empty cell
  [eade148](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eade148)

## 2.0.11

- [patch] Updated dependencies
  [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/editor-common@15.0.0
  - @atlaskit/editor-core@79.0.0
  - @atlaskit/renderer@21.0.0
  - @atlaskit/editor-json-transformer@4.0.8
  - @atlaskit/editor-test-helpers@6.0.6
  - @atlaskit/util-data-test@10.0.8

## 2.0.10

- [patch] Updated dependencies
  [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
  - @atlaskit/editor-json-transformer@4.0.7
  - @atlaskit/renderer@20.1.1
  - @atlaskit/editor-test-helpers@6.0.5
  - @atlaskit/editor-core@78.0.0

## 2.0.9

- [patch] Updated dependencies
  [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/renderer@20.0.11
  - @atlaskit/util-data-test@10.0.7
  - @atlaskit/profilecard@4.0.8
  - @atlaskit/editor-common@14.0.11
  - @atlaskit/editor-test-helpers@6.0.3
  - @atlaskit/editor-json-transformer@4.0.6
  - @atlaskit/editor-core@77.1.4

## 2.0.8

- [patch] Convert all media items to thumbnail
  [eb0f1f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb0f1f4)

## 2.0.7

- [patch] whitelist supported language for wiki markup
  [a3edfda](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3edfda)

## 2.0.6

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/profilecard@4.0.7
  - @atlaskit/renderer@20.0.7
  - @atlaskit/editor-core@77.0.14
  - @atlaskit/docs@5.0.6

## 2.0.5

- [patch] wikimarkup parser should parse media item with ( and ) correctly
  [76adf36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76adf36)

## 2.0.4

- [none] Updated dependencies
  [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/renderer@20.0.0
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-core@77.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies
  [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/renderer@20.0.0
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-core@77.0.0
- [none] Updated dependencies
  [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/renderer@20.0.0
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-core@77.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies
  [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/renderer@20.0.0
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-core@77.0.0
- [patch] Updated dependencies
  [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/renderer@20.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-core@77.0.0

## 2.0.3

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/renderer@19.2.6
  - @atlaskit/util-data-test@10.0.2
  - @atlaskit/profilecard@4.0.2
  - @atlaskit/editor-json-transformer@4.0.3
  - @atlaskit/editor-common@13.2.7
  - @atlaskit/editor-test-helpers@5.1.2
  - @atlaskit/editor-core@76.4.5
  - @atlaskit/theme@5.1.2
  - @atlaskit/docs@5.0.2

## 2.0.2

- [patch] Bump prosemirror-model to 1.6 in order to use toDebugString on Text node spec
  [fdd5c5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd5c5d)
- [none] Updated dependencies
  [fdd5c5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd5c5d)
  - @atlaskit/renderer@19.2.5
  - @atlaskit/editor-common@13.2.6
  - @atlaskit/editor-test-helpers@5.1.1
  - @atlaskit/editor-json-transformer@4.0.2
  - @atlaskit/editor-core@76.4.2

## 2.0.1

- [none] Updated dependencies
  [25353c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25353c3)
  - @atlaskit/editor-core@76.0.0
  - @atlaskit/editor-test-helpers@5.0.1
  - @atlaskit/editor-json-transformer@4.0.1
- [patch] Updated dependencies
  [38c0543](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38c0543)
  - @atlaskit/editor-core@76.0.0
  - @atlaskit/editor-test-helpers@5.0.1
  - @atlaskit/editor-json-transformer@4.0.1

## 2.0.0

- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/renderer@19.0.0
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/profilecard@4.0.0
  - @atlaskit/editor-json-transformer@4.0.0
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/editor-test-helpers@5.0.0
  - @atlaskit/editor-core@75.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/renderer@19.0.0
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/profilecard@4.0.0
  - @atlaskit/editor-json-transformer@4.0.0
  - @atlaskit/editor-core@75.0.0
  - @atlaskit/editor-test-helpers@5.0.0
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0

## 1.1.11

- [none] Updated dependencies
  [5f6ec84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f6ec84)
  - @atlaskit/editor-core@74.0.17
  - @atlaskit/editor-test-helpers@4.2.4
  - @atlaskit/renderer@18.2.18
  - @atlaskit/editor-common@12.0.0
  - @atlaskit/editor-json-transformer@3.1.8
- [patch] Updated dependencies
  [5958588](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5958588)
  - @atlaskit/editor-core@74.0.17
  - @atlaskit/editor-test-helpers@4.2.4
  - @atlaskit/renderer@18.2.18
  - @atlaskit/editor-common@12.0.0
  - @atlaskit/editor-json-transformer@3.1.8

## 1.1.10

- [patch] Adds roundtrip testing for nodes and applys fixes
  [83a2ec7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83a2ec7)

## 1.1.9

- [patch] Updated dependencies
  [af0cde6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af0cde6)
  - @atlaskit/editor-core@74.0.0
  - @atlaskit/editor-test-helpers@4.2.2
  - @atlaskit/editor-json-transformer@3.1.7

## 1.1.8

- [patch] Add missing dependencies to packages to get the website to build
  [99446e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99446e3)

- [none] Updated dependencies
  [99446e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99446e3)
  - @atlaskit/renderer@18.2.11
  - @atlaskit/profilecard@3.13.1
  - @atlaskit/docs@4.2.2
- [none] Updated dependencies
  [9bac948](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9bac948)
  - @atlaskit/renderer@18.2.11
  - @atlaskit/docs@4.2.2

## 1.1.7

- [patch] Updated dependencies
  [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/util-data-test@9.1.15
  - @atlaskit/renderer@18.2.9
  - @atlaskit/editor-json-transformer@3.1.5
  - @atlaskit/editor-common@11.3.8
  - @atlaskit/editor-test-helpers@4.1.9
  - @atlaskit/editor-core@73.9.5

## 1.1.6

- [patch] Updated dependencies
  [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/util-data-test@9.1.14
  - @atlaskit/renderer@18.2.7
  - @atlaskit/editor-json-transformer@3.1.4
  - @atlaskit/editor-core@73.9.2
  - @atlaskit/editor-test-helpers@4.1.8
  - @atlaskit/editor-common@11.3.7

## 1.1.5

- [patch] Fixes an issue where double line breaks doesn’t start a new paragraph
  [8242007](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8242007)

## 1.1.4

- [patch] Remove pinned prosemirror-model@1.4.0 and move back to caret ranges for
  prosemirror-model@^1.5.0 [4faccc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4faccc0)
- [patch] Updated dependencies
  [4faccc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4faccc0)
  - @atlaskit/renderer@18.2.5
  - @atlaskit/editor-common@11.3.0
  - @atlaskit/editor-test-helpers@4.1.5
  - @atlaskit/editor-json-transformer@3.1.3
  - @atlaskit/editor-core@73.8.6

## 1.1.3

- [patch] Remove the additional rows when encode code block from ADF to wikiMarkup
  [7b81171](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7b81171)

## 1.1.2

- [patch] remove the additional whitespace in encoder
  [3a28d31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a28d31)

## 1.1.1

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/util-data-test@9.1.13
  - @atlaskit/editor-json-transformer@3.1.2
  - @atlaskit/renderer@18.1.2
  - @atlaskit/editor-core@73.7.5
  - @atlaskit/editor-test-helpers@4.1.2
  - @atlaskit/editor-common@11.2.1
  - @atlaskit/theme@4.0.4

## 1.1.0

- [none] Updated dependencies
  [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/editor-core@73.5.0
  - @atlaskit/editor-test-helpers@4.1.0
  - @atlaskit/renderer@18.1.0
  - @atlaskit/util-data-test@9.1.11
  - @atlaskit/editor-common@11.1.0
  - @atlaskit/editor-json-transformer@3.1.0

## 1.0.10

- [patch] Update and lock prosemirror-model version to 1.4.0
  [febf753](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febf753)
- [none] Updated dependencies
  [febf753](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febf753)
  - @atlaskit/renderer@18.0.3
  - @atlaskit/editor-common@11.0.6
  - @atlaskit/editor-test-helpers@4.0.7
  - @atlaskit/editor-json-transformer@3.0.11
  - @atlaskit/editor-core@73.4.4

## 1.0.9

- [patch] Adding breakout to extensions
  [3d1b0ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d1b0ab)
- [none] Updated dependencies
  [3d1b0ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d1b0ab)
  - @atlaskit/editor-test-helpers@4.0.6
  - @atlaskit/editor-core@73.4.3
  - @atlaskit/editor-common@11.0.5

## 1.0.8

- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/util-data-test@9.1.10
  - @atlaskit/editor-json-transformer@3.0.9
  - @atlaskit/renderer@18.0.0
  - @atlaskit/editor-core@73.0.0
  - @atlaskit/editor-test-helpers@4.0.3
  - @atlaskit/editor-common@11.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 1.0.7

- [patch] Updated dependencies
  [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/editor-test-helpers@4.0.2
  - @atlaskit/editor-common@10.1.9

## 1.0.6

- [patch] ED-4689 add \_\_confluenceMetadata to link mark schema
  [e76e4b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e76e4b4)
- [patch] Updated dependencies
  [e76e4b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e76e4b4)
  - @atlaskit/editor-common@10.1.6

## 1.0.5

- [patch] Fix transformer throwing error when given an empty string to parse
  [bda0aac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bda0aac)

## 1.0.4

- [patch] Fix issue where providing a custom schema would crash the transformer
  [c5f7851](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5f7851)

## 1.0.3

- [none] Updated dependencies
  [febc44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febc44d)
  - @atlaskit/editor-core@72.0.0
  - @atlaskit/editor-test-helpers@4.0.0
  - @atlaskit/renderer@17.0.0
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/editor-common@10.0.0
  - @atlaskit/editor-json-transformer@3.0.7

## 1.0.2

- [patch] Fix a issue where last table row is duplicated in Wiki parser
  [2fd3446](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2fd3446)

## 1.0.1

- [none] Updated dependencies
  [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/editor-test-helpers@3.1.8
  - @atlaskit/editor-common@9.3.9

## 1.0.0

- [major] Migrate wikimarkup transformer
  [b8cab45](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8cab45)

## 0.0.15

- [patch] ED-4336 support loading dynamic/"auto" tables from confluence to fixed-width tables
  [0c2f72a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c2f72a)

## 0.0.13

- [patch] Added missing dependencies and added lint rule to catch them all
  [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 0.0.12

- [patch] Lots of new nodes support in wiki markup parser
  [08071ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08071ea)

## 0.0.10

- [patch] change table node builder constructor for tests, remove tableWithAttrs
  [cf43535](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf43535)

## 0.0.8

- [patch] ED-3939: support macros, most of text effects, emoji, mentions, tables and lists
  [d173a70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d173a70)

## 0.0.6

- [patch] Upgrading ProseMirror Libs
  [35d14d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d14d5)

## 0.0.5

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake
  [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)
