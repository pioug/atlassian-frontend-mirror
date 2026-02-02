# @atlaskit/editor-plugin-show-diff

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- [`917bb70243d23`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/917bb70243d23) -
  [ux] [ENGHEALTH-43911] increase visual contrast for deleted text when viewing changes

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.3.3

### Patch Changes

- Updated dependencies

## 3.3.2

### Patch Changes

- [`5c35083992b75`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5c35083992b75) -
  [EDITOR-3498] Redo + view changes makes browser freeze, fixed bug.

## 3.3.1

### Patch Changes

- [`be40850b186a8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/be40850b186a8) -
  Rolled up editor AIFC beta gates into the parent streaming gate. Also decoupled the placholder
  from the main AIFC FG by utilising the withEmptyParagraph plugin option, since this prop is only
  set when AIFC is enabled. This means we don't need refs to this gate in the plugin because it's
  already controlled by a prop.
- Updated dependencies

## 3.3.0

### Minor Changes

- [`a36ac8c9961b1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a36ac8c9961b1) -
  [ux] [EDITOR-2608] updated show diff deleted block nodes design

### Patch Changes

- Updated dependencies

## 3.2.8

### Patch Changes

- [`e3779b75fdeca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3779b75fdeca) -
  EDITOR-1643 Promote syncBlock and bodiedSyncBlock to full schema
- Updated dependencies

## 3.2.7

### Patch Changes

- [`bc52c059565f2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bc52c059565f2) -
  Fix issue with simplify changes being too aggressive and dropping steps causing diffs to fail.

## 3.2.6

### Patch Changes

- [`05ee61c6ace09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/05ee61c6ace09) -
  Improve performance of show diff by increasing merge of steps
- Updated dependencies

## 3.2.5

### Patch Changes

- [`a05464ea42678`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a05464ea42678) -
  EDITOR-2791 bump adf-schema
- [`657693883946f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/657693883946f) -
  Fix diffs for extension nodes
- Updated dependencies

## 3.2.4

### Patch Changes

- [`0b00861d972cd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0b00861d972cd) -
  [EDITOR-2668] refactored deleted mediaSingle decorations to maintain alignment/wrap on diff view
- Updated dependencies

## 3.2.3

### Patch Changes

- Updated dependencies

## 3.2.2

### Patch Changes

- [`1c0d87f570c52`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1c0d87f570c52) -
  [ux] Update attributes to ignore attr steps that do not affect the document

## 3.2.1

### Patch Changes

- [`da2782d8dc1e7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/da2782d8dc1e7) -
  Support table row diff displaying in the editor

## 3.2.0

### Minor Changes

- [`68caaf98e8f89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/68caaf98e8f89) -
  [ux] [EDITOR-1628] Added "Removed" Lozenge and gray border decorations to deleted block nodes in
  show diff view

### Patch Changes

- Updated dependencies

## 3.1.5

### Patch Changes

- [`7c8492867be97`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7c8492867be97) -
  [ux] Add support for media attribute changes in the diff

## 3.1.4

### Patch Changes

- [`21fe79119fe74`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21fe79119fe74) -
  EDITOR-2447 Bump adf-schema to 51.3.2
- Updated dependencies

## 3.1.3

### Patch Changes

- [`c28cd65d12c24`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c28cd65d12c24) -
  EDITOR-2447 Bump adf-schema to 51.3.1
- Updated dependencies

## 3.1.2

### Patch Changes

- [`63e63c69cd679`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/63e63c69cd679) -
  Add styling for bullet point markers on diff

## 3.1.1

### Patch Changes

- [`174d939cfd1ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/174d939cfd1ba) -
  Use valid positioning for deleted diff content to avoid invalid nesting diffs

## 3.1.0

### Minor Changes

- [`5167552fe1a93`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5167552fe1a93) -
  [EDITOR-2339] Bump @atlaskit/adf-schema to 51.3.0

### Patch Changes

- [`38fb1054b8b7a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/38fb1054b8b7a) -
  Recover from invalid deletion decorations
- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [`16d89ac68ca47`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/16d89ac68ca47) -
  Improve how large number of small steps are grouped together in the diff.
- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- [`b8555904ec1cc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b8555904ec1cc) -
  Add new util for comparing nodes ignoring attributes.
- Updated dependencies

## 2.1.2

### Patch Changes

- [`7bd504ca6f5a1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7bd504ca6f5a1) -
  Export PMDiffParams type for editor diff plugin for use

## 2.1.1

### Patch Changes

- [`c6b6ef91296ca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c6b6ef91296ca) -
  [ux] Better support for block nodes for deleted diffs.
- Updated dependencies

## 2.1.0

### Minor Changes

- [`5eadb7f870272`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5eadb7f870272) -
  [ux] Adds a new plugin configuration to adjust the styling scheme for diffs. By default it will
  use standard, but traditional (for green + red) is also available.

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [`4144b576f0bf8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4144b576f0bf8) -
  Ignore attribute changes when ensuring the steps match the final document
- Updated dependencies

## 1.0.0

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- [`f7c9ea51bb613`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f7c9ea51bb613) -
  [EDITOR-1395] dnd interferes with diff
- Updated dependencies

## 0.2.0

### Minor Changes

- [`3df4a57528050`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3df4a57528050) -
  Update editor showDiffPlugin to take in params for preset use in Confluence version history.

## 0.1.7

### Patch Changes

- [`06722cb00f629`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/06722cb00f629) -
  [EDITOR-1358] Remove extra parameters parased in and refactored initialisation for show-diff
  editorView

## 0.1.6

### Patch Changes

- [`3d9a6a0aae8c5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d9a6a0aae8c5) -
  Fix show diff not loading inline node diffs on load
- Updated dependencies

## 0.1.5

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs

## 0.1.4

### Patch Changes

- [`1fc9ea612c6ef`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1fc9ea612c6ef) -
  [EDITOR-1358] Fix nit + minor local bug

## 0.1.3

### Patch Changes

- [`8700ce859da07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8700ce859da07) -
  [EDITOR-1249] Added inline node support for show diff

## 0.1.2

### Patch Changes

- [`7fe4c9e51271d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7fe4c9e51271d) -
  Fix initial show diff after performance fix.
- [`b2d53a70dbaa5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d53a70dbaa5) -
  Improve show diff performance by storing decorations in state.
- Updated dependencies

## 0.1.1

### Patch Changes

- [`941fdc429d140`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/941fdc429d140) -
  Show formatting changes in the diff
- Updated dependencies

## 0.1.0

### Minor Changes

- [`81ec1e909620a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81ec1e909620a) -
  [EDITOR-1206] Have `editor-plugin-show-diff` expose if the plugin is displaying the diff.
  Deprecate the state in `editor-plugin-track-changes` as it depends on `editor-plugin-show-diff`
  and it's better to have the state in the plugin that actually shows the diff

## 0.0.3

### Patch Changes

- [`3c2fe6ae106d8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3c2fe6ae106d8) -
  Focus the editor after track changes is turned off.
- Updated dependencies

## 0.0.2

### Patch Changes

- [`9464a4f29a876`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9464a4f29a876) -
  [EDITOR-1194] Bugfix show diff new line if deleted half way
- Updated dependencies

## 0.0.1

### Patch Changes

- Updated dependencies
