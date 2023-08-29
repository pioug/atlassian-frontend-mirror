import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { format, parseISO } from 'date-fns';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { DatePickerWithoutAnalytics as DatePicker } from '../../date-picker';
import { convertTokens } from '../../utils';

describe('DatePicker', () => {
  describe('should call onChange only once when a date is selected and enter is pressed', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
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
      },
    );
  });

  describe('should format the date using the default format', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
        const dateValue = new Date('06/08/2018').toISOString();
        render(<DatePicker value={dateValue} testId="test" />);

        const input = screen.getByRole('combobox');
        expect(input?.getAttribute('value')).toBe('6/8/2018');
      },
      () => {
        const dateValue = new Date('06/08/2018').toISOString();
        render(<DatePicker value={dateValue} testId="test" />);

        const container = screen.getByTestId('test--container');
        expect(container).toHaveTextContent('6/8/2018');
      },
    );
  });

  describe('should manually format the display label', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
        const dateValue = new Date('06/08/2018').toISOString();
        render(
          <DatePicker
            formatDisplayLabel={() => 'hello world'}
            value={dateValue}
            testId="test"
          />,
        );

        const input = screen.getByRole('combobox');

        expect(input?.getAttribute('value')).toBe('hello world');
      },
      () => {
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
      },
    );
  });

  describe('should manually format the display label using the default dateFormat', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
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

        const input = screen.getByRole('combobox');

        expect(input?.getAttribute('value')).toBe('2018/06/08');
      },
      () => {
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
      },
    );
  });

  describe('should manually format the display label using custom dateFormat', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
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

        const input = screen.getByRole('combobox');

        expect(input?.getAttribute('value')).toBe('June/08');
      },
      () => {
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
      },
    );
  });

  describe('should correctly render values in a custom format', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
        const dateValue = new Date('06/08/2018').toISOString();
        render(
          <DatePicker dateFormat="MMMM/DD" value={dateValue} testId="test" />,
        );

        const input = screen.getByRole('combobox');

        expect(input?.getAttribute('value')).toBe('June/08');
      },
      () => {
        const dateValue = new Date('06/08/2018').toISOString();
        render(
          <DatePicker dateFormat="MMMM/DD" value={dateValue} testId="test" />,
        );

        const container = screen.getByTestId('test--container');

        expect(container).toHaveTextContent('June/08');
      },
    );
  });

  describe('should correctly render values in a complex custom format', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
        const dateValue = new Date('06/08/2018').toISOString();
        render(
          <DatePicker
            dateFormat="DDDo---dddd---YYYY---hh:mm:ss"
            value={dateValue}
            testId="test"
          />,
        );

        const input = screen.getByRole('combobox');

        expect(input?.getAttribute('value')).toBe(
          '159th---Friday---2018---12:00:00',
        );
      },
      () => {
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
      },
    );
  });

  it('should apply `lang` attribute to inner input field', () => {
    const formattedDate = new Date('06/08/2018');
    const dateValue = formattedDate.toISOString();
    const lang = 'en-US';

    const { getByText } = render(
      <DatePicker locale={lang} value={dateValue} testId="test" />,
    );

    const value = getByText(
      `${
        formattedDate.getMonth() + 1
      }/${formattedDate.getDate()}/${formattedDate.getFullYear()}`,
    );

    expect(value).toHaveAttribute('lang', expect.stringContaining(lang));
  });

  describe('should call onChange when a new date is selected', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
        const onChangeSpy = jest.fn();
        render(
          <DatePicker
            value={'2018-08-06'}
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
      },
    );
  });

  describe('should call onChange when a new date is selected with custom format', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
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
      },
    );
  });

  describe('should not call onChange when clicking disabled dates', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
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
      },
    );
  });

  describe('supplying a custom parseInputValue prop, produces the expected result', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
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
      },
    );
  });

  describe('focused calendar date is reset on open', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
        const { rerender } = render(
          <DatePicker value="1970-01-01" testId="test" />,
        );
        fireEvent.click(screen.getByTestId('test--container'));

        // testId of DatePicker passes in `${testId}--calendar` and the
        // Calendar uses `${testId}--calendar`, so you have it doubled
        const calendar = screen.getByTestId('test--calendar--calendar');
        expect(calendar).toHaveAccessibleDescription(
          expect.stringContaining('Jan 01 1970'),
        );

        rerender(<DatePicker value="1990-02-02" testId="test" />);
        // date doesn't update without focus
        expect(calendar).toHaveAccessibleDescription(
          expect.stringContaining('Jan 01 1970'),
        );

        const select = screen.getByRole('combobox');
        fireEvent.focus(select);
        // date update after focus
        expect(calendar).toHaveAccessibleDescription(
          expect.stringContaining('Feb 02 1990'),
        );
      },
    );
  });

  describe('default parseInputValue parses valid dates to the expected value', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
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
      },
    );
  });

  describe("should use today's date if year over 9999 is given", () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
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
      },
    );
  });

  describe('pressing the Backspace key to empty the input should clear the value', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
        const dateValue = new Date('06/08/2018').toISOString();
        const onChangeSpy = jest.fn();
        const testId = 'clear--test';
        render(
          <DatePicker
            value={dateValue}
            onChange={onChangeSpy}
            testId={testId}
          />,
        );

        const selectInput = screen.getByRole('combobox');
        fireEvent.keyDown(selectInput, { key: 'Backspace', keyCode: 8 });

        expect(onChangeSpy).not.toHaveBeenCalled();
      },
      () => {
        const dateValue = new Date('06/08/2018').toISOString();
        const onChangeSpy = jest.fn();
        const testId = 'clear--test';
        render(
          <DatePicker
            value={dateValue}
            onChange={onChangeSpy}
            testId={testId}
          />,
        );

        const selectInput = screen.getByDisplayValue('');
        fireEvent.keyDown(selectInput, { key: 'Backspace', keyCode: 8 });

        expect(onChangeSpy).toBeCalledWith('');
      },
    );
  });

  describe('pressing the Delete key to empty the input should clear the value', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
        const dateValue = new Date('06/08/2018').toISOString();
        const onChangeSpy = jest.fn();
        render(<DatePicker value={dateValue} onChange={onChangeSpy} />);

        const selectInput = screen.getByRole('combobox');
        fireEvent.keyDown(selectInput, { key: 'Delete', keyCode: 46 });

        expect(onChangeSpy).not.toHaveBeenCalled();
      },
      () => {
        const dateValue = new Date('06/08/2018').toISOString();
        const onChangeSpy = jest.fn();
        render(<DatePicker value={dateValue} onChange={onChangeSpy} />);

        const selectInput = screen.getByDisplayValue('');
        fireEvent.keyDown(selectInput, { key: 'Delete', keyCode: 46 });

        expect(onChangeSpy).toBeCalledWith('');
      },
    );
  });

  describe('pressing the clear button while menu is closed should clear the value and not open the menu', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
        const dateValue = new Date('06/08/2018').toISOString();
        const onChangeSpy = jest.fn();
        const testId = 'clear--test';
        render(
          <DatePicker
            value={dateValue}
            onChange={onChangeSpy}
            testId={testId}
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
        expect(screen.queryByTestId(`${testId}--popper--container`)).toBeNull();
      },
    );
  });

  describe('pressing the clear button while menu is open should clear the value and leave the menu open', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
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
        expect(
          screen.queryByTestId(`${testId}--popper--container`),
        ).not.toBeNull();
      },
    );
  });

  describe('should never apply an ID to the hidden input', () => {
    ffTest(
      'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      () => {
        const id = 'test';
        const testId = 'testId';
        const allImplementations = [
          <DatePicker testId={testId} />,
          <DatePicker testId={testId} id={id} />,
          <DatePicker testId={testId} selectProps={{ inputId: id }} />,
        ];

        allImplementations.forEach((jsx) => {
          const { getByTestId, unmount } = render(jsx);

          const hiddenInput = getByTestId(`${testId}--input`);

          expect(hiddenInput).toHaveAttribute('type', 'hidden');
          expect(hiddenInput).not.toHaveAttribute('id');

          unmount();
        });
      },
    );
  });
});
