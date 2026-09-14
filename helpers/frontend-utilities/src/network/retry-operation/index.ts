/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import FailedFetchError from '@atlaskit/frontend-utilities/retry-operation/FailedFetchError'` instead.
 */
export { FailedFetchError } from './errors/FailedFetchError';
/**
 * @deprecated Use `import { retryOnException } from '@atlaskit/frontend-utilities/retry-operation/retry-on-exception'` instead.
 */
export { retryOnException } from './retry-on-exception';
/**
 * @deprecated Use `import type { RetryConfig } from '@atlaskit/frontend-utilities/retry-operation/types'` instead.
 */
export { type RetryConfig } from './types';
/**
 * @deprecated Use `import { NO_RETRIES, UP_TO_TWO_INSTANT_RETRIES, DEFAULT_RETRIES, LAZY_LOAD_RETRIES } from '@atlaskit/frontend-utilities/retry-operation/constants'` instead.
 */
export {
	NO_RETRIES,
	UP_TO_TWO_INSTANT_RETRIES,
	DEFAULT_RETRIES,
	LAZY_LOAD_RETRIES,
} from './constants';
