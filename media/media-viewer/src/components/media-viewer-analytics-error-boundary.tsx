import React from 'react';
import AnalyticsErrorBoundary from '@atlaskit/analytics-next/AnalyticsErrorBoundary';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common';

export type MediaViewerAnalyticsErrorBoundaryProps = {
  data?: { [k: string]: any };
};

export default class MediaViewerAnalyticsErrorBoundary extends React.Component<
  MediaViewerAnalyticsErrorBoundaryProps
> {
  static displayName = 'MediaViewerAnalyticsErrorBoundary';

  render() {
    const { data = {}, children } = this.props;
    return (
      <AnalyticsErrorBoundary channel={ANALYTICS_MEDIA_CHANNEL} data={data}>
        {children}
      </AnalyticsErrorBoundary>
    );
  }
}
