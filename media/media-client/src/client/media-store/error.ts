import { BaseMediaClientError } from '../../models/errors';

export type MediaStoreErrorReason =
	| 'failedAuthProvider'
	| 'tokenExpired'
	| 'missingInitialAuth'
	| 'emptyAuth'
	| 'authProviderTimedOut';

export type MediaStoreErrorAttributes = {
	readonly reason: MediaStoreErrorReason;
	readonly innerError?: Error;
};
export class MediaStoreError extends BaseMediaClientError<
	MediaStoreErrorReason,
	undefined,
	Error | undefined,
	// TODO: Deprecate this https://product-fabric.atlassian.net/browse/CXP-4665
	MediaStoreErrorAttributes
> {
	constructor(reason: MediaStoreErrorReason, innerError?: Error) {
		super(reason, undefined, innerError);
	}

	// TODO: Deprecate this getter https://product-fabric.atlassian.net/browse/CXP-4665
	/** Will be deprecated. Use the properties `reason` and `metadata` instead */
	get attributes() {
		const { reason, innerError } = this;
		return {
			reason,
			innerError,
		};
	}
}

export function isMediaStoreError(err: Error): err is MediaStoreError {
	return err instanceof MediaStoreError;
}
