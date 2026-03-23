import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Badge',
		description:
			'A badge is a visual indicator for numeric values such as tallies and scores, providing quick visual feedback.',
		status: 'general-availability', // beta badge is feature-flagged
		import: {
			name: 'Badge',
			package: '@atlaskit/badge',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for displaying counts, scores, or status indicators for a single item or label',
			'Use with one item/label only to avoid ambiguity',
			'Keep badge content concise and meaningful',
			'Use appropriate appearance variants for different contexts',
			'Position badges near relevant content',
			'Consider maximum value display limits',
			'Add a tooltip when the badge has an icon or needs extra context.',
			'Use Lozenge for non-numeric status; use Tag for labels',
		],
		contentGuidelines: [
			'Use clear, concise numeric or text values',
			'Ensure values are meaningful to users',
			'Use consistent formatting across similar badges',
			'Consider localization for number formatting (locale-aware numbers)',
		],
		accessibilityGuidelines: [
			'Ensure badge content is announced by screen readers',
			'Do not rely on color alone for positive/negative meaning',
			'Use appropriate color contrast for text readability',
			'Provide meaningful context for numeric values',
			'Consider alternative text for non-numeric badges',
		],
		examples: [
			{
				name: 'Badge',
				description: 'Badge example',
				source: path.resolve(__dirname, './examples/ai/badge.tsx'),
			},
		],
		keywords: ['badge', 'indicator', 'numeric', 'tally', 'score', 'count', 'status'],
		categories: ['status-indicators'],
	},
];

export default documentation;
