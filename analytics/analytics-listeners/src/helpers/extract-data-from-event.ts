/**
 * Largely taken from analytics-web-react
 */

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

export const extractFromEventContext = (
	propertyNames: string[],
	event: UIAnalyticsEvent,
	namespacedContextOnly = true,
	contextName: string,
): any[] =>
	event.context.reduce((acc, contextItem) => {
		propertyNames.forEach((propertyName) => {
			const navContext = contextItem[contextName];
			const navContextProp = navContext ? navContext[propertyName] : null;
			const value = namespacedContextOnly
				? navContextProp
				: navContextProp || contextItem[propertyName];

			if (value) {
				acc.push(value);
			}
		});
		return acc;
	}, []) as any[];
