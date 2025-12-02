// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore - This was added due to this import failing with 'no declaration file found for 'fetch-mock/cjs/client' in the Jira Typecheck when the platform is being locally consumed, as Jira does not contain the 'platform/fetch-mock.d.ts' typing. Additionally since this is a custom typing with no properties set it is already adding no type value
import fetchMock from 'fetch-mock/cjs/client';
import {
	mockedAvailableSitesResult,
	mockedAvailableSitesResultWithGatewayBaseUrl,
} from './available-sites-result';
import {
	mockedAccessibleProductsResult,
	mockedAccessibleResultWithGatewayBaseUrl,
} from './accessible-products-result';

const fetchAvailableSiteEndpoint = /\/gateway\/api\/available-sites/;
const fetchAccessibleProductsEndpoint = /\/gateway\/api\/v2\/accessible-products/;

export const mockAvailableSites = (responseData?: any) => {
	fetchMock.post(fetchAvailableSiteEndpoint, responseData || mockedAvailableSitesResult, {
		delay: 10,
		overwriteRoutes: true,
	});
};

export const mockAccessibleProducts = (responseData?: any) => {
	fetchMock.post(fetchAccessibleProductsEndpoint, responseData || mockedAccessibleProductsResult, {
		delay: 10,
		overwriteRoutes: true,
	});
};

/**
 * Mock availableSites for a specific gatewayBaseUrl. Only matches requests with the gatewayBaseUrl in the url.
 * @param gatewayBaseUrl Base url without trailing slash
 */
export const mockAvailableSitesForGatewayUrl = (gatewayBaseUrl: string) => {
	fetchMock.post(
		`${gatewayBaseUrl}/gateway/api/available-sites`,
		mockedAvailableSitesResultWithGatewayBaseUrl,
		{
			delay: 10,
			overwriteRoutes: true,
		},
	);
};

/**
 * Mock accessibleProducts for a specific gatewayBaseUrl. Only matches requests with the gatewayBaseUrl in the url.
 * @param gatewayBaseUrl Base url without trailing slash
 */
export const mockAccessibleProductsForGatewayUrl = (gatewayBaseUrl: string) => {
	fetchMock.post(
		`${gatewayBaseUrl}/gateway/api/v2/accessible-products`,
		mockedAccessibleResultWithGatewayBaseUrl,
		{
			delay: 10,
			overwriteRoutes: true,
		},
	);
};

export const mockAvailableSitesWithError = () => {
	fetchMock.post(fetchAvailableSiteEndpoint, 503, {
		delay: 10,
		overwriteRoutes: true,
	});
};

export const mockAccessibleProductsWithError = () => {
	fetchMock.post(fetchAccessibleProductsEndpoint, 503, {
		delay: 10,
		overwriteRoutes: true,
	});
};
