/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import { AnalyticsListener, cleanProps, withAnalytics } from '../src';

/* eslint-disable react/no-multi-comp */
class Button extends Component {
  onClick = (e) => {
    const { fireAnalyticsEvent, firePrivateAnalyticsEvent } = this.props;
    fireAnalyticsEvent('click');
    const { clientX, clientY } = e;
    firePrivateAnalyticsEvent('private.button.click', { clientX, clientY });
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
}

const IntegratedButton = withAnalytics(Button);
/* eslint-disable react/no-multi-comp */

export default class IntegratingExample extends Component {
  onEvent = (eventName, eventData) => {
    console.log(eventName, eventData);
  };

  render() {
    return (
      <AnalyticsListener onEvent={this.onEvent}>
        <IntegratedButton analyticsId="integrated.button">
          Integrated button
        </IntegratedButton>
      </AnalyticsListener>
    );
  }
}
