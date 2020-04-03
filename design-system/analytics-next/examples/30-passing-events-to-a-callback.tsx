import React, { Component, MouseEvent } from 'react';
import {
  AnalyticsListener,
  UIAnalyticsEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '../src';

interface ButtonBaseProps extends WithAnalyticsEventsProps {
  onClick: (
    e: MouseEvent<HTMLButtonElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  children: React.ReactNode;
}

class ManualButtonBase extends Component<ButtonBaseProps> {
  handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Create our analytics event
    const analyticsEvent = this.props.createAnalyticsEvent!({
      action: 'click',
    });

    if (this.props.onClick) {
      // Pass the event through the corresponding callback prop
      this.props.onClick(e, analyticsEvent);
    }
  };

  render() {
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} onClick={this.handleClick} />;
  }
}

class ButtonBase extends Component<ButtonBaseProps> {
  render() {
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} />;
  }
}

const ManualButton = withAnalyticsEvents()(ManualButtonBase);
const VerboseButton = withAnalyticsEvents({
  onClick: create => create({ action: 'click' }),
})(ButtonBase);
const ShorthandButton = withAnalyticsEvents({
  onClick: { action: 'click' },
})(ButtonBase);

const ButtonGroup = () => {
  const onClick = (
    e: MouseEvent<HTMLButtonElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => analyticsEvent && analyticsEvent.fire('atlaskit');

  return (
    <div>
      <div>
        <ManualButton onClick={onClick}>
          Manually creating and passing up the event
        </ManualButton>
      </div>
      <div>
        <VerboseButton onClick={onClick}>
          {`Using a function in the 'create event map' option`}
        </VerboseButton>
      </div>
      <div>
        <ShorthandButton onClick={onClick}>
          {`Using the payload object shorthand in the 'create event map' option`}
        </ShorthandButton>
      </div>
    </div>
  );
};

export default class App extends Component<void> {
  handleEvent = (analyticsEvent: UIAnalyticsEvent) => {
    const { payload, context } = analyticsEvent;
    console.log('Received event:', { payload, context });
  };

  render() {
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
        <ButtonGroup />
      </AnalyticsListener>
    );
  }
}
