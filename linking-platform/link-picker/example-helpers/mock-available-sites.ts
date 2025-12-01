// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock/cjs/client';

import { mockedAccessibleProductsResult } from '@atlaskit/linking-common/mocks';

export const mockAccessibleProducts = () => {
	fetchMock.post(/\/gateway\/api\/v2\/accessible-products/, mockedAccessibleProductsResult, {
		delay: 10,
		overwriteRoutes: true,
	});
};
