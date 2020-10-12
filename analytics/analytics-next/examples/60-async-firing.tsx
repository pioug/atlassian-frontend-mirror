import React, { FC, MouseEvent, useCallback, useEffect, useState } from 'react';

import {
  AnalyticsContext,
  AnalyticsListener,
  UIAnalyticsEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '../src';

interface ButtonProps extends WithAnalyticsEventsProps {
  onClick: (
    event: MouseEvent<HTMLButtonElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
}

const Button: FC<ButtonProps> = ({ createAnalyticsEvent, ...props }) => (
  <button {...props} />
);

const AtlaskitButton = withAnalyticsEvents({
  onClick: { action: 'click ' },
})(Button);

interface EverythingProps {
  onClick: (
    event: MouseEvent<HTMLButtonElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
}

const Everything = ({ onClick }: EverythingProps) => {
  const onEvent = ({ context, payload }: UIAnalyticsEvent) => {
    console.log('Received event:', { context, payload });
  };

  useEffect(() => {
    return () => console.log('Unmounting everything...');
  }, []);

  return (
    <AnalyticsListener channel="jira" onEvent={onEvent}>
      <AnalyticsContext data={{ foo: 'bar' }}>
        <AnalyticsContext data={{ abc: 123 }}>
          <AtlaskitButton onClick={onClick}>Click me</AtlaskitButton>
        </AnalyticsContext>
      </AnalyticsContext>
    </AnalyticsListener>
  );
};

const mockReduxEpicDispatch = (analyticsEvent?: UIAnalyticsEvent) => {
  setTimeout(() => {
    const newIdFromTheServer = Math.round(Math.random() * 1000);
    analyticsEvent!.update({ newIdFromTheServer }).fire('jira');
  }, 1000);
};

const App = () => {
  const [hasUnmounted, setMounted] = useState(false);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>, analyticsEvent?: UIAnalyticsEvent) => {
      setMounted(true);
      mockReduxEpicDispatch(analyticsEvent);
    },
    [],
  );

  return (
    <div>
      {hasUnmounted ? (
        <div>Everything has unmounted!</div>
      ) : (
        <Everything onClick={handleClick} />
      )}
    </div>
  );
};

export default App;
