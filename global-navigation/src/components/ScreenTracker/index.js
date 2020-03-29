import { Component } from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

import { NAVIGATION_CHANNEL } from '../../constants';

/** Fires a screen event when the screen becomes visible */
export class ScreenTrackerBase extends Component {
  componentDidMount() {
    if (this.props.isVisible) {
      this.fireScreenEvent();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isVisible && this.props.isVisible) {
      this.fireScreenEvent();
    }
  }

  fireScreenEvent = () => {
    const { name, createAnalyticsEvent } = this.props;
    createAnalyticsEvent({
      eventType: 'screen',
      name,
    }).fire(NAVIGATION_CHANNEL);
  };

  render() {
    return null;
  }
}

export default withAnalyticsEvents()(ScreenTrackerBase);
