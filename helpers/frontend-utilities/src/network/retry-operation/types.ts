import type FailedFetchError from './errors/FailedFetchError';

export interface RetryConfig {
	captureException?: (error: Error, tags?: Record<string, string>) => void;
	intervalsMS?: Readonly<number[]>;
	onRetry?: (previousErr: Error) => void;
	retryOn?: (typeof Error | typeof FailedFetchError)[] | ((e: Error) => boolean);
}
