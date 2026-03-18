import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Lozenge',
		description:
			'A lozenge is a small visual indicator used to show status, category, or other short text labels.',
		status: 'general-availability',
		import: {
			name: 'Lozenge',
			package: '@atlaskit/lozenge',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Subtle (default): for long tables and general use',
			'Bold: use sparingly (e.g. Pipeline/Jira status)',
			'Always combine color with a concise, accurate label',
			'Use Badge for tallies/counts; use Tag for labels',
		],
		contentGuidelines: [
			'Use clear, concise text; use accurate labels (e.g. "Error", "Warning")',
			'Do not use for long text—lozenge is not focusable and truncation at ~200px is not accessible',
			'Ensure text is meaningful and descriptive',
			'Use consistent terminology across lozenges',
		],
		accessibilityGuidelines: [
			'Do not rely on color alone; always pair with an accurate text label',
			'Ensure sufficient color contrast for text readability',
			'Do not use for long text—truncation is not accessible and lozenge is not focusable',
			'Provide appropriate labels for screen readers',
			'Consider color-blind users when choosing colors',
		],
		examples: [
			{
				name: 'Lozenge',
				description: 'Lozenge example',
				source: path.resolve(__dirname, './examples/ai/lozenge.tsx'),
			},
		],
		keywords: ['lozenge', 'badge', 'label', 'status', 'indicator', 'pill'],
		categories: ['status-indicators'],
	},
];

export default documentation;
