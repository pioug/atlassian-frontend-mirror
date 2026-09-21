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
			name: 'Editor Plugin Extension',
			description: 'editor-plugin-extension plugin for @atlaskit/editor-core',
			status: 'general-availability',
			import: {
				name: 'extensionPlugin',
				package: '@atlaskit/editor-plugin-extension',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'editor-plugin-extension', 'atlaskit'],
			categories: ['editor'],
			examples: [
				{
					name: 'Config panel extensions',
					description: 'Extension with config panel.',
					source: `${packagePath}/examples/1-config-panel-extensions.tsx`,
				},
				{
					name: 'Config panel with parameters',
					description: 'Extension config panel with parameters.',
					source: `${packagePath}/examples/1-config-panel-with-parameters.tsx`,
				},
			],
		},
	],
};

export default documentation;
