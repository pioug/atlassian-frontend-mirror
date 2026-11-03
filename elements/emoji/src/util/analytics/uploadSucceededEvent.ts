import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import { createEvent } from './createEvent';
import type { Duration } from './Duration';

export const uploadSucceededEvent = (attributes: Duration): AnalyticsEventPayload =>
	createEvent('operational', 'finished', 'emojiUploader', undefined, attributes);
