import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'TagGroup',
		description: 'A component for managing multiple tags.',
		status: 'general-availability',
		import: {
			name: 'TagGroup',
			package: '@atlaskit/tag-group',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for grouping related tags',
			'Consider tag alignment and spacing',
			'Use for categorizing content',
			'Provide clear tag relationships',
		],
		contentGuidelines: [
			'Use consistent tag naming',
			'Keep tag text concise',
			'Use meaningful tag categories',
			'Consider tag hierarchy',
		],
		accessibilityGuidelines: [
			'Provide clear tag labels',
			'Ensure proper keyboard navigation',
			'Use appropriate grouping semantics',
			'Consider screen reader announcements',
		],
		examples: [
			{
				name: 'Tag Group',
				description: 'Tag Group example',
				source: path.resolve(__dirname, './examples/ai/tag-group.tsx'),
			},
		],
		keywords: ['tag', 'group', 'multiple', 'labels', 'chips'],
		categories: ['data-display'],
	},
];

export default documentation;
