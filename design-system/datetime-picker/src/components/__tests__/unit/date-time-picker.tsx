import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';

import Select, { type OptionsType } from '@atlaskit/select';

import {
	datePickerDefaultAriaLabel,
	DateTimePickerWithoutAnalytics as DateTimePicker,
	timePickerDefaultAriaLabel,
} from '../../date-time-picker';

jest.mock('@atlaskit/select', () => {
	const actual = jest.requireActual('@atlaskit/select');

	return {
		__esModule: true,
		...actual,
		default: jest.fn(),
	};
});

describe('DateTimePicker', () => {
	const firePickerEvent = {
		// We can't convert these to userEvent at this point. Unsure of why, but not
		// worth figuring out at the moment.
		changeDate(testId: string, value: string) {
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
		focusDate(testId: string) {
			const select = screen.getByTestId(`${testId}--datepicker--select`);
			fireEvent.focus(select);
		},
		blurDate(testId: string) {
			const select = screen.getByTestId(`${testId}--datepicker--select`);
			fireEvent.blur(select);
		},
		async changeTime(testId: string, value: string, user: UserEvent) {
			const select = screen.getByTestId(`${testId}--timepicker--select`);
			await user.selectOptions(select, value);
		},
		focusTime(testId: string) {
			const select = screen.getByTestId(`${testId}--timepicker--select`);
			fireEvent.focus(select);
		},
		blurTime(testId: string) {
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

	it('should use custom parseValue when accessing state', () => {
		const testId = 'test';
		const onChange = jest.fn();
		const dateValue = new Date('05/02/2018').toISOString();
		const customParseValue = jest.fn().mockImplementation(() => ({
			dateValue,
			timeValue: '08:30',
			zoneValue: '+0800',
		}));

		render(
			<DateTimePicker
				defaultValue="2018-05-02"
				parseValue={customParseValue}
				onChange={onChange}
				testId={testId}
			/>,
		);

		expect(customParseValue).toHaveBeenCalledWith('2018-05-02', '', '', '');

		firePickerEvent.changeDate(testId, '06/08/2018');

		expect(customParseValue).toHaveBeenCalledWith(
			'2018-06-08T08:30+0800',
			'2018-06-08',
			'08:30',
			'+0800',
		);

		expect(onChange).toHaveBeenCalledWith('2018-06-08T08:30+0800');
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('should not parse the date time value into the specified timezone', () => {
		const testId = 'test';
		const onChange = jest.fn();
		render(
			<DateTimePicker value="2018-05-02T08:00:00.000+0800" onChange={onChange} testId={testId} />,
		);

		firePickerEvent.changeDate(testId, '02/05/2018');

		expect(onChange).toHaveBeenCalledWith('2018-02-05T00:00+0000');
	});

	it('should only be fired onChange when a valid date is supplied', async () => {
		const user = userEvent.setup();
		const testId = 'test';
		const onChange = jest.fn();
		render(<DateTimePicker onChange={onChange} testId={testId} />);

		firePickerEvent.changeDate(testId, '2018/05/02');
		expect(onChange).not.toHaveBeenCalled();

		await firePickerEvent.changeTime(testId, '10:30', user);
		// iso will use current date (build/configs/jest-config/setup/setup-dates.js)
		// because we triggered date change in incorrect format.
		expect(onChange).toHaveBeenCalledWith('2017-08-16T10:30+0000');

		onChange.mockClear();
		firePickerEvent.changeDate(testId, '02/05/2018');
		// iso will use updated date because we triggered date change in correct format.
		expect(onChange).toHaveBeenCalledWith('2018-02-05T10:30+0000');
	});

	it('should call onChange with the date, time and zone offset in the correct format', async () => {
		const user = userEvent.setup();
		const testId = 'test';
		const zoneValue = '+0800';
		const customParseValue = jest.fn().mockImplementation((_value, date, time, _zone) => {
			return {
				dateValue: date,
				timeValue: time,
				zoneValue: date && time ? zoneValue : '',
			};
		});
		const onChange = jest.fn();

		render(<DateTimePicker onChange={onChange} parseValue={customParseValue} testId={testId} />);

		firePickerEvent.changeDate(testId, '05/02/2018');
		await firePickerEvent.changeTime(testId, '10:30', user);

		expect(onChange).toHaveBeenCalledWith(`2018-05-02T10:30${zoneValue}`);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('fires onChange with empty string when the time is cleared, and there is a datetime value', async () => {
		const user = userEvent.setup();
		const testId = 'test';
		const onChange = jest.fn();
		const dateTimeValue = '2018-05-02T08:00:00.000+0800';

		render(<DateTimePicker value={dateTimeValue} onChange={onChange} testId={testId} />);

		await firePickerEvent.changeTime(testId, '', user);

		expect(onChange).toHaveBeenCalledWith('');
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('fires onChange with empty string when the time is cleared, and there is a default datetime value', async () => {
		const user = userEvent.setup();
		const testId = 'test';
		const onChange = jest.fn();
		const dateTimeValue = '2018-05-02T08:00:00.000+0800';

		render(<DateTimePicker defaultValue={dateTimeValue} onChange={onChange} testId={testId} />);

		await firePickerEvent.changeTime(testId, '', user);

		expect(onChange).toHaveBeenCalledWith('');
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('should not fire onChange when the date or time is cleared, but there is no datetime value', async () => {
		const user = userEvent.setup();
		const testId = 'test';
		const onChange = jest.fn();

		render(<DateTimePicker onChange={onChange} testId={testId} />);

		firePickerEvent.changeDate(testId, '');
		await firePickerEvent.changeTime(testId, '', user);

		expect(onChange).not.toHaveBeenCalled();
	});

	it('should fire onFocus prop when datepicker is focused', () => {
		const testId = 'test';
		const onFocus = jest.fn();
		render(<DateTimePicker onFocus={onFocus} testId={testId} />);

		firePickerEvent.focusDate(testId);

		expect(onFocus).toHaveBeenCalled();
	});

	it('should fire onBlur prop when datepicker is blurred', () => {
		const testId = 'test';
		const onBlur = jest.fn();
		render(<DateTimePicker onBlur={onBlur} testId={testId} />);

		firePickerEvent.blurDate(testId);

		expect(onBlur).toHaveBeenCalled();
	});

	it('should fire onFocus prop when timepicker is focused', () => {
		const testId = 'test';
		const onFocus = jest.fn();
		render(<DateTimePicker onFocus={onFocus} testId={testId} />);

		firePickerEvent.focusTime(testId);

		expect(onFocus).toHaveBeenCalled();
	});

	it('should fire onBlur prop when timepicker is blurred', () => {
		const testId = 'test';
		const onBlur = jest.fn();
		render(<DateTimePicker onBlur={onBlur} testId={testId} />);

		firePickerEvent.blurTime(testId);

		expect(onBlur).toHaveBeenCalled();
	});

	it('should fire onClear event when cleared', async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		const dateTimeValue = '2018-05-02T08:00:00.000+0800';

		render(<DateTimePicker value={dateTimeValue} onChange={onChange} />);

		const clearButton = screen.getByRole('button');
		await user.click(clearButton);

		expect(onChange).toHaveBeenCalledWith('');
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('should have a clear button with a tabindex of -1', () => {
		const dateTimeValue = '2018-05-02T08:00:00.000+0800';

		render(<DateTimePicker value={dateTimeValue} />);

		const button = screen.getByRole('button');

		expect(button).toHaveProperty('tagName', 'BUTTON');
		expect(button).toHaveAttribute('tabindex', '-1');
	});

	it('should never apply an ID to the hidden input', () => {
		const id = 'test';
		const testId = 'testId';
		const allImplementations = [
			<DateTimePicker testId={testId} />,
			<DateTimePicker testId={testId} id={id} />,
		];

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
		const testId = 'test';
		const datePickerTestId = `${testId}--datepicker--select`;
		const timePickerTestId = `${testId}--timepicker--select`;

		it('should have a default aria-label on the internal DatePicker and TimePicker', () => {
			render(<DateTimePicker testId={testId} />);

			const datePicker = screen.getByTestId(datePickerTestId);
			const timePicker = screen.getByTestId(timePickerTestId);

			expect(datePicker).toHaveAttribute('aria-label', datePickerDefaultAriaLabel);
			expect(timePicker).toHaveAttribute('aria-label', timePickerDefaultAriaLabel);
		});

		it('should not use the default aria-label on the internal date picker if `label` prop is provided by [date|time]PickerProps', () => {
			render(
				<DateTimePicker
					datePickerProps={{ label: label }}
					timePickerProps={{ label: label }}
					testId={testId}
				/>,
			);

			const datePicker = screen.getByTestId(datePickerTestId);
			const timePicker = screen.getByTestId(timePickerTestId);

			expect(datePicker).toHaveAttribute('aria-label', label);
			expect(timePicker).toHaveAttribute('aria-label', label);

			// Make sure the default labels are not used anywhere
			expect(screen.queryByLabelText('Date')).not.toBeInTheDocument();
			expect(screen.queryByLabelText('Time')).not.toBeInTheDocument();
		});

		it('should add aria-describedby when prop is supplied', () => {
			const describedBy = 'description';
			render(<DateTimePicker aria-describedby={describedBy} testId={testId} />);

			const datePicker = screen.getByTestId(datePickerTestId);
			expect(datePicker).toHaveAttribute('aria-describedby', describedBy);
			const timePicker = screen.getByTestId(timePickerTestId);
			expect(timePicker).toHaveAttribute('aria-describedby', describedBy);
		});
	});
});
