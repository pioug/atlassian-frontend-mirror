import { AnalyticsFacade } from '../../../../state/analytics';
import { AnalyticsOrigin } from '../../../../utils/types';

export type WithAnalytics = {
  analytics: AnalyticsFacade;
  origin?: AnalyticsOrigin;
};
