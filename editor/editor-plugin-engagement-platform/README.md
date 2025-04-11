# Editor Engagement Platform Plugin

This plugin allows interaction with the Atlassian Engagement Platform within the editor. It provides
functionalities to start and stop engagement messages, as well as to check the state of these
messages.

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Features

- **Start Message**: Start an engagement message with a given ID and optional variation ID.
- **Stop Message**: Stop an engagement message with a given ID.

## Installation

**Internal use only**

To install the plugin, use yarn:

```sh
yarn add @atlassian/editor-plugin-engagement-platform
```

## Usage

**Internal use only**

To use the plugin, import it and include it in your editor setup:

```typescript
import { engagementPlatformPlugin } from '@atlassian/editor-plugin-engagement-platform';

const coordinationClient = useCoordinationClient()

const { preset, editorApi } = usePreset(() => {
	return universalPreset.add([
		engagementPlatformPlugin,
		{ coordinationClient },
	]);
}, [universalPreset, coordinationClient]);
```

To get the current state of an engagement message, you can use the following code:

```typescript
function isMessageActive(messageId: string): boolean {
	const messageStates = api.engagementPlatform.sharedState.currentState()?.messageStates ?? {};
	return !!messageStates[messageId];
}
```

Detailed docs and example usage can be found [here](https://atlaskit.atlassian.com/packages/editor/editor-plugin-engagement-platform).

## API

### `api.engagementPlatform.actions.startMessage(messageId: string, variationId?: string): Promise<boolean>`

Starts an engagement message with the given ID and optional variation ID.

### `api.engagementPlatform.actions.stopMessage(messageId: string): Promise<boolean>`

Stops an engagement message with the given ID.

Please see [Atlaskit - Editor Engagement Platform Plugin](https://atlaskit.atlassian.com/packages/editor/editor-plugin-engagement-platform) for documentation and examples for this package.

## Configuration

The plugin requires a configuration object with the following structure:

```typescript
interface EngagementPlatformPluginOptions {
	coordinationClient: CoordinationClientType;
}
```

## Support

For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License

Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#Platform-License) for more licensing information.
