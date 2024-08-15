# @atlaskit/editor-plugin-media

## 1.28.5

### Patch Changes

- [#129804](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129804)
  [`790a6fe6bc9e8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/790a6fe6bc9e8) -
  [ED-24516] Fix VR test helpers for fallback LazyNodeViews
- Updated dependencies

## 1.28.4

### Patch Changes

- Updated dependencies

## 1.28.3

### Patch Changes

- Updated dependencies

## 1.28.2

### Patch Changes

- [#128977](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128977)
  [`bfcf3686fbc97`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bfcf3686fbc97) -
  Improvement to setting media provider performance to only set it once.

## 1.28.1

### Patch Changes

- [#128613](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128613)
  [`9ca6a3874ec07`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9ca6a3874ec07) -
  [ED-24516] Fix prepareDiff to avoid toDOM usage
- Updated dependencies

## 1.28.0

### Minor Changes

- [#128347](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128347)
  [`e33566cebd5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e33566cebd5d1) -
  [ED-24175] bump @atlaskit/adf-schema to 40.8.1 and @atlassian/adf-schema-json to 1.22.0 to
  promotecodeblocks & media in quotes, and nested expands in expands to full schema, and allow
  quotes in panels and decisions in lists in stage0 schema, and a validator spec change

### Patch Changes

- Updated dependencies

## 1.27.4

### Patch Changes

- Updated dependencies

## 1.27.3

### Patch Changes

- [#126418](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126418)
  [`dc10688cd20b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dc10688cd20b6) -
  [ux] Migrate typography with new ADS token and primitive
- Updated dependencies

## 1.27.2

### Patch Changes

- [#125044](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125044)
  [`340243f088aaf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/340243f088aaf) -
  Use lazy node view behind a feature flag for media nodes.

## 1.27.1

### Patch Changes

- Updated dependencies

## 1.27.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.26.0

### Minor Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`49b8c7658f3b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49b8c7658f3b5) -
  [ED-24173] bump @atlaskit/adf-schema to 40.3.0 and @atlassian/adf-schema-json to 1.18.0

### Patch Changes

- Updated dependencies

## 1.25.0

### Minor Changes

- [#123036](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123036)
  [`89dbc07d4028b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/89dbc07d4028b) -
  Introduces new "setProvider" action on media plugin. This allows a consumer to update the initial
  configured media provider at a later point. This makes a difference if you are passing the media
  prop to the media plugin rather than the Editor itself.

### Patch Changes

- Updated dependencies

## 1.24.4

### Patch Changes

- Updated dependencies

## 1.24.3

### Patch Changes

- Updated dependencies

## 1.24.2

### Patch Changes

- Updated dependencies

## 1.24.1

### Patch Changes

- [#120417](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120417)
  [`26e76bb38b63f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/26e76bb38b63f) -
  [ux] ECA11Y-175: This changes improves the floating toolbar a11y by making the image border
  options menu accessible for keyboard-only users, and is behind the feature gate
  `platform-editor-a11y-image-border-options-dropdown`.
- Updated dependencies

## 1.24.0

### Minor Changes

- [#119966](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119966)
  [`596ad24e38929`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/596ad24e38929) -
  Clean up typescript references to LegacyPortalProviderAPI

### Patch Changes

- Updated dependencies

## 1.23.2

### Patch Changes

- Updated dependencies

## 1.23.1

### Patch Changes

- Updated dependencies

## 1.23.0

### Minor Changes

- [#118748](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118748)
  [`10bb9e2def098`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10bb9e2def098) -
  [ux] Reduce media single max width padding for all editors except full page

### Patch Changes

- Updated dependencies

## 1.22.8

### Patch Changes

- Updated dependencies

## 1.22.7

### Patch Changes

- [`666ab2fb8703d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/666ab2fb8703d) -
  Accept the media provider from the plugin rather than only from editor-core
- Updated dependencies

## 1.22.6

### Patch Changes

- [#116846](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116846)
  [`b9c3dabe8ea72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9c3dabe8ea72) -
  ECA11Y-66: Make video controls accessible for keyboard users, feature flag removal

## 1.22.5

### Patch Changes

- [`d9b562bd66f8e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d9b562bd66f8e) -
  [ux] [ED-23947] restoring the original order of the typeahead menu so that actions, media,
  mentions and emojis are above the fold (in the top 5 results). this change is a major because it
  removes the `getEditorFeatureFlags prop` for plugins. if any consumers who have adopted these
  changes to the public API, they should remove them on their side too.
- Updated dependencies

## 1.22.4

### Patch Changes

- [#114548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114548)
  [`8b2d47bffb50e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b2d47bffb50e) -
  bump adf-schema version
- Updated dependencies

## 1.22.3

### Patch Changes

- Updated dependencies

## 1.22.2

### Patch Changes

- Updated dependencies

## 1.22.1

### Patch Changes

- [#115817](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115817)
  [`d647eedc6ddd4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d647eedc6ddd4) -
  [ux] [ED-23275] Feature flag cleanup for allow-extended-panel
- Updated dependencies

## 1.22.0

### Minor Changes

- [#115247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115247)
  [`251d23ff9e6c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d23ff9e6c8) -
  upgrade adf-schema version to 38.0.0

### Patch Changes

- Updated dependencies

## 1.21.2

### Patch Changes

- Updated dependencies

## 1.21.1

### Patch Changes

- Updated dependencies

## 1.21.0

### Minor Changes

- [#114156](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114156)
  [`bc6a63af2d1d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc6a63af2d1d0) -
  Bump adf-schema to 37.0.0 and adf-schema-json to 1.16.0

### Patch Changes

- Updated dependencies

## 1.20.17

### Patch Changes

- Updated dependencies

## 1.20.16

### Patch Changes

- Updated dependencies

## 1.20.15

### Patch Changes

- Updated dependencies

## 1.20.14

### Patch Changes

- Updated dependencies

## 1.20.13

### Patch Changes

- Updated dependencies

## 1.20.12

### Patch Changes

- [#110948](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110948)
  [`6567f4bf996b3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6567f4bf996b3) -
  [ux] When we select caption comment, the comment badge should not be active (with FF) and rename
  prop name to mediaSingleElement
- Updated dependencies

## 1.20.11

### Patch Changes

- [#110390](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110390)
  [`bead123202369`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bead123202369) -
  [ux] [ED-23642] Reordering the typeahead so that date, status, code block & info panel are above
  the fold (in the top 5 results)
- [#109353](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109353)
  [`d932e2d76d8fc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d932e2d76d8fc) -
  Removed FF for Media resize
- [#111045](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111045)
  [`2f693993423ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f693993423ec) -
  improve input latency of drag and drop experience and hide drag handle during resizing
- Updated dependencies

## 1.20.10

### Patch Changes

- Updated dependencies

## 1.20.9

### Patch Changes

- Updated dependencies

## 1.20.8

### Patch Changes

- [#106586](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106586)
  [`f3486a7d141c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f3486a7d141c) -
  Update usage of akEditorGutterPadding to its dynamic version which can increase padding to support
  editor drag and drop. Breakout logic is also updated to accommodate extra padding.
- [#107903](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107903)
  [`adfd4df52e6d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/adfd4df52e6d) -
  fix issue where selection was not being set correctly after changing media to inline
- Updated dependencies

## 1.20.7

### Patch Changes

- [#107716](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107716)
  [`62ea5418666f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/62ea5418666f) -
  ED-22554 fix selection position after updating alt text

## 1.20.6

### Patch Changes

- [#107335](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107335)
  [`d5457c8afe5f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d5457c8afe5f) -
  Cleaned up FF platform.editor.media.autoselect-inserted-image_oumto

## 1.20.5

### Patch Changes

- Updated dependencies

## 1.20.4

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.20.3

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation
- Updated dependencies

## 1.20.2

### Patch Changes

- Updated dependencies

## 1.20.1

### Patch Changes

- [#100662](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100662)
  [`3d61cd8f2afe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d61cd8f2afe) -
  [ED-23355] Update annotation viewed event to with attributes nodeType and method to capture usage
  for comments on media
- Updated dependencies

## 1.20.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 1.19.9

### Patch Changes

- Updated dependencies

## 1.19.8

### Patch Changes

- [#98080](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98080)
  [`23c03580e38c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/23c03580e38c) -
  [ux] [ED-23247] Allow floating toolbar copy buttons in live pages view mode.

## 1.19.7

### Patch Changes

- [#99511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99511)
  [`85eb87c88183`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85eb87c88183) -
  Removed unused logic that was creating an empty span element when new portal provider is enabled

## 1.19.6

### Patch Changes

- Updated dependencies

## 1.19.5

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0
- Updated dependencies

## 1.19.4

### Patch Changes

- Updated dependencies

## 1.19.3

### Patch Changes

- Updated dependencies

## 1.19.2

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5
- Updated dependencies

## 1.19.1

### Patch Changes

- Updated dependencies

## 1.19.0

### Minor Changes

- [#96502](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96502)
  [`6d16f58c771d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d16f58c771d) -
  [ux] Add floating toolbar to inline images in view mode, remove media preview on click

### Patch Changes

- Updated dependencies

## 1.18.0

### Minor Changes

- [#95168](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95168)
  [`2091e194a817`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2091e194a817) -
  Introduced new PortalProviderAPI behind a FF

### Patch Changes

- Updated dependencies

## 1.17.2

### Patch Changes

- [#89395](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89395)
  [`d8ff819d271c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d8ff819d271c) -
  [ux] ECA11Y-200 Make editor video seeker accessible for keyboard users

## 1.17.1

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2
- Updated dependencies

## 1.17.0

### Minor Changes

- [#92514](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92514)
  [`8f64cde1a25a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f64cde1a25a) -
  [ux] Add floating toolbar to MediaSingle nodes for Live View editor

### Patch Changes

- Updated dependencies

## 1.16.6

### Patch Changes

- [#93412](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93412)
  [`cc7693e3e336`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cc7693e3e336) -
  [ux] this is to fix the annotation badge padding when rendered inside table

## 1.16.5

### Patch Changes

- [#94413](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94413)
  [`6fa79788f5a8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6fa79788f5a8) -
  Disallow editing of Media caption in live view mode
- Updated dependencies

## 1.16.4

### Patch Changes

- [#94901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94901)
  [`da964fcdc828`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da964fcdc828) -
  [ED-23097] Bump ADF schema to version 35.12.1
- Updated dependencies

## 1.16.3

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 1.16.2

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component
- Updated dependencies

## 1.16.1

### Patch Changes

- [#93689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93689)
  [`5ba5d2b4a9ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ba5d2b4a9ac) -
  Updating adf-schema version to 35.10.0
- Updated dependencies

## 1.16.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.15.5

### Patch Changes

- [#92426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92426)
  [`32c76c7c225c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c76c7c225c) -
  Bump adf-schema to 35.9.2 to support table alignment options
- Updated dependencies

## 1.15.4

### Patch Changes

- Updated dependencies

## 1.15.3

### Patch Changes

- [#91801](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91801)
  [`6d8876d9f604`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d8876d9f604) -
  [ux] ED-23023: Fix for comments on media button visible in template editor
- [#91801](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91801)
  [`cec66c98f6a7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cec66c98f6a7) -
  [ux] Do not add comments button on the media toolbar when media is not inside full page editor.

## 1.15.2

### Patch Changes

- [#91808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91808)
  [`00e5dcfdf240`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/00e5dcfdf240) -
  Adds allowCommentsOnMedia in media plugin options to check the appearance of the renderer
- [#91808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91808)
  [`00e5dcfdf240`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/00e5dcfdf240) -
  [ux] Do not add comments button on the media toolbar when media is not inside full page editor.
- [#91594](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91594)
  [`26b59de564d9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/26b59de564d9) -
  [ED-23025] Check for undefined in the status utility for the comment badge of media nodes

## 1.15.1

### Patch Changes

- [#91420](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91420)
  [`6d0d6452a5a0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d0d6452a5a0) -
  [ED-23025] Check for undefined annotations to avoid exceptions in embedded editor

## 1.15.0

### Minor Changes

- [#90742](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90742)
  [`f893b885cc0a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f893b885cc0a) -
  [ux] Add comment on media badge states

### Patch Changes

- [#91106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91106)
  [`b6ffa30186b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6ffa30186b9) -
  Bump ADF-schema package to version 35.0.0
- Updated dependencies

## 1.14.4

### Patch Changes

- [#90865](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90865)
  [`bffb7089e74e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bffb7089e74e) -
  This changeset exists because a PR touches these packages in a way that doesn't require a release
- Updated dependencies

## 1.14.3

### Patch Changes

- Updated dependencies

## 1.14.2

### Patch Changes

- [#88742](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88742)
  [`6771cedeadd3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6771cedeadd3) -
  Add UI for comment badge in Renderer, clean up props

## 1.14.1

### Patch Changes

- [#88137](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88137)
  [`0a744349d5e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0a744349d5e6) -
  [ux] [ED-22833] Change icon used for comment button in media floating toolbar when there are
  active comments associated with the media. The icon will now be comment icon with a dot at top
  right corner.

## 1.14.0

### Minor Changes

- [#73901](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73901)
  [`2aefab5730ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2aefab5730ab) -
  ECA11Y-207 Added Tab navigation for video panel controls and handling key press on them

### Patch Changes

- Updated dependencies

## 1.13.5

### Patch Changes

- [#87596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87596)
  [`e0b95c3a4fba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e0b95c3a4fba) -
  Add new UI badge for media node to trigger comments
- Updated dependencies

## 1.13.4

### Patch Changes

- [#83266](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83266)
  [`2ccef5c67079`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2ccef5c67079) -
  fix editor comment disabled state regression issue
- Updated dependencies

## 1.13.3

### Patch Changes

- [#86920](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86920)
  [`b06aff2f43c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b06aff2f43c8) -
  ECA11Y-72: fix borken changeInlineToMediaCard function
- Updated dependencies

## 1.13.2

### Patch Changes

- Updated dependencies

## 1.13.1

### Patch Changes

- [#86724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86724)
  [`718a9aa2424d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/718a9aa2424d) -
  [ED-22607] Remove references to maxFrames for multi bodied extensions and bump adf-schema from
  35.7.0 to 35.8.0
- Updated dependencies

## 1.13.0

### Minor Changes

- [#84964](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/84964)
  [`be8d48da5d54`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be8d48da5d54) -
  [ux] MediaGroup should show MediaViewer when Editor in 'view' mode

## 1.12.4

### Patch Changes

- [#84432](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/84432)
  [`19324d1894bb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19324d1894bb) -
  [ED-22643] Update showInlineCommentForBlockNode so that it can dispatch action to show comment
  view component when there are no active comments associated with the give node
- Updated dependencies

## 1.12.3

### Patch Changes

- Updated dependencies

## 1.12.2

### Patch Changes

- [#83306](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83306)
  [`7f90ec235c28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7f90ec235c28) -
  [ux] Disable MediaSingle resizing when Editor in disabled or view mode states

## 1.12.1

### Patch Changes

- Updated dependencies

## 1.12.0

### Minor Changes

- [#82581](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82581)
  [`c1be75ae15b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1be75ae15b6) -
  ED-22606 add toggle inline comment action

### Patch Changes

- [#81777](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81777)
  [`c6d7a5378751`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6d7a5378751) -
  Bump adf-schema to 35.7.0
- Updated dependencies

## 1.11.0

### Minor Changes

- [#80438](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80438)
  [`cf8860dbf719`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cf8860dbf719) -
  [ux] Add media viewer previews to inline media and media single images when Editor is in view mode

### Patch Changes

- Updated dependencies

## 1.10.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`
- Updated dependencies

## 1.10.0

### Minor Changes

- [#82250](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82250)
  [`5d7f76f71b82`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d7f76f71b82) -
  Stop media viewer from closing when clicking on image

### Patch Changes

- Updated dependencies

## 1.9.5

### Patch Changes

- Updated dependencies

## 1.9.4

### Patch Changes

- [#82153](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82153)
  [`480761cfea9c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/480761cfea9c) -
  Make the annotation plugin optional for media plugin.
- [#81852](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81852)
  [`555dccbfa979`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/555dccbfa979) -
  React 18 types for editor-plugin-media
- [#82076](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82076)
  [`614af0864121`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/614af0864121) -
  [ux] Remove seperator between edit and open link buttons on media floating toolbar
- Updated dependencies

## 1.9.3

### Patch Changes

- Updated dependencies

## 1.9.2

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679)
  [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) -
  ED-22553 Updating adf-schema version to 35.6.0
- Updated dependencies

## 1.9.1

### Patch Changes

- [#80123](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80123)
  [`e235b04b9352`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e235b04b9352) -
  [ED-22387] Add css styling for comments on media node
- Updated dependencies

## 1.9.0

### Minor Changes

- [#80857](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80857)
  [`ad7674680f2d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ad7674680f2d) -
  [ux] Changed spacing styles to use design token instead of static values

### Patch Changes

- Updated dependencies

## 1.8.2

### Patch Changes

- [#80518](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80518)
  [`e0d5e8fd9495`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e0d5e8fd9495) -
  Migrates some style calls to a slightly different object syntax and other minor cleanup around
  eslint rules.
- Updated dependencies

## 1.8.1

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#77607](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77607)
  [`78ab76808037`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/78ab76808037) -
  Fixed bug where save button state was not updated correctly for when media upload is in progress
  or finish uploading

### Patch Changes

- [#78508](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78508)
  [`3459ec92fed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3459ec92fed3) -
  [ux] When comment button in media floating toolbar is click, setInlineCommentDraftState from
  annotation plugin is evoked to apply draft docration and display inline comment create popup
- Updated dependencies

## 1.7.0

### Minor Changes

- [#63691](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63691)
  [`02293e70771b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/02293e70771b) -
  add allowWidthDetector option to be used to skip width detector in renderer, to make media single
  works in inline extension like excerpt include

### Patch Changes

- Updated dependencies

## 1.6.2

### Patch Changes

- Updated dependencies

## 1.6.1

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224)
  [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) -
  ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

## 1.6.0

### Minor Changes

- [#78166](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78166)
  [`8055c8ca1c32`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8055c8ca1c32) -
  [ux] Add support for preview button in floating toolbar to mediaInline nodes

### Patch Changes

- [#78326](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78326)
  [`4adb95539d29`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4adb95539d29) -
  Added logic to allow media single to access annotation state

## 1.5.1

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#76504](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76504)
  [`35deb7a5d492`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35deb7a5d492) -
  [ux] Add Media preview feature for full page Editor under FF

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- [#77601](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77601)
  [`ee98d2aa7c8a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ee98d2aa7c8a) -
  [ED-22199] Update media card wrapper so that it applies comments styles according to comment
  status

## 1.4.0

### Minor Changes

- [#76770](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76770)
  [`7eb1d4032d40`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7eb1d4032d40) -
  [ux] Select upladed image. In case there are mulitple image files being pasted or drag&dropped,
  select last image.

## 1.3.0

### Minor Changes

- [#75635](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75635)
  [`af4972f3a9bb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/af4972f3a9bb) -
  [ux] Added comment button for media single floating toolbar

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- [#74284](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74284)
  [`c88cf104546f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c88cf104546f) -
  fix copy paste issue in excel and numbers that paste table results in screenshot of table pasted
- Updated dependencies

## 1.2.1

### Patch Changes

- [#73653](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73653)
  [`0cffdd968f1f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0cffdd968f1f) -
  Refactor media keymap announcer for translations

## 1.2.0

### Minor Changes

- [#72122](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72122)
  [`c3186450404a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3186450404a) -
  Breaking change:

  ## WHAT?:

  Removing feature flags:

  - singleLayout
  - newInsertionBehaviour
  - interactiveExpand
  - findReplace
  - findReplaceMatchCase
  - extendFloatingToolbar

  ## WHY?:

  Because the flags and props are unused/by default active. Removing them will reduce our
  maintenance burden

  ## HOW to update your code:

  - If you were using the feature flag - the behaviour is now default and you can remove the flags
  - If you were not using the feature flag - the behaviour is now default.
  - If you have opted out of using the feature flag - we have been careful to ensure no-one has
    opted out of the behaviours. If you do have an issue please reach out to #help-editor.

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#72258](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72258)
  [`31cecb8f314b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/31cecb8f314b) -
  ECA11Y-78: removed feature flag

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

## 0.12.8

### Patch Changes

- [#72081](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72081)
  [`4487160917d2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4487160917d2) -
  [ux] ED-22052: adds button type attribute to non atlaskit button instances

## 0.12.7

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency
- [#70460](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70460)
  [`2f37600156ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f37600156ae) -
  The internal composition of a component in this package has changed. There is no expected change
  in behaviour.

## 0.12.6

### Patch Changes

- [#71136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71136)
  [`c803fea1e6a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c803fea1e6a4) -
  Move all plugin translations to editor-common
- Updated dependencies

## 0.12.5

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152)
  [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) -
  Updating adf-schema version to 35.5.1

## 0.12.4

### Patch Changes

- [#68372](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68372)
  [`17f42e77e826`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/17f42e77e826) -
  add allowMediaInlineImage media option to support new media inline image feature
- Updated dependencies

## 0.12.3

### Patch Changes

- [#70373](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70373)
  [`fdcf1d5c6b11`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fdcf1d5c6b11) -
  Fix duplicate I18N IDs for media toolbar

## 0.12.2

### Patch Changes

- [#68640](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68640)
  [`6a3ea210641a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a3ea210641a) -
  Create new context identifier plugin which contains the provider.

## 0.12.1

### Patch Changes

- [#66027](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66027)
  [`9e0417874343`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9e0417874343) -
  [CXP-2867] Fix superfluous newline in inline-to-card conversion
- Updated dependencies

## 0.12.0

### Minor Changes

- [#69175](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69175)
  [`1760b37895fd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1760b37895fd) -
  Added support for copy&pasting inline images between pages

### Patch Changes

- [#69008](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69008)
  [`dbf9e9255cea`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dbf9e9255cea) -
  [ux] Show caption remove tooltip on media inline switcher in floating toolbar

## 0.11.11

### Patch Changes

- [#68724](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68724)
  [`766fca9896cb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/766fca9896cb) -
  [ux] ED-21615 Removing grid lines when resizing image inside panel.

## 0.11.10

### Patch Changes

- Updated dependencies

## 0.11.9

### Patch Changes

- [#67290](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67290)
  [`3029264a82c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3029264a82c3) -
  [ux] Fixes the bug where, adding media to empty panel replaces the panel

## 0.11.8

### Patch Changes

- Updated dependencies

## 0.11.7

### Patch Changes

- [#68380](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68380)
  [`180e570d3332`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/180e570d3332) -
  Consolidate media grouped layout ff to inline image base ff

## 0.11.6

### Patch Changes

- [#67912](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67912)
  [`d24fdd20c0de`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d24fdd20c0de) -
  [ux] ED-21869 auto populate alt attribute when inserting inline image
- [#67822](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67822)
  [`2010719ccc04`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2010719ccc04) -
  [ux] ED-21870 Fix - divider is removed from document when switching between media single to image
  inline
- Updated dependencies

## 0.11.5

### Patch Changes

- [#67908](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67908)
  [`68ecca634a3a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/68ecca634a3a) -
  [ux] Unify order of alt and link floating bar positions for mediaInline and mediaSingle

## 0.11.4

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.11.3

### Patch Changes

- [#66631](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66631)
  [`c1d10d6c2013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1d10d6c2013) -
  Updated alt text analytics to log additional attributes
- [#67194](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67194)
  [`37379761475c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/37379761475c) -
  [ED-21806] Skip changes from NCS and tinted transactions.

## 0.11.2

### Patch Changes

- [#66510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66510)
  [`de9aee7692ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de9aee7692ab) -
  [ux] ED-21829 Hiding Inline and Original size floating toolbar buttons for external images
- Updated dependencies

## 0.11.1

### Patch Changes

- Updated dependencies

## 0.11.0

### Minor Changes

- [#61125](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61125)
  [`9571e3502584`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9571e3502584) -
  ECA11Y-72 Update files toolbar to replace dropdown by buttons

## 0.10.4

### Patch Changes

- [#65825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65825)
  [`d08cdd1cb2aa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d08cdd1cb2aa) -
  add extra attributes for media link

## 0.10.3

### Patch Changes

- [#65846](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65846)
  [`aa24d3f38df0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aa24d3f38df0) -
  Updated analytics for border mark
- Updated dependencies

## 0.10.2

### Patch Changes

- [#65194](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65194)
  [`b17492206adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b17492206adc) -
  ED-21544 able to insert inline image in panel with empty paragraph.

## 0.10.1

### Patch Changes

- [#65562](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65562)
  [`857a5d841564`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/857a5d841564) -
  add analytics to track media single to media inline convert
- Updated dependencies

## 0.10.0

### Minor Changes

- [#64354](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64354)
  [`b07fcd05c2c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b07fcd05c2c9) -
  [ux] Added border support for media inline node

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031)
  [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) -
  ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.9.1

### Patch Changes

- [#63950](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63950)
  [`aa44815a0e60`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aa44815a0e60) -
  [ux] changed color for instructions to add alt text
- Updated dependencies

## 0.9.0

### Minor Changes

- [#63809](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63809)
  [`0a735e84c669`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0a735e84c669) -
  Added alt text support for inline images

## 0.8.1

### Patch Changes

- [#63388](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63388)
  [`999a8302f404`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/999a8302f404) -
  add analytics for changing media inline to media single
- [#63608](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63608)
  [`bfb98fe84eae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bfb98fe84eae) -
  [ux] EDF-93: Report and resolve existing duplicate i18n message descriptor keys/IDs in editor, as
  precursor work to adding CI check

## 0.8.0

### Minor Changes

- [#62560](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62560)
  [`5ad72b247e6a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ad72b247e6a) -
  [ux] ED-20895 Added linking support for inline images

### Patch Changes

- Updated dependencies

## 0.7.0

### Minor Changes

- [#61685](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61685)
  [`ac1ec9ea4cd3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ac1ec9ea4cd3) -
  [ux] Add border mark support to mediaInline in Editor/Renderer

### Patch Changes

- Updated dependencies

## 0.6.12

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165)
  [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) -
  [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 0.6.11

### Patch Changes

- Updated dependencies

## 0.6.10

### Patch Changes

- [#60678](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60678)
  [`e68cb7c676df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e68cb7c676df) -
  [ED-21042] Synchronously flush state update in Picker Facade Provider to get consistent behaviour
  in React 16 and 18

## 0.6.9

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808)
  [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) -
  ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 0.6.8

### Patch Changes

- Updated dependencies

## 0.6.7

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246)
  [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) -
  ED-21371 Update adf-schema to 35.1.0

## 0.6.6

### Patch Changes

- [#60345](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60345)
  [`0510fbeefadd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0510fbeefadd) -
  [ux] [ED-21290] Add inline and floating switcher buttons to media single floating toolbar and
  implement onClick handler

## 0.6.5

### Patch Changes

- [#60047](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60047)
  [`a1cc52ca9df3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a1cc52ca9df3) -
  Insert media as inlineImage

## 0.6.4

### Patch Changes

- [#60029](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60029)
  [`b9826ea49c47`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9826ea49c47) -
  Update dependencies that were impacted by HOT-106483 to latest.

## 0.6.3

### Patch Changes

- [#59409](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59409)
  [`e37f95e368fd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e37f95e368fd) -
  Refactor code to use allowInlineImages plugin state instead of FF check

## 0.6.2

### Patch Changes

- [#59086](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59086)
  [`8b5cbc397cfd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b5cbc397cfd) -
  [ux] add convert media inline image to media single floating toolbar item

## 0.6.1

### Patch Changes

- Updated dependencies

## 0.6.0

### Minor Changes

- [#56827](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/56827)
  [`9966463429c6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9966463429c6) -
  ECA11Y-86: Added ability to resize media via keyboard and added announcer

## 0.5.1

### Patch Changes

- [#59047](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59047)
  [`a792bec68ae3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a792bec68ae3) -
  [ED-21288] Populate width and height ADF attributes on insertion for mediaInline node of image
  type.

## 0.5.0

### Minor Changes

- [#58884](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58884)
  [`a149612dc46d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a149612dc46d) -
  [ux] Added support for Media Inline Image Card in Editor and Renderer

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).
- [#56822](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/56822)
  [`77f4fbf44e93`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77f4fbf44e93) -
  ECA11Y-78: Added announce for the selected file

## 0.4.10

### Patch Changes

- [#58567](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58567)
  [`5c0892098c84`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c0892098c84) -
  add media inline image floating toolbar under FF
- Updated dependencies

## 0.4.9

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763)
  [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) -
  update ADF schema

## 0.4.8

### Patch Changes

- Updated dependencies

## 0.4.7

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790)
  [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) -
  ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 0.4.6

### Patch Changes

- [#43825](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43825)
  [`b21c6c1caa8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b21c6c1caa8) - [ux]
  [ED-20885] Group layout buttons in mediaSingle floating toolbar into a dropdown

## 0.4.5

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

## 0.4.4

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417)
  [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971
  Upgrade adf-schema package to ^34.0.0

## 0.4.3

### Patch Changes

- Updated dependencies

## 0.4.2

### Patch Changes

- [#43436](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43436)
  [`6bf14e25965`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6bf14e25965) - Revert
  "Resize media for the keyboard users"

## 0.4.1

### Patch Changes

- [#43145](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43145)
  [`999af31b6ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/999af31b6ad) - [ux]
  [ED-20776] Change mediaInline node insertion logic behind
  'platform.editor.media.inline-image.base-support' feature flag. With the flag on, Adding an image
  to a non-empty paragraph and list node inserts an media inline node, instead of media single node.
- Updated dependencies

## 0.4.0

### Minor Changes

- [#43108](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43108)
  [`b779a47b799`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b779a47b799) -
  ECA11Y-86: Added ability to resize media via keyboard and added announcer

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379)
  [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763
  Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 0.3.17

### Patch Changes

- Updated dependencies

## 0.3.16

### Patch Changes

- [#43014](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43014)
  [`f021d31543e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f021d31543e) - create
  useFileState hook versions of header and itemviewer, create list-v2, refactor MediaFileStateError
  to media-client-react
- [#42702](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42702)
  [`79e5ed8fac7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79e5ed8fac7) - ED-19543
  remove unused FF check
- [#43014](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43014)
  [`761551f78ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/761551f78ab) -
  Implement useFileState hook on Media Viewer under Version 2
- Updated dependencies

## 0.3.15

### Patch Changes

- [#42995](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42995)
  [`a527682dee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a527682dee6) - add in
  missing dependencies for imported types
- Updated dependencies

## 0.3.14

### Patch Changes

- [#42899](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42899)
  [`4b3e40bff6f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b3e40bff6f) - Added a
  new media plugin state `allowInlineImages` to support upcoming feature development.

## 0.3.13

### Patch Changes

- [#42834](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42834)
  [`a4695f1205a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4695f1205a) - Fix TS
  errors for editor packages in AFM

## 0.3.12

### Patch Changes

- Updated dependencies

## 0.3.11

### Patch Changes

- [#42757](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42757)
  [`73c66d2c6db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73c66d2c6db) - remove
  media securedClipboard FF
- Updated dependencies

## 0.3.10

### Patch Changes

- Updated dependencies

## 0.3.9

### Patch Changes

- [#41659](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41659)
  [`a0c97a19dba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a0c97a19dba) - Remove
  unused utils and depreciated exports in mediaClient.
- Updated dependencies

## 0.3.8

### Patch Changes

- Updated dependencies

## 0.3.7

### Patch Changes

- [#40916](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40916)
  [`0b80e2e68ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b80e2e68ea) - [ux]
  media single node with external type media should not show migration ui. Update external image
  with natural dimensions accordingly, and fixed whitespace issue in external image.

## 0.3.6

### Patch Changes

- [#41747](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41747)
  [`8b2001e7bbe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b2001e7bbe) - Extend
  mediaSingle from Component as props were not causing PureComponent to rerender correctly

## 0.3.5

### Patch Changes

- [#40861](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40861)
  [`a7e65721b8b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a7e65721b8b) -
  ECA11Y-73: Add announcements for the screen reader users when the user types incorrect values in
  Alt text input field

## 0.3.4

### Patch Changes

- [#41343](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41343)
  [`243143e8007`](https://bitbucket.org/atlassian/atlassian-frontend/commits/243143e8007) - Improved
  media single performance by preventing unnecessary updates to collab service on every component
  update

## 0.3.3

### Patch Changes

- [#41425](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41425)
  [`130e8656e37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/130e8656e37) - Fixed
  bug where media single node was shrinking unexpectedly inside table cell.

## 0.3.2

### Patch Changes

- [#41248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41248)
  [`21fa5648746`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21fa5648746) - Fix
  incorrect layout calculation for nested Media Single nodes resized via toolbar
- Updated dependencies

## 0.3.1

### Patch Changes

- [#40750](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40750)
  [`fc19a7b9edd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc19a7b9edd) -
  [ED-19875] Extraction of Editor Core's Selection Plugin into independent package
  '@atlaskit/editor-plugin-selection'.
- Updated dependencies

## 0.3.0

### Minor Changes

- [#41187](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41187)
  [`c09b3a047f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c09b3a047f4) - Extract
  media plugin from `@atlaskit/editor-core` to `@atlaskit/editor-plugin-media.

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#40755](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40755)
  [`c1cd5ba7d38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1cd5ba7d38) -
  [ED-16733] Extraction Media Plugin: Add new placeholder package for media types.
