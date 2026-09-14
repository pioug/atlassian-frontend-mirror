import { isCommonMediaClientError, type RequestMetadata } from '@atlaskit/media-client';

export const getErrorRequestMetaData = (error: Error): RequestMetadata | undefined => {
	if (isCommonMediaClientError(error)) {
		return error.metadata;
	}
};
