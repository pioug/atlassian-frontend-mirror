import React from 'react';
import { shallow, mount } from 'enzyme';
// eslint-disable-next-line no-restricted-imports
import { parse, format } from 'date-fns';
import Select from '@atlaskit/select';
import { DatePickerWithoutAnalytics as DatePicker } from '../../../components/DatePicker';

test('DatePicker, custom formatDisplayLabel', () => {
  const dateValue = new Date('06/08/2018').toUTCString();
  const formatDisplayLabel = (date: string, dateFormat: string) => {
    const parsed = parse(date);
    return format(parsed, dateFormat);
  };
  const expectedResult = 'June/08';
  const datePickerWrapper = mount<DatePicker>(
    <DatePicker
      formatDisplayLabel={formatDisplayLabel}
      dateFormat="MMMM/DD"
      value={dateValue}
    />,
  );
  const label = datePickerWrapper.text();
  expect(label).toEqual(expectedResult);
});

test('DatePicker, onCalendarChange if the iso date is greater than the last day of the month, focus the last day of the month instead', () => {
  const date = '2018-02-31';
  const fallbackDate = '2018-02-28';
  const datePickerWrapper = mount<DatePicker>(<DatePicker />);
  datePickerWrapper.instance().onCalendarChange({ iso: date });
  datePickerWrapper.update();
  expect(datePickerWrapper.instance().state.view).toEqual(fallbackDate);
});

test('DatePicker, onCalendarChange picks a correct date if it is calculated wrong and comes malformed', () => {
  const date = '2018-5-1';
  const resultDate = '2018-05-01';
  const datePickerWrapper = mount<DatePicker>(<DatePicker value={date} />);
  datePickerWrapper.instance().onCalendarChange({ iso: date });
  datePickerWrapper.update();
  expect(datePickerWrapper.instance().state.view).toEqual(resultDate);
});

test('DatePicker, supplying a custom parseInputValue prop, produces the expected result', () => {
  const parseInputValue = () => new Date('01/01/1970');
  const onChangeSpy = jest.fn();
  const expectedResult = '1970-01-01';
  const datePickerWrapper = mount<DatePicker>(
    <DatePicker
      id="customDatePicker-ParseInputValue"
      onChange={onChangeSpy}
      parseInputValue={parseInputValue}
    />,
  );

  datePickerWrapper
    .instance()
    .onSelectInput({ target: { value: 'asdf' } } as React.ChangeEvent<
      HTMLInputElement
    >);
  datePickerWrapper
    .find('input')
    .first()
    .simulate('keyDown', { key: 'Enter' });

  expect(onChangeSpy).toBeCalledWith(expectedResult);
});

test('DatePicker, focused calendar date is reset on open', () => {
  const value = '1970-01-01';
  const datePickerWrapper = shallow(<DatePicker value={value} />);

  datePickerWrapper.find(Select).simulate('focus');

  expect(datePickerWrapper.state('view')).toEqual(value);

  const nextValue = '1990-02-02';
  datePickerWrapper.setProps({ value: nextValue });

  datePickerWrapper.find(Select).simulate('focus');

  expect(datePickerWrapper.state('view')).toEqual(nextValue);
});

test('DatePicker default parseInputValue parses valid dates to the expected value', () => {
  const onChangeSpy = jest.fn();
  const expectedResult = '2018-01-02';
  const datePickerWrapper = mount<DatePicker>(
    <DatePicker
      id="defaultDatePicker-ParseInputValue"
      onChange={onChangeSpy}
    />,
  );

  datePickerWrapper
    .instance()
    .onSelectInput({ target: { value: '01/02/18' } } as React.ChangeEvent<
      HTMLInputElement
    >);
  datePickerWrapper
    .find('input')
    .first()
    .simulate('keyDown', { key: 'Enter' });

  expect(onChangeSpy).toBeCalledWith(expectedResult);
});

test('DatePicker pressing the Backspace key to empty the input should clear the value', () => {
  const dateValue = new Date('06/08/2018').toUTCString();
  const onChangeSpy = jest.fn();
  const expectedResult = '';
  const datePickerWrapper = mount<DatePicker>(
    <DatePicker value={dateValue} onChange={onChangeSpy} />,
  );

  const target = document.createElement('input');
  target.value = '';
  datePickerWrapper
    .find('input')
    .first()
    .simulate('keyDown', { key: 'Backspace', target });

  expect(onChangeSpy).toBeCalledWith(expectedResult);
});

test('DatePicker pressing the Delete key to empty the input should clear the value', () => {
  const dateValue = new Date('06/08/2018').toUTCString();
  const onChangeSpy = jest.fn();
  const expectedResult = '';
  const datePickerWrapper = mount<DatePicker>(
    <DatePicker value={dateValue} onChange={onChangeSpy} />,
  );

  const target = document.createElement('input');
  target.value = '';
  datePickerWrapper
    .find('input')
    .first()
    .simulate('keyDown', { key: 'Delete', target });

  expect(onChangeSpy).toBeCalledWith(expectedResult);
});
