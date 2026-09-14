// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore - This was added due to this import failing with 'no declaration file found for 'fetch-mock/cjs/client' in the Jira Typecheck when the platform is being locally consumed, as Jira does not contain the 'platform/fetch-mock.d.ts' typing. Additionally since this is a custom typing with no properties set it is already adding no type value

import fetchMock from 'fetch-mock/cjs/client';

import { mockedAvailableSitesResult } from './available-sites-result';
import { fetchAvailableSiteEndpoint } from './fetch-available-site-endpoint';

export const mockAvailableSites: any = (responseData?: any): void => {
	fetchMock.post(fetchAvailableSiteEndpoint, responseData || mockedAvailableSitesResult, {
		delay: 10,
		overwriteRoutes: true,
	});
};
