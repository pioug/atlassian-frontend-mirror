/**
 * Structured MCP docs for `@atlaskit/emoji`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/emoji',
		packagePath,
		packageJson,
		overview:
			'React components and utilities for displaying and picking emojis. It includes support for standard emojis, custom emojis, and skin tone variations.',
	},
	components: [
		{
			name: 'Emoji',
			description: 'A component for displaying a single emoji.',
			status: 'general-availability',
			import: {
				name: 'Emoji',
				package: '@atlaskit/emoji',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Use `Emoji` to render a specific emoji by its ID or short name.'],
			keywords: ['emoji', 'display'],
			categories: ['elements'],
			examples: [
				{
					name: 'Simple emoji',
					description: 'Basic usage of the Emoji component.',
					source: path.resolve(packagePath, './examples/00-simple-emoji.tsx'),
				},
			],
		},
		{
			name: 'EmojiPicker',
			description: 'A component that provides a searchable picker for emojis.',
			status: 'general-availability',
			import: {
				name: 'EmojiPicker',
				package: '@atlaskit/emoji',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `EmojiPicker` when you need to allow users to select an emoji from a list.',
				'Requires an `EmojiResource` to fetch and manage emoji data.',
			],
			keywords: ['emoji', 'picker', 'select'],
			categories: ['elements'],
			examples: [
				{
					name: 'Emoji picker with usage',
					description: 'Emoji picker with frequently used emojis tracked.',
					source: path.resolve(packagePath, './examples/06-emoji-picker-with-usage.tsx'),
				},
			],
		},
		{
			name: 'EmojiTypeAhead',
			description: 'A component that provides emoji suggestions based on user input.',
			status: 'general-availability',
			import: {
				name: 'EmojiTypeAhead',
				package: '@atlaskit/emoji',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `EmojiTypeAhead` to provide a shortcut-based emoji selection experience (e.g., typing `:smile`).',
			],
			keywords: ['emoji', 'typeahead', 'autocomplete'],
			categories: ['elements'],
			examples: [
				{
					name: 'Standard emoji typeahead',
					description: 'Basic usage of EmojiTypeAhead.',
					source: path.resolve(packagePath, './examples/03-standard-emoji-typeahead.tsx'),
				},
			],
		},
	],
};

export default documentation;
