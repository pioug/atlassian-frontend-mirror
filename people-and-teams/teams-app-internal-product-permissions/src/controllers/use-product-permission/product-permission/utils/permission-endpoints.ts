import { type ProductPermissionsResponse } from '../types';

export type EndpointConfigValue =
	| {
			type: 'rest' | 'graphql';
			url: string;
			query: string;
			variables?: Record<string, any>;
			transformResponse: (response: any) => ProductPermissionsResponse;
	  }
	| {
			type: 'default';
			payload: {
				product: string;
				permissionId: string;
			};
	  }
	| undefined;

export const getEndpoint = (
	product: string,
	permissionId: string,
	cloudId: string,
): EndpointConfigValue => {
	if (product === 'jira' && permissionId === 'CREATE_PROJECT') {
		return {
			type: 'graphql',
			url: '/gateway/api/graphql',
			query: `query CanCreateProject($cloudId: ID!) {
						jira {
							canPerform  (cloudId: $cloudId, type: CREATE_PROJECT) @optIn(to: "JiraAction")
						}
					}`,
			variables: {
				cloudId,
			},
			transformResponse: (response: any) => {
				return {
					permissionId: 'CREATE_PROJECT',
					resourceId: 'jira',
					permitted: response?.data?.jira?.canPerform || false,
				};
			},
		};
	} else if (product === 'confluence' && permissionId === 'create/space') {
		return {
			type: 'default',
			payload: {
				product: 'confluence',
				permissionId: 'create/space',
			},
		};
	}
};
