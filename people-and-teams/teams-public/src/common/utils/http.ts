export const EXPONENTIAL_BACKOFF_RETRY_POLICY = {
	INITIAL_DELAY: 200,
	MAX_RETRIES: 5,
	JITTER: true,
};

/**
 * Checks whether a status code is a 5xx HTTP code.
 * @param {number} status HTTP status code
 */
export function is5xx(status: number) {
	return 500 <= status && status <= 599;
}

export function isFetchResponse(data: unknown): data is { response: Response } {
	if (!data || !(data as any).hasOwnProperty('response')) {
		return false;
	}
	return (data as { response: unknown }).response instanceof Response;
}

// tslint:disable-next-line no-any
type ToTryFunctionArgs = any[];
type ToTryFunction<T> = (...args: ToTryFunctionArgs) => Promise<T>;
type RetryIfCallback<T> = (a: T) => boolean;
interface WithExponentialBackoffOptions<T> {
	initial: number;
	jitter?: boolean;
	max: number;
	retryIf?: RetryIfCallback<T>;
}
// tslint:disable-next-line no-any
const defaultRetryIfCallback = (a: any) => !a;
const defaultOptions = {
	initial: 200,
	jitter: false,
	max: 5,
	retryIf: defaultRetryIfCallback,
};
/**
 * Transparently wrap a function so that it is retried until it succeeds or reaches a max retry limit.
 * The returned function has the same signature as the wrapped function.
 *
 * Modified from https://jsfiddle.net/pajtai/pLka0ow9/
 */
export function withExponentialBackoff<ResponseType>(
	toTry: ToTryFunction<ResponseType>,
	hofOptions: WithExponentialBackoffOptions<ResponseType> = defaultOptions,
) {
	const { initial, jitter, max, retryIf } = hofOptions;

	// Initialize max retry decrementing counter (range of max...0)
	let attemptsRemaining = max;

	// Initialize delay. This will exponentially increase each retry (delay = intial * 2^n)
	let delay = initial;

	/**
	 * This function calls itself recursively until `retryIf` evaluates false or the retry limit is reached.
	 * The functioned-to-be-retried is called on each recursion.
	 */
	return async function tryWithExponentialBackoff(
		...args: ToTryFunctionArgs
	): Promise<ResponseType> {
		// "An attempt was made"
		const result = await toTry(...args);
		--attemptsRemaining;

		// If tried function was unsuccessful and there are still retries remaining, retry!
		if (retryIf && retryIf(result) && attemptsRemaining > 0) {
			// Wait for delay
			await new Promise((resolve) => setTimeout(resolve, jitter ? Math.random() * delay : delay));

			// Exponentially increase delay
			delay *= 2;

			// Initiate retry
			return tryWithExponentialBackoff(...args);
		}

		// Return result of tried function if it is successful or if the retry limit
		// was reached regardless of success.
		return result;
	};
}

export const fetchWithExponentialBackoff = withExponentialBackoff<Response>(
	(url: Parameters<typeof fetch>[0], init: Parameters<typeof fetch>[1]) => fetch(url, init),
	{
		initial: EXPONENTIAL_BACKOFF_RETRY_POLICY.INITIAL_DELAY,
		jitter: EXPONENTIAL_BACKOFF_RETRY_POLICY.JITTER,
		max: EXPONENTIAL_BACKOFF_RETRY_POLICY.MAX_RETRIES,
		retryIf: (response: Response) => is5xx(response.status),
	},
);
