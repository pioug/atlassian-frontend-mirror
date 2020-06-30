import React from 'react';

import {
  CreateUIAnalyticsEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

export type Props = {
  render: (createAnalyticsEvent?: CreateUIAnalyticsEvent) => React.ReactNode;
};

export const WithCreateAnalyticsEvent: React.ComponentType<Props> = withAnalyticsEvents()(
  class WithCreateAnalyticsEvent extends React.Component<
    Props & WithAnalyticsEventsProps
  > {
    render() {
      const { render, createAnalyticsEvent } = this.props;
      return render(createAnalyticsEvent);
    }
  },
);
