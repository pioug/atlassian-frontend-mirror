import type { HttpError } from './HttpError';
import { StatusCode } from './index';
import { isErrorStatusCode } from './isErrorStatusCode';

export function isAuthError(error?: Error | HttpError): boolean {
	return (
		isErrorStatusCode(StatusCode.UNAUTHORIZED, error) ||
		isErrorStatusCode(StatusCode.FORBIDDEN, error)
	);
}
