import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Tag',
		description: 'A tag is a compact element used to categorize, label, or organize content.',
		status: 'general-availability',
		import: {
			name: 'Tag',
			package: '@atlaskit/tag',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use to categorize or label content',
			'Keep tag text concise and meaningful',
			'Use appropriate colors and appearances',
			'Consider tag removal functionality',
			'Group related tags logically',
		],
		contentGuidelines: [
			'Use clear, descriptive tag labels',
			'Keep tag text concise',
			'Use consistent terminology across tags',
			'Consider tag hierarchy and grouping',
		],
		accessibilityGuidelines: [
			'Provide appropriate labels for tags',
			'Ensure sufficient color contrast for text readability',
			'Use clear, descriptive tag text',
			'Consider keyboard navigation for interactive tags',
			'Provide alternative text for tag removal actions',
		],
		examples: [
			{
				name: 'Tag',
				description: 'Tag example',
				source: path.resolve(__dirname, './examples/ai/tag.tsx'),
			},
		],
		keywords: ['tag', 'label', 'category', 'filter', 'chip', 'badge'],
		categories: ['data-display'],
	},
];

export default documentation;
