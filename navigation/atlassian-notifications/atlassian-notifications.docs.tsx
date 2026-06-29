import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Notifications',
			description: 'A component for displaying a list of notifications for Atlassian products.',
			status: 'general-availability',
			import: {
				name: 'Notifications',
				package: '@atlaskit/atlassian-notifications',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use Notifications to display a list of user-relevant events or updates.',
				'Typically used within a notification drawer or popover.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard notifications list display.',
					source: path.resolve(packagePath, './examples/00-basic-usage.tsx'),
				},
			],
			keywords: ['notifications', 'alerts', 'updates', 'list'],
			categories: ['interaction', 'data-display'],
		},
	],
};

export default documentation;
