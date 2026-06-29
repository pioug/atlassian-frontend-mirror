/**
 * Structured MCP docs for `@atlaskit/reactions`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/reactions',
		packagePath,
		packageJson,
		overview:
			'React components for displaying and managing emoji reactions on content. It includes support for reaction pickers and reaction views with backend integration.',
	},
	components: [
		{
			name: 'ConnectedReactionPicker',
			description: 'A reaction picker component pre-wired with a reactions store.',
			status: 'general-availability',
			import: {
				name: 'ConnectedReactionPicker',
				package: '@atlaskit/reactions',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `ConnectedReactionPicker` to allow users to add reactions to content.',
				'Requires a `ReactionsStore` to manage reaction state.',
			],
			keywords: ['reactions', 'picker', 'emoji'],
			categories: ['elements'],
			examples: [
				{
					name: 'Connected reaction picker',
					description: 'Basic usage of ConnectedReactionPicker.',
					source: path.resolve(packagePath, './examples/00-connected-reaction-picker.tsx'),
				},
			],
		},
		{
			name: 'ConnectedReactionsView',
			description: 'A component for displaying the current reactions on a piece of content.',
			status: 'general-availability',
			import: {
				name: 'ConnectedReactionsView',
				package: '@atlaskit/reactions',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `ConnectedReactionsView` to show the list of reactions and allow users to toggle their own reactions.',
			],
			keywords: ['reactions', 'view', 'display'],
			categories: ['elements'],
			examples: [
				{
					name: 'Connected reactions view',
					description: 'Basic usage of ConnectedReactionsView.',
					source: path.resolve(packagePath, './examples/01-connected-reactions-view.tsx'),
				},
			],
		},
	],
};

export default documentation;
