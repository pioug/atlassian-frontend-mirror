import React, { Component } from 'react';

import { AnalyticsListener, cleanProps, withAnalytics } from '../src';

const WrappedButton = withAnalytics(
  ({ children, ...props }) => (
    <button type="button" {...cleanProps(props)}>
      {children}
    </button>
  ),
  { onClick: 'click' },
);

const WrappedButtonFunction = withAnalytics(
  ({ children, ...props }) => (
    <button type="button" {...cleanProps(props)}>
      {children}
    </button>
  ),
  (fireAnalyticsEvent) => ({
    onClick: () => fireAnalyticsEvent('click'),
  }),
);

export default class WrapExample extends Component {
  onEvent = (eventName, eventData) => {
    console.log(eventName, eventData);
  };

  render() {
    return (
      <AnalyticsListener onEvent={this.onEvent}>
        <div>
          <WrappedButton analyticsId="wrapped.button">
            Wrapped button
          </WrappedButton>
          <WrappedButtonFunction analyticsId="wrapped.button.with.function">
            Wrapped button with function
          </WrappedButtonFunction>
        </div>
      </AnalyticsListener>
    );
  }
}
