import { getTraceId } from '../../utils/get-trace-id';

const getUrlPath = (url: string) => {
	try {
		return new URL(url).pathname;
	} catch {
		return 'Failed to parse pathname from url';
	}
};

export const getNetworkFields: any = (
	error: unknown,
):
	| {
			path: string;
			status: number;
			traceId: string | null;
	  }
	| {
			path: null;
			status: null;
			traceId: null;
	  } => {
	if (error instanceof Response) {
		return {
			traceId: getTraceId(error),
			status: error.status,
			path: getUrlPath(error.url),
		};
	}

	return { traceId: null, status: null, path: null };
};
