import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import { createEvent } from './createEvent';
import type { Duration } from './Duration';

export const uploadFailedEvent = (
	attributes: { reason: string } & Duration,
): AnalyticsEventPayload =>
	createEvent('operational', 'failed', 'emojiUploader', undefined, attributes);
