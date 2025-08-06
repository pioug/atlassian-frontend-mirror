# Editor Toolbar Mode

This package enforces a toolbar structure by exposing a simple registry API for components, and providing a react based toolbar model used for rendering an entire toolbar.

## Usage

Register toolbar components

```ts
import { createComponentRegistry, type RegisterToolbar } from '@atlaskit/editor-toolbar-model';

const registry = createComponentRegistry()

registry.register([
    {
        type: 'toolbar'
        key: 'inline-toolbar'
    } as RegisterToolbar
])

```

Get all registered components

```ts
import { createComponentRegistry } from '@atlaskit/editor-toolbar-model';

const { components } = registry;

console.log(components)

```

Process all toolbar components

```ts
import { ToolbarModel, createComponentRegistry } from '@atlaskit/editor-toolbar-model';


return <ToolbarModel components={registry.components} item={{ type: 'toolbar', key: 'inline-toolbar' }} />

```
