import { AGENT_SUBJECT } from './analytics';
import type { AnalyticsEventPayload } from './AnalyticsEventPayload';
import { createEvent } from './createEvent';
import type { GenericAttributes } from './GenericAttributes';

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export const agentRequestAnalytics = (
	action: 'triggered' | 'succeeded' | 'failed',
	actionSubjectId?: string,
	attributes?: { duration: number } & GenericAttributes,
): AnalyticsEventPayload =>
	createEvent('operational', action, AGENT_SUBJECT, actionSubjectId || 'request', attributes);
