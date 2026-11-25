import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export const AGENT_INVOCATION_REVIEW_BATCHES = 'agentInvocationReviewBatches';
export const AGENT_INVOCATION_REGISTRATION_META = 'agentInvocationRegistration';
export const AGENT_INVOCATION_OWNERSHIP_TTL_MS: number = 5 * 60 * 1000;

export type AgentInvocationEditSource = 'rovo-mcp';

/** Tab-local registration emitted by the editor that receives the action classification. */
export type AgentInvocationRegistration = {
	editSource?: AgentInvocationEditSource;
	invocationId: string;
	registeredAt: number;
};

export type AgentInvocationRegistrations = ReadonlyMap<string, AgentInvocationRegistration>;

export const agentInvocationOwnershipKey: PluginKey<AgentInvocationRegistrations> =
	new PluginKey<AgentInvocationRegistrations>('agentInvocationOwnership');

export const getAgentInvocationRegistration = (
	state: EditorState,
	invocationId: string,
	now: number = Date.now(),
): AgentInvocationRegistration | undefined => {
	const registration = agentInvocationOwnershipKey.getState(state)?.get(invocationId);
	return registration && now < registration.registeredAt + AGENT_INVOCATION_OWNERSHIP_TTL_MS
		? registration
		: undefined;
};

export type AgentInvocationReviewBatch = {
	agentId?: string;
	complete: boolean;
	invocationId: string;
	ranges: Array<{ from: number; to: number }>;
};
