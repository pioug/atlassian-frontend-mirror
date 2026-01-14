# Editor Plugin Content Format

A shared state management plugin for the Atlassian Editor that tracks the content mode/format of the editor. This plugin enables other editor plugins and products to be aware of the current editor content format state and update it as needed.

## Overview

The Content Format plugin is a dependency plugin that provides a centralized way to:
- Track the current content mode of the editor (e.g., `standard`, `compact`, etc.)
- Share this state with dependent plugins
- Allow products and other plugins to update the content mode through a simple command API

## Usage

### Accessing Content Mode State

You will need to add the plugin as an optional dependancy wherever you are going to need to access the state:

```typescript
import type {
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
// ...
import type { ContentFormatPlugin } from '@atlaskit/editor-plugin-content-format';
// ...



export type YourPluginDependencies = [
	// ...
	OptionalPlugin<ContentFormatPlugin>,
	// ...
];
```

#### Accessing Content Mode State in your plugin

In your plugins access state like so:

```typescript
const contentMode = api?.contentFormat?.sharedState?.currentState()?.contentMode
```

#### Accessing Content Mode State in React Components

In React components that need to react to content mode changes, use the `useSharedPluginStateWithSelector` hook:

```typescript
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ContentFormatPlugin } from '@atlaskit/editor-plugin-content-format';

type Props = {
  editorApi?: PublicPluginAPI<[ContentFormatPlugin]>;
};

export const MyComponent = ({ editorApi }: Props) => {
  const { contentMode } = useSharedPluginStateWithSelector(
    editorApi,
    ['contentFormat'],
    (states) => ({
      contentMode: states.contentFormatState?.contentMode,
    })
  );

  return <div>Current mode: {contentMode}</div>;
};
```

### Updating Content Mode

Products and plugins can update the content mode using the `updateContentMode` command:

```typescript
api.contentFormat?.commands.updateContentMode('compact');
```

## Plugin API

### Configuration Options

```typescript
type ContentFormatPluginOptions = {
  initialContentMode?: EditorContentMode; // Defaults to 'standard'
};
```

### Shared State

```typescript
type ContentFormatPluginState = {
  contentMode: EditorContentMode;
};
```

### Commands

#### `updateContentMode(mode: EditorContentMode)`

Updates the current content mode. The command will:
- Return `null` if the new mode is identical to the previous mode (no-op for performance)
- Set the meta on the transaction with the new content mode
- Trigger state updates across all dependent plugins

**Parameters:**
- `mode` (EditorContentMode): The new content mode to set

**Returns:** EditorCommand (null if no change needed, or the transaction with meta)

**Example:**
```typescript
api.contentFormat?.commands.updateContentMode('dense');
```


## Support

For issues, questions, or contributions:
- **Slack**: [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E)
- **Bug Reports**: [go/editor-help](https://go/editor-help)
- **Team**: Editor: AI
