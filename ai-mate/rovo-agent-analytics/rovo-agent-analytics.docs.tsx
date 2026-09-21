import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;
const packageName = '@atlaskit/rovo-agent-analytics';

// TODO: Add a vetted public-entrypoint example when one is available.
const documentation: StructuredContentSource = {
	package: {
		package: packageName,
		packagePath,
		packageJson,
		overview: 'Typed analytics hooks and create-flow event contracts for Rovo Agent experiences.',
	},
	hooks: [
		{
			name: 'useRovoAgentActionAnalytics',
			description:
				'Creates a typed Rovo Agent event tracker enriched with analytics context and common attributes.',
			status: 'general-availability',
			import: {
				name: 'useRovoAgentActionAnalytics',
				package: `${packageName}/actions`,
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use the actions entry point in interactive surfaces; the package root exposes a no-op compatibility implementation.',
				'Keep commonAttributes stable for the lifetime of the hook instance.',
			],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'agents', 'analytics', 'tracking hook'],
			categories: ['rovo', 'agents', 'analytics', 'hooks'],
		},
		{
			name: 'useRovoAgentCreateAnalytics',
			description:
				'Tracks a correlated Rovo Agent creation session and manages its create-session identifier.',
			status: 'general-availability',
			import: {
				name: 'useRovoAgentCreateAnalytics',
				package: `${packageName}/create`,
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Call trackCreateSessionStart at intent time, then reuse the returned session methods for the remaining funnel.',
			],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'agents', 'analytics', 'creation session'],
			categories: ['rovo', 'agents', 'analytics', 'hooks'],
		},
	],
	utilities: [
		{
			kind: 'type',
			name: 'AgentPublishAnalyticsAttributes',
			description:
				'Agent composition, version, knowledge, and source attributes recorded when an agent is published.',
			status: 'general-availability',
			import: {
				name: 'AgentPublishAnalyticsAttributes',
				package: `${packageName}/actions/groups/create-flow`,
				type: 'named',
				packagePath,
				packageJson,
			},
			definition:
				"{ agentId?: string; agentKnowledge: Record<string, { enabled: boolean; filters: string }> | null; agentMcpServerCount: number; agentSkillCount: number; agentSkillsList: string; agentToolCount: number; agentToolsList: string; agentType: 'AgentStudioAssistant'; agentVersionNumber: number | null; isFirstPublish: boolean | null; scenarioList: ReadonlyArray<{ knowledge: string[] | null | undefined; knowledgeType: 'custom' | 'disabled' | 'all'; mcpServerCount: number; skillCount: number; skillsList: string; toolCount: number; toolsList: string }>; source?: string }",
			usageGuidelines: [
				'Populate counts and lists from the same resolved agent version to keep funnel analysis consistent.',
			],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'agents', 'analytics', 'publish'],
			categories: ['rovo', 'agents', 'analytics', 'types'],
		},
		{
			kind: 'type',
			name: 'AgentPlanAnalyticsAttributes',
			description:
				'Agent publish attributes used for generated-plan events before an agent record and version exist.',
			status: 'general-availability',
			import: {
				name: 'AgentPlanAnalyticsAttributes',
				package: `${packageName}/actions/groups/create-flow`,
				type: 'named',
				packagePath,
				packageJson,
			},
			definition:
				'Agent publish composition attributes excluding agentId, agentVersionNumber, and isFirstPublish',
			usageGuidelines: [
				'Use for plan-generated and plan-viewed events before version-specific publish metadata is available.',
			],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'agents', 'analytics', 'plan'],
			categories: ['rovo', 'agents', 'analytics', 'types'],
		},
		{
			kind: 'type',
			name: 'CreateFlowEventPayload',
			description:
				'Discriminated payload union for every supported Rovo Agent creation-funnel event.',
			status: 'general-availability',
			import: {
				name: 'CreateFlowEventPayload',
				package: `${packageName}/actions/groups/create-flow`,
				type: 'named',
				packagePath,
				packageJson,
			},
			definition:
				"{ actionSubject: 'rovoAgent'; action: 'createFlowStart' | 'createFlowSkipNL' | 'createFlowReviewNL' | 'createFlowActivate' | 'createFlowRestart' | 'createFlowError' | 'createLandInStudio' | 'createDiscard' | 'saDraft' | 'createLandInConfigure' | 'createSubpathRedirect' | 'createLandInAgentLandingWithSA' | 'createAgentRecord' | 'published' | 'createFlowPlanGenerated' | 'createFlowPlanViewed'; attributes: Record<string, unknown> } | { actionSubject: 'rovoAgentPlan'; action: 'success'; attributes: Record<string, unknown> }",
			usageGuidelines: [
				'Pass through the typed tracker so each action receives its required version or plan attributes.',
			],
			examples: [
				// TODO: Add AI-first example(s); see `afm-platform-documentation` skill
			],
			keywords: ['rovo', 'agents', 'analytics', 'create flow'],
			categories: ['rovo', 'agents', 'analytics', 'types'],
		},
	],
};

export default documentation;
