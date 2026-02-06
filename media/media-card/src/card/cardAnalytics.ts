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
	type SSRStatus,
	getErrorEventPayload,
	getDownloadSucceededEventPayload,
	getDownloadFailedEventPayload,
} from '../utils/analytics';
import { type CardStatus } from '../types';
import { MediaCardError } from '../errors';
import { type ProcessingFailReason } from '@atlaskit/media-state';
import { fg } from '@atlaskit/platform-feature-flags';

// Sampling rate for mediaCardRender success events (10%)
const MEDIA_CARD_RENDER_SUCCESS_SAMPLE_RATE = 0.1;

export const fireOperationalEvent = (
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	status: CardStatus,
	fileAttributes: FileAttributes,
	performanceAttributes: PerformanceAttributes,
	ssrReliability: SSRStatus,
	error: MediaCardError = new MediaCardError('missing-error-data'),
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
	processingFailReason?: ProcessingFailReason,
): void => {
	const fireEvent = (payload: MediaCardAnalyticsEventPayload) =>
		fireMediaCardEvent(payload, createAnalyticsEvent);

	switch (status) {
		case 'complete':
			// Sample success events at 10% when feature flag is enabled - failures are never sampled
			// If flag is disabled, all success events fire (no sampling)
			const isSamplingEnabled = fg('enable_sampling_mediacardrender_succeeded');
			if (!isSamplingEnabled || Math.random() < MEDIA_CARD_RENDER_SUCCESS_SAMPLE_RATE) {
				fireEvent(
					getRenderSucceededEventPayload(
						fileAttributes,
						performanceAttributes,
						ssrReliability,
						traceContext,
						metadataTraceContext,
						isSamplingEnabled ? MEDIA_CARD_RENDER_SUCCESS_SAMPLE_RATE : undefined,
					),
				);
			}
			break;
		case 'failed-processing':
			// Always emit failed events (no sampling)
			fireEvent(
				getRenderFailedFileStatusPayload(
					fileAttributes,
					performanceAttributes,
					ssrReliability,
					traceContext,
					metadataTraceContext,
					processingFailReason,
				),
			);
			break;
		case 'error':
			// Always emit error events (no sampling)
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

export const fireNonCriticalErrorEvent = (
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	cardStatus: CardStatus,
	fileAttributes: FileAttributes,
	ssrReliability: SSRStatus,
	error: MediaCardError = new MediaCardError('missing-error-data'),
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
): void => {
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
): void => {
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
): void => {
	const payload = getDownloadFailedEventPayload(
		fileAttributes,
		error,
		traceContext,
		metadataTraceContext,
	);

	fireMediaCardEvent(payload, createAnalyticsEvent);
};
