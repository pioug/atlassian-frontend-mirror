import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import {
  default as AnalyticsReactContext,
  AnalyticsReactContextInterface,
} from '@atlaskit/analytics-next-stable-react-context';

import UIAnalyticsEvent from '../../../events/UIAnalyticsEvent';
import { useCallbackWithAnalytics } from '../../useCallbackWithAnalytics';

const FakeContextProvider = ({
  children,
  context,
}: {
  children: React.ReactNode;
  context: AnalyticsReactContextInterface;
}) => {
  return (
    <AnalyticsReactContext.Provider value={context}>
      {children}
    </AnalyticsReactContext.Provider>
  );
};

const ButtonUsingHook = ({
  onClick,
  payload,
  channel,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  payload: Record<string, any> | (() => Record<string, any>);
  channel: string;
}) => {
  const handleClick = useCallbackWithAnalytics(onClick, payload, channel);
  return (
    <button data-testid="button" onClick={handleClick}>
      Button
    </button>
  );
};

const UnderTest = ({
  context,
  onClick,
  payload,
  channel,
}: {
  context: AnalyticsReactContextInterface;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  payload: Record<string, any> | (() => Record<string, any>);
  channel: string;
}) => {
  return (
    <FakeContextProvider context={context}>
      <ButtonUsingHook channel={channel} payload={payload} onClick={onClick} />
    </FakeContextProvider>
  );
};

describe('useCallbackWithAnalytics', () => {
  it('should provide a callback that creates an event and fires on the channel - when using object payload', () => {
    const onEvent = jest.fn();
    const onClick = jest.fn();

    const eventHandler = (
      analyticsEvent: UIAnalyticsEvent,
      channel?: string,
    ) => {
      onEvent(analyticsEvent.context, analyticsEvent.payload, channel);
    };

    const context: AnalyticsReactContextInterface = {
      getAtlaskitAnalyticsContext: () => [{ ticket: 'AFP-123' }],
      getAtlaskitAnalyticsEventHandlers: () => [eventHandler],
    };

    const payload = {
      action: 'clicked',
    };

    const { getByTestId } = render(
      <UnderTest
        context={context}
        onClick={onClick}
        payload={payload}
        channel="atlaskit"
      />,
    );

    fireEvent.click(getByTestId('button'));

    expect(onClick).toBeCalled(); // called with synthetic mouse event

    expect(onEvent).toBeCalledWith(
      [{ ticket: 'AFP-123' }],
      { action: 'clicked' },
      'atlaskit',
    );
  });

  it('should provide a callback that creates an event and fires on the channel - when using function payload', () => {
    const onEvent = jest.fn();
    const onClick = jest.fn();

    const eventHandler = (
      analyticsEvent: UIAnalyticsEvent,
      channel?: string,
    ) => {
      onEvent(analyticsEvent.context, analyticsEvent.payload, channel);
    };

    const context: AnalyticsReactContextInterface = {
      getAtlaskitAnalyticsContext: () => [{ ticket: 'AFP-123' }],
      getAtlaskitAnalyticsEventHandlers: () => [eventHandler],
    };

    const payload = () => ({
      action: 'clicked',
    });

    const { getByTestId } = render(
      <UnderTest
        context={context}
        onClick={onClick}
        payload={payload}
        channel="atlaskit"
      />,
    );

    fireEvent.click(getByTestId('button'));

    expect(onClick).toBeCalled(); // called with synthetic mouse event

    expect(onEvent).toBeCalledWith(
      [{ ticket: 'AFP-123' }],
      { action: 'clicked' },
      'atlaskit',
    );
  });
});
