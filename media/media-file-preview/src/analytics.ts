import type { MediaClientErrorReason } from '@atlaskit/media-client/errors/types';
import type { MediaTraceContext, SuccessAttributes } from '@atlaskit/media-common/analytics/types';

import type { MediaFilePreviewErrorPrimaryReason } from './MediaFilePreviewError';

export type FailedErrorFailReason = MediaFilePreviewErrorPrimaryReason | 'nativeError';

export type MediaFilePreviewErrorInfo = {
	failReason: FailedErrorFailReason;
	error: MediaClientErrorReason | 'nativeError';
	errorDetail: string;
	metadataTraceContext?: MediaTraceContext;
};

export type SSRStatusFail = MediaFilePreviewErrorInfo & {
	status: 'fail';
};

type SSRStatusSuccess = SuccessAttributes;

type SSRStatusUnknown = { status: 'unknown' };

type SSRStatusAttributes = SSRStatusSuccess | SSRStatusFail | SSRStatusUnknown;

export type SSRStatus = {
	server: SSRStatusAttributes;
	client: SSRStatusAttributes;
};
