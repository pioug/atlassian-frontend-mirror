# @atlaskit/drag-and-drop

## 0.12.0

### Minor Changes

- [`90901f5bbe0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/90901f5bbe0) - Replace default entry point of `undefined` with `{}`.

  > **NOTE:** Importing from the default entry point isn't supported.
  > _Please use individual entry points in order to always obtain minimum kbs._

## 0.11.0

### Minor Changes

- [`1ecbb19d450`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ecbb19d450) - Adding a new function to make creating _custom_ native drag previews safe and easy: `setCustomNativeDragPreview`

  ```tsx
  import { setCustomNativeDragPreview } from '@atlaskit/drag-and-drop/util/set-custom-native-drag-preview';

  draggable({
    element: myElement,
    onGenerateDragPreview: ({ nativeSetDragImage }) => {
      setCustomNativeDragPreview({
        render: function render({ container }) {
          ReactDOM.render(<Preview item={item} />, container);
          return function cleanup() {
            ReactDOM.unmountComponentAtNode(container);
          };
        },
        nativeSetDragImage,
      });
    },
  });
  ```

  Please see our element adapter documentation for more detailed usage information

## 0.10.0

### Minor Changes

- [`9c0975e2fab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c0975e2fab) - Bug fix: A _monitor_ should not be called after it is removed. Previously, if a _monitor_ (monitor 1) removed another _monitor_ (monitor 2) for the same event, then the second monitor (monitor 2) would still be called. This has been fixed

  ```ts
  const cleanupMonitor1 = monitorForElements({
    onDragStart: () => {
      cleanupMonitor2();
    },
  });
  const cleanupMonitor2 = monitorForElements({
    // Previously this `onDragStart` would have been called during `onDragStart` even though it was unbound by the first monitor
    onDragStart: () => {},
  });
  ```

## 0.9.0

### Minor Changes

- [`03e0aa5ae85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/03e0aa5ae85) - `@atlaskit/drag-and-drop` adds event listeners to the `window` during a drag operation. These drag operation event listeners were [`bubble` phase event listeners](https://domevents.dev/), but they are now `capture` phase event listeners to be more resliant against external code (incorrectly) stopping events.

  This does not impact the ability of a consumer to have their own `draggable`s on a page not controlled by `@atlaskit/drag-and-drop`

## 0.8.1

### Patch Changes

- [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving performance.

## 0.8.0

### Minor Changes

- [`1e3f9743e57`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e3f9743e57) - A _monitor_ that is added during an event (eg `onDragStart`) will no longer be called for the current event. This is to prevent the accidental creation of infinite loops. This behaviour matches native [`EventTargets`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) where an event listener cannot add another event listener during an active event to the same event target in the same event phase.

## 0.7.1

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 0.7.0

### Minor Changes

- [`f2a7931d609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2a7931d609) - Adding jsdoc to DragLocation type for better autocomplete

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
