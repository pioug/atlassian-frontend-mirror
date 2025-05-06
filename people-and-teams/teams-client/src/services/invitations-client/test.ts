import { type AccessRequestBulkSimplified } from './types';
import { removeDuplicateRecommendations } from './utils';

import invitationsClient from './index';

jest.mock('./utils', () => ({
	...jest.requireActual('./utils'),
	removeDuplicateRecommendations: jest.fn(),
}));

const mockRemoveDuplicateRecommendations = removeDuplicateRecommendations as jest.Mock;

describe('invitations client', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		mockRemoveDuplicateRecommendations.mockImplementation((arg) => arg);
	});

	describe('getProductRecommendations', () => {
		const orgId = 'test-org-id';
		const allProductQueryParams =
			'&product=confluence&product=jira&product=jira-core&product=jira-servicedesk&product=jira-software&product=jira-incident-manager&product=jira-product-discovery&product=opsgenie&product=statuspage&product=avocado&product=townsquare&product=compass&product=avp&product=beacon&product=mercury';
		const allCapabilitiesQueryParams = '&capability=REQUEST_ACCESS&capability=DIRECT_ACCESS';

		it('should get all product recommendations', async () => {
			jest.spyOn(invitationsClient, 'getResource');
			jest.spyOn(invitationsClient, 'getOrgId').mockImplementation(() => orgId);
			await invitationsClient.getProductRecommendations();
			expect(invitationsClient.getResource).toHaveBeenCalledWith(
				`/v1/product-recommendations?orgId=${orgId}${allProductQueryParams}`,
			);
		});

		it('should get only get product recommendations for avocado', async () => {
			jest.spyOn(invitationsClient, 'getResource');
			jest.spyOn(invitationsClient, 'getOrgId').mockImplementation(() => orgId);
			await invitationsClient.getProductRecommendations(['avocado']);
			expect(invitationsClient.getResource).toHaveBeenCalledWith(
				`/v1/product-recommendations?orgId=${orgId}&product=avocado`,
			);
		});

		it('should get all product recommendations when empty products provided', async () => {
			jest.spyOn(invitationsClient, 'getResource');
			jest.spyOn(invitationsClient, 'getOrgId').mockImplementation(() => orgId);
			await invitationsClient.getProductRecommendations([]);
			expect(invitationsClient.getResource).toHaveBeenCalledWith(
				`/v1/product-recommendations?orgId=${orgId}${allProductQueryParams}`,
			);
		});

		it('should get all capabilities', async () => {
			jest.spyOn(invitationsClient, 'getResource');
			jest.spyOn(invitationsClient, 'getOrgId').mockImplementation(() => orgId);
			await invitationsClient.getProductRecommendations(undefined, [
				'REQUEST_ACCESS',
				'DIRECT_ACCESS',
			]);
			expect(invitationsClient.getResource).toHaveBeenCalledWith(
				`/v1/product-recommendations?orgId=${orgId}${allProductQueryParams}${allCapabilitiesQueryParams}`,
			);
		});

		it('should get just request access capabilities', async () => {
			jest.spyOn(invitationsClient, 'getResource');
			jest.spyOn(invitationsClient, 'getOrgId').mockImplementation(() => orgId);
			await invitationsClient.getProductRecommendations(undefined, ['REQUEST_ACCESS']);
			expect(invitationsClient.getResource).toHaveBeenCalledWith(
				`/v1/product-recommendations?orgId=${orgId}${allProductQueryParams}&capability=REQUEST_ACCESS`,
			);
		});

		it('should get all capabilities when empty capabilities provided (no query params provided)', async () => {
			jest.spyOn(invitationsClient, 'getResource');
			jest.spyOn(invitationsClient, 'getOrgId').mockImplementation(() => orgId);
			await invitationsClient.getProductRecommendations(undefined, []);
			expect(invitationsClient.getResource).toHaveBeenCalledWith(
				`/v1/product-recommendations?orgId=${orgId}${allProductQueryParams}`,
			);
		});

		it('should log exceptions and propagate errors up', async () => {
			const error = new Error('test error');
			const logExceptionMock = jest.spyOn(invitationsClient, 'logException');
			jest.spyOn(invitationsClient, 'getOrgId').mockImplementation(() => orgId);
			jest.spyOn(invitationsClient, 'getResource').mockImplementation(() => Promise.reject(error));

			await expect(invitationsClient.getProductRecommendations()).rejects.toThrow(error);

			expect(logExceptionMock).toHaveBeenCalledWith(
				error,
				'An error occurred while getting product recommendations.',
			);
		});
	});

	describe('joinOrRequestDefaultAccessToProductsBulk', () => {
		it('should call postResource with the correct url and request body', async () => {
			const simplifiedRequest: AccessRequestBulkSimplified = {
				productAris: ['test-ari', 'test-ari-2'],
				note: 'test-note',
				accessMode: 'REQUEST_ACCESS',
				source: 'test-source',
			};
			const request = {
				resources: [
					{ ari: 'test-ari', role: 'product/member' },
					{ ari: 'test-ari-2', role: 'product/member' },
				],
				note: 'test-note',
				accessMode: 'REQUEST_ACCESS',
				source: 'test-source',
			};
			const postResourceMock = jest.spyOn(invitationsClient, 'postResource');
			await invitationsClient.joinOrRequestDefaultAccessToProductsBulk(simplifiedRequest);
			expect(postResourceMock).toHaveBeenCalledWith('/v1/access-requests/bulk/request', request);
		});

		it('should call postResource with only required fields', async () => {
			const simplifiedRequest: AccessRequestBulkSimplified = {
				productAris: ['test-ari', 'test-ari-2'],
			};
			const request = {
				resources: [
					{ ari: 'test-ari', role: 'product/member' },
					{ ari: 'test-ari-2', role: 'product/member' },
				],
			};
			const postResourceMock = jest.spyOn(invitationsClient, 'postResource');
			await invitationsClient.joinOrRequestDefaultAccessToProductsBulk(simplifiedRequest);
			expect(postResourceMock).toHaveBeenCalledWith('/v1/access-requests/bulk/request', request);
		});

		it('should call postResource with empty products and succeed', async () => {
			const simplifiedRequest: AccessRequestBulkSimplified = {
				productAris: [],
			};
			const postResourceMock = jest.spyOn(invitationsClient, 'postResource');
			await invitationsClient.joinOrRequestDefaultAccessToProductsBulk(simplifiedRequest);
			expect(postResourceMock).not.toHaveBeenCalled();
		});

		it('should log exceptions and propagate errors up', async () => {
			const error = new Error('test error');
			const logExceptionMock = jest.spyOn(invitationsClient, 'logException');
			jest.spyOn(invitationsClient, 'postResource').mockImplementation(() => Promise.reject(error));

			await expect(
				invitationsClient.joinOrRequestDefaultAccessToProductsBulk({
					productAris: ['test-ari'],
				}),
			).rejects.toThrow(error);

			expect(logExceptionMock).toHaveBeenCalledWith(
				error,
				'An error occurred while joining or requesting access to products.',
			);
		});
	});
});
