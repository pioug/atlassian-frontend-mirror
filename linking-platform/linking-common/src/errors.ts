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
	| 'UnexpectedError'; //500

// Used to catch any other errors - not server-side.
export type ErrorType = ServerErrorType | 'UnexpectedError';

export type APIErrorKind = 'fatal' | 'auth' | 'error' | 'fallback';

export class APIError extends Error {
	public constructor(
		public readonly kind: APIErrorKind,
		public readonly hostname: string,
		public readonly message: string,
		public readonly type?: ErrorType,
		public readonly extensionKey?: string,
	) {
		super(`${kind}: ${message}`);
		this.name = 'APIError';
		// The error type received from the server.
		this.type = type;
		// The kind mapped to on the client.
		this.kind = kind;
		// The message received from the server.
		this.message = message;
		// The hostname of the URL which failed - do NOT log this (contains PII/UGC).
		this.hostname = hostname;
		// The extensionKey passed from the error response from ORS
		this.extensionKey = extensionKey;
	}
}

export class InvalidUrlError extends Error {
	constructor(error: any) {
		super(error);
		this.name = 'InvalidUrlError';
	}
}
