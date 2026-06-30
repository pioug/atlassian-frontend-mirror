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
			name: 'JSONTransformer',
			description: 'JSON transformer',
			status: 'general-availability',
			import: {
				name: 'JSONTransformer',
				package: '@atlaskit/editor-json-transformer',
				type: 'named',
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
					name: 'Layouts',
					description: 'JSON transformer with layout nodes.',
					source: path.resolve(packagePath, './examples/1-layouts.tsx'),
				},
			],
		},
	],
};

export default documentation;
