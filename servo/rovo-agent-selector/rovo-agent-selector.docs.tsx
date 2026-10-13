import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const packagePath = __dirname;
const packageJson = require('./package.json');

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'RovoAgentSelector',
			description:
				'A searchable selector for choosing an editable Rovo agent in a tenant-scoped settings or assistance flow. The host supplies Relay data and owns the selected value.',
			status: 'general-availability',
			import: {
				name: 'RovoAgentSelector',
				package: '@atlaskit/rovo-agent-selector',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use to choose an editable agent for a site, such as the agent that handles a support flow.',
				'Keep the selected agent in form state and explain how it affects the next step before the person saves.',
				'Use the authenticated Relay environment and fragment reference for the same cloud ID. Show agents the current account is allowed to use.',
				'The component renders nothing when its feature flag is disabled. It also needs authenticated Relay data for the site to show agents.',
			],
			contentGuidelines: [
				'Use clear agent names in the host data. The selector’s placeholder is “Select a Rovo agent” and its empty result message is “No agents found”.',
			],
			accessibilityGuidelines: [
				'Keep the visible “Select agent” label with the searchable control. Do not remove or visually hide the label when placing the selector in a form.',
				'If the control is temporarily disabled, provide nearby text explaining what must happen before agent selection is available.',
			],
			examples: [
				{
					name: 'Tenant-scoped agent selection',
					description:
						'Connects the selector to host Relay data and keeps the selected authorized agent in local form state.',
					source: `${packagePath}/examples/ai/tenant-agent-selection.tsx`,
				},
			],
			keywords: ['Rovo', 'agent selector', 'tenant settings', 'editable agents'],
			categories: ['interaction'],
		},
	],
};

export default documentation;
