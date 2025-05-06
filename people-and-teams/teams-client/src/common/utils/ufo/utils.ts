import { HttpError } from '../error';

export const createErrorMetadata = (error: Error | HttpError) => ({
	error: {
		name: error.name,
		message: error.message,
		stack: error.stack,
		traceId: error instanceof HttpError ? error.traceId : undefined,
		status: error instanceof HttpError ? error.status : undefined,
	},
});

const ignoredErrors = ['SLOIgnoreError', 'SLOIgnoreHttpError'];

export const isIgnoredError = (error: Error): boolean => {
	const errorName = error?.constructor.name;
	if (!errorName) {
		return false;
	}

	return ignoredErrors.includes(errorName);
};
