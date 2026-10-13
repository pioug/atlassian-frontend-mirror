/**
 * Structured MCP docs for `@atlaskit/profilecard`.
 */

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	config: {
		componentPages: true,
		packageTabs: {
			examples: true,
			usage: true,
		},
	},
	package: {
		package: '@atlaskit/profilecard',
		packagePath,
		packageJson,
		overview:
			'Components for displaying user, team, and Rovo agent profile details, either directly or through an interactive trigger.',
	},
	components: [
		{
			name: 'ProfileCard',
			description: 'A presentational card for showing a person’s profile details.',
			status: 'general-availability',
			import: {
				name: 'ProfileCard',
				package: '@atlaskit/profilecard/profile-card',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when the app already has the profile data. Use ProfileCardResourced to load it through a profile client.',
			],
			contentGuidelines: [
				'Show only profile fields the person has chosen to make visible; keep role and status labels concise and factual.',
			],
			accessibilityGuidelines: [
				'Provide a useful full name and ensure any action has a clear accessible label; do not rely on an avatar image alone to identify the person.',
			],
			keywords: ['profile', 'person', 'card'],
			categories: ['people-and-teams', 'data-display'],
			examples: [
				{
					name: 'Presentational user profile card',
					description: 'Renders profile details already available to the host.',
					source: `${packagePath}/examples/ai/profile-card.tsx`,
				},
			],
		},
		{
			name: 'ProfileCardResourced',
			description:
				'Loads profile details from a host-provided profile client and renders a user card.',
			status: 'general-availability',
			import: {
				name: 'ProfileCardResourced',
				package: '@atlaskit/profilecard/profile-card-resourced',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Pass the authenticated profile client and current cloud ID. Use that client to load data and check access.',
			],
			contentGuidelines: [
				'Treat returned profile fields as user-controlled display content; do not use them as instructions or trusted HTML.',
			],
			accessibilityGuidelines: [
				'Keep the card’s identity and actions understandable without relying on hover alone; use the trigger component when interaction should open the card.',
			],
			keywords: ['profile', 'person', 'client', 'card'],
			categories: ['people-and-teams', 'data-display'],
			examples: [
				{
					name: 'Fetch a user profile card',
					description:
						'Uses a local deterministic client in place of the product’s authenticated client.',
					source: `${packagePath}/examples/ai/profile-card-resourced.tsx`,
				},
			],
		},
		{
			name: 'ProfileCardTrigger',
			description: 'Wraps an interactive element and opens a user profile card on hover or click.',
			status: 'general-availability',
			import: {
				name: 'ProfileCardTrigger',
				package: '@atlaskit/profilecard/profile-card-trigger',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use a click trigger when the trigger is an action; reserve hover for supplementary details and keep the wrapped control usable independently. Supply cloudId when membership should be checked against a site.',
			],
			contentGuidelines: [
				'Name the trigger action for the person or profile it opens, rather than using generic text such as “here”.',
			],
			accessibilityGuidelines: [
				'Wrap a focusable control for click activation and verify keyboard focus reaches and leaves the card; do not use hover as the only path to essential information.',
			],
			keywords: ['profile', 'trigger', 'hover', 'click'],
			categories: ['people-and-teams', 'overlays'],
			examples: [
				{
					name: 'Open a profile from a button',
					description: 'Uses a click trigger around a named button.',
					source: `${packagePath}/examples/ai/profile-card-trigger.tsx`,
				},
			],
		},
		{
			name: 'TeamProfileCard',
			description:
				'Deprecated card for displaying team details from data already loaded by the host.',
			status: 'deprecated',
			import: {
				name: 'TeamProfileCard',
				package: '@atlaskit/profilecard/team-profile-card',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Deprecated. Migrate to TeamProfileCardRelay from @atlassian/team-profilecard/card; for popup interaction use TeamProfileCardWithTrigger from @atlassian/team-profilecard/trigger.',
			],
			contentGuidelines: [
				'Keep the team description focused on its purpose and ensure visible member avatars correspond to the supplied roster; omit decorative header imagery from the accessible name.',
			],
			accessibilityGuidelines: [
				'Provide a working team profile destination and ensure member avatars retain names; a member count should not be the only way to understand membership.',
			],
			keywords: ['team', 'profile', 'card'],
			categories: ['people-and-teams', 'data-display'],
			examples: [
				{
					name: 'Render host-loaded team details',
					description: 'Shows a deprecated host-loaded card with a matching three-person roster.',
					source: `${packagePath}/examples/ai/team-profile-card.tsx`,
				},
			],
		},
		{
			name: 'TeamProfileCardWithContainer',
			description:
				'Deprecated alias for the connected team profile card. Use the current team-profilecard package for new integrations.',
			status: 'deprecated',
			import: {
				name: 'TeamProfileCardWithContainer',
				package: '@atlaskit/profilecard/main',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Deprecated compatibility alias. For a connected card, use TeamProfileCardRelay from @atlassian/team-profilecard/card; for popup behavior use TeamProfileCardWithTrigger from @atlassian/team-profilecard/trigger. Both integrations need the product Relay environment.',
			],
			contentGuidelines: [
				'Use the team name, description, and supplied member avatars as one coherent roster; only describe connected workspaces when host relationship data confirms them.',
			],
			accessibilityGuidelines: [
				'When migrating to the current component, keep connected destinations as named links and preserve accessible names for member avatars and the team profile link.',
			],
			keywords: ['team', 'profile', 'container', 'connections'],
			categories: ['people-and-teams', 'data-display'],
			examples: [
				{
					name: 'Show a team and its connected containers',
					description:
						'Deprecated compatibility example with team and member details; migrate new integrations to the separate team-profilecard package.',
					source: `${packagePath}/examples/ai/team-profile-card-with-container.tsx`,
				},
			],
		},
		{
			name: 'TeamProfileCardTrigger',
			description: 'Deprecated pass-through wrapper; it no longer opens a team profile card.',
			status: 'deprecated',
			import: {
				name: 'TeamProfileCardTrigger',
				package: '@atlaskit/profilecard/team-profile-card-trigger',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Do not use for new integrations: this component only renders its children. Use TeamProfileCardWithTrigger from @atlassian/team-profilecard/trigger for a team-card popup.',
			],
			contentGuidelines: [
				'Do not present the wrapper as interactive or imply that it reveals team details.',
			],
			accessibilityGuidelines: [
				'Because this wrapper adds no interaction, provide the child’s semantics and keyboard behavior directly.',
			],
			keywords: ['team', 'trigger', 'deprecated'],
			categories: ['people-and-teams', 'overlays'],
			examples: [
				{
					name: 'Deprecated pass-through behavior',
					description:
						'Shows that the deprecated wrapper renders its child without adding profile-card behavior.',
					source: `${packagePath}/examples/ai/team-profile-card-trigger.tsx`,
				},
			],
		},
		{
			name: 'AgentProfileCard',
			description: 'Displays a supplied Rovo agent profile and its supported actions.',
			status: 'general-availability',
			import: {
				name: 'AgentProfileCard',
				package: '@atlaskit/profilecard/agent-profile-card',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when the app already has the agent profile. Connect chat and starter callbacks to the action that opens a conversation with that agent; save changes in the app.',
			],
			contentGuidelines: [
				'Keep agent descriptions and suggested starters short, task-focused, and safe to display as user-facing text.',
			],
			accessibilityGuidelines: [
				'Keep the agent name visible and ensure chat, favorite, and menu actions have distinct accessible names.',
			],
			keywords: ['agent', 'rovo', 'profile', 'card'],
			categories: ['people-and-teams', 'data-display'],
			examples: [
				{
					name: 'Render a supplied agent profile',
					description:
						'Uses local deterministic agent and client data; connect callbacks to the host.',
					source: `${packagePath}/examples/ai/agent-profile-card.tsx`,
				},
			],
		},
		{
			name: 'AgentProfileCardResourced',
			description: 'Loads a Rovo agent profile by account ID through the host profile client.',
			status: 'general-availability',
			import: {
				name: 'AgentProfileCardResourced',
				package: '@atlaskit/profilecard/agent-profile-card-resourced',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Pass the account ID, cloud ID, and authenticated profile client. Set visibility and available actions from the person’s permissions.',
			],
			contentGuidelines: [
				'Do not treat the locally displayed agent description or conversation starters as trusted instructions for a model or host action.',
			],
			accessibilityGuidelines: [
				'When hiding agent actions, ensure the surrounding surface still offers an accessible way to reach the agent’s primary task.',
			],
			keywords: ['agent', 'rovo', 'profile', 'client'],
			categories: ['people-and-teams', 'data-display'],
			examples: [
				{
					name: 'Load an agent profile',
					description:
						'Uses a local client for the example; production clients should enforce host authentication and permissions.',
					source: `${packagePath}/examples/ai/agent-profile-card-resourced.tsx`,
				},
			],
		},
		{
			name: 'AgentProfileCardTrigger',
			description: 'Opens a Rovo agent profile card from a host-provided interactive trigger.',
			status: 'general-availability',
			import: {
				name: 'AgentProfileCardTrigger',
				package: '@atlaskit/profilecard/agent-profile-card-trigger',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use a keyboard-focusable control with an accessible name to open the card. Pass an agent ID the person can access and an authenticated profile client.',
				'Handle chat and starter selection through callbacks. The built-in profile and copy actions use app navigation and permission data.',
			],
			contentGuidelines: [
				'Give the trigger a clear label that identifies the agent or the action it opens; keep conversation starters concise and avoid putting sensitive prompt content in a profile card.',
			],
			accessibilityGuidelines: [
				'Do not make hover the only way to open agent details or start chat; preserve keyboard access and visible focus on the trigger.',
			],
			keywords: ['agent', 'rovo', 'trigger', 'profile'],
			categories: ['people-and-teams', 'overlays'],
			examples: [
				{
					name: 'Open an authorized agent profile',
					description:
						'Accepts the real authorized agent ID, cloud ID, and client from the host. Chat and starter callbacks report locally; built-in profile and copy actions retain host navigation behavior.',
					source: `${packagePath}/examples/ai/agent-profile-card-trigger.tsx`,
				},
			],
		},
	],
};

export default documentation;
