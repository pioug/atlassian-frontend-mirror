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
			name: 'JSONTransformer',
			description: 'JSON transformer',
			status: 'general-availability',
			import: {
				name: 'JSONTransformer',
				package: '@atlaskit/editor-json-transformer/JSONTransformer-2',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'editor-json-transformer', 'atlaskit'],
			categories: ['editor'],
			examples: [
				{
					name: 'Layouts',
					description: 'JSON transformer with layout nodes.',
					source: `${packagePath}/examples/1-layouts.tsx`,
				},
			],
		},
	],
};

export default documentation;
