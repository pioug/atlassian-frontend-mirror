import { promiseWithTimeout } from '../../../util/timed-promise';

describe('promiseWithTimeout', () => {
	it('should resolve the promise if it resolves before the timeout', async () => {
		const promise = new Promise((resolve) => setTimeout(() => resolve('resolved'), 100));
		const result = await promiseWithTimeout(promise, 200);
		expect(result).toBe('resolved');
	});

	it('should reject the promise if it rejects before the timeout', async () => {
		const promise = new Promise((_, reject) => setTimeout(() => reject('rejected'), 100));
		try {
			await promiseWithTimeout(promise, 200);
		} catch (e) {
			expect(e).toBe('rejected');
		}
	});

	it('should reject the promise if it takes longer than the timeout', async () => {
		const promise = new Promise((resolve) => setTimeout(() => resolve('resolved'), 200));
		try {
			await promiseWithTimeout(promise, 100);
		} catch (e) {
			expect((e as Error).message).toBe('Timed out');
		}
	});
});
