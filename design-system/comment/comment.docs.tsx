import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Comment',
		description: 'A component for displaying comments and discussions.',
		status: 'general-availability',
		import: {
			name: 'Comment',
			package: '@atlaskit/comment',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for comment threads and discussions',
			'Provide clear comment attribution',
			'Handle comment nesting appropriately',
			'Consider comment moderation features',
		],
		contentGuidelines: [
			'Use clear, constructive comment content',
			'Provide meaningful comment attribution',
			'Use appropriate comment formatting',
			'Consider comment context and purpose',
		],
		accessibilityGuidelines: [
			'Ensure proper comment structure',
			'Provide clear comment attribution',
			'Use appropriate heading hierarchy',
			'Consider screen reader navigation',
		],
		examples: [
			{
				name: 'Comment',
				description: 'Comment example',
				source: path.resolve(__dirname, './examples/ai/comment.tsx'),
			},
		],
		keywords: ['comment', 'discussion', 'thread', 'conversation', 'chat'],
		categories: ['data-display'],
	},
];

export default documentation;
