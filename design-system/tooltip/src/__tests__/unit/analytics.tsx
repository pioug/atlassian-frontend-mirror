import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import Tooltip from '../../Tooltip';

const analyticsAttributes = {
  componentName: 'tooltip',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

jest.useFakeTimers();

function assert(eventMock: jest.Mock<any, any>, expected: UIAnalyticsEvent) {
  expect(eventMock).toHaveBeenCalledTimes(1);
  expect(eventMock.mock.calls[0][0].payload).toEqual(expected.payload);
  expect(eventMock.mock.calls[0][0].context).toEqual(expected.context);
}

it('should fire event on the public channel and the internal channel', () => {
  const onPublicEvent = jest.fn();
  const onAtlaskitEvent = jest.fn();
  function WithBoth() {
    return (
      <AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
        <AnalyticsListener onEvent={onPublicEvent}>
          <Tooltip
            testId="tooltip"
            content="tooltip content"
            onShow={(analyticsEvent: UIAnalyticsEvent) => {
              analyticsEvent.fire();
            }}
            onHide={(analyticsEvent: UIAnalyticsEvent) => {
              analyticsEvent.fire();
            }}
          >
            <div data-testid="trigger">trigger</div>
          </Tooltip>
        </AnalyticsListener>
      </AnalyticsListener>
    );
  }
  const { getByTestId, queryByTestId } = render(<WithBoth />);
  const trigger: HTMLElement = getByTestId('trigger');

  fireEvent.mouseOver(trigger);
  act(() => {
    jest.runAllTimers();
  });

  const expectedShow: UIAnalyticsEvent = new UIAnalyticsEvent({
    payload: {
      action: 'displayed',
      actionSubject: 'tooltip',
      attributes: analyticsAttributes,
    },
    context: [analyticsAttributes],
  });

  expect(queryByTestId('tooltip')).toBeTruthy();
  assert(onPublicEvent, expectedShow);
  assert(onAtlaskitEvent, expectedShow);

  // clearing mocks
  onPublicEvent.mockClear();
  onAtlaskitEvent.mockClear();

  // let's hide the tooltip
  fireEvent.mouseOut(trigger);
  // flush delay
  act(() => {
    jest.runOnlyPendingTimers();
  });
  // flush motion
  act(() => {
    jest.runOnlyPendingTimers();
  });

  const expectedHide: UIAnalyticsEvent = new UIAnalyticsEvent({
    payload: {
      action: 'hidden',
      actionSubject: 'tooltip',
      attributes: analyticsAttributes,
    },
    context: [analyticsAttributes],
  });

  expect(queryByTestId('tooltip')).toBeNull();
  assert(onPublicEvent, expectedHide);
  assert(onAtlaskitEvent, expectedHide);
});
