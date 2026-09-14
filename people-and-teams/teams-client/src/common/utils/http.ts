import { is5xx } from './is5xx';
import { withExponentialBackoff } from './with-exponential-backoff';

// Mirrors the (non-exported) argument type of `withExponentialBackoff`, so that
// `fetchWithExponentialBackoff` keeps the signature it had before debarrelling.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToTryFunctionArgs = any[];

export const EXPONENTIAL_BACKOFF_RETRY_POLICY = {
	INITIAL_DELAY: 200,
	MAX_RETRIES: 5,
	JITTER: true,
};

export const fetchWithExponentialBackoff: (...args: ToTryFunctionArgs) => Promise<Response> =
	withExponentialBackoff<Response>(
		(url: Parameters<typeof fetch>[0], init: Parameters<typeof fetch>[1]) => fetch(url, init),
		{
			initial: EXPONENTIAL_BACKOFF_RETRY_POLICY.INITIAL_DELAY,
			jitter: EXPONENTIAL_BACKOFF_RETRY_POLICY.JITTER,
			max: EXPONENTIAL_BACKOFF_RETRY_POLICY.MAX_RETRIES,
			retryIf: (response: Response) => is5xx(response.status),
		},
	);
