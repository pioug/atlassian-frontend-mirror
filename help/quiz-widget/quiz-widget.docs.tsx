import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'QuizWidget',
			description:
				'A component that allows users to take quizzes or surveys within a help context.',
			status: 'general-availability',
			import: {
				name: 'QuizWidget',
				package: '@atlaskit/quiz-widget',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use QuizWidget to present interactive quizzes or feedback forms to users.',
				'Supports multiple choice questions and submission handling.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard quiz widget example.',
					source: path.resolve(packagePath, './examples/0-Quiz-Widget.tsx'),
				},
			],
			keywords: ['quiz', 'widget', 'survey', 'feedback', 'interactive'],
			categories: ['interaction'],
		},
	],
};

export default documentation;
