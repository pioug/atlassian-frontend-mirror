# @atlaskit/editor-plugin-track-changes

## 2.6.3

### Patch Changes

- [`8700ce859da07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8700ce859da07) -
  [EDITOR-1249] Added inline node support for show diff
- Updated dependencies

## 2.6.2

### Patch Changes

- [`22f298149afc8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22f298149afc8) -
  EDITOR-1342: Fix missing mapping causing some steps to break the typeahead.
- Updated dependencies

## 2.6.1

### Patch Changes

- [`941fdc429d140`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/941fdc429d140) -
  Show formatting changes in the diff
- Updated dependencies

## 2.6.0

### Minor Changes

- [`834a792f74e9c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/834a792f74e9c) -
  [EDITOR-1254] Check if the document has changed from the baseline before allowing users to toggle
  "Showing the diff"

### Patch Changes

- Updated dependencies

## 2.5.0

### Minor Changes

- [`81ec1e909620a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81ec1e909620a) -
  [EDITOR-1206] Have `editor-plugin-show-diff` expose if the plugin is displaying the diff.
  Deprecate the state in `editor-plugin-track-changes` as it depends on `editor-plugin-show-diff`
  and it's better to have the state in the plugin that actually shows the diff

### Patch Changes

- Updated dependencies

## 2.4.3

### Patch Changes

- [`3c2fe6ae106d8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3c2fe6ae106d8) -
  Focus the editor after track changes is turned off.
- Updated dependencies

## 2.4.2

### Patch Changes

- Updated dependencies

## 2.4.1

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#193925](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193925)
  [`696d65f882441`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/696d65f882441) -
  Implement `resetBaseline` command for track changes plugin which can be called to reset the diff
  history.

## 2.3.0

### Minor Changes

- [#193889](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193889)
  [`6d4374ce318fd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d4374ce318fd) -
  [EDITOR-1073] Add i18n for Track Changes button & toggle button on toolbar with plugin option

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#193685](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193685)
  [`ee3ba46cb3d0a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee3ba46cb3d0a) -
  [EDITOR-1073] Add undo/ redo & show diff to comment toolbar

### Patch Changes

- Updated dependencies

## 2.1.1

### Patch Changes

- [#190819](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190819)
  [`20420774e83cc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/20420774e83cc) -
  Include Track chages plugin

## 2.1.0

### Minor Changes

- [#189258](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189258)
  [`e6411aa283a9e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e6411aa283a9e) -
  Exposes new state to track if the diff plugin is available for use (ie. for external buttons).
  Defaults to false and is set to true when changes are available.

## 2.0.0

### Major Changes

- [#185139](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185139)
  [`710f9b65a743a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/710f9b65a743a) -
  [EDITOR-1014] Setup basic plugin diffing functionality and documentation

## 1.0.0

### Major Changes

- [#184137](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/184137)
  [`5de7ddbb39301`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5de7ddbb39301) -
  Move editor-common to peer dependencies
