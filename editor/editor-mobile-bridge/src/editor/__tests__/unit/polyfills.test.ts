import { tempPolyfills, queueMicrotaskPolyfillImplementation } from '../../polyfills';

describe('polyfills', () => {
	beforeEach(() => {
		// @ts-ignore
		delete window.queueMicrotask;
	});

	describe('tempPolyfills', () => {
		it('should polyfill "queueMicrotask" when it doesnt exist', () => {
			expect(window?.queueMicrotask).toBeUndefined();
			tempPolyfills();
			expect(window?.queueMicrotask).toBe(queueMicrotaskPolyfillImplementation);
		});

		it('should NOT polyfill "queueMicrotask" when it exists', () => {
			const existingQueueMicrotask = () => {};
			window.queueMicrotask = existingQueueMicrotask;
			tempPolyfills();
			expect(window?.queueMicrotask).toBe(existingQueueMicrotask);
		});
	});

	describe('queueMicrotaskPolyfillImplementation', () => {
		it('should resolve enqueued task as fast as an immediate promise', async () => {
			tempPolyfills();
			let done = false;
			queueMicrotask(() => {
				done = true;
			});
			expect(done).toBe(false);
			await Promise.resolve();
			expect(done).toBe(true);
		});
	});
});
