import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'ButtonMenuItem',
			description:
				'A menu item component for side navigation that triggers an action when clicked.',
			status: 'general-availability',
			import: {
				name: 'ButtonMenuItem',
				package: '@atlaskit/side-nav-items/button-menu-item',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use ButtonMenuItem for navigation items that perform an action rather than navigating to a new URL.',
				'Supports icons, avatars, and labels.',
			],
			examples: [
				{
					name: 'Button Menu Item',
					description: 'Standard button menu item example.',
					source: path.resolve(packagePath, './examples/button-menu-item.tsx'),
				},
			],
			keywords: ['navigation', 'menu-item', 'button', 'side-nav'],
			categories: ['navigation'],
		},
		{
			name: 'LinkMenuItem',
			description: 'A menu item component for side navigation that navigates to a URL.',
			status: 'general-availability',
			import: {
				name: 'LinkMenuItem',
				package: '@atlaskit/side-nav-items/link-menu-item',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use LinkMenuItem for standard navigation links in a side navigation bar.',
				'Supports icons, avatars, and labels.',
			],
			examples: [
				{
					name: 'Link Menu Item',
					description: 'Standard link menu item example.',
					source: path.resolve(packagePath, './examples/link-menu-item.tsx'),
				},
			],
			keywords: ['navigation', 'menu-item', 'link', 'side-nav'],
			categories: ['navigation'],
		},
	],
};

export default documentation;
