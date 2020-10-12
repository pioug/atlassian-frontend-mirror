import React, { FC, MouseEvent, useCallback } from 'react';

import {
  AnalyticsListener,
  UIAnalyticsEvent,
  useAnalyticsEvents,
  useCallbackWithAnalytics,
  usePlatformLeafEventHandler,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '../src';

interface Props extends WithAnalyticsEventsProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const ButtonBase = ({ createAnalyticsEvent, onClick, ...rest }: Props) => {
  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
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
    [onClick, createAnalyticsEvent],
  );

  return <button {...rest} onClick={handleClick} />;
};

const Button = withAnalyticsEvents()(ButtonBase);

const ButtonUsingHook: FC<Props> = ({ onClick, ...props }) => {
  // Decompose function from the hook
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      // Create our analytics event
      const analyticsEvent = createAnalyticsEvent({ action: 'click' });

      // Fire our analytics event
      analyticsEvent.fire('atlaskit');

      if (onClick) {
        onClick(e);
      }
    },
    [onClick, createAnalyticsEvent],
  );

  return <button {...props} onClick={handleClick} />;
};

const ButtonUsingCallback: FC<Props> = ({ onClick, ...props }) => {
  const handleClick = useCallbackWithAnalytics(
    onClick,
    { action: 'click' },
    'atlaskit',
  );

  return <button {...props} onClick={handleClick} />;
};

const ButtonUsingEventHandlerHook = ({
  onClick,
  children,
}: {
  onClick: (
    mouseEvent: React.MouseEvent<HTMLButtonElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  children: React.ReactNode;
}) => {
  const handleClick = usePlatformLeafEventHandler({
    fn: onClick,
    action: 'clicked',
    componentName: 'fancy-button',
    packageName: '@atlaskit/fancy-button',
    packageVersion: '0.1.0',
  });

  return <button onClick={handleClick}>{children}</button>;
};

const App: FC = () => {
  const handleEvent = (analyticsEvent: UIAnalyticsEvent) => {
    const { payload, context } = analyticsEvent;
    console.log('Received event:', { payload, context });
  };

  const onClickHandler = () => console.log('onClickCallback');

  return (
    <AnalyticsListener channel="atlaskit" onEvent={handleEvent}>
      <Button onClick={onClickHandler}>Click me (withAnalyticsEvents)</Button>
      <br />
      <ButtonUsingHook onClick={onClickHandler}>
        Click me (useAnalyticsEvents)
      </ButtonUsingHook>
      <br />
      <ButtonUsingCallback onClick={onClickHandler}>
        Click me (useCallbackWithAnalytics)
      </ButtonUsingCallback>
      <br />
      <ButtonUsingEventHandlerHook onClick={onClickHandler}>
        Click me (usePlatformLeafEventHandler)
      </ButtonUsingEventHandlerHook>
    </AnalyticsListener>
  );
};

export default App;
