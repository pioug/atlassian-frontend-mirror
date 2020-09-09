import React from 'react';

import { fireEvent, render } from '@testing-library/react';
// eslint-disable-next-line no-restricted-imports
import { format, parse } from 'date-fns';
import { mount, shallow } from 'enzyme';

import Select from '@atlaskit/select';

import { DatePickerWithoutAnalytics as DatePicker } from '../../../components/DatePicker';

test('DatePicker requires no props to be used', () => {
  const { container } = render(<DatePicker />);

  expect(container.firstChild).toBeInTheDocument();
});

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
  datePickerWrapper.find('input').first().simulate('keyDown', { key: 'Enter' });

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
  datePickerWrapper.find('input').first().simulate('keyDown', { key: 'Enter' });

  expect(onChangeSpy).toBeCalledWith(expectedResult);
});

test('DatePicker pressing the Backspace key to empty the input should clear the value', () => {
  const dateValue = new Date('06/08/2018').toUTCString();
  const onChangeSpy = jest.fn();
  const expectedResult = '';
  const testId = 'clear--test';
  const datePickerWrapper = render(
    <DatePicker value={dateValue} onChange={onChangeSpy} testId={testId} />,
  );

  const selectInput = datePickerWrapper.getByDisplayValue('');
  fireEvent.keyDown(selectInput, { key: 'Backspace', keyCode: 8 });

  expect(onChangeSpy).toBeCalledWith(expectedResult);
});

test('DatePicker pressing the Delete key to empty the input should clear the value', () => {
  const dateValue = new Date('06/08/2018').toUTCString();
  const onChangeSpy = jest.fn();
  const expectedResult = '';
  const datePickerWrapper = render(
    <DatePicker value={dateValue} onChange={onChangeSpy} />,
  );

  const selectInput = datePickerWrapper.getByDisplayValue('');
  fireEvent.keyDown(selectInput, { key: 'Delete', keyCode: 46 });

  expect(onChangeSpy).toBeCalledWith(expectedResult);
});

test('DatePicker pressing the clear button while menu is closed should clear the value and not open the menu', () => {
  const dateValue = new Date('06/08/2018').toUTCString();
  const onChangeSpy = jest.fn();
  const expectedResult = '';
  const testId = 'clear--test';
  const datePickerWrapper = render(
    <DatePicker value={dateValue} onChange={onChangeSpy} testId={testId} />,
  );
  const clearButton = datePickerWrapper.getByLabelText('clear').parentElement;
  if (!clearButton) {
    throw new Error('Expected button to be non-null');
  }

  fireEvent.mouseOver(clearButton);
  fireEvent.mouseMove(clearButton);
  fireEvent.mouseDown(clearButton);

  expect(onChangeSpy).toBeCalledWith(expectedResult);
  expect(
    datePickerWrapper.queryByTestId(`${testId}--popper--container`),
  ).toBeNull();
});

test('DatePicker pressing the clear button while menu is open should clear the value and leave the menu open', () => {
  const dateValue = new Date('06/08/2018').toUTCString();
  const onChangeSpy = jest.fn();
  const expectedResult = '';
  const testId = 'clear--test';
  const datePickerWrapper = render(
    <DatePicker
      value={dateValue}
      onChange={onChangeSpy}
      testId={testId}
      defaultIsOpen
    />,
  );

  const clearButton = datePickerWrapper.getByLabelText('clear').parentElement;
  if (!clearButton) {
    throw new Error('Expected button to be non-null');
  }

  fireEvent.mouseOver(clearButton);
  fireEvent.mouseMove(clearButton);
  fireEvent.mouseDown(clearButton);

  expect(onChangeSpy).toBeCalledWith(expectedResult);
  expect(
    datePickerWrapper.queryByTestId(`${testId}--popper--container`),
  ).not.toBeNull();
});
