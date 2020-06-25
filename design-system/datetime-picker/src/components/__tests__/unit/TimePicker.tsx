import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { mount } from 'enzyme';

import { TimePickerWithoutAnalytics as TimePicker } from '../../../components/TimePicker';

describe('TimePicker', () => {
  test('TimePicker requires no props to be used', () => {
    const { container } = render(<TimePicker />);

    expect(container.firstChild).toBeInTheDocument();
  });

  test('custom parseInputValue - AM', () => {
    const parseInputValue = () => new Date('1970-01-02 01:15:00');
    const onChangeSpy = jest.fn();
    const expectedResult = '01:15';
    const timePickerWrapper = mount<TimePicker>(
      <TimePicker
        timeIsEditable
        onChange={onChangeSpy}
        parseInputValue={parseInputValue}
      />,
    );

    timePickerWrapper.instance().onCreateOption('asdf');

    expect(onChangeSpy).toBeCalledWith(expectedResult);
  });

  test('custom formatDisplayLabel', () => {
    const timeValue = '12:00';
    const expectedResult = 'midday';
    const formatDisplayLabel = (time: string) =>
      time === '12:00' ? 'midday' : time;
    const timePickerWrapper = mount<TimePicker>(
      <TimePicker formatDisplayLabel={formatDisplayLabel} value={timeValue} />,
    );
    const label = timePickerWrapper.text();

    expect(label).toEqual(expectedResult);
  });

  test('default parseInputValue', () => {
    const onChangeSpy = jest.fn();
    const expectedResult = '01:30';
    const timePickerWrapper = mount<TimePicker>(
      <TimePicker timeIsEditable onChange={onChangeSpy} />,
    );

    timePickerWrapper.instance().onCreateOption('01:30');

    expect(onChangeSpy).toBeCalledWith(expectedResult);
  });

  test('default parseInputValue - AM', () => {
    const onChangeSpy = jest.fn();
    const expectedResult = '01:44';
    const timePickerWrapper = mount<TimePicker>(
      <TimePicker timeIsEditable onChange={onChangeSpy} />,
    );

    timePickerWrapper.instance().onCreateOption('1:44am');

    expect(onChangeSpy).toBeCalledWith(expectedResult);
  });

  test('default parseInputValue - PM', () => {
    const onChangeSpy = jest.fn();
    const expectedResult = '15:32';
    const timePickerWrapper = mount<TimePicker>(
      <TimePicker timeIsEditable onChange={onChangeSpy} />,
    );

    timePickerWrapper.instance().onCreateOption('3:32pm');

    expect(onChangeSpy).toBeCalledWith(expectedResult);
  });

  test('TimePicker pressing the Backspace key to empty the input should clear the value', () => {
    const timeValue = '15:32';
    const onChangeSpy = jest.fn();
    const expectedResult = '';
    const timePickerWrapper = render(
      <TimePicker value={timeValue} onChange={onChangeSpy} />,
    );

    const selectInput = timePickerWrapper.getByDisplayValue('');
    fireEvent.keyDown(selectInput, { key: 'Backspace', keyCode: 8 });

    expect(onChangeSpy).toBeCalledWith(expectedResult);
  });

  test('TimePicker pressing the Delete key to empty the input should clear the value', () => {
    const timeValue = '15:32';
    const onChangeSpy = jest.fn();
    const expectedResult = '';
    const timePickerWrapper = render(
      <TimePicker value={timeValue} onChange={onChangeSpy} />,
    );

    const selectInput = timePickerWrapper.getByDisplayValue('');
    fireEvent.keyDown(selectInput, { key: 'Delete', keyCode: 46 });

    expect(onChangeSpy).toBeCalledWith(expectedResult);
  });

  test('TimePicker pressing the clear button while menu is closed should clear the value and not open the menu', () => {
    const timeValue = '15:32';
    const onChangeSpy = jest.fn();
    const expectedResult = '';
    const testId = 'clear-test';
    const timePickerWrapper = render(
      <TimePicker value={timeValue} onChange={onChangeSpy} testId={testId} />,
    );

    const clearButton = timePickerWrapper.getByLabelText('clear').parentElement;
    if (!clearButton) {
      throw new Error('Expected button to be non-null');
    }

    fireEvent.mouseOver(clearButton);
    fireEvent.mouseMove(clearButton);
    fireEvent.mouseDown(clearButton);

    expect(onChangeSpy).toBeCalledWith(expectedResult);
    expect(
      timePickerWrapper.queryByTestId(`${testId}--popper--container`),
    ).toBeNull();
  });

  test('TimePicker pressing the clear button while menu is open should clear the value and leave the menu open', () => {
    const timeValue = '15:32';
    const onChangeSpy = jest.fn();
    const expectedResult = '';
    const testId = 'clear--test';
    const timePickerWrapper = render(
      <TimePicker
        value={timeValue}
        onChange={onChangeSpy}
        testId={testId}
        defaultIsOpen
      />,
    );

    const clearButton = timePickerWrapper.getByLabelText('clear').parentElement;
    if (!clearButton) {
      throw new Error('Expected button to be non-null');
    }

    fireEvent.mouseOver(clearButton);
    fireEvent.mouseMove(clearButton);
    fireEvent.mouseDown(clearButton);

    expect(onChangeSpy).toBeCalledWith(expectedResult);
    expect(
      timePickerWrapper.queryByTestId(`${testId}--popper--container`),
    ).not.toBeNull();
  });
});
