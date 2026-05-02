/**
 * Testing structured MCP docs for review — ignore this file.
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'EditorPluginHighlight',
		description: 'Highlight plugin for @atlaskit/editor-core',
		status: 'general-availability',
		import: {
			name: 'EditorPluginHighlight',
			package: '@atlaskit/editor-plugin-highlight',
			type: 'default',
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
];

export default documentation;
