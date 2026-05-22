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
		name: 'Editor Plugin User Preferences',
		description: 'UserPreferences plugin for @atlaskit/editor-core',
		status: 'general-availability',
		import: {
			name: 'userPreferencesPlugin',
			package: '@atlaskit/editor-plugin-user-preferences',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-user-preferences', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{
				name: 'Basic',
				description: 'User preferences plugin usage.',
				source: path.resolve(packagePath, './examples/1-basic.tsx'),
			},
		],
	},
	],
};

export default documentation;
