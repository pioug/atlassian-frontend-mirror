import type { EndpointConfigValue } from './permission-endpoints';

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
	} else if (product === 'confluence' && permissionId === 'CREATE_SPACE') {
		return {
			type: 'graphql',
			url: '/gateway/api/graphql',
			query: `query CanCreateConfluenceSpace($cloudId: ID) {
						siteOperations (cloudId: $cloudId) {
    						application
  						}
					}`,
			variables: {
				cloudId,
			},
			transformResponse: (response: any) => {
				return {
					permissionId: 'CREATE_SPACE',
					resourceId: 'confluence',
					permitted:
						(response?.data?.siteOperations?.application as Array<string>)?.includes(
							'create_space',
						) || false,
				};
			},
		};
	}
};
