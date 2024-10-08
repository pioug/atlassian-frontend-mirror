import fetchMock from 'fetch-mock/cjs/client';

import {
	ActionOperationStatus,
	type ActionsServiceDiscoveryResponse,
	type AtomicActionExecuteResponse,
} from '@atlaskit/linking-types';

export const ORS_ACTIONS_DISCOVERY_ENDPOINT = /\/gateway\/api\/object-resolver\/actions$/;
export const ORS_ACTIONS_EXECUTION_ENDPOINT = /\/gateway\/api\/object-resolver\/actions\/execute$/;

export const mockActionsDiscovery = (overrides?: Partial<ActionsServiceDiscoveryResponse>) => {
	fetchMock.post(
		ORS_ACTIONS_DISCOVERY_ENDPOINT,
		async (): Promise<ActionsServiceDiscoveryResponse> => ({
			actions: [
				{
					integrationKey: 'jira',
					actionKey: 'atlassian:work-item:update:summary',
					fieldKey: 'summary',
					type: 'string',
				},
			],
			permissions: {
				data: new Array(10).fill(null).map((_, i) => ({
					ari: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${i * 10}`,
					fieldKey: 'summary',
					isEditable: i % 2 === 1,
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

export const mockActionsExecution = () => {
	fetchMock.post(
		ORS_ACTIONS_EXECUTION_ENDPOINT,
		async (): Promise<AtomicActionExecuteResponse> => ({
			operationStatus: ActionOperationStatus.SUCCESS,
			errors: [],
		}),
		{
			delay: 10,
			overwriteRoutes: true,
		},
	);
};
