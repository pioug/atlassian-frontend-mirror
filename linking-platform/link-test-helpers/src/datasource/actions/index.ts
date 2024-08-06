import fetchMock from 'fetch-mock/cjs/client';

import type { ActionsServiceDiscoveryResponse } from '@atlaskit/linking-types';

export const ORS_ACTIONS_DISCOVERY_ENDPOINT = /\/gateway\/api\/object-resolver\/actions$/;

export const mockActionsDiscovery = (overrides?: Partial<ActionsServiceDiscoveryResponse>) => {
	fetchMock.post(
		ORS_ACTIONS_DISCOVERY_ENDPOINT,
		async (): Promise<ActionsServiceDiscoveryResponse> => ({
			actions: [
				{
					integrationKey: 'jira',
					actionKey: 'atlassian:issue:update:summary',
					fieldKey: 'summary',
					type: 'string',
				},
			],
			permissions: {
				data: new Array(5).fill(null).map((_, i) => ({
					ari: `ari:cloud:jira:63cecfe3-16fa-4ee1-8e8d-047cc4b18980:issue/${i}`,
					fieldKey: 'summary',
					isEditable: i % 2 === 0,
				})),
			},
			...overrides,
		}),
		{
			delay: 10,
			overwriteRoutes: true,
		},
	);
};
