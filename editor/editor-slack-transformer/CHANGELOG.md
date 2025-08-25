# @atlaskit/editor-slack-transformer

## 4.1.1

### Patch Changes

- [`0fdcb6f2f96fd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fdcb6f2f96fd) -
  Sorted type and interface props to improve Atlaskit docs

## 4.1.0

### Minor Changes

- [`72f94befc61f2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/72f94befc61f2) -
  replace method-style signatures with function-style signatures

## 4.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

## 3.8.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

## 3.7.4

### Patch Changes

- [#147003](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147003)
  [`f4f413727e260`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f4f413727e260) -
  [EDF-1041] Remove platform typings prosemirror-markdown from project

## 3.7.3

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

## 3.7.2

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 3.7.1

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18

## 3.7.0

### Minor Changes

- [#130284](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130284)
  [`0d9df059ffdf5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0d9df059ffdf5) -
  Explicitly log not supported nodes in slack transformer for expand and nestedExpand

## 3.6.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

## 3.5.0

### Minor Changes

- [#98129](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98129)
  [`78612a7edba4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/78612a7edba4) -
  [ux] [ED-23101] Updated Editor JSON, Slack, Confluence and Email transformers to support the new
  `backgroundColor` mark

## 3.4.1

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 3.4.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

## 3.3.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 3.3.4

### Patch Changes

- [#75947](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75947)
  [`43549c3789b1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/43549c3789b1) -
  Migrate @atlaskit/editor-core to use declarative entry points

## 3.3.3

### Patch Changes

- [#77984](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77984)
  [`eb7139b3ec21`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eb7139b3ec21) -
  Replace hardcoded values with spacing tokens

## 3.3.2

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 3.3.1

### Patch Changes

- [#70084](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70084)
  [`4d651eb93ab5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4d651eb93ab5) -
  Add editor-plugin-annotation pr and create shared utils for it in editor-test-helpers

## 3.3.0

### Minor Changes

- [#70008](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70008)
  [`0aa6be50ddd3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0aa6be50ddd3) -
  Added support for inline image

## 3.2.9

### Patch Changes

- [#42761](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42761)
  [`5d1881c7ed0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d1881c7ed0) - Adds
  @ak/tokens as a dependency

## 3.2.8

### Patch Changes

- [#39320](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39320)
  [`ec4867e1376`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec4867e1376) - Removed
  captions flag and replaced with a new media prop `allowCaptions`. `allowCaptions` is set to
  `false` by default and products will need to opt in to be able to use captions from now on.

## 3.2.7

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 3.2.6

### Patch Changes

- Updated dependencies

## 3.2.5

### Patch Changes

- [#37785](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37785)
  [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) -
  [ED-19233] Import prosemirror libraries from internal facade package

## 3.2.4

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 3.2.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 3.2.2

### Patch Changes

- [#33771](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33771)
  [`a142ba1aa28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a142ba1aa28) -
  [ED17172] Bump prosemirror-model to 1.16.0 and prosemirror-view to 1.23.7 and removed work-arounds
  for fixed issues

## 3.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 3.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

## 3.1.7

### Patch Changes

- [#33004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33004)
  [`0ffb55018c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ffb55018c9) - Revert
  "[ED-17172] Bumped prosemirror-view from 1.23.2 to 1.23.7 and removed work-around for fixed
  issues"

## 3.1.6

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 3.1.5

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 3.1.4

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 3.1.3

### Patch Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`4db684dafa6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4db684dafa6) - ED-13895
  update editor slack transformer to emotion

## 3.1.2

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 3.1.1

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - ED-13025
  Bump prosemirror-view 1.23.1 -> 1.23.2

## 3.1.0

### Minor Changes

- [#17424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17424)
  [`95c8a998ef1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95c8a998ef1) - Inline
  cards with url type attributes are sent as links. Adding a new row after embedded card

## 3.0.0

### Major Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`8f0577e0eb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f0577e0eb1) - [ux]
  Promoted captions to full schema and better support of wikimarkup, email and slack renderer

### Minor Changes

- [`b230f366971`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b230f366971) -
  [ED-14008] Bump prosemirror-view from 1.20.2 to 1.23.1

### Patch Changes

- [`c6feed82071`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6feed82071) -
  ED-11632: Bump prosemirror packages;

  - prosmirror-commands 1.1.4 -> 1.1.11,
  - prosemirror-model 1.11.0 -> 1.14.3,
  - prosemirror-state 1.3.3 -> 1.3.4,
  - prosemirror-transform 1.2.8 -> 1.3.2,
  - prosemirror-view 1.15.4 + 1.18.8 -> 1.20.2.

## 2.0.0

### Major Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`ad7872a08ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad7872a08ed) - Add
  media inline component to wikimarkup, slack markdown, email renderer transformers

## 1.0.6

### Patch Changes

- [#14969](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14969)
  [`4855cb64aab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4855cb64aab) - Fixed
  typo in the embedded node name

## 1.0.5

### Patch Changes

- [#12300](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12300)
  [`5eb1f5c3eb6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5eb1f5c3eb6) - Moved
  @atlaskit/editor-common to devDependencies. Extracted Transformer interface from it.

## 1.0.4

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- [#12237](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12237)
  [`b7d23a07930`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7d23a07930) -
  Added/updated unsupported nodes/marks stubs. Added support for decisions, layouts, status, panel.
  Emojis return text (an emoji itself) instead of a short name.

## 1.0.2

### Patch Changes

- [#11502](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11502)
  [`a17337cd389`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a17337cd389) - Added
  stubs for unsupported nodes in Slack markdown such as table, panel, inline card, task, decision as
  ["node type" attached]

## 1.0.1

### Patch Changes

- [#11387](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11387)
  [`93a63117404`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93a63117404) - Replaced
  a [media attached] link (when some file is attached) just with a text [media attached]. Added a
  rule node (serialized to an empty line) and a text color mark (serialized to a pure text). Slack
  doesn’t have syntax for it. Added a missed description in package.json. Removed unused
  devDependencies.

## 1.0.0

### Major Changes

- [#11002](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11002)
  [`944b9d04d22`](https://bitbucket.org/atlassian/atlassian-frontend/commits/944b9d04d22) - [ux]
  TI-210 Implemented a converter to support ADF to Slack markdown transformation. Supported bold,
  italic and strikethrough text, links, quotes, inline code blocks, code blocks, emojis. Mentions
  are serialised as @id. There’s no specific list syntax in app-published text, but we can mimic
  list (bullet, numbered) formatting. Also there’s no specific syntax for headers, images/files
  (will be converted to [image attached] or [media attached] as a link).
