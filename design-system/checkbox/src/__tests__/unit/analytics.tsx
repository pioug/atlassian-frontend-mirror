import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { Checkbox } from '../../index';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Checkbox analytics', () => {
  it(`should fire an event on the public channel and the internal channel when checkbox is clicked`, () => {
    const onPublicEvent = jest.fn();
    const onAtlaskitEvent = jest.fn();

    const { getByLabelText } = render(
      <AnalyticsListener onEvent={onAtlaskitEvent}>
        <AnalyticsListener onEvent={onPublicEvent}>
          <Checkbox
            onChange={(
              e: React.ChangeEvent,
              analyticsEvent: UIAnalyticsEvent,
            ) => {
              analyticsEvent.fire();
            }}
            name="test"
            value="test"
            label="test"
          />
        </AnalyticsListener>
      </AnalyticsListener>,
    );
    const checkbox: HTMLElement = getByLabelText('test');
    fireEvent.click(checkbox);
    const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
      payload: {
        action: 'changed',
        actionSubject: 'checkbox',
        attributes: {
          componentName: 'checkbox',
          packageName,
          packageVersion,
        },
      },
      context: [
        {
          componentName: 'checkbox',
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

  it('should allow the addition of additional context on checkbox', () => {
    const onEvent = jest.fn();
    const extraContext = { hello: 'world' };

    const { getByLabelText } = render(
      <AnalyticsListener onEvent={onEvent} channel={'atlaskit'}>
        <Checkbox
          name="test"
          value="test"
          label="test"
          analyticsContext={extraContext}
        />
      </AnalyticsListener>,
    );

    const checkbox: HTMLElement = getByLabelText('test');
    fireEvent.click(checkbox);

    const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
      payload: {
        action: 'changed',
        actionSubject: 'checkbox',
        attributes: {
          componentName: 'checkbox',
          packageName,
          packageVersion,
        },
      },
      context: [
        {
          componentName: 'checkbox',
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

  it('should not error if there is no analytics provider on Checkbox', () => {
    const error = jest.spyOn(console, 'error');

    const { getByLabelText } = render(
      <Checkbox name="test" value="test" label="test" />,
    );

    const checkbox: HTMLElement = getByLabelText('test');
    fireEvent.click(checkbox);

    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});
