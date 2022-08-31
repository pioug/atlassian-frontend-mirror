# @atlaskit/drag-and-drop-indicator

## 0.2.0

### Minor Changes

- [`e26c936c610`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e26c936c610) - We have improved our naming consistency across our drag and drop packages.

  - The exports from `@atlaskit/drag-and-drop-indicator` have now been shifted over to `@atlaskit/drag-and-drop-indicator/box`. `@atlaskit/drag-and-drop-indicator` will no longer be useable from the root entry point

  ```diff
  - import { DropIndicator } from '@atlaskit/drag-and-drop-indicator';
  + import { DropIndicator } from '@atlaskit/drag-and-drop-indicator/box';
  ```

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`73427c38077`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73427c38077) - Initial release of `@atlaskit/drag-and-drop` packages 🎉

### Patch Changes

- Updated dependencies

## 0.0.1

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.
- Updated dependencies
