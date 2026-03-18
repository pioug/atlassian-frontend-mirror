import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Drawer',
		description:
			'A drawer is a panel that slides in from the left side of the screen for navigation or additional content.',
		status: 'intent-to-deprecate',
		import: {
			name: 'Drawer',
			package: '@atlaskit/drawer',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for navigation or secondary content',
			'Provide clear open/close mechanisms',
			'Consider screen size and drawer width',
			'Use appropriate backdrop behavior',
			'Consider alternative patterns like Modal for better UX',
		],
		contentGuidelines: [
			'Organize content logically within the drawer',
			'Use clear navigation labels',
			'Provide appropriate close actions',
			'Consider content hierarchy and grouping',
		],
		accessibilityGuidelines: [
			'Ensure proper focus management when drawer opens/closes',
			'Provide keyboard navigation support',
			'Use appropriate ARIA attributes for drawer state',
			'Ensure content is accessible when drawer is open',
			'Provide clear close mechanisms',
		],
		examples: [
			{
				name: 'Drawer',
				description: 'Drawer example',
				source: path.resolve(__dirname, './examples/ai/drawer.tsx'),
			},
		],
		keywords: ['drawer', 'panel', 'slide', 'overlay', 'navigation', 'sidebar'],
		categories: ['overlays-and-layering'],
	},
	{
		name: 'DrawerContent',
		description: 'The main content area of a drawer panel.',
		status: 'intent-to-deprecate',
		import: {
			name: 'DrawerContent',
			package: '@atlaskit/drawer',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use as the main content container within a drawer',
			'Place primary content and actions here',
			'Ensure proper scrolling behavior for long content',
		],
		contentGuidelines: [
			'Organize content logically',
			'Use appropriate spacing and layout',
			'Consider content hierarchy',
		],
		examples: [
			{
				name: 'Drawer Content',
				description: 'Drawer Content example',
				source: path.resolve(__dirname, './examples/ai/drawer-content.tsx'),
			},
		],
		keywords: ['drawer', 'content', 'panel', 'body'],
		categories: ['overlays-and-layering'],
	},
	{
		name: 'DrawerSidebar',
		description: 'A sidebar component within a drawer for navigation or secondary content.',
		status: 'intent-to-deprecate',
		import: {
			name: 'DrawerSidebar',
			package: '@atlaskit/drawer',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for navigation or secondary content in a drawer',
			'Keep sidebar content focused and organized',
			'Consider responsive behavior',
		],
		contentGuidelines: [
			'Use clear navigation labels',
			'Organize content hierarchically',
			'Keep sidebar content concise',
		],
		examples: [
			{
				name: 'Drawer Sidebar',
				description: 'Drawer Sidebar example',
				source: path.resolve(__dirname, './examples/ai/drawer-sidebar.tsx'),
			},
		],
		keywords: ['drawer', 'sidebar', 'navigation', 'panel'],
		categories: ['overlays-and-layering'],
	},
	{
		name: 'DrawerCloseButton',
		description: 'A close button specifically designed for drawer components.',
		status: 'intent-to-deprecate',
		import: {
			name: 'DrawerCloseButton',
			package: '@atlaskit/drawer',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use to provide clear close functionality for drawers',
			'Position prominently for easy access',
			'Ensure keyboard accessibility',
		],
		contentGuidelines: [
			'Use clear close icon or text',
			'Ensure button is easily discoverable',
			'Provide appropriate hover/focus states',
		],
		examples: [
			{
				name: 'Drawer Close Button',
				description: 'Drawer Close Button example',
				source: path.resolve(__dirname, './examples/ai/drawer-close-button.tsx'),
			},
		],
		keywords: ['drawer', 'close', 'button', 'action'],
		categories: ['overlays-and-layering'],
	},
];

export default documentation;
