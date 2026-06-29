/**
 * Structured MCP docs for `@atlaskit/atlassian-navigation`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/atlassian-navigation',
		packagePath,
		packageJson,
		overview:
			'A horizontal navigation component for Atlassian apps. It provides a consistent navigation experience across Atlassian products, including support for product home, primary navigation items, search, notifications, and user profile.',
	},
	components: [
		{
			name: 'AtlassianNavigation',
			description:
				'The main container for horizontal navigation. It coordinates the layout of various navigation elements like product home, primary items, and global actions.',
			status: 'deprecated',
			import: {
				name: 'AtlassianNavigation',
				package: '@atlaskit/atlassian-navigation',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'This package is deprecated. Use the new navigation system instead.',
				'Provide `renderProductHome`, `primaryItems`, and other render props to customize the navigation content.',
			],
			keywords: ['navigation', 'atlassian', 'horizontal-nav'],
			categories: ['navigation'],
			examples: [
				{
					name: 'Default navigation',
					description: 'Basic usage of AtlassianNavigation.',
					source: path.resolve(
						packagePath,
						'./examples/constellation/atlassian-navigation-default.tsx',
					),
				},
				{
					name: 'Jira integration',
					description: 'Example of AtlassianNavigation integrated with Jira-like items.',
					source: path.resolve(packagePath, './examples/00-jira-integration-example.tsx'),
				},
				{
					name: 'Anonymous example',
					description: 'Navigation for unauthenticated users.',
					source: path.resolve(packagePath, './examples/20-anonymous-example.tsx'),
				},
			],
		},
		{
			name: 'ProductHome',
			description:
				'A component to display the product logo and name, typically used as the first item in the navigation.',
			status: 'deprecated',
			import: {
				name: 'ProductHome',
				package: '@atlaskit/atlassian-navigation',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `ProductHome` for standard Atlassian product logos.',
				'Use `CustomProductHome` if you need to provide a custom logo or icon.',
			],
			keywords: ['navigation', 'logo', 'product-home'],
			categories: ['navigation'],
			examples: [
				{
					name: 'Product home',
					description: 'Basic usage of ProductHome.',
					source: path.resolve(packagePath, './examples/product-home.tsx'),
				},
			],
		},
		{
			name: 'PrimaryButton',
			description: 'A button component used for primary navigation items.',
			status: 'deprecated',
			import: {
				name: 'PrimaryButton',
				package: '@atlaskit/atlassian-navigation',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `PrimaryButton` for top-level navigation items that do not have sub-menus.',
			],
			keywords: ['navigation', 'button', 'primary'],
			categories: ['navigation'],
			examples: [
				{
					name: 'Primary button',
					description: 'Basic usage of PrimaryButton.',
					source: path.resolve(packagePath, './examples/primary-button.tsx'),
				},
			],
		},
		{
			name: 'Search',
			description: 'A search component integrated into the navigation bar.',
			status: 'deprecated',
			import: {
				name: 'Search',
				package: '@atlaskit/atlassian-navigation',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Use `Search` to provide a search input in the navigation.'],
			keywords: ['navigation', 'search'],
			categories: ['navigation'],
			examples: [
				{
					name: 'Search',
					description: 'Basic usage of Search.',
					source: path.resolve(packagePath, './examples/search.tsx'),
				},
			],
		},
	],
};

export default documentation;
