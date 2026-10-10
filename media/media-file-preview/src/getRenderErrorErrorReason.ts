import { isCommonMediaClientError } from '@atlaskit/media-client';
import type { MediaClientErrorReason } from '@atlaskit/media-client/errors/types';

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
