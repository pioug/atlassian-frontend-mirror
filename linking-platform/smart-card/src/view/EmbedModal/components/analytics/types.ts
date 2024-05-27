import { type AnalyticsFacade } from '../../../../state/analytics';
import { type AnalyticsOrigin } from '../../../../utils/types';

export type WithAnalytics = {
  analytics?: AnalyticsFacade;
  extensionKey?: string;
  origin?: AnalyticsOrigin;
};
