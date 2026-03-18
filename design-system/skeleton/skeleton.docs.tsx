import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Skeleton',
		description: 'A skeleton acts as a placeholder for content, usually while the content loads.',
		status: 'early-access',
		import: {
			name: 'Skeleton',
			package: '@atlaskit/skeleton',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use to indicate content is loading',
			'Match skeleton structure to actual content layout',
			'Use appropriate animation and timing',
			'Replace with actual content when ready',
			'Consider different skeleton patterns for different content types',
		],
		contentGuidelines: [
			'Use skeleton patterns that represent actual content structure',
			'Maintain consistent skeleton styling',
			'Consider content hierarchy in skeleton design',
			'Use appropriate animation timing',
		],
		accessibilityGuidelines: [
			'Provide appropriate loading announcements',
			'Use skeleton patterns that match actual content structure',
			'Ensure skeleton content is not announced as actual content',
			'Consider screen reader experience during loading states',
		],
		examples: [
			{
				name: 'Skeleton',
				description: 'Skeleton example',
				source: path.resolve(__dirname, './examples/ai/skeleton.tsx'),
			},
		],
		keywords: ['skeleton', 'placeholder', 'loading', 'content', 'shimmer', 'animation'],
		categories: ['loading'],
	},
];

export default documentation;
