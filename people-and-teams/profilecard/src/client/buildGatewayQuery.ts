/// <reference types="node" />
// for typing `process`

import { GATEWAY_QUERY_V2 } from './gatewayQueryV2';
import { idToAriSafe } from './idToAriSafe';

type TeamQueryVariables = { teamId: string; siteId?: string };

export const buildGatewayQuery = ({
	teamId,
	siteId,
}: TeamQueryVariables): {
	query: string;
	variables: {
		teamId: string;
		siteId: string;
	};
} => ({
	query: GATEWAY_QUERY_V2,
	variables: {
		teamId: idToAriSafe(teamId),
		siteId: siteId || 'None',
	},
});
