import type { MenuItem } from '@atlaskit/editor-common/extensions/types/utils';
import { act } from '@atlassian/testing-library/act';

import { AppVendorRequestError } from '../app-vendor/AppVendorRequestError';
import { fetchAppVendors } from '../app-vendor/fetchAppVendors';
import { prefetchAppVendors } from '../app-vendor/prefetchAppVendors';

jest.mock('../app-vendor/fetchAppVendors', () => ({
	fetchAppVendors: jest.fn(),
}));
jest.mock('@atlaskit/editor-common/monitoring/error', () => ({
	logException: jest.fn(),
}));

// A blocking failure stops lookups for the rest of the page load, so it lives in its own test file
// to keep its module-level state from leaking into other tests.

const connectItem = (key: string): Pick<MenuItem, 'app' | 'extensionType'> => ({
	app: { key, source: 'ecosystem' },
	extensionType: 'com.atlassian.confluence.macro.core',
});

const flushPromises = () => act(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));

describe('prefetchAppVendors blocking failures', () => {
	it('stops every lookup after a blocking failure', async () => {
		jest
			.mocked(fetchAppVendors)
			.mockRejectedValue(new AppVendorRequestError('Too many requests', 429));

		prefetchAppVendors([connectItem('throttled')]);
		await flushPromises();
		prefetchAppVendors([connectItem('throttled'), connectItem('other')]);
		await flushPromises();

		expect(fetchAppVendors).toHaveBeenCalledTimes(1);
	});
});
