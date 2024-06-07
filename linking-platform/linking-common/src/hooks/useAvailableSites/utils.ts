import { getTraceId } from '../../utils/get-trace-id';

const getUrlPath = (url: string) => {
	try {
		return new URL(url).pathname;
	} catch {
		return 'Failed to parse pathname from url';
	}
};

export const getNetworkFields = (error: unknown) => {
	if (error instanceof Response) {
		return {
			traceId: getTraceId(error),
			status: error.status,
			path: getUrlPath(error.url),
		};
	}

	return { traceId: null, status: null, path: null };
};

export const getErrorType = (error: unknown) => {
	if (error instanceof Response) {
		return 'NetworkError';
	}
	if (error instanceof Error) {
		return error.name;
	}
	return typeof error;
};

export const getOperationFailedAttributes = (err: unknown) => {
	if (err instanceof Response) {
		return {
			error: 'NetworkError',
			errorType: 'NetworkError',
			...getNetworkFields(err),
		};
	}

	const error = err instanceof Error ? err : new Error('unknown error');

	return {
		error: error.name,
		errorType: error.name,
		traceId: null,
		status: null,
		path: null,
	};
};
