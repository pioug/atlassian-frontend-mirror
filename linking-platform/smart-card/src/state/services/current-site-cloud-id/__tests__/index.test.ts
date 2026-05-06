import * as linkingCommon from '@atlaskit/linking-common';

import {
	CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY,
	currentSiteCloudIdService,
	getCurrentSiteCloudId,
	getCachedCurrentSiteCloudIdAndRefresh,
} from '../index';

const requestSpy = jest.spyOn(linkingCommon, 'request');

/** Advances microtasks enough for deferred tenant_info work to persist to storage after fire-and-forget refresh. */
async function flushMicrotasks(iterations = 40): Promise<void> {
	for (let index = 0; index < iterations; index++) {
		// eslint-disable-next-line no-await-in-loop -- intentional sequential flush
		await Promise.resolve();
	}
}

describe('getCurrentSiteCloudId', () => {
	beforeEach(() => {
		currentSiteCloudIdService.clearCache();
		requestSpy.mockReset();
		window.localStorage?.clear?.();
	});

	it('GETs tenant_info for the given base URI when nothing is cached', async () => {
		requestSpy.mockResolvedValueOnce({ cloudId: 'cloud-a' });

		await expect(getCurrentSiteCloudId('https://site.example')).resolves.toBe('cloud-a');

		expect(requestSpy).toHaveBeenCalledTimes(1);
		expect(requestSpy).toHaveBeenCalledWith(
			'get',
			'https://site.example/_edge/tenant_info',
		);
	});

	it('returns undefined on failure and allows a subsequent call to request again', async () => {
		requestSpy.mockRejectedValueOnce(new Error('network'));
		await expect(getCurrentSiteCloudId()).resolves.toBeUndefined();
		expect(requestSpy).toHaveBeenCalledTimes(1);

		requestSpy.mockResolvedValueOnce({ cloudId: 'retry-id' });
		await expect(getCurrentSiteCloudId()).resolves.toBe('retry-id');
		expect(requestSpy).toHaveBeenCalledTimes(2);
	});

	it('awaited get resolves with readStoredCloudId after tenant_info throws if storage was populated during the request', async () => {
		requestSpy.mockImplementation(async () => {
			currentSiteCloudIdService.persistStoredCloudId('written-during-failing-request');
			throw new Error('network');
		});

		await expect(getCurrentSiteCloudId()).resolves.toBe('written-during-failing-request');

		expect(requestSpy).toHaveBeenCalledTimes(1);
	});

	it('falls back to stored cloud id when tenant_info fails (stored resolves immediately)', async () => {
		currentSiteCloudIdService.persistStoredCloudId('cached-tenant');
		requestSpy.mockRejectedValueOnce(new Error('network'));

		await expect(getCurrentSiteCloudId()).resolves.toBe('cached-tenant');

		await flushMicrotasks();

		expect(requestSpy).toHaveBeenCalledTimes(1);
		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBe('cached-tenant');
	});

	it('dedupes concurrent callers onto one in-flight tenant_info for the same base', async () => {
		requestSpy.mockResolvedValueOnce({ cloudId: 'shared' });

		const results = await Promise.all([
			getCurrentSiteCloudId(''),
			getCurrentSiteCloudId(''),
		]);

		expect(results).toEqual(['shared', 'shared']);
		expect(requestSpy).toHaveBeenCalledTimes(1);
		expect(requestSpy).toHaveBeenCalledWith('get', '/_edge/tenant_info');
	});

	it('dedupes concurrent getCurrentSiteCloudId regardless of base URI (first caller selects URL)', async () => {
		requestSpy.mockResolvedValueOnce({ cloudId: 'deduped' });

		const first = Promise.resolve().then(() => getCurrentSiteCloudId('https://a.example'));
		const second = Promise.resolve().then(() => getCurrentSiteCloudId('https://b.example'));

		await expect(Promise.all([first, second])).resolves.toEqual(['deduped', 'deduped']);

		expect(requestSpy).toHaveBeenCalledTimes(1);
		const tenantInfoUrl = requestSpy.mock.calls[0][1] as string;
		expect([
			'https://a.example/_edge/tenant_info',
			'https://b.example/_edge/tenant_info',
		]).toContain(tenantInfoUrl);
	});

	it('resolves stored cloud id immediately while tenant_info refresh still persists in the background', async () => {
		currentSiteCloudIdService.persistStoredCloudId('warm-start');
		requestSpy.mockResolvedValueOnce({ cloudId: 'refreshed' });

		await expect(getCurrentSiteCloudId('https://edge.example')).resolves.toBe('warm-start');

		expect(requestSpy).toHaveBeenCalledTimes(1);

		await flushMicrotasks();

		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBe('refreshed');
	});

	it('persists successful cloud id via smart-card StorageClient row', async () => {
		requestSpy.mockResolvedValueOnce({ cloudId: 'persisted-cloud' });

		await expect(getCurrentSiteCloudId('https://x.example')).resolves.toBe('persisted-cloud');

		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBe('persisted-cloud');
		expect(window.localStorage.getItem(CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY)).not.toBeNull();
	});

	it('does not persist tenant_info failures', async () => {
		requestSpy.mockRejectedValueOnce(new Error('network'));

		await expect(getCurrentSiteCloudId()).resolves.toBeUndefined();

		expect(window.localStorage.getItem(CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY)).toBeNull();
	});

	it('falls back to stored cloud id when tenant_info response omits cloudId', async () => {
		currentSiteCloudIdService.persistStoredCloudId('stored-fallback');
		requestSpy.mockResolvedValueOnce({});

		await expect(getCurrentSiteCloudId()).resolves.toBe('stored-fallback');

		expect(requestSpy).toHaveBeenCalledTimes(1);

		await flushMicrotasks();
		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBe('stored-fallback');
	});

	it('falls back to stored cloud id when tenant_info returns empty string cloudId', async () => {
		currentSiteCloudIdService.persistStoredCloudId('stored-fallback');
		requestSpy.mockResolvedValueOnce({ cloudId: '' });

		await expect(getCurrentSiteCloudId()).resolves.toBe('stored-fallback');

		expect(requestSpy).toHaveBeenCalledTimes(1);

		await flushMicrotasks();
		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBe('stored-fallback');
	});

	it('returns undefined when tenant_info omits cloudId and storage is empty', async () => {
		requestSpy.mockResolvedValueOnce({});

		await expect(getCurrentSiteCloudId()).resolves.toBeUndefined();

		expect(requestSpy).toHaveBeenCalledTimes(1);
	});

	it('returns undefined when tenant_info returns empty string cloudId and storage is empty', async () => {
		requestSpy.mockResolvedValueOnce({ cloudId: '' });

		await expect(getCurrentSiteCloudId()).resolves.toBeUndefined();

		expect(requestSpy).toHaveBeenCalledTimes(1);
	});

	it('does not call tenant_info again after first successful resolution (session pin)', async () => {
		requestSpy.mockResolvedValueOnce({ cloudId: 'wave-one' });

		await expect(getCurrentSiteCloudId()).resolves.toBe('wave-one');

		requestSpy.mockResolvedValueOnce({ cloudId: 'wave-two-would-not-fetch' });

		await expect(getCurrentSiteCloudId()).resolves.toBe('wave-one');

		await flushMicrotasks();

		expect(requestSpy).toHaveBeenCalledTimes(1);
		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBe('wave-one');
	});

	it('runs tenant_info again after clearCache()', async () => {
		requestSpy.mockResolvedValueOnce({ cloudId: 'first-fetch' });

		await expect(getCurrentSiteCloudId()).resolves.toBe('first-fetch');

		currentSiteCloudIdService.clearCache();
		expect(window.localStorage.getItem(CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY)).toBeNull();
		requestSpy.mockResolvedValueOnce({ cloudId: 'second-fetch' });

		await expect(getCurrentSiteCloudId()).resolves.toBe('second-fetch');

		await flushMicrotasks();

		expect(requestSpy).toHaveBeenCalledTimes(2);
		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBe('second-fetch');
	});
});

describe('getCachedCurrentSiteCloudIdAndRefresh', () => {
	beforeEach(() => {
		currentSiteCloudIdService.clearCache();
		window.localStorage?.clear?.();
		requestSpy.mockClear();
		requestSpy.mockResolvedValue({});
	});

	it('returns undefined when the storage key is missing', () => {
		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBeUndefined();
	});

	it('returns stored cloud id from smart-card scoped storage', () => {
		currentSiteCloudIdService.persistStoredCloudId('from-storage');

		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBe('from-storage');
		expect(requestSpy).toHaveBeenCalled();
	});

	it('starts tenant_info on cached read and refresh when nothing was in flight yet (cached read returns undefined until edge fills storage)', async () => {
		requestSpy.mockResolvedValueOnce({ cloudId: 'cached-read-kicks-edge' });

		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBeUndefined();

		expect(requestSpy).toHaveBeenCalledTimes(1);
		expect(requestSpy).toHaveBeenCalledWith('get', '/_edge/tenant_info');

		await flushMicrotasks();

		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBe('cached-read-kicks-edge');
	});

	it('starts tenant_info on cached read and refresh when storage already has an id (background refresh)', async () => {
		currentSiteCloudIdService.persistStoredCloudId('ls-cache');
		requestSpy.mockResolvedValueOnce({ cloudId: 'refreshed-edge' });

		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBe('ls-cache');

		expect(requestSpy).toHaveBeenCalledTimes(1);

		await flushMicrotasks();

		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBe('refreshed-edge');
	});

	it('does not call tenant_info again when cached read and refresh runs while the same refresh is still pending', () => {
		requestSpy.mockImplementation(
			() =>
				new Promise<{ cloudId: string }>(() => {
					/* deliberately unresolved */
				}),
		);

		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBeUndefined();
		expect(requestSpy).toHaveBeenCalledTimes(1);

		currentSiteCloudIdService.persistStoredCloudId('written-while-pending');

		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBe('written-while-pending');
		expect(requestSpy).toHaveBeenCalledTimes(1);
	});

	it('returns undefined when the stored value is the legacy undefined string sentinel', () => {
		currentSiteCloudIdService.persistStoredCloudId('undefined');

		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBeUndefined();
	});

	it('returns undefined via getCachedCloudIdAndRefresh when persisted value normalizes as empty string', () => {
		window.localStorage.setItem(
			CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY,
			JSON.stringify({ value: '' }),
		);

		expect(currentSiteCloudIdService.getCachedCloudIdAndRefresh()).toBeUndefined();
	});

	it('returns undefined via getCachedCloudIdAndRefresh when stored parsed value is not a string', () => {
		window.localStorage.setItem(
			CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY,
			JSON.stringify({ value: 404 }),
		);

		expect(currentSiteCloudIdService.getCachedCloudIdAndRefresh()).toBeUndefined();
	});
});

describe('persistStoredCloudId', () => {
	beforeEach(() => {
		currentSiteCloudIdService.clearCache();
		window.localStorage?.clear?.();
		requestSpy.mockClear();
		requestSpy.mockResolvedValue({});
	});

	it('does not write when cloudId is empty', () => {
		currentSiteCloudIdService.persistStoredCloudId('');

		expect(window.localStorage.getItem(CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY)).toBeNull();
	});

	it('writes tenant cloud id when called', () => {
		currentSiteCloudIdService.persistStoredCloudId('via-service');

		expect(getCachedCurrentSiteCloudIdAndRefresh()).toBe('via-service');
	});
});

afterAll(() => {
	requestSpy.mockRestore();
});
