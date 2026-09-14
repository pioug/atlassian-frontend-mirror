import { HttpError } from './HttpError';
import type { HttpErrorArguments } from './HttpErrorArguments';

/**
 * These errors will not fail UFO experiences
 */
export class SLOIgnoreHttpError extends HttpError {
	constructor(props: HttpErrorArguments) {
		super(props);
		Object.setPrototypeOf(this, SLOIgnoreHttpError.prototype);
	}
}
