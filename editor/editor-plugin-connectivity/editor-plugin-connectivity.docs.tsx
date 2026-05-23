/**
 * Testing structured MCP docs for review — ignore this file.
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

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
					source: path.resolve(packagePath, './examples/1-offline-mode.tsx'),
				},
			],
		},
	],
};

export default documentation;
