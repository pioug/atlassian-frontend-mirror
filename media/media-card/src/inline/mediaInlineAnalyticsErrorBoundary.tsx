import React from 'react';
import {
  MediaFeatureFlags,
  withMediaAnalyticsContext,
} from '@atlaskit/media-common';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  AnalyticsErrorBoundaryInlinePayload,
  fireMediaCardEvent,
  ErrorBoundaryErrorInfo,
} from '../utils/analytics';

export type MediaInlineAnalyticsErrorBoundaryProps = {
  data?: { [k: string]: any };
  featureFlags?: MediaFeatureFlags;
} & WithAnalyticsEventsProps;

type MediaInlineAnalyticsErrorBoundaryState = {
  hasError: boolean;
};

class WrappedMediaInlineAnalyticsErrorBoundary extends React.Component<
  MediaInlineAnalyticsErrorBoundaryProps,
  MediaInlineAnalyticsErrorBoundaryState
> {
  constructor(props: MediaInlineAnalyticsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static displayName = 'MediaInlineAnalyticsErrorBoundary';
  private fireOperationalEvent = (
    error: Error | string,
    info?: ErrorBoundaryErrorInfo,
  ) => {
    const { data = {}, createAnalyticsEvent } = this.props;
    const payload: AnalyticsErrorBoundaryInlinePayload = {
      eventType: 'operational',
      action: 'failed',
      actionSubject: 'mediaInlineRender',
      attributes: {
        browserInfo: window?.navigator?.userAgent
          ? window.navigator.userAgent
          : 'unknown',
        error,
        failReason: 'unexpected-error',
        info,
        ...data,
      },
    };
    fireMediaCardEvent(payload, createAnalyticsEvent);
  };

  componentDidCatch(error: Error, info?: ErrorBoundaryErrorInfo): void {
    try {
      this.fireOperationalEvent(error, info);
      this.setState({ hasError: true });
    } catch (e) {}
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      // TODO refactor error boundary for inline card https://product-fabric.atlassian.net/browse/MEX-2140
      return <></>;
    }

    return children;
  }
}

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const MediaInlineAnalyticsErrorBoundary: React.ComponentType<
  MediaInlineAnalyticsErrorBoundaryProps & WithAnalyticsEventsProps
> = withMediaAnalyticsContext({
  packageVersion,
  packageName,
  componentName: 'mediaInlineCard',
  component: 'mediaInlineCard',
})(withAnalyticsEvents()(WrappedMediaInlineAnalyticsErrorBoundary));

export default MediaInlineAnalyticsErrorBoundary;
