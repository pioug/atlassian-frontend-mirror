import { type RequestErrorReason } from './types';

export function createRequestErrorReason(statusCode: number): RequestErrorReason {
	switch (statusCode) {
		case 400:
			return 'serverBadRequest';
		case 401:
			return 'serverUnauthorized';
		case 403:
			return 'serverForbidden';
		case 404:
			return 'serverNotFound';
		case 422:
			return 'serverUnprocessableEntity';
		case 423:
			return 'serverEntityLocked';
		case 429:
			return 'serverRateLimited';
		case 500:
			return 'serverInternalError';
		case 502:
			return 'serverBadGateway';
		default:
			return 'serverUnexpectedError';
	}
}
