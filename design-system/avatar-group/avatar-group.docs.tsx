import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'AvatarGroup',
		description:
			'A component for displaying multiple avatars in a group with overlap and overflow handling.',
		status: 'general-availability',
		import: {
			name: 'AvatarGroup',
			package: '@atlaskit/avatar-group',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for displaying multiple users or team members',
			'Consider overflow behavior for large groups',
			'Use appropriate sizing for context',
			'Provide clear user identification',
		],
		contentGuidelines: [
			'Use meaningful names for users',
			'Consider group context and purpose',
			'Provide clear overflow indicators',
			'Use consistent naming patterns',
		],
		accessibilityGuidelines: [
			'Provide clear labels for avatar groups',
			'Use appropriate overflow handling',
			'Ensure keyboard navigation support',
			'Provide clear user identification',
		],
		examples: [
			{
				name: 'Avatar Group',
				description: 'Avatar Group example',
				source: path.resolve(__dirname, './examples/ai/avatar-group.tsx'),
			},
		],
		keywords: ['avatar', 'group', 'multiple', 'users', 'team', 'overlap'],
		categories: ['data-display'],
	},
];

export default documentation;
