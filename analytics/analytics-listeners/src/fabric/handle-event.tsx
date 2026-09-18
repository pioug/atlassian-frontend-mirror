import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { sendEvent } from '../analytics-web-client-wrapper';
import type Logger from '../helpers/logger';
import { type AnalyticsWebClient } from '../types';
import { processEventPayload } from './process-event-payload';

export const handleEvent = (
	event: UIAnalyticsEvent,
	// If passing through multiple tags, the primary tag should be first in the array.
	// The primary tag is used for matching context.
	tags: string | string[],
	logger: Logger,
	client?: AnalyticsWebClient | Promise<AnalyticsWebClient>,
): void => {
	if (!event.payload) {
		return;
	}
	const payload = processEventPayload(event, tags);
	sendEvent(logger, client)(payload);
};
