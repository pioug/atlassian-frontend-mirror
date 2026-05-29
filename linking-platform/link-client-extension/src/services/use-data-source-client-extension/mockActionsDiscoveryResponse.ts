import { type ActionsDiscoveryResponse } from '@atlaskit/linking-types';

export const mockActionsDiscoveryResponse: ActionsDiscoveryResponse = {
	actions: [
		{
			actionKey: 'atlassian:work-item:update:summary',
			description: 'Updates issue summary',
			fieldKey: 'summary',
			integrationKey: 'jira',
			type: 'string',
		},
		{
			integrationKey: 'jira',
			actionKey: 'atlassian:work-item:update:priority',
			fieldKey: 'priority',
			type: 'number',
			inputs: {
				priority: {
					type: 'string',
					fetchAction: {
						actionKey: 'atlassian:work-item:get:priorities',
						integrationKey: 'jira',
						fieldKey: 'priority',
						type: 'string',
						inputs: {
							issueId: {
								type: 'string',
							},
						},
					},
				},
			},
		},
		{
			integrationKey: 'jira',
			actionKey: 'atlassian:work-item:update:status',
			type: 'string',
			fieldKey: 'status',
			inputs: {
				status: {
					type: 'string',
					fetchAction: {
						actionKey: 'atlassian:work-item:get:statuses',
						integrationKey: 'jira',
						fieldKey: 'status',
						type: 'string',
						inputs: {
							issueId: {
								type: 'string',
							},
						},
					},
				},
			},
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
			{
				ari: 'ari:cloud:jira:3ac63b37-9bca-435e-9840-eff6f8739dba:issue/10025',
				fieldKey: 'status',
				isEditable: true,
			},
			{
				ari: 'ari:cloud:jira:3ac63b37-9bca-435e-9840-eff6f8739dba:issue/10030',
				fieldKey: 'status',
				isEditable: true,
			},
		],
	},
};
