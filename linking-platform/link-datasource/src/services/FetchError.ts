export class FetchError extends Error {
	statusCode: number;
	constructor(statusCode: number, message?: string) {
		super(message || `Fetch call failed with status code: ${statusCode}`);
		this.name = 'FetchError';
		this.statusCode = statusCode;
	}
}
