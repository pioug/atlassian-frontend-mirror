import React from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';
// eslint-disable-next-line no-restricted-imports
import { parseISO } from 'date-fns';
import cases from 'jest-in-case';

import Calendar, { type CalendarProps } from '../../index';
import dateToString from '../../internal/utils/date-to-string';
import { type TabIndex, type WeekDay } from '../../types';

jest.mock('react-uid', () => ({
	...jest.requireActual('react-uid'),
	useUIDSeed: () => () => 'react-uid',
}));

const makeHandlerObject = ({
	day,
	month,
	year,
	...rest
}: {
	day: number;
	month: number;
	year: number;
	[property: string]: any;
}) => {
	return {
		day,
		month,
		year,
		iso: dateToString({ day, month, year }),
		...rest,
	};
};

const getDayElement = (textContent: number) =>
	screen.getAllByRole('button', {
		name: (content) => content.startsWith(textContent.toString()),
	})[0];

const getSelectedDay = (name?: string) =>
	screen.getAllByRole('button', {
		pressed: true,
		name: name,
	})[0];

const weekendFilter = (date: string) => {
	const dayOfWeek = parseISO(date).getDay();
	return dayOfWeek === 0 || dayOfWeek === 6;
};

describe('Calendar', () => {
	const testId = 'calendar';
	const testIdMonth = `${testId}--month`;
	const defaultDay = 1;
	const defaultDisabledDay = 4;
	const defaultPreviouslySelectedDay = 6;
	const defaultSelectedDay = 8;
	const defaultMonth = 12;
	const defaultMonthName = 'December';
	const defaultYear = 2019;
	const defaultTabIndex = 0;

	const setup = (calendarProps: Partial<CalendarProps> = {}) => {
		const props = {
			disabled: [
				dateToString({
					day: defaultDisabledDay,
					month: defaultMonth,
					year: defaultYear,
				}),
			],
			defaultPreviouslySelected: [
				dateToString({
					day: defaultPreviouslySelectedDay,
					month: defaultMonth,
					year: defaultYear,
				}),
			],
			defaultSelected: [
				dateToString({
					day: defaultSelectedDay,
					month: defaultMonth,
					year: defaultYear,
				}),
			],
			defaultDay,
			defaultMonth,
			defaultYear,
			onBlur: jest.fn(),
			onChange: jest.fn(),
			onFocus: jest.fn(),
			onSelect: jest.fn(),
			testId,
		};
		const ref = React.createRef<HTMLDivElement>();

		const { unmount, rerender } = render(<Calendar {...props} {...calendarProps} ref={ref} />);

		return {
			unmount,
			rerender,
			props,
			ref,
		};
	};

	describe('Heading', () => {
		it('should render the title', () => {
			setup();

			const heading = screen.getByRole('heading');
			expect(heading).toBeInTheDocument();
			expect(heading).toHaveTextContent(`${defaultMonthName} ${defaultYear}`);
		});

		it('should render month/year section as a live region only after user has interacted with either previous/next month buttons', () => {
			setup();

			const headingContainer = screen.getByTestId(`${testId}--current-month-year--container`);

			expect(headingContainer).not.toHaveAttribute('aria-live');

			const previousMonthButton = screen.getByTestId(`${testId}--previous-month`);
			fireEvent.click(previousMonthButton);

			expect(headingContainer).toHaveAttribute('aria-live');
		});

		it('should include accessible text for previous and next arrow buttons', () => {
			const firstMonth = 1;
			const lastMonth = 12;

			const { unmount } = setup({
				month: firstMonth,
			});

			const firstMonthPreviousDescriptiveText = screen.getByText(/, December 2018$/);
			expect(firstMonthPreviousDescriptiveText).toBeInTheDocument();

			const firstMonthNextDescriptiveText = screen.getByText(/, February 2019$/);
			expect(firstMonthNextDescriptiveText).toBeInTheDocument();

			unmount();

			setup({
				month: lastMonth,
			});

			const lastMonthPreviousDescriptiveText = screen.getByText(/, November 2019$/);
			expect(lastMonthPreviousDescriptiveText).toBeInTheDocument();

			const lastMonthNextDescriptiveText = screen.getByText(/, January 2020$/);
			expect(lastMonthNextDescriptiveText).toBeInTheDocument();
		});

		it('should switch to previous month when clicked on left arrow button', () => {
			const { props } = setup();

			fireEvent.click(screen.getByTestId(`${testId}--previous-month`));

			expect(screen.getByTestId(`${testId}--current-month-year`)).toHaveTextContent(
				`November ${defaultYear}`,
			);

			expect(props.onChange).toHaveBeenCalledWith(
				makeHandlerObject({
					day: defaultDay,
					month: defaultMonth - 1,
					year: defaultYear,
					type: 'prev',
				}),
				expect.anything(),
			);
		});

		it('should switch to next month when clicked on right arrow button', () => {
			const { props } = setup();

			fireEvent.click(screen.getByTestId(`${testId}--next-month`));

			expect(screen.getByTestId(`${testId}--current-month-year`)).toHaveTextContent(
				`January ${defaultYear + 1}`,
			);

			expect(props.onChange).toHaveBeenCalledWith(
				makeHandlerObject({
					day: defaultDay,
					month: (defaultMonth + 1) % 12,
					type: 'next',
					year: 2020,
				}),
				expect.anything(),
			);
		});

		it('should have month arrow buttons accessible by keyboard', () => {
			setup();

			expect(screen.getByTestId(`${testId}--previous-month`)).toHaveAttribute(
				'tabindex',
				String(defaultTabIndex),
			);

			expect(screen.getByTestId(`${testId}--next-month`)).toHaveAttribute(
				'tabindex',
				String(defaultTabIndex),
			);
		});

		it('should have hidden span elements on month arrow buttons for representing labels', () => {
			setup();

			expect(screen.getByTestId(`${testId}--previous-month`)).toHaveTextContent(/^Previous month/);

			expect(screen.getByTestId(`${testId}--next-month`)).toHaveTextContent(/^Next month/);
		});
	});

	describe('Date', () => {
		it('should be labelled by month/year header', () => {
			setup();
			const heading = screen.getByRole('heading');
			const headingId = heading.getAttribute('id');
			const calendarGrid = screen.getByRole('grid');
			expect(calendarGrid).toHaveAttribute('aria-labelledby', headingId);
		});

		it('should render default selected day', () => {
			setup();

			const selectedDayElement = getSelectedDay();

			expect(selectedDayElement).toHaveAttribute('aria-pressed', 'true');
		});

		it('should render each day with a label containing the full date', () => {
			setup();

			const selectedDayElement = getSelectedDay('8, Sunday December 2019');

			expect(selectedDayElement).toBeInTheDocument();
		});

		it('should have tabindex="-1" for all days but focused day, which will use tabIndex prop', () => {
			[-1 as TabIndex, 0 as TabIndex].forEach((tabIndex) => {
				const { unmount } = setup({ tabIndex });
				screen.getAllByRole('gridcell').forEach((cell) => {
					const dayButtons = within(cell).getAllByRole('button');
					dayButtons.forEach((dayButton) => {
						if (dayButton.getAttribute('data-focused') === 'true') {
							expect(dayButton).toHaveAttribute('tabindex', String(tabIndex));
						} else {
							expect(dayButton).toHaveAttribute('tabindex', '-1');
						}
					});
				});
				unmount();
			});
		});

		it('should handle day selection behavior', () => {
			const dayAfterSelectedDay = defaultSelectedDay + 1;
			const { props } = setup();

			const selectedDay = getSelectedDay();

			expect(selectedDay).toHaveAttribute('aria-pressed', 'true');

			const unselectedDay = getDayElement(dayAfterSelectedDay);

			expect(unselectedDay).toHaveAttribute('aria-pressed', 'false');

			fireEvent.click(unselectedDay);

			expect(unselectedDay).toHaveAttribute('aria-pressed', 'true');
			expect(props.onSelect).toHaveBeenCalledWith(
				makeHandlerObject({
					day: dayAfterSelectedDay,
					month: defaultMonth,
					year: defaultYear,
				}),
				expect.anything(),
			);
		});

		it('should be correctly disabled via disabled array props', () => {
			setup();

			const disabledDayElement = getDayElement(defaultDisabledDay);
			const notDisabledDayElement = getDayElement(defaultDisabledDay + 1);

			expect(disabledDayElement).toHaveAttribute('aria-disabled', 'true');
			expect(disabledDayElement).toHaveAttribute('data-disabled', 'true');
			expect(notDisabledDayElement).not.toHaveAttribute('aria-disabled');
			expect(notDisabledDayElement).not.toHaveAttribute('data-disabled');
		});

		it('should be correctly disabled via minDate and maxDate props', () => {
			const disabledDayStart = 2;
			const disabledDayEnd = 20;

			setup({
				minDate: dateToString({
					day: disabledDayStart,
					month: defaultMonth,
					year: defaultYear,
				}),
				maxDate: dateToString({
					day: disabledDayEnd,
					month: defaultMonth,
					year: defaultYear,
				}),
			});

			const outOfRangeDates = [disabledDayStart - 1, disabledDayEnd + 1];

			outOfRangeDates.forEach((date) => {
				const disabledDayElement = getDayElement(date);
				expect(disabledDayElement).toHaveAttribute('data-disabled', 'true');
			});

			const inRangeDates = [disabledDayStart, disabledDayEnd];

			inRangeDates.forEach((date) => {
				const disabledDayElement = getDayElement(date);
				expect(disabledDayElement).not.toHaveAttribute('data-disabled', 'true');
			});
		});

		it('should be correctly disabled via disabledDateFilter props', () => {
			setup({
				disabledDateFilter: weekendFilter,
			});

			const disabledDayElement = getDayElement(defaultDay);
			expect(disabledDayElement).toHaveAttribute('data-disabled', 'true');
		});

		it('should not select day if disabled', () => {
			const { props } = setup();
			const disabledDayElement = getDayElement(defaultDisabledDay);
			fireEvent.click(disabledDayElement);
			expect(props.onSelect).not.toHaveBeenCalled();
		});
	});

	describe('Date cell cursor', () => {
		it('show cursor pointer', () => {
			setup();
			const cell = getDayElement(defaultDay + 1);
			expect(cell).toHaveStyle('cursor: pointer');
		});

		it('cursor not-allowed when disabled', () => {
			setup();
			const disabledCell = getDayElement(defaultDisabledDay);
			expect(disabledCell).toHaveStyle('cursor: not-allowed');
		});
	});

	it('should propagate tabindex to all interactive elements', () => {
		[-1 as TabIndex, 0 as TabIndex].forEach((tabIndexValue) => {
			const { unmount } = setup({ tabIndex: tabIndexValue });

			// Header
			const previousMonthButton = screen.getByTestId(`${testId}--previous-month`);
			const nextMonthButton = screen.getByTestId(`${testId}--next-month`);

			expect(previousMonthButton).toHaveAttribute('tabindex', String(tabIndexValue));
			expect(nextMonthButton).toHaveAttribute('tabindex', String(tabIndexValue));
			unmount();
		});
	});

	it('dates container should not have unnecessary tab stop for keyboard users', () => {
		setup({
			day: defaultDay,
			month: defaultMonth,
			year: defaultYear,
			selected: [
				dateToString({
					day: defaultDay,
					month: defaultMonth,
					year: defaultYear,
				}),
			],
		});
		expect(screen.getByRole('grid')).not.toHaveAttribute('tabindex');
	});

	it('should set appropriate attributes on focus', () => {
		setup();

		const focusedDayElement = getDayElement(defaultDay);
		const unfocusedDayElement = getDayElement(defaultDay + 1);

		expect(focusedDayElement).toHaveAttribute('data-focused', 'true');
		expect(unfocusedDayElement).not.toHaveAttribute('data-focused');
	});

	it('should set appropriate attributes when current day', () => {
		const today = new Date();

		setup({
			day: today.getDate(),
			month: today.getMonth() + 1,
			year: today.getFullYear(),
		});
		const todayElement = getDayElement(today.getDate());
		const notTodayElement = getDayElement(today.getDate() + 1);

		expect(todayElement).toHaveAttribute('aria-current', 'date');
		expect(notTodayElement).not.toHaveAttribute('aria-current');
	});

	it('should handle onBlur and focus event', () => {
		const { props } = setup();
		const calendarContainerElement = screen.getByTestId('calendar--calendar') as HTMLDivElement;

		fireEvent.focus(calendarContainerElement);

		expect(props.onFocus).toHaveBeenCalledTimes(1);

		fireEvent.blur(calendarContainerElement);

		expect(props.onBlur).toHaveBeenCalledTimes(1);

		fireEvent.focus(calendarContainerElement);

		expect(props.onFocus).toHaveBeenCalledTimes(2);
	});

	cases(
		'should select day when following keys are pressed',
		({ key, code }: { key: string; code: string }) => {
			const focusedDay = 10;
			const { props } = setup({
				defaultDay: focusedDay,
			});

			const currentSelectedDay = getSelectedDay();

			expect(currentSelectedDay).toHaveTextContent(String(defaultSelectedDay));

			const calendarGrid = screen.getByTestId(testIdMonth);
			const isPrevented = fireEvent.keyDown(calendarGrid as HTMLDivElement, {
				key,
				code,
			});

			const newSelectedDay = getSelectedDay();

			expect(newSelectedDay).toHaveTextContent(String(focusedDay));

			expect(isPrevented).toBe(false);
			expect(props.onSelect).toHaveBeenCalledWith(
				makeHandlerObject({
					day: 10,
					month: defaultMonth,
					year: defaultYear,
				}),
				expect.anything(),
			);
		},
		[
			{ name: 'Enter', key: 'Enter', code: 'Enter' },
			{ name: 'Space', key: ' ', code: 'Space' },
		],
	);

	describe('Key interactions', () => {
		const defaultDayForKeyInteractions = 15;
		cases(
			'should highlight day when following keys are pressed',
			({
				key,
				code,
				handlerObject,
			}: {
				key: string;
				code: string;
				handlerObject: {
					day: number;
					iso: string;
					month: number;
					year: number;
					type: string;
				};
			}) => {
				const { props } = setup({
					defaultDay: defaultDayForKeyInteractions,
				});

				const calendarGrid = screen.getByTestId(testIdMonth);
				const isPrevented = fireEvent.keyDown(calendarGrid as HTMLDivElement, {
					key,
					code,
				});

				expect(isPrevented).toBe(false);
				expect(props.onChange).toHaveBeenCalledWith(handlerObject, expect.anything());
			},
			[
				{
					name: 'ArrowDown',
					key: 'ArrowDown',
					code: 'ArrowDown',
					handlerObject: makeHandlerObject({
						day: defaultDayForKeyInteractions + 7,
						month: defaultMonth,
						year: defaultYear,
						type: 'down',
					}),
				},
				{
					name: 'ArrowLeft',
					key: 'ArrowLeft',
					code: 'ArrowLeft',
					handlerObject: makeHandlerObject({
						day: defaultDayForKeyInteractions - 1,
						month: defaultMonth,
						year: defaultYear,
						type: 'left',
					}),
				},
				{
					name: 'ArrowRight',
					key: 'ArrowRight',
					code: 'ArrowRight',
					handlerObject: makeHandlerObject({
						day: defaultDayForKeyInteractions + 1,
						month: defaultMonth,
						year: defaultYear,
						type: 'right',
					}),
				},
				{
					name: 'ArrowUp',
					key: 'ArrowUp',
					code: 'ArrowUp',
					handlerObject: makeHandlerObject({
						day: defaultDayForKeyInteractions - 7,
						month: defaultMonth,
						year: defaultYear,
						type: 'up',
					}),
				},
			],
		);
	});

	it('should switch to previous month and highlight the day when navigated through arrow keys at the edge', () => {
		const { props } = setup({
			defaultDay: 1,
		});

		const calendarGrid = screen.getByTestId(testIdMonth);
		const isPrevented = fireEvent.keyDown(calendarGrid as HTMLDivElement, {
			key: 'ArrowUp',
			code: 'ArrowUp',
		});

		expect(isPrevented).toBe(false);
		expect(props.onChange).toHaveBeenCalledWith(
			makeHandlerObject({
				day: 24,
				month: defaultMonth - 1,
				year: defaultYear,
				type: 'up',
			}),
			expect.anything(),
		);
	});

	it('should assign passed ref to top level element', () => {
		const { ref } = setup();
		expect(ref.current).toBe(screen.getByTestId('calendar--container'));
	});

	it('should rerender calendar with new date when passed from outside', () => {
		// Can't test with different years/months because then the view changes and
		// the selected date is no longer accessible via visible calendar grid
		const newDay = defaultDay + 1;

		const { rerender } = setup({
			day: defaultDay,
			month: defaultMonth,
			year: defaultYear,
			selected: [
				dateToString({
					day: defaultDay,
					month: defaultMonth,
					year: defaultYear,
				}),
			],
		});
		const monthYear = screen.getByTestId(`${testId}--current-month-year`);

		expect(monthYear).toHaveTextContent(`${defaultMonthName} ${defaultYear}`);
		expect(getSelectedDay()).toHaveTextContent(String(defaultDay));

		rerender(
			<Calendar
				day={newDay}
				month={defaultMonth}
				year={defaultYear}
				selected={[
					dateToString({
						day: newDay,
						month: defaultMonth,
						year: defaultYear,
					}),
				]}
			/>,
		);

		expect(monthYear).toHaveTextContent(`${defaultMonthName} ${defaultYear}`);
		expect(getSelectedDay()).toHaveTextContent(String(newDay));
	});

	cases(
		'should render weekdays depending on #weekStartDay',
		({ weekStartDay, expected }: { weekStartDay: WeekDay; expected: string }) => {
			setup({
				weekStartDay,
			});
			const headerElements = screen.getAllByTestId(`${testId}--column-headers`)?.[0];
			expect(headerElements).toHaveTextContent(expected);
		},
		{
			weekStartDay0: {
				weekStartDay: 0,
				expected: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].join(''),
			},
			weekStartDay1: {
				weekStartDay: 1,
				expected: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].join(''),
			},
		},
	);
});
