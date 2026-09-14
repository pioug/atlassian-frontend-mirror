import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import type { ErrorResponse, SuccessResponse } from './responses';

export const isErrorResponse = (
	response: SuccessResponse | ErrorResponse | JsonLd.Collection,
): response is ErrorResponse => {
	if (!response) {
		return false;
	}

	const hasStatus = 'status' in response && response.status >= 200;
	const hasErrorBody = 'error' in response;
	return hasStatus && hasErrorBody;
};
