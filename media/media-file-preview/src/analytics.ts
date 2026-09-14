import { type MediaClientErrorReason } from '@atlaskit/media-client';
import { type MediaTraceContext, type SuccessAttributes } from '@atlaskit/media-common';

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
