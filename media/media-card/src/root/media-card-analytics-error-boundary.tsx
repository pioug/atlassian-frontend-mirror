import React from 'react';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common';
import AnalyticsErrorBoundary from '@atlaskit/analytics-next/AnalyticsErrorBoundary';

export type MediaCardAnalyticsErrorBoundaryProps = {
  data?: { [k: string]: any };
};

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
