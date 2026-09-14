// Extending new custom Error types with `Object.setPrototypeOf`
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
export class CommonError extends Error {
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
