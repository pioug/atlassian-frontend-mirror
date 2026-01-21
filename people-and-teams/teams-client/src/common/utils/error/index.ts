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

export function isAuthError(error?: Error | HttpError): boolean {
	return (
		isErrorStatusCode(StatusCode.UNAUTHORIZED, error) ||
		isErrorStatusCode(StatusCode.FORBIDDEN, error)
	);
}

export function isErrorStatusCode(statusCode: number, error?: Error | HttpError): boolean {
	if (!error) {
		return false;
	}

	if (
		(error as any)['status'] === statusCode ||
		// error can be `ProperNetworkError` from `packages/graphql-client/src/links/error.ts`
		(error as any)['statusCode'] === statusCode
	) {
		return true;
	}

	const reg = new RegExp(`status (code)?.*(${statusCode})`);
	return !!error?.message?.match(reg);
}

export function doesErrorContainStatus(statusCode: number, message: string): boolean {
	const reg = new RegExp(`status .*(${statusCode})`);
	return reg.test(message);
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

// Extending new custom Error types with `Object.setPrototypeOf`
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf

class CommonError extends Error {
	message: string;
	name: string;
	stack: string;
	constructor(message?: string) {
		super(message);
		this.name = this.constructor.name;
		this.message = message || 'UnknownError';
		this.stack = new Error(message).stack || '';
	}
}

export class DefaultError extends CommonError {
	constructor({ message }: { message?: string }) {
		super(message || 'UnknownError');
		Object.setPrototypeOf(this, DefaultError.prototype);
	}
}

/**
 * These errors will not fail UFO experiences
 */
export class SLOIgnoreError extends CommonError {
	constructor({ message }: { message?: string }) {
		super(`SentryIgnore: ${message || 'UnknownError'}`);
		Object.setPrototypeOf(this, SLOIgnoreError.prototype);
	}
}

interface HttpErrorArguments {
	message: string;
	status: number;
	traceId?: string;
	path?: string;
}

// Http Errors
export class HttpError extends CommonError {
	status: number;
	traceId?: string;
	path?: string;

	constructor({ message, status, traceId, path }: HttpErrorArguments) {
		super(message);
		Object.setPrototypeOf(this, HttpError.prototype);

		this.status = status;
		this.traceId = traceId;
		this.path = path;
	}
}

/**
 * These errors will not fail UFO experiences
 */
export class SLOIgnoreHttpError extends HttpError {
	constructor(props: HttpErrorArguments) {
		super(props);
		Object.setPrototypeOf(this, SLOIgnoreHttpError.prototype);
	}
}

// Graphql Errors
interface ResultErrorData {
	category: string;
	message: string;
	fields?: object;
}

interface FieldError {
	message: string;
	field: string;
}
export interface ErrorData {
	category: string;
	message: string;
	fields?: FieldError[];
}

export class GraphQLError extends CommonError {
	fields?: any; // tslint:disable-line no-any
	category?: string;

	constructor({ message, category = 'default', fields }: Partial<ResultErrorData>) {
		super(message);
		Object.setPrototypeOf(this, GraphQLError.prototype);

		this.category = category;

		if (fields) {
			this.fields = fields;
		}
	}

	static from = (rawErrors: ErrorData[]) => {
		const firstError = rawErrors[0];

		const errorData: ResultErrorData = {
			category: firstError.category,
			message: firstError.message,
		};

		if (firstError.fields) {
			errorData.fields = firstError.fields.reduce<Record<string, string>>((obj, item) => {
				obj[item.field] = item.message;
				return obj;
			}, {});
		}

		return new GraphQLError(errorData);
	};
}

export function isNetworkError(error: Error): boolean {
	return (
		error &&
		!!error.message &&
		// Firefox
		(error.message.includes('NetworkError') ||
			// Chrome
			error.message.startsWith('Failed to fetch') ||
			error.message.includes('GraphQL error: Failed to fetch') ||
			// cancel by users or unknown reason
			error.message.includes('GraphQL error: The operation was aborted') ||
			error.message.includes('GraphQL error: cancelled') ||
			error.message.includes('Abgebrochen') ||
			error.message.includes('отменено') ||
			error.message.includes('Сетевое соединение потеряно.') ||
			error.message.includes('anulowane') ||
			error.message.includes('annulé') ||
			error.message.includes('已取消') ||
			error.message.includes('cancelado') ||
			error.message.includes('キャンセルしました') ||
			error.message.includes('cancelled') ||
			error.message.includes('Network error') ||
			// GraphQL-wrapping network error
			!!((error as any)['graphQLErrors'] && (error as any)['networkError']))
	);
}
