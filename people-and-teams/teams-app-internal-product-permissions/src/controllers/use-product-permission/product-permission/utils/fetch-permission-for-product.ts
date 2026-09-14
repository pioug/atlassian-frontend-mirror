import { type ProductPermissionsResponse } from '../types';

import { getEndpoint } from './get-endpoint';
import { getProductPermissionRequestBody } from './get-product-permission-request-body';
import { makeGraphqlRequest } from './make-graphql-request';
import { makeRestApiRequest } from './make-rest-api-request';
import type { EndpointConfigValue } from './permission-endpoints';

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
}): Promise<{
	permissions: ProductPermissionsResponse[];
	errors: Error[];
}> => {
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
