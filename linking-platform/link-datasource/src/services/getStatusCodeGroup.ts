import { FetchError } from './FetchError';

export const getStatusCodeGroup = (error: Error): 'unknown' | '1xx' | '3xx' | '4xx' | '5xx' => {
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
