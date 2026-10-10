import { isRequestError } from '@atlaskit/media-client';
import type { RequestErrorMetadata } from '@atlaskit/media-client/request/types';

export function getRequestMetadata(error?: Error): RequestErrorMetadata | undefined {
	if (error && isRequestError(error)) {
		return error.metadata;
	}
}
