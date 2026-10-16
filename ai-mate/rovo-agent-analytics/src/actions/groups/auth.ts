import type { VersionedAgentAttributes } from '../../common/types';

type ConnectionAttributes = {
	agentMode: string | null;
	agentVersionType: string | null;
	mcpServerAri: string | null;
	productName: string;
	wasAuthenticated: boolean;
};

export type AuthEventPayload =
	| {
			actionSubject: 'rovoAgent';
			action: 'thirdPartyConnectionConnected' | 'thirdPartyConnectionConnectCancelled';
			attributes: VersionedAgentAttributes & ConnectionAttributes;
	  }
	| {
			actionSubject: 'rovoAgentError';
			action: 'thirdPartyConnectionConnectFailed' | 'thirdPartyConnectionReadinessRefreshFailed';
			attributes: VersionedAgentAttributes & ConnectionAttributes & { error: { message: string } };
	  };
