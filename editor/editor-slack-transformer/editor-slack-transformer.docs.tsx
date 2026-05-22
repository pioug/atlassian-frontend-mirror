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
		name: 'Editor Slack Transformer',
		description: 'Editor Slack transformer',
		status: 'general-availability',
		import: {
			name: 'Editor Slack Transformer',
			package: '@atlaskit/editor-slack-transformer',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-slack-transformer', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{
				name: 'Slack markdown',
				description: 'Transform Slack markdown to ADF.',
				source: path.resolve(packagePath, './examples/0-slack-markdown.tsx'),
			},
		],
	},
	],
};

export default documentation;
