import { isCommonMediaClientError } from '@atlaskit/media-client';

import type { MediaCardError } from '../../MediaCardError';

export const getRenderErrorErrorDetail = (error: MediaCardError): string => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError) && secondaryError.innerError?.message) {
		return secondaryError.innerError?.message;
	}
	if (secondaryError instanceof Error) {
		return secondaryError.message;
	}
	return error.message;
};
