import { type MediaTraceContext } from '@atlaskit/media-common';

export interface SerializableObject {
	[key: string]: string | number | boolean | null | undefined | SerializableObject;
}

export type MediaClientErrorReason =
	// RequestErrorReason ----------------------------
	| 'clientOffline'
	| 'clientAbortedRequest'
	| 'clientTimeoutRequest'
	| 'serverInvalidBody'
	| 'serverBadRequest'
	| 'serverUnauthorized'
	| 'serverForbidden'
	| 'serverNotFound'
	| 'serverRateLimited'
	| 'serverInternalError'
	| 'serverBadGateway'
	| 'serverUnexpectedError'
	| 'serverUnprocessableEntity'
	| 'serverEntityLocked'
	// MediaStoreErrorReason ----------------------------
	| 'failedAuthProvider'
	| 'tokenExpired'
	| 'missingInitialAuth'
	| 'emptyAuth'
	| 'authProviderTimedOut'
	// FileFetcherErrorReason ----------------------------
	| 'invalidFileId'
	| 'emptyItems'
	| 'zeroVersionFile'
	| 'emptyFileName'
	// PollingErrorReason ----------------------------
	| 'pollingMaxAttemptsExceeded'
	//UploaderErrorReason ----------------------------
	| 'fileSizeExceedsLimit'
	// DeprecatedErrorReason ----------------------------
	| 'deprecatedEndpoint';

export type MediaClientErrorMetadata = SerializableObject & {
	// Common attributes (must be serializable)
	traceContext?: MediaTraceContext;
};

export interface MediaClientErrorAttributes {
	reason: MediaClientErrorReason;
}

/**
 * MediaClientError is the main interface which all the errors
 * in Media Client must implement.
 * MediaClientErrorReason is a dictionary that restricts all the possible
 * reasons that the erros can define. Its values are private to this file.
 * Any new error has to define its own Error Reasons locally, and also declare them
 * here to comply with the interface restrictions
 */
export interface MediaClientError<Attributes extends MediaClientErrorAttributes> extends Error {
	readonly attributes: Attributes;
}
