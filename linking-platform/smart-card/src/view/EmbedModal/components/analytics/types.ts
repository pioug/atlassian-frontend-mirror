import { type AnalyticsOrigin } from '../../../../utils/types';

export type WithAnalytics = {
	extensionKey?: string;
	id?: string;
	origin?: AnalyticsOrigin;
};
