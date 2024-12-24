import {
	type FileAttributes,
	type MediaTraceContext,
	type PerformanceAttributes,
} from '@atlaskit/media-common';
import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
	fireMediaCardEvent,
	getRenderSucceededEventPayload,
	getRenderErrorEventPayload,
	getRenderFailedFileStatusPayload,
	type MediaCardAnalyticsEventPayload,
	getRenderPreviewableCardPayload,
	type SSRStatus,
	getErrorEventPayload,
	getDownloadSucceededEventPayload,
	getDownloadFailedEventPayload,
} from '../utils/analytics';
import { type CardStatus } from '../types';
import { MediaCardError } from '../errors';

export const fireOperationalEvent = (
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	status: CardStatus,
	fileAttributes: FileAttributes,
	performanceAttributes: PerformanceAttributes,
	ssrReliability: SSRStatus,
	error: MediaCardError = new MediaCardError('missing-error-data'),
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
) => {
	const fireEvent = (payload: MediaCardAnalyticsEventPayload) =>
		fireMediaCardEvent(payload, createAnalyticsEvent);

	switch (status) {
		case 'complete':
			fireEvent(
				getRenderSucceededEventPayload(
					fileAttributes,
					performanceAttributes,
					ssrReliability,
					traceContext,
					metadataTraceContext,
				),
			);
			break;
		case 'failed-processing':
			fireEvent(
				getRenderFailedFileStatusPayload(
					fileAttributes,
					performanceAttributes,
					ssrReliability,
					traceContext,
					metadataTraceContext,
				),
			);
			break;
		case 'error':
			fireEvent(
				getRenderErrorEventPayload(
					fileAttributes,
					performanceAttributes,
					error,
					ssrReliability,
					traceContext,
					metadataTraceContext,
				),
			);
			break;
	}
};

export const fireScreenEvent = (
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	fileAttributes: FileAttributes,
) => {
	fireMediaCardEvent(getRenderPreviewableCardPayload(fileAttributes), createAnalyticsEvent);
};

export const fireNonCriticalErrorEvent = (
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	cardStatus: CardStatus,
	fileAttributes: FileAttributes,
	ssrReliability: SSRStatus,
	error: MediaCardError = new MediaCardError('missing-error-data'),
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
) => {
	const errorPayload = getErrorEventPayload(
		cardStatus,
		fileAttributes,
		error,
		ssrReliability,
		traceContext,
		metadataTraceContext,
	);

	fireMediaCardEvent(errorPayload, createAnalyticsEvent);
};

export const fireDownloadSucceededEvent = (
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	fileAttributes: FileAttributes,
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
) => {
	const payload = getDownloadSucceededEventPayload(
		fileAttributes,
		traceContext,
		metadataTraceContext,
	);

	fireMediaCardEvent(payload, createAnalyticsEvent);
};

export const fireDownloadFailedEvent = (
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	fileAttributes: FileAttributes,
	error: MediaCardError = new MediaCardError('missing-error-data'),
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
) => {
	const payload = getDownloadFailedEventPayload(
		fileAttributes,
		error,
		traceContext,
		metadataTraceContext,
	);

	fireMediaCardEvent(payload, createAnalyticsEvent);
};
