# @atlaskit/drag-and-drop-indicator

## 0.7.0

### Minor Changes

- [`ace261c5753`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ace261c5753) - For the experimental tree drop indicator, we have changed the `gap` and `inset` from `number` to `string` to align with our `Box` line indicator.

  Note: consumers should not be using the _experimental_ tree drop indicator in production. We are exposing this work in progress component for internal experimentation purposes.

## 0.6.2

### Patch Changes

- Updated dependencies

## 0.6.1

### Patch Changes

- Updated dependencies

## 0.6.0

### Minor Changes

- [`9066b866ed1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9066b866ed1) - The `edge` prop on the box drop indicator `@atlaskit/drag-and-drop-indicator/box` was _previously_ **optional** and is _now_ **required**.

  For the fastest possible applications, it is important that `<DropIndicator>` is only doing work when it needs to. Making `edge` **required** forces consumers to only render the `<DropIndicator>` when it is actually doing something. We are using the type system to ensure the fastest possible usage

  ```diff
  - <DropIndicator edge={closestEdge} />
  + { closestEdge && <DropIndicator edge={closestEdge} /> }
  ```

## 0.5.2

### Patch Changes

- Updated dependencies

## 0.5.1

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 0.5.0

### Minor Changes

- [`5b37b07dc94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b37b07dc94) - Moving from `@emotion/core@10` to `@emotion/react@11` to line up `@emotion` usage with the rest of the Design System

## 0.4.2

### Patch Changes

- Updated dependencies

## 0.4.1

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [`01232de241c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01232de241c) - The `gap` prop now takes a CSS string instead of a number.

## 0.3.0

### Minor Changes

- [`17950433a70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17950433a70) - Touching package to release re-release previous version. The previous (now deprecated) version did not have it's entry points built correctly

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

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
