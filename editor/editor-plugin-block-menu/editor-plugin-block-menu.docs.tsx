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
		name: 'Editor Plugin Block Menu',
		description: 'BlockMenu plugin for @atlaskit/editor-core',
		status: 'general-availability',
		import: {
			name: 'Editor Plugin Block Menu',
			package: '@atlaskit/editor-plugin-block-menu',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-block-menu', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{ name: 'Basic', description: 'Block menu plugin usage.', source: path.resolve(packagePath, './examples/basic.tsx') },
		],
	},
];

export default documentation;
