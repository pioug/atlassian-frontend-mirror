import { type useAnalyticsEvents } from './generated/use-analytics-events';

export type FireEventFunction = ReturnType<typeof useAnalyticsEvents>['fireEvent'];
