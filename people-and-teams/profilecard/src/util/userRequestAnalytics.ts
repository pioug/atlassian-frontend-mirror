import { USER_SUBJECT } from './analytics';
import type { AnalyticsEventPayload } from './AnalyticsEventPayload';
import { createEvent } from './createEvent';
import type { GenericAttributes } from './GenericAttributes';

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export const userRequestAnalytics = (
	action: 'triggered' | 'succeeded' | 'failed',
	attributes?: { duration: number } & GenericAttributes,
): AnalyticsEventPayload => createEvent('operational', action, USER_SUBJECT, 'request', attributes);
