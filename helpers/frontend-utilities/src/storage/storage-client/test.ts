import { STORAGE_MOCK } from '../local-storage';

import StorageClient from './main';

const CLIENT_KEY = 'storage_client';
const KEY = 'test_key';
const VALUE = { type: 'test' };

const captureExceptionHandler = jest.fn();

describe('storage-client', () => {
	const originalWindow = global.window;

	beforeEach(() => {
		jest.clearAllMocks();
		// @ts-expect-error
		global.window = undefined;

		if (typeof localStorage !== 'undefined') {
			localStorage.clear();
		}
		if (typeof sessionStorage !== 'undefined') {
			sessionStorage.clear();
		}
	});

	afterEach(() => {
		global.window = originalWindow;
	});

	describe('constructor', () => {
		it('should not throw an error when window is undefined', () => {
			expect(() => new StorageClient(CLIENT_KEY)).not.toThrow();
		});

		it('should create a functional storage client in SSR environment (window undefined)', () => {
			const client = new StorageClient(CLIENT_KEY);

			expect(() => client.setItemWithExpiry(KEY, VALUE)).not.toThrow();
			expect(client.getItem(KEY)).toEqual(VALUE);
		});

		it('should create sessionStorage when window is undefined and storageEngine is sessionStorage', () => {
			const client = new StorageClient(CLIENT_KEY, { storageEngine: 'sessionStorage' });

			expect(global.window).toBeDefined();
			expect(global.window?.sessionStorage).toBeDefined();
			expect(global.window?.sessionStorage.setItem).toBeDefined();
			expect(global.window?.sessionStorage.getItem).toBeDefined();
			expect(global.window?.sessionStorage.removeItem).toBeDefined();

			client.setItemWithExpiry(KEY, VALUE);
			expect(client.getItem(KEY)).toEqual(VALUE);
		});

		it('should use localStorage when window is defined', () => {
			const mockStorage = { ...STORAGE_MOCK };
			global.window = { localStorage: mockStorage } as any;

			const client = new StorageClient(CLIENT_KEY);
			expect(client.getItem(KEY)).toBeUndefined();

			client.setItemWithExpiry(KEY, VALUE);
			expect(client.getItem(KEY)).toEqual(VALUE);
		});

		it('should create and use sessionStorage if it does not exist on window', () => {
			const mockStorage = { ...STORAGE_MOCK };
			global.window = { localStorage: mockStorage } as any;

			const client = new StorageClient(CLIENT_KEY, { storageEngine: 'sessionStorage' });
			expect(global.window.sessionStorage).toBeDefined();

			expect(client.getItem(KEY)).toBeUndefined();
			client.setItemWithExpiry(KEY, VALUE);

			expect(client.getItem(KEY)).toEqual(VALUE);
		});

		it('should mock localStorage when window exists but localStorage does not exist', () => {
			global.window = {} as any;

			const client = new StorageClient(CLIENT_KEY, { storageEngine: 'localStorage' });

			expect(global.window.localStorage).toBeDefined();
			expect(global.window.localStorage.setItem).toBeDefined();
			expect(global.window.localStorage.getItem).toBeDefined();
			expect(global.window.localStorage.removeItem).toBeDefined();

			client.setItemWithExpiry(KEY, VALUE);
			expect(client.getItem(KEY)).toEqual(VALUE);
		});

		it('should mock sessionStorage when window exists but sessionStorage does not exist', () => {
			global.window = {} as any;

			const client = new StorageClient(CLIENT_KEY, { storageEngine: 'sessionStorage' });

			expect(global.window.sessionStorage).toBeDefined();
			expect(global.window.sessionStorage.setItem).toBeDefined();
			expect(global.window.sessionStorage.getItem).toBeDefined();
			expect(global.window.sessionStorage.removeItem).toBeDefined();

			client.setItemWithExpiry(KEY, VALUE);
			expect(client.getItem(KEY)).toEqual(VALUE);
		});

		it('should use existing localStorage when window and localStorage both exist', () => {
			const existingStorage = { ...STORAGE_MOCK };
			global.window = { localStorage: existingStorage } as any;

			const client = new StorageClient(CLIENT_KEY);

			// Test that the client works correctly with existing storage
			client.setItemWithExpiry('existing', 'existing_data');
			expect(client.getItem('existing')).toEqual('existing_data');

			// Test normal functionality
			client.setItemWithExpiry(KEY, VALUE);
			expect(client.getItem(KEY)).toEqual(VALUE);

			// Verify that localStorage exists and is functional
			expect(global.window.localStorage).toBeDefined();
			expect(global.window.localStorage.setItem).toBeDefined();
			expect(global.window.localStorage.getItem).toBeDefined();
		});

		it('should use existing sessionStorage when window and sessionStorage both exist', () => {
			const existingStorage = { ...STORAGE_MOCK };
			global.window = { sessionStorage: existingStorage } as any;

			const client = new StorageClient(CLIENT_KEY, { storageEngine: 'sessionStorage' });

			// Test that the client works correctly with existing storage
			client.setItemWithExpiry('existing', 'existing_data');
			expect(client.getItem('existing')).toEqual('existing_data');

			// Test normal functionality
			client.setItemWithExpiry(KEY, VALUE);
			expect(client.getItem(KEY)).toEqual(VALUE);

			// Verify that sessionStorage exists and is functional
			expect(global.window.sessionStorage).toBeDefined();
			expect(global.window.sessionStorage.setItem).toBeDefined();
			expect(global.window.sessionStorage.getItem).toBeDefined();
		});

		it('should handle node.js environment correctly', () => {
			const originalGlobal = global.global;
			global.global = global;

			const client = new StorageClient(CLIENT_KEY);

			expect(global.window).toBeDefined();
			expect(global.window?.localStorage).toBeDefined();
			expect(global.window?.localStorage.setItem).toBeDefined();
			expect(global.window?.localStorage.getItem).toBeDefined();
			expect(global.window?.localStorage.removeItem).toBeDefined();

			client.setItemWithExpiry(KEY, VALUE);
			expect(client.getItem(KEY)).toEqual(VALUE);

			global.global = originalGlobal;
		});
	});

	describe('setItemWithExpiry', () => {
		it('should call setItem with correct arguments and no expiry', () => {
			const client = new StorageClient(CLIENT_KEY);
			client.setItemWithExpiry(KEY, VALUE);

			expect(global.window?.localStorage.setItem).toHaveBeenCalledWith(
				`${CLIENT_KEY}_${KEY}`,
				JSON.stringify({ value: VALUE }),
			);
		});

		it('should call setItem with correct arguments and expiry', () => {
			const client = new StorageClient(CLIENT_KEY);
			const expiry = 1000 * 60 * 60;

			client.setItemWithExpiry(KEY, VALUE, expiry);

			const expectedStoredValue = JSON.parse(
				(global.window?.localStorage.setItem as jest.Mock).mock.calls[0][1],
			);
			expect(global.window?.localStorage.setItem).toHaveBeenCalledWith(
				`${CLIENT_KEY}_${KEY}`,
				JSON.stringify(expectedStoredValue),
			);
			expect(expectedStoredValue).toHaveProperty('expires');
		});

		it('should handle exceptions during setItem', () => {
			const client = new StorageClient(CLIENT_KEY, {
				handlers: { captureException: captureExceptionHandler },
			});
			const error = new Error('Storage error');
			jest.spyOn(global.window.localStorage, 'setItem').mockImplementation(() => {
				throw error;
			});

			client.setItemWithExpiry(KEY, VALUE);
			expect(captureExceptionHandler).toHaveBeenCalledWith(error, undefined);
		});
	});

	describe('getItem', () => {
		it('getItem is called when a non-expired entry is returned', () => {
			(localStorage.getItem as jest.Mock).mockReturnValueOnce(
				'{"value":{"type":"test"},"expires":1502845200000}',
			);

			const response = new StorageClient(CLIENT_KEY, {
				handlers: { captureException: captureExceptionHandler },
			}).getItem(KEY);

			expect(localStorage.removeItem).toHaveBeenCalledTimes(0);
			expect(localStorage.getItem).toHaveBeenCalledTimes(1);
			expect(localStorage.getItem).toHaveBeenCalledWith(`${CLIENT_KEY}_${KEY}`);
			expect(response).toEqual(VALUE);
		});

		it('getItem and removeItem are called when an expired entry is returned', () => {
			(localStorage.getItem as jest.Mock).mockReturnValueOnce(
				'{"value":{"type":"test"},"expires":1502841500000}',
			);

			const response = new StorageClient(CLIENT_KEY, {
				handlers: { captureException: captureExceptionHandler },
			}).getItem(KEY);

			expect(localStorage.removeItem).toHaveBeenCalledTimes(0);
			expect(localStorage.getItem).toHaveBeenCalledTimes(1);
			expect(localStorage.getItem).toHaveBeenCalledWith(`${CLIENT_KEY}_${KEY}`);
			expect(response).toEqual(undefined);
		});

		it('getItem and removeItem are called, with an expired entry being returned', () => {
			(localStorage.getItem as jest.Mock).mockReturnValueOnce(
				'{"value":{"type":"test"},"expires":1502841500000}',
			);

			const response = new StorageClient(CLIENT_KEY, {
				handlers: { captureException: captureExceptionHandler },
			}).getItem(KEY, { useExpiredItem: true });

			expect(localStorage.removeItem).toHaveBeenCalledTimes(0);
			expect(localStorage.getItem).toHaveBeenCalledTimes(1);
			expect(localStorage.getItem).toHaveBeenCalledWith(`${CLIENT_KEY}_${KEY}`);
			expect(response).toEqual(VALUE);
		});

		it('should handle JSON parsing errors gracefully', () => {
			const client = new StorageClient(CLIENT_KEY, {
				handlers: { captureException: captureExceptionHandler },
			});

			jest.spyOn(global.window.localStorage, 'getItem').mockReturnValueOnce('invalid json');

			const result = client.getItem(KEY);

			expect(result).toBeUndefined();
			expect(captureExceptionHandler).toHaveBeenCalledWith(expect.any(Error), undefined);
		});

		it('should return undefined when no item exists', () => {
			const client = new StorageClient(CLIENT_KEY);

			jest.spyOn(global.window.localStorage, 'getItem').mockReturnValueOnce(null);

			const result = client.getItem(KEY);
			expect(result).toBeUndefined();
		});

		it('should call removeItem when clearExpiredItem is true and item is expired', () => {
			(localStorage.getItem as jest.Mock).mockReturnValueOnce(
				'{"value":{"type":"test"},"expires":1502841500000}',
			);

			const response = new StorageClient(CLIENT_KEY, {
				handlers: { captureException: captureExceptionHandler },
			}).getItem(KEY, { clearExpiredItem: true });

			expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
			expect(localStorage.removeItem).toHaveBeenCalledWith(`${CLIENT_KEY}_${KEY}`);
			expect(localStorage.getItem).toHaveBeenCalledTimes(1);
			expect(localStorage.getItem).toHaveBeenCalledWith(`${CLIENT_KEY}_${KEY}`);
			expect(response).toEqual(undefined);
		});

		it('should not call removeItem when clearExpiredItem is false and item is expired', () => {
			(localStorage.getItem as jest.Mock).mockReturnValueOnce(
				'{"value":{"type":"test"},"expires":1502841500000}',
			);

			const response = new StorageClient(CLIENT_KEY, {
				handlers: { captureException: captureExceptionHandler },
			}).getItem(KEY, { clearExpiredItem: false });

			expect(localStorage.removeItem).toHaveBeenCalledTimes(0);
			expect(localStorage.getItem).toHaveBeenCalledTimes(1);
			expect(localStorage.getItem).toHaveBeenCalledWith(`${CLIENT_KEY}_${KEY}`);
			expect(response).toEqual(undefined);
		});

		it('should call removeItem and return expired value when clearExpiredItem is true and useExpiredItem is true', () => {
			(localStorage.getItem as jest.Mock).mockReturnValueOnce(
				'{"value":{"type":"test"},"expires":1502841500000}',
			);

			const response = new StorageClient(CLIENT_KEY, {
				handlers: { captureException: captureExceptionHandler },
			}).getItem(KEY, { clearExpiredItem: true, useExpiredItem: true });

			expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
			expect(localStorage.removeItem).toHaveBeenCalledWith(`${CLIENT_KEY}_${KEY}`);
			expect(localStorage.getItem).toHaveBeenCalledTimes(1);
			expect(localStorage.getItem).toHaveBeenCalledWith(`${CLIENT_KEY}_${KEY}`);
			expect(response).toEqual(VALUE);
		});

		it('should not call removeItem when item is not expired regardless of clearExpiredItem setting', () => {
			(localStorage.getItem as jest.Mock).mockReturnValueOnce(
				'{"value":{"type":"test"},"expires":1502845200000}',
			);

			const response = new StorageClient(CLIENT_KEY, {
				handlers: { captureException: captureExceptionHandler },
			}).getItem(KEY, { clearExpiredItem: true });

			expect(localStorage.removeItem).toHaveBeenCalledTimes(0);
			expect(localStorage.getItem).toHaveBeenCalledTimes(1);
			expect(localStorage.getItem).toHaveBeenCalledWith(`${CLIENT_KEY}_${KEY}`);
			expect(response).toEqual(VALUE);
		});
	});

	describe('removeItem', () => {
		it('should call removeItem with the correct key', () => {
			const client = new StorageClient(CLIENT_KEY);
			client.removeItem(KEY);

			expect(global.window?.localStorage.removeItem).toHaveBeenCalledWith(`${CLIENT_KEY}_${KEY}`);
		});

		it('should handle exceptions during removeItem', () => {
			const client = new StorageClient(CLIENT_KEY, {
				handlers: { captureException: captureExceptionHandler },
			});
			const error = new Error('Storage error');
			jest.spyOn(global.window.localStorage, 'removeItem').mockImplementation(() => {
				throw error;
			});
			client.removeItem(KEY);
			expect(captureExceptionHandler).toHaveBeenCalledWith(error, undefined);
		});
	});
});
