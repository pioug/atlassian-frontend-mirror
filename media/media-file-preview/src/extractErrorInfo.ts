import { type MediaTraceContext } from '@atlaskit/media-common';

import type { MediaFilePreviewError } from './MediaFilePreviewError';
import type { MediaFilePreviewErrorInfo } from './analytics';
import { getErrorTraceContext } from './getErrorTraceContext';
import { getRenderErrorErrorDetail } from './getRenderErrorErrorDetail';
import { getRenderErrorErrorReason } from './getRenderErrorErrorReason';
import { getRenderErrorFailReason } from './getRenderErrorFailReason';

export const extractErrorInfo = (
	error: MediaFilePreviewError,
	metadataTraceContext?: MediaTraceContext,
): MediaFilePreviewErrorInfo => {
	return {
		failReason: getRenderErrorFailReason(error),
		error: getRenderErrorErrorReason(error),
		errorDetail: getRenderErrorErrorDetail(error),
		metadataTraceContext: metadataTraceContext ?? getErrorTraceContext(error),
	};
};
