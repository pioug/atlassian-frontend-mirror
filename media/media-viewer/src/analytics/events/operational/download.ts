import { type FileState } from '@atlaskit/media-client';
import { type MediaFileEventPayload } from './_mediaFile';
import { getFileAttributes, type MediaViewerFailureAttributes } from '../..';
import {
	getPrimaryErrorReason,
	getSecondaryErrorReason,
	getErrorDetail,
	getRequestMetadata,
	type MediaViewerError,
} from '../../../errors';
import {
	type MediaTraceContext,
	type SuccessAttributes,
	type WithFileAttributes,
	type WithTraceContext,
} from '@atlaskit/media-common';

export type DownloadFailedEventPayload = MediaFileEventPayload<
	MediaViewerFailureAttributes,
	'downloadFailed'
>;

export type DownloadSucceededEventPayload = MediaFileEventPayload<
	SuccessAttributes & WithFileAttributes & WithTraceContext,
	'downloadSucceeded'
>;

export const createDownloadSucceededEventPayload = (
	fileState?: FileState,
	traceContext?: MediaTraceContext,
): DownloadSucceededEventPayload => {
	const { fileId, fileMediatype, fileMimetype, fileSize } = getFileAttributes(fileState);
	return {
		eventType: 'operational',
		actionSubject: 'mediaFile',
		action: 'downloadSucceeded',
		attributes: {
			status: 'success',
			fileMediatype,
			fileMimetype,
			fileAttributes: {
				fileId,
				fileMediatype,
				fileMimetype,
				fileSize,
			},
			traceContext,
		},
	};
};

export const createDownloadFailedEventPayload = (
	fileId: string,
	error: MediaViewerError,
	fileState?: FileState,
	traceContext?: MediaTraceContext,
): DownloadFailedEventPayload => {
	const { fileMediatype, fileMimetype, fileSize } = getFileAttributes(fileState);
	const requestMetadata = getRequestMetadata(error);
	return {
		eventType: 'operational',
		actionSubject: 'mediaFile',
		action: 'downloadFailed',
		attributes: {
			status: 'fail',
			failReason: getPrimaryErrorReason(error),
			error: getSecondaryErrorReason(error),
			errorDetail: getErrorDetail(error),
			statusCode: requestMetadata?.statusCode,
			request: requestMetadata,
			fileMimetype,
			fileMediatype,
			fileAttributes: {
				fileId,
				fileMediatype,
				fileMimetype,
				fileSize,
			},
			traceContext,
		},
	};
};
