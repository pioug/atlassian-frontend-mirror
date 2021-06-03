import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { FlagProps } from '../../types';
import Flag from '../../flag';
import FlagGroup from '../../flag-group';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

function WithBoth({
  onAtlaskitEvent,
  onPublicEvent,
  flagProps = {},
  onDismissed = () => {},
}: {
  onAtlaskitEvent: jest.Mock;
  onPublicEvent: jest.Mock;
  flagProps?: Partial<FlagProps>;
  onDismissed?: (id: number | string, event: UIAnalyticsEvent) => void;
}) {
  return (
    <AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
      <AnalyticsListener onEvent={onPublicEvent}>
        <FlagGroup onDismissed={onDismissed}>
          <Flag
            testId="flag"
            icon={<div />}
            id="flag"
            title="flag"
            {...flagProps}
          />
        </FlagGroup>
      </AnalyticsListener>
    </AnalyticsListener>
  );
}

describe('Flag analytics', () => {
  [
    { method: 'onFocus', action: 'focused' },
    { method: 'onBlur', action: 'blurred' },
  ].forEach((action) => {
    it(`should fire an event on the public channel and the internal channel when ${action.action}`, () => {
      const onPublicEvent = jest.fn();
      const onAtlaskitEvent = jest.fn();

      const { getByTestId } = render(
        <WithBoth
          onPublicEvent={onPublicEvent}
          onAtlaskitEvent={onAtlaskitEvent}
          flagProps={{
            [action.method]: (
              e: React.FocusEvent,
              analyticsEvent: UIAnalyticsEvent,
            ) => {
              analyticsEvent.fire();
            },
          }}
        />,
      );
      const flag: HTMLElement = getByTestId('flag');
      action.action === 'focused'
        ? fireEvent.focus(flag)
        : fireEvent.blur(flag);
      const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
        payload: {
          action: action.action,
          actionSubject: 'flag',
          attributes: {
            componentName: 'flag',
            packageName,
            packageVersion,
          },
        },
        context: [
          {
            componentName: 'flag',
            packageName,
            packageVersion,
          },
        ],
      });
      function asset(mock: jest.Mock) {
        expect(mock).toHaveBeenCalledTimes(1);
        expect(mock.mock.calls[0][0].payload).toEqual(expected.payload);
        expect(mock.mock.calls[0][0].context).toEqual(expected.context);
      }
      asset(onPublicEvent);
      asset(onAtlaskitEvent);
    });
  });

  it(`should fire an event on the public channel and the internal channel when dismissed from the flag group`, () => {
    const onPublicEvent = jest.fn();
    const onAtlaskitEvent = jest.fn();

    const { getByTestId } = render(
      <WithBoth
        onPublicEvent={onPublicEvent}
        onAtlaskitEvent={onAtlaskitEvent}
        onDismissed={(
          id: number | string,
          analyticsEvent: UIAnalyticsEvent,
        ) => {
          analyticsEvent.fire();
        }}
      />,
    );
    const flagDismiss: HTMLElement = getByTestId('flag-dismiss');
    fireEvent.click(flagDismiss);
    const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
      payload: {
        action: 'dismissed',
        actionSubject: 'flag',
        attributes: {
          componentName: 'flag',
          packageName,
          packageVersion,
        },
      },
      context: [
        {
          componentName: 'flag',
          packageName,
          packageVersion,
        },
      ],
    });
    function asset(mock: jest.Mock) {
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock.mock.calls[0][0].payload).toEqual(expected.payload);
      expect(mock.mock.calls[0][0].context).toEqual(expected.context);
    }
    asset(onPublicEvent);
    asset(onAtlaskitEvent);
  });

  it(`should fire an event on the public channel and the internal channel when dismissed from the flag`, () => {
    const onPublicEvent = jest.fn();
    const onAtlaskitEvent = jest.fn();

    const { getByTestId } = render(
      <WithBoth
        onPublicEvent={onPublicEvent}
        onAtlaskitEvent={onAtlaskitEvent}
        flagProps={{
          onDismissed: (
            id: number | string,
            analyticsEvent: UIAnalyticsEvent,
          ) => {
            analyticsEvent.fire();
          },
        }}
      />,
    );
    const flagDismiss: HTMLElement = getByTestId('flag-dismiss');
    fireEvent.click(flagDismiss);
    const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
      payload: {
        action: 'dismissed',
        actionSubject: 'flag',
        attributes: {
          componentName: 'flag',
          packageName,
          packageVersion,
        },
      },
      context: [
        {
          componentName: 'flag',
          packageName,
          packageVersion,
        },
      ],
    });
    function asset(mock: jest.Mock) {
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock.mock.calls[0][0].payload).toEqual(expected.payload);
      expect(mock.mock.calls[0][0].context).toEqual(expected.context);
    }
    asset(onPublicEvent);
    asset(onAtlaskitEvent);
  });
});

it('should allow the addition of additional context', () => {
  function App({
    onEvent,
    analyticsContext,
  }: {
    onEvent: (...args: any[]) => void;
    analyticsContext?: Record<string, any>;
  }) {
    return (
      <AnalyticsListener onEvent={onEvent} channel={'atlaskit'}>
        <Flag
          testId="flag"
          icon={<div />}
          id="flag"
          title="flag"
          analyticsContext={analyticsContext}
        />
      </AnalyticsListener>
    );
  }

  const onEvent = jest.fn();
  const extraContext = { hello: 'world' };

  const { getByTestId } = render(
    <App onEvent={onEvent} analyticsContext={extraContext} />,
  );

  const flag: HTMLElement = getByTestId('flag');
  fireEvent.focus(flag);

  const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
    payload: {
      action: 'focused',
      actionSubject: 'flag',
      attributes: {
        componentName: 'flag',
        packageName,
        packageVersion,
      },
    },
    context: [
      {
        componentName: 'flag',
        packageName,
        packageVersion,
        ...extraContext,
      },
    ],
  });

  expect(onEvent).toHaveBeenCalledTimes(1);
  expect(onEvent.mock.calls[0][0].payload).toEqual(expected.payload);
  expect(onEvent.mock.calls[0][0].context).toEqual(expected.context);
});

it('should not error if there is no analytics provider', () => {
  const error = jest.spyOn(console, 'error');

  const { getByTestId } = render(
    <Flag
      testId="flag"
      icon={<div />}
      id="flag"
      title="flag"
      onFocus={jest.fn()}
    />,
  );

  const flag: HTMLElement = getByTestId('flag');
  fireEvent.focus(flag);

  expect(error).not.toHaveBeenCalled();
  error.mockRestore();
});
