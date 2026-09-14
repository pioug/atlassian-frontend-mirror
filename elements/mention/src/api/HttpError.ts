export class HttpError implements Error {
	name: string;
	message: string;
	statusCode: number;
	stack?: string;

	constructor(statusCode: number, statusMessage: string) {
		this.statusCode = statusCode;
		this.message = statusMessage;
		this.name = 'HttpError';
		this.stack = new Error().stack;
	}
}
