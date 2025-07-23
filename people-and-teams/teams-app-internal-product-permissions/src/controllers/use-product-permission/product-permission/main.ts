import { createHook, createStore } from 'react-sweet-state';

import type {
	ProductPermissionsActions,
	ProductPermissionsResponse,
	ProductPermissionsStore,
} from './types';
import { getEndpoint } from './utils/permission-endpoints';
import {
	getProductPermissionRequestBody,
	makeGraphqlRequest,
	makeRestApiRequest,
} from './utils/requests';
import { transformPermissions } from './utils/transform-permissions';

const actions: ProductPermissionsActions = {
	getPermissions:
		({
			userId,
			cloudId,
			enabled,
			permissionsToCheck = {
				jira: ['manage', 'write'],
				confluence: ['manage', 'write'],
				loom: ['manage', 'write'],
			},
		}) =>
		async ({ setState, getState, dispatch }) => {
			const { hasLoaded, isLoading, permissions } = getState();
			if (isLoading || !userId || !cloudId || !enabled) {
				return;
			}
			const shouldFetch =
				!hasLoaded ||
				permissionsToCheck.jira?.some(
					(permissionId: string) => permissions.jira?.[permissionId] === undefined,
				) ||
				permissionsToCheck.confluence?.some(
					(permissionId) => permissions.confluence?.[permissionId] === undefined,
				) ||
				permissionsToCheck.loom?.some(
					(permissionId) => permissions.loom?.[permissionId] === undefined,
				);

			if (!shouldFetch) {
				return;
			}

			try {
				setState({ isLoading: true });
				const permissions: ProductPermissionsResponse[] = [];
				const productPermissions: {
					product: string;
					permissionId: string;
				}[] = [];
				const apiCallPromises = [];
				const productKeys = Object.keys(permissionsToCheck) as Array<
					keyof typeof permissionsToCheck
				>;
				productKeys.forEach((productKey) =>
					permissionsToCheck[productKey]?.forEach(async (permission: string) => {
						const endpoint = getEndpoint(productKey, permission, cloudId);
						if (endpoint) {
							if (endpoint.type === 'rest') {
								const res = await makeRestApiRequest({ url: endpoint.url });
								const responseData = await res.json();
								permissions.push(endpoint.transformResponse(responseData));
							} else if (endpoint.type === 'graphql') {
								const headers = new Headers();
								headers.append('Content-Type', 'application/json');
								const response = await makeGraphqlRequest({
									url: endpoint.url,
									query: endpoint.query,
									variables: endpoint.variables,
								});

								const responseData = await response.json();
								permissions.push(endpoint.transformResponse(responseData));
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

				const errors: Error[] = [];

				if (productPermissions.length > 0) {
					apiCallPromises.push(
						(async () => {
							try {
								const response = await makeRestApiRequest({
									url: '/gateway/api/permissions/bulk/permitted',
									body: getProductPermissionRequestBody(cloudId, userId, productPermissions),
								});

								if (!response.ok) {
									throw new Error('Failed to fetch product permissions');
								}
								const bulkPermissions = await response.json();
								permissions.push(...bulkPermissions);
							} catch (error) {
								errors.push(new Error(`Error fetching product permissions with error ${error}`));
							}
						})(),
					);
				}

				await Promise.all(apiCallPromises);

				dispatch(actions.setPermissions(permissions));
			} catch (error: unknown) {
				dispatch(actions.setError(new Error('Failed to fetch product permissions')));
			}
		},
	setError:
		(error) =>
		({ setState }) => {
			setState({ hasLoaded: true, isLoading: false, error });
		},
	setLoading:
		(isLoading) =>
		({ setState }) => {
			setState({ isLoading });
		},
	setPermissions:
		(permissions) =>
		({ setState }) => {
			setState({
				hasLoaded: true,
				isLoading: false,
				permissions: transformPermissions(permissions),
				permissionsResponse: permissions,
			});
		},
};

const Store = createStore<ProductPermissionsStore, ProductPermissionsActions>({
	initialState: {
		error: undefined,
		hasLoaded: false,
		isLoading: false,
		permissions: {},
	},
	actions,
	name: 'product-permissions',
});

export const useProductPermissionsStore = createHook(Store);
