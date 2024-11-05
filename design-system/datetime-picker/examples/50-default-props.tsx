import React from 'react';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
	return (
		<Box>
			<Label id="default" htmlFor="react-select-date--input">
				DatePicker defaultValue defaultIsOpen
			</Label>
			<DatePicker
				id="react-select-date--input"
				clearControlLabel="Clear datePicker defaultValue defaultIsOpen"
				defaultValue="2018-03-01"
				defaultIsOpen
				onChange={console.log}
				shouldShowCalendarButton
				inputLabelId="default"
				openCalendarLabel="open calendar"
			/>

			<Label htmlFor="react-select-time--input">TimePicker defaultValue defaultIsOpen</Label>
			<TimePicker
				clearControlLabel="Clear timePicker defaultValue defaultIsOpen"
				id="react-select-time--input"
				defaultValue="10:00am"
				defaultIsOpen
				onChange={console.log}
			/>

			<Label htmlFor="react-select-date-time--input">DateTimePicker defaultValue</Label>
			<DateTimePicker
				id="react-select-date-time--input"
				defaultValue="2018-01-02T14:30-08:00"
				onChange={console.log}
				datePickerProps={{
					label: 'DateTimePicker defaultValue, date',
					shouldShowCalendarButton: true,
					openCalendarLabel: 'open calendar',
				}}
				timePickerProps={{ label: 'DateTimePicker defaultValue, time' }}
			/>
		</Box>
	);
};
