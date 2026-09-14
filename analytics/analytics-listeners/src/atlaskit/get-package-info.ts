/**
 * Largely taken from analytics-web-react
 */

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

export const getPackageInfo = (
	event: UIAnalyticsEvent,
): {
	packageName: any;
	packageVersion: any;
}[] =>
	event.context
		.map((contextItem) => ({
			packageName: contextItem.packageName,
			packageVersion: contextItem.packageVersion,
		}))
		.filter((p) => p.packageName);
