import {
	type ProductPermissionsResponse,
	SUPPORTED_PRODUCTS,
	type UserProductPermissions,
} from '../types';

export const transformPermissions = (
	permissions: ProductPermissionsResponse[],
): UserProductPermissions => {
	return permissions.reduce<UserProductPermissions>((acc, permission) => {
		SUPPORTED_PRODUCTS.forEach((supportedProduct) => {
			if (permission.resourceId.includes(supportedProduct)) {
				acc[supportedProduct] = {
					...acc[supportedProduct],
					[permission.permissionId]:
						acc[supportedProduct]?.[permission.permissionId] || permission.permitted,
				};
			}
		});

		return acc;
	}, {});
};
