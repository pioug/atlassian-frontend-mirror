// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock/cjs/client';

import {
	mockedAccessibleProductsResult,
	mockedAccessibleResultWithGatewayBaseUrl,
} from './accessible-products-result';
import {
	mockedAvailableSitesResult,
	mockedAvailableSitesResultWithGatewayBaseUrl,
} from './available-sites-result';

const AVAILABLE_SITES_ENDPOINT = '/gateway/api/available-sites';
const AVAILABLE_SITES_UNIT_COMPLIANT_ENDPOINT = '/gateway/api/experimental/available-sites';
const ACCESSIBLE_PRODUCTS_ENDPOINT = '/gateway/api/v2/accessible-products';
const ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_ENDPOINT =
	'/gateway/api/experimental/v2/accessible-products';
const fetchAvailableSiteEndpoint = /\/gateway\/api(?:\/experimental)?\/available-sites/;
const fetchAccessibleProductsEndpoint =
	/\/gateway\/api(?:\/experimental)?\/v2\/accessible-products/;

export const mockAvailableSites = (responseData?: any): void => {
	fetchMock.post(fetchAvailableSiteEndpoint, responseData || mockedAvailableSitesResult, {
		delay: 10,
		overwriteRoutes: true,
	});
};

export const mockAccessibleProducts = (responseData?: any): void => {
	fetchMock.post(fetchAccessibleProductsEndpoint, responseData || mockedAccessibleProductsResult, {
		delay: 10,
		overwriteRoutes: true,
	});
};

/**
 * Mock availableSites for a specific gatewayBaseUrl. Only matches requests with the gatewayBaseUrl in the url.
 * @param gatewayBaseUrl Base url without trailing slash
 */
export const mockAvailableSitesForGatewayUrl = (
	gatewayBaseUrl: string,
	useUnitCompliantEndpoint = false,
): void => {
	fetchMock.post(
		`${gatewayBaseUrl}${
			useUnitCompliantEndpoint ? AVAILABLE_SITES_UNIT_COMPLIANT_ENDPOINT : AVAILABLE_SITES_ENDPOINT
		}`,
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
export const mockAccessibleProductsForGatewayUrl = (
	gatewayBaseUrl: string,
	useUnitCompliantEndpoint = false,
): void => {
	fetchMock.post(
		`${gatewayBaseUrl}${
			useUnitCompliantEndpoint
				? ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_ENDPOINT
				: ACCESSIBLE_PRODUCTS_ENDPOINT
		}`,
		mockedAccessibleResultWithGatewayBaseUrl,
		{
			delay: 10,
			overwriteRoutes: true,
		},
	);
};

export const mockAvailableSitesWithError = (): void => {
	fetchMock.post(fetchAvailableSiteEndpoint, 503, {
		delay: 10,
		overwriteRoutes: true,
	});
};

export const mockAccessibleProductsWithError = (): void => {
	fetchMock.post(fetchAccessibleProductsEndpoint, 503, {
		delay: 10,
		overwriteRoutes: true,
	});
};
