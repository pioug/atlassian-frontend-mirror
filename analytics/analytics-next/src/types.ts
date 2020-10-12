import { AnalyticsEventPayload } from './events/AnalyticsEvent';
import UIAnalyticsEvent from './events/UIAnalyticsEvent';

export type CreateUIAnalyticsEvent = (
  payload: AnalyticsEventPayload,
) => UIAnalyticsEvent;

export type AnalyticsEventCreator = (
  create: CreateUIAnalyticsEvent,
  props: Record<string, any>,
) => UIAnalyticsEvent | undefined;

export type CreateEventMapValue = AnalyticsEventPayload | AnalyticsEventCreator;

export type CreateEventMap = Record<string, CreateEventMapValue>;
