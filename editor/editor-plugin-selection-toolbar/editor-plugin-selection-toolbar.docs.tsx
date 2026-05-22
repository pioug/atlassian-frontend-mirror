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
		name: 'Editor Plugin Selection Toolbar',
		description: '@atlaskit/editor-plugin-selection-toolbar for @atlaskit/editor-core',
		status: 'general-availability',
		import: {
			name: 'selectionToolbarPlugin',
			package: '@atlaskit/editor-plugin-selection-toolbar',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-selection-toolbar', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{
				name: 'Basic',
				description: 'Selection toolbar plugin in editor.',
				source: path.resolve(packagePath, './examples/1-basic.tsx'),
			},
		],
	},
	],
};

export default documentation;
