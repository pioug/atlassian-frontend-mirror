import { isValidAGGQuery } from '@atlassian/ptc-test-utils/graphql-jest';

import { getOrgIdForCloudIdFromAGG } from '../getOrgIdForCloudIdFromAGG';
import { AGGQuery } from '../graphqlUtils';

jest.mock('../graphqlUtils', () => ({
	AGGQuery: jest.fn(),
}));

const mockAGGQuery = AGGQuery as jest.Mock;

describe('getOrgIdForCloudIdFromAGG', () => {
	const mockCloudId = 'mock-cloud-id';
	const mockOrgId = 'mock-org-id';
	const mockUrl = 'mock-url';

	it('should successfully get org ID', async () => {
		mockAGGQuery.mockReturnValue({
			tenantContexts: [{ orgId: mockOrgId }],
		});
		const orgId = await getOrgIdForCloudIdFromAGG(mockUrl, mockCloudId);

		expect(orgId).toEqual(mockOrgId);

		expect(mockAGGQuery.mock.calls[0][0]).toBe(mockUrl);
		expect(mockAGGQuery.mock.calls[0][1].variables).toStrictEqual({ cloudId: mockCloudId });

		expect(isValidAGGQuery(mockAGGQuery.mock.calls[0][1].query)).toBe(true);
	});

	describe('should return null', () => {
		it('should return null if tenantContexts comes back null', async () => {
			mockAGGQuery.mockReturnValue({
				tenantContexts: null,
			});
			const orgId = await getOrgIdForCloudIdFromAGG(mockUrl, mockCloudId);

			expect(orgId).toBeNull();
		});

		it('should return null if tenantContexts is empty', async () => {
			mockAGGQuery.mockReturnValue({
				tenantContexts: [],
			});
			const orgId = await getOrgIdForCloudIdFromAGG(mockUrl, mockCloudId);

			expect(orgId).toBeNull();
		});

		it('should return null if tenantContexts[0] is null', async () => {
			mockAGGQuery.mockReturnValue({
				tenantContexts: [null],
			});
			const orgId = await getOrgIdForCloudIdFromAGG(mockUrl, mockCloudId);

			expect(orgId).toBeNull();
		});

		it('should return null if AGGQuery throws', async () => {
			mockAGGQuery.mockImplementation(() => {
				throw new Error();
			});
			const orgId = await getOrgIdForCloudIdFromAGG(mockUrl, mockCloudId);

			expect(orgId).toBeNull();
		});
	});
});
