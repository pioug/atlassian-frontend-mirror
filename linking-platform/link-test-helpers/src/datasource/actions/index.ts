import { type MockRequest } from 'fetch-mock';
import fetchMock from 'fetch-mock/cjs/client';

import {
	ActionOperationStatus,
	type ActionsServiceDiscoveryResponse,
	type AtomicActionExecuteRequest,
	type AtomicActionExecuteResponse,
	type AtomicActionInterface,
	type Icon,
} from '@atlaskit/linking-types';

import { blocker, high, low, major, medium, trivial } from '../../images';

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
					{
						fieldKey: 'priority',
						integrationKey: 'jira',
						actionKey: 'atlassian:work-item:update:priority',
						type: 'string' as const,
						inputs: {
							priority: {
								type: 'string' as const,
								fetchAction: {
									actionKey: 'atlassian:work-item:get:priorities',
									integrationKey: 'jira',
									fieldKey: 'priority',
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
					{
						integrationKey: 'jira',
						actionKey: 'atlassian:work-item:update:assignee',
						type: 'string' as const,
						fieldKey: 'assignee',
						inputs: {
							assignee: {
								type: 'string' as const,
								fetchAction: {
									actionKey: 'atlassian:work-item:get:assignees',
									integrationKey: 'jira',
									fieldKey: 'assignee',
									type: 'string' as const,
									inputs: {
										query: {
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
							{
								ari: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${i * 10 + numberOfLoads}`,
								fieldKey: 'priority',
								isEditable: i % 2 === 1,
							},
							{
								ari: `ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/${i * 10 + numberOfLoads}`,
								fieldKey: 'assignee',
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
		async (url: string, request: MockRequest): Promise<AtomicActionExecuteResponse> => {
			const body = JSON.parse(request.body as string) as AtomicActionExecuteRequest;
			if (
				body.integrationKey === 'jira' &&
				body.actionKey === 'atlassian:work-item:get:assignees'
			) {
				return {
					operationStatus: ActionOperationStatus.SUCCESS,
					errors: [],
					entities: cannedUsers.filter((user) =>
						user.displayName
							.toLowerCase()
							.includes(((body.parameters.inputs.query as string) || '').toLowerCase()),
					),
				};
			}
			if (body.integrationKey === 'jira' && body.actionKey === 'atlassian:work-item:get:statuses') {
				return {
					operationStatus: ActionOperationStatus.SUCCESS,
					errors: [],
					entities: cannedStatuses,
				};
			}
			if (body?.actionKey === 'atlassian:work-item:get:priorities') {
				return {
					operationStatus: ActionOperationStatus.SUCCESS,
					errors: [],
					entities: cannedPriorities,
				};
			}
			return {
				operationStatus: ActionOperationStatus.SUCCESS,
				errors: [],
			};
		},
		{
			delay: 100,
			overwriteRoutes: true,
		},
	);
};

export const cannedStatuses = [
	{
		id: '11',
		text: 'Backlog',
		style: {
			appearance: 'default',
		},
	},
	{
		id: '21',
		text: 'Selected for Development',
		style: {
			appearance: 'moved',
		},
	},
	{
		id: '31',
		text: 'In Progress',
		style: {
			appearance: 'inprogress',
		},
	},
	{
		id: '41',
		text: 'Done',
		style: {
			appearance: 'success',
		},
	},
	{
		id: '51',
		text: 'Pending',
		style: {
			appearance: 'removed',
		},
	},
	{
		id: '61',
		text: 'some new status',
		style: {
			appearance: 'new',
		},
	},
];

export const cannedUsers = [
	{
		atlassianUserId: '5b45501cfc9d8158972cdd2c',
		displayName: 'Jake Coppinger',
		avatarSource:
			'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5b45501cfc9d8158972cdd2c/18e39bf4-66b3-448e-94e7-6d9427f05fb1/48',
		url: 'https://product-fabric.atlassian.net/jira/people/5b45501cfc9d8158972cdd2c',
	},
	{
		atlassianUserId: '70121:3238cd5c-e4d3-43b1-a125-211cc2811c25',
		displayName: 'Andres Hernandez',
		avatarSource:
			'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/70121:3238cd5c-e4d3-43b1-a125-211cc2811c25/47714102-d792-4d19-b1c0-c28ea44ad2bf/48',
		url: 'https://product-fabric.atlassian.net/jira/people/70121:3238cd5c-e4d3-43b1-a125-211cc2811c25',
	},
	{
		atlassianUserId: '712020:b0ba73bb-ef99-4329-b35d-23e35fffdf5b',
		displayName: 'Zoe Stevens',
		avatarSource:
			'https://secure.gravatar.com/avatar/91afe209315b97fde1616cd5484ae0fd?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FZS-2.png',
		url: 'https://product-fabric.atlassian.net/jira/people/712020:b0ba73bb-ef99-4329-b35d-23e35fffdf5b',
	},
	{
		atlassianUserId: '712020:12f32ca4-7684-4e6d-b3a7-078ae26aa5c8',
		displayName: 'Jim Zhai',
		avatarSource:
			'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/712020:12f32ca4-7684-4e6d-b3a7-078ae26aa5c8/54753443-83e8-4fc1-8622-307d06f11620/48',
		url: 'https://product-fabric.atlassian.net/jira/people/712020:12f32ca4-7684-4e6d-b3a7-078ae26aa5c8',
	},
];

const cannedPriorities: Icon[] = [
	{
		source: blocker,
		label: 'Blocker',
		text: 'Blocker',
		id: '6',
	},
	{
		source: major,
		label: 'Major',
		text: 'Major',
		id: '5',
	},
	{
		source: high,
		label: 'High',
		text: 'High',
		id: '4',
	},
	{
		source: medium,
		text: 'High',
		label: 'Medium',
		id: '3',
	},
	{
		source: low,
		label: 'Low',
		text: 'Low',
		id: '2',
	},
	{
		source: trivial,
		label: 'Trivial',
		text: 'Trivial',
		id: '1',
	},
];
