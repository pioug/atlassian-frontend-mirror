# Drag and drop (`@atlaskit/drag-and-drop`)

> A performance optimized drag and drop framework 🚀

## Early adopters 👋

Be sure to check out our [pre reading for early adopters](https://hello.atlassian.net/wiki/spaces/DST/pages/1773339489/Pre-reading+for+early+adopters)

## Background

There exist a wealth of existing drag and drop libraries for the web. Some drag and drop libraries are general purpose (eg `@shopify/draggable`, `react-dnd`), and some are for specific experiences (eg `react-beautiful-dnd` is for lists and connected lists). Some libraries leverage the platform's built in drag and drop capabilities, and some rebuild the drag and drop operation from scratch.

Every drag and drop solution will make tradeoffs regarding feature sets, user experience, startup performance and runtime performance.

The goals of `@atlaskit/drag-and-drop` are:

- 🚀 Speed: Best of class startup and runtime performance
- 🤸 Flexibility: Can be used to power any interaction
- 🧑‍🦽 Accessibility\*: Ensuring that all users have a good experience

> \*Accessible experiences are achieved through alternative keyboard and screen reader flows. Unfortunately, the browsers drag and drop behaviour is not accessible (yet). But don't worry, we have a comprehensive guide and toolchain to help you be successful here

## Core characteristics

- 🌎 Platform powered: leverages the browsers drag and drop capabilities
- 🐁 Tiny: ~`4.5kB` base
- 🪡 Incremental: only pay for what you use
- ⏳ Deferred compatible: consumers can delay the loading of `@atlaskit/drag-and-drop` (and related packages) in order to improve page load speeds
- 🎨 Headless: full rendering and style control
- 📱 Mobile support
- 🎁 Addons: patterns that allow sharing small pieces of functionality that can be added together
- 🎄 Framework agnostic: works with any frontend framework
- 🧑‍🦽 Accessible: comprehensive toolchain and patterns for creating highly accessible experiences

## Feature set

`@atlaskit/drag-and-drop` can be used to power any drag and drop experience on the web, of any entity type.

Some experiences you can power with `@atlaskit/drag-and-drop`:

- lists
- boards
- trees
- grid / mosaic reordering
- table column reordering
- table row reordering
- drawing
- file uploads
- resizing
- dragging between windows (experimental)

<details>
    <summary>The lower level capabilities</summary>

- Supports dragging of different entity types (eg elements, text, images, external files etc)
- Nested _drop targets_ (elements that can be dropped on)
- Flexible _drop target_ sizes
- Can add, remove, or change _drop targets_ while dragging
- Conditional dropping
- Auto scrolling
- Stickiness: a _drop targets_ can maintain selection even after it is no longer being dragged over
- [`dropEffect`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect) control
- High frequency input updates to power high fidelity interactions

(Using the element adapter)

- Drag handles (drag a `draggable` element) by a part of it
- Conditional dragging
- Nested `draggable` elements
- Flexible `draggable` sizes
- Many options to customize the appearance of the _drag preview_ (the thing that a user drags around during a drag)
- Can add, remove, or change `draggables` while dragging (even the dragging `draggable`)
- Supports virtual list usage for extreme performance
- An element can be a _drop target_, `draggable` or both
- An element can be a _drop target_ for different entities (eg `dropTargetForElements` and `dropTargetForFiles`)

</details>

## High level concepts

### Adapter

A drag adapter teaches `@atlaskit/drag-and-drop` how to handle dragging a particular entity (eg [elements]('./element-adapter.md'), [external files]('./file-adapter.md), text etc). When you use a drag adapter you will bring in the code required for that entity and no more. For example, if you use the element adapter, your application won't include any code for handling files.

A drag adapter always provides at least two pieces:

1. A way of registering _drop target_ (eg `dropTargetForElements`).
2. A way to create a _monitor_ (eg `monitorForFiles`).

```ts
import {
  dropTargetForFiles,
  monitorForFiles,
} from '@atlaskit/drag-and-drop/adapter/file';

import {
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/drag-and-drop/adapter/element';
```

A drag adapter can also provide additional pieces. For example, the [element adapter]('./element-adapter.md) provides a `draggable` function which is a way of registering an `Element` as being draggable.

```ts
import { draggable } from '@atlaskit/drag-and-drop/adapter/element';

draggable({
  element: myElement,
});
```

### Drop target

An `Element` that can be dropped on by something that is dragging

```ts
import { dropTargetForFiles } from '@atlaskit/drag-and-drop/adapter/file';

dropTargetForFiles({
  element: myElement,
});
```

More information → [drop target]('./drop-target.md)

### Monitor

A way of listening for `@atlaskit/drag-and-drop` drag operation events anywhere.

```ts
import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';

monitorForElements({
  element: myElement,
  onDragStart: () => console.log('an element started dragging'),
});
```

### Addons

An addon piece of code that impacts the control flow of your drag operation (eg [closest edge addon]('./closest-edge-addon')) or performs some side effect during the drag operation (eg the [auto scroller addon](./TODO)).

### Utilities

Small helpers functions common tasks (eg `once` for simple memoization, `combine` to collapse cleanup functions)

### Term: Drag source

The entity that is dragging. These can be internal to a page (eg a `draggable` from the [element adapter]('./element-adapter.md)) or external (eg a [file]('./file-adapter.md'))

### Term: Drag preview

The _thing_ that a user drags around. For elements, this is generally a picture of the drag source (a `draggable` element)

### Term: Drop indicator

Something that is drawn to indicate where the drag source will be dropped (generally a line). You are free to draw your own drop indicators. We also have a package of premade ones: `@atlaskit/drag-and-drop-indicator`.

## Getting started

Install the adapter(s) you can to use

- [Elements]('./element-adapter.md'): `@atlaskit/drag-and-drop/adapter/element`
- [Files]('./file-adapter.md'): `@atlaskit/drag-and-drop/adapter/file`
- Dragging text selections: _not created yet_
- Dragging elements between documents: _experimental_

```bash
# yarn
yarn add @atlaskit/drag-and-drop/adapter/element

# npm
npm install @atlaskit/drag-and-drop/adapter/element --save
```

Basic element adapter usage with `react`

```tsx
// import from the adapters you want to use
// here we are using the `element` adapter
import { draggable } from '@atlaskit/drag-and-drop/adapter/element';
import invariant from 'tiny-invariant';

export function Card({ cardId }: { cardId: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);
    // make an element a draggable and a drop target
    return draggable({
      element: el,
      getInitialData: () => ({ cardId }),
    });
  }, [cardId]);

  return <div ref={ref}>Drag me! {cardId}</div>;
}
```

## Deferred loading

`@atlaskit/drag-and-drop` is compatible with deferred loading. This allows you to load in `@atlaskit/drag-and-drop` after time to interactive to some future time when you need it.

See our [deferred loading guide]('./deferred-loading.md)
