import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import {
  default as AnalyticsReactContext,
  AnalyticsReactContextInterface,
} from '@atlaskit/analytics-next-stable-react-context';

import UIAnalyticsEvent from '../../../events/UIAnalyticsEvent';
import { usePlatformLeafEventHandler } from '../../usePlatformLeafEventHandler';

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
  action,
  componentName,
  packageName,
  packageVersion,
  analyticsData,
}: {
  onClick: (
    clickEvent: React.MouseEvent<HTMLButtonElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  action: string;
  componentName: string;
  packageName: string;
  packageVersion: string;
  analyticsData?: Record<string, any>;
}) => {
  const handleClick = usePlatformLeafEventHandler({
    fn: onClick,
    action,
    componentName,
    packageName,
    packageVersion,
    analyticsData,
  });

  return (
    <button data-testid="button" onClick={handleClick}>
      Button
    </button>
  );
};

const UnderTest = ({
  context,
  onClick,
  action,
  componentName,
  packageName,
  packageVersion,
  analyticsData,
}: {
  context: AnalyticsReactContextInterface;
  onClick: (
    clickEvent: React.MouseEvent<HTMLButtonElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  action: string;
  componentName: string;
  packageName: string;
  packageVersion: string;
  analyticsData?: Record<string, any>;
}) => {
  return (
    <FakeContextProvider context={context}>
      <ButtonUsingHook
        onClick={onClick}
        action={action}
        componentName={componentName}
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
});
