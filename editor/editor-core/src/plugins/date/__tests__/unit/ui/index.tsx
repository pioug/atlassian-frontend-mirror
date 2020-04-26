import React from 'react';
import { ReactWrapper } from 'enzyme';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import DatePicker from '../../../ui/DatePicker';

describe('DatePicker', () => {
  const onTextChanged = jest.fn();
  const onSelect = jest.fn();
  const closeDatePicker = jest.fn();
  const closeDatePickerWithAnalytics = jest.fn();
  const dispatchAnalyticsEvent = jest.fn();
  const element = document.createElement('span');
  let wrapper: ReactWrapper<any, unknown, any>;
  let input: ReactWrapper;

  const mountDatePicker = () => {
    element.setAttribute('timestamp', '1585094400000');
    document.body.appendChild(element);
    return mountWithIntl(
      // This is the actual date picker, not the lozenge
      <DatePicker
        element={element}
        showTextField={true}
        onSelect={onSelect}
        onTextChanged={onTextChanged}
        closeDatePicker={closeDatePicker}
        closeDatePickerWithAnalytics={closeDatePickerWithAnalytics}
        dispatchAnalyticsEvent={dispatchAnalyticsEvent}
      />,
    );
  };

  beforeEach(() => {
    wrapper = mountDatePicker();
    input = wrapper.find('input');
  });

  afterEach(() => {
    document.body.removeChild(element);
    wrapper.unmount();
  });

  describe('analytics', () => {
    it('should fire analytics event when typing into input field', () => {
      input.simulate('keypress', { key: 'Backspace' });
      expect(dispatchAnalyticsEvent).not.toBeCalled();
      input.simulate('keypress', { key: '1' });

      expect(dispatchAnalyticsEvent).toBeCalledWith({
        eventType: 'track',
        action: 'typingStarted',
        actionSubject: 'date',
      });
    });

    it('should fire analytics event when a valid date is inserted', () => {
      input.simulate('change', {
        target: { name: 'input', value: '1/1/2021' },
      });

      expect(dispatchAnalyticsEvent).toBeCalledWith({
        eventType: 'track',
        action: 'typingFinished',
        actionSubject: 'date',
      });
    });

    it('should fire analytics event when incrementing date using up arrow key', () => {
      // assumes date has the format of '3/25/2020' for 25 March 2020 (en-US locale)
      const incrementPayloadProperties = {
        eventType: 'track',
        action: 'incremented',
        actionSubject: 'dateSegment',
      };
      (input.getDOMNode() as HTMLInputElement).selectionStart = 0;
      input.simulate('keydown', { key: 'ArrowUp' });
      expect(dispatchAnalyticsEvent).toBeCalledWith({
        ...incrementPayloadProperties,
        attributes: expect.objectContaining({
          dateSegment: 'month',
        }),
      });
      (input.getDOMNode() as HTMLInputElement).selectionStart = 3;
      input.simulate('keydown', { key: 'ArrowUp' });
      expect(dispatchAnalyticsEvent).toBeCalledWith({
        ...incrementPayloadProperties,
        attributes: expect.objectContaining({
          dateSegment: 'day',
        }),
      });
      (input.getDOMNode() as HTMLInputElement).selectionStart = 7;
      input.simulate('keydown', { key: 'ArrowUp' });
      expect(dispatchAnalyticsEvent).toBeCalledWith({
        ...incrementPayloadProperties,
        attributes: expect.objectContaining({
          dateSegment: 'year',
        }),
      });
    });

    it('should fire analytics event when decrementing date using down arrow key', () => {
      // assumes date has the format of '3/25/2020' for 25 March 2020 (en-US locale)
      const decrementPayloadProperties = {
        eventType: 'track',
        action: 'decremented',
        actionSubject: 'dateSegment',
      };
      (input.getDOMNode() as HTMLInputElement).selectionStart = 0;
      input.simulate('keydown', { key: 'ArrowDown' });
      expect(dispatchAnalyticsEvent).toBeCalledWith({
        ...decrementPayloadProperties,
        attributes: expect.objectContaining({
          dateSegment: 'month',
        }),
      });
      (input.getDOMNode() as HTMLInputElement).selectionStart = 3;
      input.simulate('keydown', { key: 'ArrowDown' });
      expect(dispatchAnalyticsEvent).toBeCalledWith({
        ...decrementPayloadProperties,
        attributes: expect.objectContaining({
          dateSegment: 'day',
        }),
      });
      (input.getDOMNode() as HTMLInputElement).selectionStart = 7;
      input.simulate('keydown', { key: 'ArrowDown' });
      expect(dispatchAnalyticsEvent).toBeCalledWith({
        ...decrementPayloadProperties,
        attributes: expect.objectContaining({
          dateSegment: 'year',
        }),
      });
    });
  });
});
