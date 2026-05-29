import { type DatasourceDataResponse } from '@atlaskit/linking-types';

export const mockDatasourceDataNoActionsResponse: DatasourceDataResponse = {
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
