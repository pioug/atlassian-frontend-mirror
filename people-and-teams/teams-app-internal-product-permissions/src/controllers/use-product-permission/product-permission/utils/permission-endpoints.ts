import { type ProductPermissionsResponse } from '../types';

import {
	getProductPermissionRequestBody,
	makeGraphqlRequest,
	makeRestApiRequest,
} from './requests';

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

const fetchPermissionFromDefaultEndpoint = async ({
	cloudId,
	userId,
	productPermissions,
}: {
	cloudId: string;
	userId: string;
	productPermissions: {
		product: string;
		permissionId: string;
	}[];
}) => {
	const response: Response = await makeRestApiRequest({
		url: '/gateway/api/permissions/bulk/permitted',
		body: getProductPermissionRequestBody(cloudId, userId, productPermissions),
	});

	if (!response.ok) {
		const errorBody = await response.json();
		const errorMessage =
			errorBody.message || errorBody.error || `HTTP error! status: ${response.status}`;
		throw new Error(`Failed to fetch product permissions with error ${errorMessage}`);
	}
	const bulkPermissions = await response.json();
	return bulkPermissions;
};

const fetchPermissionFromRestApi = async (endpoint: EndpointConfigValue) => {
	if (!endpoint || endpoint.type !== 'rest') {
		return;
	}
	const res = await makeRestApiRequest({ url: endpoint.url });
	const responseData = await res.json();
	return endpoint.transformResponse(responseData);
};

const fetchPermissionFromGraphql = async (endpoint: EndpointConfigValue) => {
	if (!endpoint || endpoint.type !== 'graphql') {
		return;
	}
	const response = await makeGraphqlRequest({
		url: endpoint.url,
		query: endpoint.query,
		variables: endpoint.variables,
	});

	const responseData = await response.json();
	return endpoint.transformResponse(responseData);
};

export const fetchPermissionForProduct = async ({
	permissionsToCheck,
	cloudId,
	userId,
}: {
	permissionsToCheck: {
		jira?: Array<string>;
		confluence?: Array<string>;
		loom?: Array<string>;
	};
	cloudId: string;
	userId: string;
}) => {
	const apiCallPromises: Promise<void>[] = [];
	const permissions: ProductPermissionsResponse[] = [];
	const productKeys = Object.keys(permissionsToCheck) as Array<keyof typeof permissionsToCheck>;
	const errors: Error[] = [];
	const productPermissions: {
		product: string;
		permissionId: string;
	}[] = [];
	productKeys.forEach((productKey) =>
		permissionsToCheck[productKey]?.forEach(async (permission: string) => {
			const endpoint = getEndpoint(productKey, permission, cloudId);
			if (endpoint) {
				if (endpoint.type === 'rest') {
					apiCallPromises.push(
						(async () => {
							try {
								const responseData = await fetchPermissionFromRestApi(endpoint);
								if (responseData) {
									permissions.push(responseData);
								}
							} catch (error) {
								errors.push(new Error(`Error fetching product permissions with error ${error}`));
								permissions.push({
									permissionId: permission,
									resourceId: productKey,
									permitted: false,
								});
							}
						})(),
					);
				} else if (endpoint.type === 'graphql') {
					apiCallPromises.push(
						(async () => {
							try {
								const responseData = await fetchPermissionFromGraphql(endpoint);
								if (responseData) {
									permissions.push(responseData);
								}
							} catch (error) {
								permissions.push({
									permissionId: permission,
									resourceId: productKey,
									permitted: false,
								});
								errors.push(new Error(`Error fetching product permissions with error ${error}`));
							}
						})(),
					);
				} else if (endpoint.type === 'default') {
					productPermissions.push({
						product: endpoint.payload.product,
						permissionId: endpoint.payload.permissionId,
					});
				}
			} else {
				productPermissions.push({ product: productKey, permissionId: permission });
			}
		}),
	);

	if (productPermissions.length > 0) {
		apiCallPromises.push(
			(async () => {
				try {
					const bulkPermissions = await fetchPermissionFromDefaultEndpoint({
						cloudId,
						userId,
						productPermissions,
					});
					permissions.push(...bulkPermissions);
				} catch (error) {
					errors.push(new Error(`Error fetching product permissions with error ${error}`));
				}
			})(),
		);
	}

	await Promise.allSettled(apiCallPromises);

	return { permissions, errors };
};
