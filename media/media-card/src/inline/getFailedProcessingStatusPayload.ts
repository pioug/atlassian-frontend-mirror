import { type FileState } from '@atlaskit/media-client';
import type { ProcessingFailReason } from '@atlaskit/media-state/file-state';

import { type RenderInlineCardFailedEventPayload } from '../utils/analytics';

export const getFailedProcessingStatusPayload = (
	fileId: string,
	fileState?: FileState,
	processingFailReason?: ProcessingFailReason,
): RenderInlineCardFailedEventPayload => {
	return {
		eventType: 'operational',
		action: 'failed',
		actionSubject: 'mediaInlineRender',
		attributes: {
			status: 'fail',
			fileAttributes: {
				fileId,
				fileStatus: fileState?.status,
			},
			failReason: 'failed-processing',
			// 'not-available' is used for cases before processingFailReason implementation (backward compatibility)
			processingFailReason: processingFailReason || 'not-available',
		},
	};
};
