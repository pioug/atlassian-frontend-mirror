export enum StatusCode {
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	TIMEOUT = 408,
	GONE = 410,
	PAYLOAD_TOO_LARGE = 413,
}

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
