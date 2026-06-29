import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'ShareDialogContainer',
			description: 'A dialog component for sharing content with other users or groups.',
			status: 'deprecated',
			import: {
				name: 'ShareDialogContainer',
				package: '@atlaskit/share',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use ShareDialogContainer to provide a standard interface for sharing items.',
				'Supports searching for users and groups, and adding a message.',
				'Note: This package is deprecated and replaced by @atlassian/jira-share-dialog.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard share dialog example.',
					source: path.resolve(packagePath, './examples/00-integration-with-configs.tsx'),
				},
			],
			keywords: ['share', 'dialog', 'collaboration', 'users', 'groups'],
			categories: ['interaction', 'overlay'],
		},
	],
};

export default documentation;
