## Introduction

This package allows rapid migration from `react-beautiful-dnd` to Pragmatic drag and drop (`@atlaskit/pragmatic-drag-and-drop`).

This package exposes the same exports and types of `react-beautiful-dnd@13` and uses `@atlaskit/pragmatic-drag-and-drop` to power those exports.

At a high level, all you need to do is swap your imports of `react-beautiful-dnd` in your code to `@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration` and your drag and drop experience(s) will now be powered by Pragmatic drag and drop.

This package also includes a codemod to help automatically shift over `react-beautiful-dnd@12` and `react-beautiful-dnd@13` to `@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration`.

## Prerequisites

- You are already using `react-beautiful-dnd`. If this is a new feature, adopt `@atlaskit/pragmatic-drag-and-drop` directly.
- You are using major version 12 or 13 of `react-beautiful-dnd`.

## Migration steps

1. Install `@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration`

2. Run the codemod client with the command `npx @atlaskit/codemod-cli --parser {tsx|babylon} --extensions ts,tsx,js [relativePath]`.

    Select the codemod based on which version of `react-beautiful-dnd` you are using:

    1. For major version 12, select `adoption-from-rbd-12`

    2. For major version 13, select `adoption-from-rbd-13`

3. Acknowledge and remove the comments left by the codemod.

## Limitations

There are some known limitations in the migration layer.

### UX differences

The user experience (UX) provided by this migration layer differs slightly to that of `react-beautiful-dnd`.

### Sensors

- Custom sensors are no longer supported.
    - The migration layer supports pointer and keyboard dragging.
- Default sensors cannot be disabled.

If either of these changes is a blocker for you, please reach out to discuss options.


### Combining

Combining items is not supported by this migration layer. The main use case is for trees, which other packages are better suited for.

If you are looking for a tree package, please reach out to us and we can help you with next steps.

### `disableInteractiveElementBlocking`

This prop now only affects when keyboard drags can occur.

The browser determines when pointer drags can occur.

### Unsupported props

A number of props are no longer supported. They will be accepted but won't have any effect.

#### `<DragDropContext>`

```diff
# A nonce is no longer needed.
# All styles are now controlled by React.
- nonce?: string;

# Custom sensors are not supported.
# The migration layer supports pointer and keyboard dragging.
- sensors?: Sensors[];

# Disabling default sensors is not supported.
- enableDefaultSensors?: boolean;
```

#### `<Droppable>`

```diff
# Combining items is not supported.
- isCombineEnabled?: boolean;

# The browser now determines all hit targets.
- ignoreContainerClipping?: boolean;
```

#### `<Draggable>`

```diff
# The browser now determines when drags should occur.
- shouldRespectForcePress?: boolean;
```


## Troubleshooting

If you run into any issues while migrating, please reach out to us for assistance.