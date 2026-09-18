import { type ProfileType } from '../types';
import type { AnalyticsEventPayload } from './AnalyticsEventPayload';
import { createEvent } from './createEvent';
import { getActionSubject } from './getActionSubject';

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export const cardTriggered = (
	type: ProfileType,
	method: 'hover' | 'click',
	teamId?: string,
): AnalyticsEventPayload => {
	return createEvent('ui', 'triggered', getActionSubject(type), undefined, {
		method,
		...(type === 'team' && teamId ? { teamId } : {}),
	});
};
