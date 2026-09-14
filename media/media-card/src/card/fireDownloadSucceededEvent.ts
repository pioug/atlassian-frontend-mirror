import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { type FileAttributes, type MediaTraceContext } from '@atlaskit/media-common';

import { fireMediaCardEvent } from '../utils/analytics/fireMediaCardEvent';
import { getDownloadSucceededEventPayload } from '../utils/analytics/getDownloadSucceededEventPayload';

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
