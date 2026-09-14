import { USER_SUBJECT } from './analytics';
import type { AnalyticsEventPayload } from './AnalyticsEventPayload';
import { createEvent } from './createEvent';

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export const reportingLinesClicked = (attributes: {
	userType: 'manager' | 'direct-report';
	duration: number;
}): AnalyticsEventPayload =>
	createEvent('ui', 'clicked', USER_SUBJECT, 'reportingLines', attributes);
