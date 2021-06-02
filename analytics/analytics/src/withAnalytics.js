/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    'The @atlaskit/analytics package has been deprecated. Please use the @atlaskit/analytics-next package instead.',
  );
}

/*
The withAnalytics HOC wraps a component and provides the `fireAnalyticsEvent`
and `firePrivateAnalyticsEvent` methods to it as props. It contains the logic
for how to fire events, including handling the analyticsId and analyticsData
props. The `map` argument may be an object or a function that returns an object.
The properties of the `map` object/result can be strings (the name of the event
that will be fired) or functions (which are responsible for firing the event).
You can specify a default `analyticsId` and `analyticsData` with the `defaultProps`
param. Please be aware that specifying a default `analyticsId` will cause public
events to always fire for your component unless it has been set to a falsy by
the component consumer.
*/
const withAnalytics = (
  WrappedComponent,
  map = {},
  defaultProps = {},
  withDelegation,
) =>
  class WithAnalytics extends Component {
    props;

    static displayName = `WithAnalytics(${
      WrappedComponent.displayName || WrappedComponent.name
    })`;

    static contextTypes = {
      onAnalyticsEvent: PropTypes.func,
      getParentAnalyticsData: PropTypes.func,
    };

    static defaultProps = {
      analyticsId: defaultProps.analyticsId,
      analyticsData: defaultProps.analyticsData,
    };

    evaluatedMap = {};

    UNSAFE_componentWillMount() {
      this.evaluatedMap =
        typeof map === 'function' ? map(this.fireAnalyticsEvent) : map;
    }

    delegateAnalyticsEvent = (analyticsId, data, isPrivate) => {
      const { onAnalyticsEvent } = this.context;
      if (!onAnalyticsEvent) return;
      onAnalyticsEvent(analyticsId, data, isPrivate);
    };

    fireAnalyticsEvent = (name, data) => {
      const { analyticsData, analyticsId } = this.props;
      const { onAnalyticsEvent } = this.context;
      if (!analyticsId || !onAnalyticsEvent) return;
      const eventData = { ...analyticsData, ...data };
      onAnalyticsEvent(`${analyticsId}.${name}`, eventData, false);
    };

    privateAnalyticsEvent = (name, data) => {
      const { onAnalyticsEvent } = this.context;
      if (!onAnalyticsEvent) return;
      onAnalyticsEvent(`${name}`, data, true);
    };

    getParentAnalyticsData = (name) => {
      const { getParentAnalyticsData } = this.context;
      let parentData = {};
      if (
        typeof getParentAnalyticsData === 'function' &&
        this.props.analyticsId
      ) {
        const { analyticsId } = this.props;
        parentData = getParentAnalyticsData(`${analyticsId}.${name}`, false);
      }
      return parentData;
    };

    render() {
      /* eslint-disable no-unused-vars */
      const { analyticsId, analyticsData, ...componentProps } = this.props;
      /* eslint-enable no-unused-vars */
      Object.keys(this.evaluatedMap).forEach((prop) => {
        const handler = this.evaluatedMap[prop]; // may be eventName or a function
        const originalProp = componentProps[prop];
        componentProps[prop] = (...args) => {
          if (typeof handler === 'function') {
            handler(...args);
          } else {
            this.fireAnalyticsEvent(handler);
          }
          if (typeof originalProp === 'function') originalProp(...args);
        };
      });

      return (
        <WrappedComponent
          fireAnalyticsEvent={this.fireAnalyticsEvent}
          firePrivateAnalyticsEvent={this.privateAnalyticsEvent}
          getParentAnalyticsData={this.getParentAnalyticsData}
          delegateAnalyticsEvent={
            withDelegation ? this.delegateAnalyticsEvent : undefined
          }
          analyticsId={analyticsId}
          ref={this.props.innerRef}
          {...componentProps}
        />
      );
    }
  };

export default withAnalytics;
