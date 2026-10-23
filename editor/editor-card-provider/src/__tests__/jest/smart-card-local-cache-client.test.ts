import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { SmartCardLocalCacheClient } from '../../smart-card-local-cache-client';

const mockStorageClientGetItem = jest.fn();
const mockStorageClientSetItemWithExpiry = jest.fn();

jest.mock('@atlaskit/frontend-utilities/StorageClient', () => ({
	...jest.requireActual('@atlaskit/frontend-utilities/StorageClient'),
	StorageClient: function () {
		return {
			...jest.requireActual('@atlaskit/frontend-utilities/StorageClient').StorageClient,
			getItem: mockStorageClientGetItem,
			setItemWithExpiry: mockStorageClientSetItemWithExpiry,
		};
	},
}));

describe('SmartCardLocalCacheClient', () => {
	let storageClient: Map<string, unknown>;

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

			const cache = SmartCardLocalCacheClient.getInstance();

			expect(cache.getCache()).toEqual({});
			expect(cache.getItem(url)).toBeUndefined();
			expect(cache.isUrlInCache(url)).toBe(false);
			expect(mockStorageClientGetItem).not.toHaveBeenCalled();
		});

		it('shares fresh responses within a document without persisting them', async () => {
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

		it('keeps repeated reads and writes in memory', async () => {
			const cache = SmartCardLocalCacheClient.getInstance();
			cache.setItem(url, response);
			cache.setItem('https://example.com/second', response);
			for (let i = 0; i < 10; i++) {
				expect(SmartCardLocalCacheClient.getInstance().getItem(url)).toEqual(response);
			}
			await Promise.resolve();

			expect(mockStorageClientGetItem).not.toHaveBeenCalled();
			expect(mockStorageClientSetItemWithExpiry).not.toHaveBeenCalled();
		});

		it('does not parse invalid session data', () => {
			storageClient.set('response-cache', '{invalid');

			const cache = SmartCardLocalCacheClient.getInstance();
			expect(cache.getCache()).toEqual({});
			expect(mockStorageClientGetItem).not.toHaveBeenCalled();
		});

		it('retrieves all responses cached within the document', () => {
			const cache = SmartCardLocalCacheClient.getInstance();
			cache.setItem(url, response);
			cache.setItem('https://example.com/second', response);

			expect(cache.getCache()).toEqual({
				[url]: { data: response, timestamp: 5000 },
				'https://example.com/second': { data: response, timestamp: 5000 },
			});
		});

		it('returns an empty cache before any response is stored', () => {
			const cache = SmartCardLocalCacheClient.getInstance();

			expect(cache.getCache()).toEqual({});
			expect(cache.getItem(url)).toBeUndefined();
			expect(cache.isUrlInCache(url)).toBe(false);
		});

		it('returns undefined for a missing or undefined URL', () => {
			const cache = SmartCardLocalCacheClient.getInstance();
			cache.setItem(url, response);

			expect(cache.getItem('https://example.com/missing')).toBeUndefined();
			expect(cache.getItem(undefined)).toBeUndefined();
			expect(cache.isUrlInCache('https://example.com/missing')).toBe(false);
		});

		it('keeps all entries when the cache is below its limit', () => {
			const cache = SmartCardLocalCacheClient.getInstance(3);
			cache.setItem(url, response);
			cache.setItem('https://example.com/second', response);

			expect(cache.getItem(url)).toEqual(response);
			expect(cache.getItem('https://example.com/second')).toEqual(response);
			expect(Object.keys(cache.getCache())).toHaveLength(2);
		});

		it("uses the first caller's limit for the shared cache", () => {
			const cache = SmartCardLocalCacheClient.getInstance(1);
			cache.setItem(url, response);
			jest.spyOn(Date, 'now').mockReturnValue(6000);
			const nextClient = SmartCardLocalCacheClient.getInstance(2);
			nextClient.setItem('https://example.com/second', response);

			expect(nextClient).toBe(cache);
			expect(cache.getItem(url)).toBeUndefined();
			expect(cache.getItem('https://example.com/second')).toEqual(response);
		});
	});
});
