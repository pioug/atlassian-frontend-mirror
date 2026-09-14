import type { ErrorFileState } from '@atlaskit/media-state/file-state';

import { CommonMediaClientError } from './CommonMediaClientError';

/** Deserializer ErrorFileState -> CommonMediaClientError */
export const toCommonMediaClientError = (
	errorFileState: ErrorFileState,
): CommonMediaClientError => {
	const error = errorFileState.details?.error;
	return new CommonMediaClientError(
		error?.reason || 'unknown-reason',
		error?.metadata,
		error?.innerError,
	);
};
