import { mockWindowStorage, STORAGE_MOCK } from './main';

describe('local-storage', () => {
	const originalWindow = global.window;

	beforeEach(() => {
		delete (global as any).window;
	});

	afterEach(() => {
		global.window = originalWindow;
	});

	describe('mockWindowStorage', () => {
		it('mockWindowStorage works with empty storage array', () => {
			expect(() => mockWindowStorage([])).not.toThrow();

			expect(global.window).toBeDefined();

			expect(typeof mockWindowStorage).toBe('function');
		});

		it('mockWindowStorage mocks localStorage on the window', () => {
			const emptyWindow = Object.create(null);
			global.window = emptyWindow as any;
			mockWindowStorage(['localStorage']);

			expect(global.window?.localStorage).toBeDefined();
			expect(global.window?.localStorage.setItem).toBeDefined();
			expect(global.window?.localStorage.getItem).toBeDefined();
			expect(global.window?.localStorage.removeItem).toBeDefined();
			expect(global.window?.localStorage.clear).toBeDefined();

			expect(() => {
				global.window?.localStorage.setItem('test', 'value');
				global.window?.localStorage.getItem('test');
			}).not.toThrow();
		});

		it('mockWindowStorage mocks sessionStorage on the window', () => {
			const emptyWindow = Object.create(null);
			global.window = emptyWindow as any;
			mockWindowStorage(['sessionStorage']);

			expect(global.window?.sessionStorage).toBeDefined();
			expect(global.window?.sessionStorage.setItem).toBeDefined();
			expect(global.window?.sessionStorage.getItem).toBeDefined();
			expect(global.window?.sessionStorage.removeItem).toBeDefined();
			expect(global.window?.sessionStorage.clear).toBeDefined();

			expect(() => {
				global.window?.sessionStorage.setItem('test', 'value');
				global.window?.sessionStorage.getItem('test');
			}).not.toThrow();
		});

		it('mockWindowStorage mocks both storage engines on the window', () => {
			mockWindowStorage();

			expect(global.window?.localStorage).toBeDefined();
			expect(global.window?.localStorage.setItem).toBeDefined();
			expect(global.window?.localStorage.getItem).toBeDefined();
			expect(global.window?.sessionStorage).toBeDefined();
			expect(global.window?.sessionStorage.setItem).toBeDefined();
			expect(global.window?.sessionStorage.getItem).toBeDefined();
			expect(global.window?.localStorage).not.toBe(global.window?.sessionStorage);
		});

		it('should not throw an error if window is undefined', () => {
			expect(() => mockWindowStorage()).not.toThrow();

			expect(global.window).toBeDefined();
			expect(global.window?.localStorage).toBeDefined();
			expect(global.window?.sessionStorage).toBeDefined();
		});
	});

	describe('SSR environment handling', () => {
		it('should create window on global when window is undefined', () => {
			delete (global as any).window;

			expect(() => mockWindowStorage(['localStorage'])).not.toThrow();

			expect(global.window).toBeDefined();
			expect(global.window?.localStorage).toBeDefined();
			expect(global.window?.localStorage.setItem).toBeDefined();
			expect(global.window?.localStorage.getItem).toBeDefined();
		});

		it('should handle case where global.window already exists as empty object', () => {
			global.window = {} as any;

			mockWindowStorage(['localStorage', 'sessionStorage']);

			expect(global.window.localStorage).toBeDefined();
			expect(global.window.sessionStorage).toBeDefined();
			expect(global.window.localStorage.setItem).toBeDefined();
			expect(global.window.sessionStorage.setItem).toBeDefined();
		});

		it('should work correctly in SSR environment', () => {
			delete (global as any).window;

			expect(() => mockWindowStorage(['localStorage'])).not.toThrow();
			expect(global.window).toBeDefined();
			expect(global.window?.localStorage).toBeDefined();
		});

		it('should override existing storage when called', () => {
			const existingStorage = { ...STORAGE_MOCK };
			existingStorage.setItem('existing', 'data');
			global.window = { localStorage: existingStorage } as any;

			mockWindowStorage(['localStorage']);

			expect(global.window.localStorage).toBeDefined();
			expect(global.window.localStorage.setItem).toBeDefined();
			expect(global.window.localStorage.getItem).toBeDefined();
			expect(global.window.localStorage).not.toBe(existingStorage);
		});
	});

	describe('browser environment handling', () => {
		it('should work with existing window object', () => {
			global.window = { existingProperty: 'test' } as any;

			mockWindowStorage(['localStorage']);

			expect(global.window.localStorage).toBeDefined();
			expect(global.window.localStorage.setItem).toBeDefined();
			expect(global.window.localStorage.getItem).toBeDefined();
			expect(() => global.window.localStorage.setItem('test', 'value')).not.toThrow();
		});
	});

	describe('edge cases and error handling', () => {
		it('should handle when global does not exist', () => {
			expect(() => mockWindowStorage(['localStorage'])).not.toThrow();

			expect(global.window).toBeDefined();
			expect(global.window?.localStorage).toBeDefined();
		});

		it('should handle when windowRef is not an object', () => {
			global.window = null as any;

			expect(() => mockWindowStorage(['localStorage'])).not.toThrow();

			expect(global.window).toBeDefined();
			expect(typeof global.window).toBe('object');
			expect(global.window?.localStorage).toBeDefined();
		});

		it('should handle when windowRef is a primitive value', () => {
			global.window = 'not an object' as any;

			expect(() => mockWindowStorage(['sessionStorage'])).not.toThrow();

			expect(global.window).toBeDefined();
			expect(typeof global.window).toBe('object');
			expect(global.window?.sessionStorage).toBeDefined();
		});

		it('should work with empty storage array', () => {
			const emptyWindow = Object.create(null);
			global.window = emptyWindow as any;

			expect(() => mockWindowStorage([])).not.toThrow();

			expect(global.window).toBeDefined();

			expect(typeof global.window).toBe('object');
		});

		it('should work with mixed storage types', () => {
			mockWindowStorage(['localStorage', 'sessionStorage', 'localStorage']); // duplicate

			expect(global.window).toBeDefined();
			expect(global.window?.localStorage).toBeDefined();
			expect(global.window?.sessionStorage).toBeDefined();
			expect(global.window?.localStorage.setItem).toBeDefined();
			expect(global.window?.sessionStorage.setItem).toBeDefined();
		});
	});
});
