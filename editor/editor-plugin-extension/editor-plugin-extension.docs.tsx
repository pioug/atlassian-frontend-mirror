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
		name: 'Editor Plugin Extension',
		description: 'editor-plugin-extension plugin for @atlaskit/editor-core',
		status: 'general-availability',
		import: {
			name: 'Editor Plugin Extension',
			package: '@atlaskit/editor-plugin-extension',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-extension', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{ name: 'Config panel extensions', description: 'Extension with config panel.', source: path.resolve(packagePath, './examples/1-config-panel-extensions.tsx') },
			{ name: 'Config panel with parameters', description: 'Extension config panel with parameters.', source: path.resolve(packagePath, './examples/1-config-panel-with-parameters.tsx') },
		],
	},
];

export default documentation;
