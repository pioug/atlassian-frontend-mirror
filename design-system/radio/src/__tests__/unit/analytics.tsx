/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { Radio, RadioGroup } from '../../index';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Radio analytics', () => {
  it(`should fire an event on the public channel and the internal channel when radio is clicked`, () => {
    const onPublicEvent = jest.fn();
    const onAtlaskitEvent = jest.fn();

    const { getByLabelText } = render(
      <AnalyticsListener onEvent={onAtlaskitEvent}>
        <AnalyticsListener onEvent={onPublicEvent}>
          <Radio
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
    const radio: HTMLElement = getByLabelText('test');
    fireEvent.click(radio);
    const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
      payload: {
        action: 'changed',
        actionSubject: 'radio',
        attributes: {
          componentName: 'radio',
          packageName,
          packageVersion,
        },
      },
      context: [
        {
          componentName: 'radio',
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

  it(`should fire an event on the public channel and the internal channel when radio in a radio group is clicked`, () => {
    const onPublicEvent = jest.fn();
    const onAtlaskitEvent = jest.fn();

    const { getByLabelText } = render(
      <AnalyticsListener onEvent={onAtlaskitEvent}>
        <AnalyticsListener onEvent={onPublicEvent}>
          <RadioGroup
            options={[
              { name: 'color', value: 'red', label: 'Red' },
              { name: 'color', value: 'blue', label: 'Blue' },
              { name: 'color', value: 'yellow', label: 'Yellow' },
            ]}
            onChange={(
              e: React.ChangeEvent,
              analyticsEvent: UIAnalyticsEvent,
            ) => {
              analyticsEvent.fire();
            }}
          />
        </AnalyticsListener>
      </AnalyticsListener>,
    );
    const redRadio: HTMLElement = getByLabelText('Red');
    fireEvent.click(redRadio);
    const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
      payload: {
        action: 'changed',
        actionSubject: 'radio',
        attributes: {
          componentName: 'radio',
          packageName,
          packageVersion,
        },
      },
      context: [
        {
          componentName: 'radio',
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

  it('should allow the addition of additional context on radio', () => {
    const onEvent = jest.fn();
    const extraContext = { hello: 'world' };

    const { getByLabelText } = render(
      <AnalyticsListener onEvent={onEvent} channel={'atlaskit'}>
        <Radio
          name="test"
          value="test"
          label="test"
          analyticsContext={extraContext}
        />
      </AnalyticsListener>,
    );

    const radio: HTMLElement = getByLabelText('test');
    fireEvent.click(radio);

    const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
      payload: {
        action: 'changed',
        actionSubject: 'radio',
        attributes: {
          componentName: 'radio',
          packageName,
          packageVersion,
        },
      },
      context: [
        {
          componentName: 'radio',
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

  it('should allow the addition of additional context on radio group', () => {
    const onEvent = jest.fn();
    const extraContext = { hello: 'world' };

    const { getByLabelText } = render(
      <AnalyticsListener onEvent={onEvent} channel={'atlaskit'}>
        <RadioGroup
          options={[
            { name: 'color', value: 'red', label: 'Red' },
            { name: 'color', value: 'blue', label: 'Blue' },
            { name: 'color', value: 'yellow', label: 'Yellow' },
          ]}
          analyticsContext={extraContext}
        />
      </AnalyticsListener>,
    );

    const redRadio: HTMLElement = getByLabelText('Red');
    fireEvent.click(redRadio);

    const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
      payload: {
        action: 'changed',
        actionSubject: 'radio',
        attributes: {
          componentName: 'radio',
          packageName,
          packageVersion,
        },
      },
      context: [
        {
          componentName: 'radio',
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

  it('should not error if there is no analytics provider on radio', () => {
    const error = jest.spyOn(console, 'error');

    const { getByLabelText } = render(
      <Radio name="test" value="test" label="test" />,
    );

    const radio: HTMLElement = getByLabelText('test');
    fireEvent.click(radio);

    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('should not error if there is no analytics provider on radio group', () => {
    const error = jest.spyOn(console, 'error');

    const { getByLabelText } = render(
      <RadioGroup
        options={[
          { name: 'color', value: 'red', label: 'Red' },
          { name: 'color', value: 'blue', label: 'Blue' },
          { name: 'color', value: 'yellow', label: 'Yellow' },
        ]}
      />,
    );

    const redRadio: HTMLElement = getByLabelText('Red');
    fireEvent.click(redRadio);

    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});
