# Editor Plugin Engagement Platform

Engagement platform plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Engagement Platform plugin provides integration with the Atlassian Engagement Platform within the editor. It enables control of external messages by allowing you to start and stop engagement messages, as well as check the state of these messages. The plugin requires a coordination client to manage message lifecycle and state.

## Key features

- **Start message** - Start an engagement message with a given ID and optional variation ID
- **Stop message** - Stop an engagement message with a given ID
- **Message state tracking** - Check the active state of engagement messages
- **Promise-based API** - Prevent duplicate requests with integrated promise management
- **Coordination client integration** - Works with the Engagement Platform coordination client

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-engagement-platform*
- **npm** - [@atlaskit/editor-plugin-engagement-platform](https://www.npmjs.com/package/@atlaskit/editor-plugin-engagement-platform)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-engagement-platform)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-engagement-platform/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-engagement-platform is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

### Basic setup

To use the plugin, import it and include it in your editor setup:

```typescript
import { engagementPlatformPlugin } from '@atlaskit/editor-plugin-engagement-platform';

const coordinationClient = useCoordinationClient()

const { preset, editorApi } = usePreset(() => {
	return universalPreset.add([
		engagementPlatformPlugin,
		{ coordinationClient },
	]);
}, [universalPreset, coordinationClient]);
```

### Checking message state

To get the current state of an engagement message, you can use the following code:

```typescript
function isMessageActive(messageId: string): boolean {
	const messageStates = api.engagementPlatform.sharedState.currentState()?.messageStates ?? {};
	return !!messageStates[messageId];
}
```

### Plugin configuration

The plugin requires a configuration object with the following structure:

```typescript
interface EngagementPlatformPluginOptions {
	coordinationClient: CoordinationClientType;
}
```

### API

#### `api.engagementPlatform.actions.startMessage(messageId: string, variationId?: string): Promise<boolean>`

Starts an engagement message with the given ID and optional variation ID.

**Warning:** You must call `stopMessage` when your message has finished being displayed to a user. If you do not call `stopMessage`, your message will prevent the user from seeing any other messages until the Expiry time for the message is reached.

#### `api.engagementPlatform.actions.stopMessage(messageId: string): Promise<boolean>`

Stops an engagement message with the given ID.

Please see [Atlaskit - Editor Engagement Platform Plugin](https://atlaskit.atlassian.com/packages/editor/editor-plugin-engagement-platform) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
