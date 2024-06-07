import { retryOnException } from './main';

describe('retryOnException', () => {
	it('successful operation returns result', async () => {
		const onRetry = jest.fn();
		const operation = () => {
			return Promise.resolve(true);
		};

		const res = await retryOnException(operation, { intervalsMS: [], onRetry });

		expect(res).toEqual(true);
		expect(onRetry).not.toHaveBeenCalled();
	});

	it('unsuccessful operation retries', async () => {
		const onRetry = jest.fn();
		const mockOperation = jest.fn();
		const operation = () => {
			mockOperation();

			return Promise.reject(new Error('fail'));
		};

		try {
			await retryOnException(operation, {
				intervalsMS: [0, 0],
				retryOn: [Error],
				onRetry,
			});
		} catch (e) {
			expect(mockOperation).toHaveBeenCalledTimes(3);
			expect(onRetry).toHaveBeenCalledTimes(2);
		}
	});

	it('unsuccessful operation retries using retryOn function', async () => {
		const mockOperation = jest.fn();
		const operation = () => {
			mockOperation();

			return Promise.reject(new Error('fail'));
		};

		try {
			await retryOnException(operation, {
				intervalsMS: [0, 0],
				retryOn: (e) => e.message === 'fail',
			});
		} catch (e) {
			expect(mockOperation).toHaveBeenCalledTimes(3);
		}
	});

	it('unsuccessful operation does not retry when retryOn function returns false', async () => {
		const mockOperation = jest.fn();
		const operation = () => {
			mockOperation();

			return Promise.reject(new Error('fail'));
		};

		try {
			await retryOnException(operation, {
				intervalsMS: [0, 0],
				retryOn: (e) => e.message !== 'fail',
			});
		} catch (e) {
			expect(mockOperation).toHaveBeenCalledTimes(1);
		}
	});
});
