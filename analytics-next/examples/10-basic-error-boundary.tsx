import React, { Component } from 'react';
import {
  AnalyticsListener,
  AnalyticsErrorBoundary,
  UIAnalyticsEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '../src';

interface ButtonProps extends WithAnalyticsEventsProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

class ButtonBase extends Component<ButtonProps, { counter: number }> {
  state = {
    counter: 0,
  };

  handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState(({ counter }) => ({
      counter: counter + 1,
    }));

    // Create our analytics event
    const analyticsEvent = this.props.createAnalyticsEvent!({
      action: 'click',
    });

    // Fire our analytics event on the 'atlaskit' channel
    analyticsEvent.fire('atlaskit');

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render() {
    if (this.state.counter === 1) {
      // Simulate a JS error
      throw new Error('Oops!');
    }
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} onClick={this.handleClick} />;
  }
}

const Button = withAnalyticsEvents()(ButtonBase);

export default class App extends Component<{}> {
  handleEvent = (analyticsEvent: UIAnalyticsEvent) => {
    const { payload, context } = analyticsEvent;
    console.log('Received event:', analyticsEvent, { payload, context });
  };

  render() {
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
        <AnalyticsErrorBoundary
          channel="atlaskit"
          data={{
            componentName: 'button',
            packageName: '@atlaskit/button',
            componentVersion: '999.9.9',
          }}
        >
          <>
            <p>
              This example simulates a JS error in one of the children
              components of `AnalyticsErrorBoundary`. To check that in action,
              please open your DevTools, click in the button and check the
              console for the event track.
            </p>
            <Button>Click me</Button>
          </>
        </AnalyticsErrorBoundary>
      </AnalyticsListener>
    );
  }
}
