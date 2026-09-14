import { isCommonMediaClientError } from '@atlaskit/media-client';
import { type MediaTraceContext } from '@atlaskit/media-common/analytics';

import type { MediaCardError } from '../../MediaCardError';

export const getErrorTraceContext = (error: MediaCardError): MediaTraceContext | undefined => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.metadata?.traceContext;
	}
};
