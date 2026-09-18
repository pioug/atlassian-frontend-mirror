/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import type { RetryConfig } from '@atlaskit/frontend-utilities/retry-operation/types'` instead.
 */

export { type RetryConfig } from './types';
/**
 * @deprecated Use `import { wait } from '@atlaskit/frontend-utilities/retry-operation/wait'` instead.
 */
export { wait } from './wait';
/**
 * @deprecated Use `import FailedFetchError from '@atlaskit/frontend-utilities/retry-operation/FailedFetchError'` instead.
 */
export { default as FailedFetchError } from './errors/FailedFetchError';
/**
 * @deprecated Use `import { retryOnException } from '@atlaskit/frontend-utilities/retry-operation/retry-on-exception'` instead.
 */
export { retryOnException } from './retry-on-exception';
