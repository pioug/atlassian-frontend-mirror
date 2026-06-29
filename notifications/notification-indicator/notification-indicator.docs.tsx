import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'NotificationIndicator',
			description:
				'A component that displays a badge indicating the number of unread notifications.',
			status: 'general-availability',
			import: {
				name: 'NotificationIndicator',
				package: '@atlaskit/notification-indicator',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use NotificationIndicator to alert users to new or unread notifications.',
				'Typically placed within a navigation bar or header.',
				'Automatically fetches and updates the notification count using a provided provider.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard notification indicator display.',
					source: path.resolve(packagePath, './examples/00-basic.tsx'),
				},
			],
			keywords: ['notification', 'indicator', 'badge', 'unread', 'alerts'],
			categories: ['interaction', 'data-display'],
		},
	],
};

export default documentation;
