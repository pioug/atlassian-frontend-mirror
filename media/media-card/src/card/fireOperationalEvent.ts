import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import {
	type FileAttributes,
	type MediaTraceContext,
	type PerformanceAttributes,
} from '@atlaskit/media-common';
import type { ProcessingFailReason } from '@atlaskit/media-state/file-state';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { MediaCardError } from '../MediaCardError';
import { type CardStatus } from '../types';
import type { MediaCardAnalyticsEventPayload, SSRStatus } from '../utils/analytics/analytics';
import { fireMediaCardEvent } from '../utils/analytics/fireMediaCardEvent';
import { getRenderErrorEventPayload } from '../utils/analytics/getRenderErrorEventPayload';
import { getRenderFailedFileStatusPayload } from '../utils/analytics/getRenderFailedFileStatusPayload';
import { getRenderSucceededEventPayload } from '../utils/analytics/getRenderSucceededEventPayload';

// Sampling rate for mediaCardRender success events (10%)
const MEDIA_CARD_RENDER_SUCCESS_SAMPLE_RATE: number = 0.1;

export const fireOperationalEvent = (
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	status: CardStatus,
	fileAttributes: FileAttributes,
	performanceAttributes: PerformanceAttributes,
	ssrReliability: SSRStatus,
	error: MediaCardError | undefined = new MediaCardError('missing-error-data'),
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
