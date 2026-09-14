import { type FileAttributes, type MediaTraceContext } from '@atlaskit/media-common/analytics';

import type { DownloadSucceededEventPayload } from './analytics';

export const getDownloadSucceededEventPayload = (
	fileAttributes: FileAttributes,
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
): DownloadSucceededEventPayload => ({
	eventType: 'operational',
	action: 'succeeded',
	actionSubject: 'mediaCardDownload',
	attributes: {
		fileMimetype: fileAttributes.fileMimetype,
		fileAttributes,
		status: 'success',
		traceContext,
		metadataTraceContext,
	},
});
