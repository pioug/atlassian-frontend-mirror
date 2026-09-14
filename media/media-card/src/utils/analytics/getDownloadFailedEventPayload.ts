import { type FileAttributes, type MediaTraceContext } from '@atlaskit/media-common/analytics';

import type { MediaCardError } from '../../MediaCardError';
import type { DownloadFailedEventPayload } from './analytics';
import { extractErrorInfo } from './extractErrorInfo';
import { getRenderErrorRequestMetadata } from './getRenderErrorRequestMetadata';

export const getDownloadFailedEventPayload = (
	fileAttributes: FileAttributes,
	error: MediaCardError,
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
): DownloadFailedEventPayload => {
	const requestMetadata = getRenderErrorRequestMetadata(error);
	return {
		eventType: 'operational',
		action: 'failed',
		actionSubject: 'mediaCardDownload',
		attributes: {
			fileMimetype: fileAttributes.fileMimetype,
			fileAttributes,
			status: 'fail',
			...extractErrorInfo(error, metadataTraceContext),
			statusCode: requestMetadata?.statusCode,
			request: requestMetadata,
			traceContext,
		},
	};
};
