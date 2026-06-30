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
			name: 'MarkdownTransformer',
			description: 'Editor Markdown transformer',
			status: 'general-availability',
			import: {
				name: 'MarkdownTransformer',
				package: '@atlaskit/editor-markdown-transformer',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'editor-markdown-transformer', 'atlaskit'],
			categories: ['editor'],
			examples: [],
		},
	],
};

export default documentation;
