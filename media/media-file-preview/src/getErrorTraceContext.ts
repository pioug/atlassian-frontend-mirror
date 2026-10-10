import { isCommonMediaClientError } from '@atlaskit/media-client';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';

import type { MediaFilePreviewError } from './MediaFilePreviewError';

export const getErrorTraceContext = (
	error: MediaFilePreviewError,
): MediaTraceContext | undefined => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.metadata?.traceContext;
	}
};
