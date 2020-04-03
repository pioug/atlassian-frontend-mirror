import React, { Component } from 'react';

import { AnalyticsListener, cleanProps, withAnalytics } from '../src';

const DefaultPropsButton = withAnalytics(
  ({ children, ...props }) => (
    <button type="button" {...cleanProps(props)}>
      {children}
    </button>
  ),
  { onClick: 'click' },
  {
    analyticsId: 'button',
    analyticsData: { foo: 'bar' },
  },
);

export default class DefaultPropsExample extends Component {
  onEvent = (eventName, eventData) => {
    console.log(eventName, eventData);
  };

  render() {
    return (
      <AnalyticsListener onEvent={this.onEvent}>
        <DefaultPropsButton>
          Button with default analytics props
        </DefaultPropsButton>
      </AnalyticsListener>
    );
  }
}
