import type { AnalyticsEventPayload } from './AnalyticsEventPayload';
import type { GenericAttributes } from './GenericAttributes';
import { getPageTime } from './performance';

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export const createEvent = (
	eventType: 'ui' | 'operational',
	action: string,
	actionSubject: string,
	actionSubjectId?: string,
	attributes: GenericAttributes = {},
): AnalyticsEventPayload => ({
	eventType,
	action,
	actionSubject,
	actionSubjectId,
	attributes: {
		packageName: process.env._PACKAGE_NAME_,
		packageVersion: process.env._PACKAGE_VERSION_,
		...attributes,
		firedAt: Math.round(getPageTime()),
	},
});
