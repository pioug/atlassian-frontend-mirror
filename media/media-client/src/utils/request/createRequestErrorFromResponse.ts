import { createRequestErrorReason } from './createRequestErrorReason';
import { extractMediaHeaders } from './extractMediaHeaders';
import { RequestError } from './RequestError';
import { type RequestErrorMetadata } from './types';

export function createRequestErrorFromResponse(
	metadata: RequestErrorMetadata,
	response: Response,
): RequestError {
	const { status: statusCode } = response;
	const reason = createRequestErrorReason(statusCode);
	return new RequestError(reason, {
		...metadata,
		...extractMediaHeaders(response),
		statusCode,
	});
}
