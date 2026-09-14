import { type FileState } from '@atlaskit/media-client';

import type { MediaCardError } from '../MediaCardError';
import { extractErrorInfo } from '../utils/analytics/extractErrorInfo';
import type { RenderInlineCardFailedEventPayload } from '../utils/analytics/analytics';

export const getErrorStatusPayload = (
	fileId: string,
	error: MediaCardError,
	fileState?: FileState,
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
			...extractErrorInfo(error),
		},
	};
};
