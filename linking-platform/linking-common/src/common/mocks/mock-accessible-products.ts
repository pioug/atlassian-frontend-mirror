// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore - This was added due to this import failing with 'no declaration file found for 'fetch-mock/cjs/client' in the Jira Typecheck when the platform is being locally consumed, as Jira does not contain the 'platform/fetch-mock.d.ts' typing. Additionally since this is a custom typing with no properties set it is already adding no type value

import fetchMock from 'fetch-mock/cjs/client';

import { mockedAccessibleProductsResult } from './accessible-products-result';
import { fetchAccessibleProductsEndpoint } from './fetch-accessible-products-endpoint';

export const mockAccessibleProducts: any = (responseData?: any): void => {
	fetchMock.post(fetchAccessibleProductsEndpoint, responseData || mockedAccessibleProductsResult, {
		delay: 10,
		overwriteRoutes: true,
	});
};
