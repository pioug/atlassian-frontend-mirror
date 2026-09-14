import { type ProfileType } from '../types';

import type { AnalyticsEventPayload } from './AnalyticsEventPayload';
import { createEvent } from './createEvent';
import { getActionSubject } from './getActionSubject';

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export const actionClicked = (
	type: ProfileType,
	attributes: {
		duration: number;
		hasHref: boolean;
		hasOnClick: boolean;
		index: number;
		actionId: string;
	},
): AnalyticsEventPayload =>
	createEvent('ui', 'clicked', getActionSubject(type), 'action', attributes);
