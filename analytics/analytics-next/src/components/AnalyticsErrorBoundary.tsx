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
  ErrorComponent?: React.ComponentType;
  onError?: (error: Error, info?: AnalyticsErrorBoundaryErrorInfo) => void;
}

type AnalyticsErrorBoundaryPayload = {
  error: Error | string;
  info?: AnalyticsErrorBoundaryErrorInfo;
  [key: string]: any;
};

type AnalyticsErrorBoundaryState = {
  hasError: boolean;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class BaseAnalyticsErrorBoundary extends Component<
  AnalyticsErrorBoundaryProps,
  AnalyticsErrorBoundaryState
> {
  constructor(props: AnalyticsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

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
    const { onError } = this.props;
    const payload: AnalyticsErrorBoundaryPayload = {
      error,
      info,
    };

    this.fireAnalytics(payload);
    onError && onError(error, info);
    this.setState({ hasError: true });
  }

  render() {
    const { data, children, ErrorComponent } = this.props;
    const { hasError } = this.state;

    if (hasError && ErrorComponent) {
      return (
        <AnalyticsContext data={data}>
          <ErrorComponent />
        </AnalyticsContext>
      );
    }

    return <AnalyticsContext data={data}>{children}</AnalyticsContext>;
  }
}

const AnalyticsErrorBoundary = withAnalyticsEvents()(
  BaseAnalyticsErrorBoundary,
);

export default AnalyticsErrorBoundary;
