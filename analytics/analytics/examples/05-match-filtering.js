import React, { Component } from 'react';

import {
  AnalyticsDecorator,
  AnalyticsListener,
  cleanProps,
  withAnalytics,
} from '../src';

const Button = withAnalytics(
  ({ children, ...props }) => (
    <button type="button" {...cleanProps(props)}>
      {children}
    </button>
  ),
  { onClick: 'click' },
);

export default class MatchExample extends Component {
  onEvent = (eventName, eventData) => {
    console.log(eventName, eventData);
  };

  render() {
    return (
      <AnalyticsListener onEvent={this.onEvent} match="button.">
        <AnalyticsDecorator data={{ time: Date.now() }} match="button.">
          <Button analyticsId="button">Send analytics event</Button>
        </AnalyticsDecorator>
      </AnalyticsListener>
    );
  }
}
