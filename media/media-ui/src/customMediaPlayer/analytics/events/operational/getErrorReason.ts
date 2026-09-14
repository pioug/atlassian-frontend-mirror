import { type MediaClientErrorReason, isCommonMediaClientError } from '@atlaskit/media-client';

export const getErrorReason = (error: Error): MediaClientErrorReason | 'nativeError' => {
	if (isCommonMediaClientError(error)) {
		return error.reason;
	}
	return 'nativeError';
};
