import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'ProgressBar',
		description:
			'A progress bar communicates the status of a system process, showing completion percentage or indeterminate progress.',
		status: 'general-availability',
		import: {
			name: 'ProgressBar',
			package: '@atlaskit/progress-bar',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for showing progress of known duration',
			'Provide clear progress indicators',
			'Use indeterminate state for unknown duration',
			'Position progress bars prominently when active',
			'Consider providing percentage or time estimates',
		],
		contentGuidelines: [
			'Use clear, descriptive progress messages',
			'Provide meaningful context for progress',
			'Consider showing estimated time remaining',
			'Use consistent progress terminology',
		],
		accessibilityGuidelines: [
			'Provide appropriate ARIA labels for progress bars',
			'Announce progress changes to screen readers',
			'Use appropriate color contrast for visibility',
			'Provide alternative text for progress status',
		],
		examples: [
			{
				name: 'Progress Bar',
				description: 'Progress Bar example',
				source: path.resolve(__dirname, './examples/ai/progress-bar.tsx'),
			},
		],
		keywords: ['progress', 'bar', 'loading', 'status', 'completion', 'indeterminate'],
		categories: ['loading'],
	},
	{
		name: 'SuccessProgressBar',
		description: 'A progress bar variant that indicates successful completion of a process.',
		status: 'general-availability',
		import: {
			name: 'SuccessProgressBar',
			package: '@atlaskit/progress-bar',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use to indicate successful completion',
			'Show briefly before transitioning to next state',
			'Use appropriate success styling',
			'Consider providing success message',
		],
		contentGuidelines: [
			'Use clear success messaging',
			'Indicate what was completed successfully',
			'Provide next steps if applicable',
		],
		examples: [
			{
				name: 'Success Progress Bar',
				description: 'Success Progress Bar example',
				source: path.resolve(__dirname, './examples/ai/success-progress-bar.tsx'),
			},
		],
		keywords: ['progress', 'bar', 'success', 'complete', 'finished'],
		categories: ['loading'],
	},
	{
		name: 'TransparentProgressBar',
		description: 'A progress bar variant with transparent background for overlay contexts.',
		status: 'general-availability',
		import: {
			name: 'TransparentProgressBar',
			package: '@atlaskit/progress-bar',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use in overlay or modal contexts',
			'Ensure sufficient contrast with background',
			'Use for subtle progress indication',
			'Consider backdrop visibility',
		],
		contentGuidelines: [
			'Ensure progress is visible against background',
			'Use appropriate contrast for readability',
			'Keep progress indication clear',
		],
		examples: [
			{
				name: 'Transparent Progress Bar',
				description: 'Transparent Progress Bar example',
				source: path.resolve(__dirname, './examples/ai/transparent-progress-bar.tsx'),
			},
		],
		keywords: ['progress', 'bar', 'transparent', 'overlay', 'subtle'],
		categories: ['loading'],
	},
];

export default documentation;
