# @atlaskit/editor-plugin-media-insert

## 2.6.1

### Patch Changes

- Updated dependencies

## 2.6.0

### Minor Changes

- [#140146](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140146)
  [`1d9fce7fc2523`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1d9fce7fc2523) -
  [ux] [ED-24912] **@atlaskit/editor-plugin-media-insert**: Makes sure that users can upload
  non-media files, users can also select multiple files from their local media browser to upload at
  once **@atlaskit/editor-plugin-media**: Adds a type export for `MediaStateEventListener` &
  `MediaStateEventSubscriber`

## 2.5.3

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 2.5.2

### Patch Changes

- Updated dependencies

## 2.5.1

### Patch Changes

- [`45ce61e4e55b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/45ce61e4e55b0) -
  [ux] [ED-24844] Make tab panels in media insert popup non-focusable, instead users focus will go
  to the first interactive element inside the tab panel

## 2.5.0

### Minor Changes

- [#138801](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138801)
  [`f742cd24b83a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f742cd24b83a1) -
  [ux] [ED-24877] Improve keyboard UX for "from link" media uploads

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#136903](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136903)
  [`2a9928406d4d3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2a9928406d4d3) -
  [ux] [ED-24756] **@atlaskit/editor-plugin-media-insert**: Added a hook to correctly focus on the
  Upload button when user opens media insert (preventing scrolling to the top of the editor)

### Patch Changes

- Updated dependencies

## 2.3.2

### Patch Changes

- [#137217](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137217)
  [`90e304a10f0b2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/90e304a10f0b2) -
  [ED-24843] Fix external flag on media-insert external node creation
- Updated dependencies

## 2.3.1

### Patch Changes

- [#136260](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136260)
  [`852bc79a309bc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/852bc79a309bc) -
  [ux] [ED-24567] Closes the media insert popup when local upload has started
- Updated dependencies

## 2.3.0

### Minor Changes

- [#134882](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134882)
  [`ba204702f8e32`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ba204702f8e32) -
  [ux] [ED-24567] Insert media into the editor via the media insert picker

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#134463](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134463)
  [`d20ae898369bc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d20ae898369bc) -
  [ux] [ED-24326] Add local file upload tab to media insert popup

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- [#134104](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134104)
  [`18a1de35efaf0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/18a1de35efaf0) -
  [ux] ED-24639 Make sure the editor is properly re-focused when the media insert picker is closed
- Updated dependencies

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#129457](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129457)
  [`171c73d4033f0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/171c73d4033f0) -
  [ux] [ED-24566]

  - Internationalisation strings in editor-common for editor-plugin-media-insert
  - Removed default pre-filled URL for editor-plugin-media-insert popup
  - Added background color for editor-plugin-media-insert popup

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [#130061](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130061)
  [`bdad694cb2c24`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bdad694cb2c24) -
  [ux] [ED-24566] **@atlaskit/editor-plugin-media-insert**: When user clicks "Cancel" button on
  insert media popup the focus is returned to the editor **@atlaskit/editor-common**: Added event
  type for media insert cancelled analytics

## 2.0.0

### Major Changes

- [#129869](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129869)
  [`48b31a6b8fb5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/48b31a6b8fb5a) -
  [ux] [ED-24566] Integrated Media URL UI into the Insert Media Popup [ED-24589] Removed export of
  UI component from `editor-plugin-media-insert`

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#129365](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129365)
  [`0cb229e53ad8f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0cb229e53ad8f) -
  [ux] [ED-24249] Added popup dialog for inserting media using editor-plugin-media-insert

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- [#128111](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128111)
  [`5d65c0d1d28c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d65c0d1d28c8) -
  [ux] [ED-24322] Add onPaste UX improvements to url upload
- Updated dependencies

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#128527](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128527)
  [`e9e003a733b63`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e9e003a733b63) -
  Add media upload from URL and associated i18n, analytics and test packages

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- [#126568](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126568)
  [`ce40c0ff7852f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ce40c0ff7852f) -
  Add menu item and typeahead for Upload image from URL

## 1.1.1

### Patch Changes

- Updated dependencies
