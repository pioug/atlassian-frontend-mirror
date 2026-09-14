import { type FileState, type ProcessedFileState } from '@atlaskit/media-client';

import { type RenderInlineCardSucceededEventPayload } from '../utils/analytics';

export const getSucceededStatusPayload = (
	fileState?: FileState,
): RenderInlineCardSucceededEventPayload => {
	return {
		eventType: 'operational',
		action: 'succeeded',
		actionSubject: 'mediaInlineRender',
		attributes: {
			status: 'success',
			fileAttributes: {
				fileId: fileState?.id || '',
				fileSize: (fileState as ProcessedFileState)?.size,
				fileMediatype: (fileState as ProcessedFileState)?.mediaType,
				fileMimetype: (fileState as ProcessedFileState)?.mimeType,
				fileStatus: fileState?.status,
			},
		},
	};
};
