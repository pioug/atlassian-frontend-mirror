import { type ProfileType } from '../types';
import type { AnalyticsEventPayload } from './AnalyticsEventPayload';
import { createEvent } from './createEvent';
import { getActionSubject } from './getActionSubject';

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export const profileCardRendered = (
	type: ProfileType,
	actionSubjectId: 'spinner' | 'content' | 'error' | 'errorBoundary',
	attributes?: {
		duration?: number;
		errorType?: 'default' | 'NotFound';
		hasRetry?: boolean;
		numActions?: number;
		memberCount?: number;
		includingYou?: boolean;
		descriptionLength?: number;
		titleLength?: number;
	},
): AnalyticsEventPayload =>
	createEvent('ui', 'rendered', getActionSubject(type), actionSubjectId, attributes);
