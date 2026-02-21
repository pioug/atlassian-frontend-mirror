import { type FileState, type ProcessedFileState } from '@atlaskit/media-client';
import {
	type RenderInlineCardFailedEventPayload,
	type RenderInlineCardSucceededEventPayload,
	extractErrorInfo,
	fireMediaCardEvent,
} from '../utils/analytics';
import { MediaCardError } from '../errors';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type ProcessingFailedState, type ProcessingFailReason } from '@atlaskit/media-state';

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

export const fireSucceededOperationalEvent = (
	fileState: FileState,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
): void => {
	const payload = getSucceededStatusPayload(fileState);

	fireMediaCardEvent(payload, createAnalyticsEvent);
};
