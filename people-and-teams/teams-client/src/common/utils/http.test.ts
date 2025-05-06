import { is5xx, withExponentialBackoff } from './http';

describe('is5xx', () => {
	test('499 is NOT 5xx', () => {
		expect(is5xx(499)).toBe(false);
	});

	test('500 is 5xx', () => {
		expect(is5xx(500)).toBe(true);
	});

	test('501 is 5xx', () => {
		expect(is5xx(501)).toBe(true);
	});

	test('599 is 5xx', () => {
		expect(is5xx(599)).toBe(true);
	});

	test('600 is NOT 5xx', () => {
		expect(is5xx(600)).toBe(false);
	});
});

describe('exponentialBackoff', () => {
	const pretendToTry = jest.fn();

	afterEach(() => {
		pretendToTry.mockReset();
	});

	test('Retries the correct number of times', async () => {
		const pretendToTryWithExpBackoff = withExponentialBackoff(pretendToTry, {
			initial: 1, // make test go fast
			max: 3,
			retryIf: () => true, // always retry
		});
		await pretendToTryWithExpBackoff();

		expect(pretendToTry).toHaveBeenCalledTimes(3);
	});

	test('Evaluates retryIf callback', async () => {
		pretendToTry
			.mockResolvedValueOnce('retry')
			.mockResolvedValueOnce('retry')
			.mockResolvedValueOnce('do not retry')
			.mockResolvedValueOnce('retry'); // Shouldn't get resolved

		const pretendToTryWithExpBackoff = withExponentialBackoff(pretendToTry, {
			initial: 1, // make test go fast
			max: 5,
			retryIf: (a: string) => a === 'retry',
		});
		await pretendToTryWithExpBackoff();

		// Called once initially + 2 retries
		expect(pretendToTry).toHaveBeenCalledTimes(3);
	});

	test('Returns result if retries are maxed out', async () => {
		pretendToTry.mockResolvedValue('boo');
		const pretendToTryWithExpBackoff = withExponentialBackoff(pretendToTry, {
			initial: 1, // make test go fast
			max: 3,
			retryIf: () => true, // retry until max is reached
		});

		const result = await pretendToTryWithExpBackoff();

		expect(result).toBe('boo');

		expect(pretendToTry).toHaveBeenCalledTimes(3);
	});
});
