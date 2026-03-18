import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'MenuGroup',
		description: 'A list of options to action or navigate.',
		status: 'general-availability',
		import: {
			name: 'MenuGroup',
			package: '@atlaskit/menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for list of options to action or navigate',
			'Button items = actions (e.g. Copy); Link items = navigate (e.g. Team Spaces)',
			'Group related menu items together',
			'Use clear section titles',
		],
		contentGuidelines: [
			'Use clear, descriptive menu item labels',
			'Group related items logically',
			'Use consistent terminology',
			'Keep menu structure simple',
		],
		accessibilityGuidelines: [
			'Provide clear menu item labels',
			'Use appropriate ARIA attributes',
			'Ensure keyboard navigation with arrow keys',
			'Provide clear section titles',
		],
		examples: [
			{
				name: 'Menu',
				description: 'Menu example',
				source: path.resolve(__dirname, './examples/ai/menu.tsx'),
			},
		],
		keywords: ['menu', 'group', 'navigation', 'section', 'items'],
		categories: ['navigation'],
	},
];

export default documentation;
