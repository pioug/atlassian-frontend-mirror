import React, { Component, ReactNode } from 'react';

import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

import createEventPayload from '../../analytics.codegen';

type ErrorBoundaryErrorInfo = {
  componentStack: string;
};

export interface ErrorBoundaryProps extends WithAnalyticsEventsProps {
  children: ReactNode;
  channel: string;
  ErrorComponent?: React.ComponentType;
  onError?: (error: Error, info?: ErrorBoundaryErrorInfo) => void;
}

type ErrorBoundaryPayload = {
  error: Error | string;
  info?: ErrorBoundaryErrorInfo;
  [key: string]: any;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class BaseErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  fireAnalytics = (analyticsErrorPayload: ErrorBoundaryPayload) => {
    const { createAnalyticsEvent, channel } = this.props;

    createAnalyticsEvent!(
      createEventPayload('ui.linkPicker.unhandledErrorCaught', {
        browserInfo: window?.navigator?.userAgent || 'unknown',
        error: analyticsErrorPayload.error.toString(),
        componentStack: analyticsErrorPayload.info?.componentStack ?? '',
      }),
    ).fire(channel);
  };

  componentDidCatch(error: Error, info?: ErrorBoundaryErrorInfo): void {
    const { onError } = this.props;
    const payload: ErrorBoundaryPayload = {
      error,
      info,
    };

    this.fireAnalytics(payload);
    onError && onError(error, info);
    this.setState({ hasError: true });
  }

  render() {
    const { children, ErrorComponent } = this.props;
    const { hasError } = this.state;

    if (hasError && ErrorComponent) {
      return <ErrorComponent />;
    }

    return children;
  }
}

const ErrorBoundary = withAnalyticsEvents()(BaseErrorBoundary);

export default ErrorBoundary;
