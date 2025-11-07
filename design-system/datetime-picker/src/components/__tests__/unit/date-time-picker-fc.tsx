import React from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';

import Select, { type OptionsType } from '@atlaskit/select';

import { type DateTimePickerBaseProps } from '../../../types';
import DateTimePicker, {
	datePickerDefaultAriaLabel,
	timePickerDefaultAriaLabel,
} from '../../date-time-picker-fc';

jest.mock('@atlaskit/select', () => {
	const actual = jest.requireActual('@atlaskit/select');

	return {
		__esModule: true,
		...actual,
		default: jest.fn(),
	};
});

describe('DateTimePicker', () => {
	const testId = 'testId';
	const today = new Date();
	const todayISO = today.toISOString();

	const createDateTimePicker = (props?: DateTimePickerBaseProps) => (
		<label htmlFor={props?.id || 'datetime'}>
			Datetime
			{/* eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props */}
			<DateTimePicker id={props?.id || 'datetime'} testId={testId} {...props} />
		</label>
	);

	const firePickerEvent = {
		// We can't convert these to userEvent at this point. Unsure of why, but not
		// worth figuring out at the moment.
		changeDate(value: string) {
			const input = screen.getByTestId(`${testId}--datepicker--input`);
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.input(input, {
				target: {
					value,
				},
			});
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.keyDown(input, {
				key: 'Enter',
			});
		},
		focusDate() {
			const select = screen.getByTestId(`${testId}--datepicker--select`);
			fireEvent.focus(select);
		},
		blurDate() {
			const select = screen.getByTestId(`${testId}--datepicker--select`);
			fireEvent.blur(select);
		},
		async changeTime(value: string, user: UserEvent) {
			const select = screen.getByTestId(`${testId}--timepicker--select`);
			await user.selectOptions(select, value);
		},
		focusTime() {
			const select = screen.getByTestId(`${testId}--timepicker--select`);
			fireEvent.focus(select);
		},
		blurTime() {
			const select = screen.getByTestId(`${testId}--timepicker--select`);
			fireEvent.blur(select);
		},
	};

	beforeEach(() => {
		(Select as unknown as jest.Mock).mockImplementation((props) => {
			const options: OptionsType = props.options || [];

			return (
				<select
					{...props}
					onChange={(event) => props.onChange(event.target.value, 'select-option')}
					data-testid={`${props.testId}--select`}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
					<option value=""></option>
				</select>
			);
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should have an empty value if none is provided', () => {
		render(createDateTimePicker());

		const input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue('');
	});

	it('should use provided value', () => {
		render(createDateTimePicker({ value: todayISO }));

		const input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue(todayISO);
	});

	it('should use provided default value', () => {
		render(createDateTimePicker({ defaultValue: todayISO }));

		const input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue(todayISO);
	});

	it('should use defaultValue from inner pickers', () => {
		const defaultTime = '23:59';
		const onChangeSpy = jest.fn();
		render(
			createDateTimePicker({
				onChange: onChangeSpy,
				timePickerProps: { defaultValue: defaultTime },
			}),
		);

		firePickerEvent.changeDate(todayISO);
		expect(onChangeSpy.mock.calls[0][0]).toEqual(expect.stringContaining(defaultTime));
	});

	it('should handle a controlled value', () => {
		const { rerender } = render(createDateTimePicker({ value: todayISO }));
		let input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue(todayISO);

		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);
		const tomorrowISO = tomorrow.toISOString();

		rerender(createDateTimePicker({ value: tomorrowISO }));
		input = screen.getByTestId(`${testId}--input`);
		expect(input).toHaveValue(tomorrowISO);
	});

	it('should use custom parseValue when accessing state', () => {
		const onChange = jest.fn();
		const dateValue = new Date('05/02/2018').toISOString();
		const customParseValue = jest.fn().mockImplementation(() => ({
			dateValue,
			timeValue: '08:30',
			zoneValue: '+0800',
		}));

		render(
			createDateTimePicker({
				defaultValue: '2018-05-02',
				parseValue: customParseValue,
				onChange: onChange,
			}),
		);

		expect(customParseValue).toHaveBeenCalledWith('2018-05-02', '', '', '');

		firePickerEvent.changeDate('06/08/2018');

		expect(customParseValue).toHaveBeenCalledWith(
			'2018-06-08T08:30+0800',
			'2018-06-08',
			'08:30',
			'+0800',
		);

		expect(onChange.mock.calls[0][0]).toBe('2018-06-08T08:30+0800');
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('should not parse the date time value into the specified timezone', () => {
		const onChange = jest.fn();
		render(createDateTimePicker({ value: '2018-05-02T08:00:00.000+0800', onChange: onChange }));

		firePickerEvent.changeDate('02/05/2018');

		expect(onChange.mock.calls[0][0]).toBe('2018-02-05T00:00+0000');
	});

	it('should only be fired onChange when a valid date is supplied', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		render(createDateTimePicker({ onChange: onChange }));

		firePickerEvent.changeDate('2018/05/02');
		expect(onChange).not.toHaveBeenCalled();

		await firePickerEvent.changeTime('10:30', user);
		// iso will use current date (build/configs/jest-config/setup/setup-dates.js)
		// because we triggered date change in incorrect format.
		expect(onChange.mock.calls[0][0]).toBe('2017-08-16T10:30+0000');

		onChange.mockClear();
		firePickerEvent.changeDate('02/05/2018');
		// iso will use updated date because we triggered date change in correct format.
		expect(onChange.mock.calls[0][0]).toBe('2018-02-05T10:30+0000');
	});

	it('should call onChange with the date, time and zone offset in the correct format', async () => {
		const user = userEvent.setup();
		const zoneValue = '+0800';
		const customParseValue = jest.fn().mockImplementation((_value, date, time, _zone) => {
			return {
				dateValue: date,
				timeValue: time,
				zoneValue: date && time ? zoneValue : '',
			};
		});
		const onChange = jest.fn();

		render(createDateTimePicker({ onChange: onChange, parseValue: customParseValue }));

		firePickerEvent.changeDate('05/02/2018');
		await firePickerEvent.changeTime('10:30', user);

		expect(onChange.mock.calls[0][0]).toBe(`2018-05-02T10:30${zoneValue}`);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('fires onChange with empty string when the time is cleared, and there is a datetime value', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		const dateTimeValue = '2018-05-02T08:00:00.000+0800';

		render(createDateTimePicker({ value: dateTimeValue, onChange: onChange }));

		await firePickerEvent.changeTime('', user);

		expect(onChange.mock.calls[0][0]).toBe('');
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('fires onChange with empty string when the time is cleared, and there is a default datetime value', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		const dateTimeValue = '2018-05-02T08:00:00.000+0800';

		render(createDateTimePicker({ value: dateTimeValue, onChange: onChange }));

		await firePickerEvent.changeTime('', user);

		const hiddenInput = screen.getByTestId(`${testId}--input`);
		expect(hiddenInput).toHaveValue('');

		expect(onChange.mock.calls[0][0]).toBe('');
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('fires onChange with empty string when the time is cleared, and there is a default datetime value', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		const dateTimeValue = '2018-05-02T08:00:00.000+0800';

		render(createDateTimePicker({ defaultValue: dateTimeValue, onChange: onChange }));

		await firePickerEvent.changeTime('', user);

		expect(onChange.mock.calls[0][0]).toBe('');
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('should not fire onChange when the date or time is cleared, but there is no datetime value', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();

		render(createDateTimePicker({ onChange: onChange }));

		firePickerEvent.changeDate('');
		await firePickerEvent.changeTime('', user);

		expect(onChange).not.toHaveBeenCalled();
	});

	it('should still parse date and time values if onChange is provided to underlying pickers', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		const parseValue = jest.fn();
		const dateOnChange = jest.fn();
		const timeOnChange = jest.fn();

		render(
			createDateTimePicker({
				onChange,
				parseValue,
				datePickerProps: { onChange: dateOnChange },
				timePickerProps: { onChange: timeOnChange },
			}),
		);

		expect(parseValue).toHaveBeenCalled();
		parseValue.mockClear();

		firePickerEvent.changeDate('');
		expect(dateOnChange).toHaveBeenCalled();
		expect(parseValue).toHaveBeenCalled();
		parseValue.mockClear();

		await firePickerEvent.changeTime('', user);
		expect(timeOnChange).toHaveBeenCalled();
		expect(parseValue).toHaveBeenCalled();
		parseValue.mockClear();

		// Because a valid date was not given
		expect(onChange).not.toHaveBeenCalled();
	});

	it('should fire onFocus prop when datepicker is focused', () => {
		const onFocus = jest.fn();
		render(createDateTimePicker({ onFocus: onFocus }));

		firePickerEvent.focusDate();

		expect(onFocus).toHaveBeenCalled();
	});

	it('should fire onBlur prop when datepicker is blurred', () => {
		const onBlur = jest.fn();
		render(createDateTimePicker({ onBlur: onBlur }));

		firePickerEvent.blurDate();

		expect(onBlur).toHaveBeenCalled();
	});

	it('should fire onFocus prop when timepicker is focused', () => {
		const onFocus = jest.fn();
		render(createDateTimePicker({ onFocus: onFocus }));

		firePickerEvent.focusTime();

		expect(onFocus).toHaveBeenCalled();
	});

	it('should fire onBlur prop when timepicker is blurred', () => {
		const onBlur = jest.fn();
		render(createDateTimePicker({ onBlur: onBlur }));

		firePickerEvent.blurTime();

		expect(onBlur).toHaveBeenCalled();
	});

	it('should fire date or time picker onFocus', () => {
		const onDateFocus = jest.fn();
		const onTimeFocus = jest.fn();
		render(
			createDateTimePicker({
				datePickerProps: { onFocus: onDateFocus },
				timePickerProps: { onFocus: onTimeFocus },
			}),
		);

		firePickerEvent.focusDate();
		expect(onDateFocus).toHaveBeenCalled();

		firePickerEvent.focusTime();
		expect(onTimeFocus).toHaveBeenCalled();
	});

	it('should fire date or time picker onBlur', () => {
		const onDateBlur = jest.fn();
		const onTimeBlur = jest.fn();
		render(
			createDateTimePicker({
				datePickerProps: { onBlur: onDateBlur },
				timePickerProps: { onBlur: onTimeBlur },
			}),
		);

		firePickerEvent.blurDate();
		expect(onDateBlur).toHaveBeenCalled();

		firePickerEvent.blurTime();
		expect(onTimeBlur).toHaveBeenCalled();
	});

	it('should fire onClear event when cleared', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		const dateTimeValue = '2018-05-02T08:00:00.000+0800';

		render(createDateTimePicker({ value: dateTimeValue, onChange: onChange }));

		const clearButton = screen.getByRole('button', { name: /clear/ });
		await user.click(clearButton);

		expect(onChange.mock.calls[0][0]).toBe('');
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('should have a clear button with a tabindex of -1', () => {
		const dateTimeValue = '2018-05-02T08:00:00.000+0800';

		render(createDateTimePicker({ value: dateTimeValue }));

		const button = screen.getByRole('button', { name: /clear/ });

		expect(button).toHaveProperty('tagName', 'BUTTON');
		expect(button).toHaveAttribute('tabindex', '-1');
	});

	it('should never apply an ID to the hidden input', () => {
		const id = 'test';
		const allImplementations = [createDateTimePicker(), createDateTimePicker({ id: id })];

		allImplementations.forEach((jsx) => {
			const { unmount } = render(jsx);

			const hiddenInput = screen.getByTestId(`${testId}--input`);

			expect(hiddenInput).toHaveAttribute('type', 'hidden');
			expect(hiddenInput).not.toHaveAttribute('id');

			unmount();
		});
	});

	describe('Accessible names and descriptions', () => {
		const label = 'Hibernation start date';
		const datePickerTestId = `${testId}--datepicker--select`;
		const timePickerTestId = `${testId}--timepicker--select`;

		it('should have a default aria-label on the internal DatePicker and TimePicker', () => {
			render(createDateTimePicker());

			const datePicker = screen.getByTestId(datePickerTestId);
			const timePicker = screen.getByTestId(timePickerTestId);

			// This tests `label` because we are mocking the select and just spreading
			// everything in it. Yeah it sucks.
			expect(datePicker).toHaveAttribute('label', datePickerDefaultAriaLabel);
			expect(timePicker).toHaveAttribute('aria-label', timePickerDefaultAriaLabel);
		});

		it('should not use the default aria-label on the internal date picker if `label` prop is provided by [date|time]PickerProps', () => {
			render(
				createDateTimePicker({
					datePickerProps: { label: label },
					timePickerProps: { label: label },
				}),
			);

			const datePicker = screen.getByTestId(datePickerTestId);
			const timePicker = screen.getByTestId(timePickerTestId);

			// This tests `label` because we are mocking the select and just spreading
			// everything in it. Yeah it sucks.
			expect(datePicker).toHaveAttribute('label', label);
			expect(timePicker).toHaveAttribute('aria-label', label);

			// Make sure the default labels are not used anywhere
			expect(screen.queryByLabelText('Date')).not.toBeInTheDocument();
			expect(screen.queryByLabelText('Time')).not.toBeInTheDocument();
		});

		it('should add aria-describedby when prop is supplied', () => {
			const describedBy = 'description';
			render(createDateTimePicker({ 'aria-describedby': describedBy }));

			const datePicker = screen.getByTestId(datePickerTestId);
			expect(datePicker).toHaveAttribute('aria-describedby', expect.stringContaining(describedBy));
			const timePicker = screen.getByTestId(timePickerTestId);
			expect(timePicker).toHaveAttribute('aria-describedby', expect.stringContaining(describedBy));
		});

		it('should have a label for the clear button label when prop is supplied', async () => {
			const clearControlLabel = 'clear dtp';
			const user = userEvent.setup();
			const onChange = jest.fn();
			render(createDateTimePicker({ onChange: onChange, clearControlLabel: clearControlLabel }));

			firePickerEvent.changeDate('05/02/2018');
			await firePickerEvent.changeTime('10:30', user);

			expect(screen.getByRole('button', { name: clearControlLabel })).toBeInTheDocument();
		});
	});

	it('should show calendar button if prop is used in `datePickerProps`', () => {
		const openCalendarLabel = 'openCalendarLabel';
		render(
			createDateTimePicker({
				datePickerProps: { shouldShowCalendarButton: true, openCalendarLabel },
			}),
		);

		const calendarButton = screen.getByRole('button', { name: new RegExp(openCalendarLabel) });
		expect(calendarButton).toBeInTheDocument();
	});

	describe('Calendar button', () => {
		const openCalendarLabel = 'openCalendarLabel';
		const getDateInput = () =>
			within(screen.getByTestId(`${testId}--datepicker--container`)).getByRole('combobox');

		it('should not render a button to open the calendar if prop not provided', () => {
			render(createDateTimePicker({ datePickerProps: { openCalendarLabel } }));

			const calendarButton = screen.queryByRole('button', { name: new RegExp(openCalendarLabel) });
			expect(calendarButton).not.toBeInTheDocument();
		});

		it('should render a button to open the calendar', () => {
			render(
				createDateTimePicker({
					datePickerProps: {
						shouldShowCalendarButton: true,
						openCalendarLabel,
					},
				}),
			);

			const calendarButton = screen.getByRole('button', { name: new RegExp(openCalendarLabel) });
			expect(calendarButton).toBeVisible();
		});

		describe('labeling', () => {
			const pickerLabel = 'Date of Birth';

			it('should use `label` with calendar button label if provided', () => {
				render(
					createDateTimePicker({
						datePickerProps: {
							shouldShowCalendarButton: true,
							openCalendarLabel,
							label: pickerLabel,
						},
					}),
				);
				// This tests `label` because we are mocking the select and just spreading
				// everything in it. Yeah it sucks.
				expect(getDateInput()).toHaveAttribute('label', pickerLabel);
				const calendarButton = screen.getByRole('button', {
					name: new RegExp(`${pickerLabel}.*${openCalendarLabel}`),
				});
				// This tests `label` because we are mocking the select and just spreading
				// everything in it. Yeah it sucks.
				expect(getDateInput()).toHaveAttribute('label');
				expect(calendarButton).toBeInTheDocument();
			});
		});

		it('should be in the tab order', async () => {
			const user = userEvent.setup();
			render(
				createDateTimePicker({
					datePickerProps: { shouldShowCalendarButton: true, openCalendarLabel },
				}),
			);

			const calendarButton = screen.getByTestId(/open-calendar-button/);
			// Tab into the picker, close the calendar, tab to the calendar button
			await user.tab();
			await user.keyboard('{Escape}');
			await user.tab();

			expect(calendarButton).toHaveFocus();
		});
	});
});
