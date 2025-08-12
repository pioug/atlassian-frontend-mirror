import type { ProductPermissionsResponse } from '../types';

import { fetchPermissionForProduct, getEndpoint } from './permission-endpoints';
import {
	getProductPermissionRequestBody,
	makeGraphqlRequest,
	makeRestApiRequest,
} from './requests';

jest.mock('./requests', () => {
	const actual = jest.requireActual('./requests');
	return {
		...actual,
		makeGraphqlRequest: jest.fn(),
		makeRestApiRequest: jest.fn(),
	};
});

describe('permission-endpoints utils', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getEndpoint', () => {
		it('returns graphql config for jira CREATE_PROJECT', () => {
			const cloudId = 'abc-123';
			const endpoint = getEndpoint('jira', 'CREATE_PROJECT', cloudId);

			expect(endpoint).toBeDefined();
			if (!endpoint || endpoint.type !== 'graphql') {
				return;
			} // type guard for TS
			expect(endpoint.url).toBe('/gateway/api/graphql');
			expect(endpoint.query).toContain('query CanCreateProject');
			expect(endpoint.variables).toEqual({ cloudId });

			const transformed = endpoint.transformResponse({ data: { jira: { canPerform: true } } });
			expect(transformed).toEqual<ProductPermissionsResponse>({
				permissionId: 'CREATE_PROJECT',
				resourceId: 'jira',
				permitted: true,
			});
		});

		it('returns graphql config for confluence create_space', () => {
			const endpoint = getEndpoint('confluence', 'CREATE_SPACE', 'cloud-1');
			expect(endpoint?.type).toEqual('graphql');
		});

		it('returns undefined for unknown mappings', () => {
			const endpoint = getEndpoint('jira', 'UNKNOWN_PERMISSION', 'cloud-1');
			expect(endpoint).toBeUndefined();
		});
	});

	describe('getProductPermissions', () => {
		it('fetches via graphql for jira CREATE_PROJECT and maps the result', async () => {
			const cloudId = 'cloud-xyz';
			const userId = 'user-1';

			(makeGraphqlRequest as jest.Mock).mockResolvedValueOnce({
				json: async () => ({ data: { jira: { canPerform: true } } }),
			});

			const { permissions, errors } = await fetchPermissionForProduct({
				permissionsToCheck: { jira: ['CREATE_PROJECT'] },
				cloudId,
				userId,
			});

			expect(makeGraphqlRequest).toHaveBeenCalledWith({
				url: '/gateway/api/graphql',
				query: expect.stringContaining('query CanCreateProject'),
				variables: { cloudId },
			});
			expect(errors).toHaveLength(0);
			expect(permissions).toEqual<ProductPermissionsResponse[]>([
				{ permissionId: 'CREATE_PROJECT', resourceId: 'jira', permitted: true },
			]);
		});

		it('aggregates default and unknown permissions into a bulk REST call', async () => {
			const cloudId = 'cloud-2';
			const userId = 'user-2';

			const productPermissions = [
				{ product: 'confluence', permissionId: 'create_space' },
				{ product: 'jira', permissionId: 'manage' },
			];
			const expectedBody = getProductPermissionRequestBody(cloudId, userId, productPermissions);

			(makeRestApiRequest as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => [
					{
						resourceId: `ari:cloud:confluence::site/${cloudId}`,
						permissionId: 'create_space',
						permitted: true,
					},
					{
						resourceId: `ari:cloud:jira::site/${cloudId}`,
						permissionId: 'manage',
						permitted: false,
					},
				],
			});

			const { permissions } = await fetchPermissionForProduct({
				permissionsToCheck: { confluence: ['create_space'], jira: ['manage'] },
				cloudId,
				userId,
			});

			expect(makeRestApiRequest).toHaveBeenCalledWith({
				url: '/gateway/api/permissions/bulk/permitted',
				body: expectedBody,
			});
			expect(permissions).toEqual<ProductPermissionsResponse>(
				expect.arrayContaining([
					expect.objectContaining({ permissionId: 'create_space', permitted: true }),
					expect.objectContaining({ permissionId: 'manage', permitted: false }),
				]),
			);
		});

		it('collects errors when graphql request fails', async () => {
			(makeGraphqlRequest as jest.Mock).mockRejectedValueOnce(new Error('bad error'));

			const { permissions, errors } = await fetchPermissionForProduct({
				permissionsToCheck: { jira: ['CREATE_PROJECT'] },
				cloudId: 'c',
				userId: 'u',
			});

			expect(permissions).toHaveLength(1);
			expect(permissions).toEqual<ProductPermissionsResponse>(
				expect.arrayContaining([
					expect.objectContaining({
						permissionId: 'CREATE_PROJECT',
						resourceId: 'jira',
						permitted: false,
					}),
				]),
			);
			expect(errors).toHaveLength(1);
			expect(String(errors[0].message)).toContain('bad error');
		});

		it('collects errors when bulk REST call is not ok', async () => {
			(makeRestApiRequest as jest.Mock).mockResolvedValueOnce({ ok: false });

			const { permissions, errors } = await fetchPermissionForProduct({
				permissionsToCheck: { confluence: ['create_space'] },
				cloudId: 'cloud',
				userId: 'user',
			});

			expect(permissions).toHaveLength(0);
			expect(errors).toHaveLength(1);
			expect(String(errors[0].message)).toContain(
				'Error fetching product permissions with error TypeError: response.json is not a function',
			);
		});

		it('handles mixed endpoints: graphql failure, default bulk success', async () => {
			const cloudId = 'cloud-mixed-1';
			const userId = 'user-mixed-1';

			(makeGraphqlRequest as jest.Mock).mockRejectedValueOnce(new Error('graphql failed'));

			const permissionEndpointsModule =
				require('./permission-endpoints') as typeof import('./permission-endpoints');
			const originalGetEndpoint = permissionEndpointsModule.getEndpoint;
			const getEndpointSpy = jest
				.spyOn(permissionEndpointsModule, 'getEndpoint')
				.mockImplementation((product: string, permissionId: string, cid: string) => {
					if (product === 'loom' && permissionId === 'RECORD') {
						return {
							type: 'rest',
							url: '/rest/custom/loom/permission',
							query: '',
							transformResponse: (data: any) => ({
								permissionId: 'RECORD',
								resourceId: 'loom',
								permitted: Boolean(data?.permitted),
							}),
						} as any;
					}
					return originalGetEndpoint(product, permissionId, cid);
				});

			(makeRestApiRequest as jest.Mock).mockImplementation(({ url }: { url: string }) => {
				if (url === '/gateway/api/permissions/bulk/permitted') {
					return Promise.resolve({
						ok: true,
						json: async () => [
							{
								resourceId: `ari:cloud:confluence::site/${cloudId}`,
								permissionId: 'create_space',
								permitted: false,
							},
							{
								resourceId: `ari:cloud:jira::site/${cloudId}`,
								permissionId: 'MANAGE',
								permitted: true,
							},
							{
								resourceId: `ari:cloud:loom::site/${cloudId}`,
								permissionId: 'MANAGE',
								permitted: true,
							},
						],
					});
				}
				return Promise.reject(new Error(`Unexpected URL: ${url}`));
			});

			const { permissions, errors } = await fetchPermissionForProduct({
				permissionsToCheck: {
					jira: ['CREATE_PROJECT', 'MANAGE'],
					confluence: ['create_space'],
					loom: ['MANAGE'],
				},
				cloudId,
				userId,
			});

			getEndpointSpy.mockRestore();

			expect(makeGraphqlRequest).toHaveBeenCalledTimes(1);
			expect(makeRestApiRequest).toHaveBeenCalledWith({
				url: '/gateway/api/permissions/bulk/permitted',
				body: expect.any(String),
			});

			expect(permissions).toEqual<ProductPermissionsResponse>(
				expect.arrayContaining([
					expect.objectContaining({ permissionId: 'create_space', permitted: false }),
					expect.objectContaining({ permissionId: 'MANAGE', permitted: true }),
					expect.objectContaining({
						permissionId: 'CREATE_PROJECT',
						resourceId: 'jira',
						permitted: false,
					}),
				]),
			);

			expect(errors.length).toBeGreaterThanOrEqual(1);
			expect(String(errors[0].message)).toContain('graphql failed');
		});
	});
});
