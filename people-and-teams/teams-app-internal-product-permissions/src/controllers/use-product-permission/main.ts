import { useCallback, useEffect } from 'react';

import { useProductPermissionsStore } from './product-permission/main';
import { type ProductPermissions } from './product-permission/types';

/**
 * Hook to fetch product permissions for a user.
 *
 * @param userId - The ID of the user for whom to fetch permissions.
 * @param cloudId - The cloud ID associated with the tenant which permissions in checked.
 * @param permissionsToCheck - Optional object specifying which permissions to check. defaults to {
				jira: ['manage', 'write'],
				confluence: ['manage', 'write'],
				loom: ['manage', 'write'],
			},
		}
 * @param options - Optional configuration object, currently only supports `enabled`.
 * @returns An object containing loading state, data, and error information.
 */
export const useProductPermissions: ProductPermissions = ({
	userId,
	cloudId,
	permissionsToCheck,
	options,
}) => {
	const [state, { getPermissions }] = useProductPermissionsStore();

	const fetchData = useCallback(async () => {
		getPermissions({
			cloudId,
			userId,
			enabled: options?.enabled ?? true,
			permissionsToCheck: permissionsToCheck || {
				jira: ['manage', 'write'],
				confluence: ['manage', 'write'],
				loom: ['manage', 'write'],
			},
		});
	}, [cloudId, options, getPermissions, userId, permissionsToCheck]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return {
		loading: state.isLoading,
		data: state.permissions,
		error: state.error,
	};
};
