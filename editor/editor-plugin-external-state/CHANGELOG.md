# @atlaskit/editor-plugin-external-state

## 0.2.0

### Minor Changes

- [`b15354550dd8a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b15354550dd8a) -
  setState now records an ExternalStateStep, a local-only step, so a change, its undo and its redo
  enter local undo history without being sent to collaborators. Local changes, undos and redos are
  saved through the provider; loaded, collaborator and reverted values are not. Behind
  platform_editor_numbered_headings.

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`1aca24475cb3c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1aca24475cb3c) -
  Add the external state plugin. It holds editor settings stored outside ADF (numbered headings
  first) and loads, saves, reverts and syncs them through an ExternalStateProvider. Used behind
  platform_editor_numbered_headings.
