import React from 'react';

import { ComponentCrashErrorAEP, PLATFORM } from '../../analytics/events';
import { ACTION, EVENT_TYPE } from '../../analytics/enums';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';

interface ErrorBoundaryProps {
  component: ComponentCrashErrorAEP['actionSubject'];
  componentId?: ComponentCrashErrorAEP['actionSubjectId'];
  fallbackComponent?: React.ReactNode;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  rethrowError?: boolean;
}

interface ErrorBoundaryState {
  errorCaptured: boolean;
}
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state = { errorCaptured: false };

  private fireAnalyticsEvent(event: ComponentCrashErrorAEP) {
    const { createAnalyticsEvent } = this.props;

    if (createAnalyticsEvent) {
      const channel = FabricChannel.editor;
      createAnalyticsEvent(event).fire(channel);
    }
  }

  private hasFallback() {
    return typeof this.props.fallbackComponent !== 'undefined';
  }

  private shouldRecover() {
    return this.hasFallback() && this.state.errorCaptured;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.fireAnalyticsEvent({
      action: ACTION.CRASHED,
      actionSubject: this.props.component,
      actionSubjectId: this.props.componentId,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        platform: PLATFORM.WEB,
        errorMessage: error?.message,
        errorStack: error?.stack,
        componentStack: errorInfo?.componentStack,
        errorRethrown: Boolean(this.props.rethrowError),
      },
    });

    if (this.hasFallback()) {
      this.setState({ errorCaptured: true }, () => {
        if (this.props.rethrowError) {
          throw error;
        }
      });
    }
  }

  render() {
    if (this.shouldRecover()) {
      return this.props.fallbackComponent;
    }
    return this.props.children;
  }
}
