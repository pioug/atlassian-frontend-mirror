import { AnalyticsEventPayload } from './events';

export type DispatchAnalyticsEvent = (payload: AnalyticsEventPayload) => void;
