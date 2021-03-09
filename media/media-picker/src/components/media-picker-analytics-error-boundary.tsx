import React from 'react';
import AnalyticsErrorBoundary from '@atlaskit/analytics-next/AnalyticsErrorBoundary';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common';

export type MediaPickerAnalyticsErrorBoundaryProps = {
  data?: { [k: string]: any };
};

export default class MediaPickerAnalyticsErrorBoundary extends React.Component<
  MediaPickerAnalyticsErrorBoundaryProps
> {
  static displayName = 'MediaPickerAnalyticsErrorBoundary';

  render() {
    const { data = {}, children } = this.props;
    return (
      <AnalyticsErrorBoundary channel={ANALYTICS_MEDIA_CHANNEL} data={data}>
        {children}
      </AnalyticsErrorBoundary>
    );
  }
}
