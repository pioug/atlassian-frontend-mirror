import React, { useCallback, useState } from 'react';

import {
  AnalyticsErrorBoundary,
  AnalyticsListener,
  UIAnalyticsEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '../src';

interface ButtonProps extends WithAnalyticsEventsProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const ButtonBase = ({
  createAnalyticsEvent,
  onClick,
  ...rest
}: ButtonProps) => {
  const [counter, setCounter] = useState(0);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setCounter(counter + 1);

      // Create our analytics event
      const analyticsEvent = createAnalyticsEvent!({
        action: 'click',
      });

      // Fire our analytics event on the 'atlaskit' channel
      analyticsEvent.fire('atlaskit');

      if (onClick) {
        onClick(e);
      }
    },
    [onClick, createAnalyticsEvent, counter],
  );

  return <button {...rest} onClick={handleClick} />;
};

const Button = withAnalyticsEvents()(ButtonBase);

export default () => {
  const handleEvent = (analyticsEvent: UIAnalyticsEvent) => {
    const { payload, context } = analyticsEvent;
    console.log('Received event:', analyticsEvent, { payload, context });
  };

  return (
    <AnalyticsListener channel="atlaskit" onEvent={handleEvent}>
      <AnalyticsErrorBoundary
        channel="atlaskit"
        data={{
          componentName: 'button',
          packageName: '@atlaskit/button/standard-button',
          componentVersion: '999.9.9',
        }}
      >
        <>
          <p>
            This example simulates a JS error in one of the children components
            of `AnalyticsErrorBoundary`. To check that in action, please open
            your DevTools, click in the button and check the console for the
            event track.
          </p>
          <Button>Click me</Button>
        </>
      </AnalyticsErrorBoundary>
    </AnalyticsListener>
  );
};
