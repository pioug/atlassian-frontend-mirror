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
			name: 'Editor Plugin Track Changes',
			description: 'ShowDiff plugin for @atlaskit/editor-core',
			status: 'general-availability',
			import: {
				name: 'trackChangesPlugin',
				package: '@atlaskit/editor-plugin-track-changes',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'editor-plugin-track-changes', 'atlaskit'],
			categories: ['editor'],
			examples: [
				{
					name: 'Basic composable',
					description: 'Track changes plugin in composable editor.',
					source: `${packagePath}/examples/1-basic-composable.tsx`,
				},
			],
		},
	],
};

export default documentation;
