/**
 * Structured MCP docs for `@atlaskit/profilecard`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/profilecard',
		packagePath,
		packageJson,
		overview:
			'A React component to display a card with user or team information. It includes support for interactive triggers and resourced cards.',
	},
	components: [
		{
			name: 'ProfileCard',
			description: 'A component for displaying user information in a card.',
			status: 'general-availability',
			import: {
				name: 'ProfileCard',
				package: '@atlaskit/profilecard',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `ProfileCard` to show user details like name, avatar, and contact info.',
			],
			keywords: ['profile', 'user', 'card'],
			categories: ['people-and-teams'],
			examples: [
				{
					name: 'Profile card',
					description: 'Basic usage of ProfileCard.',
					source: path.resolve(packagePath, './examples/01-profilecard.tsx'),
				},
			],
		},
		{
			name: 'ProfileCardTrigger',
			description: 'A component that triggers a profile card on hover or click.',
			status: 'general-availability',
			import: {
				name: 'ProfileCardTrigger',
				package: '@atlaskit/profilecard',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `ProfileCardTrigger` to wrap an element (like an avatar) that should show a profile card.',
			],
			keywords: ['profile', 'trigger', 'hover'],
			categories: ['people-and-teams'],
			examples: [
				{
					name: 'Profile card trigger',
					description: 'Basic usage of ProfileCardTrigger.',
					source: path.resolve(packagePath, './examples/05-profilecard-trigger.tsx'),
				},
			],
		},
	],
};

export default documentation;
