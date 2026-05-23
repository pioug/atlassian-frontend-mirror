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
			name: 'Editor Plugin Highlight',
			description: 'Highlight plugin for @atlaskit/editor-core',
			status: 'general-availability',
			import: {
				name: 'highlightPlugin',
				package: '@atlaskit/editor-plugin-highlight',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'editor-plugin-highlight', 'atlaskit'],
			categories: ['editor'],
			examples: [
				{
					name: 'Composable editor with highlighting',
					description: 'Highlight plugin in composable editor.',
					source: path.resolve(packagePath, './examples/1-composable-editor-with-highlighting.tsx'),
				},
			],
		},
	],
};

export default documentation;
