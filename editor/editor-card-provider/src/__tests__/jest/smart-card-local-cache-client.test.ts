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
	let localStorage: Map<string, unknown>;
	let cacheClient: SmartCardLocalCacheClient;

	beforeEach(() => {
		localStorage = new Map();

		jest.resetAllMocks();
		// Mock Date.now() to return a fixed timestamp
		jest.spyOn(Date, 'now').mockReturnValue(5000);
		mockStorageClientGetItem.mockImplementation((key) => localStorage.get(key));
		mockStorageClientSetItemWithExpiry.mockImplementation((key, value) =>
			localStorage.set(key, value),
		);
		cacheClient = new SmartCardLocalCacheClient();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	describe('getCache', () => {
		it('should retrieve the entire cache', () => {
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;
			const cache = JSON.stringify({
				'https://example1.com': { data: response, timestamp: 1000 },
				'https://example2.com': { data: response, timestamp: 2000 },
			});
			localStorage.set('response-cache', cache);
			mockStorageClientGetItem.mockReturnValue(cache);

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

			const result = cacheClient.getCache();
			expect(mockStorageClientGetItem).toHaveBeenCalledWith('response-cache', {
				useExpiredItem: true,
			});
			expect(result).toEqual({});
		});
	});

	describe('setItem', () => {
		it('should store the response in the cache', () => {
			const url = 'https://example.com';
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;
			const existingCache = JSON.stringify({
				'https://lol.com': { data: { meta: { visibility: 'restricted' } }, timestamp: 1000 },
			});
			localStorage.set('response-cache', existingCache);
			mockStorageClientGetItem.mockReturnValue(existingCache);

			cacheClient.setItem(url, response);

			expect(mockStorageClientSetItemWithExpiry).toHaveBeenCalledWith(
				'response-cache',
				JSON.stringify({
					'https://lol.com': { data: { meta: { visibility: 'restricted' } }, timestamp: 1000 },
					[url]: { data: response, timestamp: 5000 },
				}),
			);
		});

		it('should create a new cache if none exists', () => {
			const url = 'https://example.com';
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;
			mockStorageClientGetItem.mockReturnValue(null);

			cacheClient.setItem(url, response);

			expect(mockStorageClientSetItemWithExpiry).toHaveBeenCalledWith(
				'response-cache',
				JSON.stringify({
					[url]: { data: response, timestamp: 5000 },
				}),
			);
		});

		it('should overwrite existing cache entry for the same URL', () => {
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
			localStorage.set('response-cache', existingCache);
			mockStorageClientGetItem.mockReturnValue(existingCache);

			cacheClient.setItem(url, updatedResponse);

			expect(mockStorageClientSetItemWithExpiry).toHaveBeenCalledWith(
				'response-cache',
				JSON.stringify({
					[url]: { data: updatedResponse, timestamp: 5000 },
				}),
			);
		});

		it('should enforce maxItems limit with FIFO eviction', () => {
			const cacheClientWithLimit = new SmartCardLocalCacheClient(3); // max 3 items
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;

			// Simulate adding items over time with different timestamps
			const existingCache = JSON.stringify({
				'https://url1.com': { data: response, timestamp: 1000 },
				'https://url2.com': { data: response, timestamp: 2000 },
				'https://url3.com': { data: response, timestamp: 3000 },
			});
			localStorage.set('response-cache', existingCache);
			mockStorageClientGetItem.mockReturnValue(existingCache);

			// Add a 4th item - should evict the oldest (url1 with timestamp 1000)
			cacheClientWithLimit.setItem('https://url4.com', response);

			expect(mockStorageClientSetItemWithExpiry).toHaveBeenCalledWith(
				'response-cache',
				JSON.stringify({
					['https://url2.com']: { data: response, timestamp: 2000 },
					['https://url3.com']: { data: response, timestamp: 3000 },
					['https://url4.com']: { data: response, timestamp: 5000 },
				}),
			);
		});

		it('should evict multiple oldest items when cache exceeds limit by more than one', () => {
			const cacheClientWithLimit = new SmartCardLocalCacheClient(2); // max 2 items
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;

			const existingCache = JSON.stringify({
				'https://url1.com': { data: response, timestamp: 1000 },
				'https://url2.com': { data: response, timestamp: 2000 },
				'https://url3.com': { data: response, timestamp: 3000 },
			});
			localStorage.set('response-cache', existingCache);
			mockStorageClientGetItem.mockReturnValue(existingCache);

			// Add another item with max 2 - should evict url1 and url2
			cacheClientWithLimit.setItem('https://url4.com', response);

			expect(mockStorageClientSetItemWithExpiry).toHaveBeenCalledWith(
				'response-cache',
				JSON.stringify({
					['https://url3.com']: { data: response, timestamp: 3000 },
					['https://url4.com']: { data: response, timestamp: 5000 },
				}),
			);
		});

		it('should not evict items when cache is below maxItems', () => {
			const cacheClientWithLimit = new SmartCardLocalCacheClient(5); // max 5 items
			const response: SmartLinkResponse = { meta: { visibility: 'public' } } as SmartLinkResponse;

			const existingCache = JSON.stringify({
				'https://url1.com': { data: response, timestamp: 1000 },
				'https://url2.com': { data: response, timestamp: 2000 },
			});
			localStorage.set('response-cache', existingCache);
			mockStorageClientGetItem.mockReturnValue(existingCache);

			// Add a 3rd item - should not evict anything
			cacheClientWithLimit.setItem('https://url3.com', response);

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
			localStorage.set('response-cache', cache);
			mockStorageClientGetItem.mockReturnValue(cache);

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
			localStorage.set('response-cache', cache);
			mockStorageClientGetItem.mockReturnValue(cache);

			const result = cacheClient.getItem(url);
			expect(mockStorageClientGetItem).toHaveBeenCalledWith('response-cache', {
				useExpiredItem: true,
			});
			expect(result).toBeUndefined();
		});

		it('should return undefined if no cache exists', () => {
			const url = 'https://example.com';
			mockStorageClientGetItem.mockReturnValue(undefined);

			const result = cacheClient.getItem(url);
			expect(mockStorageClientGetItem).toHaveBeenCalledWith('response-cache', {
				useExpiredItem: true,
			});
			expect(result).toBeUndefined();
		});

		it('should return undefined if the URL is undefined', () => {
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
			localStorage.set('response-cache', cache);
			mockStorageClientGetItem.mockReturnValue(cache);

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
			localStorage.set('response-cache', cache);
			mockStorageClientGetItem.mockReturnValue(cache);

			const result = cacheClient.isUrlInCache(url);
			expect(mockStorageClientGetItem).toHaveBeenCalledWith('response-cache', {
				useExpiredItem: true,
			});
			expect(result).toBe(false);
		});
	});
});
