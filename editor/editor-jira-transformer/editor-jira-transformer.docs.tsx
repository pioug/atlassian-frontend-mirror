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
		name: 'Editor Jira Transformer',
		description: "Editor JIRA transformer's",
		status: 'general-availability',
		import: {
			name: 'Editor Jira Transformer',
			package: '@atlaskit/editor-jira-transformer',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-jira-transformer', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{
				name: 'Jira transformer',
				description: 'Basic Jira transformer usage.',
				source: path.resolve(packagePath, './examples/0-jira-transformer.tsx'),
			},
			{
				name: 'Jira HTML to ADF',
				description: 'Transform Jira HTML to ADF.',
				source: path.resolve(packagePath, './examples/3-jira-html-to-adf.tsx'),
			},
		],
	},
];

export default documentation;
