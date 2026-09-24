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
