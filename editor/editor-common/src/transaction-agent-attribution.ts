/** Transaction metadata used to attribute an editor change to an agent. */
export const AGENT_ATTRIBUTION_META = 'agentAttribution';

export type AgentAttributionTransactionMeta = {
	agentId?: string;
	agentType: string;
};
