import { CommonError } from './CommonError';

export class DefaultError extends CommonError {
	constructor({ message }: { message?: string }) {
		super(message || 'UnknownError');
		Object.setPrototypeOf(this, DefaultError.prototype);
	}
}
