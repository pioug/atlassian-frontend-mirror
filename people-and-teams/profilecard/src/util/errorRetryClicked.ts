import { TEAM_SUBJECT } from './analytics';
import type { AnalyticsEventPayload } from './AnalyticsEventPayload';
import { createEvent } from './createEvent';

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export const errorRetryClicked = (attributes: { duration: number }): AnalyticsEventPayload =>
	createEvent('ui', 'clicked', TEAM_SUBJECT, 'errorRetry', attributes);
