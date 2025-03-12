import type {
	ProductPermissionRequestBodyType,
	ProductPermissionsResponse,
	ProductPermissionsType,
	UserProductPermissions,
} from './types';

const PRODUCTS = [
	'confluence',
	'jira',
	'jira-core',
	'jira-software',
	'jira-servicedesk',
	'jira-product-discovery',
];

export const transformPermissions = (
	permissions: ProductPermissionsResponse[],
): UserProductPermissions => {
	return permissions.reduce((acc: UserProductPermissions, permission) => {
		if (permission.resourceId.includes('jira')) {
			acc['jira'] = {
				...acc['jira'],
				[permission.permissionId as keyof ProductPermissionsType]:
					acc['jira']?.[permission.permissionId as keyof ProductPermissionsType] ||
					permission.permitted,
			};
		} else if (permission.resourceId.includes('confluence')) {
			acc['confluence'] = {
				...acc['confluence'],
				[permission.permissionId as keyof ProductPermissionsType]:
					acc['confluence']?.[permission.permissionId as keyof ProductPermissionsType] ||
					permission.permitted,
			};
		}
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

export const hasProductPermission = (
	permissions: UserProductPermissions,
	product: keyof UserProductPermissions,
	permissionIds?: Array<keyof ProductPermissionsType>,
) => {
	if (!permissions[product]) {
		return false;
	}

	if ((!permissionIds || permissionIds.length === 0) && permissions[product]) {
		return Object.values(permissions[product] || {}).some((value) => value === true);
	}

	return permissionIds?.some((permissionId) => permissions[product]?.[permissionId]);
};
