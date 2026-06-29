/**
 * Structured MCP docs for `@atlaskit/analytics-listeners`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/analytics-listeners',
		packagePath,
		packageJson,
		overview:
			'Fabric analytics listeners to be used by the products. It provides a set of pre-configured listeners for various Atlassian components and services, forwarding events to the Atlassian analytics web client.',
	},
	components: [
		{
			name: 'FabricAnalyticsListeners',
			description:
				'A container component that mounts a set of pre-configured analytics listeners for common Atlassian channels (elements, editor, navigation, etc.).',
			status: 'general-availability',
			import: {
				name: 'default',
				package: '@atlaskit/analytics-listeners',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Mount this component near the root of your application to ensure all child components events are captured.',
				'Provide an `AnalyticsWebClient` instance to the `client` prop to handle the actual event transmission.',
				'Use `excludedChannels` to disable specific listeners if they are not needed or cause conflicts.',
			],
			keywords: ['analytics', 'listeners', 'fabric', 'atlassian'],
			categories: ['analytics'],
			examples: [
				{
					name: 'Fabric listener example',
					description: 'Basic usage of FabricAnalyticsListeners with a client.',
					source: path.resolve(packagePath, './examples/00-fabric-listener-example.tsx'),
				},
				{
					name: 'Excluding listeners',
					description: 'How to exclude specific channels from being listened to.',
					source: path.resolve(packagePath, './examples/01-excluding-listener.tsx'),
				},
				{
					name: 'Logging levels',
					description: 'How to configure the logging level for the listeners.',
					source: path.resolve(packagePath, './examples/02-logging-levels.tsx'),
				},
			],
		},
	],
};

export default documentation;
