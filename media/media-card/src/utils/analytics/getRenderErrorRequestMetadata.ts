import { isCommonMediaClientError } from '@atlaskit/media-client';
import type { RequestErrorMetadata } from '@atlaskit/media-client/request/types';

import type { MediaCardError } from '../../MediaCardError';

export const getRenderErrorRequestMetadata = (
	error: MediaCardError,
): RequestErrorMetadata | undefined => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.metadata;
	}
};
