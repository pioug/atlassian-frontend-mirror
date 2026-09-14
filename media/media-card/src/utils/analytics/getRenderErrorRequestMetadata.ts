import { type RequestErrorMetadata, isCommonMediaClientError } from '@atlaskit/media-client';

import type { MediaCardError } from '../../MediaCardError';

export const getRenderErrorRequestMetadata = (
	error: MediaCardError,
): RequestErrorMetadata | undefined => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.metadata;
	}
};
