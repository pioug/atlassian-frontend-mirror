export type FetchWithRetryParams = {
	baseDelay?: number;
	maxDelay?: number;
	options?: RequestInit;
	retries?: number;
	shouldRetryOnApiError: boolean;
	url: string;
};

/**
 * Calculates a backoff time with jitter for exponential backoff retry strategy
 * @param retryCount - The current retry attempt number (starting from 0)
 * @param initialDelay - The initial delay in milliseconds
 * @param maxDelay - The maximum delay in milliseconds
 * @param factor - The exponential factor to increase delay
 * @returns The calculated delay time in milliseconds
 */
export const maxExpBackoffWithJitter = (
	retryCount: number,
	initialDelay = 1000,
	maxDelay = 30000,
	factor = 2,
): number => {
	// Calculate exponential backoff
	const delay = Math.min(initialDelay * Math.pow(factor, retryCount), maxDelay);

	// Add random jitter (between 0 and current delay value)
	return Math.floor(Math.random() * delay);
};

export const fetchWithRetry: (params: FetchWithRetryParams) => Promise<{
	error?: Error;
	result?: Response;
	success: boolean;
}> = async ({
	url,
	options,
	shouldRetryOnApiError,
	retries = 3,
	baseDelay = 300,
	maxDelay = 10000,
}) => {
	try {
		const response = await fetch(url, options);
		if (response.ok) {
			return { success: true, result: response };
		}
		if (shouldRetryOnApiError) {
			throw new Error('Failed request with an error');
		}
		const errorBody = await response.json();
		return { success: false, error: new Error(errorBody) };
	} catch (error: unknown) {
		if (retries > 0) {
			const retryDelay = maxExpBackoffWithJitter(retries, baseDelay, maxDelay);
			await new Promise((resolve) => setTimeout(resolve, retryDelay));
			return fetchWithRetry({
				url,
				options,
				shouldRetryOnApiError,
				retries: retries - 1,
				baseDelay,
				maxDelay,
			});
		}
		const newError = error instanceof Error ? error : new Error('An unknown error occurred');
		return { success: false, error: newError };
	}
};
