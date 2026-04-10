# Editor Plugin Content Format

ContentFormat plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Content Format plugin provides centralized state management for tracking the editor's content mode/format. It enables plugins and products to monitor and update the current editor content format state.

## Key features

- **Content mode tracking** - Maintains the current content mode of the editor (e.g., `standard`, `compact`, etc.)
- **Shared state management** - Provides a centralized state accessible to all dependent plugins
- **Command API** - Simple command interface for updating content mode
- **Optimized updates** - Prevents unnecessary state updates when mode hasn't changed

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-content-format*
- **npm** - [@atlaskit/editor-plugin-content-format](https://www.npmjs.com/package/@atlaskit/editor-plugin-content-format)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-content-format)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-content-format/dist/)

## Usage
---
**Internal use only**


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
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
