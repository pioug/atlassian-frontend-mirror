/**
 * Largely taken from analytics-web-react
 */

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

export const getPackageInfo = (
	event: UIAnalyticsEvent,
	contextName: string,
): {
	packageName: any;
	packageVersion: any;
}[] =>
	event.context
		.map((contextItem) => {
			const navContext = contextItem[contextName];
			const item = navContext ? navContext : contextItem;
			return {
				packageName: item.packageName,
				packageVersion: item.packageVersion,
			};
		})
		.filter((p) => p.packageName);
