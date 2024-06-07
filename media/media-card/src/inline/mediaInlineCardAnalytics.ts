import { type FileState, type ProcessedFileState } from '@atlaskit/media-client';
import {
	type RenderInlineCardFailedEventPayload,
	type RenderInlineCardSucceededEventPayload,
	extractErrorInfo,
	fireMediaCardEvent,
} from '../utils/analytics';
import { MediaCardError } from '../errors';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

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

export const getErrorStatusPayload = (
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
				fileId: fileState?.id || '',
				fileStatus: fileState?.status,
			},
			...extractErrorInfo(error),
		},
	};
};

export const getFailedProcessingStatusPayload = (
	fileState?: FileState,
): RenderInlineCardFailedEventPayload => {
	return {
		eventType: 'operational',
		action: 'failed',
		actionSubject: 'mediaInlineRender',
		attributes: {
			status: 'fail',
			fileAttributes: {
				fileId: fileState?.id || '',
				fileStatus: fileState?.status,
			},
			failReason: 'failed-processing',
		},
	};
};

export const fireFailedOperationalEvent = (
	fileState: FileState,
	error: MediaCardError = new MediaCardError('missing-error-data'),
	failReason?: 'failed-processing',
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
) => {
	const payload = failReason
		? getFailedProcessingStatusPayload(fileState)
		: getErrorStatusPayload(error, fileState);

	fireMediaCardEvent(payload, createAnalyticsEvent);
};

export const fireSucceededOperationalEvent = (
	fileState: FileState,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
) => {
	const payload = getSucceededStatusPayload(fileState);

	fireMediaCardEvent(payload, createAnalyticsEvent);
};
