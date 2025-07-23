import { type UserProductPermissions } from './product-permission/types';

export const hasProductPermission = (
	permissions: UserProductPermissions,
	product: keyof UserProductPermissions,
	permissionIds?: Array<string>,
) => {
	if (!permissions[product]) {
		return false;
	}

	if ((!permissionIds || permissionIds.length === 0) && permissions[product]) {
		return Object.values(permissions[product] || {}).some((value) => value === true);
	}

	return permissionIds?.some((permissionId) => permissions[product]?.[permissionId]);
};
