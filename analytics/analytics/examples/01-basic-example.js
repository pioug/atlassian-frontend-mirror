/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import {
  AnalyticsDecorator,
  AnalyticsListener,
  cleanProps,
  withAnalytics,
} from '../src';

/* eslint-disable react/no-multi-comp */
const Button = withAnalytics(
  class T extends Component {
    onClick = (e) => {
      const { fireAnalyticsEvent, firePrivateAnalyticsEvent } = this.props;
      fireAnalyticsEvent('click');
      firePrivateAnalyticsEvent('private.button.click', { key: 'value' });
      if (this.props.onClick) this.props.onClick(e);
    };

    render() {
      const { children, ...props } = this.props;
      return (
        <button type="button" {...cleanProps(props)} onClick={this.onClick}>
          {children}
        </button>
      );
    }
  },
);
/* eslint-disable react/no-multi-comp */

export default class BasicExample extends Component {
  onEvent = (eventName, eventData) => {
    console.log(eventName, eventData);
  };

  render() {
    return (
      <AnalyticsListener onEvent={this.onEvent}>
        <AnalyticsListener onEvent={this.onEvent} matchPrivate>
          <AnalyticsDecorator data={{ publicTime: Date.now() }}>
            <AnalyticsDecorator data={{ privateTime: Date.now() }} matchPrivate>
              <Button analyticsId="button" analyticsData={{ key: 'value' }}>
                Send analytics event
              </Button>
            </AnalyticsDecorator>
          </AnalyticsDecorator>
        </AnalyticsListener>
      </AnalyticsListener>
    );
  }
}
