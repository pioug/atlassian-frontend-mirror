import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import Textfield from '../../index';

const noop = () => {};
const attributes = {
  componentName: 'textField',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

describe('Textfield analytics', () => {
  [
    { method: 'onFocus', action: 'focused' },
    { method: 'onBlur', action: 'blurred' },
  ].forEach((event) => {
    it(`should fire an event on internal channel when ${event.action}`, async () => {
      const onAtlaskitEvent = jest.fn();
      const { getByTestId } = render(
        <AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
          <div>
            <Textfield testId="test" onBlur={noop} onFocus={noop} />
          </div>
        </AnalyticsListener>,
      );
      const textField = getByTestId('test') as HTMLTextAreaElement;
      const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
        payload: {
          action: event.action,
          actionSubject: 'textField',
          attributes,
        },
      });
      event.action === 'focused'
        ? fireEvent.focus(textField)
        : fireEvent.blur(textField);
      const mock: jest.Mock = onAtlaskitEvent;
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock.mock.calls[0][0].payload).toEqual(expected.payload);
    });
  });
});
