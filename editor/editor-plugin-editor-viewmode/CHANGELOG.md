# @atlaskit/editor-plugin-editor-viewmode

## 2.1.18

### Patch Changes

- [#107474](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107474)
  [`5b698c7925d2b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5b698c7925d2b) -
  [ux] ED-26365 first release of editor-plugin-selection-extension
- [#108912](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108912)
  [`4f43a6293679e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4f43a6293679e) -
  [ux] Adds logic to hide macro interactions during view mode of live pages
- Updated dependencies

## 2.1.17

### Patch Changes

- Updated dependencies

## 2.1.16

### Patch Changes

- Updated dependencies

## 2.1.15

### Patch Changes

- Updated dependencies

## 2.1.14

### Patch Changes

- Updated dependencies

## 2.1.13

### Patch Changes

- [#177988](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177988)
  [`8f78c40775b7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f78c40775b7c) -
  ED-25810 - refactors editor plugins to engineering standards

## 2.1.12

### Patch Changes

- Updated dependencies

## 2.1.11

### Patch Changes

- Updated dependencies

## 2.1.10

### Patch Changes

- Updated dependencies

## 2.1.9

### Patch Changes

- Updated dependencies

## 2.1.8

### Patch Changes

- Updated dependencies

## 2.1.7

### Patch Changes

- Updated dependencies

## 2.1.6

### Patch Changes

- Updated dependencies

## 2.1.5

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 2.1.4

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 2.1.2

### Patch Changes

- Updated dependencies

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [#108237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108237)
  [`ea7dd8ebb249e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ea7dd8ebb249e) -
  Split out side-effects from viewmode plugin to seperate plugin to reduce cyclical dependency risk

  # WHAT

  - Remove `createFilterStepsPlugin` from the editorViewMode Plugin and is implemented in
    editorViewModeEffects instead.
  - Remove `appendTransaction` from the editorViewMode plugin and add as a new PMPlugin in
    editorViewModeEffects
  - `applyViewModeStepAt` is moved to editorViewModeEffects. This is currently only used in
    Annotation plugin which now consumes the new plugin instead and has a minor bump.

  # WHY

  ViewMode information is needed for upstream work in the CollabEdit plugin (see ED-23466).
  Currently the viewMode plugin already depends on CollabEdit and as such implementing new work
  causes a cylical dependency problem. ViewMode is likely to be required in an increasing number of
  plugins and ideally should be as pure as possible with no dependencies. A larger rethink of how
  these plugins fit together may be required but that is outside the scope of this change.

  # HOW

  All incompatibilities should be addressed within this changeset, however for the sake of
  completeness:

  - `editor-plugin-editor-viewmode-effects` must be added to any preset that relies on the viewmode
    filter steps plugin for viewmode annotations. Currently this seems to only be the confluence
    editor itself.
  - `applyViewModeStepAt` should now be called from the `editorViewModeEffects` plugin. This will
    need to be added to your plugin types independently (all uses covered by this change)

## 1.2.1

### Patch Changes

- [#111504](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111504)
  [`d862c6879131d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d862c6879131d) -
  [ED-23748] Fix comment on media disappers in live edit and editor when
  `platform.editor.live-view.comments-in-media-toolbar-button` is on

## 1.2.0

### Minor Changes

- [#106594](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106594)
  [`554be969a7b69`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/554be969a7b69) -
  Support comments on media in Live View mode

### Patch Changes

- Updated dependencies

## 1.1.6

### Patch Changes

- Updated dependencies

## 1.1.5

### Patch Changes

- [#103607](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103607)
  [`104c7a82d1a7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104c7a82d1a7) -
  [ux] ED-23363 If you load a live page in view mode, an empty selection will be set.

## 1.1.4

### Patch Changes

- Updated dependencies

## 1.1.3

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.0.60

### Patch Changes

- [#88634](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88634)
  [`0065b9dba872`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0065b9dba872) -
  Fix initial state not being set correctly for viewmode plugin.

## 1.0.59

### Patch Changes

- [#85544](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/85544)
  [`6c1d71f9f17c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6c1d71f9f17c) -
  Bumping editor-plugin-editor-viewmode to fix package.json out of sync on npm

## 1.0.58

### Patch Changes

- Updated dependencies

## 1.0.57

### Patch Changes

- Updated dependencies

## 1.0.56

### Patch Changes

- Updated dependencies

## 1.0.55

### Patch Changes

- Updated dependencies

## 1.0.54

### Patch Changes

- Updated dependencies

## 1.0.53

### Patch Changes

- Updated dependencies

## 1.0.52

### Patch Changes

- Updated dependencies

## 1.0.51

### Patch Changes

- Updated dependencies

## 1.0.50

### Patch Changes

- Updated dependencies

## 1.0.49

### Patch Changes

- Updated dependencies

## 1.0.48

### Patch Changes

- Updated dependencies

## 1.0.47

### Patch Changes

- Updated dependencies

## 1.0.46

### Patch Changes

- Updated dependencies

## 1.0.45

### Patch Changes

- Updated dependencies

## 1.0.44

### Patch Changes

- Updated dependencies

## 1.0.43

### Patch Changes

- Updated dependencies

## 1.0.42

### Patch Changes

- Updated dependencies

## 1.0.41

### Patch Changes

- Updated dependencies

## 1.0.40

### Patch Changes

- Updated dependencies

## 1.0.39

### Patch Changes

- Updated dependencies

## 1.0.38

### Patch Changes

- Updated dependencies

## 1.0.37

### Patch Changes

- Updated dependencies

## 1.0.36

### Patch Changes

- Updated dependencies

## 1.0.35

### Patch Changes

- Updated dependencies

## 1.0.34

### Patch Changes

- Updated dependencies

## 1.0.33

### Patch Changes

- Updated dependencies

## 1.0.32

### Patch Changes

- Updated dependencies

## 1.0.31

### Patch Changes

- Updated dependencies

## 1.0.30

### Patch Changes

- Updated dependencies

## 1.0.29

### Patch Changes

- Updated dependencies

## 1.0.28

### Patch Changes

- Updated dependencies

## 1.0.27

### Patch Changes

- Updated dependencies

## 1.0.26

### Patch Changes

- Updated dependencies

## 1.0.25

### Patch Changes

- Updated dependencies

## 1.0.24

### Patch Changes

- Updated dependencies

## 1.0.23

### Patch Changes

- Updated dependencies

## 1.0.22

### Patch Changes

- Updated dependencies

## 1.0.21

### Patch Changes

- Updated dependencies

## 1.0.20

### Patch Changes

- Updated dependencies

## 1.0.19

### Patch Changes

- Updated dependencies

## 1.0.18

### Patch Changes

- Updated dependencies

## 1.0.17

### Patch Changes

- Updated dependencies

## 1.0.16

### Patch Changes

- Updated dependencies

## 1.0.15

### Patch Changes

- Updated dependencies

## 1.0.14

### Patch Changes

- Updated dependencies

## 1.0.13

### Patch Changes

- Updated dependencies

## 1.0.12

### Patch Changes

- Updated dependencies

## 1.0.11

### Patch Changes

- Updated dependencies

## 1.0.10

### Patch Changes

- Updated dependencies

## 1.0.9

### Patch Changes

- Updated dependencies

## 1.0.8

### Patch Changes

- Updated dependencies

## 1.0.7

### Patch Changes

- Updated dependencies

## 1.0.6

### Patch Changes

- Updated dependencies

## 1.0.5

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

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

## 0.1.27

### Patch Changes

- [#69825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69825)
  [`e2363da4f6a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e2363da4f6a1) -
  [No Issue] Replace View Mode API for annotations
- [#69825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69825)
  [`e2363da4f6a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e2363da4f6a1) -
  [No Issue] Replace View Mode API for annotations
- [#69825](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69825)
  [`e2363da4f6a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e2363da4f6a1) -
  [No Issue] Replace View Mode API for annotations
- Updated dependencies

## 0.1.26

### Patch Changes

- Updated dependencies

## 0.1.25

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency
- Updated dependencies

## 0.1.24

### Patch Changes

- Updated dependencies

## 0.1.23

### Patch Changes

- Updated dependencies

## 0.1.22

### Patch Changes

- Updated dependencies

## 0.1.21

### Patch Changes

- Updated dependencies

## 0.1.20

### Patch Changes

- Updated dependencies

## 0.1.19

### Patch Changes

- Updated dependencies

## 0.1.18

### Patch Changes

- Updated dependencies

## 0.1.17

### Patch Changes

- Updated dependencies

## 0.1.16

### Patch Changes

- Updated dependencies

## 0.1.15

### Patch Changes

- Updated dependencies

## 0.1.14

### Patch Changes

- Updated dependencies

## 0.1.13

### Patch Changes

- Updated dependencies

## 0.1.12

### Patch Changes

- Updated dependencies

## 0.1.11

### Patch Changes

- Updated dependencies

## 0.1.10

### Patch Changes

- Updated dependencies

## 0.1.9

### Patch Changes

- Updated dependencies

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

- Updated dependencies

## 0.1.4

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238)
  [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) -
  [ED-21835] Change EditorAPI type to always union with undefined

## 0.1.1

### Patch Changes

- Updated dependencies
