import { type ProductPermissionRequestBodyType } from '../types';

const JIRA_SUB_PRODUCTS = [
	'jira',
	'jira-core',
	'jira-software',
	'jira-servicedesk',
	'jira-product-discovery',
];

export const getProductPermissionRequestBody = (
	cloudId: string,
	userId: string,
	productPermissions: Array<{
		product: string;
		permissionId: string;
	}>,
): string => {
	const body = productPermissions.reduce(
		(acc: ProductPermissionRequestBodyType[], productPermission) => {
			const permission: ProductPermissionRequestBodyType = {
				permissionId: productPermission.permissionId,
				resourceId: '',
				principalId: `ari:cloud:identity::user/${userId}`,
				dontRequirePrincipalInSite: true,
			};
			if (productPermission.product === 'jira') {
				JIRA_SUB_PRODUCTS.forEach((product) => {
					acc.push({
						...permission,
						resourceId: `ari:cloud:${product}::site/${cloudId}`,
					});
				});
			} else {
				acc.push({
					...permission,
					resourceId: `ari:cloud:${productPermission.product}::site/${cloudId}`,
				});
			}

			return acc;
		},
		[],
	);

	return JSON.stringify(body);
};
