import { createRequestErrorFromResponse } from './createRequestErrorFromResponse';
import { type RequestMetadata } from './types';

export function createProcessFetchResponse(
	metadata: RequestMetadata,
): (response: Response) => Response {
	return (response: Response) => {
		if (response.ok || response.status < 400) {
			return response;
		}

		const requestError = createRequestErrorFromResponse(metadata, response);
		throw requestError;
	};
}
