import type { HttpError } from './HttpError';
import { isErrorStatusCode } from './isErrorStatusCode';

import { StatusCode } from './index';

export function isAuthError(error?: Error | HttpError): boolean {
	return (
		isErrorStatusCode(StatusCode.UNAUTHORIZED, error) ||
		isErrorStatusCode(StatusCode.FORBIDDEN, error)
	);
}
