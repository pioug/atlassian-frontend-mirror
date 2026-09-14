import { HttpError } from '../error/HttpError';

export const createErrorMetadata = (
	error: Error | HttpError,
): {
	error: {
		name: string;
		message: string;
		stack: string | undefined;
		traceId: string | undefined;
		status: number | undefined;
	};
} => ({
	error: {
		name: error.name,
		message: error.message,
		stack: error.stack,
		traceId: error instanceof HttpError ? error.traceId : undefined,
		status: error instanceof HttpError ? error.status : undefined,
	},
});
