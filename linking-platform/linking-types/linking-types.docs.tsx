/**
 * Testing structured MCP docs for review — ignore this file.
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'LinkingTypes',
			description:
				'Schema and types shared by frontend and backend parts of the Linking Platform. Exports types for Smart Link actions, datasource requests/responses, and related contracts. Use when implementing clients, resolvers, or UI that must conform to the linking platform API.',
			status: 'general-availability',
			import: {
				name: 'DatasourceDetailsRequest',
				package: '@atlaskit/linking-types',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when you need type definitions for Smart Link invoke requests/responses, datasource details/data, or action discovery. Import from the main entry or subpaths (e.g. linking-types/smart-link-actions, linking-types/datasource).',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['linking-types', 'types', 'schema', 'smart link', 'datasource', 'actions'],
			categories: ['linking'],
			examples: [],
		},
	],
};

export default documentation;
