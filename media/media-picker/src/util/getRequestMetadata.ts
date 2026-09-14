import { isRequestError, type RequestErrorMetadata } from '@atlaskit/media-client';

export function getRequestMetadata(error?: Error): RequestErrorMetadata | undefined {
	if (error && isRequestError(error)) {
		return error.metadata;
	}
}
