import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import createAndFireEvent from '@atlaskit/analytics-next/createAndFireEvents';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common';

import type { CustomMediaPlayerAnalyticsEventPayload } from './analytics';

// can be used inside withAnalyticsEvents() hook
export const createAndFireMediaCustomMediaPlayerEvent = (
	payload: CustomMediaPlayerAnalyticsEventPayload,
): ((createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent) => {
	return createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(payload);
};
