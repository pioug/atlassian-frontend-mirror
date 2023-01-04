import React from 'react';
import {
  MediaFeatureFlags,
  withMediaAnalyticsContext,
} from '@atlaskit/media-common';
import { CardDimensions, CardOnClickCallback } from '../types';
import { UnhandledErrorCard } from './ui/unhandledErrorCard';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  AnalyticsErrorBoundaryCardPayload,
  fireMediaCardEvent,
  ErrorBoundaryErrorInfo,
} from '../utils/analytics';

export type MediaCardAnalyticsErrorBoundaryProps = {
  dimensions?: CardDimensions;
  data?: { [k: string]: any };
  onClick?: CardOnClickCallback; // it is required for inner component to trigger event from editor
  featureFlags?: MediaFeatureFlags;
} & WithAnalyticsEventsProps;

type MediaCardAnalyticsErrorBoundaryState = {
  hasError: boolean;
};

class WrappedMediaCardAnalyticsErrorBoundary extends React.Component<
  MediaCardAnalyticsErrorBoundaryProps,
  MediaCardAnalyticsErrorBoundaryState
> {
  constructor(props: MediaCardAnalyticsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static displayName = 'MediaCardAnalyticsErrorBoundary';
  private fireOperationalEvent = (
    error: Error | string,
    info?: ErrorBoundaryErrorInfo,
  ) => {
    const { data = {}, createAnalyticsEvent } = this.props;
    const payload: AnalyticsErrorBoundaryCardPayload = {
      eventType: 'operational',
      action: 'failed',
      actionSubject: 'mediaCardRender',
      attributes: {
        browserInfo: window?.navigator?.userAgent
          ? window.navigator.userAgent
          : 'unknown',
        error,
        info,
        failReason: 'unexpected-error',
        ...data,
      },
    };
    fireMediaCardEvent(payload, createAnalyticsEvent);
  };

  componentDidCatch(error: Error, info?: ErrorBoundaryErrorInfo): void {
    try {
      this.fireOperationalEvent(error, info);
    } catch (e) {}
    this.setState({ hasError: true });
  }
  handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    try {
      this.props.onClick?.({ event });
    } catch (e) {}
  };

  render() {
    const { hasError } = this.state;
    const { dimensions, children } = this.props;

    if (hasError) {
      return (
        <UnhandledErrorCard
          dimensions={dimensions}
          onClick={this.handleOnClick}
        />
      );
    }

    return children;
  }
}

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const MediaCardAnalyticsErrorBoundary: React.ComponentType<
  MediaCardAnalyticsErrorBoundaryProps & WithAnalyticsEventsProps
> = withMediaAnalyticsContext({
  packageVersion,
  packageName,
  componentName: 'mediaCard',
  component: 'mediaCard',
})(withAnalyticsEvents()(WrappedMediaCardAnalyticsErrorBoundary));

export default MediaCardAnalyticsErrorBoundary;
