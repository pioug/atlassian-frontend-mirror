import { isCommonMediaClientError } from '@atlaskit/media-client';

import type { MediaViewerError } from './MediaViewerError';

export function getErrorDetail(error?: MediaViewerError): string {
	const { secondaryError } = error || {};
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.innerError?.message || 'unknown';
	} else if (secondaryError) {
		return secondaryError.message;
	}
	return 'unknown';
}
