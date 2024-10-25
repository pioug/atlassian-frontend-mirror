import React, { useState } from 'react';

import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { Box, Text } from '@atlaskit/primitives';
import TextField from '@atlaskit/textfield';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

const dateId = 'datepicker-input';
const timeId = 'timepicker-input';
const datetimeId = 'datetimepicker-input';

export default () => {
	const [datePickerValue, setDatePickerValue] = useState<string>('2018-01-02');
	const [datePickerInput, setDatePickerInput] = useState<string>('2018-01-02');
	const [timePickerValue, setTimePickerValue] = useState<string>('14:30');
	const [timePickerInput, setTimePickerInput] = useState<string>('14:30');
	const [dateTimePickerValue, setDateTimePickerValue] = useState<string>('2018-01-02T14:30+11:00');
	const [dateTimePickerInput, setDateTimePickerInput] = useState<string>('2018-01-02T14:30+11:00');

	const handleOnBlur = () => {
		setDatePickerValue(datePickerInput);
		setTimePickerValue(timePickerInput);
		setDateTimePickerValue(dateTimePickerInput);
	};

	const handleDatePickerChange = (e: any) => {
		setDatePickerInput(e.target.value);
	};

	const handleTimePickerChange = (e: any) => {
		setTimePickerInput(e.target.value);
	};

	const handleDateTimePickerChange = (e: any) => {
		setDateTimePickerInput(e.target.value);
	};

	return (
		<Box>
			<Text as="p">This demonstrates updating each pickers value via an external source.</Text>

			<Box paddingBlock="space.150">
				<Heading size="large">Date picker</Heading>
				<Label htmlFor="date-picker-override">Datepicker textfield input</Label>
				<TextField
					id="date-picker-override"
					value={datePickerInput}
					onBlur={handleOnBlur}
					onChange={handleDatePickerChange}
				/>
				<Label id="date" htmlFor={dateId}>
					Date
				</Label>
				<DatePicker
					value={datePickerValue}
					isDisabled
					onChange={console.log}
					id={dateId}
					shouldShowCalendarButton
					inputLabelId="date"
					openCalendarLabel="open calendar"
				/>
			</Box>
			<Box paddingBlock="space.150">
				<Heading size="large">Time picker</Heading>
				<Label htmlFor="time-picker-override">Timepicker textfield input</Label>
				<TextField
					id="time-picker-override"
					value={timePickerInput}
					onBlur={handleOnBlur}
					onChange={handleTimePickerChange}
				/>

				<Label htmlFor={timeId}>Time</Label>
				<TimePicker
					clearControlLabel="Clear time"
					value={timePickerValue}
					isDisabled
					onChange={console.log}
					id={timeId}
				/>
			</Box>
			<Box paddingBlock="space.150">
				<Heading size="large">Datetime picker</Heading>
				<Label htmlFor="datetime-picker-override">Datetime picker textfield input</Label>
				<TextField
					id="datetime-picker-override"
					value={dateTimePickerInput}
					onBlur={handleOnBlur}
					onChange={handleDateTimePickerChange}
				/>

				<Label htmlFor={datetimeId}>Date / time</Label>
				<DateTimePicker
					clearControlLabel="Clear date / time"
					value={dateTimePickerValue}
					isDisabled
					onChange={console.log}
					id={datetimeId}
					datePickerProps={{
						label: 'Date, Date / time',
						shouldShowCalendarButton: true,
						openCalendarLabel: 'open calendar',
					}}
					timePickerProps={{ label: 'Time, Date / time' }}
				/>
			</Box>
		</Box>
	);
};
