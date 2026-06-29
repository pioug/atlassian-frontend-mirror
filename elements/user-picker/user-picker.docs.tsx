/**
 * Structured MCP docs for `@atlaskit/user-picker`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/user-picker',
		packagePath,
		packageJson,
		overview:
			'A React component for selecting users, teams, and groups. It provides a searchable dropdown with support for single and multi-select modes, custom options, and external users.',
	},
	components: [
		{
			name: 'UserPicker',
			description: 'The main user picker component.',
			status: 'general-availability',
			import: {
				name: 'default',
				package: '@atlaskit/user-picker',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `UserPicker` for selecting users or teams in forms or filters.',
				'Supports `isMulti` for selecting multiple items.',
			],
			keywords: ['user-picker', 'select', 'user', 'team'],
			categories: ['elements'],
			examples: [
				{
					name: 'Single user picker',
					description: 'Basic usage of UserPicker in single-select mode.',
					source: path.resolve(packagePath, './examples/00-single.tsx'),
				},
				{
					name: 'Multi user picker',
					description: 'Basic usage of UserPicker in multi-select mode.',
					source: path.resolve(packagePath, './examples/01-multi.tsx'),
				},
			],
		},
	],
};

export default documentation;
