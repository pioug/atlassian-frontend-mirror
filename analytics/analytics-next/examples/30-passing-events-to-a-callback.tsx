import React, { MouseEvent, useCallback } from 'react';

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

const ManualButtonBase = ({
  createAnalyticsEvent,
  onClick,
  ...rest
}: ButtonBaseProps) => {
  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      // Create our analytics event
      const analyticsEvent = createAnalyticsEvent!({
        action: 'click',
      });

      if (onClick) {
        // Pass the event through the corresponding callback prop
        onClick(e, analyticsEvent);
      }
    },
    [onClick, createAnalyticsEvent],
  );

  return <button {...rest} onClick={handleClick} />;
};

const ButtonBase = ({ createAnalyticsEvent, ...rest }: ButtonBaseProps) => {
  return <button {...rest} />;
};

const ManualButton = withAnalyticsEvents()(ManualButtonBase);
const VerboseButton = withAnalyticsEvents({
  onClick: (create) => create({ action: 'click' }),
})(ButtonBase);
const ShorthandButton = withAnalyticsEvents({
  onClick: { action: 'click' },
})(ButtonBase);

const ButtonGroup = () => {
  const onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>, analyticsEvent?: UIAnalyticsEvent) =>
      analyticsEvent && analyticsEvent.fire('atlaskit'),
    [],
  );

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

export default () => {
  const handleEvent = (analyticsEvent: UIAnalyticsEvent) => {
    const { payload, context } = analyticsEvent;
    console.log('Received event:', { payload, context });
  };

  return (
    <AnalyticsListener channel="atlaskit" onEvent={handleEvent}>
      <ButtonGroup />
    </AnalyticsListener>
  );
};
