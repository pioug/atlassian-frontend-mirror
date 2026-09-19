import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { pluginKey } from './plugin-key';

type AgentRemoteStep = {
	agentId?: unknown;
	agentName?: unknown;
	agentNamedId?: unknown;
	agentSourceId?: unknown;
	agentType: string;
	invocationId?: unknown;
	isThirdPartyAgent?: unknown;
	userId?: unknown;
};

export interface AgentEditRequester {
	actorUserId?: string;
	agentId?: string;
	agentName?: string;
	agentNamedId?: string;
	agentSourceId?: string;
	agentType: string;
	invocationId?: string;
	isLocalUserRequester: boolean;
	isThirdPartyAgent?: boolean;
}

const isAgentRemoteStep = (step: unknown): step is AgentRemoteStep =>
	typeof step === 'object' &&
	step !== null &&
	typeof (step as Partial<AgentRemoteStep>).agentType === 'string';

const asString = (value: unknown): string | undefined =>
	typeof value === 'string' ? value : undefined;

export const isStepFromAgentEdit = (step: unknown, requester: AgentEditRequester): boolean => {
	if (!isAgentRemoteStep(step)) {
		return false;
	}
	return (
		step.agentType === requester.agentType &&
		asString(step.agentId) === requester.agentId &&
		asString(step.agentSourceId) === requester.agentSourceId &&
		asString(step.agentNamedId) === requester.agentNamedId &&
		asString(step.userId) === requester.actorUserId &&
		asString(step.invocationId) === requester.invocationId
	);
};

export const getAgentEditRequester = (
	json: unknown[],
	view: EditorView,
): AgentEditRequester | null => {
	const agentStep = json.find(isAgentRemoteStep);
	if (!agentStep) {
		return null;
	}

	const actorUserId = asString(agentStep.userId);
	const collabPluginState = pluginKey.getState(view.state);
	const localSessionId = collabPluginState?.sessionId;
	const localUserId = localSessionId
		? collabPluginState?.activeParticipants?.get(localSessionId)?.userId
		: undefined;

	return {
		agentId: asString(agentStep.agentId),
		agentName: asString(agentStep.agentName),
		agentNamedId: asString(agentStep.agentNamedId),
		agentSourceId: asString(agentStep.agentSourceId),
		agentType: agentStep.agentType,
		actorUserId,
		invocationId: asString(agentStep.invocationId),
		isThirdPartyAgent:
			typeof agentStep.isThirdPartyAgent === 'boolean' ? agentStep.isThirdPartyAgent : undefined,
		isLocalUserRequester:
			actorUserId !== undefined && localUserId !== undefined && actorUserId === localUserId,
	};
};
