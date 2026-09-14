import { getStatusCode } from './getStatusCode';
import { isFetchNetworkError } from './isFetchNetworkError';

export const defaultShouldRetryError = (err: any): boolean => {
	const statusCode = getStatusCode(err);
	return isFetchNetworkError(err) || (statusCode ? statusCode >= 500 : false);
};
