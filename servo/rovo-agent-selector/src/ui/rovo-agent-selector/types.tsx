import type { rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference$key } from './__generated__/rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference.graphql';

export type AgentOption = {
	label: string;
	value: string;
	externalConfigReference?: string;
	identityAccountId?: string;
	isForgeAgent: boolean;
};

export interface RovoAgentSelectorProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Override the feature gate check. When provided, this value will be used
	 * instead of checking the feature gate. Useful for testing and development.
	 */
	isFeatureEnabled?: boolean;

	/**
	 * GraphQL fragment reference for fetching agents
	 */
	fragmentReference: rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference$key;

	/**
	 * Cloud ID for refetching agents
	 */
	cloudId: string;

	/**
	 * Currently selected agent (optional)
	 */
	selectedAgent?: AgentOption | null;

	/**
	 * Callback when an agent is selected
	 */
	onChange?: (agent: AgentOption | null) => void;

	/**
	 * Whether the selector is in a loading state
	 */
	isLoading?: boolean;
}
