import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'AgentAvatar',
			description:
				'A visual representation of a Rovo agent, supporting both custom images and generated avatars.',
			status: 'general-availability',
			import: {
				name: 'AgentAvatar',
				package: '@atlaskit/rovo-agent-components/ui/AgentAvatar',
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
					name: 'Render an agent avatar',
					description:
						'Uses the built-in Rovo identity to label an agent in a conversation surface. (AI-generated — please review)',
					source: `${packagePath}/examples/ai/agent-avatar.tsx`,
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
				package: '@atlaskit/rovo-agent-components/ui/AgentProfileInfo',
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
					name: 'Show an agent profile summary',
					description:
						'Composes an agent name, creator, description, and host-controlled star state for a profile surface. (AI-generated — please review)',
					source: `${packagePath}/examples/ai/agent-profile-info.tsx`,
				},
			],
			keywords: ['rovo', 'agent', 'profile', 'info', 'ai'],
			categories: ['data-display'],
		},
	],
};

export default documentation;
