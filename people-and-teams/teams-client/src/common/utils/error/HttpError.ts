import { CommonError } from './CommonError';
import type { HttpErrorArguments } from './HttpErrorArguments';

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
