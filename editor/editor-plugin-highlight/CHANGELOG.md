# @atlaskit/editor-plugin-highlight

## 1.14.0

### Minor Changes

- [#126478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126478)
  [`ca1665ebbfe4d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ca1665ebbfe4d) -
  [ED-23435] Store primary toolbar component registry in a plugin variable instead of in plugin
  state to avoid having to add effects to all plugins and enable SSR for the toolbar. [Breaking
  change] Converted registerComponent from the primary toolbar plugin into an action.

### Patch Changes

- Updated dependencies

## 1.13.1

### Patch Changes

- Updated dependencies

## 1.13.0

### Minor Changes

- [#124190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124190)
  [`9ab9c4ca2b9df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9ab9c4ca2b9df) -
  Clean-up platform.editor.refactor-highlight-toolbar_mo0pj feature flag
- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0
- [#124190](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124190)
  [`9ab9c4ca2b9df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9ab9c4ca2b9df) -
  Fixed issue where opening the color palette for highlights would get added to history and cause
  you to have to undo multiple times to undo actions

### Patch Changes

- Updated dependencies

## 1.12.7

### Patch Changes

- [#122243](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122243)
  [`b1d7c5ade9b3a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b1d7c5ade9b3a) -
  [ux] EDF-91 Removed platform.editor.enable-selection-toolbar_ucdwd feature flag and enabled
  bydefault.

## 1.12.6

### Patch Changes

- Updated dependencies

## 1.12.5

### Patch Changes

- Updated dependencies

## 1.12.4

### Patch Changes

- Updated dependencies

## 1.12.3

### Patch Changes

- [#113218](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113218)
  [`d1b428ec29d68`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d1b428ec29d68) -
  [ED-23765] migrate inline node commenting feature flags to statsig feature gate
- Updated dependencies

## 1.12.2

### Patch Changes

- [#116760](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116760)
  [`2e309117f02c6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2e309117f02c6) -
  [ED-23062] Clean up feature flag for highlight palette dark mode improvements
- Updated dependencies

## 1.12.1

### Patch Changes

- Updated dependencies

## 1.12.0

### Minor Changes

- [#116586](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116586)
  [`3e6333e4a0fbd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3e6333e4a0fbd) -
  [ED-23761] Add analytics for floating toolbar text highlighting experiment

### Patch Changes

- Updated dependencies

## 1.11.3

### Patch Changes

- [#114293](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114293)
  [`7bc5c84260d3d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7bc5c84260d3d) -
  [ux] [ED-23902] Moving dropdown caret of floating toolbar Highlight button to the right hand side
  of the button

## 1.11.2

### Patch Changes

- Updated dependencies

## 1.11.1

### Patch Changes

- [#115380](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115380)
  [`2ca8ba21bdbf1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2ca8ba21bdbf1) -
  [ux] [ED-23759] Fixed button sizing for highlight button in floating toolbar

## 1.11.0

### Minor Changes

- [`955949c077d4f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/955949c077d4f) -
  [ux] [ED-23627] Text highlighting UI review

### Patch Changes

- Updated dependencies

## 1.10.1

### Patch Changes

- Updated dependencies

## 1.10.0

### Minor Changes

- [#114903](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114903)
  [`8f2977cd60ba0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f2977cd60ba0) -
  [ux] [ED-23063] Adds optional floating toolbar button for text highlighting to the selection
  toolbar (disabled by default)

### Patch Changes

- Updated dependencies

## 1.9.0

### Minor Changes

- [#112947](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112947)
  [`ec865ff1780db`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ec865ff1780db) -
  [ux] [ED-23760] Refactor Editor Highlight toolbar button to facilitate reuse and add a (currently
  unused) Floating toolbar button

## 1.8.1

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#110884](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110884)
  [`674f78166705c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/674f78166705c) -
  [ux] [ED-23516] Change border color for highlight and text-color palettes to use tokens.
  Changedefault palette color when undefined

### Patch Changes

- Updated dependencies

## 1.7.5

### Patch Changes

- [#107302](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107302)
  [`b1279657d678b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b1279657d678b) -
  [ux] [ED-23162] Add keyboard shortcut to toggle highlight color palette
- [#107453](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107453)
  [`30d2c10cc823d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30d2c10cc823d) -
  [ED-23515] Remove selected state for "Remove highlight" option, added multiple color nuance to
  change color analytics
- Updated dependencies

## 1.7.4

### Patch Changes

- [#107856](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107856)
  [`7ba2db81f78ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7ba2db81f78ac) -
  [ux] [ED-23348] Make transparent option in highlight color palette more obvious with a diagonal
  line.
- Updated dependencies

## 1.7.3

### Patch Changes

- [#108804](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108804)
  [`3d5378c261364`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d5378c261364) -
  [ED-23517] Changed initial state of highlight plugin to avoid inactive toolbar button in examples
- Updated dependencies

## 1.7.2

### Patch Changes

- Updated dependencies

## 1.7.1

### Patch Changes

- [#108295](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108295)
  [`965a0e6c1088`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/965a0e6c1088) -
  NO-ISSUE Condition adding primary toolbar plugin components based on their presence instead of on
  the feature flag to avoid it not rendering in examples
- Updated dependencies

## 1.7.0

### Minor Changes

- [#104539](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104539)
  [`48044c9de18a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/48044c9de18a) -
  [ED-23340] Split out the background-color mark to its own plugin so we can toggle off the text
  highlighting experiment without breaking existing pages that have highlights

### Patch Changes

- [#104995](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104995)
  [`f3437f0a487e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f3437f0a487e) -
  [ux] [ED-23155] Improve implementation of getActiveColor() to also support cell selections
- Updated dependencies

## 1.6.0

### Minor Changes

- [#104271](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104271)
  [`5d03a899b0c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d03a899b0c9) -
  [ux] [ED-23155] Adds plugin state for currently selected color for highlight button

### Patch Changes

- [#103816](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103816)
  [`3fb50173376f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3fb50173376f) -
  [ED-23159] Added blending styling for when highlights overlap inline comments

## 1.5.0

### Minor Changes

- [#101406](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101406)
  [`6daffd65aec4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6daffd65aec4) -
  [ED-23298] Extract primary toolbar components to editor plugin to allow for custom ordering

### Patch Changes

- [#102478](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102478)
  [`3378951608b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3378951608b0) -
  [ED-23332] Update adf-schema package to 36.10.1
- Updated dependencies

## 1.4.2

### Patch Changes

- [#101513](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101513)
  [`98b5dfc33bed`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/98b5dfc33bed) -
  [ux] [ED-23156] The highlight primary toolbar button is disabled when trying to apply it on nodes
  that don't enable the mark and when in a gap cursor. The text color primary toolbar button is
  disabled when selecting text with a highlight.

## 1.4.1

### Patch Changes

- [#101524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101524)
  [`4821570088e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4821570088e6) -
  ED-23362 Bump ADF schema to version 36.8.1 and add support for adf validation and transformation

## 1.4.0

### Minor Changes

- [#100495](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100495)
  [`dbb78a011fac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dbb78a011fac) -
  [ux] [ED-23150] Added `changeColor` command for editor-plugin-highlight, including new
  `removeMark` command for editor-common. Fixed bug with editor-plugin-text-color which prevented
  color from being removed when user selects all.

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#100553](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100553)
  [`e0c2a4b9c8ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e0c2a4b9c8ae) -
  [ED-23157] Clear background color (= highlights) when clearing the formatting on a selection

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#99579](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99579)
  [`f222af5687e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f222af5687e9) -
  Bump adf-schema to 36.3.0 and adf-schema-json to 1.14.0

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#98130](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98130)
  [`6a3c0d9d6382`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a3c0d9d6382) -
  [ED-23154] Add highlight option to main toolbar in editor

### Patch Changes

- Updated dependencies

## 1.0.5

### Patch Changes

- [#97599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97599)
  [`32c3130b08fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32c3130b08fe) -
  [ED-22282] Bump adf-schema to 36.1.0

## 1.0.4

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#96237](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96237)
  [`0401e7b5a88e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0401e7b5a88e) -
  [ED-23102] Bump ADF schema to version 35.12.2
- [#96613](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96613)
  [`398961a2b0a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/398961a2b0a1) -
  [ux] [ED-23133] Moved stepped rainbow text colour icon styles to editor-common and refactored to
  be reusable

## 1.0.1

### Patch Changes

- [#95715](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95715)
  [`f036f2fd9ccf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f036f2fd9ccf) -
  [ED-23102] Added global styles that map the custom CSS variables to background color for
  background color mark
