import fetchMock from 'fetch-mock/cjs/client';

import {
	ActionOperationStatus,
	type ActionsServiceDiscoveryResponse,
	type AtomicActionExecuteResponse,
	type AtomicActionInterface,
} from '@atlaskit/linking-types';

export const ORS_ACTIONS_DISCOVERY_ENDPOINT = /\/gateway\/api\/object-resolver\/actions$/;
export const ORS_ACTIONS_EXECUTION_ENDPOINT = /\/gateway\/api\/object-resolver\/actions\/execute$/;

let numberOfLoads = 0;
export const mockActionsDiscovery = (overrides?: Partial<ActionsServiceDiscoveryResponse>) => {
	fetchMock.post(
		ORS_ACTIONS_DISCOVERY_ENDPOINT,
		async (): Promise<ActionsServiceDiscoveryResponse> => {
			function getMock() {
				const actions: AtomicActionInterface[] = [
					{
						integrationKey: 'jira',
						actionKey: 'atlassian:work-item:update:summary',
						fieldKey: 'summary',
						type: 'string' as const,
					},
					{
						integrationKey: 'jira',
						actionKey: 'atlassian:work-item:update:status',
						type: 'string' as const,
						fieldKey: 'status',
						inputs: {
							status: {
								type: 'string' as const,
								fetchAction: {
									actionKey: 'atlassian:work-item:get:statuses',
									integrationKey: 'jira',
									fieldKey: 'status',
									type: 'string' as const,
									inputs: {
										issueId: {
											type: 'string' as const,
										},
									},
								},
							},
						},
					},
				];
				return {
					actions,
					permissions: {
						data: new Array(20).fill(null).map((_, i) => ({
							ari: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${i * 10 + numberOfLoads}`,
							fieldKey: 'summary',
							isEditable: i % 2 === 1,
						})),
					},
					...overrides,
				};
			}

			return new Promise((resolve, reject) => {
				const mockResponse = getMock();
				resolve(mockResponse);
				numberOfLoads += 1;
			});
		},
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
