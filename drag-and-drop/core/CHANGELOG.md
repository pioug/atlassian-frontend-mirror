# @atlaskit/drag-and-drop

## 0.6.0

### Minor Changes

- [`0f755214ee7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f755214ee7) - Internal folder renaming. No API impact

## 0.5.0

### Minor Changes

- [`17950433a70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17950433a70) - Touching package to release re-release previous version. The previous (now deprecated) version did not have it's entry points built correctly

## 0.4.0

### Minor Changes

- [`4d739042b04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d739042b04) - Improving jsdoc auto complete information for `GetFeedbackArgs`

## 0.3.0

### Minor Changes

- [`52403a2c11f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52403a2c11f) - Adding a `canMonitor()` function to _monitors_ to allow a _monitor_ to conditionally apply to a drag operation.

  ```ts
  monitorForElements({
    canMonitor: ({ source }) => source.data.type === 'card',
    onDragStart: () =>
      console.log('I will only be activated when dragging a card!'),
  });
  ```

## 0.2.0

### Minor Changes

- [`1cf9e484b4b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1cf9e484b4b) - We have improved our naming consistency across our drag and drop packages.

  - `@atlaskit/drag-and-drop/util/cancel-unhandled` has been renamed to `@atlaskit/drag-and-drop/addon/cancel-unhandled`

## 0.1.0

### Minor Changes

- [`73427c38077`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73427c38077) - Initial release of `@atlaskit/drag-and-drop` packages 🎉

## 0.0.1

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.
