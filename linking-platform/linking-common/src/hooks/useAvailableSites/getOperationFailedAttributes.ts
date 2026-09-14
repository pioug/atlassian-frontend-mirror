import { getNetworkFields } from './getNetworkFields';

export const getOperationFailedAttributes: any = (
	err: unknown,
):
	| {
			error: string;
			errorType: string;
			path: string;
			status: number;
			traceId: string | null;
	  }
	| {
			error: string;
			errorType: string;
			path: null;
			status: null;
			traceId: null;
	  } => {
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
