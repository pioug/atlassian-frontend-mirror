import type { ErrorFileState } from '@atlaskit/media-state/file-state';

import type { CommonMediaClientError } from './CommonMediaClientError';

/** Serializer CommonMediaClientError -> ErrorFileState */
export const fromCommonMediaClientError = (
	id: string,
	occurrenceKey: string | undefined,
	error: CommonMediaClientError,
): ErrorFileState => {
	return {
		status: 'error',
		id,
		occurrenceKey,
		reason: error.reason,
		details: {
			/** Use this attr to translate back into CommonMediaClientError (toCommonMediaClientError) */
			error: { reason: error?.reason, metadata: error?.metadata, innerError: error?.innerError },
			// Legacy details
			...error?.attributes,
		},
		message: error?.message,
	};
};
