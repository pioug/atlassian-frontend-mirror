# @atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration

## 0.2.1

### Patch Changes

- [`16a901a9476`](https://bitbucket.org/atlassian/atlassian-frontend/commits/16a901a9476) - - Fixes a bug that could lead to invalid syntax when inserting comments before
  a `JSXExpressionContainer` node. Comments will now be wrapped in a new
  `JSXExpressionContainer` node.
  - Adds a file filter to the codemod transformers, so that only files which import
    either `react-beautiful-dnd` or `react-beautiful-dnd-next` will be processed.

## 0.2.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`6be2b5508a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6be2b5508a9) - Initial release
