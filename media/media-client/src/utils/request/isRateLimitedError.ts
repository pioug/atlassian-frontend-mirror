import { getStatusCode } from './getStatusCode';

export function isRateLimitedError(error: Error | undefined): boolean {
	const statusCode = error && getStatusCode(error);
	return statusCode === 429 || (!!error && !!error.message && error.message.includes('429'));
}
