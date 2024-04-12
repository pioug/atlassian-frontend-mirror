Block the usage of web platform drag and drop functionality directly. Use Pragmatic drag and drop.

## Rationale

The web platform has powerful drag and drop functionality built in. However, it is hard to be successful with web platform drag and drop due to bugs, inconsistencies and usage friction. Rather than leveraging the web platform API directly, the rule enforces the usage of [Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop), which allows people to easily and successfully leverage web platform drag and drop.

## Examples

This rule marks direct usage of web platform drag events as violations.

### Incorrect

Adding drag related event listeners on intrinsic `react` elements (eg `div`, `span`, `strong` and so on).

```tsx
<div onDragStart={fn}>{children}</div>
     ^^^^^^^^^^^
<div onDragEnter={fn}>{children}</div>
     ^^^^^^^^^^^
<div onDragLeave={fn}>{children}</div>
     ^^^^^^^^^^^
<div onDragOver={fn}>{children}</div>
     ^^^^^^^^^^^
<div onDrag={fn}>{children}</div>
     ^^^^^^
<div onDrop={fn}>{children}</div>
     ^^^^^^
<div onDragEnd={fn}>{children}</div>
     ^^^^^^^^^
```

Adding drag related event listeners on our `<Box>` primitive.

```tsx
import { Box } from '@atlaskit/primitives';

<Box onDragStart={fn}>{children}</Box>
     ^^^^^^^^^^^
<Box onDragEnter={fn}>{children}</Box>
     ^^^^^^^^^^^
<Box onDragLeave={fn}>{children}</Box>
     ^^^^^^^^^^^
<Box onDragOver={fn}>{children}</Box>
     ^^^^^^^^^^^
<Box onDrag={fn}>{children}</Box>
     ^^^^^^
<Box onDrop={fn}>{children}</Box>
     ^^^^^^
<Box onDragEnd={fn}>{children}</Box>
     ^^^^^^^^^
```

Binding drag related events using `eventTarget.addEventListener()`

```ts
window.addEventListener('dragstart', fn);
                        ^^^^^^^^^^^
window.addEventListener('dragenter', fn);
                        ^^^^^^^^^^^
window.addEventListener('dragleave', fn);
                        ^^^^^^^^^^^
window.addEventListener('dragover', fn);
                        ^^^^^^^^^^
window.addEventListener('drag', fn);
                        ^^^^^^
window.addEventListener('drop', fn);
                        ^^^^^^
window.addEventListener('dragend', fn);
                        ^^^^^^^^^
```

Binding drag related events using `bind()` from [bind-event-listener](https://github.com/alexreardon/bind-event-listener)

```ts
import {bind} from 'bind-event-listener';

bind(element, { type: 'dragstart', listener: fn });
                      ^^^^^^^^^^^
bind(element, { type: 'dragenter', listener: fn });
                      ^^^^^^^^^^^
bind(element, { type: 'dragleave', listener: fn });
                      ^^^^^^^^^^^
bind(element, { type: 'dragover', listener: fn });
                      ^^^^^^^^^^
bind(element, { type: 'drag', listener: fn });
                      ^^^^^^
bind(element, { type: 'drop', listener: fn });
                      ^^^^^^
bind(element, { type: 'dragend', listener: fn });
                      ^^^^^^^^^
```

Binding drag related events using `bindAll()` from [bind-event-listener](https://github.com/alexreardon/bind-event-listener)

```ts
import {bindAll} from 'bind-event-listener';

bindAll(window, [
  { type: 'dragstart', listener: fn },
          ^^^^^^^^^^
  { type: 'dragenter', listener: fn },
          ^^^^^^^^^^
  { type: 'dragleave', listener: fn },
          ^^^^^^^^^^
  { type: 'dragover', listener: fn },
          ^^^^^^^^^^
  { type: 'drag', listener: fn },
          ^^^^^^
  { type: 'drop', listener: fn },
          ^^^^^^
  { type: 'dragend', listener: fn },
          ^^^^^^^^^
]);
```

### Correct

Leveraging Pragmatic drag and drop for web platform drag and drop.

```ts
import { monitor } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

monitor({
  onGenerateDragPreview: fn,
  onDragStart: fn,
  onDropTargetChange: fn,
  onDrag: fn,
  onDrop: fn,
});
```

> See the [Pragmatic drag and drop documentation](https://atlassian.design/components/pragmatic-drag-and-drop) for more information about it's usage.

Using blocked JSX attributes on custom `react` components

```tsx
<MyComponent onDragStart={fn}>
```
