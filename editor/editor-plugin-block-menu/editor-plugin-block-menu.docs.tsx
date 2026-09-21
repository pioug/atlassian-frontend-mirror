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
			name: 'Editor Plugin Block Menu',
			description: 'BlockMenu plugin for @atlaskit/editor-core',
			status: 'general-availability',
			import: {
				name: 'blockMenuPlugin',
				package: '@atlaskit/editor-plugin-block-menu',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'editor-plugin-block-menu', 'atlaskit'],
			categories: ['editor'],
			examples: [
				{
					name: 'Basic',
					description: 'Block menu plugin usage.',
					source: `${packagePath}/examples/basic.tsx`,
				},
			],
		},
	],
};

export default documentation;
