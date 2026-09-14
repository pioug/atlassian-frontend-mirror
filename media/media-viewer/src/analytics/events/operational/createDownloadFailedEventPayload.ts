import { type FileState } from '@atlaskit/media-client';
import { type MediaTraceContext } from '@atlaskit/media-common';

import type { MediaViewerError } from '../../../MediaViewerError';
import { getErrorDetail } from '../../../getErrorDetail';
import { getPrimaryErrorReason } from '../../../getPrimaryErrorReason';
import { getRequestMetadata } from '../../../getRequestMetadata';
import { getSecondaryErrorReason } from '../../../getSecondaryErrorReason';
import { getFileAttributes } from '../../getFileAttributes';
import type { DownloadFailedEventPayload } from './download';

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
