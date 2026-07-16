/// <reference types="node" />

import UIAnalyticsEvent from './UIAnalyticsEvent';

export const isUIAnalyticsEvent = (obj: any): obj is UIAnalyticsEvent =>
	obj instanceof UIAnalyticsEvent ||
	!!obj?._isUIAnalyticsEvent ||
	// Backwards compatibility with older analytics-next packages
	obj?.constructor?.name === 'UIAnalyticsEvent';
