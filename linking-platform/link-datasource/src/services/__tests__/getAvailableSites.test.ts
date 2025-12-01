import fetchMock from 'fetch-mock/cjs/client';

import { mockProductsData, mockSiteData } from '@atlaskit/link-test-helpers/datasource';

import { getAccessibleProducts } from '../getAvailableSites';

describe('getAvailableSites', () => {
	beforeEach(() => {
		fetchMock.reset();
	});

	it('should return an array of jira sites', async () => {
		const mock = fetchMock.post({
			url: '/gateway/api/v2/accessible-products',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: {
				productIds: [
					'jira-software.ondemand',
					'jira-core.ondemand',
					'jira-incident-manager.ondemand',
					'jira-product-discovery',
					'jira-servicedesk.ondemand',
				],
			},
			response: {
				data: { products: mockProductsData },
			},
		});

		const jiraSites = await getAccessibleProducts('jira');

		expect(mock.calls()).toHaveLength(1);

		expect(mock.calls()[0][1].body).toEqual(
			'{"productIds":["jira-software.ondemand","jira-core.ondemand","jira-incident-manager.ondemand","jira-product-discovery","jira-servicedesk.ondemand"]}',
		);
		expect(mock.done()).toBe(true);

		expect(jiraSites).toEqual(mockSiteData);
	});

	it('should return an array of confluence sites', async () => {
		const mockConfluenceSiteData = mockProductsData.slice(4, 5);
		const mock = fetchMock.post({
			url: '/gateway/api/v2/accessible-products',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: {
				productIds: ['confluence.ondemand'],
			},
			response: {
				data: { products: mockConfluenceSiteData },
			},
		});

		const confluenceSites = await getAccessibleProducts('confluence');

		expect(mock.calls()).toHaveLength(1);
		expect(mock.calls()[0][1].body).toEqual('{"productIds":["confluence.ondemand"]}');
		expect(mock.done()).toBe(true);

		expect(confluenceSites).toEqual(mockConfluenceSiteData);
	});

	const scenarios = [['jira'], ['confluence']] as const;

	describe.each(scenarios)('when calling the function with %s argument', (arg) => {
		it('should throw if response is 500', async () => {
			expect.assertions(3);
			const mock = fetchMock.post('/gateway/api/v2/accessible-products', {
				body: 'penguins jumping high',
				status: 500,
			});

			try {
				await getAccessibleProducts(arg);
			} catch (e) {
				expect(e).toEqual(new Error('penguins jumping high'));
			}
			expect(mock.calls()).toHaveLength(1);
			expect(mock.done()).toBe(true);
		});

		it('should throw if response is 401', async () => {
			expect.assertions(3);
			const mock = fetchMock.post('/gateway/api/v2/accessible-products', {
				status: 401,
			});

			try {
				await getAccessibleProducts(arg);
			} catch (e) {
				expect(e).toEqual(new Error('Something went wrong'));
			}
			expect(mock.calls()).toHaveLength(1);
			expect(mock.done()).toBe(true);
		});
	});
});
