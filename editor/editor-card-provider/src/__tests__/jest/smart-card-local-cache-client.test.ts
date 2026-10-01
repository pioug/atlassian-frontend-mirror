import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { SmartCardLocalCacheClient } from '../../smart-card-local-cache-client';

const mockStorageClientGetItem = jest.fn();
const mockStorageClientSetItemWithExpiry = jest.fn();

jest.mock('@atlaskit/frontend-utilities/storage-client', () => ({
	StorageClient: function () {
		return {
			...jest.requireActual('@atlaskit/frontend-utilities/storage-client').StorageClient,
			getItem: mockStorageClientGetItem,
			setItemWithExpiry: mockStorageClientSetItemWithExpiry,
		};
	},
}));

describe('SmartCardLocalCacheClient', () => {
	let storageClient: Map<string, unknown>;
	let cacheClient: SmartCardLocalCacheClient;

	beforeEach(() => {
		jest.resetAllMocks();
		SmartCardLocalCacheClient.resetInstance();

		storageClient = new Map();

		// Mock Date.now() to return a fixed timestamp
		jest.spyOn(Date, 'now').mockReturnValue(5000);
		mockStorageClientGetItem.mockImplementation((key) => storageClient.get(key));
		mockStorageClientSetItemWithExpiry.mockImplementation((key, value) =>
			storageClient.set(key, value),
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		SmartCardLocalCacheClient.resetInstance();
	});

	describe('document cache', () => {
		const url = 'https://company.atlassian.net/wiki/spaces/SPACE/pages/123';
		const response = {
			meta: { visibility: 'restricted', access: 'granted', auth: [] },
			data: {
				'@context': {
					'@vocab': 'https://www.w3.org/ns/activitystreams#',
					atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
					schema: 'http://schema.org/',
				},
				'@type': 'Document',
				name: 'Private source title',
				summary: 'Private source body',
			},
		} satisfies SmartLinkResponse;

		it('does not restore source content from a previous document', () => {
			storageClient.set(
				'response-cache',
				JSON.stringify({ [url]: { data: response, timestamp: 1000 } }),
			);

			passGate('platform_smartlink_document_cache');
			const cache = SmartCardLocalCacheClient.getInstance();

			expect(cache.getCache()).toEqual({});
			expect(cache.getItem(url)).toBeUndefined();
			expect(cache.isUrlInCache(url)).toBe(false);
			expect(mockStorageClientGetItem).not.toHaveBeenCalled();
		});

		it('shares fresh responses within a document without persisting them', async () => {
			passGate('platform_smartlink_document_cache');
			const cache = SmartCardLocalCacheClient.getInstance();
			cache.setItem(url, response);
			await Promise.resolve();

			expect(SmartCardLocalCacheClient.getInstance().getItem(url)).toEqual(response);
			expect(cache.getCache()).toEqual({ [url]: { data: response, timestamp: 5000 } });
			expect(cache.isUrlInCache(url)).toBe(true);
			expect(mockStorageClientSetItemWithExpiry).not.toHaveBeenCalled();

			SmartCardLocalCacheClient.resetInstance();
			expect(SmartCardLocalCacheClient.getInstance().getItem(url)).toBeUndefined();
		});

		it('continues to replace responses and evict the oldest entry', () => {
			passGate('platform_smartlink_document_cache');
			const cache = SmartCardLocalCacheClient.getInstance(2);
			cache.setItem(url, response);
			jest.spyOn(Date, 'now').mockReturnValue(6000);
			cache.setItem('https://example.com/second', response);
			jest.spyOn(Date, 'now').mockReturnValue(7000);
			const updatedResponse = { ...response, data: { ...response.data, name: 'Updated title' } };
			cache.setItem(url, updatedResponse);
			jest.spyOn(Date, 'now').mockReturnValue(8000);
			cache.setItem('https://example.com/third', response);

			expect(cache.getItem(url)).toEqual(updatedResponse);
			expect(cache.getItem('https://example.com/second')).toBeUndefined();
			expect(cache.getItem('https://example.com/third')).toEqual(response);
		});

		it.each([true, false])(
			'keeps repeated reads in memory and batches writes (document cache: %s)',
			async (documentCache) => {
				if (documentCache) {
					passGate('platform_smartlink_document_cache');
				} else {
					failGate('platform_smartlink_document_cache');
				}
				const cache = SmartCardLocalCacheClient.getInstance();
				cache.setItem(url, response);
				cache.setItem('https://example.com/second', response);
				for (let i = 0; i < 10; i++) {
					expect(SmartCardLocalCacheClient.getInstance().getItem(url)).toEqual(response);
				}
				expect(mockStorageClientGetItem).toHaveBeenCalledTimes(documentCache ? 0 : 1);
				expect(mockStorageClientSetItemWithExpiry).not.toHaveBeenCalled();

				await Promise.resolve();
				expect(mockStorageClientSetItemWithExpiry).toHaveBeenCalledTimes(documentCache ? 0 : 1);
			},
		);
	});

	describe('getCache', () => {
		it('loads the original session cache at construction before any cache method is called', () => {
			failGate('platform_smartlink_document_cache');
			const url = 'https://example.com';
			const response = {
				meta: { visibility: 'restricted', access: 'granted' },
				data: undefined,
			} satisfies SmartLinkResponse;
			storageClient.set(
				'response-cache',
				JSON.stringify({ [url]: { data: response, timestamp: 1000 } }),
			);

			const cache = SmartCardLocalCacheClient.getInstance();
			expect(mockStorageClientGetItem).toHaveBeenCalledTimes(1);
			expect(mockStorageClientGetItem).toHaveBeenCalledWith('response-cache', {
				useExpiredItem: true,
			});
			storageClient.set('response-cache', '{}');

			expect(cache.getCache()).toEqual({ [url]: { data: response, timestamp: 1000 } });
			expect(cache.getItem(url)).toEqual(response);
			expect(cache.isUrlInCache(url)).toBe(true);
			expect(mockStorageClientGetItem).toHaveBeenCalledTimes(1);
		});

		it('preserves the original parse error when the gate is disabled', () => {
			failGate('platform_smartlink_document_cache');
			storageClient.set('response-cache', '{invalid');

			expect(() => SmartCardLocalCacheClient.getInstance()).toThrow(SyntaxError);
		});

		it('does not parse invalid session data when the gate is enabled', () => {
			passGate('platform_smartlink_document_cache');
			storageClient.set('response-cache', '{invalid');

			const cache = SmartCardLocalCacheClient.getInstance();
			expect(cache.getCache()).toEqual({});
			expect(mockStorageClientGetItem).not.toHaveBeenCalled();
		});

		it('should retrieve the entire cache', () => {
			failGate('platform_smartlink_document_cache');
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;
			const cache = JSON.stringify({
				'https://example1.com': { data: response, timestamp: 1000 },
				'https://example2.com': { data: response, timestamp: 2000 },
			});
			storageClient.set('response-cache', cache);
			mockStorageClientGetItem.mockReturnValue(cache);

			cacheClient = SmartCardLocalCacheClient.getInstance();
			const result = cacheClient.getCache();
			expect(mockStorageClientGetItem).toHaveBeenCalledWith('response-cache', {
				useExpiredItem: true,
			});
			expect(result).toEqual({
				'https://example1.com': { data: response, timestamp: 1000 },
				'https://example2.com': { data: response, timestamp: 2000 },
			});
		});

		it('should return an empty object if no cache exists', () => {
			failGate('platform_smartlink_document_cache');
			mockStorageClientGetItem.mockReturnValue(undefined);

			cacheClient = SmartCardLocalCacheClient.getInstance();
			const result = cacheClient.getCache();
			expect(mockStorageClientGetItem).toHaveBeenCalledWith('response-cache', {
				useExpiredItem: true,
			});
			expect(result).toEqual({});
		});
	});

	describe('setItem', () => {
		it('should store the response in the cache', async () => {
			failGate('platform_smartlink_document_cache');
			const url = 'https://example.com';
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;
			const existingCache = JSON.stringify({
				'https://lol.com': { data: { meta: { visibility: 'restricted' } }, timestamp: 1000 },
			});
			storageClient.set('response-cache', existingCache);
			mockStorageClientGetItem.mockReturnValue(existingCache);

			cacheClient = SmartCardLocalCacheClient.getInstance();
			cacheClient.setItem(url, response);

			// Wait for async write
			await new Promise((resolve) => queueMicrotask(() => resolve(undefined)));

			expect(mockStorageClientSetItemWithExpiry).toHaveBeenCalledWith(
				'response-cache',
				JSON.stringify({
					'https://lol.com': { data: { meta: { visibility: 'restricted' } }, timestamp: 1000 },
					[url]: { data: response, timestamp: 5000 },
				}),
			);
		});

		it('should create a new cache if none exists', async () => {
			failGate('platform_smartlink_document_cache');
			const url = 'https://example.com';
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;
			mockStorageClientGetItem.mockReturnValue(null);

			cacheClient = SmartCardLocalCacheClient.getInstance();
			cacheClient.setItem(url, response);

			// Wait for async write
			await new Promise((resolve) => queueMicrotask(() => resolve(undefined)));

			expect(mockStorageClientSetItemWithExpiry).toHaveBeenCalledWith(
				'response-cache',
				JSON.stringify({
					[url]: { data: response, timestamp: 5000 },
				}),
			);
		});

		it('should overwrite existing cache entry for the same URL', async () => {
			failGate('platform_smartlink_document_cache');
			const url = 'https://example.com';
			const initialResponse: SmartLinkResponse = {
				meta: { visibility: 'public' },
			} as SmartLinkResponse;
			const updatedResponse: SmartLinkResponse = {
				meta: { visibility: 'restricted' },
			} as SmartLinkResponse;
			const existingCache = JSON.stringify({
				[url]: { data: initialResponse, timestamp: 1000 },
			});
			storageClient.set('response-cache', existingCache);
			mockStorageClientGetItem.mockReturnValue(existingCache);

			cacheClient = SmartCardLocalCacheClient.getInstance();
			cacheClient.setItem(url, updatedResponse);

			// Wait for async write
			await new Promise((resolve) => queueMicrotask(() => resolve(undefined)));

			expect(mockStorageClientSetItemWithExpiry).toHaveBeenCalledWith(
				'response-cache',
				JSON.stringify({
					[url]: { data: updatedResponse, timestamp: 5000 },
				}),
			);
		});

		it('should enforce maxItems limit with FIFO eviction', async () => {
			failGate('platform_smartlink_document_cache');
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;

			// Simulate adding items over time with different timestamps
			const existingCache = JSON.stringify({
				'https://url1.com': { data: response, timestamp: 1000 },
				'https://url2.com': { data: response, timestamp: 2000 },
				'https://url3.com': { data: response, timestamp: 3000 },
			});
			storageClient.set('response-cache', existingCache);
			mockStorageClientGetItem.mockReturnValue(existingCache);

			// Add a 4th item - should evict the oldest (url1 with timestamp 1000)
			const cacheClientWithLimit = SmartCardLocalCacheClient.getInstance(3); // max 3 items
			cacheClientWithLimit.setItem('https://url4.com', response);

			// Wait for async write
			await new Promise((resolve) => queueMicrotask(() => resolve(undefined)));

			expect(mockStorageClientSetItemWithExpiry).toHaveBeenCalledWith(
				'response-cache',
				JSON.stringify({
					['https://url2.com']: { data: response, timestamp: 2000 },
					['https://url3.com']: { data: response, timestamp: 3000 },
					['https://url4.com']: { data: response, timestamp: 5000 },
				}),
			);
		});

		it('should evict multiple oldest items when cache exceeds limit by more than one', async () => {
			failGate('platform_smartlink_document_cache');
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;

			const existingCache = JSON.stringify({
				'https://url1.com': { data: response, timestamp: 1000 },
				'https://url2.com': { data: response, timestamp: 2000 },
				'https://url3.com': { data: response, timestamp: 3000 },
			});
			storageClient.set('response-cache', existingCache);
			mockStorageClientGetItem.mockReturnValue(existingCache);

			// Add another item with max 2 - should evict url1 and url2
			const cacheClientWithLimit = SmartCardLocalCacheClient.getInstance(2); // max 2 items
			cacheClientWithLimit.setItem('https://url4.com', response);

			// Wait for async write
			await new Promise((resolve) => queueMicrotask(() => resolve(undefined)));

			expect(mockStorageClientSetItemWithExpiry).toHaveBeenCalledWith(
				'response-cache',
				JSON.stringify({
					['https://url3.com']: { data: response, timestamp: 3000 },
					['https://url4.com']: { data: response, timestamp: 5000 },
				}),
			);
		});

		it('should not evict items when cache is below maxItems', async () => {
			failGate('platform_smartlink_document_cache');
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;

			const existingCache = JSON.stringify({
				'https://url1.com': { data: response, timestamp: 1000 },
				'https://url2.com': { data: response, timestamp: 2000 },
			});
			storageClient.set('response-cache', existingCache);
			mockStorageClientGetItem.mockReturnValue(existingCache);

			// Add a 3rd item - should not evict anything
			const cacheClientWithLimit = SmartCardLocalCacheClient.getInstance(5); // max 5 items
			cacheClientWithLimit.setItem('https://url3.com', response);

			// Wait for async write
			await new Promise((resolve) => queueMicrotask(() => resolve(undefined)));

			expect(mockStorageClientSetItemWithExpiry).toHaveBeenCalledWith(
				'response-cache',
				JSON.stringify({
					['https://url1.com']: { data: response, timestamp: 1000 },
					['https://url2.com']: { data: response, timestamp: 2000 },
					['https://url3.com']: { data: response, timestamp: 5000 },
				}),
			);
		});
	});

	describe('getItem', () => {
		it('should retrieve the cached response for a given URL', () => {
			failGate('platform_smartlink_document_cache');
			const url = 'https://example.com';
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;
			const cache = JSON.stringify({
				[url]: { data: response, timestamp: 1000 },
			});
			storageClient.set('response-cache', cache);
			mockStorageClientGetItem.mockReturnValue(cache);

			cacheClient = SmartCardLocalCacheClient.getInstance();
			const result = cacheClient.getItem(url);
			expect(mockStorageClientGetItem).toHaveBeenCalledWith('response-cache', {
				useExpiredItem: true,
			});
			expect(result).toEqual(response);
		});

		it('should return undefined if the URL is not in the cache', () => {
			failGate('platform_smartlink_document_cache');
			const url = 'https://example.com';
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;
			const cache = JSON.stringify({
				'https://lol.com': { data: response, timestamp: 1000 },
			});
			storageClient.set('response-cache', cache);
			mockStorageClientGetItem.mockReturnValue(cache);

			cacheClient = SmartCardLocalCacheClient.getInstance();
			const result = cacheClient.getItem(url);
			expect(mockStorageClientGetItem).toHaveBeenCalledWith('response-cache', {
				useExpiredItem: true,
			});
			expect(result).toBeUndefined();
		});

		it('should return undefined if no cache exists', () => {
			failGate('platform_smartlink_document_cache');
			const url = 'https://example.com';
			mockStorageClientGetItem.mockReturnValue(undefined);

			cacheClient = SmartCardLocalCacheClient.getInstance();
			const result = cacheClient.getItem(url);
			expect(mockStorageClientGetItem).toHaveBeenCalledWith('response-cache', {
				useExpiredItem: true,
			});
			expect(result).toBeUndefined();
		});

		it('should return undefined if the URL is undefined', () => {
			cacheClient = SmartCardLocalCacheClient.getInstance();
			const result = cacheClient.getItem(undefined);
			expect(result).toBeUndefined();
		});
	});

	describe('isUrlInCache', () => {
		it('should return true if the URL exists in the cache', () => {
			failGate('platform_smartlink_document_cache');
			const url = 'https://example.com';
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;
			const cache = JSON.stringify({
				[url]: { data: response, timestamp: 1000 },
			});
			storageClient.set('response-cache', cache);
			mockStorageClientGetItem.mockReturnValue(cache);

			cacheClient = SmartCardLocalCacheClient.getInstance();
			const result = cacheClient.isUrlInCache(url);
			expect(mockStorageClientGetItem).toHaveBeenCalledWith('response-cache', {
				useExpiredItem: true,
			});
			expect(result).toBe(true);
		});

		it('should return false if the URL does not exist in the cache', () => {
			failGate('platform_smartlink_document_cache');
			const url = 'https://example.com';
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;
			const cache = JSON.stringify({
				'https://lol.com': { data: response, timestamp: 1000 },
			});
			storageClient.set('response-cache', cache);
			mockStorageClientGetItem.mockReturnValue(cache);

			cacheClient = SmartCardLocalCacheClient.getInstance();
			const result = cacheClient.isUrlInCache(url);
			expect(mockStorageClientGetItem).toHaveBeenCalledWith('response-cache', {
				useExpiredItem: true,
			});
			expect(result).toBe(false);
		});
	});
});
