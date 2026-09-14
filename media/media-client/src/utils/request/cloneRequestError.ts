import { RequestError } from './RequestError';
import { type RequestErrorMetadata } from './types';

export function cloneRequestError(
	error: RequestError,
	extraMetadata: Partial<RequestErrorMetadata>,
): RequestError {
	const { reason, metadata, innerError } = error;

	return new RequestError(
		reason,
		{
			...metadata,
			...extraMetadata,
		},
		innerError,
	);
}
