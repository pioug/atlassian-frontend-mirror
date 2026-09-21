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
			name: 'Editor Plugin Connectivity',
			description: 'Connectivity plugin for @atlaskit/editor-core',
			status: 'general-availability',
			import: {
				name: 'connectivityPlugin',
				package: '@atlaskit/editor-plugin-connectivity',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['editor', 'editor-plugin-connectivity', 'atlaskit'],
			categories: ['editor'],
			examples: [
				{
					name: 'Offline mode',
					description: 'Connectivity plugin showing offline/online state.',
					source: `${packagePath}/examples/1-offline-mode.tsx`,
				},
			],
		},
	],
};

export default documentation;
