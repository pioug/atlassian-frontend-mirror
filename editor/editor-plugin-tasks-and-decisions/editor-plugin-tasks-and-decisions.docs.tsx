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
		name: 'Editor Plugin Tasks And Decisions',
		description: 'Tasks and decisions plugin for @atlaskit/editor-core',
		status: 'general-availability',
		import: {
			name: 'Editor Plugin Tasks And Decisions',
			package: '@atlaskit/editor-plugin-tasks-and-decisions',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-tasks-and-decisions', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{
				name: 'Composable editor tasks and decisions',
				description: 'Tasks and decisions plugin in composable editor.',
				source: path.resolve(packagePath, './examples/1-composable-editor-tasks-and-decisions.tsx'),
			},
		],
	},
];

export default documentation;
