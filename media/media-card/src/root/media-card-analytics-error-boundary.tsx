import React from 'react';

import AnalyticsErrorBoundary from '@atlaskit/analytics-next/AnalyticsErrorBoundary';

export type MediaCardAnalyticsErrorBoundaryProps = {
  data?: { [k: string]: any };
};

export const ANALYTICS_MEDIA_CHANNEL = 'media';

export default class MediaCardAnalyticsErrorBoundary extends React.Component<
  MediaCardAnalyticsErrorBoundaryProps
> {
  static displayName = 'MediaCardAnalyticsErrorBoundary';

  render() {
    const { data = {}, children } = this.props;
    return (
      <AnalyticsErrorBoundary channel={ANALYTICS_MEDIA_CHANNEL} data={data}>
        {children}
      </AnalyticsErrorBoundary>
    );
  }
}
