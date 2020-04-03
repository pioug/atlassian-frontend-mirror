import React from 'react';

import AnalyticsErrorBoundary from '@atlaskit/analytics-next/AnalyticsErrorBoundary';

export type MediaPickerAnalyticsErrorBoundaryProps = {
  data?: { [k: string]: any };
};

export const ANALYTICS_MEDIA_CHANNEL = 'media';

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
