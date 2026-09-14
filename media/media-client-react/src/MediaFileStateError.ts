/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
// TODO: deprecate https://product-fabric.atlassian.net/browse/CXP-4669
/** Will be deprecated. Use Media Client `toCommonMediaClientError` instead  */
export class MediaFileStateError extends Error {
	constructor(
		readonly id: string,
		readonly reason?: string,
		readonly message: string = '',
		readonly details?: Record<string, any> | undefined,
	) {
		super(reason);
		// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
		Object.setPrototypeOf(this, new.target.prototype);

		// https://v8.dev/docs/stack-trace-api
		if ('captureStackTrace' in Error) {
			Error.captureStackTrace(this, new.target);
		}
	}
}

/**
 * @deprecated Use `import { isMediaFileStateError } from '@atlaskit/media-client-react'` instead.
 */
export { isMediaFileStateError } from './isMediaFileStateError';
/**
 * @deprecated Use `import { getFileStateErrorReason } from '@atlaskit/media-client-react'` instead.
 */
export { getFileStateErrorReason } from './getFileStateErrorReason';
