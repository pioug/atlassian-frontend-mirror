import React from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format, parseISO } from 'date-fns';
import cases from 'jest-in-case';

import { convertTokens } from '../../../internal/parse-tokens';
import { type DatePickerBaseProps } from '../../../types';
import { DatePickerWithoutAnalytics as DatePicker } from '../../date-picker';

const testId = 'dateTest';
const testIdInput = `${testId}--input`;
const testIdContainer = `${testId}--container`;

const createDatePicker = (props: DatePickerBaseProps = {}) => (
	<DatePicker label="Date" testId={testId} {...props} />
);

const getAllDays = () => {
	let allDays: HTMLElement[] = [];
	screen.getAllByRole('gridcell').forEach((gridCell) => {
		allDays = allDays.concat(within(gridCell).getAllByRole('button'));
	});
	return allDays;
};

describe('DatePicker', () => {
	it('should call onChange only once when a date is selected and enter is pressed', () => {
		const testId = 'onchange';
		const onChangeSpy = jest.fn();
		render(createDatePicker({ onChange: onChangeSpy, testId: testId }));

		const input = screen.getByTestId(`${testId}--input`);
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
		render(createDatePicker({ value: dateValue }));

		const container = screen.getByTestId(testIdContainer);
		expect(container).toHaveTextContent('6/8/2018');
	});

	it('should manually format the display label', () => {
		const dateValue = new Date('06/08/2018').toISOString();
		render(
			createDatePicker({
				value: dateValue,
				formatDisplayLabel: () => 'hello world',
			}),
		);

		const container = screen.getByTestId(testIdContainer);

		expect(container).toHaveTextContent('hello world');
	});

	it('should manually format the display label using the default dateFormat', () => {
		const dateValue = new Date('06/08/2018').toISOString();
		render(
			createDatePicker({
				value: dateValue,
				formatDisplayLabel: (date, dateFormat) => format(parseISO(date), convertTokens(dateFormat)),
			}),
		);

		const container = screen.getByTestId(testIdContainer);

		expect(container).toHaveTextContent('2018/06/08');
	});

	it('should manually format the display label using custom dateFormat', () => {
		const dateValue = new Date('06/08/2018').toISOString();
		render(
			createDatePicker({
				value: dateValue,
				formatDisplayLabel: (date, dateFormat) => format(parseISO(date), convertTokens(dateFormat)),
				dateFormat: 'MMMM/DD',
			}),
		);

		const container = screen.getByTestId(testIdContainer);

		expect(container).toHaveTextContent('June/08');
	});

	it('should correctly render values in a custom format', () => {
		const dateValue = new Date('06/08/2018').toISOString();
		render(
			createDatePicker({
				value: dateValue,
				dateFormat: 'MMMM/DD',
			}),
		);

		const container = screen.getByTestId(testIdContainer);

		expect(container).toHaveTextContent('June/08');
	});

	it('should correctly render values in a complex custom format', () => {
		const dateValue = new Date('06/08/2018').toISOString();
		render(
			createDatePicker({
				value: dateValue,
				dateFormat: 'DDDo---dddd---YYYY---hh:mm:ss',
			}),
		);

		const container = screen.getByTestId(testIdContainer);

		expect(container).toHaveTextContent('159th---Friday---2018---12:00:00');
	});

	describe('locale', () => {
		const formattedDate = new Date('06/08/2018');
		const year = formattedDate.getFullYear();
		const month = formattedDate.getMonth() + 1;
		const day = formattedDate.getDate();
		const dateValue = formattedDate.toISOString();

		it('should apply `lang` attribute to inner input field', () => {
			const lang = 'en-US';

			render(
				createDatePicker({
					value: dateValue,
					locale: lang,
				}),
			);

			const value = screen.getByText(`${month}/${day}/${year}`);

			expect(value).toHaveAttribute('lang', expect.stringContaining(lang));
		});

		cases(
			'should format date using provided locale',
			({ locale, result }: { locale: string; result: string }) => {
				render(
					createDatePicker({
						value: dateValue,
						locale: locale,
					}),
				);

				expect(screen.getByText(result)).toBeInTheDocument();
			},
			[
				{ locale: 'en-US', result: `${month}/${day}/${year}` },
				{ locale: 'id', result: `${day}/${month}/${year}` },
			],
		);
	});

	it('should call onChange when a new date is selected', () => {
		const onChangeSpy = jest.fn();
		render(
			createDatePicker({
				value: '2018-08-06',
				onChange: onChangeSpy,
			}),
		);
		fireEvent.click(screen.getByTestId(testIdContainer));

		const days = getAllDays();
		const selectedDay = screen.getByTestId(`${testId}--calendar--selected-day`);
		const selectedIndex = days.findIndex((day) => day === selectedDay);
		const nextDay = days[selectedIndex + 1];

		fireEvent.click(nextDay);

		expect(onChangeSpy).toBeCalledWith('2018-08-07');
	});

	it('should call onChange when a new date is selected with custom format', () => {
		const onChangeSpy = jest.fn();
		render(
			createDatePicker({
				value: '2018-08-06',
				dateFormat: 'DDDo-dddd-YYYY',
				onChange: onChangeSpy,
			}),
		);

		fireEvent.click(screen.getByTestId(testIdContainer));
		const days = getAllDays();
		const selectedDay = screen.getByTestId(`${testId}--calendar--selected-day`);
		const selectedIndex = days.findIndex((day) => day === selectedDay);
		const nextDay = days[selectedIndex + 1];

		fireEvent.click(nextDay);

		expect(onChangeSpy).toBeCalledWith('2018-08-07');
	});

	describe('disabled dates', () => {
		const year = '2018';
		const month = '10';
		const day = '16';
		const otherDay = '17';

		const disabledDate = `${year}-${month}-${day}`;
		const disabledList = [disabledDate];
		const disabledFn = (iso: string) => iso === disabledDate;

		it('should not call onChange when clicking disabled dates', () => {
			const onChangeSpy = jest.fn();

			render(
				createDatePicker({
					value: `${year}-${month}-${otherDay}`,
					disabled: disabledList,
					onChange: onChangeSpy,
				}),
			);

			fireEvent.click(screen.getByTestId(testIdContainer));
			fireEvent.click(screen.getByText(day));
			expect(onChangeSpy).not.toHaveBeenCalled();
		});

		it('should not allow a date entry if date is disabled via disabled array', () => {
			const onChangeSpy = jest.fn();

			render(
				createDatePicker({
					disabled: disabledList,
					onChange: onChangeSpy,
				}),
			);

			const input = screen.getByTestId(`${testId}--input`);

			fireEvent.input(input, { target: { value: `${month}/${day}/${year}` } });
			fireEvent.keyDown(input, { key: 'Enter' });
			expect(onChangeSpy).not.toBeCalled();
		});

		it('should allow a date entry if date is disabled via disabled date filter', () => {
			const onChangeSpy = jest.fn();

			render(
				createDatePicker({
					disabledDateFilter: disabledFn,
					onChange: onChangeSpy,
				}),
			);

			const input = screen.getByTestId(`${testId}--input`);

			fireEvent.input(input, { target: { value: `${month}/${day}/${year}` } });
			fireEvent.keyDown(input, { key: 'Enter' });
			expect(onChangeSpy).toBeCalledWith(disabledDate);
		});
	});

	it('supplying a custom parseInputValue prop, produces the expected result', () => {
		const parseInputValue = () => new Date('01/01/1970');
		const onChangeSpy = jest.fn();
		const expectedResult = '1970-01-01';
		render(
			createDatePicker({
				id: 'customDatePicker-ParseInputValue',
				parseInputValue: parseInputValue,
				onChange: onChangeSpy,
			}),
		);

		const input = screen.getByTestId(testIdInput);
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
			createDatePicker({
				value: '1970-01-01',
			}),
		);

		fireEvent.click(screen.getByTestId(testIdContainer));
		let selectedDay = screen.getByTestId(`${testId}--calendar--selected-day`);
		expect(selectedDay).toHaveAccessibleName(expect.stringContaining('1, Thursday January 1970'));

		rerender(
			createDatePicker({
				value: '1990-02-02',
			}),
		);

		// date doesn't update without focus
		const select = screen.getByRole('combobox');
		fireEvent.focus(select);

		// date update after focus
		fireEvent.click(screen.getByTestId(testIdContainer));
		selectedDay = screen.getByTestId(`${testId}--calendar--selected-day`);
		expect(selectedDay).toHaveAccessibleName(expect.stringContaining('2, Friday February 1990'));
	});

	it('default parseInputValue parses valid dates to the expected value', () => {
		const onChangeSpy = jest.fn();
		const expectedResult = '2018-01-02';
		render(
			createDatePicker({
				id: 'defaultDatePicker-ParseInputValue',
				onChange: onChangeSpy,
			}),
		);

		const input = screen.getByTestId(testIdInput);
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
			createDatePicker({
				id: 'defaultDatePicker-ParseInputValue',
				onChange: onChangeSpy,
			}),
		);

		const input = screen.getByTestId(testIdInput);
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

	describe('focus', () => {
		const testId = 'escape-test';
		const queryCalendar = () => screen.queryByTestId(new RegExp(`${testId}.*--calendar$`));

		it('should bring focus back to the input and close the calendar when the value of the calendar is changed', async () => {
			const user = userEvent;
			render(createDatePicker({ testId: testId }));

			const selectInput = screen.getByRole('combobox');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the select input
			fireEvent.focus(selectInput);
			expect(selectInput).toHaveFocus();
			expect(queryCalendar()).toBeVisible();

			// Move focus to inside the calendar
			await user.keyboard('{Tab}');
			expect(selectInput).not.toHaveFocus();
			// An element within the calendar's container should have focus
			const focusedElement = screen.getByTestId('escape-test--calendar--previous-month');
			expect(focusedElement).toHaveFocus();

			// Select one of the dates in the calendar
			await user.keyboard('{Tab}');
			await user.keyboard('{Tab}');
			await user.keyboard(' ');

			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).toHaveFocus();
		});

		it('should open the calendar when the input is focused, the calendar is closed, and space is pressed', async () => {
			render(createDatePicker({ testId: testId }));

			const selectInput = screen.getByRole('combobox');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the select input
			fireEvent.focus(selectInput);
			expect(selectInput).toHaveFocus();
			expect(queryCalendar()).toBeVisible();

			// Close the calendar with escape key
			await userEvent.type(selectInput, '{Escape}');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).toHaveFocus();

			// Press space to re-open the calendar
			await userEvent.keyboard(' ');
			expect(queryCalendar()).toBeInTheDocument();
		});

		it('should open the calendar when the input is focused, the calendar is closed, and enter is pressed', async () => {
			render(createDatePicker({ testId: testId }));

			const selectInput = screen.getByRole('combobox');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the select input
			fireEvent.focus(selectInput);
			expect(selectInput).toHaveFocus();
			expect(queryCalendar()).toBeVisible();

			// Close the calendar with escape key
			await userEvent.type(selectInput, '{Escape}');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).toHaveFocus();

			// Press enter to re-open the calendar
			await userEvent.keyboard('{Enter}');
			expect(queryCalendar()).toBeInTheDocument();
		});
	});

	describe('escape', () => {
		const testId = 'escape-test';
		const queryCalendar = () => screen.queryByTestId(new RegExp(`${testId}.*--calendar$`));

		it('should close the calendar when focused on the input and the escape key is pressed', async () => {
			const user = userEvent;
			render(createDatePicker({ testId: testId }));

			const selectInput = screen.getByRole('combobox');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the select input
			fireEvent.focus(selectInput);
			expect(selectInput).toHaveFocus();
			expect(queryCalendar()).toBeVisible();

			await user.type(selectInput, '{Escape}');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).toHaveFocus();
		});

		it('should bring focus back to input and close calendar when focused on the calendar and the escape key is pressed', async () => {
			const user = userEvent;
			render(createDatePicker({ testId: testId }));

			const selectInput = screen.getByRole('combobox');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the select input
			fireEvent.focus(selectInput);
			expect(selectInput).toHaveFocus();
			expect(queryCalendar()).toBeVisible();

			// Move focus to inside the calendar
			await user.keyboard('{Tab}');
			expect(selectInput).not.toHaveFocus();
			// An element within the calendar's container should have focus
			const focusedElement = screen.getByTestId('escape-test--calendar--previous-month');
			expect(focusedElement).toHaveFocus();

			await user.type(selectInput, '{Escape}');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).toHaveFocus();
		});
	});

	it('pressing the Backspace key to empty the input should clear the value', () => {
		const dateValue = new Date('06/08/2018').toISOString();
		const onChangeSpy = jest.fn();
		const testId = 'clear--test';
		render(
			createDatePicker({
				value: dateValue,
				onChange: onChangeSpy,
				testId: testId,
			}),
		);

		const selectInput = screen.getByDisplayValue('');
		fireEvent.keyDown(selectInput, { key: 'Backspace', keyCode: 8 });

		expect(onChangeSpy).toBeCalledWith('');
	});

	it('pressing the Delete key to empty the input should clear the value', () => {
		const dateValue = new Date('06/08/2018').toISOString();
		const onChangeSpy = jest.fn();
		render(
			createDatePicker({
				value: dateValue,
				onChange: onChangeSpy,
			}),
		);

		const selectInput = screen.getByDisplayValue('');
		fireEvent.keyDown(selectInput, { key: 'Delete', keyCode: 46 });

		expect(onChangeSpy).toBeCalledWith('');
	});

	it('pressing the clear button while menu is closed should clear the value and not open the menu', () => {
		const dateValue = new Date('06/08/2018').toISOString();
		const onChangeSpy = jest.fn();
		const testId = 'clear--test';

		render(
			createDatePicker({
				value: dateValue,
				onChange: onChangeSpy,
				testId: testId,
				selectProps: { testId: testId },
			}),
		);
		const clearButton = screen.getByRole('button', { name: 'clear' });

		fireEvent.mouseOver(clearButton);
		fireEvent.mouseMove(clearButton);
		fireEvent.mouseDown(clearButton);

		expect(onChangeSpy).toBeCalledWith('');
		expect(screen.queryByTestId(`${testId}--popper--container`)).not.toBeInTheDocument();
	});

	it('pressing the clear button while menu is open should clear the value and leave the menu open', () => {
		const dateValue = new Date('06/08/2018').toISOString();
		const onChangeSpy = jest.fn();
		const testId = 'clear--test';

		render(
			createDatePicker({
				value: dateValue,
				onChange: onChangeSpy,
				testId: testId,
				selectProps: { testId: testId },
				defaultIsOpen: true,
			}),
		);

		const clearButton = screen.getByRole('button', { name: 'clear' });

		fireEvent.mouseOver(clearButton);
		fireEvent.mouseMove(clearButton);
		fireEvent.mouseDown(clearButton);

		expect(onChangeSpy).toBeCalledWith('');
		expect(screen.getByTestId(`${testId}--popper--container`)).toBeInTheDocument();
	});

	it('should never apply an ID to the hidden input', () => {
		const id = 'test';
		// const testId = 'testId';
		const allImplementations = [
			createDatePicker(),
			createDatePicker({ id: id }),
			createDatePicker({ selectProps: { inputId: id } }),
		];

		allImplementations.forEach((jsx) => {
			const { unmount } = render(jsx);

			const hiddenInput = screen.getByTestId(testIdInput);

			expect(hiddenInput).toHaveAttribute('type', 'hidden');
			expect(hiddenInput).not.toHaveAttribute('id');

			unmount();
		});
	});

	it('should add aria-label when label prop is supplied', () => {
		render(createDatePicker());

		const input = screen.getByRole('combobox');
		expect(input).toHaveAttribute('aria-label', 'Date');
	});

	it('should add aria-describedby when prop is supplied', () => {
		const describedBy = 'description';
		render(createDatePicker({ 'aria-describedby': describedBy }));

		const input = screen.getByRole('combobox');
		expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(describedBy));
	});
});
