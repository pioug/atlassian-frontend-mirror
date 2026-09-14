import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import { checkValidId } from './checkValidId';
import { createEvent } from './createEvent';

export const userInfoEvent = (sources: string[], accountId: string): AnalyticsEventPayload =>
	createEvent('ui', 'displayed', 'userInfo', {
		sources,
		// accountId can be PII if it is an email so check that it's an AAID first
		accountId: checkValidId(accountId) ? accountId : null,
	});
