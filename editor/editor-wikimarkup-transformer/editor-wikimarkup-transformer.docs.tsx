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
		name: 'Editor Wikimarkup Transformer',
		description: 'Wiki markup transformer for JIRA and Confluence',
		status: 'general-availability',
		import: {
			name: 'Editor Wikimarkup Transformer',
			package: '@atlaskit/editor-wikimarkup-transformer',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-wikimarkup-transformer', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{ name: 'ADF to wikimarkup', description: 'Transform ADF to wikimarkup.', source: path.resolve(packagePath, './examples/0-adf-to-wikimarkup.tsx') },
			{ name: 'Wikimarkup to ADF', description: 'Transform wikimarkup to ADF.', source: path.resolve(packagePath, './examples/1-wikimarkup-to-adf.tsx') },
			{ name: 'Wikimarkup editor', description: 'Editor with wikimarkup transformer.', source: path.resolve(packagePath, './examples/2-wikimarkup-editor.tsx') },
		],
	},
];

export default documentation;
