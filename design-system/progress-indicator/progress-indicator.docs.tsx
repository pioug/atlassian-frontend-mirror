import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'ProgressIndicator',
			description: 'A component for displaying progress through steps or completion status.',
			status: 'general-availability',
			designSource: {
				figmaUrl: 'https://go.atlassian.com/figma-library-ads-13186-35931',
			},
			import: {
				name: 'ProgressIndicator',
				package: '@atlaskit/progress-indicator',
				type: 'named',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use for step-by-step processes',
				'Provide clear progress indicators',
				'Handle progress updates appropriately',
				'Consider progress completion states',
			],
			contentGuidelines: [
				'Use clear, descriptive step labels',
				'Provide meaningful progress descriptions',
				'Use appropriate progress terminology',
				'Keep progress information concise',
			],
			accessibilityGuidelines: [
				'Ensure progress is announced by screen readers',
				'Use appropriate progress indicators',
				'Provide clear progress context',
				'Consider progress timing and updates',
			],
			examples: [
				{
					name: 'Progress Indicator',
					description: 'Progress Indicator example',
					source: path.resolve(__dirname, './examples/ai/progress-indicator.tsx'),
				},
			],
			keywords: ['progress', 'indicator', 'steps', 'completion', 'status'],
			categories: ['feedback'],
		},
	],
};

export default documentation;
