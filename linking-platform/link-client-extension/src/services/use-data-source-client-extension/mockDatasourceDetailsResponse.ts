import { type DatasourceDetailsResponse } from '@atlaskit/linking-types';

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
