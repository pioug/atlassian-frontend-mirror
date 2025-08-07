import {
	type ProductPermissionRequestBodyType,
	type ProductPermissionsResponse,
	type ProductPermissionsType,
	SUPPORTED_PRODUCTS,
	type UserProductPermissions,
} from './types';

const PRODUCTS = [
	'confluence',
	'jira',
	'jira-core',
	'jira-software',
	'jira-servicedesk',
	'jira-product-discovery',
	'loom',
];

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

export const getProductPermissionRequestBody = (
	cloudId: string,
	userId: string,
	permissionIds: Array<keyof ProductPermissionsType>,
): string => {
	const body = permissionIds.reduce((acc: ProductPermissionRequestBodyType[], permissionId) => {
		const permission: ProductPermissionRequestBodyType = {
			permissionId,
			resourceId: '',
			principalId: `ari:cloud:identity::user/${userId}`,
			dontRequirePrincipalInSite: true,
		};

		PRODUCTS.forEach((product) => {
			acc.push({
				...permission,
				resourceId: `ari:cloud:${product}::site/${cloudId}`,
			});
		});

		return acc;
	}, []);

	return JSON.stringify(body);
};

/**
 * @deprecated Use hasProductPermission from "@atlaskit/teams-app-internal-product-permissions" instead
 */
export const hasProductPermission = (
	permissions: UserProductPermissions,
	product: keyof UserProductPermissions,
	permissionIds?: string[],
) => {
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
