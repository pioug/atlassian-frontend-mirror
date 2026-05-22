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
		name: 'Editor Plugin Quick Insert',
		description: 'Quick insert plugin for @atlaskit/editor-core',
		status: 'general-availability',
		import: {
			name: 'quickInsertPlugin',
			package: '@atlaskit/editor-plugin-quick-insert',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-quick-insert', 'atlaskit'],
		categories: ['editor'],
		examples: [],
	},
	],
};

export default documentation;
