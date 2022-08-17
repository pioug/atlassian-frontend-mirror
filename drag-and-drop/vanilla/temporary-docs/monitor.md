# Monitor

A _monitor_ can listen for all events for a particular entity type (eg files). A _drag adapter_ will provide a monitor.

```ts
import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';

// listen for all drag events for elements
monitorForElements({
  onDragStart: () =>
    console.log('I am called whenever any `draggable` element starts dragging'),
});
```

Event listeners created with _monitors_ are called after local event listeners are finished, even if a _monitor_ happens to be created along side local event listeners

```ts
const unbind = combine(
  draggable({
    element: myElement,
    onDragStart: () => 'start',
  }),
  // called after all `draggable` and `dropTarget` event listeners have been called
  monitorForElements({
    onDragStart: () => 'global start',
  }),
);
```

_monitors_ are called in the same order in which they are created. Over time it can be hard to reason about what this ordering is as a consumer as you might be creating / destroying monitors frequently. So it is safe to expect that "monitors are called last", but you need to be careful if you want to rely on any ordering relationships between _monitors_

```tsx
function App() {
  useEffect(() => {
    const cleanup = monitor({
      onDragStart: () => 'This monitor gets created on each render!',
    });
    return cleanup;
  });

  return null;
}
```
