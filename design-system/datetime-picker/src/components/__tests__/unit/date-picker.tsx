import React from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format, parseISO } from 'date-fns';
import cases from 'jest-in-case';

import { convertTokens } from '../../../internal/parse-tokens';
import { type DatePickerBaseProps } from '../../../types';
import { DatePickerWithoutAnalytics as DatePicker } from '../../date-picker-class';

const testId = 'dateTest';
const testIdContainer = `${testId}--container`;

const createDatePicker = (props: DatePickerBaseProps = {}) => (
	<DatePicker label="Date" testId={testId} {...props} />
);

const getInput = () => screen.getByRole('combobox');

const getAllDays = () => {
	let allDays: HTMLElement[] = [];
	screen.getAllByRole('gridcell').forEach((gridCell) => {
		allDays = allDays.concat(within(gridCell).getAllByRole('button'));
	});
	return allDays;
};

// userEvent does not work for inputs or mousedowns sometimes. Unsure of why.
// Assuming react-select is the issue.
describe('DatePicker', () => {
	const label = 'label';
	const openCalendarLabel = 'open calendar';

	const exampleDate = {
		input: '06/08/2018',
		iso: '2018-06-08',
		parts: {
			day: '8',
			month: '6',
			year: '2018',
		},
	};

	const queryCalendar = () => screen.queryByTestId(new RegExp(`${testId}.*--calendar$`));
	const queryMenu = () => screen.queryByTestId(`${testId}--popper--container`);

	it('should be required when prop is passed', () => {
		render(createDatePicker({ isRequired: true }));
		expect(getInput()).toBeRequired();
	});

	it('should not be required when prop is not passed', () => {
		render(createDatePicker({ isRequired: false }));
		expect(getInput()).not.toBeRequired();
	});

	it('should have an empty value if none is provided', () => {
		render(createDatePicker());

		const input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue('');
	});

	it('should use provided value', () => {
		render(createDatePicker({ value: exampleDate.iso }));

		const input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue(exampleDate.iso);
	});

	it('should use provided default value', () => {
		render(createDatePicker({ defaultValue: exampleDate.iso }));

		const input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue(exampleDate.iso);
	});

	it('should handle a controlled value', () => {
		const { rerender } = render(createDatePicker({ value: exampleDate.iso }));
		let input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue(exampleDate.iso);

		rerender(createDatePicker({ value: '1969-04-20' }));
		input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue('1969-04-20');
	});

	it('should start closed if isOpen is not provided', () => {
		render(createDatePicker());

		const menu = queryMenu();
		expect(menu).not.toBeInTheDocument();
	});

	it('should have menu open if isOpen is set to true', () => {
		render(createDatePicker({ isOpen: true }));

		const menu = queryMenu();
		expect(menu).toBeInTheDocument();
	});

	it('should use provided defaultIsOpen', () => {
		render(createDatePicker({ defaultIsOpen: true }));

		const menu = queryMenu();
		expect(menu).toBeInTheDocument();
	});

	it('should handle a controlled isOpen', () => {
		const { rerender } = render(createDatePicker({ isOpen: false }));
		let menu = queryMenu();
		expect(menu).not.toBeInTheDocument();

		rerender(createDatePicker({ isOpen: true }));
		menu = queryMenu();
		expect(menu).toBeInTheDocument();
	});

	describe('Event handlers', () => {
		describe('onChange', () => {
			it('should call onChange only once when a date is selected and enter is pressed', () => {
				const onChangeSpy = jest.fn();
				render(createDatePicker({ onChange: onChangeSpy, testId: testId }));

				const input = getInput();
				// eslint-disable-next-line testing-library/prefer-user-event
				fireEvent.input(input, {
					target: {
						value: exampleDate.input,
					},
				});
				expect(onChangeSpy).not.toHaveBeenCalled();

				// eslint-disable-next-line testing-library/prefer-user-event
				fireEvent.keyDown(input, {
					key: 'Enter',
				});
				expect(onChangeSpy).toHaveBeenCalledWith(exampleDate.iso);

				// eslint-disable-next-line testing-library/prefer-user-event
				fireEvent.keyDown(input, {
					key: 'Enter',
				});
				// don't trigger when its closed
				expect(onChangeSpy).toHaveBeenCalledTimes(1);
			});

			it('should call onChange when a new date is selected', async () => {
				const user = userEvent.setup();
				const onChangeSpy = jest.fn();
				render(
					createDatePicker({
						value: exampleDate.iso,
						onChange: onChangeSpy,
					}),
				);
				await user.click(screen.getByTestId(testIdContainer));

				const days = getAllDays();
				const selectedDay = screen.getByTestId(`${testId}--calendar--selected-day`);
				const selectedIndex = days.findIndex((day) => day === selectedDay);
				const nextDay = days[selectedIndex + 1];

				await user.click(nextDay);

				expect(onChangeSpy).toHaveBeenCalledWith('2018-06-09');
			});
		});

		it('should call onChange with new format when a new date is selected with custom format', async () => {
			const user = userEvent.setup();
			const onChangeSpy = jest.fn();
			render(
				createDatePicker({
					value: exampleDate.iso,
					dateFormat: 'DDDo-dddd-YYYY',
					onChange: onChangeSpy,
				}),
			);

			await user.click(screen.getByTestId(testIdContainer));
			const days = getAllDays();
			const selectedDay = screen.getByTestId(`${testId}--calendar--selected-day`);
			const selectedIndex = days.findIndex((day) => day === selectedDay);
			const nextDay = days[selectedIndex + 1];

			await user.click(nextDay);

			expect(onChangeSpy).toHaveBeenCalledWith('2018-06-09');
		});
	});

	describe('Date formatting', () => {
		describe('dateFormat', () => {
			it('should format the date using the default format', () => {
				render(createDatePicker({ value: exampleDate.iso }));

				const container = screen.getByTestId(testIdContainer);
				expect(container).toHaveTextContent('6/8/2018');
			});

			it('should manually format the display label using custom dateFormat', () => {
				render(
					createDatePicker({
						value: exampleDate.iso,
						dateFormat: 'MMMM/DD',
					}),
				);

				const container = screen.getByTestId(testIdContainer);

				expect(container).toHaveTextContent('June/08');
			});

			it('should correctly render values in a custom format', () => {
				render(
					createDatePicker({
						value: exampleDate.iso,
						dateFormat: 'MMMM/DD',
					}),
				);

				const container = screen.getByTestId(testIdContainer);

				expect(container).toHaveTextContent('June/08');
			});

			it('should correctly render values in a complex custom format', () => {
				render(
					createDatePicker({
						value: exampleDate.iso,
						dateFormat: 'DDDo---dddd---YYYY---hh:mm:ss',
					}),
				);

				const container = screen.getByTestId(testIdContainer);

				expect(container).toHaveTextContent('159th---Friday---2018---12:00:00');
			});
		});

		describe('formatDisplayLabel', () => {
			it('should manually format the display label', () => {
				const content = 'content';
				render(
					createDatePicker({
						value: exampleDate.iso,
						formatDisplayLabel: () => content,
					}),
				);

				const container = screen.getByTestId(testIdContainer);

				expect(container).toHaveTextContent(content);
			});

			// Why tf is our default dateFormat showing YYYY/MM/DD when without this fn it shows MM/DD/YYYY??
			it('should manually format the display label using the default dateFormat', () => {
				render(
					createDatePicker({
						value: exampleDate.iso,
						formatDisplayLabel: (date, dateFormat) =>
							format(parseISO(date), convertTokens(dateFormat)),
					}),
				);

				const container = screen.getByTestId(testIdContainer);

				expect(container).toHaveTextContent('2018/06/08');
			});
		});

		describe('locale', () => {
			it('should apply `lang` attribute to inner input field', () => {
				// Don't use the default value
				const lang = 'en-GB';

				render(
					createDatePicker({
						value: exampleDate.iso,
						locale: lang,
					}),
				);

				const value = screen.getByText(
					`${exampleDate.parts.day.padStart(2, '0')}/${exampleDate.parts.month.padStart(2, '0')}/${exampleDate.parts.year}`,
				);

				expect(value).toHaveAttribute('lang', lang);
			});

			cases(
				'should format date using provided locale',
				({ locale, result }: { locale: string; result: string }) => {
					render(
						createDatePicker({
							value: exampleDate.iso,
							locale: locale,
						}),
					);

					expect(screen.getByText(result)).toBeInTheDocument();
				},
				[
					{
						locale: 'en-US',
						result: `${exampleDate.parts.month}/${exampleDate.parts.day}/${exampleDate.parts.year}`,
					},
					{
						locale: 'id',
						result: `${exampleDate.parts.day}/${exampleDate.parts.month}/${exampleDate.parts.year}`,
					},
				],
			);
		});

		describe('parseInputValue', () => {
			it('default parseInputValue parses valid dates to the expected value', () => {
				const onChangeSpy = jest.fn();
				render(
					createDatePicker({
						id: 'defaultDatePicker-ParseInputValue',
						onChange: onChangeSpy,
					}),
				);

				const input = getInput();
				// eslint-disable-next-line testing-library/prefer-user-event
				fireEvent.input(input, { target: { value: exampleDate.input } });
				expect(onChangeSpy).not.toHaveBeenCalled();

				// eslint-disable-next-line testing-library/prefer-user-event
				fireEvent.keyDown(input, { key: 'Enter' });

				expect(onChangeSpy).toHaveBeenCalledWith(exampleDate.iso);
			});

			it('supplying a custom parseInputValue prop, produces the expected result', () => {
				const parseInputValue = () => new Date(exampleDate.iso);
				const onChangeSpy = jest.fn();
				render(
					createDatePicker({
						id: 'customDatePicker-ParseInputValue',
						parseInputValue: parseInputValue,
						onChange: onChangeSpy,
					}),
				);

				const input = getInput();
				// eslint-disable-next-line testing-library/prefer-user-event
				fireEvent.input(input, {
					target: {
						value: 'asdf', // our custom parseInputValue ignores this
					},
				});

				// eslint-disable-next-line testing-library/prefer-user-event
				fireEvent.keyDown(input, { key: 'Enter' });
				expect(onChangeSpy).toHaveBeenCalledWith(exampleDate.iso);
			});
		});
	});

	describe('Placeholder', () => {
		const defaultPlaceholder = '2/18/1993';

		it('should show default placeholder if none provided', () => {
			render(createDatePicker());

			const input = getInput();
			expect(input).toHaveValue('');
			expect(screen.getByText(defaultPlaceholder)).toBeInTheDocument();
		});

		it('should show a placeholder if provided', () => {
			const placeholder = 'placeholder';
			render(createDatePicker({ placeholder }));

			const input = getInput();
			expect(input).toHaveValue('');
			expect(screen.getByText(placeholder)).toBeInTheDocument();
		});
	});

	describe('Disabled dates', () => {
		const year = '2018';
		const month = '10';
		const day = '16';
		const otherDay = '17';

		const startDate = `${year}-${month}-${otherDay}`;
		const disabledDate = `${year}-${month}-${day}`;
		const disabledList = [disabledDate];
		const disabledFn = (iso: string) => iso === disabledDate;

		it('should not allow clicking disabled dates', async () => {
			const user = userEvent.setup();
			const onChangeSpy = jest.fn();

			render(
				createDatePicker({
					value: startDate,
					disabled: disabledList,
					onChange: onChangeSpy,
				}),
			);

			await user.click(screen.getByTestId(testIdContainer));
			await user.click(screen.getByText(day));
			expect(onChangeSpy).not.toHaveBeenCalled();
		});

		it('should not allow clicking disabled dates via disabled function', async () => {
			const user = userEvent.setup();
			const onChangeSpy = jest.fn();

			render(
				createDatePicker({
					value: startDate,
					disabledDateFilter: disabledFn,
					onChange: onChangeSpy,
				}),
			);

			await user.click(getInput());
			await user.click(screen.getByText(day));
			expect(onChangeSpy).not.toHaveBeenCalled();
		});

		it('should not allow a date entry via keyboard if date is disabled via disabled array', () => {
			const onChangeSpy = jest.fn();

			render(
				createDatePicker({
					disabled: disabledList,
					onChange: onChangeSpy,
				}),
			);

			const input = getInput();

			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.input(input, { target: { value: `${month}/${day}/${year}` } });
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.keyDown(input, { key: 'Enter' });
			expect(onChangeSpy).not.toHaveBeenCalled();
		});

		it('should allow a date entry via keyboard if date is disabled via disabled date filter', () => {
			const onChangeSpy = jest.fn();

			render(
				createDatePicker({
					disabledDateFilter: disabledFn,
					onChange: onChangeSpy,
				}),
			);

			const input = getInput();

			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.input(input, { target: { value: `${month}/${day}/${year}` } });
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.keyDown(input, { key: 'Enter' });
			expect(onChangeSpy).toHaveBeenCalledWith(disabledDate);
		});
	});

	describe('Focus management', () => {
		it('should focus on the input on render if prop is provided', () => {
			render(createDatePicker({ autoFocus: true }));

			const input = getInput();
			expect(input).toHaveFocus();
		});

		it('focused calendar date is reset on open', async () => {
			const user = userEvent.setup();
			const { rerender } = render(
				createDatePicker({
					value: '1970-01-01',
				}),
			);

			await user.click(screen.getByTestId(testIdContainer));
			let selectedDay = screen.getByTestId(`${testId}--calendar--selected-day`);
			expect(selectedDay).toHaveAccessibleName('1, Thursday January 1970');

			rerender(
				createDatePicker({
					value: exampleDate.iso,
				}),
			);

			// date doesn't update without focus
			const select = getInput();
			fireEvent.focus(select);

			// date update after focus
			await user.click(screen.getByTestId(testIdContainer));
			selectedDay = screen.getByTestId(`${testId}--calendar--selected-day`);
			expect(selectedDay).toHaveAccessibleName('8, Friday June 2018');
		});

		it('should bring focus back to the input and close the calendar when the value of the calendar is changed', async () => {
			const user = userEvent.setup();
			render(createDatePicker({ testId: testId }));

			const selectInput = getInput();
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the select input
			await user.tab();
			expect(selectInput).toHaveFocus();
			expect(queryCalendar()).toBeVisible();

			await user.tab();
			const calendarPrevButton = screen.getByRole('button', { name: /Previous month/ });
			expect(calendarPrevButton).toHaveFocus();

			// Select one of the dates in the calendar
			await user.tab();
			await user.tab();
			await user.keyboard(' ');

			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).toHaveFocus();
		});

		it('should open the calendar when the input is focused via keyboard', async () => {
			const user = userEvent.setup();
			render(createDatePicker());

			const selectInput = getInput();
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the select input
			await user.tab();
			expect(selectInput).toHaveFocus();
			expect(queryCalendar()).toBeInTheDocument();
		});

		// Don't know why this is failing. It clearly works with manual testing.
		// This is in the integration tests, but would rather have it here
		xit('should open the calendar when the input is focused via mouse', async () => {
			const user = userEvent.setup();
			render(createDatePicker());

			const selectInput = getInput();
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the select input
			await user.click(selectInput);
			expect(selectInput).toHaveFocus();
			expect(queryCalendar()).toBeInTheDocument();
		});

		it('should open the calendar when the input is focused, escape is pressed, and then enter or space is pressed', async () => {
			const user = userEvent.setup();
			render(createDatePicker({ testId: testId }));

			const selectInput = getInput();
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the select input
			await user.tab();
			expect(selectInput).toHaveFocus();
			expect(queryCalendar()).toBeVisible();

			await user.keyboard('{Escape}');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).toHaveFocus();
			await user.keyboard('{Enter}');
			expect(queryCalendar()).toBeVisible();

			await user.keyboard('{Escape}');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).toHaveFocus();
			await user.keyboard(' ');
			expect(queryCalendar()).toBeVisible();
		});

		it('should bring focus back to the input and close the calendar when the value of the calendar is changed', async () => {
			const user = userEvent;
			render(createDatePicker({ testId: testId }));

			const selectInput = getInput();
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the select input
			fireEvent.focus(selectInput);
			expect(selectInput).toHaveFocus();
			expect(queryCalendar()).toBeVisible();

			// Move focus to inside the calendar
			await user.tab();
			expect(selectInput).not.toHaveFocus();
			// An element within the calendar's container should have focus
			const focusedElement = screen.getByTestId(`${testId}--calendar--previous-month`);
			expect(focusedElement).toHaveFocus();

			// Select one of the dates in the calendar
			await user.tab();
			await user.tab();
			await user.keyboard(' ');

			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).toHaveFocus();
		});

		it('should close the calendar when focused on the input and the escape key is pressed', async () => {
			const user = userEvent.setup();
			render(createDatePicker({ testId: testId }));

			const selectInput = getInput();
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the select input
			await user.tab();
			expect(queryCalendar()).toBeVisible();

			await user.type(selectInput, '{Escape}');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).toHaveFocus();
		});

		it('should bring focus back to button and close calendar when focused on the calendar and the escape key is pressed', async () => {
			const user = userEvent.setup();
			render(createDatePicker({ testId: testId }));

			const selectInput = getInput();
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the calendar button
			await user.tab();
			expect(selectInput).toHaveFocus();
			expect(queryCalendar()).toBeInTheDocument();

			// Move focus into the calendar
			await user.tab();
			// An element within the calendar's container should have focus
			expect(selectInput).not.toHaveFocus();
			// An element within the calendar's container should have focus
			const focusedElement = screen.getByTestId(`${testId}--calendar--previous-month`);
			expect(focusedElement).toHaveFocus();

			await user.keyboard('{Escape}');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).toHaveFocus();
		});
	});

	describe('Clearing the input', () => {
		it('should not show the clear button if a value is not present', () => {
			render(createDatePicker());
			const clearButton = screen.queryByRole('button', { name: /clear/i });
			expect(clearButton).not.toBeInTheDocument();
		});

		it('should show the clear button if a value is present', () => {
			render(createDatePicker({ value: exampleDate.iso }));
			const clearButton = screen.getByRole('button', { name: /clear/i });
			expect(clearButton).toBeInTheDocument();
		});

		it('pressing the Backspace key to empty the input should clear the value', async () => {
			const user = userEvent.setup();
			const onChangeSpy = jest.fn();
			render(
				createDatePicker({
					value: exampleDate.iso,
					onChange: onChangeSpy,
					testId: testId,
				}),
			);

			const selectInput = screen.getByDisplayValue('');
			await user.type(selectInput, '{Backspace}');

			expect(onChangeSpy).toHaveBeenCalledWith('');
		});

		it('pressing the Delete key to empty the input should clear the value', async () => {
			const user = userEvent.setup();
			const onChangeSpy = jest.fn();
			render(
				createDatePicker({
					value: exampleDate.iso,
					onChange: onChangeSpy,
				}),
			);

			const selectInput = screen.getByDisplayValue('');
			await user.type(selectInput, '{Delete}');

			expect(onChangeSpy).toHaveBeenCalledWith('');
		});

		it('pressing the clear button while menu is closed should clear the value and not open the menu', () => {
			const onChangeSpy = jest.fn();

			render(
				createDatePicker({
					value: exampleDate.iso,
					onChange: onChangeSpy,
					testId: testId,
					selectProps: { testId: testId },
					clearControlLabel: 'Clear date',
				}),
			);
			const clearButton = screen.getByRole('button', { name: 'Clear date' });

			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseOver(clearButton);
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseMove(clearButton);
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseDown(clearButton);

			expect(onChangeSpy).toHaveBeenCalledWith('');
			expect(screen.queryByTestId(`${testId}--popper--container`)).not.toBeInTheDocument();
		});

		it('pressing the clear button while menu is open should clear the value and leave the menu open', () => {
			const onChangeSpy = jest.fn();

			render(
				createDatePicker({
					value: exampleDate.iso,
					onChange: onChangeSpy,
					testId: testId,
					selectProps: { testId: testId },
					defaultIsOpen: true,
					clearControlLabel: 'Clear date',
				}),
			);

			const clearButton = screen.getByRole('button', { name: 'Clear date' });

			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseOver(clearButton);
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseMove(clearButton);
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseDown(clearButton);

			expect(onChangeSpy).toHaveBeenCalledWith('');
			expect(screen.getByTestId(`${testId}--popper--container`)).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('should never apply an ID to the hidden input', () => {
			const allImplementations = [createDatePicker(), createDatePicker({ id: 'test' })];

			allImplementations.forEach((jsx) => {
				const { unmount } = render(jsx);

				// The actual hidden input inside the picker
				const hiddenInput = screen.getByTestId(`${testId}--input`);

				expect(hiddenInput).toHaveAttribute('type', 'hidden');
				expect(hiddenInput).not.toHaveAttribute('id');

				unmount();
			});
		});

		it('should add aria-label when label prop is supplied', () => {
			render(createDatePicker({ label }));

			const input = getInput();
			expect(input).toHaveAttribute('aria-label', label);
		});

		it('should add aria-describedby when prop is supplied', () => {
			const describedBy = 'description';
			render(createDatePicker({ 'aria-describedby': describedBy }));

			const input = getInput();
			expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(describedBy));
		});
	});

	it('when `clearControlLabel` prop is passed, button should have an aria-label', () => {
		const onChangeSpy = jest.fn();
		const datePickerLabel = 'Date Test';
		const clearControlLabel = `Clear ${datePickerLabel}`;

		render(
			createDatePicker({
				value: exampleDate.iso,
				onChange: onChangeSpy,
				testId: testId,
				selectProps: { testId: testId },
				label: datePickerLabel,
				clearControlLabel: clearControlLabel,
			}),
		);
		expect(screen.getByRole('button', { name: clearControlLabel })).toBeInTheDocument();
	});

	describe('Edge cases', () => {
		it("should use today's date if year over 9999 is given", () => {
			const onChangeSpy = jest.fn();
			const today = format(new Date(), 'yyyy-MM-dd');

			render(
				createDatePicker({
					id: 'defaultDatePicker-ParseInputValue',
					onChange: onChangeSpy,
				}),
			);

			const input = getInput();
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.input(input, { target: { value: '01/01/10000' } });
			expect(onChangeSpy).not.toHaveBeenCalled();

			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.keyDown(input, { key: 'Enter' });

			expect(onChangeSpy).toHaveBeenCalledWith(today);
		});
	});

	describe('Calendar button', () => {
		const queryCalendar = () => screen.queryByTestId(new RegExp(`${testId}.*--calendar$`));

		it('should not render a button to open the calendar if prop not provided', () => {
			render(createDatePicker({ openCalendarLabel }));

			const calendarButton = screen.queryByRole('button', { name: new RegExp(openCalendarLabel) });
			expect(calendarButton).not.toBeInTheDocument();
		});

		it('should render a button to open the calendar', () => {
			render(createDatePicker({ shouldShowCalendarButton: true, openCalendarLabel }));

			const calendarButton = screen.getByRole('button', { name: new RegExp(openCalendarLabel) });
			expect(calendarButton).toBeVisible();
		});

		describe('labeling', () => {
			const pickerLabel = 'Date of Birth';

			it('should use `label` with calendar button label if provided', () => {
				render(
					createDatePicker({
						shouldShowCalendarButton: true,
						openCalendarLabel,
						label: pickerLabel,
					}),
				);

				expect(getInput()).toHaveAttribute('aria-label', pickerLabel);
				const calendarButton = screen.getByRole('button', {
					name: new RegExp(`${pickerLabel}.*${openCalendarLabel}`),
				});
				expect(getInput()).toHaveAttribute('aria-label');
				expect(calendarButton).toBeInTheDocument();
			});

			it('should use `inputLabel` with calendar button label if provided', () => {
				render(
					createDatePicker({
						shouldShowCalendarButton: true,
						openCalendarLabel,
						inputLabel: pickerLabel,
						// To override default
						label: undefined,
					}),
				);

				expect(getInput()).not.toHaveAttribute('aria-label');
				const calendarButton = screen.getByRole('button', {
					name: new RegExp(`${pickerLabel}.*${openCalendarLabel}`),
				});
				expect(calendarButton).toHaveAttribute(
					'aria-label',
					expect.stringMatching(new RegExp(`${pickerLabel}.*${openCalendarLabel}`)),
				);
				expect(calendarButton).toBeInTheDocument();
			});

			it('should use `inputLabelId` with calendar button label if provided', () => {
				const labelId = 'label-id';
				const datePickerId = 'id';

				render(
					<label id={labelId} htmlFor={datePickerId}>
						{pickerLabel}
						{createDatePicker({
							shouldShowCalendarButton: true,
							openCalendarLabel,
							inputLabelId: labelId,
							// To override default
							label: undefined,
						})}
					</label>,
				);

				expect(getInput()).not.toHaveAttribute('aria-label');
				const calendarButton = screen.getByRole('button', {
					name: new RegExp(`${pickerLabel}.*${openCalendarLabel}`),
				});
				expect(calendarButton).not.toHaveAttribute('aria-label');
				expect(calendarButton).toBeInTheDocument();
			});
		});

		it('should open the calendar when clicked', async () => {
			const user = userEvent.setup();
			render(createDatePicker({ shouldShowCalendarButton: true, openCalendarLabel }));

			const calendarButton = screen.getByRole('button', { name: new RegExp(openCalendarLabel) });
			await user.click(calendarButton);

			expect(queryCalendar()).toBeVisible();
		});

		it('should be in the tab order', async () => {
			const user = userEvent.setup();
			render(createDatePicker({ shouldShowCalendarButton: true, openCalendarLabel }));

			const calendarButton = screen.getByRole('button', { name: new RegExp(openCalendarLabel) });
			// Tab into the picker, close the calendar, tab to the calendar button
			await user.tab();
			await user.keyboard('{Escape}');
			await user.tab();

			expect(calendarButton).toHaveFocus();
		});

		it('should open the calendar when activated with enter', async () => {
			const user = userEvent.setup();
			render(createDatePicker({ shouldShowCalendarButton: true, openCalendarLabel }));

			const calendarButton = screen.getByRole('button', { name: new RegExp(openCalendarLabel) });
			await user.tab();
			await user.keyboard('{Escape}');
			await user.tab();
			expect(calendarButton).toHaveFocus();
			await user.keyboard('{Enter}');

			expect(queryCalendar()).toBeVisible();
		});

		it('should open the calendar when activated with space', async () => {
			const user = userEvent.setup();
			render(createDatePicker({ shouldShowCalendarButton: true, openCalendarLabel }));

			const calendarButton = screen.getByRole('button', { name: new RegExp(openCalendarLabel) });
			await user.tab();
			await user.tab();
			expect(calendarButton).toHaveFocus();
			await user.keyboard(' ');

			expect(queryCalendar()).toBeVisible();
		});

		it('should not open the calendar when the input is focused via keyboard if calendar button is present', async () => {
			const user = userEvent.setup();
			render(createDatePicker({ shouldShowCalendarButton: true, openCalendarLabel }));

			const selectInput = getInput();
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the select input
			await user.tab();
			expect(selectInput).toHaveFocus();
			expect(queryCalendar()).not.toBeInTheDocument();
		});

		it('should bring focus back to button and close calendar when focused on the calendar and the escape key is pressed if calendar button present', async () => {
			const user = userEvent.setup();
			render(
				createDatePicker({
					testId: testId,
					shouldShowCalendarButton: true,
					openCalendarLabel,
				}),
			);

			const selectInput = getInput();
			const calendarButton = screen.getByRole('button', { name: new RegExp(openCalendarLabel) });
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(selectInput).not.toHaveFocus();

			// Move focus to the calendar button
			await user.tab();
			expect(selectInput).toHaveFocus();
			await user.tab();
			expect(calendarButton).toHaveFocus();
			// Open and move focus to inside the calendar
			await user.keyboard('{Enter}');
			expect(queryCalendar()).toBeInTheDocument();
			// An element within the calendar's container should have focus
			expect(calendarButton).not.toHaveFocus();
			expect(selectInput).not.toHaveFocus();
			// An element within the calendar's container should have focus
			const focusedElement = screen.getByTestId(`${testId}--calendar--previous-month`);
			expect(focusedElement).toHaveFocus();

			await user.keyboard('{Escape}');
			expect(queryCalendar()).not.toBeInTheDocument();
			expect(calendarButton).toHaveFocus();
		});
	});
});
