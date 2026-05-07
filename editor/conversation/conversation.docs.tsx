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
		name: 'Conversation',
		description: 'DEPRECATED Render conversation threads',
		status: 'general-availability',
		import: {
			name: 'Conversation',
			package: '@atlaskit/conversation',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'conversation', 'atlaskit'],
		categories: ['editor'],
		examples: [
			{
				name: 'New conversation',
				description: 'Create a new conversation with ConversationResource.',
				source: path.resolve(packagePath, './examples/0-New-Conversation.tsx'),
			},
			{
				name: 'Existing conversation',
				description: 'Load and display an existing conversation.',
				source: path.resolve(packagePath, './examples/1-Existing-Conversation.tsx'),
			},
			{
				name: 'Customized editor',
				description: 'Conversation with customized editor (e.g. saveOnEnter).',
				source: path.resolve(packagePath, './examples/2-Customized-Editor.tsx'),
			},
		],
	},
];

export default documentation;
