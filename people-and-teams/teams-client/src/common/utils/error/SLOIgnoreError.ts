import { CommonError } from './CommonError';

/**
 * These errors will not fail UFO experiences
 */
export class SLOIgnoreError extends CommonError {
	constructor({ message }: { message?: string }) {
		super(`SentryIgnore: ${message || 'UnknownError'}`);
		Object.setPrototypeOf(this, SLOIgnoreError.prototype);
	}
}
