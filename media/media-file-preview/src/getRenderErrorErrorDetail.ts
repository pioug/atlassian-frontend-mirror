import { isCommonMediaClientError } from '@atlaskit/media-client';

import type { MediaFilePreviewError } from './MediaFilePreviewError';

export const getRenderErrorErrorDetail = (error: MediaFilePreviewError): string => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.message;
	}
	return error.message;
};
