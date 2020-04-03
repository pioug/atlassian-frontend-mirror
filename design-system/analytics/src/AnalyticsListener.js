/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import matchEvent from './matchEvent';

/*
The Listener component is responsible for calling its `onEvent` handler when a
child component fires an analytics event, and passing the event up the hierarchy
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

class AnalyticsListener extends Component {
  static defaultProps = {
    match: '*',
    matchPrivate: false,
  };

  static contextTypes = ContextTypes;

  static childContextTypes = ContextTypes;

  getChildContext() {
    return {
      onAnalyticsEvent: this.onAnalyticsEvent,
    };
  }

  onAnalyticsEvent = (name, data, isPrivate) => {
    // Call this component's onEvent method if it's a match
    // eslint-disable-next-line react/prop-types
    const { onEvent, match, matchPrivate } = this.props;
    if (
      matchPrivate === isPrivate &&
      matchEvent(match, name) &&
      typeof onEvent === 'function'
    ) {
      // send a clean data object so it can't be mutated between listeners
      const eventData = { ...data };
      onEvent(name, eventData);
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

export default AnalyticsListener;
