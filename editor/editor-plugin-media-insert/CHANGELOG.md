# @atlaskit/editor-plugin-media-insert

## 3.1.3

### Patch Changes

- [`83ae273817f38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/83ae273817f38) -
  ED-24999 Convert External Image Upload form to use components from @atlaskit/form
- Updated dependencies

## 3.1.2

### Patch Changes

- [#147461](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147461)
  [`acef010cdb706`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/acef010cdb706) -
  [ux] [ED-25164] Pass mounting point to media insert plugin for correct toolbar popup positioning
- [#147206](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147206)
  [`c3f82dfdeaf62`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3f82dfdeaf62) -
  [ED-25157] Make sure document inserted for media from the media insert plugin has the correct
  attributes (insertMediaVia)

## 3.1.1

### Patch Changes

- [#147220](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147220)
  [`6d387adfcf115`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d387adfcf115) -
  [ux] [ED-25164] Disable media popup toolbar pinning
- Updated dependencies

## 3.1.0

### Minor Changes

- [#146643](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146643)
  [`6b3dec2ad5378`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b3dec2ad5378) -
  [ux] ED-25116 Pin media popup to toolbar when triggered from toolbar

### Patch Changes

- [#146446](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146446)
  [`c98c34dd5f307`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c98c34dd5f307) -
  [ED-24941] Added analytics for media-insert

  - **@atlaskit/editor-common**: Add enums and types for new anaylics params
  - **@atlaskit/editor-plugin-media**: Include 'insertMediaVia' on analytics events for inserting
    media into the document
  - **@atlaskit/editor-plugin-media-insert**: Set 'insertMediaVia' field for particular
    'externalUpload', 'externalUrl' or 'localUpload' media inserts

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.8.4

### Patch Changes

- Updated dependencies

## 2.8.3

### Patch Changes

- [#144608](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144608)
  [`d5049f3552bfa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d5049f3552bfa) -
  [ux] [ED-25088] Hook up insertFile event subscribers to fix comment button state

## 2.8.2

### Patch Changes

- Updated dependencies

## 2.8.1

### Patch Changes

- [#143644](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143644)
  [`b5352e3195293`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b5352e3195293) -
  [ux] [ED-24327] Integrate new media popup into toolbar and quick action
- Updated dependencies

## 2.8.0

### Minor Changes

- [#142802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142802)
  [`09c0d0a18b491`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/09c0d0a18b491) -
  [ux] [ED-24935] [ED24921] Add URL validation and enforce max length for input field

## 2.7.3

### Patch Changes

- Updated dependencies

## 2.7.2

### Patch Changes

- [#141594](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141594)
  [`3f6b2eb7bd493`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f6b2eb7bd493) -
  [ux] [ED-24867] This change moves nesting codeblocks and media in blockquotes via insertion
  methods behind an experiment gate.
- Updated dependencies

## 2.7.1

### Patch Changes

- [#140707](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140707)
  [`972fb840acf35`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/972fb840acf35) -
  Switch from fg to experiment for media-from-url
- Updated dependencies

## 2.7.0

### Minor Changes

- [#141109](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141109)
  [`cba4ebf07d83b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cba4ebf07d83b) -
  [ux] [ED-24926] When clicking on media insert from element browser, correctly position the media
  insert popup and scroll into view

## 2.6.2

### Patch Changes

- [#140631](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140631)
  [`deed1759cb1d3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/deed1759cb1d3) -
  Remove passing url to alt for external images

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
