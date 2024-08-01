import {
	ActionOperationStatus,
	type ActionsDiscoveryResponse,
	type AtomicActionExecuteResponse,
	type DatasourceDataResponse,
	type DatasourceDetailsResponse,
} from '@atlaskit/linking-types';

export const mockDatasourceDataResponse: DatasourceDataResponse = {
	meta: {
		key: 'jira-object-provider',
		access: 'granted',
		auth: [],
		definitionId: 'object-resolver-service',
		product: 'jira',
		visibility: 'restricted',
		extensionKey: 'jira-object-provider',
		providerName: 'Jira',
		destinationObjectTypes: ['issue'],
	},
	data: {
		totalCount: 1234,
		items: [
			{
				ari: { data: 'ari:cloud:jira:3ac63b37-9bca-435e-9840-eff6f8739dba:issue/10025' },
				id: { data: 'EDM-12' },
				description: { data: 'Design datasource feature' },
				createdAt: { data: '2023-01-22T01:30:00.000-05:00' },
				assigned: {
					data: { displayName: 'Sasha' },
				},
				status: {
					data: {
						text: 'In Progress',
						style: {
							appearance: 'inprogress',
						},
					},
				},
			},
			{
				ari: { data: 'ari:cloud:jira:3ac63b37-9bca-435e-9840-eff6f8739dba:issue/10026' },
				id: { data: 'EDM-14' },
				description: { data: 'Implement datasource feature' },
				createdAt: { data: '2023-03-01T01:30:00.000-05:00' },
				assigned: {
					data: {
						displayName: 'Hana',
					},
				},
				status: {
					data: {
						text: 'To Do',
						style: {
							appearance: 'new',
						},
					},
				},
			},
			{
				ari: { data: 'ari:cloud:jira:3ac63b37-9bca-435e-9840-eff6f8739dba:issue/10027' },
				id: { data: 'EDM-15' },
				description: { data: 'Add Jira Provider' },
				createdAt: { data: '2023-03-31T01:30:00.000-05:00' },
				assigned: {
					data: {
						displayName: 'Princey',
					},
				},
				status: {
					data: {
						text: 'To Do',
					},
				},
			},
			{
				ari: { data: 'ari:cloud:jira:3ac63b37-9bca-435e-9840-eff6f8739dba:issue/10028' },
				id: { data: 'EDM-16' },
				description: { data: 'Plan team party' },
				createdAt: { data: '2023-05-01T01:30:00.000-05:00' },
				assigned: {
					data: {
						displayName: 'Nidhin',
					},
				},
				status: {
					data: {
						text: 'Done',
						style: {
							appearance: 'success',
						},
					},
				},
			},
		],
		nextPageCursor: 'c3RhcnRBdD01',
	},
};

export const mockDatasourceDetailsResponse: DatasourceDetailsResponse = {
	meta: {
		key: 'jira-object-provider',
		access: 'granted',
		auth: [],
		definitionId: 'object-resolver-service',
		product: 'jira',
		visibility: 'restricted',
		extensionKey: 'jira-object-provider',
		providerName: 'Jira',
		destinationObjectTypes: ['issue'],
	},
	data: {
		ari: 'ari:cloud:linking-platform:datasource/12e74246-a3f1-46c1-9fd9-8d952aa9f12f',
		id: '12e74246-a3f1-46c1-9fd9-8d952aa9f12f',
		name: 'JQL Datasource',
		description: 'Fetches Issues using JQL',
		parameters: [
			{
				key: 'cloudId',
				type: 'string',
				description: 'Cloud Id',
			},
			{
				key: 'jql',
				type: 'string',
				description: 'JQL query to retrieve list of issues',
			},
		],
		schema: {
			properties: [
				{
					key: 'id',
					title: '',
					type: 'string',
				},
				{
					key: 'issue',
					title: 'Key',
					type: 'link',
				},
				{
					key: 'type',
					type: 'icon',
					title: 'Type',
				},
				{
					key: 'summary',
					title: 'Summary',
					type: 'link',
				},
				{
					key: 'assignee',
					title: 'Assignee',
					type: 'user',
				},
				{
					key: 'priority',
					title: 'P',
					type: 'icon',
				},
				{
					key: 'labels',
					title: 'Labels',
					type: 'tag',
					isList: true,
				},
				{
					key: 'status',
					title: 'Status',
					type: 'status',
				},
				{
					key: 'created',
					title: 'Created',
					type: 'string',
				},
				{
					key: 'due',
					title: 'Due Date',
					type: 'string',
				},
			],
			defaultProperties: [
				'type',
				'issue',
				'summary',
				'assignee',
				'priority',
				'labels',
				'status',
				'created',
			],
		},
	},
};

export const mockDatasourceDataResponseWithSchema: DatasourceDataResponse = {
	...mockDatasourceDataResponse,
	data: {
		...mockDatasourceDataResponse.data,
		schema: {
			properties: mockDatasourceDetailsResponse.data.schema.properties,
		},
	},
};

export const mockActionsDiscoveryResponse: ActionsDiscoveryResponse = {
	actions: [
		{
			actionKey: 'atlassian:issue:update:summary',
			description: 'Updates issue summary',
			fieldKey: 'summary',
			integrationKey: 'jira',
			type: 'string',
		},
	],
	permissions: {
		data: [
			{
				ari: 'ari:cloud:jira:3ac63b37-9bca-435e-9840-eff6f8739dba:issue/10025',
				fieldKey: 'summary',
				isEditable: true,
			},
			{
				ari: 'ari:cloud:jira:3ac63b37-9bca-435e-9840-eff6f8739dba:issue/10030',
				fieldKey: 'summary',
				isEditable: true,
			},
		],
	},
};

export const mockExecuteActionResponse: AtomicActionExecuteResponse = {
	operationStatus: ActionOperationStatus.SUCCESS,
	errors: [],
};

export const mockExecuteActionResponseFailure: AtomicActionExecuteResponse = {
	operationStatus: ActionOperationStatus.FAILURE,
	errors: [
		{
			message: 'summary: You must specify a summary of the issue.',
			code: 400,
		},
	],
};
