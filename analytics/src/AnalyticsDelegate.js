/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
Listens to public and private events and delegates to an analytics
stack in a different React root.
*/

const ContextTypes = {
  onAnalyticsEvent: PropTypes.func,
};

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    'The @atlaskit/analytics package has been deprecated. Please use the @atlaskit/analytics-next package instead.',
  );
}

class AnalyticsDelegate extends Component {
  static contextTypes = ContextTypes;

  static childContextTypes = ContextTypes;

  getChildContext() {
    return {
      onAnalyticsEvent: this.onAnalyticsEvent,
    };
  }

  onAnalyticsEvent = (name, data, isPrivate) => {
    // eslint-disable-next-line react/prop-types
    const { delegateAnalyticsEvent } = this.props;

    // send a clean data object so it can't be mutated between listeners
    const eventData = { ...data };
    if (delegateAnalyticsEvent) {
      delegateAnalyticsEvent(name, eventData, isPrivate);
    }

    // Pass the event up the hierarchy
    const { onAnalyticsEvent } = this.context;
    if (typeof onAnalyticsEvent === 'function') {
      onAnalyticsEvent(name, data, isPrivate);
    }
  };

  render() {
    const { children } = this.props; // eslint-disable-line react/prop-types
    return React.Children.only(children);
  }
}

export default AnalyticsDelegate;
