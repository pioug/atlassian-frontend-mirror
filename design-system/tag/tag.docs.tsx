import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Tag',
		description: 'A tag is a compact label used to classify, organize, and categorize information.',
		status: 'general-availability', // beta tag is feature-flagged
		import: {
			name: 'Tag',
			package: '@atlaskit/tag',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for object-related content; for people, teams, projects, spaces use AvatarTag',
			"Don't use for status or state—use lozenge instead",
			'Use TagGroup to control layout of multiple tags',
			"Don't use tags within user-generated text (e.g. editor)",
			'Tags can be non-interactive, links, or removable (isRemovable)',
		],
		contentGuidelines: [
			'Use clear, descriptive tag labels',
			'Keep tag text concise; max 200px causes truncation',
			'Use color intentionally to organize related content',
			'For people, teams, spaces, or projects use avatar tag',
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
	{
		name: 'RemovableTag',
		description: 'A tag labels UI objects for quick recognition and navigation.',
		status: 'open-beta',
		import: {
			name: 'RemovableTag',
			package: '@atlaskit/tag',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use to categorize or label content with removal capability',
			'Use for object-related content; for people/teams/projects use AvatarTag',
			"Don't use for status—use lozenge instead",
			'Use TagGroup to control layout of multiple tags',
			"Don't use tags within user-generated text",
		],
		contentGuidelines: [
			'Use clear, descriptive tag labels',
			'Keep tag text concise; max 200px causes truncation',
			'Use color intentionally to organize related content',
			'For people, teams, spaces, or projects use avatar tag',
		],
		examples: [
			{
				name: 'Removable Tag',
				description: 'RemovableTag example',
				source: path.resolve(__dirname, './examples/constellation/tag-new-removable.tsx'),
			},
		],
		keywords: ['tag', 'removable', 'label', 'category', 'close'],
		categories: ['data-display'],
	},
	{
		name: 'SimpleTag',
		description: 'A tag is a compact label used to classify, organize, and categorize information.',
		status: 'open-beta',
		import: {
			name: 'SimpleTag',
			package: '@atlaskit/tag',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for non-interactive categorization and labelling',
			'Use for object-related content; for people/teams use AvatarTag',
			"Don't use for status—use lozenge instead",
			'Use TagGroup to control layout of multiple tags',
		],
		contentGuidelines: [
			'Use clear, descriptive tag labels',
			'Keep tag text concise',
			'Use color intentionally',
		],
		examples: [
			{
				name: 'Simple Tag',
				description: 'SimpleTag example',
				source: path.resolve(__dirname, './examples/9-simple-tag.tsx'),
			},
		],
		keywords: ['tag', 'simple', 'label', 'category', 'non-interactive'],
		categories: ['data-display'],
	},
	{
		name: 'AvatarTag',
		description:
			'An avatar tag represents individuals, agents, teams, projects or spaces for tagging, quick recognition and navigation.',
		status: 'open-beta',
		import: {
			name: 'AvatarTag',
			package: '@atlaskit/tag',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for people (user), agents (agent), or teams/projects/spaces (other)',
			'Use isVerified for verified teams only',
			'Use in moderation—avatar tags add cognitive noise',
			"Don't use for general object categories—use Tag instead",
			"Don't use within user-generated text (e.g. editor)",
			'Use TagGroup to control layout',
		],
		contentGuidelines: [
			'Truncate names with ellipsis if they exceed max width',
			'Provide tooltip on hover for truncated text',
			'Use clear, descriptive names',
		],
		accessibilityGuidelines: [
			'Provide meaningful names for avatar representation',
			'Ensure avatar shapes communicate type (round=user, hexagon=agent, square=other)',
		],
		examples: [
			{
				name: 'Avatar Tag',
				description: 'AvatarTag example',
				source: path.resolve(__dirname, './examples/constellation/avatar-tag-default.tsx'),
			},
		],
		keywords: ['tag', 'avatar', 'user', 'agent', 'team', 'project', 'space'],
		categories: ['data-display'],
	},
];

export default documentation;
