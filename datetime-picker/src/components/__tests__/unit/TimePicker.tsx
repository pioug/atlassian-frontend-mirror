import React from 'react';
import { mount } from 'enzyme';

import { TimePickerWithoutAnalytics as TimePicker } from '../../../components/TimePicker';

describe('TimePicker', () => {
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
});
