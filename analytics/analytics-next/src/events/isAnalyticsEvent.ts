import AnalyticsEvent from './AnalyticsEvent';

export const isAnalyticsEvent = (obj: any): boolean =>
	obj instanceof AnalyticsEvent ||
	!!obj?._isAnalyticsEvent ||
	// Backwards compatibility with older analytics-next packages
	obj?.constructor?.name === 'AnalyticsEvent';
