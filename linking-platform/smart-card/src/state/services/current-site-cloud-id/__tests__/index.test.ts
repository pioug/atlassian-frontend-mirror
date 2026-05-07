import * as linkingCommon from '@atlaskit/linking-common';

import {
	CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY,
	CURRENT_SITE_CLOUD_ID_TTL_MS,
	getCurrentSiteCloudIdLocalStorageKey,
	currentSiteCloudIdService,
	getCurrentSiteCloudId,
	getCurrentSiteCloudIdSync,
} from '../index';

const requestSpy = jest.spyOn(linkingCommon, 'request');


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

	it('returns stored cloud id without calling tenant_info', async () => {
		currentSiteCloudIdService.persistStoredCloudId('cached-tenant');
		requestSpy.mockRejectedValueOnce(new Error('network'));

		await expect(getCurrentSiteCloudId()).resolves.toBe('cached-tenant');

		expect(requestSpy).not.toHaveBeenCalled();
		expect(getCurrentSiteCloudIdSync()).toBe('cached-tenant');
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

	it('uses separate in-flight tenant_info requests for different base URIs', async () => {
		requestSpy
			.mockResolvedValueOnce({ cloudId: 'cloud-a' })
			.mockResolvedValueOnce({ cloudId: 'cloud-b' });

		const [first, second] = await Promise.all([
			getCurrentSiteCloudId('https://a.example'),
			getCurrentSiteCloudId('https://b.example'),
		]);

		expect([first, second]).toEqual(['cloud-a', 'cloud-b']);
		expect(requestSpy).toHaveBeenCalledTimes(2);
		expect(requestSpy).toHaveBeenNthCalledWith(1, 'get', 'https://a.example/_edge/tenant_info');
		expect(requestSpy).toHaveBeenNthCalledWith(2, 'get', 'https://b.example/_edge/tenant_info');
	});

	it('scopes stored cloud id reads by base URI', async () => {
		currentSiteCloudIdService.persistStoredCloudId('warm-start', 'https://edge.example');
		requestSpy.mockResolvedValueOnce({ cloudId: 'other-site' });

		await expect(getCurrentSiteCloudId('https://edge.example')).resolves.toBe('warm-start');
		await expect(getCurrentSiteCloudId('https://other.example')).resolves.toBe('other-site');

		expect(requestSpy).toHaveBeenCalledTimes(1);
		expect(getCurrentSiteCloudIdSync('https://edge.example')).toBe('warm-start');
		expect(getCurrentSiteCloudIdSync('https://other.example')).toBe('other-site');
	});

	it('persists successful cloud id via smart-card StorageClient row', async () => {
		requestSpy.mockResolvedValueOnce({ cloudId: 'persisted-cloud' });

		await expect(getCurrentSiteCloudId('https://x.example')).resolves.toBe('persisted-cloud');

		expect(getCurrentSiteCloudIdSync('https://x.example')).toBe('persisted-cloud');
		const row = window.localStorage.getItem(getCurrentSiteCloudIdLocalStorageKey('https://x.example'));
		expect(row).not.toBeNull();
		expect(JSON.parse(row ?? '{}').expires).toBeGreaterThanOrEqual(
			Date.now() + CURRENT_SITE_CLOUD_ID_TTL_MS,
		);
	});

	it('does not persist tenant_info failures', async () => {
		requestSpy.mockRejectedValueOnce(new Error('network'));

		await expect(getCurrentSiteCloudId()).resolves.toBeUndefined();

		expect(window.localStorage.getItem(CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY)).toBeNull();
	});

	it('falls back to stored cloud id when tenant_info response omits cloudId and storage was populated during request', async () => {
		requestSpy.mockImplementation(async () => {
			currentSiteCloudIdService.persistStoredCloudId('stored-fallback');
			return {};
		});

		await expect(getCurrentSiteCloudId()).resolves.toBe('stored-fallback');

		expect(requestSpy).toHaveBeenCalledTimes(1);
		expect(getCurrentSiteCloudIdSync()).toBe('stored-fallback');
	});

	it('falls back to stored cloud id when tenant_info returns empty string cloudId and storage was populated during request', async () => {
		requestSpy.mockImplementation(async () => {
			currentSiteCloudIdService.persistStoredCloudId('stored-fallback');
			return { cloudId: '' };
		});

		await expect(getCurrentSiteCloudId()).resolves.toBe('stored-fallback');

		expect(requestSpy).toHaveBeenCalledTimes(1);
		expect(getCurrentSiteCloudIdSync()).toBe('stored-fallback');
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

	it('does not call tenant_info again when stored cloud id exists after first successful resolution', async () => {
		requestSpy.mockResolvedValueOnce({ cloudId: 'wave-one' });

		await expect(getCurrentSiteCloudId()).resolves.toBe('wave-one');
		await expect(getCurrentSiteCloudId()).resolves.toBe('wave-one');

		expect(requestSpy).toHaveBeenCalledTimes(1);
		expect(getCurrentSiteCloudIdSync()).toBe('wave-one');
	});

	it('clearCache only clears in-flight dedupe, not stored cloud id', async () => {
		requestSpy.mockResolvedValueOnce({ cloudId: 'first-fetch' });

		await expect(getCurrentSiteCloudId()).resolves.toBe('first-fetch');

		currentSiteCloudIdService.clearCache();
		requestSpy.mockResolvedValueOnce({ cloudId: 'second-fetch-would-not-fetch' });

		await expect(getCurrentSiteCloudId()).resolves.toBe('first-fetch');

		expect(requestSpy).toHaveBeenCalledTimes(1);
		expect(getCurrentSiteCloudIdSync()).toBe('first-fetch');
	});
});

describe('getCurrentSiteCloudIdSync', () => {
	beforeEach(() => {
		currentSiteCloudIdService.clearCache();
		window.localStorage?.clear?.();
		requestSpy.mockClear();
		requestSpy.mockResolvedValue({});
	});

	it('returns undefined when the storage key is missing', () => {
		expect(getCurrentSiteCloudIdSync()).toBeUndefined();
	});

	it('returns stored cloud id from smart-card scoped storage', () => {
		currentSiteCloudIdService.persistStoredCloudId('from-storage');

		expect(getCurrentSiteCloudIdSync()).toBe('from-storage');
		expect(requestSpy).not.toHaveBeenCalled();
	});

	it('does not start tenant_info on sync read when nothing was cached', () => {
		requestSpy.mockResolvedValueOnce({ cloudId: 'sync-would-not-fetch' });

		expect(getCurrentSiteCloudIdSync()).toBeUndefined();
		expect(requestSpy).not.toHaveBeenCalled();
	});

	it('does not start tenant_info on sync read when storage already has an id', () => {
		currentSiteCloudIdService.persistStoredCloudId('ls-cache');
		requestSpy.mockResolvedValueOnce({ cloudId: 'refreshed-edge' });

		expect(getCurrentSiteCloudIdSync()).toBe('ls-cache');
		expect(requestSpy).not.toHaveBeenCalled();
	});

	it('returns base-URI scoped stored cloud id synchronously', () => {
		currentSiteCloudIdService.persistStoredCloudId('cloud-a', 'https://a.example/');
		currentSiteCloudIdService.persistStoredCloudId('cloud-b', 'https://b.example');

		expect(getCurrentSiteCloudIdSync('https://a.example')).toBe('cloud-a');
		expect(getCurrentSiteCloudIdSync('https://b.example')).toBe('cloud-b');
		expect(requestSpy).not.toHaveBeenCalled();
	});

	it('returns undefined when the stored value is the legacy undefined string sentinel', () => {
		currentSiteCloudIdService.persistStoredCloudId('undefined');

		expect(getCurrentSiteCloudIdSync()).toBeUndefined();
	});

	it('returns undefined when the stored cloud id is expired', () => {
		jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
		currentSiteCloudIdService.persistStoredCloudId('expired-cloud', 'https://expired.example');

		jest.setSystemTime(new Date('2026-01-02T00:00:00.001Z'));

		expect(getCurrentSiteCloudIdSync('https://expired.example')).toBeUndefined();
		expect(requestSpy).not.toHaveBeenCalled();
		jest.useRealTimers();
	});

	it('returns undefined via getStoredCloudId when persisted value normalizes as empty string', () => {
		window.localStorage.setItem(
			CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY,
			JSON.stringify({ value: '' }),
		);

		expect(currentSiteCloudIdService.getStoredCloudId()).toBeUndefined();
	});

	it('returns undefined via getStoredCloudId when stored parsed value is not a string', () => {
		window.localStorage.setItem(
			CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY,
			JSON.stringify({ value: 404 }),
		);

		expect(currentSiteCloudIdService.getStoredCloudId()).toBeUndefined();
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

		expect(getCurrentSiteCloudIdSync()).toBe('via-service');
	});
});

afterAll(() => {
	requestSpy.mockRestore();
});
