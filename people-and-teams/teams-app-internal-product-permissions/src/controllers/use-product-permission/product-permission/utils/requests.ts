import { type ProductPermissionRequestBodyType } from '../types';

const JIRA_SUB_PRODUCTS = [
	'jira',
	'jira-core',
	'jira-software',
	'jira-servicedesk',
	'jira-product-discovery',
];

export const makeGraphqlRequest = ({
	url,
	query,
	variables,
}: {
	url: string;
	query: string;
	variables?: object;
}) => {
	return fetch(url, {
		method: 'POST',
		credentials: 'include',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	});
};

export const makeRestApiRequest = ({ url, body }: { url: string; body?: string }) => {
	return fetch(url, {
		method: 'POST',
		credentials: 'include',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
		},
		body,
	});
};

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
