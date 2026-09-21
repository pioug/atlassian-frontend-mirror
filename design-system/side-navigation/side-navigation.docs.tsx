/**
 * Structured MCP docs for `@atlaskit/side-navigation`.
 */

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

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
					source: `${packagePath}/examples/03-simple-sidebar.tsx`,
				},
				{
					name: 'Nested side navigation',
					description: 'Example of SideNavigation with nested items.',
					source: `${packagePath}/examples/00-nested-side-navigation.vr.ap.tsx`,
				},
			],
		},
	],
};

export default documentation;
