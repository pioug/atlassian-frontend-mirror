import { createHook, createStore } from 'react-sweet-state';

import type {
	ProductPermissionsActions,
	ProductPermissionsResponse,
	ProductPermissionsStore,
} from './types';
import { getProductPermissionRequestBody, transformPermissions } from './utils';

const actions: ProductPermissionsActions = {
	getPermissions:
		({ userId, cloudId, enabled, permissionIds = ['manage', 'write'] }) =>
		async ({ setState, getState, dispatch }) => {
			const { hasLoaded, isLoading, permissions } = getState();
			if (isLoading || !userId || !cloudId || !enabled) {
				return;
			}
			const shouldFetch =
				!hasLoaded ||
				permissionIds.some(
					(permissionId) =>
						permissions.confluence?.[permissionId] === undefined ||
						permissions.jira?.[permissionId] === undefined ||
						permissions.loom?.[permissionId] === undefined,
				);

			if (!shouldFetch) {
				return;
			}
			try {
				setState({ isLoading: true });
				const response = await fetch('/gateway/api/permissions/bulk/permitted', {
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
					credentials: 'include',
					body: getProductPermissionRequestBody(cloudId, userId, permissionIds),
				});

				if (!response.ok) {
					throw new Error('Failed to fetch product permissions');
				}

				const permissions: ProductPermissionsResponse[] = await response.json();
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
	name: 'product-permissions-old',
});

/**
 * @deprecated Use useProductPermissionsStore from "@atlaskit/teams-app-internal-product-permissions" instead
 */
export const useProductPermissionsStore = createHook(Store);
