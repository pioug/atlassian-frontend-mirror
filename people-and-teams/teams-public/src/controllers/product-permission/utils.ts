import type { ProductPermissionsResponse, UserProductPermissions } from './types';

export const transformPermissions = (
	permissions: ProductPermissionsResponse[],
): UserProductPermissions => {
	return permissions.reduce((acc: UserProductPermissions, permission) => {
		if (permission.resourceId.includes('jira-software')) {
			acc['jira'] = { ...acc['jira'], [permission.permissionId]: permission.permitted };
		} else if (permission.resourceId.includes('confluence')) {
			acc['confluence'] = { ...acc['confluence'], [permission.permissionId]: permission.permitted };
		}
		return acc;
	}, {});
};

export const getProductPermissionRequestBody = (
	cloudId: string,
	userId: string,
	permissionId: string,
): string => {
	const body = [
		{
			permissionId,
			resourceId: `ari:cloud:confluence::site/${cloudId}`,
			principalId: `ari:cloud:identity::user/${userId}`,
			dontRequirePrincipalInSite: true,
		},
		{
			permissionId,
			resourceId: `ari:cloud:jira-software::site/${cloudId}`,
			principalId: `ari:cloud:identity::user/${userId}`,
			dontRequirePrincipalInSite: true,
		},
	];
	return JSON.stringify(body);
};
