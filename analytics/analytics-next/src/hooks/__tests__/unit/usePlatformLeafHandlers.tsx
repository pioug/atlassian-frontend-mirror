import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import {
  default as AnalyticsReactContext,
  AnalyticsReactContextInterface,
} from '@atlaskit/analytics-next-stable-react-context';

import UIAnalyticsEvent from '../../../events/UIAnalyticsEvent';
import { usePlatformLeafEventHandler } from '../../usePlatformLeafEventHandler';
import { usePlatformLeafSyntheticEventHandler } from '../../usePlatformLeafSyntheticEventHandler';

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
  onActivate,
  action,
  componentName,
  actionSubject,
  packageName,
  packageVersion,
  analyticsData,
}: {
  // Synthetic event for usePlatformLeafSyntheticEventHandler
  onActivate: (analyticsEvent: UIAnalyticsEvent) => void;
  // Event for usePlatformLeafEventHandler
  onClick: (
    clickEvent: React.MouseEvent<HTMLButtonElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  action: string;
  componentName: string;
  actionSubject?: string;
  packageName: string;
  packageVersion: string;
  analyticsData?: Record<string, any>;
}) => {
  const handleClick = usePlatformLeafEventHandler({
    fn: onClick,
    action,
    componentName,
    actionSubject,
    packageName,
    packageVersion,
    analyticsData,
  });

  // Simulating a synthetic event of some sort
  const handleButtonActivate = usePlatformLeafSyntheticEventHandler({
    fn: onActivate,
    action,
    componentName,
    packageName,
    packageVersion,
    analyticsData,
  });
  const handleFocus = () => {
    handleButtonActivate();
  };

  return (
    <button data-testid="button" onClick={handleClick} onFocus={handleFocus}>
      Button
    </button>
  );
};

const UnderTest = ({
  context,
  onActivate = () => {},
  onClick = () => {},
  action,
  componentName,
  actionSubject,
  packageName,
  packageVersion,
  analyticsData,
}: {
  context: AnalyticsReactContextInterface;
  onActivate?: (analyticsEvent: UIAnalyticsEvent) => void;
  onClick?: (
    clickEvent: React.MouseEvent<HTMLButtonElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  action: string;
  componentName: string;
  actionSubject?: string;
  packageName: string;
  packageVersion: string;
  analyticsData?: Record<string, any>;
}) => {
  return (
    <FakeContextProvider context={context}>
      <ButtonUsingHook
        onActivate={onActivate}
        onClick={onClick}
        action={action}
        componentName={componentName}
        actionSubject={actionSubject}
        packageName={packageName}
        packageVersion={packageVersion}
        analyticsData={analyticsData}
      />
    </FakeContextProvider>
  );
};

describe('usePlatformLeafEventHandler', () => {
  it('should provide a callback that creates an event and fires on the channel', () => {
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

    const analyticsData = {
      breakfast: 'toast',
    };

    const { getByTestId } = render(
      <UnderTest
        context={context}
        onClick={onClick}
        action="click"
        componentName="button"
        packageName="@atlaskit/button"
        packageVersion="1.1.1"
        analyticsData={analyticsData}
      />,
    );

    fireEvent.click(getByTestId('button'));

    expect(onClick).toBeCalled(); // called with synthetic mouse event

    expect(onEvent).toBeCalledWith(
      [
        { ticket: 'AFP-123' },
        {
          componentName: 'button',
          packageName: '@atlaskit/button',
          packageVersion: '1.1.1',
          breakfast: 'toast',
        },
      ],
      {
        action: 'click',
        actionSubject: 'button',
        attributes: {
          componentName: 'button',
          packageName: '@atlaskit/button',
          packageVersion: '1.1.1',
        },
      },
      'atlaskit',
    );
  });

  it('should provide a callback that creates an event and fires on the channel with actionSubject if it is passed', () => {
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

    const analyticsData = {
      breakfast: 'toast',
    };

    const { getByTestId } = render(
      <UnderTest
        context={context}
        onClick={onClick}
        action="click"
        componentName="button"
        actionSubject="buttonActionSubject"
        packageName="@atlaskit/button"
        packageVersion="1.1.1"
        analyticsData={analyticsData}
      />,
    );

    fireEvent.click(getByTestId('button'));

    expect(onClick).toBeCalled(); // called with synthetic mouse event

    expect(onEvent).toBeCalledWith(
      [
        { ticket: 'AFP-123' },
        {
          componentName: 'button',
          packageName: '@atlaskit/button',
          packageVersion: '1.1.1',
          breakfast: 'toast',
        },
      ],
      {
        action: 'click',
        actionSubject: 'buttonActionSubject',
        attributes: {
          componentName: 'button',
          packageName: '@atlaskit/button',
          packageVersion: '1.1.1',
        },
      },
      'atlaskit',
    );
  });
});

describe('usePlatformLeafSyntheticEventHandler', () => {
  it('should provide a callback that creates a synthetic event and fires on the channel', () => {
    const onEvent = jest.fn();
    const onActivate = jest.fn();

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

    const analyticsData = {
      breakfast: 'toast',
    };

    const { getByTestId } = render(
      <UnderTest
        context={context}
        onActivate={onActivate}
        action="click"
        componentName="button"
        packageName="@atlaskit/button"
        packageVersion="1.1.1"
        analyticsData={analyticsData}
      />,
    );

    fireEvent.focus(getByTestId('button'));

    expect(onActivate).toBeCalled(); // called with synthetic mouse event

    expect(onEvent).toBeCalledWith(
      [
        { ticket: 'AFP-123' },
        {
          componentName: 'button',
          packageName: '@atlaskit/button',
          packageVersion: '1.1.1',
          breakfast: 'toast',
        },
      ],
      {
        action: 'click',
        actionSubject: 'button',
        attributes: {
          componentName: 'button',
          packageName: '@atlaskit/button',
          packageVersion: '1.1.1',
        },
      },
      'atlaskit',
    );
  });
});
