import { captureException } from '@atlaskit/linking-common/sentry';

type Tail<T extends any[]> = T extends [infer _A, ...infer R] ? R : never;

/**
 * This function is just a wrapper around captureException that checks if the enable-sentry-client FF is enabled
 * and error is instanceof Error. We have to override the type of error from captureException to unknown so we use
 * a helper Tail type which removes the first element of the tuple
 */
export const logToSentry = (
	error: unknown,
	...captureExceptionParams: Tail<Parameters<typeof captureException>>
): void => {
	if (error instanceof Error) {
		captureException(error, ...captureExceptionParams);
	}
};
