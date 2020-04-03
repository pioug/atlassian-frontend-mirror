/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import matchEvent from './matchEvent';

/* The Decorator component extends analytics event data for any events fired by
its descendents, then passes the event up the hierarchy */

const ContextTypes = {
  onAnalyticsEvent: PropTypes.func,
  getParentAnalyticsData: PropTypes.func,
};

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    'The @atlaskit/analytics package has been deprecated. Please use the @atlaskit/analytics-next package instead.',
  );
}

class AnalyticsDecorator extends Component {
  static defaultProps = {
    match: '*',
    matchPrivate: false,
  };

  static contextTypes = ContextTypes;

  static childContextTypes = ContextTypes;

  getChildContext() {
    return {
      onAnalyticsEvent: this.onAnalyticsEvent,
      getParentAnalyticsData: this.getParentAnalyticsData,
    };
  }

  getDecoratedAnalyticsData = (name, srcData, isPrivate) => {
    // Decorate the event data if this decorator matches the event name
    // eslint-disable-next-line react/prop-types
    const { data, getData, match, matchPrivate } = this.props;
    const decoratedData = { ...srcData };
    if (matchPrivate === isPrivate && matchEvent(match, name)) {
      if (typeof data === 'object') {
        Object.assign(decoratedData, data);
      }
      if (typeof getData === 'function') {
        Object.assign(decoratedData, getData(name, decoratedData));
      }
    }
    return decoratedData;
  };

  onAnalyticsEvent = (name, srcData, isPrivate) => {
    // Check there is a listener to pass the event to, otherwise there's no need
    // to do any of this work
    const { onAnalyticsEvent } = this.context;
    if (typeof onAnalyticsEvent !== 'function') return;
    const decoratedData = this.getDecoratedAnalyticsData(
      name,
      srcData,
      isPrivate,
    );
    // Pass the decorated event data to the next listener up the hierarchy
    onAnalyticsEvent(name, decoratedData, isPrivate);
  };

  getParentAnalyticsData = (name, isPrivate) => {
    const parentData = this.getDecoratedAnalyticsData(name, {}, isPrivate);
    // Get any analytics data from any decorators up the hierarchy
    const { getParentAnalyticsData } = this.context;
    if (typeof getParentAnalyticsData === 'function') {
      Object.assign(parentData, getParentAnalyticsData(name, isPrivate));
    }
    return parentData;
  };

  render() {
    const { children } = this.props; // eslint-disable-line react/prop-types
    return React.Children.only(children);
  }
}

export default AnalyticsDecorator;
