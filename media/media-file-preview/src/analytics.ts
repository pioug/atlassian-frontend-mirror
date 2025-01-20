import { isCommonMediaClientError, type MediaClientErrorReason } from '@atlaskit/media-client';
import { type MediaTraceContext, type SuccessAttributes } from '@atlaskit/media-common';

import {
	ImageLoadError,
	type MediaFilePreviewError,
	type MediaFilePreviewErrorPrimaryReason,
} from './errors';
import { type MediaFilePreview } from './types';

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

export const getErrorTraceContext = (
	error: MediaFilePreviewError,
): MediaTraceContext | undefined => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.metadata?.traceContext;
	}
};

export const getRenderErrorFailReason = (error: MediaFilePreviewError): FailedErrorFailReason => {
	return error.primaryReason || 'nativeError';
};

export const getRenderErrorErrorReason = (
	error: MediaFilePreviewError,
): MediaClientErrorReason | 'nativeError' => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.reason;
	}
	return 'nativeError';
};

export const getRenderErrorErrorDetail = (error: MediaFilePreviewError): string => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.message;
	}
	return error.message;
};

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

export const createFailedSSRObject = (
	preview: MediaFilePreview,
	metadataTraceContext?: MediaTraceContext,
): SSRStatusFail => ({
	status: 'fail',
	...extractErrorInfo(new ImageLoadError(preview.source), metadataTraceContext),
});
