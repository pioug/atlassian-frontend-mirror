import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/menu',
		packagePath: __dirname,
		packageJson: require('./package.json'),
		overview:
			'Do not use @atlaskit/menu. The package is marked intent-to-deprecate, and all of its components are deprecated. Use @atlaskit/navigation-system for side navigation, @atlaskit/dropdown-menu for contextual actions and options, or a list for other groups of links or actions.',
	},
	components: [
		{
			name: 'MenuGroup',
			description: 'A list of options to action or navigate.',
			status: 'deprecated',
			references: {
				figmaUrl: 'https://go.atlassian.com/figma-library-ads-13200-39907',
			},
			import: {
				name: 'MenuGroup',
				package: '@atlaskit/menu/menu-group',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
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
					source: `${__dirname}/examples/menu.tsx`,
				},
			],
			keywords: ['menu', 'group', 'navigation', 'section', 'items'],
			categories: ['navigation'],
		},
		{
			name: 'ButtonItem',
			description: 'A menu item that triggers an action when clicked.',
			status: 'deprecated',
			import: {
				name: 'ButtonItem',
				package: '@atlaskit/menu/button-item',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			contentGuidelines: [
				'Use clear, action-oriented labels',
				'Use consistent terminology across menus',
			],
			examples: [
				{
					name: 'Button Item',
					description: 'ButtonItem example',
					source: `${__dirname}/examples/constellation/button-item.tsx`,
				},
			],
			keywords: ['menu', 'button', 'item', 'action'],
			categories: ['navigation', 'interaction'],
		},
		{
			name: 'LinkItem',
			description: 'A menu item that navigates to a URL when clicked.',
			status: 'deprecated',
			import: {
				name: 'LinkItem',
				package: '@atlaskit/menu/link-item',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			contentGuidelines: ['Use clear, descriptive labels for destinations', 'Keep labels concise'],
			examples: [
				{
					name: 'Link Item',
					description:
						'Legacy menu example using deprecated @atlaskit/menu/types APIs. For new side navigation, use @atlaskit/navigation-system instead.',
					source: `${__dirname}/examples/constellation/link-item.tsx`,
				},
			],
			keywords: ['menu', 'link', 'item', 'navigation'],
			categories: ['navigation'],
		},
		{
			name: 'CustomItem',
			description:
				'A menu item that accepts a custom component for advanced use cases when ButtonItem or LinkItem do not meet your needs.',
			status: 'deprecated',
			import: {
				name: 'CustomItem',
				package: '@atlaskit/menu/custom-item',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			contentGuidelines: [
				'Ensure custom components maintain accessibility',
				'Keep custom implementations minimal',
			],
			examples: [
				{
					name: 'Custom Item',
					description:
						'Legacy menu example using deprecated @atlaskit/menu/types APIs. For new side navigation, use @atlaskit/navigation-system instead.',
					source: `${__dirname}/examples/constellation/custom-item.tsx`,
				},
			],
			keywords: ['menu', 'custom', 'item', 'component'],
			categories: ['navigation'],
		},
		{
			name: 'Section',
			description: 'Groups related menu items together with an optional title or heading.',
			status: 'deprecated',
			import: {
				name: 'Section',
				package: '@atlaskit/menu/section',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			contentGuidelines: ['Use clear section titles', 'Group items logically'],
			examples: [
				{
					name: 'Section',
					description: 'Section example',
					source: `${__dirname}/examples/constellation/section-default.tsx`,
				},
			],
			keywords: ['menu', 'section', 'group', 'items'],
			categories: ['navigation'],
		},
		{
			name: 'PopupMenuGroup',
			description:
				'A variant of MenuGroup with default minimum and maximum widths for popup menus.',
			status: 'deprecated',
			import: {
				name: 'PopupMenuGroup',
				package: '@atlaskit/menu/popup-menu-group',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			examples: [],
			keywords: ['menu', 'popup', 'group', 'deprecated'],
			categories: ['navigation'],
		},
		{
			name: 'HeadingItem',
			description: 'A non-interactive heading within a menu section.',
			status: 'deprecated',
			import: {
				name: 'HeadingItem',
				package: '@atlaskit/menu/heading-item',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			contentGuidelines: ['Use clear, descriptive headings', 'Keep headings concise'],
			examples: [
				{
					name: 'Heading Item',
					description: 'HeadingItem example',
					source: `${__dirname}/examples/heading-item.tsx`,
				},
			],
			keywords: ['menu', 'heading', 'item', 'label'],
			categories: ['navigation'],
		},
		{
			name: 'SkeletonItem',
			description: 'A skeleton placeholder for a menu item during loading states.',
			status: 'deprecated',
			import: {
				name: 'SkeletonItem',
				package: '@atlaskit/menu/skeleton-item',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			examples: [
				{
					name: 'Skeleton Item',
					description: 'SkeletonItem example',
					source: `${__dirname}/examples/skeleton-item.tsx`,
				},
			],
			keywords: ['menu', 'skeleton', 'loading', 'placeholder'],
			categories: ['loading', 'navigation'],
		},
		{
			name: 'SkeletonHeadingItem',
			description: 'A skeleton placeholder for a menu heading during loading states.',
			status: 'deprecated',
			import: {
				name: 'SkeletonHeadingItem',
				package: '@atlaskit/menu/skeleton-heading-item',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			examples: [
				{
					name: 'Skeleton Heading Item',
					description: 'SkeletonHeadingItem example',
					source: `${__dirname}/examples/skeleton-heading-item.tsx`,
				},
			],
			keywords: ['menu', 'skeleton', 'heading', 'loading'],
			categories: ['loading', 'navigation'],
		},
	],
};

export default documentation;
