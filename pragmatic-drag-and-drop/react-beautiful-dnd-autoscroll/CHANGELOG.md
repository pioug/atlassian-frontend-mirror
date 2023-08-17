# @atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-autoscroll

## 0.6.3

### Patch Changes

- Updated dependencies

## 0.6.2

### Patch Changes

- Updated dependencies

## 0.6.1

### Patch Changes

- Updated dependencies

## 0.6.0

### Minor Changes

- [`75f89536e12`](https://bitbucket.org/atlassian/atlassian-frontend/commits/75f89536e12) - Renaming this package from `@atlaskit/pragmatic-drag-and-drop-autoscroll` to `@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-autoscroll`.

  This package is a port of the existing `react-beautiful-dnd` auto scroller that we will continue to have as a separate package for usage with our `react-beautiful-dnd` → Pragmatic drag and drop migration layer (`@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration`).

  We are creating a new, more feature rich auto scroller which will soon be published as `@atlaskit/pragmatic-drag-and-drop-autoscroll`

## 0.5.4

### Patch Changes

- Updated dependencies

## 0.5.3

### Patch Changes

- [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 0.5.2

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 0.5.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.5.0

### Minor Changes

- [`9fd8556db17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fd8556db17) - Internal folder name structure change

### Patch Changes

- Updated dependencies

## 0.4.0

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

## 0.3.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 0.2.5

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 0.2.4

### Patch Changes

- Updated dependencies

## 0.2.3

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

- [`1bfcde9828c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1bfcde9828c) - Adds a `behavior` option to the auto scroller. This allows for finer control over window and container scrolling precedence.

  ```ts
  type ScrollBehavior =
    | 'window-then-container'
    | 'container-then-window'
    | 'window-only'
    | 'container-only';
  ```

  - `window-then-container`: Attempt to scroll the window, then attempt to scroll the container if window scroll not possible
  - `container-then-window`: Attempt to scroll the container, then attempt to scroll the window if container scroll not possible
  - `container-only`: Only attempt to scroll the window
  - `window-only`: Only attempt to scroll the window

  Example:

  ```ts
  autoScroller.start({
    input: /* ... */,
    scrollBehavior: 'container-then-window'
  });
  ```

## 0.1.13

### Patch Changes

- Updated dependencies

## 0.1.12

### Patch Changes

- Updated dependencies

## 0.1.11

### Patch Changes

- Updated dependencies

## 0.1.10

### Patch Changes

- [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving performance.

## 0.1.9

### Patch Changes

- Updated dependencies

## 0.1.8

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 0.1.7

### Patch Changes

- [`32d7630d1aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/32d7630d1aa) - Updating @emotion dev dependency

## 0.1.6

### Patch Changes

- Updated dependencies

## 0.1.5

### Patch Changes

- Updated dependencies

## 0.1.4

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

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
