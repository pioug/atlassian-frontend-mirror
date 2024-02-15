import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format, parseISO } from 'date-fns';
import cases from 'jest-in-case';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { DatePickerWithoutAnalytics as DatePicker } from '../../date-picker';
import { convertTokens } from '../../utils';

const getAllDays = () =>
  screen.getAllByRole(
    (content, element) =>
      content === 'button' &&
      element!.parentElement?.getAttribute('role') === 'gridcell',
  );

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

  describe('locale', () => {
    const formattedDate = new Date('06/08/2018');
    const year = formattedDate.getFullYear();
    const month = formattedDate.getMonth() + 1;
    const day = formattedDate.getDate();
    const dateValue = formattedDate.toISOString();

    it('should apply `lang` attribute to inner input field', () => {
      const lang = 'en-US';

      render(<DatePicker locale={lang} value={dateValue} testId="test" />);

      const value = screen.getByText(`${month}/${day}/${year}`);

      expect(value).toHaveAttribute('lang', expect.stringContaining(lang));
    });

    cases(
      'should format date using provided locale',
      ({ locale, result }: { locale: string; result: string }) => {
        render(<DatePicker locale={locale} value={dateValue} />);

        expect(screen.getByText(result)).toBeInTheDocument();
      },
      [
        { locale: 'en-US', result: `${month}/${day}/${year}` },
        { locale: 'id', result: `${day}/${month}/${year}` },
      ],
    );
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

        const days = getAllDays();
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
        const days = getAllDays();
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
        const testId = 'test';
        const { rerender } = render(
          <DatePicker value="1970-01-01" testId="test" />,
        );

        fireEvent.click(screen.getByTestId(`${testId}--container`));
        let selectedDay = screen.getByTestId(
          `${testId}--calendar--selected-day`,
        );
        expect(selectedDay).toHaveAccessibleName(
          expect.stringContaining('1, Thursday January 1970'),
        );

        rerender(<DatePicker value="1990-02-02" testId="test" />);

        // date doesn't update without focus
        const select = screen.getByRole('combobox');
        fireEvent.focus(select);

        // date update after focus
        fireEvent.click(screen.getByTestId(`${testId}--container`));
        selectedDay = screen.getByTestId(`${testId}--calendar--selected-day`);
        expect(selectedDay).toHaveAccessibleName(
          expect.stringContaining('2, Friday February 1990'),
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

  describe('escape', () => {
    const testId = 'escape-test';
    const queryCalendar = () =>
      screen.queryByTestId(new RegExp(`${testId}.*--calendar$`));

    it('should close the calendar when focused on the input and the escape key is pressed', async () => {
      const user = userEvent.setup();
      render(<DatePicker testId={testId} />);

      const selectInput = screen.getByRole('combobox');
      expect(queryCalendar()).not.toBeInTheDocument();
      expect(selectInput).not.toHaveFocus();

      // Move focus to the select input
      await user.keyboard('{Tab}');
      expect(selectInput).toHaveFocus();
      expect(queryCalendar()).toBeVisible();

      await user.type(selectInput, '{Escape}');
      expect(queryCalendar()).not.toBeInTheDocument();
      expect(selectInput).toHaveFocus();
    });

    it('should bring focus back to input and close calendar when focused on the calendar and the escape key is pressed', async () => {
      const user = userEvent.setup();
      render(<DatePicker testId={testId} />);

      const selectInput = screen.getByRole('combobox');
      expect(queryCalendar()).not.toBeInTheDocument();
      expect(selectInput).not.toHaveFocus();

      // Move focus to the select input
      await user.keyboard('{Tab}');
      expect(selectInput).toHaveFocus();
      expect(queryCalendar()).toBeVisible();

      // Move focus to inside the calendar
      await user.keyboard('{Tab}');
      expect(selectInput).not.toHaveFocus();
      // An element within the calendar's container should have focus
      const focusedElement = document.activeElement;
      expect(
        focusedElement?.closest('[data-testid$="--calendar--container"]'),
      ).toBeTruthy();

      await user.type(selectInput, '{Escape}');
      expect(queryCalendar()).not.toBeInTheDocument();
      expect(selectInput).toHaveFocus();
    });
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
            selectProps={{ testId: testId }}
            testId={testId}
          />,
        );
        const clearButton = screen.getByRole('button', { name: 'clear' });

        fireEvent.mouseOver(clearButton);
        fireEvent.mouseMove(clearButton);
        fireEvent.mouseDown(clearButton);

        expect(onChangeSpy).toBeCalledWith('');
        expect(
          screen.queryByTestId(`${testId}--popper--container`),
        ).not.toBeInTheDocument();
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
            selectProps={{ testId: testId }}
            defaultIsOpen
          />,
        );

        const clearButton = screen.getByRole('button', { name: 'clear' });

        fireEvent.mouseOver(clearButton);
        fireEvent.mouseMove(clearButton);
        fireEvent.mouseDown(clearButton);

        expect(onChangeSpy).toBeCalledWith('');
        expect(
          screen.getByTestId(`${testId}--popper--container`),
        ).toBeInTheDocument();
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
          const { unmount } = render(jsx);

          const hiddenInput = screen.getByTestId(`${testId}--input`);

          expect(hiddenInput).toHaveAttribute('type', 'hidden');
          expect(hiddenInput).not.toHaveAttribute('id');

          unmount();
        });
      },
    );
  });
});
