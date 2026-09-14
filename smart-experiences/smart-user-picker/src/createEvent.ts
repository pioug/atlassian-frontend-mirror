import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import { packageName } from './packageName';
import { packageVersion } from './packageVersion';

export const createEvent = (
	eventType: 'ui' | 'operational',
	action: string,
	actionSubject: string,
	attributes = {},
): AnalyticsEventPayload => ({
	eventType,
	action,
	actionSubject,
	attributes: {
		packageName,
		packageVersion,
		...attributes,
	},
});
