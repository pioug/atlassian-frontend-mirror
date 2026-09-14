import { type ProductPermissionRequestBodyType, type ProductPermissionsType } from './types';

const PRODUCTS = [
	'confluence',
	'jira',
	'jira-core',
	'jira-software',
	'jira-servicedesk',
	'jira-product-discovery',
	'loom',
];

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
