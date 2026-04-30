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
		name: 'Editor Plugin Block Controls',
		description: 'Block controls plugin for @atlaskit/editor-core',
		status: 'general-availability',
		import: {
			name: 'Editor Plugin Block Controls',
			package: '@atlaskit/editor-plugin-block-controls',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-block-controls', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{ name: 'Basic', description: 'Block controls plugin in composable editor.', source: path.resolve(packagePath, './examples/1-basic.tsx') },
		],
	},
];

export default documentation;
