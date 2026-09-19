/** Transaction metadata used to attribute an editor change to an agent. */
export const AGENT_ATTRIBUTION_META = 'agentAttribution';

export type AgentAttributionTransactionMeta = {
	agentId?: string;
	/** Display name, so collaborators can label the agent without an async lookup. */
	agentName?: string;
	/** External config reference (named_id), used for OOTB agent avatar and brand colour lookup. */
	agentNamedId?: string;
	/** The agent's own id, used as the primary avatar-resolution key. */
	agentSourceId?: string;
	agentType: string;
	/** True for a Forge / third-party / remote agent, derived from the agent record's `creator_type`. */
	isThirdParty?: boolean;
};
