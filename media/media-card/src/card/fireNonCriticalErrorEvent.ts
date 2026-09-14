import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { type FileAttributes, type MediaTraceContext } from '@atlaskit/media-common';

import { MediaCardError } from '../MediaCardError';
import { type CardStatus } from '../types';
import { fireMediaCardEvent } from '../utils/analytics/fireMediaCardEvent';
import { getErrorEventPayload } from '../utils/analytics/getErrorEventPayload';
import type { SSRStatus } from '../utils/analytics/analytics';

export const fireNonCriticalErrorEvent = (
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	cardStatus: CardStatus,
	fileAttributes: FileAttributes,
	ssrReliability: SSRStatus,
	error: MediaCardError | undefined = new MediaCardError('missing-error-data'),
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
