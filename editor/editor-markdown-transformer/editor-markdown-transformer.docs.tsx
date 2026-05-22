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
		name: 'Editor Markdown Transformer',
		description: 'Editor Markdown transformer',
		status: 'general-availability',
		import: {
			name: 'Editor Markdown Transformer',
			package: '@atlaskit/editor-markdown-transformer',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-markdown-transformer', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{
				name: 'Markdown transformer',
				description: 'Transform between Markdown and ADF.',
				source: path.resolve(packagePath, './examples/0-markdown-transformer.tsx'),
			},
		],
	},
	],
};

export default documentation;
