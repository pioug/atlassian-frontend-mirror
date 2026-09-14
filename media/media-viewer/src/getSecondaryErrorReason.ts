import { isCommonMediaClientError } from '@atlaskit/media-client';

import type { SecondaryErrorReason } from './errors';
import type { MediaViewerError } from './MediaViewerError';

export function getSecondaryErrorReason(error: MediaViewerError): SecondaryErrorReason {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.reason;
	} else if (secondaryError) {
		return 'nativeError';
	} else {
		return 'unknown';
	}
}
