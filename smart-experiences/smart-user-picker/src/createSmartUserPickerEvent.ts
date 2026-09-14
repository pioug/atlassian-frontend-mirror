import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import { createEvent } from './createEvent';

export const createSmartUserPickerEvent = (
	action: string,
	actionSubect: string,
	attributes = {},
): AnalyticsEventPayload => ({
	source: 'smart-user-picker',
	...createEvent('operational', action, actionSubect, attributes),
});
