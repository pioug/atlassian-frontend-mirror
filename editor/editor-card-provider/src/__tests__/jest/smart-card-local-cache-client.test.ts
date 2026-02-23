import { SmartCardLocalCacheClient } from '../../smart-card-local-cache-client';
import type { SmartLinkResponse } from '@atlaskit/linking-types';

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

	describe('getCache', () => {
		it('should retrieve the entire cache', () => {
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
