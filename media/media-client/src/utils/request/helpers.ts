/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import { type RetryOptions } from './types';

export const ZipkinHeaderKeys = {
	traceId: 'x-b3-traceid',
	spanId: 'x-b3-spanid',
	parentSpanId: 'x-b3-parentspanid',
	sampled: 'x-b3-sampled',
	flags: 'x-b3-flags',
};

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
	startTimeoutInMs: 1000, // 1 second is generally a good timeout to start
	maxAttempts: 5, // Current test delay is 60s, so retries should finish before if a promise takes < 1s
	factor: 2, // Good for polling, which is out main use case
};

/**
 * @deprecated Use `import { waitPromise } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { waitPromise } from './waitPromise';
/**
 * @deprecated Use `import { isAbortedRequestError } from '@atlaskit/media-client'` instead.
 */
export { isAbortedRequestError } from './isAbortedRequestError';
/**
 * @deprecated Use `import { isFetchNetworkError } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { isFetchNetworkError } from './isFetchNetworkError';
/**
 * @deprecated Use `import { isRateLimitedError } from '@atlaskit/media-client/request'` instead.
 */
export { isRateLimitedError } from './isRateLimitedError';
/**
 * @deprecated Use `import { extendTraceContext } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { extendTraceContext } from './extendTraceContext';
/**
 * @deprecated Use `import { mapAuthToRequestHeaders } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { mapAuthToRequestHeaders } from './mapAuthToRequestHeaders';
/**
 * @deprecated Use `import { createUrl } from '@atlaskit/media-client'` instead.
 */
export { createUrl } from './createUrl';
/**
 * @deprecated Use `import { extendHeaders } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { extendHeaders } from './extendHeaders';
/**
 * @deprecated Use `import { createMapResponseToJson } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { createMapResponseToJson } from './createMapResponseToJson';
/**
 * @deprecated Use `import { createMapResponseToBlob } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { createMapResponseToBlob } from './createMapResponseToBlob';
/**
 * @deprecated Use `import { defaultShouldRetryError } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { defaultShouldRetryError } from './defaultShouldRetryError';
/**
 * @deprecated Use `import { cloneRequestError } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { cloneRequestError } from './cloneRequestError';
/**
 * @deprecated Use `import { fetchRetry } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { fetchRetry } from './fetchRetry';
/**
 * @deprecated Use `import { createRequestErrorReason } from '@atlaskit/media-client/request'` instead.
 */
export { createRequestErrorReason } from './createRequestErrorReason';
/**
 * @deprecated Use `import { createRequestErrorFromResponse } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { createRequestErrorFromResponse } from './createRequestErrorFromResponse';
/**
 * @deprecated Use `import { createProcessFetchResponse } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { createProcessFetchResponse } from './createProcessFetchResponse';
/**
 * @deprecated Use `import { extractMediaHeaders } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { extractMediaHeaders } from './extractMediaHeaders';
/**
 * @deprecated Use `import { getStatusCode } from '@atlaskit/media-client/request/helpers'` instead.
 */
export { getStatusCode } from './getStatusCode';
