// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock/cjs/client';

import { mockedAvailableSitesResult } from '@atlaskit/linking-common/mocks';

export const mockAvailableSites = () => {
	fetchMock.post(/\/gateway\/api\/available-sites/, mockedAvailableSitesResult, {
		delay: 10,
		overwriteRoutes: true,
	});
};
