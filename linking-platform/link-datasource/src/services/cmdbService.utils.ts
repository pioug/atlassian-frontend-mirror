export const mapFetchErrors = (error: any): Error => {
	if (error instanceof Response && !error.ok) {
		return new FetchError(error.status, `Error server response: ${error.status}`);
	}
	return error;
};

export const getStatusCodeGroup = (error: Error) => {
	if (error instanceof FetchError) {
		const { statusCode } = error;
		if (statusCode >= 100 && statusCode < 200) {
			return '1xx';
		}
		if (statusCode >= 300 && statusCode < 400) {
			return '3xx';
		}
		if (statusCode >= 400 && statusCode < 500) {
			return '4xx';
		}
		if (statusCode >= 500 && statusCode < 600) {
			return '5xx';
		}
	}
	return 'unknown';
};

export class PermissionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PermissionError';
	}
}

export class FetchError extends Error {
	statusCode: number;
	constructor(statusCode: number, message?: string) {
		super(message || `Fetch call failed with status code: ${statusCode}`);
		this.name = 'FetchError';
		this.statusCode = statusCode;
	}
}
