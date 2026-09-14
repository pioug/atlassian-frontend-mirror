// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore - This was added due to this import failing with 'no declaration file found for 'fetch-mock/cjs/client' in the Jira Typecheck when the platform is being locally consumed, as Jira does not contain the 'platform/fetch-mock.d.ts' typing. Additionally since this is a custom typing with no properties set it is already adding no type value

import fetchMock from 'fetch-mock/cjs/client';

import { mockedAvailableSitesResultWithGatewayBaseUrl } from './available-sites-result';
import {
	AVAILABLE_SITES_ENDPOINT,
	AVAILABLE_SITES_UNIT_COMPLIANT_ENDPOINT,
} from './mockAvailableSites';

/**
 * Mock availableSites for a specific gatewayBaseUrl. Only matches requests with the gatewayBaseUrl in the url.
 * @param gatewayBaseUrl Base url without trailing slash
 */
export const mockAvailableSitesForGatewayUrl: any = (
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
