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
		name: 'Editor Bitbucket Transformer',
		description: 'Editor Bitbucket transformer',
		status: 'general-availability',
		import: {
			name: 'Editor Bitbucket Transformer',
			package: '@atlaskit/editor-bitbucket-transformer',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-bitbucket-transformer', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{
				name: 'Transformer example',
				description: 'Basic Bitbucket transformer usage.',
				source: path.resolve(packagePath, './examples/0-transformer-example.tsx'),
			},
			{
				name: 'Bitbucket HTML',
				description: 'Transform Bitbucket HTML format.',
				source: path.resolve(packagePath, './examples/1-bitbucket-html.tsx'),
			},
			{
				name: 'Bitbucket markdown',
				description: 'Transform Bitbucket markdown.',
				source: path.resolve(packagePath, './examples/2-bitbucket-markdown.tsx'),
			},
		],
	},
	],
};

export default documentation;
