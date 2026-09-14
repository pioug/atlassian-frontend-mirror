import { type FileState } from '@atlaskit/media-client';
import { type MediaTraceContext } from '@atlaskit/media-common';

import { getFileAttributes } from '../../getFileAttributes';
import type { DownloadSucceededEventPayload } from './download';

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
