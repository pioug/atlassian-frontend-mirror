/**
 * Structured MCP docs for `@atlaskit/side-navigation`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/side-navigation',
		packagePath,
		packageJson,
		overview:
			'A highly composable side navigation component that supports nested views. Note that this package is deprecated in favor of the new navigation system.',
	},
	components: [
		{
			name: 'SideNavigation',
			description: 'The main container for side navigation.',
			status: 'deprecated',
			import: {
				name: 'SideNavigation',
				package: '@atlaskit/side-navigation/side-navigation',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `SideNavigation` to provide vertical navigation for your application.',
				'Consider migrating to the new navigation system for new implementations.',
			],
			keywords: ['navigation', 'side-nav', 'vertical-nav'],
			categories: ['navigation'],
			examples: [
				{
					name: 'Simple sidebar',
					description: 'Basic usage of SideNavigation.',
					source: path.resolve(packagePath, './examples/03-simple-sidebar.tsx'),
				},
				{
					name: 'Nested side navigation',
					description: 'Example of SideNavigation with nested items.',
					source: path.resolve(packagePath, './examples/00-nested-side-navigation.tsx'),
				},
			],
		},
	],
};

export default documentation;
