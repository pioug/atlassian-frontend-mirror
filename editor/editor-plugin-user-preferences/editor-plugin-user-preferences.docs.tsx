/**
 * Testing structured MCP docs for review — ignore this file.
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Editor Plugin User Preferences',
		description: 'UserPreferences plugin for @atlaskit/editor-core',
		status: 'general-availability',
		import: {
			name: 'Editor Plugin User Preferences',
			package: '@atlaskit/editor-plugin-user-preferences',
			type: 'default',
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
];

export default documentation;
