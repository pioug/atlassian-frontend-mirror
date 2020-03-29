import React, { Component, FC, MouseEvent } from 'react';
import {
  AnalyticsListener,
  UIAnalyticsEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  useAnalyticsEvents,
  useCallbackWithAnalytics,
} from '../src';

interface Props extends WithAnalyticsEventsProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

class ButtonBase extends Component<Props> {
  handleClick = (e: MouseEvent<HTMLButtonElement>) => {
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
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} onClick={this.handleClick} />;
  }
}

const Button = withAnalyticsEvents()(ButtonBase);

const FunctionalButton: FC<Props> = ({ onClick, ...props }) => {
  // Decompose function from the hook
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Create our analytics event
    const analyticsEvent = createAnalyticsEvent({ action: 'click' });

    // Fire our analytics event
    analyticsEvent.fire('atlaskit');

    if (onClick) {
      onClick(e);
    }
  };

  return <button {...props} onClick={handleClick} />;
};

const FunctionalButtonWithCallback: FC<Props> = ({ onClick, ...props }) => {
  const handleClick = useCallbackWithAnalytics(
    onClick,
    { action: 'click' },
    'atlaskit',
  );

  return <button {...props} onClick={handleClick} />;
};

const App: FC = () => {
  const handleEvent = (analyticsEvent: UIAnalyticsEvent) => {
    const { payload, context } = analyticsEvent;
    console.log('Received event:', { payload, context });
  };

  return (
    <AnalyticsListener channel="atlaskit" onEvent={handleEvent}>
      <Button onClick={() => console.log('onClick callback')}>
        Click me (withAnalyticsEvents)
      </Button>
      <br />
      <FunctionalButton onClick={() => console.log('onClick callback')}>
        Click me (useAnalyticsEvents)
      </FunctionalButton>
      <br />
      <FunctionalButtonWithCallback
        onClick={() => console.log('onClick callback')}
      >
        Click me (useCallbackWithAnalytics)
      </FunctionalButtonWithCallback>
    </AnalyticsListener>
  );
};

export default App;
