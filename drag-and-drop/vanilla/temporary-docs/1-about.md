# Drag and drop (`@atlaskit/drag-and-drop`)

> A performance optimized drag and drop framework 🚀

## Early adopters 👋

Be sure to check out our [pre reading for early adopters](https://hello.atlassian.net/wiki/spaces/DST/pages/1773339489/Pre-reading+for+early+adopters)

## Background

There exist a wealth of existing drag and drop libraries for the web. Some drag and drop libraries are general purpose (eg `@shopify/draggable`, `react-dnd`), and some are for specific experiences (eg `react-beautiful-dnd` is for lists and connected lists). Some libraries leverage the platforms drag and drop capabilities, and some rebuild the drag and drop operation from scratch.

The existing drag and drop libraries make tradeoffs regarding feature sets, user experience, startup performance and runtime performance. `@atlaskit/drag-and-drop` is a library that makes a novel set of tradeoffs.

- `@atlaskit/drag-and-drop` optimisms for startup and runtime performance over _pseudomorphism_ (physical feeling) design affordances
- `@atlaskit/drag-and-drop` caters for the _entire_ drag and drop problem domain (not just a part of it)

<details>
  <summary>Detailed library comparison</summary>

| Characteristic                                       | `@atlaskit/drag-and-drop`<br/>(element adapter) | `react-beautiful-dnd` | `react-dnd`<br/>(`react-dnd` + `react-dnd-html5-backend`) | `dnd-kit`<br/>(`@dnd-kit/core` + `@dnd-kit/modifiers` + `@dnd-kit/sortable`) | `@shopify/draggable` |
| ---------------------------------------------------- | ----------------------------------------------- | --------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------- |
| Size (gzip)                                          | `4.49 kB`                                       | `31 kB`               | `9.1 kB` + `15.7 kB` (`24.8 kB`)                          | `18.7 kB`                                                                    | `11.8 kB`            |
| Size (minified)                                      | `13.5 kB`                                       | `105 kB`              | `93.6 kB`                                                 | `54.3 kB`                                                                    | `68.2kB`             |
| Supports deferred loading                            | ✅                                              | ❌                    | ❌                                                        | ❌                                                                           | ✅                   |
| Accessible                                           | ✅ (with provided toolchain)                    | ✅                    | ❌                                                        | ✅                                                                           | ❌                   |
| Pseudomorphism affordances                           | ❌ (uses lines and color)                       | ✅                    | ❌ (up to consumer)                                       | ✅                                                                           | ✅                   |
| Incremental<br/>(only pay for what you use)          | ✅                                              | ❌                    | ❌                                                        | ✅                                                                           | ✅                   |
| Framework compatibility                              | ✅ all                                          | ⚠️ `react` only       | ⚠️ `react` only                                           | ⚠️ `react` only                                                              | ✅all                |
| Control of dragging item's movement<br/>(eg "rails") | ❌ (defer to web platform)                      | ✅                    | ✅                                                        | ✅                                                                           | ✅                   |
| Feature: can drag elements?                          | ✅                                              | ✅                    | ✅                                                        | ✅                                                                           | ✅                   |
| Feature: can handle file drops?                      | ✅                                              | ❌                    | ✅                                                        | ❌                                                                           | ❌                   |
| Feature: can handle url, text, image dragging?       | ✅                                              | ❌                    | ✅                                                        | ❌                                                                           | ❌                   |
| Feature: can drag across browser windows?            | ✅                                              | ❌                    | ❌                                                        | ❌                                                                           | ❌                   |
| Feature: can change DOM during a drag?               | ✅                                              | ❌                    | ?                                                         | ?                                                                            | ?                    |
| Feature: can power drawing?                          | ✅                                              | ❌                    | ?                                                         | ?                                                                            | ?                    |

</details>

## Core characteristics

🌎 Platform powered: leverages the browsers drag and drop capabilities
🪡 Incremental: you only pay for the features that they use
🎨 Headless: you get to render all elements and styles (but we do have some helper packages including `line`)
⏳ Deferred compatible: consumers can delay the loading of `@atlaskit/drag-and-drop` until they want it
🎄 Framework agnostic: works with any frontend framework
♿️ Accessible: comprehensive toolchain and patterns for creating highly accessible experiences

## A word on performance

In order to maximize **startup performance** you generally want to ship as little code as possible to clients machines.

`@atlaskit/drag-and-drop` achieves a tiny footprint by:

- leveraging the web platform to avoid re-inventing drag and drop
- being incremental: consumers only pay for the features they use
- allowed deferred loading of it's pieces - you can load in `@atlaskit/drag-and-drop` _after_ page startup if you like!

When it comes to maximizing **runtime performance** we need to do as little work on the client as possible

`@atlaskit/drag-and-drop` minimizes work on the client by:

- leveraging the browsers drag and drop capabilities as much as possible
- drag operation event throttling (we get this for free when using drag and drop on the platform)
- internal event throttling
- native rendering of drag previews is done outside of the event loop - so drag previews feel great to move around even when the browsers main thread is busy
- internally leveraging of _event delegation_ to help performance scale well

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

<details>
<summary>More granular feature set</summary>

- Supports dragging of different entity types (eg `Element`, text, images, external files etc)
- Nested `dropTargets`
- Flexible `dropTarget` sizes
- Conditional dropping
- Auto scrolling (powered by the platform)
- Can add, remove, or change `dropTargets` while dragging
- Stickiness: a `dropTarget` can maintain selection even after it is no longer being dragged over
- [`dropEffect`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect) control
- Listen to the active pointer position

(Using the `element` adapter)

- Drag handles (drag an `Element`) by a part of it
- Conditional dragging
- Nested `draggables`
- Flexible `draggable` sizes
- Can add, remove, or change `draggables` while dragging
- Supports virtual list usage
- Vertical reordering (element adapter + closest edge addon)
- Horizontal reordering (element adapter + closest edge addon)
- An `Element` can be a `dropTarget`, `draggable` or both
- An `Element` can be a `dropTarget` for different entities (eg `dropTargetForElements` and `dropTargetForFiles`)

</details>

## High level concepts

- drag adapter: teaches `@atlaskit/drag-and-drop` how to handle a particular entity (eg [elements]('./element-adapter.md'), files)
- [drop target]('./drop-target.md'): an `Element` that can be dropped on (can be nested)
- drag source: the entity that is dragging. These can be internal to a page (eg a `draggable` from the element adapter) or external (eg a file)
- [monitor]('./monitor.md): a way of listening for `@atlaskit/drag-and-drop` drag operation events anywhere
- addons: additional packages that provide additional functionality (eg the [closest edge addon]('./closest-edge-addon') allows you to know what the closest edge is of the _dropTarget_ you are dragging over)
- utils: small helpers for common tasks (eg `once` for simple memoization, `combine` to collapse cleanup functions)

A drag adapter teaches `@atlaskit/drag-and-drop` how to handle dragging a particular entity (eg elements). When you use a drag adapter you will bring in the code required for that entity and no more. For example, if you use the element adapter, your application won't include any code for handling files.

A drag adapter always provides at least two pieces:

1. A way of registering `dropTarget` (eg `dropTargetForElements`). A `dropTarget` is an `Element` that can be dropped onto
2. A way to create a `monitor` (eg `monitorForFiles`). A `monitor` can be used to listen for events anywhere in your system

A drag adapter can also provide additional pieces. For example, the element adapter provides a `draggable` which is a way of registering an `Element` as being draggable.

## Getting started

Install the adapter(s) you can to use

- [Elements]('./element-adapter.md'): `@atlaskit/drag-and-drop/adapter/element`
- Files: `@atlaskit/drag-and-drop/adapter/file` (coming soon)
- Dragging elements between documents: TODO
- Dragging text selections: TODO

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

TODO: create guide
