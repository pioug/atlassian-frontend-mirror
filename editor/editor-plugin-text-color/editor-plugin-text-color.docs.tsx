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
			name: 'Editor Plugin Text Color',
			description: 'Text color plugin for @atlaskit/editor-core',
			status: 'general-availability',
			import: {
				name: 'textColorPlugin',
				package: '@atlaskit/editor-plugin-text-color',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'editor-plugin-text-color', 'atlaskit'],
			categories: ['editor'],
			examples: [
				{
					name: 'Composable editor with text color',
					description: 'Text color plugin in composable editor.',
					source: path.resolve(packagePath, './examples/1-composable-editor-with-text-color.tsx'),
				},
			],
		},
	],
};

export default documentation;
