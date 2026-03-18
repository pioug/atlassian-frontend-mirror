import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'ProgressIndicator',
		description: 'A component for displaying progress through steps or completion status.',
		status: 'general-availability',
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
];

export default documentation;
