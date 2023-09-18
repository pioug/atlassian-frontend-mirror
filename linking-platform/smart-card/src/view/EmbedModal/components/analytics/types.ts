import { AnalyticsFacade } from '../../../../state/analytics';
import { AnalyticsOrigin } from '../../../../utils/types';

export type WithAnalytics = {
  analytics?: AnalyticsFacade;
  extensionKey?: string;
  origin?: AnalyticsOrigin;
};
