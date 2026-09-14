import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { type FileAttributes, type MediaTraceContext } from '@atlaskit/media-common';

import { MediaCardError } from '../MediaCardError';
import { fireMediaCardEvent } from '../utils/analytics/fireMediaCardEvent';
import { getDownloadFailedEventPayload } from '../utils/analytics/getDownloadFailedEventPayload';

export const fireDownloadFailedEvent = (
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	fileAttributes: FileAttributes,
	error: MediaCardError | undefined = new MediaCardError('missing-error-data'),
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
