import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'SmartUserPicker',
			description:
				'A user picker component that provides ranked recommendations based on the current context.',
			status: 'general-availability',
			import: {
				name: 'default',
				package: '@atlaskit/smart-user-picker',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use SmartUserPicker to allow users to select other users or teams.',
				'Provides intelligent recommendations to help users find the right person quickly.',
				'Supports searching by name, email, and other criteria.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard smart user picker display.',
					source: path.resolve(packagePath, './examples/00-smart-user-picker.tsx'),
				},
			],
			keywords: ['user', 'picker', 'recommendations', 'search', 'teams'],
			categories: ['interaction'],
		},
	],
};

export default documentation;
