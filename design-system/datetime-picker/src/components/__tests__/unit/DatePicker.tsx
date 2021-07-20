import React from 'react';

import { fireEvent, render } from '@testing-library/react';
// eslint-disable-next-line no-restricted-imports
import { format, parseISO } from 'date-fns';
import { mount, shallow } from 'enzyme';

import Select from '@atlaskit/select';

import { DatePickerWithoutAnalytics as DatePicker } from '../../../components/DatePicker';
import { convertTokens } from '../../../components/utils';

describe('DatePicker', () => {
  it('should format the date using the default format', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const { getByTestId } = render(
      <DatePicker value={dateValue} testId="test" />,
    );
    const container = getByTestId('test--container');

    expect(container.innerText).toEqual('6/8/2018');
  });

  it('should manually format the display label', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const { getByTestId } = render(
      <DatePicker
        formatDisplayLabel={() => 'hello world'}
        value={dateValue}
        testId="test"
      />,
    );

    const container = getByTestId('test--container');

    expect(container.innerText).toEqual('hello world');
  });

  it('should manually format the display label using the default dateFormat', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const { getByTestId } = render(
      <DatePicker
        formatDisplayLabel={(date, dateFormat) =>
          format(parseISO(date), convertTokens(dateFormat))
        }
        value={dateValue}
        testId="test"
      />,
    );

    const container = getByTestId('test--container');

    expect(container.innerText).toEqual('2018/06/08');
  });

  it('should manually format the display label using custom dateFormat', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const { getByTestId } = render(
      <DatePicker
        formatDisplayLabel={(date, dateFormat) =>
          format(parseISO(date), convertTokens(dateFormat))
        }
        dateFormat="MMMM/DD"
        value={dateValue}
        testId="test"
      />,
    );

    const container = getByTestId('test--container');

    expect(container.innerText).toEqual('June/08');
  });

  it('should correctly render values in a custom format', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const { getByTestId } = render(
      <DatePicker dateFormat="MMMM/DD" value={dateValue} testId="test" />,
    );

    const container = getByTestId('test--container');

    expect(container.innerText).toEqual('June/08');
  });

  it('should correctly render values in a complex custom format', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const { getByTestId } = render(
      <DatePicker
        dateFormat="DDDo---dddd---YYYY---hh:mm:ss"
        value={dateValue}
        testId="test"
      />,
    );

    const container = getByTestId('test--container');

    expect(container.innerText).toEqual('159th---Friday---2018---12:00:00');
  });

  it('should call onChange when a new date is selected', () => {
    const onChangeSpy = jest.fn();
    const { getByTestId } = render(
      <DatePicker value={'2018-08-06'} onChange={onChangeSpy} testId="test" />,
    );

    fireEvent.click(getByTestId('test--container'));
    fireEvent.click(
      getByTestId('test--calendar--selected-day').nextElementSibling!,
    );

    expect(onChangeSpy).toBeCalledWith('2018-08-07');
  });

  it('should call onChange when a new date is selected with custom format', () => {
    const onChangeSpy = jest.fn();
    const { getByTestId } = render(
      <DatePicker
        value={'2018-08-06'}
        dateFormat="DDDo-dddd-YYYY"
        onChange={onChangeSpy}
        testId="test"
      />,
    );

    fireEvent.click(getByTestId('test--container'));
    fireEvent.click(
      getByTestId('test--calendar--selected-day').nextElementSibling!,
    );

    expect(onChangeSpy).toBeCalledWith('2018-08-07');
  });

  it('should not call onChange when clicking disabled dates', () => {
    const onChangeSpy = jest.fn();
    const { getByTestId, getByText } = render(
      <DatePicker
        value={'2018-08-06'}
        disabled={['2018-08-16']}
        onChange={onChangeSpy}
        testId="test"
      />,
    );

    fireEvent.click(getByTestId('test--container'));
    fireEvent.click(getByText('16'));
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it('onCalendarChange if the iso date is greater than the last day of the month, focus the last day of the month instead', () => {
    const date = '2018-02-31';
    const fallbackDate = '2018-02-28';
    const datePickerWrapper = mount<DatePicker>(<DatePicker />);
    datePickerWrapper.instance().onCalendarChange({ iso: date });
    datePickerWrapper.update();
    expect(datePickerWrapper.instance().state.view).toEqual(fallbackDate);
  });

  it('supplying a custom parseInputValue prop, produces the expected result', () => {
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

  it('focused calendar date is reset on open', () => {
    const value = '1970-01-01';
    const datePickerWrapper = shallow(<DatePicker value={value} />);

    datePickerWrapper.find(Select).simulate('focus');

    expect(datePickerWrapper.state('view')).toEqual(value);

    const nextValue = '1990-02-02';

    datePickerWrapper.setProps({ value: nextValue });
    datePickerWrapper.find(Select).simulate('focus');

    expect(datePickerWrapper.state('view')).toEqual(nextValue);
  });

  it('default parseInputValue parses valid dates to the expected value', () => {
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

  it('pressing the Backspace key to empty the input should clear the value', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const onChangeSpy = jest.fn();
    const testId = 'clear--test';
    const datePickerWrapper = render(
      <DatePicker value={dateValue} onChange={onChangeSpy} testId={testId} />,
    );

    const selectInput = datePickerWrapper.getByDisplayValue('');
    fireEvent.keyDown(selectInput, { key: 'Backspace', keyCode: 8 });

    expect(onChangeSpy).toBeCalledWith('');
  });

  it('pressing the Delete key to empty the input should clear the value', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const onChangeSpy = jest.fn();
    const datePickerWrapper = render(
      <DatePicker value={dateValue} onChange={onChangeSpy} />,
    );

    const selectInput = datePickerWrapper.getByDisplayValue('');
    fireEvent.keyDown(selectInput, { key: 'Delete', keyCode: 46 });

    expect(onChangeSpy).toBeCalledWith('');
  });

  it('pressing the clear button while menu is closed should clear the value and not open the menu', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const onChangeSpy = jest.fn();
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

    expect(onChangeSpy).toBeCalledWith('');
    expect(
      datePickerWrapper.queryByTestId(`${testId}--popper--container`),
    ).toBeNull();
  });

  it('pressing the clear button while menu is open should clear the value and leave the menu open', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const onChangeSpy = jest.fn();
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

    expect(onChangeSpy).toBeCalledWith('');
    expect(
      datePickerWrapper.queryByTestId(`${testId}--popper--container`),
    ).not.toBeNull();
  });
});
