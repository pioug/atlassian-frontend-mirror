import React, { Component, ReactNode } from 'react';

import withAnalyticsEvents, {
  WithAnalyticsEventsProps,
} from '../hocs/withAnalyticsEvents';

import AnalyticsContext from './AnalyticsContext/LegacyAnalyticsContext';

type AnalyticsErrorBoundaryErrorInfo = {
  componentStack: string;
};

export interface AnalyticsErrorBoundaryProps extends WithAnalyticsEventsProps {
  /** React component to be wrapped */
  children: ReactNode;
  channel: string;
  data: {};
}

type AnalyticsErrorBoundaryPayload = {
  error: Error | string;
  info?: AnalyticsErrorBoundaryErrorInfo;
  [key: string]: any;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class BaseAnalyticsErrorBoundary extends Component<
  AnalyticsErrorBoundaryProps,
  {}
> {
  fireAnalytics = (analyticsErrorPayload: AnalyticsErrorBoundaryPayload) => {
    const { createAnalyticsEvent, channel, data } = this.props;

    createAnalyticsEvent!({
      action: 'UnhandledError',
      eventType: 'ui',
      attributes: {
        browserInfo:
          window && window.navigator && window.navigator.userAgent
            ? window.navigator.userAgent
            : 'unknown',
        ...data,
        ...analyticsErrorPayload,
      },
    }).fire(channel);
  };

  componentDidCatch(
    error: Error,
    info?: AnalyticsErrorBoundaryErrorInfo,
  ): void {
    const payload: AnalyticsErrorBoundaryPayload = {
      error,
      info,
    };

    this.fireAnalytics(payload);
  }

  render() {
    const { data, children } = this.props;
    return <AnalyticsContext data={data}>{children}</AnalyticsContext>;
  }
}

const AnalyticsErrorBoundary = withAnalyticsEvents()(
  BaseAnalyticsErrorBoundary,
);

export default AnalyticsErrorBoundary;
