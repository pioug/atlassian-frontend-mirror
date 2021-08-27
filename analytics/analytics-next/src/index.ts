export type { CreateUIAnalyticsEvent } from './types';

// Analytics event classes
export {
  default as AnalyticsEvent,
  isAnalyticsEvent,
} from './events/AnalyticsEvent';
export type {
  AnalyticsEventPayload,
  AnalyticsEventProps,
} from './events/AnalyticsEvent';
export {
  default as UIAnalyticsEvent,
  isUIAnalyticsEvent,
} from './events/UIAnalyticsEvent';
export type {
  UIAnalyticsEventProps,
  UIAnalyticsEventHandler,
} from './events/UIAnalyticsEvent';

// AnalyticsListener component
export { default as AnalyticsListener } from './components/AnalyticsListener/index';

// AnalyticsContext component and HOC
export { default as AnalyticsContext } from './components/AnalyticsContext/index';
export { default as withAnalyticsContext } from './hocs/withAnalyticsContext';
export type { WithContextProps } from './hocs/withAnalyticsContext';

// AnalyticsErrorBoundary component
export { default as AnalyticsErrorBoundary } from './components/AnalyticsErrorBoundary';
export type { AnalyticsErrorBoundaryProps } from './components/AnalyticsErrorBoundary';

// createAnalyticsEvent HOC
export { default as withAnalyticsEvents } from './hocs/withAnalyticsEvents';
export type { WithAnalyticsEventsProps } from './hocs/withAnalyticsEvents';

// React context
export { default as AnalyticsReactContext } from '@atlaskit/analytics-next-stable-react-context';
export type { AnalyticsReactContextInterface } from '@atlaskit/analytics-next-stable-react-context';

// Hook for creating and firing analytics events
export { useAnalyticsEvents } from './hooks/useAnalyticsEvents';
export type { UseAnalyticsEventsHook } from './hooks/useAnalyticsEvents';

export { useCallbackWithAnalytics } from './hooks/useCallbackWithAnalytics';
export type { UseCallbackWithAnalyticsHook } from './hooks/useCallbackWithAnalytics';
export { usePlatformLeafEventHandler } from './hooks/usePlatformLeafEventHandler';
export type {
  UsePlatformLeafEventHandlerHookArgs,
  UsePlatformLeafEventHandlerHook,
} from './hooks/usePlatformLeafEventHandler';

export { usePlatformLeafSyntheticEventHandler } from './hooks/usePlatformLeafSyntheticEventHandler';
export type {
  UsePlatformLeafSyntheticEventHandlerHookArgs,
  UsePlatformLeafSyntheticEventHandlerHook,
} from './hooks/usePlatformLeafSyntheticEventHandler';

// Helper functions
export { default as createAndFireEvent } from './utils/createAndFireEvent';
export { default as cleanProps } from './utils/cleanProps';
