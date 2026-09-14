import { type MediaClientErrorReason, isCommonMediaClientError } from '@atlaskit/media-client';

import type { MediaCardError } from '../../MediaCardError';

export const getRenderErrorErrorReason = (
	error: MediaCardError,
): MediaClientErrorReason | 'nativeError' => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.reason;
	}
	return 'nativeError';
};
