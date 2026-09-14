/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
export enum ErrorCategory {
	NotFound = 'NotFound',
	NotPermitted = 'NotPermitted',
	MalformedInput = 'MalformedInput',
	Internal = 'Internal',
}

export enum StatusCode {
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	TIMEOUT = 408,
	GONE = 410,
	PAYLOAD_TOO_LARGE = 413,
}

export type DirectoryErrorCode = 'MISSING_ERROR_MESSAGE';

export enum TeamErrorType {
	TEAM_NOT_ACTIVE = 'Team must be active',
}

export type ErrorObjectType = {
	code?: string;
	message?: TeamErrorType;
};

export type SingleError = {
	status?: number;
	error?: string;
};

export type RestJsonErrorResponse = {
	errors: (TeamErrorType | ErrorObjectType)[];
	timestamp?: string;
} & SingleError;

interface FieldError {
	message: string;
	field: string;
}

export interface ErrorData {
	category: string;
	message: string;
	fields?: FieldError[];
}

/**
 * @deprecated Use `import { isAuthError } from '@atlaskit/teams-client/is-auth-error'` instead.
 */
export { isAuthError } from './isAuthError';
/**
 * @deprecated Use `import { isErrorStatusCode } from '@atlaskit/teams-client/is-error-status-code'` instead.
 */
export { isErrorStatusCode } from './isErrorStatusCode';
/**
 * @deprecated Use `import { doesErrorContainStatus } from '@atlaskit/teams-client/does-error-contain-status'` instead.
 */
export { doesErrorContainStatus } from './doesErrorContainStatus';
/**
 * @deprecated Use `import { DefaultError } from '@atlaskit/teams-client/default-error'` instead.
 */
export { DefaultError } from './DefaultError';
/**
 * @deprecated Use `import { SLOIgnoreError } from '@atlaskit/teams-client/slo-ignore-error'` instead.
 */
export { SLOIgnoreError } from './SLOIgnoreError';
/**
 * @deprecated Use `import { HttpError } from '@atlaskit/teams-client/http-error'` instead.
 */
export { HttpError } from './HttpError';
/**
 * @deprecated Use `import { SLOIgnoreHttpError } from '@atlaskit/teams-client/slo-ignore-http-error'` instead.
 */
export { SLOIgnoreHttpError } from './SLOIgnoreHttpError';
/**
 * @deprecated Use `import { GraphQLError } from '@atlaskit/teams-client/graph-ql-error'` instead.
 */
export { GraphQLError } from './GraphQLError';
/**
 * @deprecated Use `import { isNetworkError } from '@atlaskit/teams-client/is-network-error'` instead.
 */
export { isNetworkError } from './isNetworkError';
