import { type RequestErrorMetadata, isCommonMediaClientError } from '@atlaskit/media-client';

import type { MediaViewerError } from './MediaViewerError';

export function getRequestMetadata(error?: MediaViewerError): RequestErrorMetadata | undefined {
	const { secondaryError } = error || {};
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.metadata;
	}
}
