# @atlaskit/editor-plugin-media

## 0.4.6

### Patch Changes

- [#43825](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43825) [`b21c6c1caa8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b21c6c1caa8) - [ux] [ED-20885] Group layout buttons in mediaSingle floating toolbar into a dropdown

## 0.4.5

### Patch Changes

- [#43646](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43646) [`d43f8e9402f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d43f8e9402f) - Make feature flags plugin optional in all plugins including:

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

  We already treat it as optional in the plugins, so this is just ensuring that the plugin is not mandatory to be added to the preset.

## 0.4.4

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417) [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971 Upgrade adf-schema package to ^34.0.0

## 0.4.3

### Patch Changes

- Updated dependencies

## 0.4.2

### Patch Changes

- [#43436](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43436) [`6bf14e25965`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6bf14e25965) - Revert "Resize media for the keyboard users"

## 0.4.1

### Patch Changes

- [#43145](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43145) [`999af31b6ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/999af31b6ad) - [ux] [ED-20776] Change mediaInline node insertion logic behind 'platform.editor.media.inline-image.base-support' feature flag. With the flag on, Adding an image to a non-empty paragraph and list node inserts an media inline node, instead of media single node.
- Updated dependencies

## 0.4.0

### Minor Changes

- [#43108](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43108) [`b779a47b799`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b779a47b799) - ECA11Y-86: Added ability to resize media via keyboard and added announcer

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379) [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763 Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 0.3.17

### Patch Changes

- Updated dependencies

## 0.3.16

### Patch Changes

- [#43014](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43014) [`f021d31543e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f021d31543e) - create useFileState hook versions of header and itemviewer, create list-v2, refactor MediaFileStateError to media-client-react
- [#42702](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42702) [`79e5ed8fac7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79e5ed8fac7) - ED-19543 remove unused FF check
- [#43014](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43014) [`761551f78ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/761551f78ab) - Implement useFileState hook on Media Viewer under Version 2
- Updated dependencies

## 0.3.15

### Patch Changes

- [#42995](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42995) [`a527682dee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a527682dee6) - add in missing dependencies for imported types
- Updated dependencies

## 0.3.14

### Patch Changes

- [#42899](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42899) [`4b3e40bff6f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b3e40bff6f) - Added a new media plugin state `allowInlineImages` to support upcoming feature development.

## 0.3.13

### Patch Changes

- [#42834](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42834) [`a4695f1205a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4695f1205a) - Fix TS errors for editor packages in AFM

## 0.3.12

### Patch Changes

- Updated dependencies

## 0.3.11

### Patch Changes

- [#42757](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42757) [`73c66d2c6db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73c66d2c6db) - remove media securedClipboard FF
- Updated dependencies

## 0.3.10

### Patch Changes

- Updated dependencies

## 0.3.9

### Patch Changes

- [#41659](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41659) [`a0c97a19dba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a0c97a19dba) - Remove unused utils and depreciated exports in mediaClient.
- Updated dependencies

## 0.3.8

### Patch Changes

- Updated dependencies

## 0.3.7

### Patch Changes

- [#40916](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40916) [`0b80e2e68ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b80e2e68ea) - [ux] media single node with external type media should not show migration ui. Update external image with natural dimensions accordingly, and fixed whitespace issue in external image.

## 0.3.6

### Patch Changes

- [#41747](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41747) [`8b2001e7bbe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b2001e7bbe) - Extend mediaSingle from Component as props were not causing PureComponent to rerender correctly

## 0.3.5

### Patch Changes

- [#40861](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40861) [`a7e65721b8b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a7e65721b8b) - ECA11Y-73: Add announcements for the screen reader users when the user types incorrect values in Alt text input field

## 0.3.4

### Patch Changes

- [#41343](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41343) [`243143e8007`](https://bitbucket.org/atlassian/atlassian-frontend/commits/243143e8007) - Improved media single performance by preventing unnecessary updates to collab service on every component update

## 0.3.3

### Patch Changes

- [#41425](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41425) [`130e8656e37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/130e8656e37) - Fixed bug where media single node was shrinking unexpectedly inside table cell.

## 0.3.2

### Patch Changes

- [#41248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41248) [`21fa5648746`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21fa5648746) - Fix incorrect layout calculation for nested Media Single nodes resized via toolbar
- Updated dependencies

## 0.3.1

### Patch Changes

- [#40750](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40750) [`fc19a7b9edd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc19a7b9edd) - [ED-19875] Extraction of Editor Core's Selection Plugin into independent package '@atlaskit/editor-plugin-selection'.
- Updated dependencies

## 0.3.0

### Minor Changes

- [#41187](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41187) [`c09b3a047f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c09b3a047f4) - Extract media plugin from `@atlaskit/editor-core` to `@atlaskit/editor-plugin-media.

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#40755](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40755) [`c1cd5ba7d38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1cd5ba7d38) - [ED-16733] Extraction Media Plugin: Add new placeholder package for media types.
