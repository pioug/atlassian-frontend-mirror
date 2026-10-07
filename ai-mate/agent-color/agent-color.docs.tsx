import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;
const packageName = '@atlaskit/agent-color';

const documentation: StructuredContentSource = {
	package: {
		package: packageName,
		packagePath,
		packageJson,
		overview:
			'Utilities and types for selecting stable branded colours for first-party and third-party agents, including presence colour schemes.',
	},
	utilities: [
		{
			kind: 'function',
			name: 'getAgentColor',
			description: 'Returns the design-system color assigned to an agent.',
			status: 'general-availability',
			import: {
				name: 'getAgentColor',
				package: '@atlaskit/agent-color',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Import from this explicit public entrypoint rather than a source-internal path.',
				'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
			],
			examples: [
				// TODO: Add a faithful example; this export requires host-specific Relay, analytics, or entrypoint context.
			],
			keywords: ['studio', 'rovo', 'agent'],
			categories: ['studio', 'agents', 'utilities'],
		},
		{
			kind: 'constant',
			name: 'agentBrandColorSchemes',
			description: 'Maps each supported agent brand scheme to its themed presence colors.',
			status: 'general-availability',
			import: {
				name: 'agentBrandColorSchemes',
				package: '@atlaskit/agent-color/agent-brand-color-schemes',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Import from this explicit public entrypoint rather than a source-internal path.',
				'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
			],
			examples: [
				// TODO: Add a faithful example; this export requires host-specific Relay, analytics, or entrypoint context.
			],
			keywords: ['studio', 'rovo', 'agent'],
			categories: ['studio', 'agents', 'utilities'],
		},
		{
			kind: 'type',
			name: 'AgentPresenceColor',
			description: 'Describes the themed color roles used by agent presence surfaces.',
			status: 'general-availability',
			import: {
				name: 'AgentPresenceColor',
				package: '@atlaskit/agent-color/agent-presence-color-types',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Import from this explicit public entrypoint rather than a source-internal path.',
				'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
			],
			examples: [
				// TODO: Add a faithful example; this export requires host-specific Relay, analytics, or entrypoint context.
			],
			keywords: ['studio', 'rovo', 'agent'],
			categories: ['studio', 'agents', 'utilities'],
		},
		{
			kind: 'type',
			name: 'AgentBrandColorScheme',
			description: 'Union of supported third-party agent brand scheme identifiers.',
			status: 'general-availability',
			import: {
				name: 'AgentBrandColorScheme',
				package: '@atlaskit/agent-color/agent-presence-color-types',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use the published scheme identifiers when selecting a brand palette.',
				'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
			],
			examples: [
				// TODO: Add a faithful example; this export requires host-specific Relay, analytics, or entrypoint context.
			],
			keywords: ['studio', 'rovo', 'agent'],
			categories: ['studio', 'agents', 'utilities'],
		},
		{
			kind: 'type',
			name: 'AgentPresenceColorScheme',
			description: 'Union of first-party and third-party agent color scheme identifiers.',
			status: 'general-availability',
			import: {
				name: 'AgentPresenceColorScheme',
				package: '@atlaskit/agent-color/agent-presence-color-types',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use this type when a surface accepts either a Studio palette or a brand scheme.',
				'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
			],
			examples: [
				// TODO: Add a faithful example; this export requires host-specific Relay, analytics, or entrypoint context.
			],
			keywords: ['studio', 'rovo', 'agent'],
			categories: ['studio', 'agents', 'utilities'],
		},
		{
			kind: 'type',
			name: 'GetAgentColorProps',
			description: 'Arguments accepted by `getAgentColor` and `getAgentPresenceColor`.',
			status: 'general-availability',
			import: {
				name: 'GetAgentColorProps',
				package: '@atlaskit/agent-color/get-agent-color',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Import from this explicit public entrypoint rather than a source-internal path.',
				'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
			],
			examples: [
				// TODO: Add a faithful example; this export requires host-specific Relay, analytics, or entrypoint context.
			],
			keywords: ['studio', 'rovo', 'agent'],
			categories: ['studio', 'agents', 'utilities'],
		},
		{
			kind: 'function',
			name: 'getAgentPresenceColor',
			description: 'Returns themed presence colors for an agent identity.',
			status: 'general-availability',
			import: {
				name: 'getAgentPresenceColor',
				package: '@atlaskit/agent-color/get-agent-presence-color',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Import from this explicit public entrypoint rather than a source-internal path.',
				'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
			],
			examples: [
				// TODO: Add a faithful example; this export requires host-specific Relay, analytics, or entrypoint context.
			],
			keywords: ['studio', 'rovo', 'agent'],
			categories: ['studio', 'agents', 'utilities'],
		},
		{
			kind: 'function',
			name: 'getThirdPartyAgentColor',
			description: 'Resolves a known third-party agent identity to its themed brand colors.',
			status: 'general-availability',
			import: {
				name: 'getThirdPartyAgentColor',
				package: '@atlaskit/agent-color/get-third-party-agent-color',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Import from this explicit public entrypoint rather than a source-internal path.',
				'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
			],
			examples: [
				// TODO: Add a faithful example; this export requires host-specific Relay, analytics, or entrypoint context.
			],
			keywords: ['studio', 'rovo', 'agent'],
			categories: ['studio', 'agents', 'utilities'],
		},
	],
};

export default documentation;
