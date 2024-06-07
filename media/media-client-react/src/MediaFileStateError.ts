export class MediaFileStateError extends Error {
	constructor(
		readonly id: string,
		readonly reason?: string,
		readonly message: string = '',
		readonly details?: Record<string, any>,
	) {
		super(reason);
		// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
		Object.setPrototypeOf(this, new.target.prototype);

		// https://v8.dev/docs/stack-trace-api
		if ('captureStackTrace' in Error) {
			Error.captureStackTrace(this, new.target);
		}
	}
}
