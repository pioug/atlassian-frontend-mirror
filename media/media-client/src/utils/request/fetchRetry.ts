import { RequestError } from './RequestError';
import { cloneRequestError } from './cloneRequestError';
import { defaultShouldRetryError } from './defaultShouldRetryError';
import { DEFAULT_RETRY_OPTIONS } from './helpers';
import { isAbortedRequestError } from './isAbortedRequestError';
import { isRequestError } from './isRequestError';
import { type RequestMetadata, type RetryOptions } from './types';
import { waitPromise } from './waitPromise';

export async function fetchRetry(
	functionToRetry: () => Promise<Response>,
	metadata: RequestMetadata,
	overwriteOptions: Partial<RetryOptions> = {},
): Promise<Response> {
	const options = {
		...DEFAULT_RETRY_OPTIONS,
		...overwriteOptions,
	};
	const {
		startTimeoutInMs,
		maxAttempts,
		factor,
		shouldRetryError = defaultShouldRetryError,
	} = options;

	let attempts = 0;
	let timeoutInMs = startTimeoutInMs;
	let lastError: any;

	const waitAndBumpTimeout = async () => {
		await waitPromise(timeoutInMs);
		timeoutInMs *= factor;
		attempts += 1;
	};

	while (attempts < maxAttempts) {
		try {
			return await functionToRetry();
		} catch (err: any) {
			lastError = err;

			// don't retry if request was aborted by user
			if (isAbortedRequestError(err)) {
				throw new RequestError('clientAbortedRequest', metadata, err);
			}

			if (!shouldRetryError(err)) {
				throw err;
			}

			await waitAndBumpTimeout();
		}
	}

	if (isRequestError(lastError)) {
		throw cloneRequestError(lastError, {
			attempts,
			clientExhaustedRetries: true,
		});
	}

	throw new RequestError(
		'serverUnexpectedError',
		{
			...metadata,
			attempts,
			clientExhaustedRetries: true,
		},
		lastError,
	);
}
