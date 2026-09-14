import { isCommonMediaClientError, type MediaClientErrorReason } from '@atlaskit/media-client';

import type { MediaFilePreviewError } from './MediaFilePreviewError';

export const getRenderErrorErrorReason = (
	error: MediaFilePreviewError,
): MediaClientErrorReason | 'nativeError' => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.reason;
	}
	return 'nativeError';
};
