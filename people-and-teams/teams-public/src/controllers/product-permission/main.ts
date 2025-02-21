import { createHook, createStore } from 'react-sweet-state';

import type {
	ProductPermissionsActions,
	ProductPermissionsResponse,
	ProductPermissionsStore,
} from './types';
import { getProductPermissionRequestBody, transformPermissions } from './utils';

const actions: ProductPermissionsActions = {
	getPermissions:
		({ userId, cloudId, enabled, permissionId }) =>
		async ({ setState, getState, dispatch }) => {
			const { hasLoaded, isLoading } = getState();
			if (hasLoaded || isLoading || !userId || !cloudId || !enabled) {
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
					body: getProductPermissionRequestBody(cloudId, userId, permissionId),
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
	name: 'product-permissions',
});

export const useProductPermissionsStore = createHook(Store);
