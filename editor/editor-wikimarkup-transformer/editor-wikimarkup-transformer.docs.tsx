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
			name: 'WikiMarkupTransformer',
			description: 'Wiki markup transformer for JIRA and Confluence',
			status: 'general-availability',
			import: {
				name: 'WikiMarkupTransformer',
				package: '@atlaskit/editor-wikimarkup-transformer',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'editor-wikimarkup-transformer', 'atlaskit'],
			categories: ['editor'],
			examples: [
				{
					name: 'Wikimarkup to ADF',
					description: 'Transform wikimarkup to ADF.',
					source: path.resolve(packagePath, './examples/1-wikimarkup-to-adf.tsx'),
				},
			],
		},
	],
};

export default documentation;
