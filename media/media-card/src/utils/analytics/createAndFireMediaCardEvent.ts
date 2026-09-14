import createAndFireEvent from '@atlaskit/analytics-next/createAndFireEvents';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import {
	ANALYTICS_MEDIA_CHANNEL,
	sanitiseAnalyticsPayload,
} from '@atlaskit/media-common/analytics';

import type { MediaCardAnalyticsEventPayload } from './analytics';

export const createAndFireMediaCardEvent = (
	payload: MediaCardAnalyticsEventPayload,
): ((createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent) => {
	return createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(sanitiseAnalyticsPayload(payload));
};
