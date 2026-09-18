import { type FileState } from '@atlaskit/media-client';

import type { MediaCardError } from '../MediaCardError';
import type { RenderInlineCardFailedEventPayload } from '../utils/analytics/analytics';
import { extractErrorInfo } from '../utils/analytics/extractErrorInfo';

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
