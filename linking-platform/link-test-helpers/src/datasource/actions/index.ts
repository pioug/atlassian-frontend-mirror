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
						data: new Array(20).fill(null).flatMap((_, i) => [
							{
								ari: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${i * 10 + numberOfLoads}`,
								fieldKey: 'summary',
								isEditable: i % 2 === 1,
							},
							{
								ari: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${i * 10 + numberOfLoads}`,
								fieldKey: 'status',
								isEditable: i % 2 === 1,
							},
						]),
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

export const mockActionsFetchExecution = () => {
	fetchMock.post(
		ORS_ACTIONS_EXECUTION_ENDPOINT,
		async (): Promise<AtomicActionExecuteResponse> => ({
			operationStatus: ActionOperationStatus.SUCCESS,
			errors: [],
			entities: [
				{
					id: '11',
					text: 'Backlog',
					style: {
						appearance: 'default',
					},
					transitionId: '711',
				},
				{
					id: '21',
					text: 'Selected for Development',
					style: {
						appearance: 'moved',
					},
					transitionId: '11',
				},
				{
					id: '31',
					text: 'In Progress',
					style: {
						appearance: 'inprogress',
					},
					transitionId: '2',
				},
				{
					id: '41',
					text: 'Done',
					style: {
						appearance: 'success',
					},
					transitionId: '1000',
				},
				{
					id: '51',
					text: 'Pending',
					style: {
						appearance: 'removed',
					},
					transitionId: '1001',
				},
				{
					id: '61',
					text: 'some new status',
					style: {
						appearance: 'new',
					},
					transitionId: '1002',
				},
			],
		}),
		{
			delay: 100,
			overwriteRoutes: true,
		},
	);
};
