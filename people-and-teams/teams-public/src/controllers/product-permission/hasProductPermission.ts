import { type UserProductPermissions } from './types';

/**
 * @deprecated Use hasProductPermission from "@atlaskit/teams-app-internal-product-permissions" instead
 */
export const hasProductPermission = (
	permissions: UserProductPermissions,
	product: keyof UserProductPermissions,
	permissionIds?: string[],
): boolean | undefined => {
	if (!permissions[product]) {
		return false;
	}

	if ((!permissionIds || permissionIds.length === 0) && permissions[product]) {
		return Object.values(permissions[product] || {}).some((value) => value === true);
	}

	return permissionIds?.some((permissionId: string) => {
		const productPermissions = permissions[product] as any;
		return productPermissions?.[permissionId];
	});
};
