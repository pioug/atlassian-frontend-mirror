import type { HttpError } from './HttpError';

export function isErrorStatusCode(statusCode: number, error?: Error | HttpError): boolean {
	if (!error) {
		return false;
	}

	if (
		(error as any)['status'] === statusCode ||
		// error can be `ProperNetworkError` from `packages/graphql-client/src/links/error.ts`
		(error as any)['statusCode'] === statusCode
	) {
		return true;
	}

	const reg = new RegExp(`status (code)?.*(${statusCode})`);
	return !!error?.message?.match(reg);
}
