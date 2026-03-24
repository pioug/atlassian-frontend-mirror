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
	{
		name: 'ButtonItem',
		description:
			'A menu item that triggers an action when clicked. Use for actions like Copy, Delete, or Create.',
		status: 'general-availability',
		import: {
			name: 'ButtonItem',
			package: '@atlaskit/menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for actions that do not navigate (e.g. Copy, Create article)',
			'Combine with icons for clarity when they add meaning',
			'Use secondary text for context when helpful (e.g. project type)',
		],
		contentGuidelines: [
			'Use clear, action-oriented labels',
			'Use consistent terminology across menus',
		],
		examples: [
			{
				name: 'Button Item',
				description: 'ButtonItem example',
				source: path.resolve(__dirname, './examples/constellation/button-item.tsx'),
			},
		],
		keywords: ['menu', 'button', 'item', 'action'],
		categories: ['navigation', 'interaction'],
	},
	{
		name: 'LinkItem',
		description:
			'A menu item that navigates to a URL when clicked. Use for navigation links like Dashboard or Settings.',
		status: 'general-availability',
		import: {
			name: 'LinkItem',
			package: '@atlaskit/menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for navigation (e.g. Team Spaces, Settings)',
			'Indicate the current page when relevant',
			'Combine with icons for context when they add meaning',
		],
		contentGuidelines: ['Use clear, descriptive labels for destinations', 'Keep labels concise'],
		examples: [
			{
				name: 'Link Item',
				description: 'LinkItem example',
				source: path.resolve(__dirname, './examples/constellation/link-item.tsx'),
			},
		],
		keywords: ['menu', 'link', 'item', 'navigation'],
		categories: ['navigation'],
	},
	{
		name: 'CustomItem',
		description:
			'A menu item that accepts a custom component for advanced use cases when ButtonItem or LinkItem do not meet your needs.',
		status: 'general-availability',
		import: {
			name: 'CustomItem',
			package: '@atlaskit/menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use when ButtonItem or LinkItem cannot fulfill your requirements',
			'Preserve menu item styling and behavior in custom implementations',
		],
		contentGuidelines: [
			'Ensure custom components maintain accessibility',
			'Keep custom implementations minimal',
		],
		examples: [
			{
				name: 'Custom Item',
				description: 'CustomItem example',
				source: path.resolve(__dirname, './examples/constellation/custom-item.tsx'),
			},
		],
		keywords: ['menu', 'custom', 'item', 'component'],
		categories: ['navigation'],
	},
	{
		name: 'Section',
		description: 'Groups related menu items together with an optional title or heading.',
		status: 'general-availability',
		import: {
			name: 'Section',
			package: '@atlaskit/menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use to group related menu items (e.g. Actions, Settings)',
			'Use clear section titles when grouping',
			'Use visual separators between sections when helpful',
		],
		contentGuidelines: ['Use clear section titles', 'Group items logically'],
		examples: [
			{
				name: 'Section',
				description: 'Section example',
				source: path.resolve(__dirname, './examples/constellation/section-default.tsx'),
			},
		],
		keywords: ['menu', 'section', 'group', 'items'],
		categories: ['navigation'],
	},
	{
		name: 'PopupMenuGroup',
		description:
			'A variant of MenuGroup with sensible default max/min width for popup menus. Deprecated—use MenuGroup instead.',
		status: 'deprecated',
		import: {
			name: 'PopupMenuGroup',
			package: '@atlaskit/menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Prefer MenuGroup instead; PopupMenuGroup is deprecated',
			'Use only when migrating existing code',
		],
		keywords: ['menu', 'popup', 'group', 'deprecated'],
		categories: ['navigation'],
	},
	{
		name: 'HeadingItem',
		description:
			'A non-interactive heading within a menu section. Use to label groups of items when Section title is not used.',
		status: 'general-availability',
		import: {
			name: 'HeadingItem',
			package: '@atlaskit/menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use to label section groups when a section title is not sufficient',
			'Do not use for interactive content—headings are display-only',
		],
		contentGuidelines: ['Use clear, descriptive headings', 'Keep headings concise'],
		examples: [
			{
				name: 'Heading Item',
				description: 'HeadingItem example',
				source: path.resolve(__dirname, './examples/constellation/heading-item.tsx'),
			},
		],
		keywords: ['menu', 'heading', 'item', 'label'],
		categories: ['navigation'],
	},
	{
		name: 'SkeletonItem',
		description: 'A skeleton placeholder for a menu item during loading states.',
		status: 'general-availability',
		import: {
			name: 'SkeletonItem',
			package: '@atlaskit/menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use during loading to maintain layout stability',
			'Match the shape of the loaded item (e.g. with or without icon)',
		],
		examples: [
			{
				name: 'Skeleton Item',
				description: 'SkeletonItem example',
				source: path.resolve(__dirname, './examples/constellation/menu-loading.tsx'),
			},
		],
		keywords: ['menu', 'skeleton', 'loading', 'placeholder'],
		categories: ['loading', 'navigation'],
	},
	{
		name: 'SkeletonHeadingItem',
		description: 'A skeleton placeholder for a menu heading during loading states.',
		status: 'general-availability',
		import: {
			name: 'SkeletonHeadingItem',
			package: '@atlaskit/menu',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: ['Use during loading when a section heading will appear'],
		examples: [
			{
				name: 'Skeleton Heading Item',
				description: 'SkeletonHeadingItem example',
				source: path.resolve(__dirname, './examples/constellation/menu-loading.tsx'),
			},
		],
		keywords: ['menu', 'skeleton', 'heading', 'loading'],
		categories: ['loading', 'navigation'],
	},
];

export default documentation;
