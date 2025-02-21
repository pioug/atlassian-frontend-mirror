import { useCallback, useEffect } from 'react';

import { useProductPermissionsStore } from '../../../product-permission/main';
import { type ProductPermissions } from '../../../product-permission/types';

export const useProductPermissions: ProductPermissions = (
	userId,
	cloudId,
	permissionId = 'read',
	{ enabled } = { enabled: true },
) => {
	const [state, { getPermissions }] = useProductPermissionsStore();

	const fetchData = useCallback(async () => {
		getPermissions({ cloudId, userId, enabled, permissionId });
	}, [cloudId, enabled, getPermissions, userId, permissionId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return {
		loading: state.isLoading,
		data: state.permissions,
		error: state.error,
		...state,
	};
};
