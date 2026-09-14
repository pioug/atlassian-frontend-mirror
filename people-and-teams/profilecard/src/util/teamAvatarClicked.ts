import { TEAM_SUBJECT } from './analytics';
import type { AnalyticsEventPayload } from './AnalyticsEventPayload';
import { createEvent } from './createEvent';

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export const teamAvatarClicked = (attributes: {
	duration: number;
	hasHref: boolean;
	hasOnClick: boolean;
	index: number;
}): AnalyticsEventPayload => createEvent('ui', 'clicked', TEAM_SUBJECT, 'avatar', attributes);
