import { promiseWithTimeout } from '../../../util/timed-promise';

describe('promiseWithTimeout', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should resolve the promise if it resolves before the timeout', async () => {
		const promise = Promise.resolve('resolved');
		const result = promiseWithTimeout(promise, 200);

		jest.advanceTimersByTime(100); // Advance time to less than the timeout
		await expect(result).resolves.toBe('resolved');
	});

	it('should reject the promise if it rejects before the timeout', async () => {
		const promise = Promise.reject('rejected');
		const result = promiseWithTimeout(promise, 200);

		jest.advanceTimersByTime(100); // Advance time to less than the timeout
		await expect(result).rejects.toBe('rejected');
	});

	it('should reject the promise if it takes longer than the timeout', async () => {
		const promise = new Promise((resolve) => setTimeout(() => resolve('resolved'), 200));
		const result = promiseWithTimeout(promise, 100);

		jest.advanceTimersByTime(100); // Advance time to the timeout
		await expect(result).rejects.toThrow('Timed out');
	});
});
