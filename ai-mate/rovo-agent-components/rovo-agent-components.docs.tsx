import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'AgentAvatar',
			description:
				'A visual representation of a Rovo agent, supporting both custom images and generated avatars.',
			status: 'general-availability',
			import: {
				name: 'AgentAvatar',
				package: '@atlaskit/rovo-agent-components',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use AgentAvatar to identify a Rovo agent visually.',
				"Supports displaying a custom image or a generated avatar based on the agent's identity.",
			],
			examples: [
				{
					name: 'Basic Avatar',
					description: 'Standard agent avatar display.',
					source: path.resolve(packagePath, './examples/02-agent-avatar.tsx'),
				},
				{
					name: 'Generated Avatar',
					description: 'Agent avatar with a generated image.',
					source: path.resolve(packagePath, './examples/03-agent-avatar-generated.tsx'),
				},
			],
			keywords: ['rovo', 'agent', 'avatar', 'identity', 'ai'],
			categories: ['media', 'data-display'],
		},
		{
			name: 'AgentProfileInfo',
			description:
				'A component for displaying information about a Rovo agent, including name, description, and star count.',
			status: 'general-availability',
			import: {
				name: 'AgentProfileInfo',
				package: '@atlaskit/rovo-agent-components',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use AgentProfileInfo to show details about a Rovo agent.',
				'Typically used in agent selection or profile views.',
			],
			examples: [
				{
					name: 'Profile Info',
					description: 'Standard agent profile information display.',
					source: path.resolve(packagePath, './examples/01-agent-profile-info.tsx'),
				},
			],
			keywords: ['rovo', 'agent', 'profile', 'info', 'ai'],
			categories: ['data-display'],
		},
	],
};

export default documentation;
