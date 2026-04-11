// @ts-ignore - This was added due to this import failing with 'no declaration file found for 'fetch-mock/cjs/client' in the Jira Typecheck when the platform is being locally consumed, as Jira does not contain the 'platform/fetch-mock.d.ts' typing. Additionally since this is a custom typing with no properties set it is already adding no type value
import fetchMock from 'fetch-mock/cjs/client';

import { mockProductsData, mockSiteData } from '@atlaskit/link-test-helpers/datasource';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { getAccessibleProducts } from '../getAvailableSites';

const ACCESSIBLE_PRODUCTS_PATH = '/gateway/api/v2/accessible-products';
const ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH = '/gateway/api/experimental/v2/accessible-products';

describe('getAvailableSites', () => {
	beforeEach(() => {
		fetchMock.restore();
	});

	ffTest.off('linking_platform_link_datasource_unit_compliant', 'when feature gate is OFF', () => {
		it('should return an array of jira sites using the v2 endpoint', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_PATH, { data: { products: mockProductsData } });

			const jiraSites = await getAccessibleProducts('jira');

			const [requestUrl, requestInit] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_PATH);
			expect(requestInit?.body).toEqual(
				'{"productIds":["jira-software.ondemand","jira-core.ondemand","jira-incident-manager.ondemand","jira-product-discovery","jira-servicedesk.ondemand"]}',
			);
			expect(jiraSites).toEqual(mockSiteData);
		});

		it('should return an array of confluence sites using the v2 endpoint', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_PATH, { data: { products: mockProductsData } });

			await getAccessibleProducts('confluence');

			const [requestUrl, requestInit] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_PATH);
			expect(requestInit?.body).toEqual('{"productIds":["confluence.ondemand"]}');
		});

		it('should throw with the error message if response is not ok', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_PATH, { body: 'penguins jumping high', status: 500 });

			await expect(getAccessibleProducts('jira')).rejects.toEqual(
				new Error('penguins jumping high'),
			);
		});

		it('should throw a generic message if response body is empty', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_PATH, { body: '', status: 401 });

			await expect(getAccessibleProducts('jira')).rejects.toEqual(
				new Error('Something went wrong'),
			);
		});
	});

	ffTest.on('linking_platform_link_datasource_unit_compliant', 'when feature gate is ON', () => {
		it('should return an array of jira sites using the experimental v2 endpoint', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH, {
				data: { products: mockProductsData },
			});

			const jiraSites = await getAccessibleProducts('jira');

			const [requestUrl, requestInit] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH);
			expect(requestInit?.body).toEqual(
				'{"productIds":["jira-software.ondemand","jira-core.ondemand","jira-incident-manager.ondemand","jira-product-discovery","jira-servicedesk.ondemand"]}',
			);
			expect(jiraSites).toEqual(mockSiteData);
		});

		it('should return an array of confluence sites using the experimental v2 endpoint', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH, {
				data: { products: mockProductsData },
			});

			await getAccessibleProducts('confluence');

			const [requestUrl, requestInit] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH);
			expect(requestInit?.body).toEqual('{"productIds":["confluence.ondemand"]}');
		});

		it('should throw with the error message if response is not ok', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH, {
				body: 'penguins jumping high',
				status: 500,
			});

			await expect(getAccessibleProducts('jira')).rejects.toEqual(
				new Error('penguins jumping high'),
			);
		});

		it('should throw a generic message if response body is empty', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH, { body: '', status: 401 });

			await expect(getAccessibleProducts('jira')).rejects.toEqual(
				new Error('Something went wrong'),
			);
		});
	});
});
