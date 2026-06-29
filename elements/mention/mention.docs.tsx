/**
 * Structured MCP docs for `@atlaskit/mention`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/mention',
		packagePath,
		packageJson,
		overview:
			'React components for displaying user and team mentions. It includes support for mention items, lists, and pickers with integration for profile cards and presence.',
	},
	components: [
		{
			name: 'Mention',
			description: 'A component for displaying a single mention.',
			status: 'general-availability',
			import: {
				name: 'Mention',
				package: '@atlaskit/mention',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Use `Mention` to render a mention for a user or team.'],
			keywords: ['mention', 'user', 'team'],
			categories: ['elements'],
			examples: [
				{
					name: 'Simple mention',
					description: 'Basic usage of the Mention component.',
					source: path.resolve(packagePath, './examples/07-simple-mention.tsx'),
				},
			],
		},
		{
			name: 'MentionPicker',
			description: 'A component that provides a searchable picker for mentions.',
			status: 'general-availability',
			import: {
				name: 'MentionPicker',
				package: '@atlaskit/mention',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `MentionPicker` to allow users to select a user or team to mention.',
				'Requires a `MentionResource` to fetch and manage mention data.',
			],
			keywords: ['mention', 'picker', 'select'],
			categories: ['elements'],
			examples: [
				{
					name: 'Mention list picker',
					description: 'Basic usage of MentionPicker.',
					source: path.resolve(packagePath, './examples/05-mention-list-picker.tsx'),
				},
			],
		},
	],
};

export default documentation;
