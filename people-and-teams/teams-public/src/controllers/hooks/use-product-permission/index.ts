import { useCallback, useEffect } from 'react';

import { useProductPermissionsStore } from '../../product-permission/main';
import { type ProductPermissions } from '../../product-permission/types';

export const useProductPermissions: ProductPermissions = (
	{ userId, cloudId, permissionIds = ['manage', 'write'] },
	{ enabled } = { enabled: true },
) => {
	const [state, { getPermissions }] = useProductPermissionsStore();

	const fetchData = useCallback(async () => {
		getPermissions({ cloudId, userId, enabled, permissionIds });
	}, [cloudId, enabled, getPermissions, userId, permissionIds]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return {
		loading: state.isLoading,
		data: state.permissions,
		error: state.error,
	};
};
