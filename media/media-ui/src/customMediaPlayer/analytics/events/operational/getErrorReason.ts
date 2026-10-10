import { isCommonMediaClientError } from '@atlaskit/media-client';
import type { MediaClientErrorReason } from '@atlaskit/media-client/errors/types';

export const getErrorReason = (error: Error): MediaClientErrorReason | 'nativeError' => {
	if (isCommonMediaClientError(error)) {
		return error.reason;
	}
	return 'nativeError';
};
