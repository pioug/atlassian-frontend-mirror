/**
 * Largely taken from analytics-web-react
 */

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

export const extractFromEventContext = (propertyName: string, event: UIAnalyticsEvent): any[] =>
	event.context.map((contextItem: any) => contextItem[propertyName]).filter(Boolean);
