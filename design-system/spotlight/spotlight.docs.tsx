import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Spotlight',
		description: 'A component for quick search and command execution.',
		status: 'general-availability',
		import: {
			name: 'Spotlight',
			package: '@atlaskit/spotlight',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for quick search and commands',
			'Provide clear search functionality',
			'Consider keyboard shortcuts',
			'Handle search results appropriately',
		],
		contentGuidelines: [
			'Use clear, descriptive search labels',
			'Provide helpful search suggestions',
			'Use consistent command naming',
			'Keep search results relevant',
		],
		accessibilityGuidelines: [
			'Ensure proper keyboard navigation',
			'Provide clear search functionality',
			'Use appropriate ARIA attributes',
			'Consider screen reader announcements',
		],
		examples: [],
		keywords: ['spotlight', 'search', 'command', 'palette', 'quick'],
		categories: ['navigation'],
	},
];

export default documentation;
