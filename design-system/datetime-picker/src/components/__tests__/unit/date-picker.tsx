import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line no-restricted-imports
import { format, parseISO } from 'date-fns';

import { DatePickerWithoutAnalytics as DatePicker } from '../../date-picker';
import { convertTokens } from '../../utils';

describe('DatePicker', () => {
  it('should call onChange only once when a date is selected and enter is pressed', () => {
    const onChangeSpy = jest.fn();
    render(<DatePicker onChange={onChangeSpy} testId="test" />);

    const input = screen.getByTestId('test--input');
    fireEvent.input(input, {
      target: {
        value: '06/08/2018',
      },
    });
    expect(onChangeSpy).not.toBeCalled();

    fireEvent.keyDown(input, {
      key: 'Enter',
    });
    expect(onChangeSpy).toBeCalledWith('2018-06-08');

    fireEvent.keyDown(input, {
      key: 'Enter',
    });
    // don't trigger when its closed
    expect(onChangeSpy).toBeCalledTimes(1);
  });

  it('should format the date using the default format', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    render(<DatePicker value={dateValue} testId="test" />);

    const container = screen.getByTestId('test--container');
    expect(container).toHaveTextContent('6/8/2018');
  });

  it('should manually format the display label', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    render(
      <DatePicker
        formatDisplayLabel={() => 'hello world'}
        value={dateValue}
        testId="test"
      />,
    );

    const container = screen.getByTestId('test--container');

    expect(container).toHaveTextContent('hello world');
  });

  it('should manually format the display label using the default dateFormat', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    render(
      <DatePicker
        formatDisplayLabel={(date, dateFormat) =>
          format(parseISO(date), convertTokens(dateFormat))
        }
        value={dateValue}
        testId="test"
      />,
    );

    const container = screen.getByTestId('test--container');

    expect(container).toHaveTextContent('2018/06/08');
  });

  it('should manually format the display label using custom dateFormat', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    render(
      <DatePicker
        formatDisplayLabel={(date, dateFormat) =>
          format(parseISO(date), convertTokens(dateFormat))
        }
        dateFormat="MMMM/DD"
        value={dateValue}
        testId="test"
      />,
    );

    const container = screen.getByTestId('test--container');

    expect(container).toHaveTextContent('June/08');
  });

  it('should correctly render values in a custom format', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    render(<DatePicker dateFormat="MMMM/DD" value={dateValue} testId="test" />);

    const container = screen.getByTestId('test--container');

    expect(container).toHaveTextContent('June/08');
  });

  it('should correctly render values in a complex custom format', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    render(
      <DatePicker
        dateFormat="DDDo---dddd---YYYY---hh:mm:ss"
        value={dateValue}
        testId="test"
      />,
    );

    const container = screen.getByTestId('test--container');

    expect(container).toHaveTextContent('159th---Friday---2018---12:00:00');
  });

  it('should call onChange when a new date is selected', () => {
    const onChangeSpy = jest.fn();
    render(
      <DatePicker value={'2018-08-06'} onChange={onChangeSpy} testId="test" />,
    );
    fireEvent.click(screen.getByTestId('test--container'));

    const days = screen.getAllByRole('gridcell');
    const selectedDay = screen.getByTestId('test--calendar--selected-day');
    const selectedIndex = days.findIndex((day) => day === selectedDay);
    const nextDay = days[selectedIndex + 1];

    fireEvent.click(nextDay);

    expect(onChangeSpy).toBeCalledWith('2018-08-07');
  });

  it('should call onChange when a new date is selected with custom format', () => {
    const onChangeSpy = jest.fn();
    render(
      <DatePicker
        value={'2018-08-06'}
        dateFormat="DDDo-dddd-YYYY"
        onChange={onChangeSpy}
        testId="test"
      />,
    );

    fireEvent.click(screen.getByTestId('test--container'));
    const days = screen.getAllByRole('gridcell');
    const selectedDay = screen.getByTestId('test--calendar--selected-day');
    const selectedIndex = days.findIndex((day) => day === selectedDay);
    const nextDay = days[selectedIndex + 1];

    fireEvent.click(nextDay);

    expect(onChangeSpy).toBeCalledWith('2018-08-07');
  });

  it('should not call onChange when clicking disabled dates', () => {
    const onChangeSpy = jest.fn();
    render(
      <DatePicker
        value={'2018-08-06'}
        disabled={['2018-08-16']}
        onChange={onChangeSpy}
        testId="test"
      />,
    );

    fireEvent.click(screen.getByTestId('test--container'));
    fireEvent.click(screen.getByText('16'));
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it('supplying a custom parseInputValue prop, produces the expected result', () => {
    const parseInputValue = () => new Date('01/01/1970');
    const onChangeSpy = jest.fn();
    const expectedResult = '1970-01-01';
    render(
      <DatePicker
        id="customDatePicker-ParseInputValue"
        onChange={onChangeSpy}
        parseInputValue={parseInputValue}
        testId="test"
      />,
    );

    const input = screen.getByTestId('test--input');
    fireEvent.input(input, {
      target: {
        value: 'asdf', // our custom parseInputValue ignores this
      },
    });

    fireEvent.keyDown(input, {
      key: 'Enter',
    });

    expect(onChangeSpy).toBeCalledWith(expectedResult);
  });

  it('focused calendar date is reset on open', () => {
    const { rerender } = render(
      <DatePicker value="1970-01-01" testId="test" />,
    );
    fireEvent.click(screen.getByTestId('test--container'));

    const calendarGrid = screen.getByRole('grid', {
      name: 'calendar',
    });
    expect(calendarGrid).toHaveAccessibleDescription(
      expect.stringContaining('Jan 01 1970'),
    );

    rerender(<DatePicker value="1990-02-02" testId="test" />);
    // date doesn't update without focus
    expect(calendarGrid).toHaveAccessibleDescription(
      expect.stringContaining('Jan 01 1970'),
    );

    const select = screen.getByRole('combobox');
    fireEvent.focus(select);
    // date update after focus
    expect(calendarGrid).toHaveAccessibleDescription(
      expect.stringContaining('Feb 02 1990'),
    );
  });

  it('default parseInputValue parses valid dates to the expected value', () => {
    const onChangeSpy = jest.fn();
    const expectedResult = '2018-01-02';
    render(
      <DatePicker
        id="defaultDatePicker-ParseInputValue"
        onChange={onChangeSpy}
        testId="test"
      />,
    );

    const input = screen.getByTestId('test--input');
    fireEvent.input(input, {
      target: {
        value: '01/02/18',
      },
    });
    expect(onChangeSpy).not.toBeCalled();

    fireEvent.keyDown(input, {
      key: 'Enter',
    });

    expect(onChangeSpy).toBeCalledWith(expectedResult);
  });

  it("should use today's date if year over 9999 is given", () => {
    const onChangeSpy = jest.fn();
    const today = format(new Date(), 'yyyy-MM-dd');

    render(
      <DatePicker
        id="defaultDatePicker-ParseInputValue"
        onChange={onChangeSpy}
        testId="test"
      />,
    );

    const input = screen.getByTestId('test--input');
    fireEvent.input(input, {
      target: {
        value: '01/01/10000',
      },
    });
    expect(onChangeSpy).not.toBeCalled();

    fireEvent.keyDown(input, {
      key: 'Enter',
    });

    expect(onChangeSpy).toBeCalledWith(today);
  });

  it('pressing the Backspace key to empty the input should clear the value', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const onChangeSpy = jest.fn();
    const testId = 'clear--test';
    render(
      <DatePicker value={dateValue} onChange={onChangeSpy} testId={testId} />,
    );

    const selectInput = screen.getByDisplayValue('');
    fireEvent.keyDown(selectInput, { key: 'Backspace', keyCode: 8 });

    expect(onChangeSpy).toBeCalledWith('');
  });

  it('pressing the Delete key to empty the input should clear the value', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const onChangeSpy = jest.fn();
    render(<DatePicker value={dateValue} onChange={onChangeSpy} />);

    const selectInput = screen.getByDisplayValue('');
    fireEvent.keyDown(selectInput, { key: 'Delete', keyCode: 46 });

    expect(onChangeSpy).toBeCalledWith('');
  });

  it('pressing the clear button while menu is closed should clear the value and not open the menu', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const onChangeSpy = jest.fn();
    const testId = 'clear--test';
    render(
      <DatePicker value={dateValue} onChange={onChangeSpy} testId={testId} />,
    );
    const clearButton = screen.getByLabelText('clear').parentElement;
    if (!clearButton) {
      throw new Error('Expected button to be non-null');
    }

    fireEvent.mouseOver(clearButton);
    fireEvent.mouseMove(clearButton);
    fireEvent.mouseDown(clearButton);

    expect(onChangeSpy).toBeCalledWith('');
    expect(screen.queryByTestId(`${testId}--popper--container`)).toBeNull();
  });

  it('pressing the clear button while menu is open should clear the value and leave the menu open', () => {
    const dateValue = new Date('06/08/2018').toISOString();
    const onChangeSpy = jest.fn();
    const testId = 'clear--test';
    render(
      <DatePicker
        value={dateValue}
        onChange={onChangeSpy}
        testId={testId}
        defaultIsOpen
      />,
    );

    const clearButton = screen.getByLabelText('clear').parentElement;
    if (!clearButton) {
      throw new Error('Expected button to be non-null');
    }

    fireEvent.mouseOver(clearButton);
    fireEvent.mouseMove(clearButton);
    fireEvent.mouseDown(clearButton);

    expect(onChangeSpy).toBeCalledWith('');
    expect(screen.queryByTestId(`${testId}--popper--container`)).not.toBeNull();
  });
});
