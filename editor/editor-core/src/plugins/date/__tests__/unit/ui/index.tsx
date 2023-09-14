import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import DatePicker from '../../../ui/DatePicker';
import type { WeekDay } from '@atlaskit/calendar/types';

const onTextChanged = jest.fn();
const onDelete = jest.fn();
const onSelect = jest.fn();
const closeDatePicker = jest.fn();
const closeDatePickerWithAnalytics = jest.fn();
const dispatchAnalyticsEvent = jest.fn();

describe('DatePicker', () => {
  const element = document.createElement('span');
  let wrapper: RenderResult;
  let input: HTMLElement;

  const mountDatePicker = () => {
    element.setAttribute('timestamp', '1585094400000');
    document.body.appendChild(element);
    return renderWithIntl(
      // This is the actual date picker, not the lozenge
      <DatePicker
        isNew={true}
        element={element}
        onSelect={onSelect}
        onTextChanged={onTextChanged}
        onDelete={onDelete}
        closeDatePicker={closeDatePicker}
        closeDatePickerWithAnalytics={closeDatePickerWithAnalytics}
        dispatchAnalyticsEvent={dispatchAnalyticsEvent}
      />,
    );
  };

  beforeEach(() => {
    wrapper = mountDatePicker();
    input = wrapper.getByRole('textbox');
  });

  afterEach(() => {
    document.body.removeChild(element);
    wrapper.unmount();
  });

  describe('analytics', () => {
    it('should fire analytics event when typing into input field', () => {
      fireEvent.keyPress(input, {
        key: 'Backspace',
        charCode: 8,
      });

      expect(dispatchAnalyticsEvent).not.toBeCalled();
      fireEvent.keyPress(input, { key: '1', code: '1', keyCode: 49 });

      fireEvent.keyPress(input, {
        key: '1',
        charCode: 58,
      });

      expect(dispatchAnalyticsEvent).toBeCalledWith({
        eventType: 'track',
        action: 'typingStarted',
        actionSubject: 'date',
      });
    });

    it('should fire analytics event when a valid date is inserted', () => {
      fireEvent.change(input, { target: { value: '1/1/2021' } });

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
      (input as HTMLInputElement).selectionStart = 0;
      fireEvent.keyDown(input, {
        key: 'ArrowUp',
      });
      expect(dispatchAnalyticsEvent).toBeCalledWith({
        ...incrementPayloadProperties,
        attributes: expect.objectContaining({
          dateSegment: 'month',
        }),
      });
      (input as HTMLInputElement).selectionStart = 3;
      fireEvent.keyDown(input, {
        key: 'ArrowUp',
      });
      expect(dispatchAnalyticsEvent).toBeCalledWith({
        ...incrementPayloadProperties,
        attributes: expect.objectContaining({
          dateSegment: 'day',
        }),
      });
      (input as HTMLInputElement).selectionStart = 7;
      fireEvent.keyDown(input, {
        key: 'ArrowUp',
      });
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
      (input as HTMLInputElement).selectionStart = 0;
      fireEvent.keyDown(input, {
        key: 'ArrowDown',
      });
      expect(dispatchAnalyticsEvent).toBeCalledWith({
        ...decrementPayloadProperties,
        attributes: expect.objectContaining({
          dateSegment: 'month',
        }),
      });
      (input as HTMLInputElement).selectionStart = 3;
      fireEvent.keyDown(input, {
        key: 'ArrowDown',
      });
      expect(dispatchAnalyticsEvent).toBeCalledWith({
        ...decrementPayloadProperties,
        attributes: expect.objectContaining({
          dateSegment: 'day',
        }),
      });
      (input as HTMLInputElement).selectionStart = 7;
      fireEvent.keyDown(input, {
        key: 'ArrowDown',
      });
      expect(dispatchAnalyticsEvent).toBeCalledWith({
        ...decrementPayloadProperties,
        attributes: expect.objectContaining({
          dateSegment: 'year',
        }),
      });
    });
  });

  describe('callbacks', () => {
    it('should fire props.onSelect callback when Enter is pressed in the input field', () => {
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      expect(onSelect).toHaveBeenCalled();
      expect(onDelete).toHaveBeenCalledTimes(0);
    });
    it('should fire onDelete when Enter pressed in empty input field', () => {
      // Set the text field to be empty
      fireEvent.change(input, { target: { value: '' } });

      // Press enter
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

      // Date is removed
      expect(onDelete).toHaveBeenCalled();
    });
  });
});

describe('DatePicker with weekStartDay', () => {
  const element = document.createElement('span');
  let wrapper: RenderResult;

  // This testId is provided to the consumed calendar within the component
  const testId = 'datepicker';

  const mountDatePicker = (weekStartDay?: WeekDay) => {
    element.setAttribute('timestamp', '1585094400000');
    document.body.appendChild(element);
    return renderWithIntl(
      // This is the actual date picker, not the lozenge
      <DatePicker
        isNew={true}
        element={element}
        onSelect={onSelect}
        onTextChanged={onTextChanged}
        onDelete={onDelete}
        closeDatePicker={closeDatePicker}
        closeDatePickerWithAnalytics={closeDatePickerWithAnalytics}
        dispatchAnalyticsEvent={dispatchAnalyticsEvent}
        weekStartDay={weekStartDay}
      />,
    );
  };

  afterEach(() => {
    document.body.removeChild(element);
    wrapper.unmount();
  });

  describe('weekStartDay', () => {
    it('should have Friday as the first day in the calendar if weekStartDay is 5', () => {
      wrapper = mountDatePicker(5);
      const result = wrapper.getAllByTestId(`${testId}--column-headers`)?.[0];
      expect(result).toHaveTextContent('Fri');
    });

    it('should have Monday as the first day in the calendar if weekStartDay is 1', () => {
      wrapper = mountDatePicker(1);
      const result = wrapper.getAllByTestId(`${testId}--column-headers`)?.[0];
      expect(result).toHaveTextContent('Mon');
    });

    it('should have Sunday as the first day in the calendar when weekStartDay is not provided', () => {
      wrapper = mountDatePicker();
      const result = wrapper.getAllByTestId(`${testId}--column-headers`)?.[0];
      expect(result).toHaveTextContent('Sun');
    });
  });
});
