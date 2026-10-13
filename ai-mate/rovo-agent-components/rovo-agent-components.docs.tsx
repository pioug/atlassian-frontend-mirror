import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'AgentAvatar',
			description:
				'A legacy visual representation for a Rovo agent, supporting custom images and generated avatars. Deprecated for new consumers; prefer the identity-backed AvatarRelay where available.',
			status: 'deprecated',
			import: {
				name: 'AgentAvatar',
				package: '@atlaskit/rovo-agent-components/ui/AgentAvatar',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use AgentAvatar wherever a Rovo agent identity needs to be shown alongside chat or agent content.',
				'Pass the agent identifiers and identity account data available to the host; the component selects the appropriate custom or generated avatar.',
			],
			examples: [
				{
					name: 'Render an agent avatar',
					description: 'Shows the standard agent avatar treatment used in Rovo surfaces.',
					source: `${packagePath}/examples/02-agent-avatar.vr.ap.tsx`,
				},
				{
					name: 'Render a generated agent avatar',
					description: 'Shows the generated avatar treatment for an agent without a custom image.',
					source: `${packagePath}/examples/03-agent-avatar-generated.vr.ap.tsx`,
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
				'Use in a profile or details view where the agent name is a section heading. Use a compact row in selectors with many agents.',
				'Show creator and popularity details when they help people assess the agent. Provide readable text alongside icons.',
			],
			contentGuidelines: [
				'Use a short description that explains what the agent helps people do, not a repeat of its name.',
			],
			accessibilityGuidelines: [
				'The component renders the agent name as an h2; place it only where that heading level fits the surrounding document outline.',
			],
			examples: [
				{
					name: 'Profile Info',
					description: 'Standard agent profile information display.',
					source: `${packagePath}/examples/01-agent-profile-info.vr.ap.tsx`,
				},
			],
			keywords: ['rovo', 'agent', 'profile', 'info', 'ai'],
			categories: ['data-display'],
		},
	],
};

export default documentation;
