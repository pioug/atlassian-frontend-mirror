import type { ErrorFileState } from '@atlaskit/media-state';
import type {
	MediaClientError,
	MediaClientErrorAttributes,
	MediaClientErrorReason,
	MediaClientErrorMetadata,
} from './types';

export type { MediaClientError, MediaClientErrorReason, MediaClientErrorAttributes } from './types';
export { isMediaClientError, getMediaClientErrorReason } from './helpers';

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

// The only reason why this class exists is because BaseMediaClientError is abstract class, so it can't be used to deserialize ErrorFileState. We can refactor and simplify this later.
/** Generic Media Client Erorr. All errors extending BaseMediaClientError match CommonMediaClientError attributes. Used to deserialize ErrorFileState */
export class CommonMediaClientError extends BaseMediaClientError<
	MediaClientErrorReason,
	MediaClientErrorMetadata | undefined,
	Error | undefined,
	MediaClientErrorAttributes
> {
	constructor(
		reason: MediaClientErrorReason,
		metadata?: MediaClientErrorMetadata,
		innerError?: Error,
	) {
		super(reason, metadata, innerError);
	}

	get attributes(): MediaClientErrorAttributes {
		return { reason: this.reason };
	}
}

export function isCommonMediaClientError(
	error: any,
): error is BaseMediaClientError<
	MediaClientErrorReason,
	MediaClientErrorMetadata | undefined,
	Error | undefined,
	MediaClientErrorAttributes
> {
	if (!error) {
		return false;
	}
	// Check if the error is an instance of Error
	if (error instanceof CommonMediaClientError) {
		return true;
	}

	return (
		typeof error.reason === 'string' &&
		('metadata' in error || error.metadata === undefined) &&
		('innerError' in error || error.innerError === undefined)
	);
}

/** Deserializer ErrorFileState -> CommonMediaClientError */
export const toCommonMediaClientError = (
	errorFileState: ErrorFileState,
): CommonMediaClientError => {
	const error = errorFileState.details?.error;
	return new CommonMediaClientError(
		error?.reason || 'unknown-reason',
		error?.metadata,
		error?.innerError,
	);
};

/** Serializer CommonMediaClientError -> ErrorFileState */
export const fromCommonMediaClientError = (
	id: string,
	occurrenceKey: string | undefined,
	error: CommonMediaClientError,
): ErrorFileState => {
	return {
		status: 'error',
		id,
		occurrenceKey,
		reason: error.reason,
		details: {
			/** Use this attr to translate back into CommonMediaClientError (toCommonMediaClientError) */
			error: { reason: error?.reason, metadata: error?.metadata, innerError: error?.innerError },
			// Legacy details
			...error?.attributes,
		},
		message: error?.message,
	};
};
