import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'ContextualSurvey',
			description:
				'A component used to gather feedback from users in a specific context within the product.',
			status: 'general-availability',
			import: {
				name: 'ContextualSurvey',
				package: '@atlaskit/contextual-survey/ContextualSurvey',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use ContextualSurvey to ask users for feedback about a specific feature or experience.',
				'Supports various question types and can be triggered based on user actions.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard contextual survey example.',
					source: path.resolve(packagePath, './examples/00-usage.tsx'),
				},
			],
			keywords: ['survey', 'feedback', 'engagement', 'nps', 'user-research'],
			categories: ['interaction'],
		},
	],
};

export default documentation;
