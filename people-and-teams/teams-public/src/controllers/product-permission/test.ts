import type { ProductPermissionsResponse, UserProductPermissions } from './types';
import { getProductPermissionRequestBody, transformPermissions } from './utils';

describe('transformPermissions', () => {
	it('should return true for jira and confluence when write permissions are granted', () => {
		const permissions: ProductPermissionsResponse[] = [
			{ resourceId: 'ari:cloud:jira-software::site/123', permissionId: 'write', permitted: true },
			{ resourceId: 'ari:cloud:confluence::site/123', permissionId: 'write', permitted: true },
		];

		const result = transformPermissions(permissions);

		expect(result).toStrictEqual<UserProductPermissions>({
			jira: { write: true },
			confluence: { write: true },
		});
	});

	it('should return true for jira and confluence when permissions are granted', () => {
		const permissions: ProductPermissionsResponse[] = [
			{ resourceId: 'ari:cloud:jira-software::site/123', permissionId: 'read', permitted: true },
			{ resourceId: 'ari:cloud:confluence::site/123', permissionId: 'write', permitted: true },
		];

		const result = transformPermissions(permissions);

		expect(result).toStrictEqual<UserProductPermissions>({
			jira: { read: true },
			confluence: { write: true },
		});
	});

	it('should return false for jira and confluence when permissions are not granted', () => {
		const permissions: ProductPermissionsResponse[] = [
			{ resourceId: 'ari:cloud:jira-software::site/123', permissionId: 'write', permitted: false },
			{ resourceId: 'ari:cloud:confluence::site/123', permissionId: 'write', permitted: false },
		];

		const result = transformPermissions(permissions);

		expect(result).toStrictEqual<UserProductPermissions>({
			jira: { write: false },
			confluence: { write: false },
		});
	});

	it('should return true for jira and false for confluence when only jira permission is granted', () => {
		const permissions: ProductPermissionsResponse[] = [
			{ resourceId: 'ari:cloud:jira-software::site/123', permissionId: 'write', permitted: true },
			{ resourceId: 'ari:cloud:confluence::site/123', permissionId: 'write', permitted: false },
		];

		const result = transformPermissions(permissions);

		expect(result).toStrictEqual<UserProductPermissions>({
			jira: { write: true },
			confluence: { write: false },
		});
	});

	it('should return false for jira and true for confluence when only confluence permission is granted', () => {
		const permissions: ProductPermissionsResponse[] = [
			{ resourceId: 'ari:cloud:jira-software::site/123', permitted: false, permissionId: 'write' },
			{
				resourceId: 'ari:cloud:confluence::site/123',
				permitted: true,
				permissionId: 'write',
			},
		];

		const result = transformPermissions(permissions);

		expect(result).toStrictEqual<UserProductPermissions>({
			jira: { write: false },
			confluence: { write: true },
		});
	});
});

describe('getProductPermissionRequestBody', () => {
	it('should return correct request body for given cloudId and userId', () => {
		const cloudId = 'cloud-id';
		const userId = 'user-id';

		const result = getProductPermissionRequestBody(cloudId, userId, 'write');

		const expectedBody = JSON.stringify([
			{
				permissionId: 'write',
				resourceId: `ari:cloud:confluence::site/${cloudId}`,
				principalId: `ari:cloud:identity::user/${userId}`,
				dontRequirePrincipalInSite: true,
			},
			{
				permissionId: 'write',
				resourceId: `ari:cloud:jira-software::site/${cloudId}`,
				principalId: `ari:cloud:identity::user/${userId}`,
				dontRequirePrincipalInSite: true,
			},
		]);

		expect(result).toBe(expectedBody);
	});
});
