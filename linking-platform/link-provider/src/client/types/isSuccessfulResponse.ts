import type { ErrorResponse, SuccessResponse } from './responses';

export const isSuccessfulResponse = (
	response?: SuccessResponse | ErrorResponse,
): response is SuccessResponse => {
	if (!response) {
		return false;
	}

	const hasSuccessfulStatus = response.status === 200;
	const hasSuccessBody = 'body' in response;
	return hasSuccessfulStatus && hasSuccessBody;
};
