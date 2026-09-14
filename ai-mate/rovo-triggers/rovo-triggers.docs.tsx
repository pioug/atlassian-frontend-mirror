import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);
const packageName = '@atlaskit/rovo-triggers';

// TODO: Add a vetted public-entrypoint example when one is available.
const documentation: StructuredContentSource = {
	package: {
		package: packageName,
		packagePath,
		packageJson,
		overview:
			'Cross-product Rovo pub/sub, chat parameters, postMessage, and extension-context bridge APIs.',
	},
	components: [
		{
			name: 'Subscriber',
			description: 'Subscribes a renderless React component to one Rovo trigger topic.',
			status: 'general-availability',
			import: { name: 'Subscriber', package: packageName, type: 'named', packagePath, packageJson },
			usageGuidelines: [
				'Render when a component-style subscription is preferable to calling useSubscribe directly.',
			],
			examples: [
				{
					name: 'Subscribe a chat host to Rovo events',
					description:
						'Mounts a renderless subscription at the product boundary that owns event handling.',
					source: path.resolve(packagePath, './examples/ai/subscriber.tsx'),
				},
			],
			keywords: ['rovo', 'trigger', 'subscriber', 'pubsub'],
			categories: ['rovo', 'events'],
		},
		{
			name: 'RovoPostMessagePubsubListener',
			description: 'Relays allowed Rovo postMessage payloads into the package pub/sub channel.',
			status: 'general-availability',
			import: {
				name: 'RovoPostMessagePubsubListener',
				package: packageName,
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Mount once at the host boundary that receives cross-window Rovo trigger messages.',
			],
			examples: [
				{
					name: 'Listen for cross-window Rovo events',
					description: 'Mounts the allowlisted postMessage listener once at a chat host boundary.',
					source: path.resolve(packagePath, './examples/ai/post-message-listener.tsx'),
				},
			],
			keywords: ['rovo', 'postmessage', 'listener', 'pubsub'],
			categories: ['rovo', 'events'],
		},
		{
			name: 'ExtensionContextBridgeClient',
			description:
				'Relays allowed extension context envelopes into Rovo triggers from an extension client.',
			status: 'general-availability',
			import: {
				name: 'ExtensionContextBridgeClient',
				package: `${packageName}/extension-context-bridge/client`,
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Mount at the extension boundary with a trusted transport and allowed origins.',
			],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'extension', 'context', 'bridge'],
			categories: ['rovo', 'events'],
		},
		{
			name: 'ExtensionContextBridgeHost',
			description:
				'Relays eligible product context events from Rovo triggers to an extension transport.',
			status: 'general-availability',
			import: {
				name: 'ExtensionContextBridgeHost',
				package: `${packageName}/extension-context-bridge/host`,
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Mount once at a product root that exposes context to the Rovo extension bridge.',
			],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'extension', 'context', 'host'],
			categories: ['rovo', 'events'],
		},
	],
	hooks: [
		{
			name: 'usePublish',
			description: 'Returns a stable publisher for one Rovo trigger topic.',
			status: 'general-availability',
			import: { name: 'usePublish', package: packageName, type: 'named', packagePath, packageJson },
			usageGuidelines: [
				'Use when a React component publishes multiple payloads to the same topic.',
			],
			returns: { type: '(payload: Payload) => void' },
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'trigger', 'publish', 'hook'],
			categories: ['rovo', 'events'],
		},
		{
			name: 'useSubscribe',
			description: 'Subscribes a React component to one Rovo trigger topic.',
			status: 'general-availability',
			import: {
				name: 'useSubscribe',
				package: packageName,
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use for topic-specific Rovo event handling with optional latest-event behavior.',
			],
			returns: { type: 'void' },
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'trigger', 'subscribe', 'hook'],
			categories: ['rovo', 'events'],
		},
		{
			name: 'useSubscribeAll',
			description: 'Subscribes a React component to every Rovo trigger payload.',
			status: 'general-availability',
			import: {
				name: 'useSubscribeAll',
				package: packageName,
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use only at bridge or instrumentation boundaries that intentionally observe all topics.',
			],
			returns: { type: 'void' },
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'trigger', 'subscribe all', 'hook'],
			categories: ['rovo', 'events'],
		},
		{
			name: 'useRovoPostMessageToPubsub',
			description: 'Returns acknowledged cross-window publishing state for Rovo trigger payloads.',
			status: 'general-availability',
			import: {
				name: 'useRovoPostMessageToPubsub',
				package: packageName,
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when a Rovo payload must cross a window boundary and report acknowledgement timeout.',
			],
			returns: { type: 'ReturnType<typeof useRovoPostMessageToPubsub>' },
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'postmessage', 'pubsub', 'hook'],
			categories: ['rovo', 'events'],
		},
	],
	utilities: [
		{
			name: 'getRovoParams',
			description: 'Parses supported Rovo Chat parameters from a URL or the current page.',
			status: 'general-availability',
			import: {
				name: 'getRovoParams',
				package: packageName,
				type: 'named',
				packagePath,
				packageJson,
			},
			kind: 'function',
			usageGuidelines: ['Use to read canonical Rovo Chat launch and pathway parameters.'],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'chat', 'url', 'params'],
			categories: ['rovo', 'utilities'],
		},
		{
			name: 'updatePageRovoParams',
			description:
				'Updates the current page URL with canonical Rovo Chat parameters without reloading.',
			status: 'general-availability',
			import: {
				name: 'updatePageRovoParams',
				package: packageName,
				type: 'named',
				packagePath,
				packageJson,
			},
			kind: 'function',
			usageGuidelines: ['Use when a host needs to persist Rovo Chat state in the address bar.'],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'chat', 'url', 'history'],
			categories: ['rovo', 'utilities'],
		},
		{
			name: 'addRovoParamsToUrl',
			description: 'Adds or updates supported Rovo Chat parameters in a URL string.',
			status: 'general-availability',
			import: {
				name: 'addRovoParamsToUrl',
				package: packageName,
				type: 'named',
				packagePath,
				packageJson,
			},
			kind: 'function',
			usageGuidelines: ['Use when constructing links that launch Rovo Chat with predefined state.'],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'chat', 'url', 'launch'],
			categories: ['rovo', 'utilities'],
		},
		{
			name: 'assertOnlySpecificFieldsDefined',
			description: 'Checks that only a selected set of Rovo Chat parameter fields are defined.',
			status: 'general-availability',
			import: {
				name: 'assertOnlySpecificFieldsDefined',
				package: packageName,
				type: 'named',
				packagePath,
				packageJson,
			},
			kind: 'function',
			usageGuidelines: ['Use to validate pathway-specific combinations of Rovo Chat parameters.'],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'chat', 'params', 'validation'],
			categories: ['rovo', 'utilities'],
		},
		{
			name: 'encodeRovoParams',
			description: 'Encodes Rovo Chat parameters as a query string or prefixed parameter object.',
			status: 'general-availability',
			import: {
				name: 'encodeRovoParams',
				package: packageName,
				type: 'named',
				packagePath,
				packageJson,
			},
			kind: 'function',
			usageGuidelines: [
				'Use when serializing canonical parameters for URLs or router query objects.',
			],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'chat', 'params', 'encode'],
			categories: ['rovo', 'utilities'],
		},
		{
			name: 'getListOfRovoParams',
			description: 'Returns the supported prefixed Rovo Chat parameter names.',
			status: 'general-availability',
			import: {
				name: 'getListOfRovoParams',
				package: packageName,
				type: 'named',
				packagePath,
				packageJson,
			},
			kind: 'function',
			usageGuidelines: [
				'Use when configuring routers to preserve supported Rovo Chat query parameters.',
			],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'chat', 'params', 'router'],
			categories: ['rovo', 'utilities'],
		},
		{
			name: 'ChatEntryPoint',
			description: 'Canonical entry-point values for launching Rovo Chat.',
			status: 'general-availability',
			import: {
				name: 'ChatEntryPoint',
				package: `${packageName}/chat-entry-point`,
				type: 'named',
				packagePath,
				packageJson,
			},
			kind: 'constant',
			usageGuidelines: [
				'Use instead of ad hoc strings when identifying a Rovo Chat launch entry point.',
			],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'chat', 'entry point', 'launch'],
			categories: ['rovo', 'utilities'],
		},
		{
			name: 'isBridgeMessage',
			description:
				'Checks whether an unknown value is a valid Rovo extension-context bridge envelope.',
			status: 'general-availability',
			import: {
				name: 'isBridgeMessage',
				package: `${packageName}/extension-context-bridge/transport`,
				type: 'named',
				packagePath,
				packageJson,
			},
			kind: 'function',
			usageGuidelines: ['Use before accepting a message from a bridge transport.'],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'extension', 'bridge', 'type guard'],
			categories: ['rovo', 'utilities'],
		},
		{
			name: 'createWindowTransport',
			description:
				'Creates an origin-restricted postMessage transport for the Rovo extension-context bridge.',
			status: 'general-availability',
			import: {
				name: 'createWindowTransport',
				package: `${packageName}/extension-context-bridge/transport`,
				type: 'named',
				packagePath,
				packageJson,
			},
			kind: 'function',
			usageGuidelines: ['Use to connect one trusted product or extension window to its peer.'],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'extension', 'bridge', 'transport'],
			categories: ['rovo', 'utilities'],
		},
		{
			name: 'publish',
			description: 'Publishes a Rovo trigger payload outside React.',
			status: 'general-availability',
			import: {
				name: 'publish',
				package: `${packageName}/main`,
				type: 'named',
				packagePath,
				packageJson,
			},
			kind: 'function',
			usageGuidelines: [
				'Use for non-React integrations; prefer usePublish inside React components.',
			],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'trigger', 'publish', 'pubsub'],
			categories: ['rovo', 'events'],
		},
		{
			name: 'Topics',
			description: 'Canonical topic names supported by Rovo Triggers.',
			status: 'general-availability',
			import: {
				name: 'Topics',
				package: `${packageName}/types`,
				type: 'named',
				packagePath,
				packageJson,
			},
			kind: 'constant',
			usageGuidelines: [
				'Use a canonical topic value when publishing or subscribing to Rovo events.',
			],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'trigger', 'topics', 'events'],
			categories: ['rovo', 'events'],
		},
		{
			name: 'ROVO_POST_MESSAGE_EVENT_TYPE',
			description: 'The canonical browser event type for Rovo postMessage trigger envelopes.',
			status: 'general-availability',
			import: {
				name: 'ROVO_POST_MESSAGE_EVENT_TYPE',
				package: `${packageName}/post-message-to-pubsub`,
				type: 'named',
				packagePath,
				packageJson,
			},
			kind: 'constant',
			usageGuidelines: ['Use when constructing or identifying Rovo postMessage events.'],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'postmessage', 'event type', 'pubsub'],
			categories: ['rovo', 'events'],
		},
	],
};

export default documentation;
