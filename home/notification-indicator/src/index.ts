import NotificationIndicator from './NotificationIndicator';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

const NotificationIndicatorWithAnalytics = withAnalyticsEvents()(
  NotificationIndicator,
);
export { NotificationIndicatorWithAnalytics as NotificationIndicator };
