# @atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration

## 0.7.0

### Minor Changes

- [`a12da51e227`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a12da51e227) - Makes `react-dom` a peer dependency instead of a direct dependency.

## 0.6.0

### Minor Changes

- [`b560a09202a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b560a09202a) - Fixes a memoization issue, significantly improving rerender performance.

## 0.5.0

### Minor Changes

- [`69c2501037c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69c2501037c) - Fixes a bug that caused parent scroll containers to jump to the top when returning to the source location during a keyboard drag.

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 0.4.2

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.4.1

### Patch Changes

- [`be8246510ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be8246510ed) - Ensures that keyboard drag event bindings are properly cleaned up when a drag is cancelled because of an unhandled error on the window.

## 0.4.0

### Minor Changes

- [`9fd8556db17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fd8556db17) - Internal folder name structure change

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [`34ed7b2ec63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34ed7b2ec63) - We have changed the name of our drag and drop packages to align on the single name of "Pragmatic drag and drop"

  ```diff
  - @atlaskit/drag-and-drop
  + @atlaskit/pragmatic-drag-and-drop

  - @atlaskit/drag-and-drop-autoscroll
  + @atlaskit/pragmatic-drag-and-drop-autoscroll

  - @atlaskit/drag-and-drop-hitbox
  + @atlaskit/pragmatic-drag-and-drop-hitbox

  - @atlaskit/drag-and-drop-indicator
  + @atlaskit/pragmatic-drag-and-drop-react-indicator
  # Note: `react` was added to this package name as our indicator package is designed for usage with `react`.

  - @atlaskit/drag-and-drop-live-region
  + @atlaskit/pragmatic-drag-and-drop-live-region

  - @atlaskit/drag-and-drop-react-beautiful-dnd-migration
  + @atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration

  - @atlaskit/drag-and-drop-docs
  + @atlaskit/pragmatic-drag-and-drop-docs
  ```

  The new `@atlaskit/pragmatic-drag-and-drop*` packages will start their initial versions from where the ``@atlaskit/drag-and-drop*` packages left off. Doing this will make it easier to look back on changelogs and see how the packages have progressed.

### Patch Changes

- Updated dependencies

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
