# @atlaskit/drag-and-drop-autoscroll

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
