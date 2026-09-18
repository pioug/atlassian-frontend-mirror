import { type ProfileType } from '../types';
import type { AnalyticsEventPayload } from './AnalyticsEventPayload';
import { createEvent } from './createEvent';
import { getActionSubject } from './getActionSubject';

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export const moreActionsClicked = (
	type: ProfileType,
	attributes: {
		duration: number;
		numActions: number;
	},
): AnalyticsEventPayload =>
	createEvent('ui', 'clicked', getActionSubject(type), 'moreActions', attributes);
