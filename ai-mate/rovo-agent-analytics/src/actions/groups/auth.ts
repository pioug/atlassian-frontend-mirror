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
			// thirdPartyConnectionConnected: https://data-portal.internal.atlassian.com/analytics/registry/112444
			// thirdPartyConnectionConnectCancelled: https://data-portal.internal.atlassian.com/analytics/registry/112445
			action: 'thirdPartyConnectionConnected' | 'thirdPartyConnectionConnectCancelled';
			attributes: VersionedAgentAttributes & ConnectionAttributes;
	  }
	| {
			actionSubject: 'rovoAgentError';
			// thirdPartyConnectionConnectFailed: https://data-portal.internal.atlassian.com/analytics/registry/112446
			// thirdPartyConnectionReadinessRefreshFailed: https://data-portal.internal.atlassian.com/analytics/registry/112447
			action: 'thirdPartyConnectionConnectFailed' | 'thirdPartyConnectionReadinessRefreshFailed';
			attributes: VersionedAgentAttributes & ConnectionAttributes & { error: { message: string } };
	  };
