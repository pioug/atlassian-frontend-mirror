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
			name: 'Editor Ssr Renderer',
			description: 'SSR Renderer based on Editor',
			status: 'general-availability',
			import: {
				name: 'EditorSSRRenderer',
				package: '@atlaskit/editor-ssr-renderer',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'editor-ssr-renderer', 'atlaskit'],
			categories: ['editor'],
			examples: [
				{
					name: 'All nodes',
					description: 'SSR renderer with all ADF node types.',
					source: `${packagePath}/examples/0-all-nodes.tsx`,
				},
				{
					name: 'Code blocks',
					description: 'SSR renderer code block example.',
					source: `${packagePath}/examples/10-code-blocks.tsx`,
				},
				{
					name: 'Text',
					description: 'SSR renderer text nodes.',
					source: `${packagePath}/examples/10-text.tsx`,
				},
			],
		},
	],
};

export default documentation;
