import {
	type ProductPermissionsResponse,
	type ProductPermissionsType,
	SUPPORTED_PRODUCTS,
	type UserProductPermissions,
} from './types';

export const transformPermissions = (
	permissions: ProductPermissionsResponse[],
): UserProductPermissions => {
	return permissions.reduce((acc: UserProductPermissions, permission) => {
		SUPPORTED_PRODUCTS.forEach((supportedProduct) => {
			if (permission.resourceId.includes(supportedProduct)) {
				acc[supportedProduct] = {
					...acc[supportedProduct],
					[permission.permissionId as keyof ProductPermissionsType]:
						acc[supportedProduct]?.[permission.permissionId as keyof ProductPermissionsType] ||
						permission.permitted,
				};
			}
		});

		return acc;
	}, {});
};
