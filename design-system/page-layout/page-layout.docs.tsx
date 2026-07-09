/**
 * Structured MCP docs for `@atlaskit/page-layout`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/page-layout',
		packagePath,
		packageJson,
		overview:
			"A collection of components which let you compose an application's page layout. Note that this package is deprecated in favor of the new navigation system.",
	},
	components: [
		{
			name: 'PageLayout',
			description: 'The main container for composing a page layout.',
			status: 'deprecated',
			import: {
				name: 'PageLayout',
				package: '@atlaskit/page-layout/page-layout',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `PageLayout` to define the overall structure of your page.',
				'Consider migrating to the new navigation system for new implementations.',
			],
			keywords: ['layout', 'page', 'structure'],
			categories: ['layout'],
			examples: [
				{
					name: 'Basic page layout',
					description: 'Basic usage of PageLayout.',
					source: path.resolve(packagePath, './examples/01-basic-page-layout.tsx'),
				},
			],
		},
	],
};

export default documentation;
