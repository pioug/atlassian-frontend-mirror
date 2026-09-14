import type {
	MediaClientError,
	MediaClientErrorAttributes,
	MediaClientErrorReason,
	MediaClientErrorMetadata,
} from './types';

/**
 * Base class for media errors
 */
export abstract class BaseMediaClientError<
	Reason extends MediaClientErrorReason,
	Metadata extends MediaClientErrorMetadata | undefined,
	InnerError extends Error | undefined,
	// TODO: Deprecate attributes getter https://product-fabric.atlassian.net/browse/CXP-4665
	Attributes extends MediaClientErrorAttributes,
>
	extends Error
	// TODO: Deprecate attributes getter https://product-fabric.atlassian.net/browse/CXP-4665
	implements MediaClientError<Attributes>
{
	constructor(
		readonly reason: Reason,
		readonly metadata: Metadata,
		readonly innerError: InnerError,
	) {
		super(reason);

		// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
		Object.setPrototypeOf(this, new.target.prototype);

		// https://v8.dev/docs/stack-trace-api
		if ('captureStackTrace' in Error) {
			Error.captureStackTrace(this, new.target);
		}
	}

	// TODO: Deprecate attributes getter https://product-fabric.atlassian.net/browse/CXP-4665
	abstract get attributes(): Attributes;
}
