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
		name: 'Editor Confluence Transformer',
		description: 'Editor Confluence Transformer',
		status: 'general-availability',
		import: {
			name: 'Editor Confluence Transformer',
			package: '@atlaskit/editor-confluence-transformer',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-confluence-transformer', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{ name: 'Confluence XHTML transformer', description: 'Transform Confluence XHTML to ADF.', source: path.resolve(packagePath, './examples/0-cxhtml-transformer.tsx') },
		],
	},
];

export default documentation;
