import React from 'react';

import { cleanup, render } from '@testing-library/react';
import { shallow } from 'enzyme';

import DatePicker from '../../../components/DatePicker';
import { DateTimePickerWithoutAnalytics as DateTimePicker } from '../../../components/DateTimePicker';
import TimePicker from '../../../components/TimePicker';

describe('DateTimePicker', () => {
  afterEach(cleanup);
  it('should use custom parseValue when accessing state', () => {
    const onChange = jest.fn();
    const customParseValue = jest.fn().mockImplementation(() => ({
      dateValue: '2018/05/02',
      timeValue: '08:30',
      zoneValue: '+0800',
    }));

    const dateTimePickerWrapper = shallow(
      <DateTimePicker parseValue={customParseValue} onChange={onChange} />,
    );

    dateTimePickerWrapper.find(DatePicker).simulate('change', '2018/05/02');

    expect(onChange).toHaveBeenCalledWith('2018/05/02T08:30+0800');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should not parse the date time value into the specified timezone', () => {
    const dateTimePickerWrapper = shallow<DateTimePicker>(
      <DateTimePicker
        id="datetimepicker-1"
        value="2018-05-02T08:00:00.000+0800"
      />,
    );

    dateTimePickerWrapper.find(DatePicker).simulate('change', '2018-05-02');

    expect(dateTimePickerWrapper.state().zoneValue).not.toEqual('+0800');
  });

  it('should only be fired onChange when a valid date is supplied', () => {
    const onChange = jest.fn();
    const dateTimePickerWrapper = shallow(
      <DateTimePicker onChange={onChange} />,
    );

    dateTimePickerWrapper.find(DatePicker).simulate('change', '2018/05/02');

    expect(onChange).not.toHaveBeenCalled();

    dateTimePickerWrapper.find(TimePicker).simulate('change', '10:45');

    expect(onChange).toHaveBeenCalledWith('2018/05/02T10:45');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should call onChange with the date, time and zone offset in the correct format', () => {
    const dateValue = '2018-05-02';
    const timeValue = '10:45';
    const zoneValue = '+0800';
    const customParseValue = jest
      .fn()
      .mockImplementation((value, date, time, zone) => {
        return {
          dateValue: date,
          timeValue: time,
          zoneValue: date && time ? zoneValue : '',
        };
      });

    const onChange = jest.fn();
    const dateTimePickerWrapper = shallow(
      <DateTimePicker onChange={onChange} parseValue={customParseValue} />,
    );
    dateTimePickerWrapper.find(DatePicker).simulate('change', dateValue);
    dateTimePickerWrapper.find(TimePicker).simulate('change', timeValue);
    expect(onChange).toHaveBeenCalledWith(
      `${dateValue}T${timeValue}${zoneValue}`,
    );
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('fires onChange with empty string when the date is cleared, and there is a datetime value', () => {
    const onChange = jest.fn();
    const dateTimeValue = '2018-05-02T08:00:00.000+0800';

    const dateTimePickerWrapper = shallow(
      <DateTimePicker value={dateTimeValue} onChange={onChange} />,
    );

    dateTimePickerWrapper.find(DatePicker).simulate('change', '');

    expect(onChange).toHaveBeenCalledWith('');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('fires onChange with empty string when the time is cleared, and there is a datetime value', () => {
    const onChange = jest.fn();
    const dateTimeValue = '2018-05-02T08:00:00.000+0800';

    const dateTimePickerWrapper = shallow(
      <DateTimePicker value={dateTimeValue} onChange={onChange} />,
    );

    dateTimePickerWrapper.find(TimePicker).simulate('change', '');

    expect(onChange).toHaveBeenCalledWith('');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('fires onChange with empty string when the date is cleared, and there is a default datetime value', () => {
    const onChange = jest.fn();
    const dateTimeValue = '2018-05-02T08:00:00.000+0800';

    const dateTimePickerWrapper = shallow<DateTimePicker>(
      <DateTimePicker defaultValue={dateTimeValue} onChange={onChange} />,
    );

    dateTimePickerWrapper.find(DatePicker).simulate('change', '');

    expect(onChange).toHaveBeenCalledWith('');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should not fire onChange with empty string when the time is cleared, and there is a default datetime value', () => {
    const onChange = jest.fn();
    const dateTimeValue = '2018-05-02T08:00:00.000+0800';

    const dateTimePickerWrapper = shallow(
      <DateTimePicker defaultValue={dateTimeValue} onChange={onChange} />,
    );

    dateTimePickerWrapper.find(TimePicker).simulate('change', '');

    expect(onChange).toHaveBeenCalledWith('');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should not fire onChange when the date or time is cleared, but there is no datetime value', () => {
    const onChange = jest.fn();

    const dateTimePickerWrapper = shallow(
      <DateTimePicker onChange={onChange} />,
    );

    dateTimePickerWrapper.find(DatePicker).simulate('change', '');
    dateTimePickerWrapper.find(TimePicker).simulate('change', '');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should fire onFocus prop when datepicker is focused', () => {
    const onFocus = jest.fn();
    const dateTimePickerWrapper = shallow(<DateTimePicker onFocus={onFocus} />);

    dateTimePickerWrapper.find(DatePicker).simulate('focus');

    expect(onFocus).toHaveBeenCalled();
  });

  it('should fire onBlur prop when datepicker is blurred', () => {
    const onBlur = jest.fn();
    const dateTimePickerWrapper = shallow(<DateTimePicker onBlur={onBlur} />);

    dateTimePickerWrapper.find(DatePicker).simulate('blur');

    expect(onBlur).toHaveBeenCalled();
  });

  it('should fire onFocus prop when timepicker is focused', () => {
    const onFocus = jest.fn();
    const dateTimePickerWrapper = shallow(<DateTimePicker onFocus={onFocus} />);

    dateTimePickerWrapper.find(TimePicker).simulate('focus');

    expect(onFocus).toHaveBeenCalled();
  });

  it('should fire onBlur prop when timepicker is blurred', () => {
    const onBlur = jest.fn();
    const dateTimePickerWrapper = shallow(<DateTimePicker onBlur={onBlur} />);

    dateTimePickerWrapper.find(TimePicker).simulate('blur');

    expect(onBlur).toHaveBeenCalled();
  });

  it('should fire onClear event when cleared', () => {
    const onChange = jest.fn();
    const dateTimeValue = '2018-05-02T08:00:00.000+0800';
    const testId = 'clear--test';
    const { getByTestId } = render(
      <DateTimePicker
        value={dateTimeValue}
        onChange={onChange}
        testId={testId}
      />,
    );

    const clearButton = getByTestId(`${testId}--icon--container`);
    clearButton.click();
    expect(onChange).toHaveBeenCalledWith('');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('has invalid styles applied in invalid state', () => {
    const onChange = jest.fn();
    const dateTimeValue = '2018-05-02T08:00:00.000+0800';
    const testId = 'clear--test';
    const { getByTestId } = render(
      <DateTimePicker
        value={dateTimeValue}
        onChange={onChange}
        testId={testId}
        isInvalid
      />,
    );

    const element = getByTestId(testId);

    expect(element).toHaveStyleDeclaration('border', '2px solid #DE350B');
    expect(element).toHaveStyleDeclaration('background-color', '#F4F5F7');
  });

  it('has default styles applied in default state', () => {
    const onChange = jest.fn();
    const dateTimeValue = '2018-05-02T08:00:00.000+0800';
    const testId = 'clear--test';
    const { getByTestId } = render(
      <DateTimePicker
        value={dateTimeValue}
        onChange={onChange}
        testId={testId}
      />,
    );

    const element = getByTestId(testId);

    expect(element).toHaveStyleDeclaration('border', '2px solid #F4F5F7');
    expect(element).toHaveStyleDeclaration('background-color', '#F4F5F7');
  });

  it('has disabled styles applied in disabled state', () => {
    const onChange = jest.fn();
    const dateTimeValue = '2018-05-02T08:00:00.000+0800';
    const testId = 'clear--test';
    const { getByTestId } = render(
      <DateTimePicker
        value={dateTimeValue}
        onChange={onChange}
        testId={testId}
        isDisabled
      />,
    );

    const element = getByTestId(testId);

    expect(element).toHaveStyleDeclaration('border', '2px solid #F4F5F7');
    expect(element).toHaveStyleDeclaration('background-color', '#F4F5F7');
  });

  it('has invalid styles applied in disabled,invalid state', () => {
    const onChange = jest.fn();
    const dateTimeValue = '2018-05-02T08:00:00.000+0800';
    const testId = 'clear--test';
    const { getByTestId } = render(
      <DateTimePicker
        value={dateTimeValue}
        onChange={onChange}
        testId={testId}
        isDisabled
        isInvalid
      />,
    );

    const element = getByTestId(testId);

    expect(element).toHaveStyleDeclaration('border', '2px solid #DE350B');
    expect(element).toHaveStyleDeclaration('background-color', '#F4F5F7');
  });
});
