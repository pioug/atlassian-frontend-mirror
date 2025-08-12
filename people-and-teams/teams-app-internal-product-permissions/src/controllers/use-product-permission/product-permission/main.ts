import { createHook, createStore } from 'react-sweet-state';

import type { ProductPermissionsActions, ProductPermissionsStore } from './types';
import { fetchPermissionForProduct } from './utils/permission-endpoints';
import { transformPermissions } from './utils/transform-permissions';

const actions: ProductPermissionsActions = {
	getPermissions:
		({ userId, cloudId, enabled, permissionsToCheck }) =>
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

				const { permissions } = await fetchPermissionForProduct({
					permissionsToCheck,
					cloudId,
					userId,
				});

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
		({ getState, setState }) => {
			const newPermissions = transformPermissions(permissions);
			const oldPermissions = getState().permissions;
			setState({
				hasLoaded: true,
				isLoading: false,
				permissions: {
					jira: { ...oldPermissions.jira, ...newPermissions.jira },
					confluence: { ...oldPermissions.confluence, ...newPermissions.confluence },
					loom: { ...oldPermissions.loom, ...newPermissions.loom },
				},
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
