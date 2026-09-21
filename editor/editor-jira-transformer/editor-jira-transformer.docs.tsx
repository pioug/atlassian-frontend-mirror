/**
 * Testing structured MCP docs for review — ignore this file.
 * Contact #dst-structured-content in Slack with questions.
 */

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'JIRATransformer',
			description: "Editor JIRA transformer's",
			status: 'general-availability',
			import: {
				name: 'JIRATransformer',
				package: '@atlaskit/editor-jira-transformer',
				type: 'named',
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
					name: 'Jira HTML to ADF',
					description: 'Transform Jira HTML to ADF.',
					source: `${packagePath}/examples/3-jira-html-to-adf.tsx`,
				},
			],
		},
	],
};

export default documentation;
