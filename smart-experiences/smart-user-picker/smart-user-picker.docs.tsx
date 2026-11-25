import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'SmartUserPicker',
			description:
				'A user picker component that provides ranked recommendations based on the current context.',
			status: 'general-availability',
			import: {
				name: 'SmartUserPicker',
				package: '@atlaskit/smart-user-picker/components',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use SmartUserPicker to allow users to select other users or teams.',
				'Provides intelligent recommendations to help users find the right person quickly.',
				'Supports searching by name, email, and other criteria.',
				'This local fixture uses package-private helpers and mocked responses; those imports are not consumer APIs.',
			],
			examples: [
				{
					name: 'Basic',
					description:
						'Interactive local development fixture with package-local endpoint and UFO mocks.',
					source: `${packagePath}/examples/00-smart-user-picker.tsx`,
				},
			],
			keywords: ['user', 'picker', 'recommendations', 'search', 'teams'],
			categories: ['interaction'],
		},
	],
};

export default documentation;
