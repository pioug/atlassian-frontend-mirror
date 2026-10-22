import type { MenuItem } from '@atlaskit/editor-common/extensions/types/utils';
import { logException } from '@atlaskit/editor-common/monitoring/error';
import { act } from '@atlassian/testing-library/act';
import { renderHook } from '@atlassian/testing-library/render-hook';

import { appVendorCache } from '../app-vendor/appVendorCache';
import { AppVendorRequestError } from '../app-vendor/AppVendorRequestError';
import { fetchAppVendors } from '../app-vendor/fetchAppVendors';
import type { AppVendorLookup } from '../app-vendor/getAppVendorLookup';
import { prefetchAppVendors } from '../app-vendor/prefetchAppVendors';
import { useAppVendorName } from '../app-vendor/useAppVendorName';

jest.mock('../app-vendor/fetchAppVendors', () => ({
	fetchAppVendors: jest.fn(),
}));
jest.mock('@atlaskit/editor-common/monitoring/error', () => ({
	logException: jest.fn(),
}));

// The cache keeps names per app for the whole page load, so each test uses its own app keys. The
// page-wide blocking behaviour is covered in prefetchAppVendors-blocking.test.ts, which gets its own
// module registry.

const fetchAppVendorsMock = jest.mocked(fetchAppVendors);

type VendorItem = Pick<MenuItem, 'app' | 'extensionType'>;

const connectItem = (key: string): VendorItem => ({
	app: { key, source: 'ecosystem' },
	extensionType: 'com.atlassian.confluence.macro.core',
});
const internalItem: VendorItem = {
	app: { key: 'confluence.macros', source: 'internal' },
	extensionType: 'com.atlassian.confluence.macro.core',
};

const resolveWithVendor = (name: string | null) =>
	fetchAppVendorsMock.mockImplementation((lookups: AppVendorLookup[]) =>
		Promise.resolve(new Map(lookups.map(({ id }) => [id, name]))),
	);

const flushPromises = () => act(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));

describe('prefetchAppVendors', () => {
	beforeEach(() => {
		fetchAppVendorsMock.mockReset();
	});

	it('fetches only ecosystem apps, once per app', async () => {
		resolveWithVendor('Gliffy');

		prefetchAppVendors([connectItem('dedupe'), connectItem('dedupe'), internalItem]);
		await flushPromises();

		expect(fetchAppVendorsMock).toHaveBeenCalledTimes(1);
		expect(fetchAppVendorsMock.mock.calls[0][0]).toEqual([
			{ attempts: 1, id: 'connect:dedupe', kind: 'connect', value: 'dedupe' },
		]);
	});

	it('splits lookups into batches of 15 and runs at most 3 at a time', async () => {
		fetchAppVendorsMock.mockReturnValue(new Promise(() => {}));
		const items = Array.from({ length: 50 }, (_, index) => connectItem(`batch-${index}`));

		prefetchAppVendors(items);
		await flushPromises();

		expect(fetchAppVendorsMock).toHaveBeenCalledTimes(3);
		expect(fetchAppVendorsMock.mock.calls.map(([lookups]) => lookups.length)).toEqual([15, 15, 15]);
	});

	it('skips lookups that are in flight or already resolved', async () => {
		resolveWithVendor(null);

		prefetchAppVendors([connectItem('in-flight')]);
		prefetchAppVendors([connectItem('in-flight')]);
		await flushPromises();
		prefetchAppVendors([connectItem('in-flight')]);
		await flushPromises();

		expect(fetchAppVendorsMock).toHaveBeenCalledTimes(1);
	});

	it('updates subscribers when a vendor name resolves', async () => {
		resolveWithVendor('Gliffy');
		const vendorName = renderHook(() => useAppVendorName('connect:subscriber'));
		expect(vendorName.current).toBeUndefined();

		prefetchAppVendors([connectItem('subscriber')]);
		await flushPromises();

		expect(vendorName.current).toBe('Gliffy');
	});

	it('returns null for unlisted apps and undefined without a lookup id', async () => {
		resolveWithVendor(null);
		prefetchAppVendors([connectItem('unlisted')]);
		await flushPromises();

		expect(renderHook(() => useAppVendorName('connect:unlisted')).current).toBeNull();
		expect(renderHook(() => useAppVendorName(undefined)).current).toBeUndefined();
	});

	it('retries a failed lookup on later calls, up to 3 attempts', async () => {
		fetchAppVendorsMock.mockRejectedValue(new AppVendorRequestError('Server error', 503));

		for (let call = 0; call < 5; call++) {
			prefetchAppVendors([connectItem('flaky')]);
			await flushPromises();
		}

		expect(fetchAppVendorsMock).toHaveBeenCalledTimes(3);
	});

	it('retries lookups missing from a successful response', async () => {
		fetchAppVendorsMock.mockResolvedValueOnce(new Map([['connect:listed', 'Gliffy']]));
		prefetchAppVendors([connectItem('listed'), connectItem('errored')]);
		await flushPromises();

		resolveWithVendor('Mermaid');
		prefetchAppVendors([connectItem('listed'), connectItem('errored')]);
		await flushPromises();

		expect(fetchAppVendorsMock).toHaveBeenCalledTimes(2);
		expect(fetchAppVendorsMock.mock.calls[1][0]).toEqual([
			{ attempts: 2, id: 'connect:errored', kind: 'connect', value: 'errored' },
		]);
		expect(renderHook(() => useAppVendorName('connect:errored')).current).toBe('Mermaid');
	});

	it('keeps resolved names and notifies other subscribers when one subscriber throws', async () => {
		resolveWithVendor('Gliffy');
		const error = new Error('Listener failed');
		const throwingListener = () => {
			throw error;
		};
		const nextListener = jest.fn();
		appVendorCache.listeners.add(throwingListener);
		appVendorCache.listeners.add(nextListener);

		try {
			prefetchAppVendors([connectItem('throwing-listener')]);
			await flushPromises();
		} finally {
			appVendorCache.listeners.delete(throwingListener);
			appVendorCache.listeners.delete(nextListener);
		}
		prefetchAppVendors([connectItem('throwing-listener')]);
		await flushPromises();

		expect(logException).toHaveBeenCalledWith(error, expect.any(Object));
		expect(nextListener).toHaveBeenCalled();
		expect(renderHook(() => useAppVendorName('connect:throwing-listener')).current).toBe('Gliffy');
		expect(fetchAppVendorsMock).toHaveBeenCalledTimes(1);
	});
});
