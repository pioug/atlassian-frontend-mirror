import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { pluginKey } from './plugin-key';

type AgentRemoteStep = {
	agentId?: unknown;
	agentType: string;
	userId?: unknown;
};

export interface AgentEditRequester {
	actorUserId?: string;
	agentId?: string;
	agentType: string;
	isLocalUserRequester: boolean;
}

const isAgentRemoteStep = (step: unknown): step is AgentRemoteStep =>
	typeof step === 'object' &&
	step !== null &&
	typeof (step as Partial<AgentRemoteStep>).agentType === 'string';

export const getAgentEditRequester = (
	json: unknown[],
	view: EditorView,
): AgentEditRequester | null => {
	const agentStep = json.find(isAgentRemoteStep);
	if (!agentStep) {
		return null;
	}

	const actorUserId = typeof agentStep.userId === 'string' ? agentStep.userId : undefined;
	const collabPluginState = pluginKey.getState(view.state);
	const localSessionId = collabPluginState?.sessionId;
	const localUserId = localSessionId
		? collabPluginState?.activeParticipants?.get(localSessionId)?.userId
		: undefined;

	return {
		agentId: typeof agentStep.agentId === 'string' ? agentStep.agentId : undefined,
		agentType: agentStep.agentType,
		actorUserId,
		isLocalUserRequester:
			actorUserId !== undefined && localUserId !== undefined && actorUserId === localUserId,
	};
};
