import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'FocusedTaskCloseAccount',
			description:
				'UI components for deactivating and deleting user accounts in accordance with GDPR "Right to be forgotten".',
			status: 'deprecated',
			import: {
				name: 'FocusedTaskCloseAccount',
				package: '@atlaskit/focused-task-close-account',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use this component to provide a focused interface for account closure tasks.',
				'Handles the multi-step process of deactivation or deletion.',
				'Note: This package is deprecated and marked for removal. Avoid new usage.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Basic drawer assembly for account closure.',
					source: path.resolve(packagePath, './examples/00-BasicDrawerAssembly.tsx'),
				},
			],
			keywords: ['gdpr', 'account', 'close', 'delete', 'deactivate', 'focused-task'],
			categories: ['interaction', 'layout'],
		},
	],
};

export default documentation;
