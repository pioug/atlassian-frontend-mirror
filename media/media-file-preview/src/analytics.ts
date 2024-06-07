import {
	getMediaClientErrorReason,
	isRequestError,
	type MediaClientErrorReason,
} from '@atlaskit/media-client';
import { type MediaTraceContext, type SuccessAttributes } from '@atlaskit/media-common';

import {
	getFileStateErrorReason,
	ImageLoadError,
	isMediaFilePreviewError,
	isMediaFileStateError,
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
	if (isMediaFilePreviewError(error) && !!error.secondaryError) {
		if (isRequestError(error.secondaryError)) {
			return error.secondaryError.metadata?.traceContext;
		} else if (isMediaFileStateError(error.secondaryError)) {
			return error.secondaryError.details?.metadata?.traceContext;
		}
	}
};

export const getRenderErrorFailReason = (error: MediaFilePreviewError): FailedErrorFailReason => {
	if (isMediaFilePreviewError(error)) {
		return error.primaryReason;
	} else {
		return 'nativeError';
	}
};

export const getRenderErrorErrorReason = (
	error: MediaFilePreviewError,
): MediaClientErrorReason | 'nativeError' => {
	if (isMediaFilePreviewError(error) && error.secondaryError) {
		const mediaClientReason = isMediaFileStateError(error.secondaryError)
			? getFileStateErrorReason(error.secondaryError)
			: getMediaClientErrorReason(error.secondaryError);
		if (mediaClientReason !== 'unknown') {
			return mediaClientReason;
		}
	}
	return 'nativeError';
};

export const getRenderErrorErrorDetail = (error: MediaFilePreviewError): string => {
	if (isMediaFilePreviewError(error) && error.secondaryError) {
		return error.secondaryError.message;
	} else {
		return error.message;
	}
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
