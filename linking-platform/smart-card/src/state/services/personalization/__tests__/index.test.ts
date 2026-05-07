import { StorageClient } from '@atlaskit/frontend-utilities/storage-client';

import {
	PERSONALIZATION_STORAGE_ITEM_KEY_PREFIX,
	PERSONALIZATION_STORAGE_SCOPE,
	PersonalizationService,
} from '../index';

/** Matches PersonalizationService pct-map naming; physical key uses `StorageClient` join. */
function pctMapStorageItemKey(cloudId: string, traitName: string): string {
	return `${PERSONALIZATION_STORAGE_ITEM_KEY_PREFIX}${encodeURIComponent(cloudId)}:${encodeURIComponent(
		traitName,
	)}`;
}

function pctMapLocalStorageRowKey(cloudId: string, traitName: string): string {
	return `${PERSONALIZATION_STORAGE_SCOPE}_${pctMapStorageItemKey(cloudId, traitName)}`;
}

function mockFetchResponse(body: unknown, options: { ok?: boolean } = {}): Response {
	const { ok = true } = options;
	return {
		ok,
		json: () => Promise.resolve(body),
	} as Response;
}

describe('PersonalizationService', () => {
	let service: PersonalizationService;
	let fetchSpy: jest.SpyInstance;
	let smartCardStorage: StorageClient;

	beforeEach(() => {
		localStorage.clear();
		smartCardStorage = new StorageClient(PERSONALIZATION_STORAGE_SCOPE);
		service = new PersonalizationService();
		fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
			mockFetchResponse({
				attributes: [{ name: 'my_trait', value: '{"a": 10}' }],
			}),
		);
	});

	afterEach(() => {
		fetchSpy.mockRestore();
		localStorage.clear();
	});

	it('GETs the site traits URL for the explicit cloud id with credentials and JSON accept', async () => {
		await service.getProviderPctMap('cloud-abc', 'my_trait');

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(fetchSpy).toHaveBeenCalledWith('/gateway/api/tap-delivery/api/v3/personalization/site/cloud-abc', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		});
	});

	it('returns the parsed object when the trait value is a JSON object string', async () => {
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [
					{
						name: 'sl_3p_connected_providers_site_pct',
						value: '{"google-object-provider": 42}',
					},
				],
			}),
		);

		await expect(service.getProviderPctMap('site-1', 'sl_3p_connected_providers_site_pct')).resolves.toEqual({
			'google-object-provider': 42,
		});
	});

	it('returns undefined when the response is not ok', async () => {
		fetchSpy.mockResolvedValueOnce(mockFetchResponse({}, { ok: false }));

		await expect(service.getProviderPctMap('cloud-abc', 'trait')).resolves.toBeUndefined();
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('returns undefined when the trait is missing', async () => {
		fetchSpy.mockResolvedValueOnce(mockFetchResponse({ attributes: [{ name: 'other', value: '{}' }] }));

		await expect(service.getProviderPctMap('cloud-abc', 'wanted')).resolves.toBeUndefined();
	});

	it('returns undefined when the trait value is not a string', async () => {
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [{ name: 't', value: true }],
			}),
		);

		await expect(service.getProviderPctMap('cloud-abc', 't')).resolves.toBeUndefined();
	});

	it('returns undefined when the trait value is not a JSON object', async () => {
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [{ name: 't', value: '"just-a-string"' }],
			}),
		);

		await expect(service.getProviderPctMap('cloud-abc', 't')).resolves.toBeUndefined();
	});

	it('returns undefined when the trait value is invalid JSON', async () => {
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [{ name: 't', value: '{not-json' }],
			}),
		);

		await expect(service.getProviderPctMap('cloud-abc', 't')).resolves.toBeUndefined();
	});

	it('dedupes parallel callers for the same trait onto one fetch', async () => {
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [{ name: 'trait-x', value: '{"k": 1}' }],
			}),
		);

		const [first, second] = await Promise.all([
			service.getProviderPctMap('cloud-abc', 'trait-x'),
			service.getProviderPctMap('cloud-abc', 'trait-x'),
		]);

		expect(first).toEqual({ k: 1 });
		expect(second).toEqual({ k: 1 });
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('uses separate in-flight work for different trait names on the same cloud', async () => {
		fetchSpy
			.mockResolvedValueOnce(
				mockFetchResponse({ attributes: [{ name: 'trait-a', value: '{"x": 1}' }] }),
			)
			.mockResolvedValueOnce(
				mockFetchResponse({ attributes: [{ name: 'trait-b', value: '{"y": 2}' }] }),
			);

		const [a, b] = await Promise.all([
			service.getProviderPctMap('cloud-abc', 'trait-a'),
			service.getProviderPctMap('cloud-abc', 'trait-b'),
		]);

		expect(a).toEqual({ x: 1 });
		expect(b).toEqual({ y: 2 });
		expect(fetchSpy).toHaveBeenCalledTimes(2);
	});

	it('dedupes only in-flight work and does not reuse settled maps beyond storage TTL semantics', async () => {
		fetchSpy
			.mockResolvedValueOnce(
				mockFetchResponse({
					attributes: [{ name: 't', value: '{"cached": 99}' }],
				}),
			)
			.mockResolvedValueOnce(
				mockFetchResponse({
					attributes: [{ name: 't', value: '{"cached": 100}' }],
				}),
			);

		await expect(service.getProviderPctMap('cloud-abc', 't')).resolves.toEqual({ cached: 99 });
		await expect(service.getProviderPctMap('cloud-abc', 't')).resolves.toEqual({ cached: 100 });

		expect(fetchSpy).toHaveBeenCalledTimes(2);
	});

	it('returns undefined when fetch rejects and retries on the next call', async () => {
		fetchSpy
			.mockRejectedValueOnce(new Error('network'))
			.mockResolvedValueOnce(mockFetchResponse({ attributes: [{ name: 't', value: '{\"ok\": 1}' }] }));

		await expect(service.getProviderPctMap('cloud-abc', 't')).resolves.toBeUndefined();
		await expect(service.getProviderPctMap('cloud-abc', 't')).resolves.toEqual({ ok: 1 });

		expect(fetchSpy).toHaveBeenCalledTimes(2);
	});

	it('clearCache allows a new fetch after the map was cleared', async () => {
		fetchSpy
			.mockResolvedValueOnce(
				mockFetchResponse({ attributes: [{ name: 't', value: '{"n": 1}' }] }),
			)
			.mockResolvedValueOnce(
				mockFetchResponse({ attributes: [{ name: 't', value: '{"n": 2}' }] }),
			);

		await expect(service.getProviderPctMap('cloud-abc', 't')).resolves.toEqual({ n: 1 });
		service.clearCache();
		await expect(service.getProviderPctMap('cloud-abc', 't')).resolves.toEqual({ n: 2 });

		expect(fetchSpy).toHaveBeenCalledTimes(2);
	});

	it('persists successful maps to localStorage', async () => {
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [{ name: 'trait-y', value: '{"a": 10}' }],
			}),
		);
		await expect(service.getProviderPctMap('cloud-x', 'trait-y')).resolves.toEqual({ a: 10 });

		expect(smartCardStorage.getItem(pctMapStorageItemKey('cloud-x', 'trait-y'))).toEqual({
			a: 10,
		});
		expect(JSON.parse(localStorage.getItem(pctMapLocalStorageRowKey('cloud-x', 'trait-y')) ?? '{}').expires).toBeGreaterThanOrEqual(
			Date.now() + 24 * 60 * 60 * 1000,
		);
	});

	it('clearCache clears persisted localStorage maps for this prefix', async () => {
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [{ name: 't-storage', value: '{"n": 1}' }],
			}),
		);

		await expect(service.getProviderPctMap('c-storage', 't-storage')).resolves.toEqual({ n: 1 });
		expect(smartCardStorage.getItem(pctMapStorageItemKey('c-storage', 't-storage'))).toEqual({
			n: 1,
		});
		service.clearCache();
		expect(smartCardStorage.getItem(pctMapStorageItemKey('c-storage', 't-storage'))).toBeUndefined();
	});

	it('getProviderPctMapSync returns null when localStorage has no entry without fetching', () => {
		expect(service.getProviderPctMapSync('cloud-abc', 't')).toBeNull();
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('does not fetch when cloudId is missing', async () => {
		expect(service.getProviderPctMapSync(undefined, 't')).toBeNull();
		await expect(service.getProviderPctMap(undefined, 't')).resolves.toBeUndefined();

		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('getProviderPctMapSync returns stored map synchronously without starting async work', () => {
		smartCardStorage.setItemWithExpiry(pctMapStorageItemKey('c', 'stored-trait'), {
			'google-object-provider': 7,
		});

		const syncResult = service.getProviderPctMapSync('c', 'stored-trait');

		expect(syncResult).toEqual({ 'google-object-provider': 7 });
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('uses separate in-flight work for the same trait on different cloud ids', async () => {
		fetchSpy
			.mockResolvedValueOnce(mockFetchResponse({ attributes: [{ name: 'trait-x', value: '{\"a\": 1}' }] }))
			.mockResolvedValueOnce(mockFetchResponse({ attributes: [{ name: 'trait-x', value: '{\"b\": 2}' }] }));

		const [a, b] = await Promise.all([
			service.getProviderPctMap('cloud-a', 'trait-x'),
			service.getProviderPctMap('cloud-b', 'trait-x'),
		]);

		expect(a).toEqual({ a: 1 });
		expect(b).toEqual({ b: 2 });
		expect(fetchSpy).toHaveBeenCalledTimes(2);
	});

	it('stores and reads maps by cloudId plus traitName', async () => {
		fetchSpy
			.mockResolvedValueOnce(mockFetchResponse({ attributes: [{ name: 'same-trait', value: '{\"a\": 1}' }] }))
			.mockResolvedValueOnce(mockFetchResponse({ attributes: [{ name: 'same-trait', value: '{\"b\": 2}' }] }));

		await expect(service.getProviderPctMap('cloud-a', 'same-trait')).resolves.toEqual({ a: 1 });
		await expect(service.getProviderPctMap('cloud-b', 'same-trait')).resolves.toEqual({ b: 2 });

		expect(service.getProviderPctMapSync('cloud-a', 'same-trait')).toEqual({ a: 1 });
		expect(service.getProviderPctMapSync('cloud-b', 'same-trait')).toEqual({ b: 2 });
		expect(localStorage.getItem(pctMapLocalStorageRowKey('cloud-a', 'same-trait'))).not.toBeNull();
		expect(localStorage.getItem(pctMapLocalStorageRowKey('cloud-b', 'same-trait'))).not.toBeNull();
	});

	it('returns null when stored provider map is expired', () => {
		jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
		smartCardStorage.setItemWithExpiry(pctMapStorageItemKey('cloud-abc', 'expired'), { a: 1 }, 1000);

		jest.setSystemTime(new Date('2026-01-01T00:00:01.001Z'));

		expect(service.getProviderPctMapSync('cloud-abc', 'expired')).toBeNull();
		expect(fetchSpy).not.toHaveBeenCalled();
		jest.useRealTimers();
	});

	it('getProviderPctMapSync returns null when localStorage payload is unreadable JSON', () => {
		localStorage.setItem(pctMapLocalStorageRowKey('c', 't'), '{{');

		expect(service.getProviderPctMapSync('c', 't')).toBeNull();
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('getProviderPctMapSync returns null when stored value is not shape of ProviderPctMap', () => {
		localStorage.setItem(
			pctMapLocalStorageRowKey('c', 't'),
			JSON.stringify({ value: { k: 'not-num' } }),
		);

		expect(service.getProviderPctMapSync('c', 't')).toBeNull();
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('retries async fetch after an undefined result', async () => {
		fetchSpy
			.mockResolvedValueOnce(mockFetchResponse({ attributes: [] }))
			.mockResolvedValueOnce(
				mockFetchResponse({ attributes: [{ name: 'trait', value: '{"k": 1}' }] }),
			);

		await expect(service.getProviderPctMap('cloud-abc', 'trait')).resolves.toBeUndefined();
		await expect(service.getProviderPctMap('cloud-abc', 'trait')).resolves.toEqual({ k: 1 });
		expect(fetchSpy).toHaveBeenCalledTimes(2);
	});
});
