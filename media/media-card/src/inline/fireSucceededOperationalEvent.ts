import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { type FileState } from '@atlaskit/media-client';

import { fireMediaCardEvent } from '../utils/analytics/fireMediaCardEvent';
import { getSucceededStatusPayload } from './getSucceededStatusPayload';

export const fireSucceededOperationalEvent = (
	fileState: FileState,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
): void => {
	const payload = getSucceededStatusPayload(fileState);

	fireMediaCardEvent(payload, createAnalyticsEvent);
};
