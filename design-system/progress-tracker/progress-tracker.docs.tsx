import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'ProgressTracker',
		description: 'A component for tracking progress through multi-step processes.',
		status: 'general-availability',
		import: {
			name: 'ProgressTracker',
			package: '@atlaskit/progress-tracker',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for multi-step workflows',
			'Provide clear progress tracking',
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
				name: 'Progress Tracker',
				description: 'Progress Tracker example',
				source: path.resolve(__dirname, './examples/ai/progress-tracker.tsx'),
			},
		],
		keywords: ['progress', 'tracker', 'steps', 'completion', 'workflow'],
		categories: ['feedback'],
	},
];

export default documentation;
