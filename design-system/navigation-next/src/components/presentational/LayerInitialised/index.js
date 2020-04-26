import { Component } from 'react';

import { withAnalyticsEvents } from '@atlaskit/analytics-next';

import { navigationUILoaded } from '../../../common/analytics';

class LayerInitialised extends Component {
  componentDidMount() {
    if (!this.props.initialised) {
      this.fireInitialisedEvent();
    }
  }

  componentDidUpdate() {
    if (!this.props.initialised) {
      this.fireInitialisedEvent();
    }
  }

  fireInitialisedEvent = () => {
    const { createAnalyticsEvent, activeView, onInitialised } = this.props;
    if (activeView) {
      navigationUILoaded(createAnalyticsEvent, {
        layer: activeView.type,
      });
      if (onInitialised) {
        onInitialised();
      }
    }
  };

  render() {
    return null;
  }
}

export default withAnalyticsEvents()(LayerInitialised);
