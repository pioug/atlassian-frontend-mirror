import { convertToError } from '../../error-handling/convert-to-error';

import { NO_RETRIES } from './constants';
import FailedFetchError from './errors/FailedFetchError';

export interface RetryConfig {
	captureException?: (error: Error, tags?: Record<string, string>) => void;
	intervalsMS?: Readonly<number[]>;
	onRetry?: (previousErr: Error) => void;
	retryOn?: (typeof Error | typeof FailedFetchError)[] | ((e: Error) => boolean);
}

export const wait = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

const NO_CALLS_ERROR = 'No calls made';

const retryOnException = async <T>(
	invokeOperation: () => Promise<T>,
	{
		intervalsMS = NO_RETRIES,
		retryOn = [FailedFetchError],
		captureException,
		onRetry,
	}: RetryConfig,
): Promise<T> => {
	const intervals = [...intervalsMS];

	let nextMSInterval: number | undefined = 0;
	let error = new Error(NO_CALLS_ERROR);

	while (nextMSInterval !== undefined) {
		try {
			if (nextMSInterval > 0) {
				await wait(nextMSInterval);
			}
			if (onRetry && error.message !== NO_CALLS_ERROR) {
				onRetry(error);
			}
			return await invokeOperation();
		} catch (e) {
			error = convertToError(e);

			if (captureException) {
				captureException(error);
			}

			// Retry ONLY when the error is an instance of one of the provided `retryOn` errors, or passes the `retryOn` test.
			// You need to ensure you are throwing one of the `retryOn` errors if that is the method you are using.
			if (
				typeof retryOn === 'function' ? retryOn(error) : retryOn.some((err) => error instanceof err)
			) {
				nextMSInterval = intervals.shift();
			} else {
				nextMSInterval = undefined;
			}
		}
	}
	throw error;
};

export { FailedFetchError, retryOnException };
