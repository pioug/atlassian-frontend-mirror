import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { type FileState } from '@atlaskit/media-client';
import type { ProcessingFailedState } from '@atlaskit/media-state/file-state';

import { MediaCardError } from '../MediaCardError';
import { fireMediaCardEvent } from '../utils/analytics/fireMediaCardEvent';
import { getErrorStatusPayload } from './getErrorStatusPayload';
import { getFailedProcessingStatusPayload } from './getFailedProcessingStatusPayload';

export const fireFailedOperationalEvent = (
	fileState: FileState,
	error: MediaCardError = new MediaCardError('missing-error-data'),
	failReason?: 'failed-processing',
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
): void => {
	// Extract processingFailReason from fileState if available
	const processingFailReason =
		fileState?.status === 'failed-processing'
			? (fileState as ProcessingFailedState).failReason
			: undefined;

	const payload = failReason
		? getFailedProcessingStatusPayload(
				fileState?.id || 'unknown-id',
				fileState,
				processingFailReason,
			)
		: getErrorStatusPayload(fileState?.id || 'unknown-id', error, fileState);

	fireMediaCardEvent(payload, createAnalyticsEvent);
};
