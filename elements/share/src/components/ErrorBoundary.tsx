import React from 'react';
import {
  WithAnalyticsEventsProps,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { CHANNEL_ID, errorEncountered } from './analytics';

type Props = WithAnalyticsEventsProps;
type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false };

  componentDidCatch(error: any) {
    const { createAnalyticsEvent } = this.props;

    if (createAnalyticsEvent) {
      createAnalyticsEvent(
        errorEncountered(undefined, {
          message: error.message,
          errorClass: error.name,
        }),
      ).fire(CHANNEL_ID);
    }

    this.setState({
      hasError: true,
    });
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      // Silently fail.
      return null;
    }
    return this.props.children;
  }
}

export default withAnalyticsEvents()(ErrorBoundary);
