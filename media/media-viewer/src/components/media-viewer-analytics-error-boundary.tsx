import React from 'react';

import AnalyticsErrorBoundary from '@atlaskit/analytics-next/AnalyticsErrorBoundary';

export type MediaViewerAnalyticsErrorBoundaryProps = {
  data?: { [k: string]: any };
};

export const ANALYTICS_MEDIA_CHANNEL = 'media';

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
