import { isCommonMediaClientError } from '@atlaskit/media-client';
import type { RequestMetadata } from '@atlaskit/media-client/request/types';

export const getErrorRequestMetaData = (error: Error): RequestMetadata | undefined => {
	if (isCommonMediaClientError(error)) {
		return error.metadata;
	}
};
