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
			name: 'Editor Json Transformer',
			description: 'JSON transformer',
			status: 'general-availability',
			import: {
				name: 'Editor Json Transformer',
				package: '@atlaskit/editor-json-transformer',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'editor-json-transformer', 'atlaskit'],
			categories: ['editor'],
			examples: [
				{
					name: 'JSON transformer',
					description: 'Transform between JSON and ADF.',
					source: path.resolve(packagePath, './examples/0-json-transformer.tsx'),
				},
				{
					name: 'Layouts',
					description: 'JSON transformer with layout nodes.',
					source: path.resolve(packagePath, './examples/1-layouts.tsx'),
				},
			],
		},
	],
};

export default documentation;
