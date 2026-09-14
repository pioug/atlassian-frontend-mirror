import { isCommonMediaClientError } from '@atlaskit/media-client';

export const getErrorDetail = (error: Error): string => {
	if (isCommonMediaClientError(error) && error.innerError?.message) {
		return error.innerError?.message;
	}
	return error.message || 'unknown';
};
