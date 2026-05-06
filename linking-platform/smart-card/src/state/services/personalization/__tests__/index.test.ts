import { StorageClient } from '@atlaskit/frontend-utilities/storage-client';

jest.mock('../../current-site-cloud-id', () => ({
	...jest.requireActual('../../current-site-cloud-id'),
	getCurrentSiteCloudId: jest.fn(),
	getCachedCurrentSiteCloudIdAndRefresh: jest.fn(),
}));

import {
	getCurrentSiteCloudId,
	getCachedCurrentSiteCloudIdAndRefresh,
} from '../../current-site-cloud-id';
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

async function flushMicrotasks(iterations = 10): Promise<void> {
	let chain = Promise.resolve();
	for (let index = 0; index < iterations; index += 1) {
		chain = chain.then(() => undefined);
	}
	await chain;
}

describe('PersonalizationService', () => {
	let service: PersonalizationService;
	let fetchSpy: jest.SpyInstance;
	let smartCardStorage: StorageClient;
	const mockGetCurrentSiteCloudId = getCurrentSiteCloudId as jest.MockedFunction<
		typeof getCurrentSiteCloudId
	>;
	const mockGetCachedCurrentSiteCloudIdAndRefresh = getCachedCurrentSiteCloudIdAndRefresh as jest.MockedFunction<
		typeof getCachedCurrentSiteCloudIdAndRefresh
	>;

	beforeEach(() => {
		localStorage.clear();
		smartCardStorage = new StorageClient(PERSONALIZATION_STORAGE_SCOPE);
		service = new PersonalizationService();
		mockGetCurrentSiteCloudId.mockResolvedValue('cloud-abc');
		mockGetCachedCurrentSiteCloudIdAndRefresh.mockReturnValue('cloud-abc');
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

	it('GETs the site traits URL for the cloud id with credentials and JSON accept', async () => {
		await service.getProviderPctMap('my_trait');

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
		mockGetCurrentSiteCloudId.mockResolvedValueOnce('site-1');
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

		await expect(service.getProviderPctMap('sl_3p_connected_providers_site_pct')).resolves.toEqual({
			'google-object-provider': 42,
		});
	});

	it('returns undefined when the response is not ok', async () => {
		fetchSpy.mockResolvedValueOnce(mockFetchResponse({}, { ok: false }));

		await expect(service.getProviderPctMap('trait')).resolves.toBeUndefined();
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('returns undefined when the trait is missing', async () => {
		fetchSpy.mockResolvedValueOnce(mockFetchResponse({ attributes: [{ name: 'other', value: '{}' }] }));

		await expect(service.getProviderPctMap('wanted')).resolves.toBeUndefined();
	});

	it('returns undefined when the trait value is not a string', async () => {
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [{ name: 't', value: true }],
			}),
		);

		await expect(service.getProviderPctMap('t')).resolves.toBeUndefined();
	});

	it('returns undefined when the trait value is not a JSON object', async () => {
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [{ name: 't', value: '"just-a-string"' }],
			}),
		);

		await expect(service.getProviderPctMap('t')).resolves.toBeUndefined();
	});

	it('returns undefined when the trait value is invalid JSON', async () => {
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [{ name: 't', value: '{not-json' }],
			}),
		);

		await expect(service.getProviderPctMap('t')).resolves.toBeUndefined();
	});

	it('dedupes parallel callers for the same trait onto one fetch', async () => {
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [{ name: 'trait-x', value: '{"k": 1}' }],
			}),
		);

		const [first, second] = await Promise.all([
			service.getProviderPctMap('trait-x'),
			service.getProviderPctMap('trait-x'),
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
			service.getProviderPctMap('trait-a'),
			service.getProviderPctMap('trait-b'),
		]);

		expect(a).toEqual({ x: 1 });
		expect(b).toEqual({ y: 2 });
		expect(fetchSpy).toHaveBeenCalledTimes(2);
	});

	it('reuses the settled promise without fetching again', async () => {
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [{ name: 't', value: '{"cached": 99}' }],
			}),
		);

		await expect(service.getProviderPctMap('t')).resolves.toEqual({ cached: 99 });
		await expect(service.getProviderPctMap('t')).resolves.toEqual({ cached: 99 });

		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('returns undefined when fetch rejects and caches that result', async () => {
		fetchSpy.mockRejectedValueOnce(new Error('network'));

		await expect(service.getProviderPctMap('t')).resolves.toBeUndefined();
		await expect(service.getProviderPctMap('t')).resolves.toBeUndefined();

		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('clearCache allows a new fetch after the map was cleared', async () => {
		fetchSpy
			.mockResolvedValueOnce(
				mockFetchResponse({ attributes: [{ name: 't', value: '{"n": 1}' }] }),
			)
			.mockResolvedValueOnce(
				mockFetchResponse({ attributes: [{ name: 't', value: '{"n": 2}' }] }),
			);

		await expect(service.getProviderPctMap('t')).resolves.toEqual({ n: 1 });
		service.clearCache();
		await expect(service.getProviderPctMap('t')).resolves.toEqual({ n: 2 });

		expect(fetchSpy).toHaveBeenCalledTimes(2);
	});

	it('persists successful maps to localStorage', async () => {
		mockGetCurrentSiteCloudId.mockResolvedValueOnce('cloud-x');
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [{ name: 'trait-y', value: '{"a": 10}' }],
			}),
		);
		await expect(service.getProviderPctMap('trait-y')).resolves.toEqual({ a: 10 });

		expect(smartCardStorage.getItem(pctMapStorageItemKey('cloud-x', 'trait-y'))).toEqual({
			a: 10,
		});
	});

	it('clearCache clears persisted localStorage maps for this prefix', async () => {
		mockGetCurrentSiteCloudId.mockResolvedValueOnce('c-storage');
		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [{ name: 't-storage', value: '{"n": 1}' }],
			}),
		);

		await expect(service.getProviderPctMap('t-storage')).resolves.toEqual({ n: 1 });
		expect(smartCardStorage.getItem(pctMapStorageItemKey('c-storage', 't-storage'))).toEqual({
			n: 1,
		});
		service.clearCache();
		expect(smartCardStorage.getItem(pctMapStorageItemKey('c-storage', 't-storage'))).toBeUndefined();
	});

	it('getCachedProviderPctMapAndRefresh returns null when localStorage has no entry', async () => {
		expect(fetchSpy).toHaveBeenCalledTimes(0);
		expect(service.getCachedProviderPctMapAndRefresh('t')).toBeNull();
		await expect(service.getProviderPctMap('t')).resolves.toBeUndefined();

		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('getCachedProviderPctMapAndRefresh returns stored map synchronously and shares one promise with subsequent async callers', async () => {
		mockGetCachedCurrentSiteCloudIdAndRefresh.mockReturnValue('c');
		mockGetCurrentSiteCloudId.mockResolvedValueOnce('c');
		smartCardStorage.setItemWithExpiry(pctMapStorageItemKey('c', 'stored-trait'), {
			'google-object-provider': 7,
		});

		fetchSpy.mockResolvedValueOnce(
			mockFetchResponse({
				attributes: [
					{
						name: 'stored-trait',
						value: '{"google-object-provider": 99}',
					},
				],
			}),
		);

		const cachedResult = service.getCachedProviderPctMapAndRefresh('stored-trait');
		expect(cachedResult).toEqual({ 'google-object-provider': 7 });

		await expect(service.getProviderPctMap('stored-trait')).resolves.toEqual({
			'google-object-provider': 99,
		});
		expect(smartCardStorage.getItem(pctMapStorageItemKey('c', 'stored-trait'))).toEqual({
			'google-object-provider': 99,
		});

		await expect(service.getProviderPctMap('stored-trait')).resolves.toEqual({
			'google-object-provider': 99,
		});
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('getCachedProviderPctMapAndRefresh returns null when localStorage payload is unreadable JSON', async () => {
		mockGetCachedCurrentSiteCloudIdAndRefresh.mockReturnValue('c');
		localStorage.setItem(pctMapLocalStorageRowKey('c', 't'), '{{');
		service.getCachedProviderPctMapAndRefresh('t');
		await flushMicrotasks();
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('getCachedProviderPctMapAndRefresh returns null when stored value is not shape of ProviderPctMap', async () => {
		mockGetCachedCurrentSiteCloudIdAndRefresh.mockReturnValue('c');
		localStorage.setItem(
			pctMapLocalStorageRowKey('c', 't'),
			JSON.stringify({ value: { k: 'not-num' } }),
		);
		expect(service.getCachedProviderPctMapAndRefresh('t')).toBeNull();
		service.getCachedProviderPctMapAndRefresh('t');
		await flushMicrotasks();
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('getCachedProviderPctMapAndRefresh dedupes concurrent in-flight work onto one promise', async () => {
		mockGetCachedCurrentSiteCloudIdAndRefresh.mockReturnValue('same');
		let settleFetch!: (response: Response) => void;

		const fetchSlow = new Promise<Response>((resolve) => {
			settleFetch = resolve;
		});

		fetchSpy
			.mockReturnValueOnce(fetchSlow)
			.mockResolvedValue(mockFetchResponse({ attributes: [] }));

		service.getCachedProviderPctMapAndRefresh('trait');
		service.getCachedProviderPctMapAndRefresh('trait');

		await flushMicrotasks();
		expect(fetchSpy).toHaveBeenCalledTimes(1);

		settleFetch(
			mockFetchResponse({
				attributes: [{ name: 'trait', value: '{"k": 1}' }],
			}),
		);

		await expect(service.getProviderPctMap('trait')).resolves.toEqual({ k: 1 });
	});
});
