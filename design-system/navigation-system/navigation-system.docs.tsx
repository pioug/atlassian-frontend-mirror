/**
 * Structured MCP docs for `@atlaskit/navigation-system`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/navigation-system',
		packagePath,
		packageJson,
		overview:
			'The latest navigation system for Atlassian apps. It provides a flexible layout system for top and side navigation, including components for product logos, search, and global actions.',
	},
	components: [
		{
			name: 'TopNav',
			description: 'The horizontal top navigation bar component.',
			status: 'general-availability',
			import: {
				name: 'TopNav',
				package: '@atlaskit/navigation-system/layout/top-nav',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Render `TopNav` within the `Root` component to provide global navigation and actions.',
			],
			keywords: ['navigation', 'top-nav', 'header'],
			categories: ['navigation'],
			examples: [
				{
					name: 'Top navigation',
					description: 'Basic usage of the top navigation bar.',
					source: path.resolve(packagePath, './examples/top-navigation.tsx'),
				},
			],
		},
	],
};

export default documentation;
