/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export type ServerErrorType =
	// deprecated error types
	| 'ResolveBadRequestError'
	| 'ResolveAuthError'
	| 'ResolveUnsupportedError'
	| 'ResolveFailedError'
	| 'ResolveRateLimitError'
	| 'ResolveTimeoutError'
	| 'SearchBadRequestError'
	| 'SearchAuthError'
	| 'SearchUnsupportedError'
	| 'SearchFailedError'
	| 'SearchTimeoutError'
	| 'SearchRateLimitError'
	| 'InternalServerError'
	// new combined error types from ORS /model/errors.ts
	| 'UnsupportedError' // 404
	| 'AuthError' // 401, 403
	| 'TimeoutError' //502, 503, 504
	| 'OperationFailedError' // 500
	| 'BadRequestError' // 400
	| 'RateLimitError' //429
	| 'UnexpectedError';

//500
// Used to catch any other errors - not server-side.
export type ErrorType = ServerErrorType | 'UnexpectedError';

/**
 * @deprecated Use `import { APIError } from '@atlaskit/linking-common/api/errors'` instead.
 */
export { APIError } from './APIError';
export type { APIErrorKind } from './APIError';
/**
 * @deprecated Use `import { InvalidUrlError } from '@atlaskit/linking-common/api/errors'` instead.
 */
export { InvalidUrlError } from './InvalidUrlError';
/**
 * @deprecated Use `import { NetworkError } from '@atlaskit/linking-common/api/errors'` instead.
 */
export { NetworkError } from './NetworkError';
