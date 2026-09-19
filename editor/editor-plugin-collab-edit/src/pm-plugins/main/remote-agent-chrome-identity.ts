import type { AgentEditChromeData } from '@atlaskit/editor-common/collab-agent-edit-chrome';

import type { AgentEditRequester } from './agent-edit-requester';

type RemoteAgentChromeIdentity = Pick<
	AgentEditChromeData,
	| 'actorUserId'
	| 'invocationId'
	| 'agentId'
	| 'agentIdentityAccountId'
	| 'agentName'
	| 'agentNamedId'
	| 'agentType'
	| 'isThirdParty'
>;

/**
 * Maps collab step attribution onto the shared agent-edit chrome identity fields.
 *
 * Step attribution carries the agent's provisioned Atlassian identity account id under `agentId`
 * (see `getAgentAttribution`), so it is forwarded as `agentIdentityAccountId` rather than as the
 * agent's own source-system id.
 */
export const getRemoteAgentChromeIdentity = (
	requester: AgentEditRequester,
): RemoteAgentChromeIdentity => {
	return {
		actorUserId: requester.actorUserId,
		invocationId: requester.invocationId,
		agentId: requester.agentSourceId?.trim() || undefined,
		agentIdentityAccountId: requester.agentId?.trim() || undefined,
		agentName: requester.agentName?.trim() || undefined,
		agentNamedId: requester.agentNamedId?.trim() || undefined,
		agentType: requester.agentType.trim() || undefined,
		isThirdParty: requester.isThirdPartyAgent,
	};
};
